export class Control
{
    constructor(ctx, img, x, y, offsetX = 0, offsetY = 0)
    {
        this._ctx = ctx;
        this._img = new Image();
        this._img.src = img.src;
        this._x = x;
        this._y = y;
        this._dx = img.width;
        this._dy = img.height;
        this._offsetX = offsetX;
        this._offsetY = offsetY;
        this._realRatio = img.width / img.height;
        this._effectiveRatio = (img.width + offsetX) / (img.height + offsetY);
    }

    getRatio()
    {
        return this._ratio;
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
        let x = this._x;// - (this._x - this._x * this._offsetX);
        let y = this._y;// - (this._dy - this._dy * this._offsetY);

        this._ctx.drawImage(this._img, x, y, this._dx, this._dy);
    }
}