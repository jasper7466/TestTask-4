export class Screen
{
    constructor(container, width, height)
    {
        this._container = container;                        // Родительский DOM-узел
        this._canvas = document.createElement('canvas');    // Холст
        this._canvas.width = width;                         // Ширина
        this._canvas.height = height;                       // Высота
        this._ctx = this._canvas.getContext('2d');          // Контекст
        this._renderQueue = [];                             // Очередь рендер-функций слоёв
        this._taskQueue = [];                               // Очередь прочих функций для циклического выполнения
        this._stopEngine = true;                            // Флаг остановки движка отрисовки

        // На случай, если браузер не поддерживает тег <canvas>
        this._canvas.textContent = 'Sorry, but your browser is not supported :(';

        // TODO: На время отладки
        this._canvas.classList.add('screen');

        this._canvas.addEventListener('mousedown', (event) => this._mouseDown(event));
        this._canvas.addEventListener('mouseup', (event) => this._mouseUp(event));

        // Размещаем в родительском DOM-узле
        this.deploy();

        // TODO: Реализовать получение ссылки на функцию requestAnimationFrame для кроссбраузерности:
        // requestAnimationFrame
        // webkitRequestAnimationFrame
        // mozRequestAnimationFrame
        // oRequestAnimationFrame
        // msRequestAnimationFrame
        // function (callback) {
        //     window.setTimeout(callback, 1000 / 60);
        // }
    }

    // Метод, возвращающий контекст холста
    getContext()
    {
        return this._ctx;
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

    // Метод для добавления в конец очереди отрисовки новой рендер-функции
    addLayer(renderFunc)
    {
        this._renderQueue.push(renderFunc);
    }

    addTask(callback)
    {
        this._taskQueue.push(callback);
    }

    // Метод для запуска движка отрисовки
    renderEngineStart()
    {
        this._stopEngine = false;
        this._renderStep();
    }

    // Метод для остановки движка отрисовки
    renderEngineStop()
    {
        this._stopEngine = true;
    }

    // Метод для отрисовки кадра анимационного цикла
    _renderStep()
    {
        if (this._stopEngine)
            return;
        this._taskQueue.forEach(task => task());
        this.clear();
        this._renderQueue.forEach((control) => {
            control.render();
        });
        requestAnimationFrame(() => this._renderStep());
    }

    _mouseDown(event)
    {
        let x = event.offsetX;
        let y = event.offsetY;
        
        this._renderQueue.forEach((control) => {
            control.onPress(x, y);
        });
    }

    _mouseUp(event)
    {
        let x = event.offsetX;
        let y = event.offsetY;
        
        this._renderQueue.forEach((control) => {
            control.onRelease(x, y);
        });
    }
}