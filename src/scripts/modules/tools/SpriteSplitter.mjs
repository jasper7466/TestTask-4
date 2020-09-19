import { ImageLoader } from './ImageLoader';

// Класс разделителя линейного блока спрайтов на отдельные изображения
export class SpriteSplitter
{
    constructor()
    {
        this.images = [];                          // Массив разделённых спрайтов
    }

    // Метод инициализации
    init(image, divider)
    {
        this._image = image;                        // Линейный блок спрайтов одинакового размера
        this._divider = divider;                    // Количество спрайтов в линейном блоке
        this._spriteWidth = image.width / divider;  // Ширина одного спрайта
    }

    // Метод, инициирующий разделение блока на спрайты
    split()
    {
        const canvas = document.createElement('canvas');    // Скрытый холст
        const ctx = canvas.getContext('2d');                // Контекст
        const promises = [];                                // Массив "обещаний"

        canvas.width = this._spriteWidth;
        canvas.height = this._image.height;
        
        for (let part = 0; part < this._divider; part++)
        {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            promises.push(this._splitPart(canvas, ctx, part));
        }
        return Promise.all(promises);
    }

    // Метод получения одного спрайта
    _splitPart(canvas, ctx, part)
    {
        return new Promise((resolve, reject) => {
            const sprite = new Image();
            const x = this._spriteWidth * part;
            const dx = this._spriteWidth;
            const y = 0;
            const dy = canvas.height;

            ctx.drawImage(this._image, x, y, dx, dy, 0, 0, canvas.width, canvas.height); 
            const src = canvas.toDataURL('image/png');

            sprite.onload = () => resolve(sprite);
            sprite.onerror = (err) => {
                console.log(`Image load error: ${src}`);
                reject(err);
            }

            this.images.push(sprite);
            sprite.src = src;
        });
    }
}