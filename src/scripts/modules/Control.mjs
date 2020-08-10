export class Control
{
    constructor(ctx, img, x, y, offsetX = 0, offsetY = 0, useOffset = false)
    {
        this._ctx = ctx;
        this._img = new Image();
        this._img.src = img.src;
        this._x = x;
        this._y = y;
        this._width = img.width;
        this._height = img.height;
        this._offsetX = Math.abs(offsetX);
        this._offsetY = Math.abs(offsetY);
        this._useOffset = useOffset;
    }

    getWidth()
    {
        return this._width;
    }

    getHeight()
    {
        return this._height;
    }

    getRatio()
    {
        let ratio = img.width / img.height;
        return ratio;
    }

    getEffectiveWidth()
    {
        let eWidth = this._width * (1 - this._offsetX);
        return eWidth;
    }

    getEffectiveHeight()
    {
        let eHeight = this._height * (1 - this._offsetY);
        return eHeight;
    }

    getEffectiveRatio()
    {
        let eRatio = this.getEffectiveWidth() / this.getEffectiveHeight();
        return eRatio;
    }

    autoScale(width, height, cellsX, cellsY, overfill = false)
    {
        let scale = 0;
        let offsetX = 0;
        let offsetY = 0;
        let scaleX = 0;
        let scaleY = 0;

        if(overfill)
        {
            offsetX = this._offsetX;
            offsetY = this._offsetY;
        }

        scaleX = width / (cellsX + offsetX) / this.getEffectiveWidth();
        scaleY = height / (cellsY + offsetY) / this.getEffectiveHeight();
        
        scale = Math.min(scaleX, scaleY);

        this.scale(scale);

        return scale;
    }

    getOffsetX()
    {
        let offset = this._width * this._offsetX;
        return offset;
    }

    getOffsetY()
    {
        let offset = this._height * this._offsetY;
        return offset;
    }

    scale(factor)
    {
        this._width = this._img.width * factor;
        this._height = this._img.height * factor;
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
        let x = this._x;
        let y = this._y;

        if (this._useOffset)
        {
            x -= this._height * this._offsetX;
            y -= this._height * this._offsetY;
        }
        this._ctx.drawImage(this._img, x, y, this._width, this._height);
    }
}