export class Screen
{
    constructor(container, width, height)
    {
        // Сохраняем параметры
        this._container = container;

        // Создаём холст
        this._canvas = document.createElement('canvas');
        this._canvas.classList.add('screen');

        // Задаём размер
        this._canvas.width = width;
        this._canvas.height = height;

        // На случай, если браузер не поддерживает тег <canvas>
        this._canvas.textContent = 'Sorry, but your browser is not supported :(';

        // Получаем контекст
        this._ctx = this._canvas.getContext('2d');

        // Ссылка на функцию отрисовки чего-либо
        this.gameEngine = undefined;

        // TODO: Реализовать получение ссылки на функцию requestAnimationFrame для кроссбраузерности:
        // requestAnimationFrame
        // webkitRequestAnimationFrame
        // mozRequestAnimationFrame
        // oRequestAnimationFrame
        // msRequestAnimationFrame
        // function (callback) {
        //     window.setTimeout(callback, 1000 / 60);
        // }

        this.x = 10;
        this.y = 10;
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
        this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
    }

    // Демо-метод для отладки
    demo(h, v, r)
    {
        this.clear()
        let h_step = this._canvas.width / h;
        let v_step = this._canvas.height / v;

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

    
    // Метод для отрисовки прямоугольника
    drawRect(x, y)
    {
        this._ctx.fillStyle = 'rgb(125, 125, 125)';
        this.clear();
        this._ctx.fillRect(x, y, 50, 50)
    }

    // Метод для запуска движка отрисовки
    gameEngineStart(callback)
    {
        // Присваиваем ссылку на коллбек
        this.setGameEngine(callback);
        // Запускаем рекурсивное выполнение отрисовки кадров
        this.gameEngineStep();
    }

    // Сеттер для смены состояния движка
    setGameEngine(callback)
    {
        // Присваиваем ссылку на коллбек
        this.gameEngine = callback;
    }

    // Метод для отрисовки кадра игрового цикла
    gameEngineStep()
    {
        this.gameEngine();
        requestAnimationFrame(() => this.gameEngineStep());
    }

    // Метод анимации движения вправо
    rectLoopRight()
    {
        this.drawRect(this.x, this.y);
        this.x += 1;
        if (this.x >= 100)
            this.setGameEngine(this.rectLoopLeft);
    }

    // Метод анимации движения влево
    rectLoopLeft()
    {
        this.drawRect(this.x, this.y);
        this.x -= 1;
        if (this.x < 50)
            this.setGameEngine(this.rectLoopRight);
    }
}