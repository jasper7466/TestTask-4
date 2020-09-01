'use strict';

// Корневой файл стилей страницы
import '../styles/index.css';

// Модули и утилиты общего назначения
import { Screen } from './modules/Screen.mjs';
import { Grid } from './modules/Grid.mjs';
import { BlastEngine } from './modules/BlastEngine.mjs';
import { BaseComponent } from './modules/BaseComponent.mjs';
import { Label } from './modules/Label.mjs';
import { Button } from './modules/Button.mjs';
import { AsyncRandomRepaint } from './utilities/AsyncImageToner.mjs';
import { AsyncImageLoader } from './utilities/AsyncImageLoader.mjs';
import { TileFactory } from './utilities/TileFactory.mjs';

// Анимационные функции
import { fade } from './utilities/Animations.mjs';
import { move } from './utilities/Animations.mjs';

// Константы
const holder = document.querySelector('.main'); // Родительский узел для размещения экрана отрисовки
const screenWidth = 1000;       // Ширина экрана
const screenHeight = 700;       // Высота экрана
const gridWidth = 500;          // Ширина игрового поля
const gridHeight = 500;         // Высота игрового поля
const gridX = 50;               // Положение игрового поля по X
const gridY = 150;              // Положение игрового поля по Y
const cellsX = 7;              // Размер сетки поля по оси X
const cellsY = 7;              // Размер сетки поля по оси Y
const variety = 6;              // Кол-во разновидностей тайлов
const depth = 200;              // Ограничение на значение декремента RGB компонент при окраске спрайта

const scoreToWin = 2000;        // Кол-во очков для выйгрыша
const movesLimit = 50;          // Лимит ходов
const minGroup = 3;             // Минимальный размер группы на удаление

const gameState = {
    isPressed: false,           // Флаг нажатия на тайл
    isRemoving: false,          // Флаг "удаление в процессе"
    isMoving: false,            // Флаг "перемещение в процессе"
    isShuffling: false,         // Флаг "перемешивание в процессе"
    target: undefined,          // Сущность, на которой произошло событие нажатия
    address: undefined,         // Адрес ячейки, содержащей сущность
    group: undefined,           // Выбранная группа ячеек (адреса/ссылки сущностей)
    changes: undefined,         // Сместившаяся группа (адреса/ссылки сущностей)
    moves: movesLimit,          // Оставшееся количество ходов
    score: 0,                   // Количество очков
    shuffles: 3,                // Оставшееся количество перемешиваний
    busters: 1                  // Оставшееся количество бустеров
}

// Переменные
let tile_template = undefined;  // Будущий образец тайла
let sprites = undefined;        // Будущий массив со спрайтами тайлов

// Создаём экран отрисовки, получаем контекст
const screen = new Screen(holder, screenWidth, screenHeight, '#036');
const ctx = screen.getContext();

const grid = new Grid(ctx, cellsX, cellsY);
const game = new BlastEngine(cellsX, cellsY, variety, minGroup);
const moves_caption = new Label(ctx, 30, '#FFFFFF', 'Roboto Slab', 'Ходы:');
const moves_label = new Label(ctx, 90, '#FFFFFF', 'Roboto Slab');
const score_caption = new Label(ctx, 30, '#FFFFFF', 'Roboto Slab', 'Очки:');
const score_label = new Label(ctx, 50, '#FFFFFF', 'Roboto Slab', 0);
const gameover_label = new Label(ctx, 90, '#FFFFFF', 'Roboto Slab');
const groups_label = new Label(ctx, 20, '#FFFFFF', 'Roboto Slab');
const shuffle_button = new Button(ctx, 20, '#FFFFFF', 'Roboto Slab', `Перемешать (x${gameState.shuffles})`);
const buster_button = new Button(ctx, 20, '#FFFFFF', 'Roboto Slab', `Бустер (x${gameState.busters})`);


const score_panel = new BaseComponent(ctx);


// Функция инициализации и конфигурирования игры
function init()
{
    grid.setSize(gridWidth, gridHeight);    // Задаём размер игрового поля
    grid.setPosition(gridX, gridY);

    score_panel.setAnchor(0.5, 0.5);
    score_panel.scaleOnBackgroundWidth(300);
    score_panel.setPosition(780, 300);

    moves_caption.setPosition(780, 160);

    moves_label.setAnchor(0.5, 0.7);
    moves_label.scaleOnBackgroundWidth(180);
    moves_label.setText(gameState.moves);
    moves_label.setPosition(780, 300);

    score_caption.setPosition(780, 370);

    score_label.setPosition(780, 410);
    
    gameover_label.setPosition(screenWidth / 2, screenHeight / 2);

    groups_label.setPosition(150, 130);

    shuffle_button.setPosition(780, 500);
    shuffle_button.setAnchor(0.5, 0.5);
    shuffle_button.scaleOnBackgroundWidth(200);
    shuffle_button.setSize(200, 60);
    shuffle_button.setClickHandler(shuffleClickHandler(gameState));

    buster_button.setPosition(780, 570);
    buster_button.setAnchor(0.5, 0.5);
    buster_button.scaleOnBackgroundWidth(200);
    buster_button.setSize(200, 60);

    
    // Заполняем сетку тайлами
    for (let x = 0; x < cellsX; x++)
    {
        for(let y = 0; y < cellsY; y++)
        {
            const tile = TileFactory(sprites, game.getCell(x, y).type);       // Создаём тайл
            tile.setClickHandler(tileClickHandler(gameState));          // Вешаем обработчик события "клик"
            grid.addItem(tile, x, y);                                   // Помещаем в узел сетки
        }
    }

    screen.addLayer(grid);                              // Добавляем сетку в очередь движка отрисовки
    screen.addLayer(score_panel);
    screen.addLayer(moves_caption);
    screen.addLayer(moves_label);                             // Добавляем сетку в очередь движка отрисовки
    screen.addLayer(score_caption);
    screen.addLayer(score_label);
    screen.addLayer(groups_label);
    screen.addLayer(gameover_label);
    screen.addLayer(shuffle_button);
    screen.addLayer(buster_button);
    
    screen.addTask(gameLoop(gameState, grid, game, sprites));    // Добавляем циклический вызов функции игрового цикла
    screen.renderEngineStart();                         // Запускаем движок

    groups_label.setText(`Доступно ходов: ${game.getMoves()}`);
}

// Обработчик события клика по тайлу
const tileClickHandler = state => {
    return target => {
        state.isPressed = true;     // Выставляем флаг нажатия
        state.target = target;      // Указываем ссылку на сущность
    }
}

// Обработчик события клика по кнопке "Перемешать"
const shuffleClickHandler = state => {
    return target => {
        if (state.shuffles == 0)
            return
        state.shuffles--;
        target.setText(`Перемешать (x${gameState.shuffles})`);
        state.isShuffling = true;
    }
}

// Блокировка пользовательского интерфейса
const uiLock = () => {
    grid.stopEventPropagation();    // Блокируем распространение событий на поле
    shuffle_button.disableEvents(); // Блокируем события кнопки "Перемешать"
}

// Разблокировка пользовательского интерфейса
const uiUnlock = () => {
    grid.allowEventPropagation();   // Разрешаем распространение событий на поле
    shuffle_button.enableEvents();  // Разрешаем события кнопки "Перемешать"
}

// Асинхронно загружаем образец тайла и получаем набор спрайтов для тайлов
Promise.all([
    AsyncImageLoader(require('../images/tile.png')).then(img => tile_template = img),
    AsyncImageLoader(require('../images/field.png')).then(img => grid.setBackgroundImage(img)),
    AsyncImageLoader(require('../images/moves.png')).then(img => moves_label.setBackgroundImage(img)),
    AsyncImageLoader(require('../images/score_panel.png')).then(img => score_panel.setBackgroundImage(img)),
    AsyncImageLoader(require('../images/button2_base.png')).then(img => {
        shuffle_button.setBaseImage(img);
        buster_button.setBaseImage(img);
    }),
    AsyncImageLoader(require('../images/button2_hover.png')).then(img => {
        shuffle_button.setHoverImage(img);
        buster_button.setHoverImage(img);
    }),
    AsyncImageLoader(require('../images/button2_press.png')).then(img => {
        shuffle_button.setPressImage(img);
        buster_button.setPressImage(img);
    })
])
    .then(() => {
        AsyncRandomRepaint(tile_template, variety, depth)
            .then(repainted => {
                sprites = repainted;
                init();
            })
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
            state.group = game.getGroup(state.address.x, state.address.y);  // Получаем группу адресов ячеек на удаление

            if (state.group.length < minGroup)
            {
                state.isPressed = false;
                return;
            }

            uiLock();   // Блокируем интерфейс
            state.group = state.group.map(element => grid.getCell(element.x, element.y));   // Получаем ячейки

            // Для каждого адреса из группы на удаление ищем тайл и применяем анимацию исчезновения
            state.group.forEach(cell => cell.instance.addParallelTask(fade(1, 0.4, 1, 2)));
            state.isPressed = false;    // Снимаем флаг нажатия на тайл
            state.isRemoving = true;    // Выставляем флаг ожидания удаления
            state.moves--;              // Декрементим количество оставшихся ходов

            state.score += Math.pow(2, state.group.length);
        }

        // >>> Этап 2 - удаление группы тайлов
        if (state.isRemoving)
        {
            state.isRemoving = false;               // Пробуем перейти на следующий шаг

            // Если хоть одна анимация не завершена - возвращаемся на прошлый шаг
            state.group.forEach(element => {
                if (element.instance.getParallelQueueSize() > 0)
                    state.isRemoving = true;
                else
                    grid.removeItem(element.instance);  // Если анимация завершена - удаляем элемент из сетки FIXME:
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
                    cell.instance.addParallelTask(move(loc.x, loc.y, 100, 300));
                    cell.updateX = change.x;       // Задём координаты
                    cell.updateY = change.y;       // для обновления
                    return cell;
                });
                state.isMoving = true;              // Переходим на этап перемещения
            }
        }

        // >>> Этап 3 - перемещение тайлов
        if (state.isMoving)
        {
            state.isMoving = false;                 // Пробуем очистить состояние

            // Если хоть одна анимация не завершена - возвращаемся на прошлый шаг
            state.changes.forEach(element => {
                if(element.instance.getParallelQueueSize() > 0)
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
                moves_label.setText(gameState.moves);     // Выводим количество оставшихся шагов
                score_label.setText(state.score);
                
                if (state.score >= scoreToWin)
                    gameover_label.setText('Вы победили');
                else if (state.moves == 0)
                    gameover_label.setText('Вы проиграли');
                else
                {
                    game.fixChanges();                  // Уравниваем текущие координаты с новыми
                    uiUnlock();                         // Разблокировка интерфейса
                    const moves = game.getMoves();
                    groups_label.setText(`Доступно ходов: ${game.getMoves()}`);
                    if (state.shuffles == 0 && moves == 0)
                        gameover_label.setText('Вы проиграли');
                }
            }
        }

        if (state.isShuffling)
        {            
            uiLock();
            game.shuffle();
            state.changes = [];
            game._field.forEach(cell => {
                const tile = grid.getCell(cell.dx, cell.dy);
                let loc = grid.getCellLocation(cell.x, cell.y);
                tile.instance.addParallelTask(move(loc.x, loc.y, 100, 300));
                tile.updateX = cell.x;       // Задём координаты
                tile.updateY = cell.y;       // для обновления
                state.changes.push(tile);
            });
            state.isShuffling = false;
            state.isMoving = true;
        }
    }
}