'use strict';

// Импортируем корневой файл стилей страницы
import '../styles/index.css';

// Импортируем необходимые модули из блоков
import { Screen } from '../blocks/screen/Screen';
import { Control } from '../scripts/modules/Control.mjs';

// Импортируем модули и утилиты общего назначения
import { ImageToner } from './utilities/ImageToner.mjs';

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
    let modified1 = ImageToner(img, 0, 250, 70);
    
    const tile1 = new Control(screen.getContext(), modified1, 0, 0);
    tile1.scale(0.5);
    tile1.scale(1);
    tile1.scaleWidth(700);
    tile1.scaleHeight(180);
    
    modified.onload = () => {
        screen.drawImage(modified, 1);
        tile1.render();
    }
    
    // tile1.render();   
}