// Импортируем базовый класс
import { BaseComponent } from './BaseComponent.mjs';

// Класс метки для вывода текста
export class Label extends BaseComponent
{
    constructor(ctx, fontsize = 14, textcolor = '#00', font = 'serif', text = '')
    {
        super(ctx);
        this._fontsize = fontsize;
        this._font = font;
        this._baseline = 'middle';
        this._textcolor = textcolor;
        this.setText(text);
    }

    setText(text)
    {
        this._text = text.toString();
    }

    // Переопределённый метод отрисовки
    render()
    {
        super.render();
        this._ctx.font = `${this._fontsize}px ${this._font}`;   // Задём размер текста и шрифт
        this._ctx.fillStyle = this._textcolor;                  // Задаём цвет
        this._ctx.textBaseline = this._baseline;                // Центрируем по средней линии
        
        let meas = this._ctx.measureText(this._text);           // Измеряем длину текста
        let x = this._x + (this._width - meas.width) / 2;       // Центрируем по горизонтали
        let y = this._y + this._height / 2;                     // Центрируем по вертикали
        
        x -= this._width * this._anchorX;                       // Учитываем точку привязки по X
        y -= this._height * this._anchorY;                      // Учитываем точку привязки по Y

        this._ctx.fillText(this._text, x, y);                   // Выводим
    }
}