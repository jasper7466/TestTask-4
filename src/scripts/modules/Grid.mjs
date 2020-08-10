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

    addItem(type, cellX, cellY)
    {
        const img = this._sprites[type];
        const x = this._x + this._stepX * cellX + this._alignX;
        const y = this._y + this._stepY * cellY + this._alignY;
        const item = this._itemCreator(this._ctx, img, x, y, this._offsetX, this._offsetY, this._overfill);
        item.scale(this._item_scale);
        item.address.x = cellX;
        item.address.y = cellY;
        this._collection.push(item);

        this._collection.sort(this._offsetX < 0 ? ((a, b) => a._x > b._x ? 1 : -1) : ((a, b) => a._x < b._x ? 1 : -1));
        this._collection.sort(this._offsetY < 0 ? ((a, b) => a._y > b._y ? 1 : -1) : ((a, b) => a._y < b._y ? 1 : -1));
    }

    removeItem(cellX, cellY)
    {
        const item = this._collection.find(item => item.address.x === cellX && item.address.y === cellY);

        if (item)
            item.onRemove((...rest) => this.pullOffItem(...rest));
        else
            console.log('Item noy found');
    }

    pullOffItem(item)
    {
        this._collection = this._collection.filter(n => n != item);
    }

    render()
    {
        this._collection.forEach( (item) => item.render());
    }
}