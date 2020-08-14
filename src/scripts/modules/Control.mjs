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
        this.address = {
            x: -1,
            y: -1
        };

        this._temp = 0;
        this._speed = 1;
        this._callback = undefined;
        this._animationQueue = [];

        this.alpha = 1;

        this._isPressed = false;
        this._clickHandler = undefined;
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
            x -= this._width * this._offsetX;
            y -= this._height * this._offsetY;
        }

        this._animationQueue.forEach((animationFunc) => {
            const isDone = animationFunc(this);

            if (isDone)
                this._animationQueue = this._animationQueue.filter(func => func != animationFunc);
        });

        this._ctx.globalAlpha = this.alpha;

        this._ctx.drawImage(this._img, x, y, this._width, this._height);

        // if (this._temp > 0)
        // {
        //     this._y += this._speed;
        //     this._temp--;
        //     this._speed = this._speed + 9.8/60;
        //     if (this._temp == 0)
        //         this._call(this);
        // }


        if (this._animationQueue.length == 0 && this._callback)
        {
            this._call(this);
        }
        
        this._ctx.globalAlpha = 1.0;
    }

    onRemove(callback)
    {
        this._temp = 60;
        this._call = callback;
    }

    mouseDown(x, y)
    {
        let stopX = this._x + this._width;
        let stopY = this._y + this._height;

        if (this._useOffset)
        {
            stopX -= this._width * this._offsetX;
            stopY -= this._height * this._offsetY;
        }

        if (x >= this._x && x <= stopX)
        {
            if (y >= this._y && y <= stopY)
            {
                this._isPressed = true;
            }
        }
    }

    mouseUp(x, y)
    {
        let stopX = this._x + this._width;
        let stopY = this._y + this._height;

        if (this._useOffset)
        {
            stopX -= this._width * this._offsetX;
            stopY -= this._height * this._offsetY;
        }

        if (x >= this._x && x <= stopX)
        {
            if (y >= this._y && y <= stopY)
            {
                if(this._isPressed)
                    this.onClick();
            }
        }
        this._isPressed = false;
    }

    onClick()
    {
        this._clickHandler(this);
    }

    addAnimation(callback)
    {
        this._animationQueue.push(callback);
    }
}