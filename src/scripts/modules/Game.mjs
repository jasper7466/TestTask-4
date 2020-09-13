// Конфигурация
import { config } from '../config';
import { images } from '../config';

// Модули и утилиты
import { BlastEngine } from './BlastEngine';
import { Screen } from './Screen';
import { ImageLoader } from './ImageLoader';
import { SpriteSplitter } from './SpriteSplitter';
import { TileFactory } from '../utilities/TileFactory';

// Сцены
import { MainScene } from '../scenes/MainScene';

// Анимации
import { fade } from '../utilities/Animations';
import { move } from '../utilities/Animations';
import { blink } from '../utilities/Animations';

export class Game
{
    constructor(holder)
    {
        // Создаём необходимые сущности
        this.screen = new Screen(holder, config.screenWidth, config.screenHeight);
        this.game = new BlastEngine(config.cellsX, config.cellsY, config.variety, config.minGroup, config.superGroup);
        this.gameScene = new MainScene(this);
        this.assets = new ImageLoader(images);
        this.tiles = new SpriteSplitter();

        this.sprites = [];

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
            boosters: config.boosters   // Оставшееся количество бустеров
        }

        this.assets.load()
        .then(() => {
            this.tiles.init(this.assets.images.tileBlock, 5);
            this.tiles.split()
                .then(() => {
                    this.sprites = this.tiles.images;     // Массив перекрашенных спрайтов тайлов
                    this.init();                // Вызов инициализации
                });
        })
        .catch(err => console.log(err));
    }

    init()
    {
        this.gameScene.init();
        // Заполняем сетку тайлами
        for (let x = 0; x < config.cellsX; x++)
        {
            for(let y = 0; y < config.cellsY; y++)
            {
                const tile = TileFactory(this.sprites, this.game.getCell(x, y).type);   // Создаём тайл
                tile.setClickHandler(this.tileClickHandler(this.state));                // Вешаем обработчик события "клик"
                this.gameScene.collection.grid.addItem(tile, x, y);                     // Помещаем в узел сетки
            }
        }

        this.screen.setBackgroundImage(this.assets.images.background);

        // Добавляем сцены в движок
        this.screen.addLayer(this.gameScene);

        // Добавляем циклический вызов функции игрового цикла и запускаем движок
        this.screen.addTask(() => this.loop());
        this.screen.renderEngineStart();
    }

    // Обработчик события клика по тайлу
    tileClickHandler()
    {
        return target => {
             this.state.isPressed = true;     // Выставляем флаг нажатия
             this.state.target = target;      // Указываем ссылку на сущность
        }
    }

    // Обработчик события клика по кнопке "Пауза"
    pauseClickHandler()
    {
        return target => {
            if (target.getState())
            {
                this.gameScene.collection.bannerLabel.setText('Пауза');
                this.uiLock();
            }
            else
            {
                this.gameScene.collection.bannerLabel.setText('');
                this.uiUnlock();
            }
        }
    }

    // Обработчик события клика по кнопке "Бустер"
    boosterClickHandler()
    {
        return target => {
            if (target.getState() &&  this.state.boosters > 0)
                 this.state.isBoosted = true;
            else
                 this.state.isBoosted = false;
        }
    }

    // Обработчик события клика по кнопке "Перемешать"
    shuffleClickHandler()
    {
        return target => {
            if (this.state.shuffles == 0)
                return;
            this.state.shuffles--;
            target.setText(`Перемешать (x${this.state.shuffles})`);
            this.state.isShuffling = true;
            
        }
    }

    // Блокировка пользовательского интерфейса
    uiLock()
    {
        this.gameScene.collection.grid.stopEventPropagation();    // Блокируем распространение событий на поле
        this.gameScene.collection.shuffleButton.disableEvents(); // Блокируем события кнопки "Перемешать"
        this.gameScene.collection.boosterButton.disableEvents(); // Блокируем события кнопки "Бустер"
    }

    // Разблокировка пользовательского интерфейса
    uiUnlock()
    {
        this.gameScene.collection.grid.allowEventPropagation();   // Разрешаем распространение событий на поле
        this.gameScene.collection.shuffleButton.enableEvents();  // Разрешаем события кнопки "Перемешать"
        if (this.state.boosters > 0)
            this.gameScene.collection.boosterButton.enableEvents();  // Разрешаем события кнопки "Бустер"
    }

    loop()
    {
        // >>> Этап 1 - нажатие на тайл
        if (this.state.isPressed)
        {
            this.state.address = this.gameScene.collection.grid.getInstanceAddress(this.state.target);          // Получаем адрес тайла в сетке

            // Получаем группу адресов ячеек на удаление
            if (this.state.isBoosted)                                // Если включен режим "Бустер"
            {
                this.state.group = this.game.getRadius(this.state.address.x, this.state.address.y, config.boostR);
                this.state.boosters--;
                this.gameScene.collection.boosterButton.setText(`Бустер (x${ this.state.boosters})`);
            }
            else                                                // Если обычный тайл или "супер-тайл"
            {
                this.state.supercell = this.game.isSupercell(this.state.address.x, this.state.address.y);
                this.state.group = this.game.getGroup(this.state.address.x, this.state.address.y);
            }

            if (this.state.group.length < config.minGroup)                  // Ограничение на минимальную группу тайлов
            {
                this.state.isPressed = false;
                return;
            }

            this.uiLock();   // Блокируем интерфейс
            this.state.group = this.state.group.map(element => this.gameScene.collection.grid.getCell(element.x, element.y));   // Получаем ячейки

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
                    this.gameScene.collection.grid.removeItem(element.instance);  // Если анимация завершена - удаляем элемент из сетки
            });

            // Если анимации завершены
            if (!this.state.isRemoving)
            {
                this.game.collapse();                    // Инициируем смещение клеток
                this.state.changes = this.game.getChanges();  // Получаем список сместившихся клеток
                // Применяем анимацию смещения
                this.state.changes = this.state.changes.map(change => {
                    const cell = this.gameScene.collection.grid.getCell(change.dx, change.dy);
                    let loc = this.gameScene.collection.grid.getCellLocation(change.x, change.y);
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
                this.gameScene.collection.grid.updateItems();                     // Обновляем координаты элементов в сетке
                const refilment = this.game.randomFill();    // Заполняем пустые ячейки, получаем массив новых ячеек

                refilment.forEach(cell => {
                    const tile = TileFactory(this.sprites, cell.type);               // Создаём тайл
                    tile.setClickHandler(this.tileClickHandler(this.state));          // Вешаем обработчик события "клик"
                    this.gameScene.collection.grid.addItem(tile, cell.x, cell.y);                         // Помещаем в узел сетки
                });
                this.gameScene.collection.movesLabel.setText( this.state.moves);           // Выводим количество оставшихся шагов,
                this.gameScene.collection.scoreLabel.setText(this.state.score);               // очков
                this.gameScene.collection.progress.setProgress(this.state.score / config.scoreToWin); // и обновляем прогресс
                
                // Обработка ситуации проигрыша/выигрыша по очкам и ходам
                if (this.state.score >= config.scoreToWin)
                    this.gameScene.collection.bannerLabel.setText('Вы победили');
                else if (this.state.moves == 0)
                    this.gameScene.collection.bannerLabel.setText('Вы проиграли');
                else
                {
                    this.game.fixChanges();                  // Уравниваем текущие координаты с новыми
                    const moves = this.game.getMoves();      // Пересчитываем доступные ходы
                    this.gameScene.collection.groupsLabel.setText(`Доступно ходов: ${this.game.getMoves()}`);

                    // Обработка ситуации появления "супер-тайла"
                    if (this.state.group.length >= config.superGroup && !this.state.isBoosted && !this.state.supercell && !this.state.isShuffling)
                    {
                        this.game.setSuperCell(this.state.address.x, this.state.address.y);
                        this.gameScene.collection.grid.getCell(this.state.address.x, this.state.address.y).instance.addParallelTask(blink(20));
                    }

                    // Обработка ситуации проигрыша по отсуттсвию ходов и бустеров
                    if (!this.state.shuffles && !this.state.boosters && !moves)
                        this.gameScene.collection.bannerLabel.setText('Вы проиграли');

                    // Сброс флагов
                    this.state.isBoosted = false;
                    this.gameScene.collection.boosterButton.reset();
                    this.state.isShuffling = false;

                    // Разблокировка интерфейса
                    this.uiUnlock()
                }
            }
        }

        // Перемешивание поля
        if (this.state.isShuffling && !this.state.isMoving)
        {            
            this.uiLock();                       // Блокируем интерфейс
            this.game.shuffle();                 // Перемешиваем поле
            this.state.changes = [];             // Очищаем массив с изменёнными ячейками
            this.game._field.forEach(cell => {
                const tile = this.gameScene.collection.grid.getCell(cell.dx, cell.dy);                // Получаем ячейку
                let loc = this.gameScene.collection.grid.getCellLocation(cell.x, cell.y);             // Получаем новые координаты
                tile.instance.addSerialTask(move(loc.x, loc.y, 100, 300));  // Запускаем анимацию перемещения
                tile.updateX = cell.x;                                      // Задём координаты
                tile.updateY = cell.y;                                      // для обновления
                this.state.changes.push(tile);
            });
            this.state.isMoving = true;          // Идём на этап перемещения
        }
    }
}