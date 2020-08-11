'use strict';

// Импортируем корневой файл стилей страницы
import '../styles/index.css';

// Импортируем необходимые модули из блоков
import { Screen } from '../blocks/screen/Screen';
import { Control } from '../scripts/modules/Control.mjs';

// Импортируем модули и утилиты общего назначения
import { ImageToner } from './utilities/ImageToner.mjs';
import { Grid } from './modules/Grid.mjs';
import { BlastEngine } from './modules/BlastEngine.mjs';
import { RandomIntInclusive } from './utilities/Random.mjs';

// Получаем ссылки на необходимые узлы структуры документа
const holder = document.querySelector('.main');                   // Главная секция страницы

// Создаём экран
const screen = new Screen(holder, 500, 500);

// Деплоим экран в документ
screen.deploy();

// screen.demo(3, 2, 20);

// screen.gameEngineStart(screen.rectLoopRight);

const variety = 15;
const cellsX = 30;
const cellsY = 20;

const sprites = [];

var isLoaded = false;

const img = new Image();

img.src = require('../images/tile.png');

function fade(start, stop, speed, accel)
    {
        let value = start;
        if (stop < 0)
            stop = 0;

        return (control) => {
            value -= (speed + accel) / 60;
            
            if (value < stop)
                value = stop;

            control.alpha = value;
            if (value <= stop)
                return true;
            return false;
        }
    }

img.onload = () => {

    for (let i = 0; i < variety; i++)
    {
        let r = RandomIntInclusive(0, 20) + RandomIntInclusive(0, 200);
        let g = RandomIntInclusive(0, 180) + RandomIntInclusive(0, 20);
        let b = RandomIntInclusive(0, 20) + RandomIntInclusive(0, 200);

        sprites.push(ImageToner(img, r, g, b));
    }

    sprites[variety - 1].onload = () =>

    {
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
    
        screen.addLayer(() => grid.render());
        screen.renderEngineStart();
    
        const item = grid.getItem(2, 2);
    
        item.addAnimation(fade(1, 0, 0.5, 1));
    }

}