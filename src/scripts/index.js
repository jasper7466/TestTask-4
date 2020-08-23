'use strict';

// Корневой файл стилей страницы
import '../styles/index.css';

// Модули и утилиты общего назначения
import { Screen } from './modules/Screen.mjs';
import { Grid } from './modules/Grid.mjs';
import { Control } from './modules/Control.mjs';
import { BlastEngine } from './modules/BlastEngine.mjs';
import { AsyncRandomRepaint } from './utilities/AsyncImageToner.mjs';
import { AsyncImageLoader } from './utilities/AsyncImageLoader.mjs';

// Анимационные функции
import { fade } from './utilities/Animations.mjs';
import { move } from './utilities/Animations.mjs';

// Константы
const screenWidth = 500;            // Ширина экрана
const screenHeight = 500;           // Высота экрана
const cellsX = 40;                  // Размер сетки поля по оси X
const cellsY = 40;                  // Размер сетки поля по оси Y
const variety = 5;                  // Кол-во разновидностей тайлов

// Переменные
let sprites = undefined;            // Будущий массив со спрайтами тайлов

// Асинхронно загружаем образец тайла и получаем набор спрайтов для тайлов
AsyncImageLoader(require('../images/tile.png'))
    .then(img => {
        AsyncRandomRepaint(img, variety, 200)
            .then(repainted => {
                sprites = repainted;
                init();
            });
    })
    .catch(err => console.log(err));

// Функция инициализации и конфигурирования игры
function init()
{
    // Получаем ссылку на главную секцию страницы
    const holder = document.querySelector('.main');

    // Создаём экран отрисовки, игровое поле и игровой движок
    const screen = new Screen(holder, screenWidth, screenHeight);
    const grid = new Grid(screen.getContext(), 0, 0, 500, 500, cellsX, cellsY, (...rest) => new Control (...rest), sprites, 0, 0.109375, true);
    const game = new BlastEngine(cellsX, cellsY, variety);

    game.randomFill()
    
    for (let i = 0; i < cellsX; i++)
    {
        for(let j = 0; j < cellsY; j++)
        {
            grid.addItem(game._field[i][j].type, i, j);
        }
    }

    grid._collection.forEach(item => {
        item._clickHandler = (item) => {
            // Получаем группу тайлов на удаление
            const group = game.getGroup(item.address.x, item.address.y);

            // Для каждой клетки на удаление ищем тайл и применяем анимацию исчезновения
            group.forEach((cell) => {
                const tile = grid.getItem(cell.x, cell.y);
                if (tile)
                    tile.addAnimation(fade(1, 0.4, 1, 5));
            });

            // Очищаем тип удаляемых клеток
            game.clearGroup(group);

            // Инициируем смещение клеток
            game.collapse();

            // Получаем список сместившихся клеток
            let changes = game.getChanges();

            // Применяем анимацию смещения
            changes.forEach(item => {
                const tile = grid.getItem(item.x, item.y);
                tile.addAnimation(move(item.dx * grid._stepX, item.dy * grid._stepY, 100, 500));
                tile.address.x = item.dx;
                tile.address.y = item.dy;
            });

            // Фиксируем игровое поле ()
            game.fixChanges();
            console.log(grid._collection);
        }
    });

    screen.addLayer(grid);
    screen.renderEngineStart();
}