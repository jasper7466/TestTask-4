'use strict';

// Корневой файл стилей страницы
import '../styles/index.css';

// Конфигурация
import { images } from './config';
import { config } from './config';

// Модули и утилиты общего назначения
import { Screen } from './modules/Screen.mjs';
import { Grid } from './modules/Grid.mjs';
import { BlastEngine } from './modules/BlastEngine.mjs';
import { BaseComponent } from './modules/BaseComponent.mjs';
import { Label } from './modules/Label.mjs';
import { Button } from './modules/Button.mjs';
import { ToggleButton } from './modules/ToggleButton.mjs';
import { ProgressBar } from './modules/ProgressBar.mjs';
import { ImageLoader } from './modules/ImageLoader.mjs';
import { SpriteSplitter } from './modules/SpriteSplitter.mjs';
import { TileFactory } from './utilities/TileFactory.mjs';

// Анимационные функции
import { fade } from './utilities/Animations.mjs';
import { move } from './utilities/Animations.mjs';
import { blink } from './utilities/Animations.mjs';

// Константы
const holder = document.querySelector('.main'); // Родительский узел для размещения экрана отрисовки

// Объект для хранения состояния игры
const gameState = {
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

// Переменные
let sprites = undefined;        // Будущий массив со спрайтами тайлов

// Создаём экран отрисовки, получаем контекст
const screen = new Screen(holder, config.screenWidth, config.screenHeight, '#036');
const ctx = screen.getContext();

// Создаём остальные логические/графические сущности
const grid = new Grid(ctx, config.cellsX, config.cellsY);
const game = new BlastEngine(config.cellsX, config.cellsY, config.variety, config.minGroup, config.superGroup);
const moves_caption = new Label(ctx, 30, '#FFF', 'Roboto Slab', 'Ходы:');
const moves_label = new Label(ctx, 90, '#FFF', 'Roboto Slab');
const score_caption = new Label(ctx, 30, '#FFF', 'Roboto Slab', 'Очки:');
const score_label = new Label(ctx, 50, '#FFF', 'Roboto Slab', 0);
const banner_label = new Label(ctx, 90, '#CFF', 'Roboto Slab');
const groups_label = new Label(ctx, 20, '#FFF', 'Roboto Slab');
const shuffle_button = new Button(ctx, 20, '#FFF', 'Roboto Slab', `Перемешать (x${gameState.shuffles})`);
const booster_button = new ToggleButton(ctx, 20, '#FFF', 'Roboto Slab', `Бустер (x${gameState.boosters})`);
const pause_button = new ToggleButton(ctx);
const progress = new ProgressBar(ctx);
const score_panel = new BaseComponent(ctx);
const top_panel = new BaseComponent(ctx);
const progress_panel = new BaseComponent(ctx);
const progress_label = new Label(ctx, 20, '#FFF', 'Roboto Slab', 'Прогресс');

const assets = new ImageLoader(images);
const tiles = new SpriteSplitter();

// Функция инициализации и конфигурирования игры
function init()
{
    // Игровое поле
    grid.setBackgroundImage(assets.images.field);
    grid.setSize(config.gridWidth, config.gridHeight);
    grid.setPosition(config.gridX, config.gridY);

    // Панель информации
    score_panel.setBackgroundImage(assets.images.scorePanel);
    score_panel.setAnchor(0.5, 0.5);
    score_panel.scaleOnBackgroundWidth(300);
    score_panel.setPosition(780, 300);

    // Заголовок "Ходы"
    moves_caption.setPosition(780, 160);

    // Поле вывода количества ходов
    moves_label.setBackgroundImage(assets.images.moves);
    moves_label.setAnchor(0.5, 0.7);
    moves_label.scaleOnBackgroundWidth(180);
    moves_label.setText(gameState.moves);
    moves_label.setPosition(780, 300);

    // Заголовок "Очки"
    score_caption.setPosition(780, 370);

    // Поле вывода количества очков
    score_label.setPosition(780, 410);
    
    // Поле вывода сообщений
    banner_label.setPosition(config.screenWidth / 2, config.screenHeight / 2);

    // Поле вывода количества доступных ходов
    groups_label.setPosition(150, 130);
    groups_label.setText(`Доступно ходов: ${game.getMoves()}`);

    // Кнопка "Перемешать"
    shuffle_button.setBaseImage(assets.images.buttonBase2);
    shuffle_button.setHoverImage(assets.images.buttonHover2);
    shuffle_button.setPressImage(assets.images.buttonPress2);
    shuffle_button.setPosition(780, 500);
    shuffle_button.setAnchor(0.5, 0.5);
    shuffle_button.scaleOnBackgroundWidth(200);
    shuffle_button.setSize(200, 60);
    shuffle_button.setClickHandler(shuffleClickHandler(gameState));

    // Кнопка "Бустер"
    booster_button.setBaseImage(assets.images.buttonBase2);
    booster_button.setHoverImage(assets.images.buttonHover2);
    booster_button.setPressImage(assets.images.buttonPress2);
    booster_button.setPosition(780, 570);
    booster_button.setAnchor(0.5, 0.5);
    booster_button.scaleOnBackgroundWidth(200);
    booster_button.setSize(200, 60);
    booster_button.setClickHandler(boosterClickHandler(gameState));

    // Кнопка "Пауза"
    pause_button.setBaseImage(assets.images.pauseBase);
    pause_button.setHoverImage(assets.images.pauseHover);
    pause_button.setPressImage(assets.images.pausePress);
    pause_button.setPosition(930, 50);
    pause_button.setAnchor(0.5, 0.5);
    pause_button.scaleOnBackgroundWidth(60);
    pause_button.setClickHandler(pauseClickHandler());

    // Полоса прогресса
    progress.setBackgroundImage(assets.images.barBack);
    progress.setBarImage(assets.images.bar);
    progress.setSize(300, 25);
    progress.setAnchor(0.5, 0.5);
    progress.setPosition(config.screenWidth / 2, 45);
    progress.setBorder(3);
    progress.setProgress(0);

    // Верхняя панель
    top_panel.setBackgroundImage(assets.images.topPanel);
    top_panel.setSize(700, 100);
    top_panel.setAnchor(0.5, 0);
    top_panel.setPosition(config.screenWidth / 2, 0);

    // Панель прогресса
    progress_panel.setBackgroundImage(assets.images.progressPanel);
    progress_panel.setSize(400, 70);
    progress_panel.setAnchor(0.5, 0);
    progress_panel.setPosition(config.screenWidth / 2, 0);

    // Заголовок "Прогресс"
    progress_label.setPosition(config.screenWidth / 2, 15);
    
    // Заполняем сетку тайлами
    for (let x = 0; x < config.cellsX; x++)
    {
        for(let y = 0; y < config.cellsY; y++)
        {
            const tile = TileFactory(sprites, game.getCell(x, y).type);     // Создаём тайл
            tile.setClickHandler(tileClickHandler(gameState));              // Вешаем обработчик события "клик"
            grid.addItem(tile, x, y);                                       // Помещаем в узел сетки
        }
    }

    // Добавляем элементы в очередь движка отрисовки в нужном порядке
    screen.setBackgroundImage(assets.images.background);
    screen.addLayer(grid);
    screen.addLayer(score_panel);
    screen.addLayer(moves_caption);
    screen.addLayer(moves_label);
    screen.addLayer(score_caption);
    screen.addLayer(score_label);
    screen.addLayer(groups_label);
    screen.addLayer(banner_label);
    screen.addLayer(shuffle_button);
    screen.addLayer(booster_button);
    screen.addLayer(top_panel);
    screen.addLayer(progress_panel);
    screen.addLayer(progress_label);
    screen.addLayer(progress);
    screen.addLayer(pause_button);
    
    // Добавляем циклический вызов функции игрового цикла и запускаем движок
    screen.addTask(gameLoop(gameState, grid, game, sprites));
    screen.renderEngineStart();
}

// Обработчик события клика по тайлу
const tileClickHandler = state => {
    return target => {
        state.isPressed = true;     // Выставляем флаг нажатия
        state.target = target;      // Указываем ссылку на сущность
    }
}

// Обработчик события клика по кнопке "Пауза"
const pauseClickHandler = () => {
    return target => {
        if (target.getState())
        {
            banner_label.setText('Пауза');
            uiLock();
        }
        else
        {
            banner_label.setText('');
            uiUnlock();
        }
    }
}

// Обработчик события клика по кнопке "Бустер"
const boosterClickHandler = state => {
    return target => {
        if (target.getState() && state.boosters > 0)
            state.isBoosted = true;
        else
            state.isBoosted = false;
    }
}

// Обработчик события клика по кнопке "Перемешать"
const shuffleClickHandler = state => {
    return target => {
        if (state.shuffles == 0)
            return;
        state.shuffles--;
        target.setText(`Перемешать (x${gameState.shuffles})`);
        state.isShuffling = true;
    }
}

// Блокировка пользовательского интерфейса
const uiLock = () => {
    grid.stopEventPropagation();    // Блокируем распространение событий на поле
    shuffle_button.disableEvents(); // Блокируем события кнопки "Перемешать"
    booster_button.disableEvents(); // Блокируем события кнопки "Бустер"
}

// Разблокировка пользовательского интерфейса
const uiUnlock = () => {
    grid.allowEventPropagation();   // Разрешаем распространение событий на поле
    shuffle_button.enableEvents();  // Разрешаем события кнопки "Перемешать"
    if (gameState.boosters > 0)
        booster_button.enableEvents();  // Разрешаем события кнопки "Бустер"
}


assets.load()
    .then(() => {
        tiles.init(assets.images.tileBlock, 5);
        tiles.split()
            .then(() => {
                sprites = tiles.images;     // Массив перекрашенных спрайтов тайлов
                init();                     // Вызов инициализации
            });
    })
    .catch(err => console.log(err));

// Функция игрового цикла
function gameLoop(state, grid, game, sprites)
{
    return () => {
        // >>> Этап 1 - нажатие на тайл
        if (state.isPressed)
        {
            state.address = grid.getInstanceAddress(state.target);          // Получаем адрес тайла в сетке

            // Получаем группу адресов ячеек на удаление
            if (state.isBoosted)                                // Если включен режим "Бустер"
            {
                state.group = game.getRadius(state.address.x, state.address.y, config.boostR);
                state.boosters--;
                booster_button.setText(`Бустер (x${gameState.boosters})`);
            }
            else                                                // Если обычный тайл или "супер-тайл"
            {
                state.supercell = game.isSupercell(state.address.x, state.address.y);
                state.group = game.getGroup(state.address.x, state.address.y);
            }

            if (state.group.length < config.minGroup)                  // Ограничение на минимальную группу тайлов
            {
                state.isPressed = false;
                return;
            }

            uiLock();   // Блокируем интерфейс
            state.group = state.group.map(element => grid.getCell(element.x, element.y));   // Получаем ячейки

            // Для каждого адреса из группы на удаление ищем тайл и применяем анимацию исчезновения
            state.group.forEach(cell => cell.instance.addSerialTask(fade(1, 0.4, 1, 2)));
            state.isPressed = false;    // Снимаем флаг нажатия на тайл
            state.isRemoving = true;    // Выставляем флаг ожидания удаления
            state.moves--;              // Декрементим количество оставшихся ходов

            state.score += Math.pow(state.group.length, 2);
        }

        // >>> Этап 2 - удаление группы тайлов
        if (state.isRemoving)
        {
            state.isRemoving = false;               // Пробуем перейти на следующий шаг

            // Если хоть одна анимация не завершена - возвращаемся на прошлый шаг
            state.group.forEach(element => {
                if (element.instance.getSerialQueueSize() > 0)
                    state.isRemoving = true;
                else
                    grid.removeItem(element.instance);  // Если анимация завершена - удаляем элемент из сетки
            });

            // Если анимации завершены
            if (!state.isRemoving)
            {
                game.collapse();                    // Инициируем смещение клеток
                state.changes = game.getChanges();  // Получаем список сместившихся клеток
                // Применяем анимацию смещения
                state.changes = state.changes.map(change => {
                    const cell = grid.getCell(change.dx, change.dy);
                    let loc = grid.getCellLocation(change.x, change.y);
                    cell.instance.addSerialTask(move(loc.x, loc.y, 100, 300));
                    cell.updateX = change.x;        // Задём координаты
                    cell.updateY = change.y;        // для обновления
                    return cell;
                });
                state.isMoving = true;              // Переходим на этап перемещения
            }
        }

        // >>> Этап 3 - перемещение тайлов
        else if (state.isMoving)
        {
            state.isMoving = false;                 // Пробуем очистить состояние

            // Если хоть одна анимация не завершена - возвращаемся на прошлый шаг
            state.changes.forEach(element => {
                if(element.instance.getSerialQueueSize() > 0)
                    state.isMoving = true;
            });

            if (!state.isMoving)
            {
                grid.updateItems();                     // Обновляем координаты элементов в сетке
                const refilment = game.randomFill();    // Заполняем пустые ячейки, получаем массив новых ячеек

                refilment.forEach(cell => {
                    const tile = TileFactory(sprites, cell.type);               // Создаём тайл
                    tile.setClickHandler(tileClickHandler(gameState));          // Вешаем обработчик события "клик"
                    grid.addItem(tile, cell.x, cell.y);                         // Помещаем в узел сетки
                });
                moves_label.setText(gameState.moves);           // Выводим количество оставшихся шагов,
                score_label.setText(state.score);               // очков
                progress.setProgress(state.score / config.scoreToWin); // и обновляем прогресс
                
                // Обработка ситуации проигрыша/выигрыша по очкам и ходам
                if (state.score >= config.scoreToWin)
                    banner_label.setText('Вы победили');
                else if (state.moves == 0)
                    banner_label.setText('Вы проиграли');
                else
                {
                    game.fixChanges();                  // Уравниваем текущие координаты с новыми
                    const moves = game.getMoves();      // Пересчитываем доступные ходы
                    groups_label.setText(`Доступно ходов: ${game.getMoves()}`);

                    // Обработка ситуации появления "супер-тайла"
                    if (state.group.length >= config.superGroup && !state.isBoosted && !state.supercell && !state.isShuffling)
                    {
                        game.setSuperCell(state.address.x, state.address.y);
                        grid.getCell(state.address.x, state.address.y).instance.addParallelTask(blink(20));
                    }

                    // Обработка ситуации проигрыша по отсуттсвию ходов и бустеров
                    if (!state.shuffles && !state.boosters && !moves)
                        banner_label.setText('Вы проиграли');

                    // Сброс флагов
                    state.isBoosted = false;
                    booster_button.reset();
                    state.isShuffling = false;

                    // Разблокировка интерфейса
                    uiUnlock()
                }
            }
        }

        // Перемешивание поля
        if (state.isShuffling && !state.isMoving)
        {            
            uiLock();                       // Блокируем интерфейс
            game.shuffle();                 // Перемешиваем поле
            state.changes = [];             // Очищаем массив с изменёнными ячейками
            game._field.forEach(cell => {
                const tile = grid.getCell(cell.dx, cell.dy);                // Получаем ячейку
                let loc = grid.getCellLocation(cell.x, cell.y);             // Получаем новые координаты
                tile.instance.addSerialTask(move(loc.x, loc.y, 100, 300));  // Запускаем анимацию перемещения
                tile.updateX = cell.x;                                      // Задём координаты
                tile.updateY = cell.y;                                      // для обновления
                state.changes.push(tile);
            });
            state.isMoving = true;          // Идём на этап перемещения
        }
    }
}