export class Grid
{
    constructor(ctx, x, y, width, height, cellsX, cellsY, itemCreator, sprites, offsetX = 0, offsetY = 0, overfill = false)
    {
        this._ctx = ctx;
        this._x = x;
        this._y = y;
        this._width = width;
        this._height = height;
        this._cellsX = cellsX;
        this._cellsY = cellsY;
        this._itemCreator = itemCreator;
        this._overfill = overfill;
        this._offsetX = offsetX;
        this._offsetY = offsetY;
        this._sprites = sprites;
        this._item_scale = 1;
        this._alignX = 0;
        this._alignY = 0;
        this._remove_queue = [];

        this._collection = [];

        this._init();
    }

    _init()
    {
        const sample = this._itemCreator(this._ctx, this._sprites[0], 0, 0, this._offsetX, this._offsetY);
        const shadows = true;

        this._item_scale = sample.autoScale(this._width, this._height, this._cellsX, this._cellsY, !this._overfill);

        this._stepX = sample.getEffectiveWidth();
        this._stepY = sample.getEffectiveHeight();

        this._alignX = (this._width - this._stepX * this._cellsX) / 2;
        this._alignY = (this._height - this._stepY * this._cellsY) / 2;
    }

    addToRemove(item)
    {
        this._remove_queue.push(item);
    }

    addItem(type, cellX, cellY)
    {
        const img = this._sprites[type];
        const x = this._x + this._stepX * cellX + this._alignX;
        const y = this._y + this._stepY * cellY + this._alignY;
        const item = this._itemCreator(this._ctx, img, x, y, this._offsetX, this._offsetY, this._overfill);

        // item.setRemover(value => this.addToRemove(value));
        item.setRemover(value => this.pullOffItem(value));

        item.scale(this._item_scale);
        item.address.x = cellX;
        item.address.y = cellY;
        this._collection.push(item);

        this._collection.sort(this._offsetX < 0 ? ((a, b) => a._x > b._x ? 1 : -1) : ((a, b) => a._x < b._x ? 1 : -1));
        this._collection.sort(this._offsetY < 0 ? ((a, b) => a._y > b._y ? 1 : -1) : ((a, b) => a._y < b._y ? 1 : -1));
    }

    getItem(cellX, cellY)
    {
        const item = this._collection.find(item => item.address.x === cellX && item.address.y === cellY);

        if (item)
            return item;
        else
        {
            console.log(`Item not found. X = ${cellX}, Y = ${cellY}`);
            return false;
        }
    }

    removeItem(cellX, cellY)
    {
        const item = this.getItem(cellX, cellY);
        
        if (item)
        {
            item.onRemove((...rest) => this.pullOffItem(...rest));
            return true;
        }
        return false;
    }

    pullOffItem(item)
    {
        this._collection = this._collection.filter(element => element != item);
    }

    mouseDown(x, y)
    {
        this._collection.forEach((item) => {
            item.mouseDown(x, y);
        });
    }

    mouseUp(x, y)
    {
        this._collection.forEach((item) => {
            item.mouseUp(x, y);
        });
    }

    render()
    {
        // this._remove_queue.forEach(item => this.pullOffItem(item));
        // this._remove_queue = [];
        this._collection.forEach(item => item.render());
    }
}