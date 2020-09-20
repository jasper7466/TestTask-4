// Конфигурация
import { config, images, superSprites } from './config';

// Модули и утилиты
import { BlastEngine } from './BlastEngine';
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
        this.field = new BlastEngine(config.cellsX, config.cellsY, config.variety, config.minGroup, config.superGroup);
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
        
        // Объект для хранения состояния игры
        this.state = {
            isPressed: false,           // Флаг нажатия на тайл
            isRemoving: false,          // Флаг "удаление в процессе"
            isMoving: false,            // Флаг "перемещение в процессе"
            isShuffling: false,         // Флаг "перемешивание в процессе"
            isBoosted: false,           // Флаг включения бустера
            isSupercell: false,         // Флаг "супер-клетка"
            target: undefined,          // Сущность, на которой произошло событие нажатия
            address: undefined,         // Адрес ячейки, содержащей сущность
            group: [],                  // Выбранная группа ячеек (адреса/ссылки сущностей)
            changes: undefined,         // Сместившаяся группа (адреса/ссылки сущностей)
            moves: config.movesLimit,   // Оставшееся количество ходов
            score: 0,                   // Количество очков
            shuffles: config.shuffles,  // Оставшееся количество перемешиваний
            boosters: config.boosters,  // Оставшееся количество бустеров
            progress: 0                 // Прогресс
        }

        this.field.init();
        
        // Заполняем сетку тайлами
        this.field.getField().forEach(cell => {
            const tile = TileFactory(this.sprites, this.field.getCell(cell.x, cell.y).type);    // Создаём тайл
            tile.setClickHandler(this.mainScene.tileClickHandler());                            // Вешаем обработчик события "клик"
            this.mainScene.collection.grid.addItem(tile, cell.x, cell.y);                       // Помещаем в узел сетки
        });

        // Добавляем сцены в движок
        this.screen.setScene(this.startScene);

        // Добавляем циклический вызов функции игрового цикла
        this.screen.clearTasks();
        this.screen.addTask(() => this.loop());
    }

    // Обработчик события клика по кнопке "Старт"
    startClickHandler()
    {
        return target => {
            this.screen.setScene(this.mainScene);
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
        // >>> Этап 1 - нажатие на тайл
        if (this.state.isPressed)
        {
            this.state.address = this.mainScene.collection.grid.getInstanceAddress(this.state.target);          // Получаем адрес тайла в сетке

            // Получаем группу адресов ячеек на удаление
            if (this.state.isBoosted)                                // Если включен режим "Бустер"
            {
                this.state.group = this.field.getRadius(this.state.address.x, this.state.address.y, config.boostR);
                this.state.boosters--;
                this.mainScene.collection.boosterButton.setText(`Бустер (x${ this.state.boosters})`);
            }
            else                                                // Если обычный тайл или "супер-тайл"
            {
                this.state.supercell = this.field.isSupercell(this.state.address.x, this.state.address.y);
                this.state.group = this.field.getGroup(this.state.address.x, this.state.address.y);
            }

            if (this.state.group.length < config.minGroup)                  // Ограничение на минимальную группу тайлов
            {
                this.state.isPressed = false;
                return;
            }

            this.mainScene.uiLock();   // Блокируем интерфейс
            this.state.group = this.state.group.map(element => this.mainScene.collection.grid.getCell(element.x, element.y));   // Получаем ячейки

            // Для каждого адреса из группы на удаление ищем тайл и применяем анимацию исчезновения
            this.state.group.forEach(cell => cell.instance.addSerialTask(fade(1, 0.4, 1, 2)));
            this.state.isPressed = false;    // Снимаем флаг нажатия на тайл
            this.state.isRemoving = true;    // Выставляем флаг ожидания удаления
            this.state.moves--;              // Декрементим количество оставшихся ходов

            this.state.score += Math.pow(this.state.group.length, 2);
        }

        // >>> Этап 2 - удаление группы тайлов
        if (this.state.isRemoving)
        {
            this.state.isRemoving = false;               // Пробуем перейти на следующий шаг

            // Если хоть одна анимация не завершена - возвращаемся на прошлый шаг
            this.state.group.forEach(element => {
                if (element.instance.getSerialQueueSize() > 0)
                    this.state.isRemoving = true;
                else
                    this.mainScene.collection.grid.removeItem(element.instance);  // Если анимация завершена - удаляем элемент из сетки
            });

            // Если анимации завершены
            if (!this.state.isRemoving)
            {
                this.field.collapse();                    // Инициируем смещение клеток
                this.state.changes = this.field.getChanges();  // Получаем список сместившихся клеток
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
                this.mainScene.collection.grid.updateItems();                     // Обновляем координаты элементов в сетке
                const refilment = this.field.randomFill();    // Заполняем пустые ячейки, получаем массив новых ячеек

                refilment.forEach(cell => {
                    const tile = TileFactory(this.sprites, cell.type);                  // Создаём тайл
                    tile.setClickHandler(this.mainScene.tileClickHandler());            // Вешаем обработчик события "клик"
                    this.mainScene.collection.grid.addItem(tile, cell.x, cell.y);       // Помещаем в узел сетки
                    let loc = this.mainScene.collection.grid.getCellLocation(cell.x, cell.y);
                    tile.setY(-100 - cell.y * this.mainScene.collection.grid._stepY);           // FIXME:
                    tile.addSerialTask(move(loc.x, loc.y, 100, 600));
                });
                this.state.progress = this.state.score / config.scoreToWin;             // Обновляем прогресс
                this.mainScene.updateStats() ;
                
                // Обработка ситуации проигрыша/выигрыша по очкам и ходам
                if (this.state.score >= config.scoreToWin)
                    this.screen.setScene(this.winScene);
                else if (this.state.moves == 0)
                    this.screen.setScene(this.loseScene);
                else
                {
                    this.field.fixChanges();                  // Уравниваем текущие координаты с новыми
                    const moves = this.field.getMoves();      // Пересчитываем доступные ходы
                    this.mainScene.collection.groupsLabel.setText(`Доступно ходов: ${this.field.getMoves()}`);

                    // Обработка ситуации появления "супер-тайла"
                    if (this.state.group.length >= config.superGroup && !this.state.isBoosted && !this.state.supercell && !this.state.isShuffling)
                    {
                        this.field.setSuperCell(this.state.address.x, this.state.address.y);
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
            this.mainScene.uiLock();                       // Блокируем интерфейс
            this.field.shuffle();                 // Перемешиваем поле
            this.state.changes = [];             // Очищаем массив с изменёнными ячейками
            this.field._field.forEach(cell => {
                const tile = this.mainScene.collection.grid.getCell(cell.dx, cell.dy);                // Получаем ячейку
                let loc = this.mainScene.collection.grid.getCellLocation(cell.x, cell.y);             // Получаем новые координаты
                tile.instance.addSerialTask(move(loc.x, loc.y, 100, 300));  // Запускаем анимацию перемещения
                tile.updateX = cell.x;                                      // Задём координаты
                tile.updateY = cell.y;                                      // для обновления
                this.state.changes.push(tile);
            });
            this.state.isMoving = true;          // Идём на этап перемещения
        }
    }
}