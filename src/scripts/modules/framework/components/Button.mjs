// Импортируем базовый класс
import { Label } from './Label.mjs';

// Класс кнопки
export class Button extends Label
{
    constructor(fontsize = 14, textcolor = '#00', font = 'serif', text = '')
    {
        super(fontsize, textcolor, font, text);

        this._baseImg = undefined;          // Базовый спрайт
        this._hoverImg = undefined;         // Спрайт при наведении
        this._pressImg = undefined;         // Спрайт при нажатии

        this.setHoverInHandler(() => {      // Меняем спрайт при наведении (с учётом нажатия)
            if (!this._isPressed && this._hoverImg)
                this.setBackgroundImage(this._hoverImg);
        });
        this.setHoverOutHandler(() => {     // Меняем спрайт при снятии наведения (с учётом нажатия)
            if (!this._isPressed && this._baseImg)
                this.setBackgroundImage(this._baseImg);
        });
        this.setPressHandler(() => {        // Меняем спрайт при нажатии
            if (this._pressImg)
                this.setBackgroundImage(this._pressImg);
        });
        this.setReleaseHandler(() => {      // Меняем спрайт при отпускании
            if (this._isHovered)
                this.setBackgroundImage(this._hoverImg);
            else
                this.setBackgroundImage(this._baseImg);
        });
    }

    // Метод установки базового спрайта
    setBaseImage(img)
    {
        this._baseImg = img;
        this.setBackgroundImage(img);
    }
    
    // Метод установки спрайта при наведении
    setHoverImage(img)
    {
        this._hoverImg = img;
    }

    // Метод установки спрайта при нажатии
    setPressImage(img)
    {
        this._pressImg = img;
    }
}