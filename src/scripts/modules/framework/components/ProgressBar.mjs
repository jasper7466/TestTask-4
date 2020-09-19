// Импортируем базовый класс
import { BaseComponent } from './BaseComponent.mjs';

// Класс полосы загрузки
export class ProgressBar extends BaseComponent
{
    constructor()
    {
        super();
        this._progress = 0;         // Текущее значение прогресса
        this._progressX = 0;        // Точка начала отрисовки по X
        this._progressY = 0;        // Точка начала отрисовки по Y
        this._progressWidth = 0;    // Полная длина полосы
        this._progressStop = 0;     // Текущая длина полосы
        this._outerRadius = 0;      // Внешний радиус
        this._innerRadius = 0;      // Внутренний радиус
        this._bar = undefined;      // Спрайт шириной в 1px для формирования полосы
        this._border = 0;           // Зазор между границей подложки и полосы в px
    }

    // Метод пересчёта при изменении зависимых параметров
    _refresh()
    {
        super._refresh();

        this._outerRadius = this._height / 2;
        this._innerRadius = this._outerRadius - this._border;
        this._progressWidth = this._width - this._outerRadius * 2;
        this._progressX = this._dx + this._outerRadius;
        this._progressY = this._dy + this._outerRadius;
    }

    // Метод установки текущего значения прогресса
    setProgress(value)
    {
        if (value > 1)
            value = 1;

        this._progress = value;
        this._progressStop = this._progressWidth * value;
    }

    // Метод установки спрайта для формирования полосы прогресса
    setBarImage(img)
    {
        this._bar = img;
    }

    // Метод установки зазора между подложкой и полосой
    setBorder(border)
    {
        this._border = border;
        this._refresh();
    }

    // Метод для отрисовки полосы прогресса со скруглёнными краями
    _clipper(ctx, x, y, rad, width, drawer)
    {
        ctx.beginPath();
        ctx.arc(x, y, rad, Math.PI / 2, Math.PI + Math.PI / 2, false);            // Левая полуокружность
        ctx.arc(x + width, y, rad, Math.PI + Math.PI / 2, Math.PI / 2, false);    // Правая полуокружность
        ctx.closePath();
        ctx.save();
        ctx.clip();
        drawer();
        ctx.restore();
    }

    // Метод отрисовки
    render(ctx)
    {
        // Функция отрисовки полосы прогресса
        const drawer = () => ctx.drawImage(this._bar, this._dx, this._dy, this._width, this._height);
        
        // Отрисовываем фон
        this._clipper(ctx, this._progressX, this._progressY, this._outerRadius, this._progressWidth, () => super.render(ctx));

        // Отрисовываем полосу прогресса
        this._clipper(ctx, this._progressX, this._progressY, this._innerRadius, this._progressStop, drawer);
    }
}