// Конфигурация
import { config, images, superSprites } from './config';

// Модули и утилиты
import { BlastEngine } from './BlastEngine';
import { GameField } from './GameField';
import { Screen } from '../framework/engine/Screen';
import { ImageLoader } from '../tools/ImageLoader';
import { SpriteSplitter } from '../tools/SpriteSplitter';
import { TileFactory } from '../../utilities/TileFactory';

// Сцены
import { MainScene } from './scenes/MainScene';
import { PreloaderScene } from './scenes/PreloaderScene';
import { StartScene } from './scenes/StartScene';
import { WinScene } from './scenes/WinScene';
import { LoseScene } from './scenes/LoseScene';

// Анимации
import { fade } from '../../utilities/Animations';
import { move } from '../../utilities/Animations';

export class Game
{
    constructor(holder)
    {
        // Создаём необходимые сущности
        this.screen = new Screen(holder, config.screenWidth, config.screenHeight);
        this.gameLogic = new BlastEngine(config.cellsX, config.cellsY, config.variety, config.minGroup, config.superGroup);
        this.assets = new ImageLoader(images);
        this.superSprites = new ImageLoader(superSprites)
        this.tiles = new SpriteSplitter();

        this.preloaderScene = new PreloaderScene(this);

        this.sprites = [];

        // Включаем сцену прелоадера.
        // Она текстовая и не требует ассетов, поэтому может быть включена сразу
        this.screen.setScene(this.preloaderScene);
        this.screen.renderEngineStart();                // Стартуем движок

        // Начинаем загрузку ассетов
        Promise.all([
            this.assets.load(),
            this.superSprites.load()
        ])
        .then(() => {
            this.tiles.init(this.assets.images.tileBlock, 5);
            this.tiles.split()
                .then(() => {
                    this.sprites = this.tiles.images;                       // Массив перекрашенных спрайтов тайлов
                    setTimeout(() => this.init(), config.preloaderDelay);   // Вызов инициализации с задержкой
                });
        })
        .catch(err => console.log(err));
    }

    init()
    {
        this.mainScene = new MainScene(this);
        this.startScene = new StartScene(this);
        this.winScene = new WinScene(this);
        this.loseScene = new LoseScene(this);

        this.gameField = new GameField(this.gameLogic, this.mainScene.collection.grid, this.sprites, () => this.tileClickHandler());
        
        // Объект для хранения состояния игры
        this.state = {
            isPressed: false,           // Флаг нажатия на тайл
            isRemoving: false,          // Флаг "удаление в процессе"
            isMoving: false,            // Флаг "перемещение в процессе"
            isShuffling: false,         // Флаг "перемешивание в процессе"
            isBoosted: false,           // Флаг включения бустера
            isSupercell: false,         // Флаг "супер-клетка"
            address: undefined,         // Адрес ячейки, содержащей сущность
            group: [],                  // Выбранная группа ячеек (адреса/ссылки сущностей)
            changes: undefined,         // Сместившаяся группа (адреса/ссылки сущностей)
            moves: config.movesLimit,   // Оставшееся количество ходов
            movesAvailable: 0,          // Доступное количество ходов
            score: 0,                   // Количество очков
            shuffles: config.shuffles,  // Оставшееся количество перемешиваний
            boosters: config.boosters,  // Оставшееся количество бустеров
            progress: 0                 // Прогресс
        }

        this.screen.setScene(this.startScene);      // Включаем сцену стартового меню
        this.screen.clearTasks();                   // Чистим очередь задач в движке
        this.mainScene.init();                      // Инициализируем основную сцену
        this.screen.addTask(() => this.loop());     // Добавляем циклический вызов функции игрового цикла
    }

    // Обработчик события клика по тайлу
    tileClickHandler()
    {
        return target => {
            this.state.isPressed = true;     // Выставляем флаг нажатия
            this.state.address = this.mainScene.collection.grid.getInstanceAddress(target);  // Получаем адрес тайла в сетке
        }
    }

    // Обработчик события клика по кнопке "Играть ещё"
    replayClickHandler()
    {
        return target => {
            this.init();
            this.mainScene.uiUnlock();
            this.screen.setScene(this.mainScene);
        }
    }

    loop()
    {
        this.gameField.refill();                    // Пробуем дозаполнить сетку тайлами
        // >>> Этап 1 - нажатие на тайл
        if (this.state.isPressed)
        {
            // Получаем группу адресов ячеек на удаление
            this.state.group = this.gameField.getGroup(this.state);
            this.state.isSupercell = this.gameLogic.isSupercell(this.state.address.x, this.state.address.y);
            if (this.state.isBoosted)
                this.state.boosters--;

            if (this.state.group.length < config.minGroup && !this.state.isBoosted) // Ограничение на минимальную группу тайлов
            {
                this.state.isPressed = false;
                return;
            }
            
            this.mainScene.uiLock();   // Блокируем интерфейс
            
            // Для каждого адреса из группы на удаление ищем тайл и применяем анимацию исчезновения
            this.state.group.forEach(cell => cell.addSerialTask(fade(1, 0.4, 1, 2)));
            this.state.isPressed = false;    // Снимаем флаг нажатия на тайл
            this.state.isRemoving = true;    // Выставляем флаг ожидания удаления
            this.state.moves--;              // Декрементим количество оставшихся ходов

            this.state.score += Math.pow(this.state.group.length, 2);
        }

        // >>> Этап 2 - удаление группы тайлов
        if (this.state.isRemoving)
        {
            this.state.isRemoving = this.gameField.removeGroup(this.state.group);

            // Если анимации завершены
            if (!this.state.isRemoving)
            {
                this.gameLogic.collapse();                    // Инициируем смещение клеток
                this.state.changes = this.gameLogic.getChanges();  // Получаем список сместившихся клеток
                // Применяем анимацию смещения
                this.state.changes = this.state.changes.map(change => {
                    const cell = this.mainScene.collection.grid.getCell(change.dx, change.dy);
                    let loc = this.mainScene.collection.grid.getCellLocation(change.x, change.y);
                    cell.instance.addSerialTask(move(loc.x, loc.y, 100, 300));
                    cell.updateX = change.x;        // Задём координаты
                    cell.updateY = change.y;        // для обновления
                    return cell;
                });
                this.state.isMoving = true;              // Переходим на этап перемещения
            }
        }

        // >>> Этап 3 - перемещение тайлов
        else if (this.state.isMoving)
        {
            this.state.isMoving = false;                 // Пробуем очистить состояние

            // Если хоть одна анимация не завершена - возвращаемся на прошлый шаг
            this.state.changes.forEach(element => {
                if(element.instance.getSerialQueueSize() > 0)
                    this.state.isMoving = true;
            });

            if (!this.state.isMoving)
            {
                this.mainScene.collection.grid.updateItems();       // Обновляем координаты элементов в сетке
                // const refilment = this.gameField.refill();          // Заполняем пустые ячейки, получаем массив новых ячеек
                this.state.progress = this.state.score / config.scoreToWin;             // Обновляем прогресс
                
                // Обработка ситуации проигрыша/выигрыша по очкам и ходам
                if (this.state.score >= config.scoreToWin)
                    this.screen.setScene(this.winScene);
                else if (this.state.moves == 0)
                    this.screen.setScene(this.loseScene);
                else
                {
                    this.gameLogic.fixChanges();                            // Уравниваем текущие координаты с новыми
                    const moves = this.gameLogic.getMoves();                // Пересчитываем доступные ходы
                    this.state.movesAvailable =  this.gameLogic.getMoves(); // Определяем оставшиеся ходы

                    // Обработка ситуации появления "супер-тайла"
                    if (this.state.group.length >= config.superGroup && !this.state.isBoosted && !this.state.isSupercell && !this.state.isShuffling)
                    {
                        this.gameLogic.setSuperCell(this.state.address.x, this.state.address.y);
                        const sCell = this.mainScene.collection.grid.getCell(this.state.address.x, this.state.address.y).instance;
                        sCell.setBackgroundImage(this.superSprites.images.blue);
                        sCell.scaleOnBackgroundWidth(sCell.getSize().width);
                        sCell.setAnchor(0, 0);
                    }

                    // Обработка ситуации проигрыша по отсутствию ходов и бустеров
                    if (!this.state.shuffles && !this.state.boosters && !moves)
                        this.mainScene.collection.bannerLabel.setText('Вы проиграли');

                    // Сброс флагов
                    this.state.isBoosted = false;
                    this.mainScene.collection.boosterButton.reset();
                    this.state.isShuffling = false;

                    // Разблокировка интерфейса
                    this.mainScene.uiUnlock();
                }
            }
        }

        // Перемешивание поля
        if (this.state.isShuffling && !this.state.isMoving)
        {            
            this.mainScene.uiLock();                        // Блокируем интерфейс
            this.state.changes = this.gameField.shuffle();  // Перемешиваем поле и получаем изменения
            this.state.isMoving = true;                     // Идём на этап перемещения
        }
        this.mainScene.updateStats();   // Обновляем значения элементов индикации
    }
}