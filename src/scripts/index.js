'use strict';

// Корневой файл стилей страницы
import '../styles/index.css';

// Модули и утилиты общего назначения
import { Screen } from './modules/Screen.mjs';
import { Grid } from './modules/Grid.mjs';
import { BlastEngine } from './modules/BlastEngine.mjs';
import { BaseComponent } from './modules/BaseComponent.mjs';
import { AsyncRandomRepaint } from './utilities/AsyncImageToner.mjs';
import { AsyncImageLoader } from './utilities/AsyncImageLoader.mjs';
import { TileFactory } from './utilities/TileFactory.mjs';

// Анимационные функции
import { fade } from './utilities/Animations.mjs';
import { move } from './utilities/Animations.mjs';

// Константы
const holder = document.querySelector('.main'); // Родительский узел для размещения экрана отрисовки
const screenWidth = 500;        // Ширина экрана
const screenHeight = 500;       // Высота экрана
const gridWidth = 500;          // Ширина игрового поля
const gridHeight = 500;         // Высота игрового поля
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
    changes: undefined          // Сместившаяся группа (адреса/ссылки сущностей)
}

// Переменные
let sprites = undefined;        // Будущий массив со спрайтами тайлов

// Создаём экран отрисовки, игровое поле и игровой движок
const screen = new Screen(holder, screenWidth, screenHeight);
const grid = new Grid(cellsX, cellsY);
const game = new BlastEngine(cellsX, cellsY, variety);

// Получаем контекст
const ctx = screen.getContext();

// Функция инициализации и конфигурирования игры
function init()
{
    grid.setSize(gridWidth, gridHeight);    // Задаём размер игрового поля
    grid.setContext(ctx);                   // и контекст
    game.randomFill();                      // Инициируем заполнение поля тайлами
    
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
    screen.addTask(gameLoop(gameState, grid, game));    // Добавляем циклический вызов функции игрового цикла
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
AsyncImageLoader(require('../images/tile.png'))
    .then(img => {
        AsyncRandomRepaint(img, variety, depth)
            .then(repainted => {
                sprites = repainted;
                init();
            });
    })
    .catch(err => console.log(err));

// Функция игрового цикла
function gameLoop(state, grid, game)
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
            state.isPressed = false;  // Снимаем флаг нажатия на тайл
            state.isRemoving = true;  // Выставляем флаг ожидания удаления
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
                    cell.instance.addParallelTask(move(change.dx * grid._stepX, change.dy * grid._stepY, 100, 100));
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
                grid.allowEventPropagation();       // Разрешаем распространение событий
            }
        }
    }
}