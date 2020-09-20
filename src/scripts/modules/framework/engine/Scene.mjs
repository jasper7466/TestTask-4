// Базовый класс для создания сцен
export class Scene
{
    constructor()
    {
        this.collection = {};           // Коллекция элементов сцены
        this._eEnabled = true;          // Глобальный флаг разрешения событий любого типа
        this._initialised = false;      // Флаг инициализации сцены
    }

    // Метод инициализации сцены
    init()
    {
        this._initialised = true;
    }

    // Метод проверки инициализации
    isInit()
    {
        return this._initialised;
    }

    // Метод добавления элемента в сцену
    addComponent(name, instance)
    {
        this.collection[name] = instance;
    }

    // Обработчик события нажатия
    onPress(x, y)
    {
        for (let item in this.collection)
        {
            this.collection[item].onPress(x, y);
        }
    }

    // Обработчик события отпускания
    onRelease(x, y)
    {
        for (let item in this.collection)
        {
            this.collection[item].onRelease(x, y);
        }
    }

    // Обработчик события движения мыши
    onMove(x, y)
    {
        for (let item in this.collection)
        {
            this.collection[item].onMove(x, y);
        }

    }

    // Метод запрета событий сцены
    disableEvents()
    {
        this._eEnabled = false;
    }

    // Метод разрешения событий сцены
    disableEvents()
    {
        this._eEnabled = true;
    }

    // Метод рендеринга сцены
    render(ctx)
    {
        for (let item in this.collection)
        {
            this.collection[item].render(ctx);
        }
    }
}