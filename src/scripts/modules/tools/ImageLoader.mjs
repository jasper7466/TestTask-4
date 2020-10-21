// Класс асинхронного загрузчика изображений
export class ImageLoader
{
    constructor(imageFiles)
    {
        this.imageFiles = imageFiles;
        this.images = {};
    }

    // Метод, инициирующий загрузку всех изображений
    load()
    {
        const promises = [];
        
        for (let name in this.imageFiles)
        {
            promises.push(this._loadImage(name, this.imageFiles[name]));
        }
        return Promise.all(promises);
    }

    // Метод загрузки одного изображения
    _loadImage(name, src)
    {
        return new Promise((resolve, reject) => {
            const img = new Image();
            this.images[name] = img;
            img.onload = () => resolve(name);
            img.onerror = (err) => {
                console.log(`Image load error: ${name}, ${src}`);
                reject(err);
            }
            img.src = src;
        });
    }
}