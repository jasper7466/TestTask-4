export class Control
{
    constructor(ctx, img, x, y)
    {
        this._ctx = ctx;
        this._img = new Image();
        this._img.src = img.src;
        this._x = x;
        this._y = y;
        this._dx = img.width;
        this._dy = img.height;
    }

    scale(factor)
    {
        this._dx = this._img.width * factor;
        this._dy = this._img.height * factor;
    }

    scaleWidth(width)
    {
        let factor = width / this._img.width;
        this.scale(factor);
    }

    scaleHeight(height)
    {
        let factor = height / this._img.height;
        this.scale(factor);
    }

    render()
    {
        this._ctx.drawImage(this._img, this._x, this._y, this._dx, this._dy);
    }
}