export class Screen
{
    constructor(container, width, height, background_color = undefined)
    {
        this._container = container;                        // Родительский DOM-узел
        this._canvas = document.createElement('canvas');    // Холст
        this._canvas.width = width;                         // Ширина
        this._canvas.height = height;                       // Высота
        this._ctx = this._canvas.getContext('2d');          // Контекст
        this._renderQueue = [];                             // Очередь рендер-функций слоёв
        this._taskQueue = [];                               // Очередь прочих функций для циклического выполнения
        this._stopEngine = true;                            // Флаг остановки движка отрисовки
        this._background_color = background_color;          // Цвет фона

        // На случай, если браузер не поддерживает тег <canvas>
        this._canvas.textContent = 'Sorry, but your browser is not supported :(';

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
        // this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
        this._ctx.fillStyle = this._background_color;
        this._ctx.fillRect(0, 0, this._canvas.width, this._canvas.height);
    }

    // Метод для добавления в конец очереди отрисовки новой рендер-функции
    addLayer(renderFunc)
    {
        this._renderQueue.push(renderFunc);
    }

    // Метод добаления задания в очередь на циклическое выполнение
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
        if (this._stopEngine)                                   // Выходим, если движок остановлен
            return;
        this._taskQueue.forEach(task => task());                // Выполняем задания из очереди
        this.clear();                                           // Чистим холст
        this._renderQueue.forEach(control => control.render()); // Отрисовываем элементы
        requestAnimationFrame(() => this._renderStep());
    }

    // Обработчик события нажатия кнопки мыши
    _mouseDown(event)
    {
        let x = event.offsetX;
        let y = event.offsetY;
        
        this._renderQueue.forEach(control => control.onPress(x, y));
    }

    // Обработчик события отпускания кнопки мыши
    _mouseUp(event)
    {
        let x = event.offsetX;
        let y = event.offsetY;
        
        this._renderQueue.forEach(control => control.onRelease(x, y));
    }
}