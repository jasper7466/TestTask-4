// Утилита для асинхронной загрузки изображений.
// На вход прнимает ссылку на изображение
// На выход отдаёт промис, из которого можно будет получить изображение
export function AsyncImageLoader(src)
{
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.addEventListener('load', () => resolve(img));
        img.addEventListener('error', err => {
            reject(err);
            console.log(err);
        });
        img.src = src;
    });
}