export class Screen
{
    constructor(container, width, height)
    {
        // Сохраняем параметры
        this._container = container;
        this._width = width;
        this._height = height;

        // Создаём холст
        this._canvas = document.createElement('canvas');
        this._canvas.classList.add('screen');
        this._canvas.setAttribute('width', width);
        this._canvas.setAttribute('height', height);

        // На случай, если браузер не поддерживает тег <canvas>
        this._canvas.textContent = 'Sorry, but your browser is not supported :(';

        // Получаем контекст
        this._ctx = this._canvas.getContext('2d');
    }

    // Метод для размещения холста в родительском контейнере
    deploy()
    {
        this._container.appendChild(this._canvas);
    }

    // Метод для открепления холста от родительского контейнера
    retract()
    {
        this._container.removeChild(this._canvas);
    }

    // Метод для полной очистки холста
    clear()
    {
        this._ctx.clearRect(0, 0, this._width, this._height);
    }

    // Демо-метод для отладки
    demo(h, v, r)
    {
        this.clear()
        let h_step = this._width / h;
        let v_step = this._height / v;

        for (let i = 0; i < h; i++)
        {
            for (let j = 0; j < v; j++)
            {
                this._ctx.beginPath();
                this._ctx.arc(h_step / 2 + h_step * i, v_step / 2 + v_step * j, r, 0, 2 * Math.PI);
                this._ctx.fillStyle = 'rgb(125, 125, 125)';
                this._ctx.fill();
            }
        }
    }
}