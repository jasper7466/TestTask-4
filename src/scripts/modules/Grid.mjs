export class Grid
{
    constructor(ctx, x, y, width, height, cellsX, cellsY, creator, img, offsetX = 1, offsetY = 1, variations = 0)
    {
        // this._ctx = ctx;
        // this._y = y;
        // this._x = x;
        // this._width = width;
        // this._height = height;
        // this._cellsX = cellsX;
        // this._cellsY = cellsY;
        this._itemCreator = creator;
        // this._img = img;
    
        // this._offsetX = offsetX;
        // this._offsetY = offsetY;

        let container = [];

        // Полезный размер тайла
        let realTileWidth = img.width - img.width * offsetX;
        let realTileHeight = img.height - img.height * offsetY;

        // Полезное соотношение сторон
        let realTileRatio = realTileWidth / realTileHeight;

        // Соотношение узлов сетки и её размеров
        let gridRatio = (cellsX * width) / (cellsY * height);

        // Максимальная реальная сторона тайла
        let newrealTileWidth = 0;
        let newrealTileHeight = 0;
        let scale_factor = 0;

        // Определяем наибольшую сторону сетки с учётом стороны тайла и масштабируем тайлы
        if (realTileRatio <= gridRatio)
        {
            newrealTileHeight = height / (cellsY + offsetY);
            scale_factor = newrealTileHeight / realTileHeight;
            newrealTileWidth = realTileWidth * scale_factor;
        }
        else
        {
            newrealTileWidth = width / (cellsX + offsetX);
            scale_factor = newrealTileWidth / realTileWidth;
            newrealTileHeight = realTileHeight * scale_factor;
        }
        
        let iComp = i => (offsetX <= 0) ? (i < cellsX) : (i >= 0);
        let jComp = j => (offsetY <= 0) ? (j < cellsY) : (j >= 0);

        let iCount = (a) => (offsetX <= 0) ? (a + 1) : (a - 1);
        let jCount = (a) => (offsetY <= 0) ? (a + 1) : (a - 1);

        for (let i = (offsetX <= 0) ? 0 : (cellsX - 1); iComp(i); i = iCount(i))
        {
            for (let j = (offsetY <= 0) ? 0 : (cellsY - 1); jComp(j); j = jCount(j))
            {
                let tx = i * newrealTileWidth;
                let ty = j * newrealTileHeight;
                
                const tile = this._itemCreator(ctx, img, x + tx, y + ty, offsetX, offsetY);
                tile.scale(scale_factor);
                container.push(tile);
            }
        }

        container.forEach( (item) => {
            item.render();
            item._x = item._x + 3;
            item._y = item._y + 3;
        });
        
    }
}