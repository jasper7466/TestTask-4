'use strict';

// Корневой файл стилей страницы
import '../styles/index.css';

// Модули и утилиты общего назначения
import { Screen } from './modules/Screen.mjs';
import { Grid } from './modules/Grid.mjs';
import { BlastEngine } from './modules/BlastEngine.mjs';
import { BaseComponent } from './modules/BaseComponent.mjs';
import { Label } from './modules/Label.mjs';
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
const gridX = 50;              // Положение игрового поля по X
const gridY = 150;              // Положение игрового поля по Y
const cellsX = 10;              // Размер сетки поля по оси X
const cellsY = 10;              // Размер сетки поля по оси Y
const variety = 5;              // Кол-во разновидностей тайлов
const depth = 200;              // Ограничение на значение декремента RGB компонент при окраске спрайта

const gameState = {
    isPressed: false,           // Флаг нажатия на тайл
    isRemoving: false,          // Флаг "удаление в процессе"
    isMoving: false,            // Флаг "перемещение в процессе"
    target: undefined,          // Сущность, на которой произошло событие нажатия
    address: undefined,         // Адрес ячейки, содержащей сущность
    group: undefined,           // Выбранная группа ячеек (адреса/ссылки сущностей)
    changes: undefined,         // Сместившаяся группа (адреса/ссылки сущностей)
    moves: 50,                  // Оставшееся количество ходов
    score: 0                    // Количество очков
}

// Переменные
let tile_template = undefined;  // Будущий образец тайла
let sprites = undefined;        // Будущий массив со спрайтами тайлов

// Создаём экран отрисовки, получаем контекст
const screen = new Screen(holder, screenWidth, screenHeight, '#036');
const ctx = screen.getContext();

const grid = new Grid(ctx, cellsX, cellsY);
const game = new BlastEngine(cellsX, cellsY, variety);
const moves_caption = new Label(ctx, 30, '#FFFFFF', 'Roboto Slab', 'Ходов:');
const moves_label = new Label(ctx, 90, '#FFFFFF', 'Roboto Slab');
const score_caption = new Label(ctx, 30, '#FFFFFF', 'Roboto Slab', 'Очки:');
const score_label = new Label(ctx, 50, '#FFFFFF', 'Roboto Slab', 0);


const score_panel = new BaseComponent(ctx);


// Функция инициализации и конфигурирования игры
function init()
{
    grid.setSize(gridWidth, gridHeight);    // Задаём размер игрового поля
    grid.setPosition(gridX, gridY);
    game.randomFill();                      // Инициируем заполнение поля тайлами

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

    
    // Заполняем сетку тайлами
    for (let x = 0; x < cellsX; x++)
    {
        for(let y = 0; y < cellsY; y++)
        {
            const tile = TileFactory(sprites, game._field[x][y].type);  // Создаём тайл
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
    
    screen.addTask(gameLoop(gameState, grid, game, sprites));    // Добавляем циклический вызов функции игрового цикла
    screen.renderEngineStart();                         // Запускаем движок
}

// Обработчик события клика по тайлу
const tileClickHandler = state => {
    return target => {
        state.isPressed = true;     // Выставляем флаг нажатия
        state.target = target;      // Указываем ссылку на сущность
    }
}

// Асинхронно загружаем образец тайла и получаем набор спрайтов для тайлов

const promises = [];
Promise.all([
    AsyncImageLoader(require('../images/tile.png')).then(img => tile_template = img),
    AsyncImageLoader(require('../images/field.png')).then(img => grid.setBackgroundImage(img)),
    AsyncImageLoader(require('../images/moves.png')).then(img => moves_label.setBackgroundImage(img)),
    AsyncImageLoader(require('../images/score_panel.png')).then(img => score_panel.setBackgroundImage(img))
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
            grid.stopEventPropagation();                                    // Блокируем распространение событий
            state.address = grid.getInstanceAddress(state.target);          // Получаем адрес тайла в сетке
            state.group = game.getGroup(state.address.x, state.address.y);  // Получаем группу адресов ячеек на удаление
            state.group = state.group.map(element => grid.getCell(element.x, element.y));   // Получаем ячейки

            // Для каждого адреса из группы на удаление ищем тайл и применяем анимацию исчезновения
            state.group.forEach(cell => cell.instance.addParallelTask(fade(1, 0.4, 1, 2)));
            state.isPressed = false;    // Снимаем флаг нажатия на тайл
            state.isRemoving = true;    // Выставляем флаг ожидания удаления
            state.moves--;              // Декрементим количество оставшихся ходов

            state.score += Math.pow(2, state.group.length);
            score_label.setText(state.score);
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
                    const cell = grid.getCell(change.x, change.y);
                    let loc = grid.getCellLocation(change.dx, change.dy);
                    cell.instance.addParallelTask(move(loc.x, loc.y, 100, 300));
                    cell.updateX = change.dx;       // Задём координаты
                    cell.updateY = change.dy;       // для обновления
                    return cell;
                });
                game.fixChanges();                  // Уравниваем текущие координаты с новыми
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
                grid.updateItems();                 // Обновляем координаты элементов в сетке
                const refilment = game.refill();    // Заполняем пустые ячейки, получаем массив новых ячеек

                refilment.forEach(cell => {
                    const tile = TileFactory(sprites, cell.type);               // Создаём тайл
                    tile.setClickHandler(tileClickHandler(gameState));          // Вешаем обработчик события "клик"
                    grid.addItem(tile, cell.x, cell.y);                         // Помещаем в узел сетки
                });
                moves_label.setText(gameState.moves);     // Выводим количество оставшихся шагов
                grid.allowEventPropagation();       // Разрешаем распространение событий
            }
        }
    }
}