// Импортируем базовый класс
import { BaseComponent } from './BaseComponent.mjs';

// Класс контейнера-сетки
export class Grid extends BaseComponent
{
    constructor(ctx, cellsX, cellsY, ratio = 1)
    {
        super(ctx);
        this._cellsX = cellsX;      // Размер сетки по оси x (количество столбцов)
        this._cellsY = cellsY;      // Размер сетки по оси y (количество строк)
        this._ratio = ratio;        // Отношение сторон ячейки сетки

        this._collection = [];      // Хранилище элементов сетки
        this._stepX = 0;            // Шаг сетки по оси x
        this._stepY = 0;            // Шаг сетки по оси y
        this._paddingV = 0.1;         // Внутренний отступ по вертикали
        this._paddingH = 0.1;         // Внутренний отступ по горизонтали

        this._removeQueue = [];     // Очередь на удаление

        this._eventPropagation = true;      // Флаг разрешения погружения событий
    }

    // Метод пересчёта шага сетки
    _gridRecalc()
    {
        this._stepX = (this._width - this._width * this._paddingH) / this._cellsX;
        this._stepY = (this._height - this._height * this._paddingV) / this._cellsY;
        // this._alignX = (this._width - this._stepX * this._cellsX) / 2;
        // this._alignY = (this._height - this._stepY * this._cellsY) / 2;
    }

    // Метод установки размеров контейнера
    setSize(x, y)
    {
        super.setSize(x, y);
        this._gridRecalc();
    }

    // Метод получения координат элемента по указателю на него
    getInstanceAddress(instance)
    {
        const item = this._collection.find(element => element.instance === instance);
        const address = {
            x: item.cellX,
            y: item.cellY
        };
        return address;
    }

    // Метод обновления адресов элементов (при необходимости)
    updateItems()
    {
        this._collection.forEach(element => {
            if (element.updateX != undefined)
                element.cellX = element.updateX;

            if (element.updateY != undefined)
                element.cellY = element.updateY;
        });
    }

    // Метод добавления элемента
    addItem(instance, cellX, cellY)
    {
        const loc = this.getCellLocation(cellX, cellY);

        instance.setContext(this._ctx);
        instance.setPosition(loc.x, loc.y);
        instance.scaleOnBackgroundWidth(this._stepX);   // FIXME:

        const item = {
            instance: instance,     // Ссылка на сущность
            cellX: cellX,           // Адрес по X
            cellY: cellY,           // Адрес по Y
            updateX: undefined,     // Новый адрес по X (для обновления)
            updateY: undefined      // Новый адрес по Y (для обновления)
        };

        this._collection.push(item);
        this._collection.sort((a, b) => b.cellY - a.cellY);     // FIXME: частный случай
    }

    // Метод получения ячейки по её координатам
    getCell(cellX, cellY)
    {
        const item = this._collection.find(item => item.cellX === cellX && item.cellY === cellY);
        return item;
    }

    // Метод получения указателя на сущность из ячейки по её координатам
    getInstance(cellX, cellY)
    {
        const cell = this.getCell(cellX, cellY);
        return cell.instance;
    }

    // Метод получения координат узла
    getCellLocation(cellX, cellY)
    {
        return {
            x: this._x + this._stepX * cellX + this._width * this._paddingV / 2,
            y: this._y + this._stepY * cellY + this._height * this._paddingH / 2
        };
    }

    // Метод добаления элемента в очередь на удаление
    removeItem(item)
    {
        this._removeQueue.push(item);
    }

    // Обработчик события нажатия
    onPress(x, y)
    {
        super.onPress(x, y);
        if (this._eventPropagation)
            this._collection.forEach(item => item.instance.onPress(x, y));
    }

    // Обработчик события отпускания
    onRelease(x, y)
    {
        super.onRelease(x, y);
        if (this._eventPropagation)
            this._collection.forEach(item => item.instance.onRelease(x, y));
    }

    // Метод запрета распространения событий к элементам
    stopEventPropagation()
    {
        this._eventPropagation = false;
    }

    // Метод разрешения распространения событий к элементам
    allowEventPropagation()
    {
        this._eventPropagation = true;
    }

    // Метод отрисовки
    render()
    {
        // Удаляем элементы, стоящие в очереди
        this._removeQueue.forEach(item => {
            item.onRemove();
            this._collection = this._collection.filter(element => element.instance != item);
        });

        this._removeQueue = [];     // Очищаем очередь на удаление
        
        super.render();

        // Инициируем отрисовку сущностей из ячеек
        this._collection.forEach(item => item.instance.render());

        // FIXME: DEBUG
        // this._ctx.font = "18px serif";
        // this._ctx.fillStyle = "#FF00FF"
        // this._collection.forEach(element => {
        //     this._ctx.fillText(`(${element.cellX}:${element.cellY})`, this._stepX * element.cellX, this._stepY * element.cellY + 20);
        // });
    }
}