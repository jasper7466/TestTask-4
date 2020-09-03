// Импортируем базовый класс
import { BaseComponent } from './BaseComponent.mjs';

// Класс контейнера для размещения элементов
export class Container extends BaseComponent
{
    constructor(direction = 'row')
    {
        super();
        
        this._direction = direction;
        this._collection = [];      // Массив элементов контейнера
    }

    // Метод инициализации
    init()
    {

    }

    // Метод добавления элемента
    addItem(item)
    {
        this._collection.push(item);

        let count = this._collection.length;

        switch(this._direction)
        {
            case 'row':
                {
                    
                }
        }

    }

    // Переопределённый метод отрисовки
    render()
    {
        super.render();
        this._collection.forEach(item => item.render());
    }
}