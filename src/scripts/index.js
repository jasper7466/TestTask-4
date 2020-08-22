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

// Константы
const screenWidth = 500;            // Ширина экрана
const screenHeight = 500;           // Высота экрана
const cellsX = 10;                  // Размер сетки поля по оси X
const cellsY = 10;                  // Размер сетки поля по оси Y
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
            grid.addItem(game._field[i][j], i, j);
        }
    }

    grid._collection.forEach(item => {
        item._clickHandler = (item) => {
            const group = game.getGroup(item.address.x, item.address.y);
            group.forEach((cell) => {
                const tile = grid.getItem(cell.x, cell.y);
                tile.addAnimation(fade(1, 0, 1, 5));
            });
        }
    });

    screen.addLayer(grid);
    screen.renderEngineStart();
}