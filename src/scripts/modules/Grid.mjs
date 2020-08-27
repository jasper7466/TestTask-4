// Импортируем базовый класс
import { BaseComponent } from './BaseComponent.mjs';

export class Grid extends BaseComponent
{
    constructor(cellsX, cellsY, ratio = 1)
    {
        super();
        this._cellsX = cellsX;      // Размер сетки по оси x (количество столбцов)
        this._cellsY = cellsY;      // Размер сетки по оси y (количество строк)
        this._ratio = ratio;        // Отношение сторон ячейки сетки

        this._collection = [];      // Хранилище элементов сетки
        this._stepX = 0;            // Шаг сетки по оси x
        this._stepY = 0;            // Шаг сетки по оси y

        this._removeQueue = [];     // Очередь на удаление

        this._eventPropagation = true;      // Флаг разрешения погружения событий
    }

    // Метод пересчёта шага сетки
    _gridRecalc()
    {
        this._stepX = this._width / this._cellsX;
        this._stepY = this._height / this._cellsY;
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

    updateItems()
    {
        this._collection.forEach(element => {
            if (element.updateX != undefined)
                element.cellX = element.updateX;

            if (element.updateY != undefined)
                element.cellY = element.updateY;
        });
    }

    addItem(instance, cellX, cellY)
    {
        const x = this._stepX * cellX;
        const y = this._stepY * cellY;

        instance.setContext(this._ctx);
        instance.setPosition(x, y);
        instance.scaleOnBackgroundWidth(this._stepX);   // FIXME:

        const item = {
            instance: instance,
            cellX: cellX,
            cellY: cellY,
            updateX: undefined,
            updateY: undefined
        };

        this._collection.push(item);

        // this._collection.sort(this._offsetX < 0 ? ((a, b) => a._x > b._x ? 1 : -1) : ((a, b) => a._x < b._x ? 1 : -1));
        // this._collection.sort(this._offsetY < 0 ? ((a, b) => a._y > b._y ? 1 : -1) : ((a, b) => a._y < b._y ? 1 : -1));
    }

    getCell(cellX, cellY)
    {
        const item = this._collection.find(item => item.cellX === cellX && item.cellY === cellY);
        return item;
    }
    // Метод получения указателя на содержимое ячейки по её координатам
    getInstance(cellX, cellY)
    {
        const cell = this.getCell(cellX, cellY);
        return cell.instance;
    }

    removeItem(item)
    {
        this._removeQueue.push(item);
    }

    onPress(x, y)
    {
        super.onPress(x, y);
        if (this._eventPropagation)
            this._collection.forEach(item => item.instance.onPress(x, y));
    }

    onRelease(x, y)
    {
        super.onRelease(x, y);
        if (this._eventPropagation)
            this._collection.forEach(item => item.instance.onRelease(x, y));
    }

    stopEventPropagation()
    {
        this._eventPropagation = false;
    }

    allowEventPropagation()
    {
        this._eventPropagation = true;
    }

    render()
    {
        this._removeQueue.forEach(item => {
            item.onRemove();
            this._collection = this._collection.filter(element => element.instance != item);
        });

        this._removeQueue = [];
        
        super.render();
        this._collection.forEach(item => item.instance.render());

        // FIXME: DEBUG
        // this._ctx.font = "18px serif";
        // this._ctx.fillStyle = "#FF00FF"
        // this._collection.forEach(element => {
        //     this._ctx.fillText(`(${element.cellX}:${element.cellY})`, this._stepX * element.cellX, this._stepY * element.cellY + 20);
        // });
    }
}