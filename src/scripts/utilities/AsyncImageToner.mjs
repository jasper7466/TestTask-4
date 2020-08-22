import { RandomIntInclusive } from './Random.mjs';
import { AsyncImageLoader } from './AsyncImageLoader.mjs';

// Утилита для изменения тона изображения
export function AsyncImageToner(img, r = 0, g = 0, b = 0)
{
    const canvas = document.createElement('canvas');    // Скрытый холст
    const ctx = canvas.getContext('2d');                // Контекст
    let result = undefined;                             // Возвращаемое изображение
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
    result = AsyncImageLoader(canvas.toDataURL('image/png', 1));

    return result;
}

// Утилита для генерации массива перекрашенных изображений на основе шаблона.
// template - экземпляр класса Image, шаблон для перекраски
// variety - количество вариаций цвета
// from/to - границы диапазона для генерации случайных составляющих цвета
export function AsyncRandomRepaint(template, variety, to, from = 0)
{
    // Создаём пустой массив для хранения промисов от асинхронного загрузчика изображений
    const images = new Array();

    // Получаем требуемое количество вариаций перекрашенных изображений
    for (let i = 0; i < variety; i++)
    {
        let r = RandomIntInclusive(from, to);
        let g = RandomIntInclusive(from, to);
        let b = RandomIntInclusive(from, to);

        // Кладём промис в массив
        images.push(AsyncImageToner(template, r, g, b));
    }

    // Возвращаем промис, который разрешится только при условии загрузки всех изображений
    return new Promise((resolve) => {
        Promise.all(images)
            .then(images => resolve(images));
    });
}