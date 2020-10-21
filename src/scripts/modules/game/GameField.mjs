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

    // Метод получения группы
    getGroup(state)
    {
        const x = state.address.x;
        const y = state.address.y;
        const boosted = state.isBoosted;

        let group = [];

        if (boosted)                                // Если включен режим "Бустер"
        {
            group = this._logicField.getRadius(x, y, config.boostR);
        }
        else                                                // Если обычный тайл или "супер-тайл"
        {
            if (this._logicField.isSupercell(x, y))
                group = this._logicField.getCross(x, y);
            else
                group = this._logicField.getGroup(x, y);
        }

        group = group.map(element => this._visualField.getCell(element.x, element.y).instance);   // Получаем ячейки

        return group;
    }

    // Метод для удаления группы
    removeGroup(group)
    {
        if (group.some(element => {return element.getSerialQueueSize() > 0}))
            return true;

        group.forEach(element => this._visualField.removeItem(element));
        return false;
    }

    // Метод перемешивания поля
    shuffle()
    {
        const changes = [];             // Массив перемещаемых ячеек

        this._logicField.shuffle();                                                 // Перемешиваем логическое поле
        this._logicField.getField().forEach(cell => {
            const tile = this._visualField.getCell(cell.dx, cell.dy);               // Получаем ячейку
            let loc = this._visualField.getCellLocation(cell.x, cell.y);            // Получаем новые координаты
            tile.instance.addSerialTask(move(loc.x, loc.y, 100, 300));      // Запускаем анимацию перемещения
            tile.updateX = cell.x;                                          // Задём координаты для обновления
            tile.updateY = cell.y;
            changes.push(tile);                                             // Складываем в массив
        });
        return changes;
    }
}