import { RandomIntInclusive } from '../utilities/Random.mjs';

// Класс игровой логики
export class BlastEngine
{
    constructor(cellsX, cellsY, variety)
    {
        this._cellsX = cellsX;          // Количество ячеек по оси X
        this._cellsY = cellsY;          // Количество ячеек по оси Y
        this._variety = variety - 1;    // Количество вариаций типов ячеек

        this._field = undefined;        // Будущий "двумерный" массив игрового поля
        this._empty_cell = -1;          // Тип, присваиваемый пустой ячейке
        this._group = undefined;        // Выбранная группа однотипных ячеек
    }

    // Метод заполнения поля случайным образом
    randomFill()
    {
        const field = new Array();                  // Массив "столбцов"
        for (let i = 0; i < this._cellsX; i++)
        {
            field[i] = new Array();                 // Массив "строк"
            for (let j = 0; j < this._cellsY; j++)
            {
                let type = RandomIntInclusive(0, this._variety);
                field[i][j] = {
                    type: type,     // Условный тип ячейки
                    x: i,           // Положение в сетке по X
                    y: j,           // Положение в сетке по Y
                    dx: i,          // Новое положение по X (при перемещении)
                    dy: j           // Новое положение по Y (при перемещении)
                };
            }
        }
        this._field = field;
    }

    // Метод заполнения пустых ячеек
    refill()
    {
        const refilment = [];       // Вновь созданные ячейки

        for (let i = 0; i < this._cellsX; i++)
        {
            for (let j = 0; j < this._cellsY; j++)
            {
                if (this._field[i][j].type == this._empty_cell)
                {
                    const cell = {
                        type: RandomIntInclusive(0, this._variety),
                        x: i,
                        y: j,
                        dx: i,
                        dy: j
                    };
                    this._field[i][j] = cell;
                    refilment.push(cell);
                }
            }
        }
        return refilment;
    }

    // Метод рекурсивного поиска группы однотипных соседних ячеек по координатам одной ячейки
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

    // Метод выдачи группы найденных ячеек во внешние интерфейсы
    getGroup(cellX, cellY)
    {
        this._group = this._getGroup(cellX, cellY);
        return this._group;
    }

    // Метод сброса типа клетки
    _clearCell(x, y)
    {
        this._field[x][y].type = this._empty_cell;
    }

    // Метод сброса типов группы клеток
    clearGroup()
    {
        this._group.forEach(cell => this._clearCell(cell.x, cell.y));
    }

    // Метод проверки на пустую ячейку
    isEmpty(x, y)
    {
        return this._field[x][y].type === this._empty_cell;
    }

    // Метод проверки наличия изменений в координатах ячейки
    isChanged(x, y)
    {
        let cell = this._field[x][y];
        return (cell.dx != x || cell.dy != y) && (cell.type != this._empty_cell);
    }

    // Метод получения параметров ячейки по её адресу
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

    // Метод получения массива смещённых ячеек
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

    // Метод фиксирования положения ячеек (уравнивание x/y с dx/dy)
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

    // Метод смещения ячеек под действием "гравитации"
    collapse()
    {
        this.clearGroup();                              // Сбрасываем тип ячеек для выбранной группы
        for (let x = 0; x < this._cellsX; x++)          // Проход по столбцам
        {
            let gap = 0;                                // Инициализируем начальное значение "пропуска" между ячейками
            for (let y = this._cellsY-1; y >= 0; y--)   // Проход по строкам от нижней к верхней
            {    
                if (this.isEmpty(x, y))                 // Если нашли пустоту
                {
                    gap++;                              // то инкрементим счётчик пропусков
                    continue;                           // и выходим из итерации цикла
                }
                this.swapCells(x, y, x, y + gap);       // Если нашли занятую ячейку - смещаем её
            }
        }
    }
}