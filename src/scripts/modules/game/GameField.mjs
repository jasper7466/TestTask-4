import { BaseComponent } from '../framework/components/BaseComponent';
import { config } from './config';
import { move } from '../../utilities/Animations';

// Класс, объединяющий в себе отрисовываемое и виртуальное игровые поля
export class GameField
{
    constructor(logic, field, sprites, clickHandler)
    {
        this._logicField = logic;               // Виртуальное поле
        this._visualField = field;              // Отрисовываемое поле
        this._sprites = sprites;                // Массив со спрайтами
        this._clickHandler = clickHandler       // Обработчик клика по тайлу

        this._logicField.init();                // Инициализруем виртуальное поле
    }

    // Метод создания визуального элемента "Тайл"
    tileCreator(arr, index = undefined)
    {
        if (index < 0 || index === undefined)
            return undefined;
    
        // Создаём компонент
        const tile = new BaseComponent();
        tile.setBackgroundImage(arr[index]);    // Устанавливаем фоновое изображение
        tile.resizeOnBackground();              // Устанавливаем размер как у фонового изображения
        tile.setAnchor(...config.tileAnchor);   // Задаём точку привязки
    
        return tile;
    }
    
    // Метод для заполнения пустых клеток случайным образом
    refill()
    {
        const refillment = this._logicField.randomFill();    // Массив добавленных тайлов
        refillment.forEach(cell => {
            const tile = this.tileCreator(this._sprites, this._logicField.getCell(cell.x, cell.y).type);    // Создаём тайл
            tile.setClickHandler(this._clickHandler());                                                     // Вешаем обработчик события "клик"
            this._visualField.addItem(tile, cell.x, cell.y);                                                // Помещаем в узел сетки
            const loc = this._visualField.getCellLocation(cell.x, cell.y);
            tile.setY(-100 - cell.y * this._visualField._stepY);           // FIXME:
            tile.addSerialTask(move(loc.x, loc.y, 100, 600));
        });
        return refillment;
    }
}