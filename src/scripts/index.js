'use strict';

// Импортируем корневой файл стилей страницы
import '../styles/index.css';

// Импортируем необходимые модули из блоков
import { Screen } from '../blocks/screen/Screen';
import { Control } from '../scripts/modules/Control.mjs';

// Импортируем модули и утилиты общего назначения
import { ImageToner } from './utilities/ImageToner.mjs';
import { Grid } from './modules/Grid.mjs';

// Получаем ссылки на необходимые узлы структуры документа
const holder = document.querySelector('.main');                   // Главная секция страницы

// Создаём экран
const screen = new Screen(holder, 500, 500);

// Деплоим экран в документ
screen.deploy();

// screen.demo(3, 2, 20);

// screen.gameEngineStart(screen.rectLoopRight);

const img = new Image();
img.src = require('../images/tile.png');

img.onload = () => {
    let modified = ImageToner(img, 100, 150, 70);
    let modified2 = ImageToner(img, 50, 80, 150);
    let modified3 = ImageToner(img, 70, 200, 30);

    let sprites = [modified, modified2, modified3, modified, modified, modified, modified, modified, modified];

    var m = 7;
    var n = 3;

    modified.onload = () => {
        const grid = new Grid(screen.getContext(), 0, 0, 500, 500, m, n, (...rest) => new Control (...rest), sprites, 0, 0.109375, true);
        
        for (let i = 0; i < m; i++)
        {
            for(let j = 0; j < n; j++)
            {
                grid.addItem(i, i, j);
            }
        }

        screen.addLayer(() => grid.render());
        screen.renderEngineStart();

        grid.removeItem(2, 1);
        grid.removeItem(1, 2);
        grid.removeItem(3, 1);
    }
}