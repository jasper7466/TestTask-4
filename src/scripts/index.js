'use strict';

// Импортируем корневой файл стилей страницы
import '../styles/index.css';

// Импортируем модули и утилиты общего назначения
import { Screen } from './modules/Screen.mjs';
import { Grid } from './modules/Grid.mjs';
import { Control } from './modules/Control.mjs';
import { BlastEngine } from './modules/BlastEngine.mjs';
import { ImageToner } from './utilities/ImageToner.mjs';
import { RandomIntInclusive } from './utilities/Random.mjs';

// Импортируем анимационные функции
import { fade } from './utilities/Animations.mjs';

// Объявляем константы
const screenWidth = 500;
const screenHeight = 500;
const cellsX = 10;
const cellsY = 10;
const variety = 5;

// Получаем ссылку на главную секцию страницы
const holder = document.querySelector('.main');

// Создаём экран
const screen = new Screen(holder, screenWidth, screenHeight);

// Деплоим экран в документ
screen.deploy();

const sprites = [];

const img = new Image();

img.src = require('../images/tile.png');

img.onload = () => {

    for (let i = 0; i < variety; i++)
    {
        let r = RandomIntInclusive(0, 20) + RandomIntInclusive(0, 200);
        let g = RandomIntInclusive(0, 180) + RandomIntInclusive(0, 20);
        let b = RandomIntInclusive(0, 20) + RandomIntInclusive(0, 200);

        sprites.push(ImageToner(img, r, g, b));
    }

    sprites[variety - 1].onload = () => {
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

        const group = game.getGroup(0, 0);
        console.log(group);
    }
}