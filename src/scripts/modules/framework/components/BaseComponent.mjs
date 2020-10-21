// Класс базового компонента
export class BaseComponent
{
    constructor()
    {
        this._x = 0;                        // Положение по оси X
        this._y = 0;                        // Положение по оси Y
        this._dx = 0;                       // Положение точки отрисовки по X c учётом точки привязки
        this._dy = 0;                       // Положение точки отрисовки по Y с учётом точки привязки
        this._width = 0;                    // Ширина
        this._height = 0;                   // Высота
        this._anchorX = 0;                  // Точка привязки по оси X
        this._anchorY = 0;                  // Точка привязки по оси Y
        this._background = undefined;       // Фоновое изображение
        this._alpha = 1;                    // Прозрачность компонента
        // this._borders = {                   // Координаты границ
        //     leftTop: 0,
        //     rightTop: 0,
        //     leftBottom: 0,
        //     rightBottom: 0
        // };

        this._hitbox = {                    // Зона hitbox'а
            left: 0,                        // Применяется при обработке событий взаимодействия с компонентом
            right: 0,
            top: 0,
            bottom: 0
        };

        this._clickHandler = undefined;     // Коллбэк-обработчик события "клик"
        this._pressHandler = undefined;     // Коллбэк-обработчик события "нажатие"
        this._releaseHandler = undefined;   // Коллбэк-обработчик события "отпускание"
        this._hoverHandler = undefined;     // Коллбэк-обработчик события "наведение"
        this._hoverInHandler = undefined;   // Коллбэк-обработчик события "вхождение в зону"
        this._hoverOutHandler = undefined;  // Коллбэк-обработчик события "выход из зоны"

        this._removeHandler = undefined;    // Коллбэк-обработчик события "удаления компонента"

        this._isPressed = false;            // Флаг нажатия
        this._isHovered = false;            // Флаг нахождения курсора внутри хитбокса
        this._eEnabled = true;              // Флаг разрешения событий

        this._serialTaskQueue = [];         // Очередь последовательных задач
        this._parallelTaskQueue = [];       // Очередь параллельных задач
    }

    // Метод установки положения по обеим осям
    setPosition(x, y)
    {
        this._x = x;
        this._y = y;
        this._refresh();
    }

    // Метод пересчёта при изменении зависимых параметров
    _refresh()
    {
        // Песчитытваем точку отрисовки
        this._dx = this._x - this._width * this._anchorX;
        this._dy = this._y - this._height * this._anchorY;

        // this._borders.leftTop = this._dx;
        // this._borders.leftTop = this._dx;

        // // Вычисляем смещение относительно точки привязки
        // const aX = this._width * this._anchorX;
        // const aY = this._height * this._anchorY;

        // // Вычисляем абсолютное значение оффсетов для текущих параметров
        // const left = this._x + this._width * this._hitbox.left - aX;
        // const right = this._x + this._width - this._width * this._hitbox.right - aX;
        // const top = this._y + this._height * this._hitbox.top - aY;
        // const bottom = this._y + this._height - this._height * this._hitbox.bottom - aY;
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
        this._refresh();
    }

    // Метод установки положения по оси Y
    setY(value)
    {
        this._y = value;
        this._refresh();
    }

    // Метод установки размера
    setSize(width, height)
    {
        this._width = width;
        this._height = height;
        this._refresh();
    }

    // Метод получения размера
    getSize()
    {
        return {
            width: this._width,
            height: this._height
        };
    }

    // Метод установки якоря
    setAnchor(x, y)
    {
        this._anchorX = x;
        this._anchorY = y;
        this._refresh();
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
        this._refresh();
    }

    // Метод изменения размера под фоновое изображение
    resizeOnBackground()
    {
        this._width = this._background.width;
        this._height = this._background.height;
        this._refresh();
    }

    // Метод пропорционального изменения размера относительно размера фонового изображения
    scaleOnBackground(factor)
    {
        this._width = this._background.width * factor;
        this._height = this._background.height * factor;
        this._refresh();
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
        const left = this._dx + this._width * this._hitbox.left;
        const right = this._dx + this._width - this._width * this._hitbox.right;
        const top = this._dy + this._height * this._hitbox.top;
        const bottom = this._dy + this._height - this._height * this._hitbox.bottom;

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
        
        if (this._pressHandler && this._eEnabled)     // Вызываем обработчик нажатия
            this._pressHandler(this);
    }

    // Метод-обработчик события "отпускание"
    onRelease(x, y)
    {
        if (!this._isPressed)       // Если не находимся в "нажатом" состоянии - выходим
            return;
        
        this._isPressed = false;    // Если были нажаты - очищаем флаг

        if (this._releaseHandler && this._eEnabled)   // Вызываем обработчик отпускания
            this._releaseHandler(this);

        if (!this._isHit(x, y))     // Если не попали в хитбокс - выходим
            return;

        if (this._eEnabled)
            this._onClick();        // Если попали - значит был "клик"
    }

    // Метод-обработчик события "движение мыши"
    onMove(x, y)
    {
        let hit = this._isHit(x, y);        // Нахождение в зоне хитбокса

        if (!this._isHovered && hit)        // "Вход"
        {
            if (this._hoverInHandler && this._eEnabled)
            {
                this._isHovered = true;
                this._hoverInHandler();
            }
            return;
        }

        if (this._isHovered && !hit)        // "Выход"
        {
            if (this._hoverOutHandler && this._eEnabled)
            {
                this._isHovered = false;
                this._hoverOutHandler();
            }
            return;
        }

        if (this._isHovered && hit)         // "Внутри"
        {
            if (this._hoverHandler && this._eEnabled)
                this._hoverHandler();
            return;
        }
    }

    // Метод-обработчик события "клик"
    _onClick()
    {
        if (this._clickHandler && this._eEnabled)     // Вызываем обработчик клика
            this._clickHandler(this);
    }

    // Метод удаления компонента
    onRemove()
    {
        if (this._removeHandler && this._eEnabled)    // Вызываем обработчик удаления
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

    // Метод установки обработчика события входа курсора в зону хитбокса
    setHoverInHandler(callback)
    {
        this._hoverInHandler = callback;
    }

    // Метод установки обработчика события выхода курсора из зоны хитбокса
    setHoverOutHandler(callback)
    {
        this._hoverOutHandler = callback;
    }

    // Метод установки обработчика события нахождения курсора в зоне хитбокса
    setHoverHandler(callback)
    {
        this._hoverHandler = callback;
    }

    // Метод установки обработчика события нажатия
    setPressHandler(callback)
    {
        this._pressHandler = callback;
    }

    // Метод установки обработчика события отпускания
    setReleaseHandler(callback)
    {
        this._releaseHandler = callback;
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

    // Метод запрета событий
    disableEvents()
    {
        this._eEnabled = false;
    }

    // Метод разрешения событий
    enableEvents()
    {
        this._eEnabled = true;
    }

    // Метод отрисовки
    render(ctx)
    {
        // Применяем прозрачность компонента к контексту
        ctx.globalAlpha = this._alpha;

        // Выполняем проход по стеку параллельных задач
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
            ctx.drawImage(this._background, this._dx, this._dy, this._width, this._height);

        // Восстанавливаем значение прозрачности для контекста
        ctx.globalAlpha = this.alpha;
    }
}