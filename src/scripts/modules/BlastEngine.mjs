import { RandomIntInclusive } from '../utilities/Random.mjs';

export class BlastEngine
{
    constructor(cellsX, cellsY, variety)
    {
        this._cellsX = cellsX;
        this._cellsY = cellsY;
        this._variety = variety - 1;

        this._field = undefined;
        this._empty_cell = -1;
        this._group = undefined;
    }

    randomFill()
    {
        const field = new Array();
        for (let i = 0; i < this._cellsX; i++)
        {
            field[i] = new Array();
            for (let j = 0; j < this._cellsY; j++)
            {
                let type = RandomIntInclusive(0, this._variety);
                field[i][j] = {
                    type: type,
                    x: i,
                    y: j,
                    dx: i,
                    dy: j
                };
            }
        }
        this._field = field;
    }

    _getGroup(cellX, cellY, type = undefined, group = [])
    {
        // Проверяем валидность координат (должны лежать в пределах сетки)
        const validX = cellX >= 0 && cellX < this._cellsX;
        const validY = cellY >= 0 && cellY < this._cellsY;
        if (!validX || !validY)
            return group;
        
        // Если это первый вызов метода - определяем искомый тип элементов группы
        if (type === undefined)
        {
            type = this._field[cellX][cellY].type;
            // Рекурсивно вызываем этот же метод, но уже с типом и массивом группы
            return this._getGroup(cellX, cellY, type, group);
        }

        // Проверяем совпадение типов по переданным координатам
        if (this._field[cellX][cellY].type !== type)
            return group;
        
        // Если эти координаты уже проверялись ранее - пропускаем их обработку
        const found = group.find(cell => cell.x === cellX && cell.y === cellY);
        if (found)
            return group;

        // Если добрались до этого места - добавляем ячейку в группу
        let cell = {x: cellX, y: cellY};
        group.push(cell);

        // Формируем массив для проверки соседних ячеек
        const adjacent = [
            {x: cellX + 1, y: cellY},
            {x: cellX - 1, y: cellY},
            {x: cellX, y: cellY + 1},
            {x: cellX, y: cellY - 1}
        ];

        // Рекурсивно вызываем метод для соседних ячеек
        adjacent.forEach( (item) => {
            this._getGroup(item.x, item.y, type, group);
        });

        // На последней итерации вернём массив с координатами ячеек группы
        return group;
    }

    getGroup(cellX, cellY)
    {
        this._group = this._getGroup(cellX, cellY);
        return this._group;
    }

    // Метод сброса типа клетки
    clearCell(x, y)
    {
        this._field[x][y].type = this._empty_cell;
    }

    // Метод сброса типов группы клеток
    clearGroup()
    {
        this._group.forEach(cell => this.clearCell(cell.x, cell.y));
    }

    // Метод проверки на пустую ячейку
    isEmpty(x, y)
    {
        return this._field[x][y].type === this._empty_cell;
    }

    isChanged(x, y)
    {
        let cell = this._field[x][y];
        console.log((cell.dx != x || cell.dy != y) && (cell.type != this._empty_cell));
        return (cell.dx != x || cell.dy != y) && (cell.type != this._empty_cell);
    }

    getCell(x, y)
    {
        return this._field[x][y];
    }

    // Метод смены местами двух ячеек
    swapCells(x1, y1, x2, y2)
    {
        let cell1 = this._field[x1][y1];
        let cell2 = this._field[x2][y2];

        this._field[x1][y1] = cell2;
        this._field[x2][y2] = cell1;
    }

    getChanges()
    {
        const changes = new Array();
        for (let x = 0; x < this._cellsX; x++)
        {
            for (let y = 0; y < this._cellsY; y++)
            {
                if (this.isChanged(x, y))
                {
                    this._field[x][y].dx = x;
                    this._field[x][y].dy = y;
                    changes.push(this._field[x][y]);
                }
            }
        }
        return changes;
    }

    fixChanges()
    {
        for (let x = 0; x < this._cellsX; x++)
        {
            for (let y = 0; y < this._cellsY; y++)
            {
                const cell = this._field[x][y];
                cell.x = cell.dx;
                cell.y = cell.dy;
            }
        }
    }

    collapse()
    {
        this.clearGroup();
        for (let x = 0; x < this._cellsX; x++)
        {
            let gap = 0;
            for (let y = this._cellsY-1; y >= 0; y--)
            {    
                if (this.isEmpty(x, y))
                {
                    gap++;
                    continue;
                }
                this.swapCells(x, y, x, y + gap);
            }
        }
    }
}