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

    modified.onload = () => {
        const grid = new Grid(screen.getContext(), 10, 10, 350, 350, 10, 10, (...rest) => new Control (...rest), modified, 0, 0.109375);
    }
}