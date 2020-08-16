import { RandomIntInclusive } from './Random.mjs';

// Утилита для изменения тона изображения
export function ImageToner(img, r = 0, g = 0, b = 0)
{
    const canvas = document.createElement('canvas');    // Скрытый холст
    const ctx = canvas.getContext('2d');                // Контекст
    const result = new Image();                         // Возвращаемое изображение
    let pixData = undefined;                            // Пиксельные данные изображения

    canvas.width = img.width;
    canvas.height = img.height;

    // Размещаем изображение на холсте и получаем пиксельные данные
    ctx.drawImage(img, 0, 0);
    pixData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

    // Проходим по массиву пикселей и декрементим составляющие RGB, альфа-канал не трогаем
    for (let i = 0, n = pixData.length; i < n; i += 4)
    {
        pixData[i] -= r;       //  Красный
        pixData[i+1] -= g;     //  Зелёный
        pixData[i+2] -= b;     //  Синий
    }

    // Новый экземпляр класса ImageData для размещения модифицированных пиксельных данных
    const imgData = new ImageData(pixData, canvas.width, canvas.height);

    // Помещаем его на холст и сохраняем из холста в новое изображение
    ctx.putImageData(imgData, 0, 0);
    result.src = canvas.toDataURL('image/png', 1);

    return result;
}

/*
Утилита для генерации массива перекрашенных изображений на основе шаблона

template - экземпляр класса Image, шаблон для перекраски
variety - количество вариаций цвета
from/to - границы диапазона для генерации случайных составляющих цвета
*/
export function RandomRepaint(template, variety, to, from = 0)
{
    const sprites = new Array();

    for (let i = 0; i < variety; i++)
    {
        let r = RandomIntInclusive(from, to);
        let g = RandomIntInclusive(from, to);
        let b = RandomIntInclusive(from, to);

        sprites.push(ImageToner(template, r, g, b));
    }
    return sprites;
}