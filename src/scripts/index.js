'use strict';

// Импортируем корневой файл стилей страницы
import '../styles/index.css';

// Импортируем необходимые модули из блоков
import { Screen } from '../blocks/screen/Screen';

// Получаем ссылки на необходимые узлы структуры документа
const holder = document.querySelector('.main');                   // Главная секция страницы

// Создаём экран
const screen = new Screen(holder, 500, 500);

// Деплоим экран в документ
screen.deploy();

// Запускаем демо
screen.demo(3, 2, 20);