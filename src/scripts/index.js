'use strict';

import '../styles/index.css';                           // Корневой файл стилей страницы
import { Game } from './modules/game/Game';             // Класс игры

window.onload = () => {
    const holder = document.querySelector('.main');     // Родительский узел для размещения экрана отрисовки
    const blastPuzzle = new Game(holder);               // Создание экземпляра игры
    // blastPuzzle.run();                               // Запуск игры
};