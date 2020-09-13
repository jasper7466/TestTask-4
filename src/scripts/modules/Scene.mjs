// Базовый класс для создания сцен
export class Scene
{
    constructor()
    {
        this.collection = {};           // Коллекция элементов сцены
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

    onMove(x, y)
    {
        for (let item in this.collection)
        {
            this.collection[item].onMove(x, y);
        }

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