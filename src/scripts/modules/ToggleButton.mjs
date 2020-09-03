// Импортируем родительский класс
import { Button } from './Button.mjs';

// Класс кнопки
export class ToggleButton extends Button
{
    constructor(ctx, fontsize = 14, textcolor = '#00', font = 'serif', text = '')
    {
        super(ctx, fontsize, textcolor, font, text);

        this._isFixed = false;              // Состояние фиксации
    }

    // Метод получения состояния кнопки
    getState()
    {
        return this._isFixed;
    }

    // Метод установки состояния "зафиксирована"
    fix()
    {
        this._isFixed = true;
    }

    // Метод сброса состояния фиксации
    reset()
    {
        this._isFixed = false;
    }

    // Переопределённый метод-обработчик события "клик"
    _onClick()
    {
        this._isFixed = !this._isFixed;     // Переключаем фиксацию
        super._onClick();
    }

    // Переопределённый метод отрисовки
    render()
    {
        if (this._isFixed)
            this.setBackgroundImage(this._pressImg);
        super.render();
    }
}