import { RandomIntInclusive } from '../utilities/Random.mjs';

// Класс игровой логики
export class BlastEngine
{
    constructor(cellsX, cellsY, variety, minGroup, superGroup)
    {
        this._cellsX = cellsX;          // Количество ячеек по оси X
        this._cellsY = cellsY;          // Количество ячеек по оси Y
        this._variety = variety - 1;    // Количество вариаций типов ячеек
        this._minGroup = minGroup;      // Минимальный размер группы
        this._superGroup = superGroup;  // Минимальный размер группы

        this._field = [];               // Будущий "двумерный" массив игрового поля
        this._empty_cell = -1;          // Тип, присваиваемый пустой ячейке
        this._group = undefined;        // Выбранная группа однотипных ячеек

        this.init();
        this.randomFill();
    }

    // Инициализация
    init()
    {
        for (let y = 0; y < this._cellsY; y++)
        {
            for (let x = 0; x < this._cellsX; x++)
            {
                let cell = {
                    type: this._empty_cell,     // Условный тип ячейки (изначально - пустая ячейка)
                    x: x,                       // Положение в сетке по X
                    y: y,                       // Положение в сетке по Y
                    dx: x,                      // Новое положение по X (при перемещении)
                    dy: y                       // Новое положение по Y (при перемещении)
                };
                this._field.push(cell);
            }
        }
    }

    // Метод заполнения поля случайным образом
    randomFill()
    {
        const refilment = this._field.filter(cell => cell.type === this._empty_cell);   // Получаем набор ячеек для обновления
        refilment.forEach(cell => cell.type = RandomIntInclusive(0, this._variety));    // Заполняем тип ячеек
        return refilment;
    }

    // Метод получения параметров ячейки по её адресу
    getCell(x, y)
    {
        return this._field.find(cell => cell.x == x && cell.y == y);
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
            type = this.getCell(cellX, cellY).type;
            // Рекурсивно вызываем этот же метод, но уже с типом и массивом группы
            return this._getGroup(cellX, cellY, type, group);
        }

        const cell = this.getCell(cellX, cellY);

        // Проверяем совпадение типов по переданным координатам
        if (cell.type != type)
            return group;
        
        // Если эти координаты уже проверялись ранее - пропускаем их обработку
        if (group.find(cell => cell.x == cellX && cell.y == cellY))
            return group;

        // Если добрались до этого места - добавляем ячейку в группу
        group.push({x: cellX, y: cellY});

        // Формируем массив для проверки соседних ячеек
        const adjacent = [
            {x: cellX + 1, y: cellY},
            {x: cellX - 1, y: cellY},
            {x: cellX, y: cellY + 1},
            {x: cellX, y: cellY - 1}
        ];

        // Рекурсивно вызываем метод для соседних ячеек
        adjacent.forEach(cell => this._getGroup(cell.x, cell.y, type, group));

        // На последней итерации вернём массив с координатами ячеек группы
        return group;
    }

    // Метод выдачи группы найденных ячеек во внешние интерфейсы
    getGroup(cellX, cellY)
    {
        this._group = this._getGroup(cellX, cellY);
        return this._group;
    }

    // Метод для получения строки
    getRow(cellX, cellY)
    {
        const group = [];

        for (let x = 0; x < this._cellsX; x++)
        {
            group.push({x: x, y: cellY});
        }
        this._group = group;
        return this._group;
    }

    // Метод сброса типа ячейки
    clearCell(x, y)
    {
        this.getCell(x, y).type = this._empty_cell;
    }

    // Метод сброса типов группы клеток
    clearGroup()
    {
        this._group.forEach(cell => this.clearCell(cell.x, cell.y));
    }

    // Метод проверки на пустую ячейку
    isEmpty(x, y)
    {
        return this.getCell(x, y).type == this._empty_cell;
    }

    // Метод смены местами двух ячеек
    swapCells(x1, y1, x2, y2)
    {
        let cell1 = this.getCell(x1, y1);
        let cell2 = this.getCell(x2, y2);

        cell1.x = x2;
        cell1.y = y2;

        cell2.x = x1;
        cell2.y = y1;
    }

    // Метод получения массива смещённых ячеек
    getChanges()
    {
        const changes = this._field.filter(cell => (cell.x != cell.dx || cell.y != cell.dy) && cell.type != this._empty_cell);
        return changes;
    }

    // Метод фиксирования положения ячеек (уравнивание x/y с dx/dy)
    fixChanges()
    {
        this._field.forEach(cell => {
            cell.dx = cell.x;
            cell.dy = cell.y;
        });
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

    // Метод для случайного перемешивания игрового поля
    shuffle()
    {
        this._field.forEach(cell => {
            let ind = RandomIntInclusive(0, this._field.length - 1);
            this.swapCells(cell.x, cell.y, this._field[ind].x, this._field[ind].y);
        });
    }

    // Метод поиска возможных ходов
    getMoves()
    {
        let moves = 0;
        let field_copy = this._field.slice(0);

        while (field_copy.length > 0)
        {

            const cell = field_copy[0];
            const group = this.getGroup(cell.x, cell.y);

            if (group.length >= this._minGroup)
                moves++;

            group.forEach(element => {
                field_copy = field_copy.filter(item => item.x != element.x || item.y != element.y)
            });
        }
        return moves;
    }
}