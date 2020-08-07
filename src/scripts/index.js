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

// screen.demo(3, 2, 20);

// screen.gameEngineStart(screen.rectLoopRight);

var canvas = document.createElement('canvas');
var context = canvas.getContext('2d');
var img = document.querySelector('.tile');
canvas.width = img.width;
canvas.height = img.height;
context.drawImage(img, 0, 0 );
var imgPix = context.getImageData(0, 0, img.width, img.height);

console.log(imgPix);

let data = imgPix.data;

for (let i = 0, n = data.length; i < n; i += 4)
{
    data[i] += 10;
    data[i+1] += 10;
    data[i+2] -= 90;
}


// data = data.map((item) => {
//     if (item <= 240)
//         item -= 0;
//     return item;
// })

let new_ID = new ImageData(data, imgPix.width, imgPix.height);

screen.drawImage(new_ID);