// Класс базового компонента
export class BaseComponent
{
    constructor(ctx)
    {
        this._ctx = ctx;                    // Контекст
        this._x = 0;                        // Положение по оси X
        this._y = 0;                        // Положение по оси Y
        this._width = 0;                    // Ширина
        this._height = 0;                   // Высота
        this._anchorX = 0;                  // Точка привязки по оси X
        this._anchorY = 0;                  // Точка привязки по оси Y
        this._background = undefined;       // Фоновое изображение
        this._alpha = 1;                    // Прозрачность компонента

        this._hitbox = {                    // Зона hitbox'а
            left: 0,                        // Применяется при обработке событий взаимодействия с компонентом
            right: 0,
            top: 0,
            bottom: 0
        };

        this._clickHandler = undefined;     // Коллбэк-обработчик события "клик"
        this._pressHandler = undefined;     // Коллбэк-обработчик события "нажатие"
        this._releaseHandler = undefined;   // Коллбэк-обработчик события "отпускание"
        this._hoverHandler = undefined;     // Коллбэк-обработчик события "парение"
        this._hoverInHandler = undefined;   // Коллбэк-обработчик события "вхождение в зону"
        this._hoverOutHandler = undefined;  // Коллбэк-обработчик события "выход из зоны"

        this._removeHandler = undefined;    // Коллбэк-обработчик события "удаления компонента"

        this._isPressed = false;            // Флаг нажатия
        this._isHoveredIn = false;          // Флаг нахождения курсора внутри хитбокса

        this._serialTaskQueue = [];         // Очередь последовательных задач
        this._parallelTaskQueue = [];       // Очередь параллельных задач
    }

    // Метод установки контекста
    setContext(ctx)
    {
        this._ctx = ctx;
    }

    // Метод установки положения по обеим осям
    setPosition(x, y)
    {
        this._x = x;
        this._y = y;
    }

    // Метод получения текущего положения
    getPosition()
    {
        return {
            x: this._x,
            y: this._y
        };
    }

    // Метод установки положения по оси X
    setX(value)
    {
        this._x = value;
    }

    // Метод установки положения по оси Y
    setY(value)
    {
        this._y = value;
    }

    // Метод установки размера
    setSize(width, height)
    {
        this._width = width;
        this._height = height;
    }

    // Метод получения размера
    getSize()
    {
        return {
            width: this._width = width,
            height: this._height = height
        };
    }

    // Метод установки якоря
    setAnchor(x, y)
    {
        this._anchorX = x;
        this._anchorY = y;
    }

    // Метод установки хитбокса
    setHitbox(left, right, top, bottom)
    {
        this._hitbox.left = left;
        this._hitbox.right = right;
        this._hitbox.top = top;
        this._hitbox.bottom = bottom;
    }

    // Метод установки фонового изображения
    setBackgroundImage(img)
    {
        this._background = img;
    }

    // Метод изменения размера под фоновое изображение
    resizeOnBackground()
    {
        this._width = this._background.width;
        this._height = this._background.height;
    }

    // Метод пропорционального изменения размера относительно размера фонового изображения
    scaleOnBackground(factor)
    {
        this._width = this._background.width * factor;
        this._height = this._background.height * factor;
    }

    // Метод пропорционального изменения размера относительно размера фонового изображения под заданную ширину
    scaleOnBackgroundWidth(width)
    {
        const factor = width / this._background.width;
        this.scaleOnBackground(factor);
    }

    // Метод пропорционального изменения размера относительно размера фонового изображения под заданную высоту
    scaleOnBackgroundHeight(height)
    {
        const factor = height / this._background.height;
        this.scaleOnBackground(factor);
    }

    // Метод проверки нахождения координат внутри хитбокса компонета
    _isHit(x, y)
    {
        // Вычисляем абсолютное значение оффсетов для текущих параметров
        const left = this._x + this._width * this._hitbox.left;
        const right = this._x + this._width - this._width * this._hitbox.right;
        const top = this._y + this._height * this._hitbox.top;
        const bottom = this._y + this._height - this._height * this._hitbox.bottom;

        const hitX = x >= left && x < right;
        const hitY = y >= top && y < bottom;

        if (hitX && hitY)
            return true;
        return false;
    }

    // Метод-обработчик события "нажатие"
    onPress(x, y)
    {
        if (!this._isHit(x, y))     // Если не попали в хитбокс - выходим
            return;

        this._isPressed = true;     // Иначе - выставляем флаг нажатия
        
        if (this._pressHandler)     // Вызываем обработчик нажатия (если задан)
            this._pressHandler(this);
    }

    // Метод-обработчик события "отпускание"
    onRelease(x, y)
    {
        if (!this._isPressed)       // Если не находимся в "нажатом" состоянии - выходим
            return;
        
        this._isPressed = false;    // Если были нажаты - очищаем флаг

        if (this._releaseHandler)   // Вызываем обработчик отпускания (если задан)
            this._releaseHandler(this);

        if (!this._isHit(x, y))     // Если не попали в хитбокс - выходим
            return;

        this._onClick();            // Если попали - значит был "клик"
    }

    // Метод-обработчик события "клик"
    _onClick()
    {
        if (this._clickHandler)     // Вызываем обработчик клика (если задан)
            this._clickHandler(this);
    }

    // Метод удаления компонента
    onRemove()
    {
        if (this._removeHandler)    // Вызываем обработчик удаления (если задан)
            this._clickHandler(this);
    }

    // Метод установки обработчика события клика
    setClickHandler(callback)
    {
        this._clickHandler = callback;
    }

    // Метод установки обработчика события клика
    setRemoveHandler(callback)
    {
        this._removeHandler = callback;
    }

    // Метод добавления функции в очередь параллельного выполнения
    addParallelTask(callback)
    {
        this._parallelTaskQueue.push(callback);
    }

    // Метод добавления функции в очередь последовательного выполнения
    addSerialTask(callback)
    {
        this._serialTaskQueue.push(callback);
    }

    // Метод, возвращающий размер очереди последовательного выполнения
    getSerialQueueSize()
    {
        return this._serialTaskQueue.length;
    }

    // Метод, возвращающий размер очереди параллельного выполнения
    getParallelQueueSize()
    {
        return this._parallelTaskQueue.length;
    }

    // Метод отрисовки
    render()
    {
        // Применяем прозрачность компонента к контексту
        this._ctx.globalAlpha = this._alpha;

        // Выполняем проход по очереди параллельных задач
        this._parallelTaskQueue.forEach(func => {
            if (func(this))    // Если задача завершена - удаляем её из очереди
                this._parallelTaskQueue = this._parallelTaskQueue.filter(f => f != func);
        });

        // Выполняем верхнюю задачу из стека последовательных задач
        if (this._serialTaskQueue.length > 0)
        {
            if (this._serialTaskQueue[0](this))
                this._serialTaskQueue.shift();
        }
        
        if (this._background != undefined)      // Если фоновое изображение задано
        {
            // Вычисляем параметры отрисовки с учётом точки привязки
            let x = this._x - this._width * this._anchorX;
            let y = this._y - this._height * this._anchorY;

            this._ctx.drawImage(this._background, x, y, this._width, this._height);
        }

        // Восстанавливаем значение прозрачности для контекста
        this._ctx.globalAlpha = this.alpha;
    }
}