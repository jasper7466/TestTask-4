import { RandomIntInclusive } from '../utilities/Random.mjs';

export class BlastEngine
{
    constructor(cellsX, cellsY, variety)
    {
        this._cellsX = cellsX;
        this._cellsY = cellsY;
        this._variety = variety - 1;

        this._field = undefined;
    }

    randomFill()
    {
        const field = new Array();
        for (let i = 0; i < this._cellsX; i++)
        {
            field[i] = new Array();
            for (let j = 0; j < this._cellsY; j++)
            {
                field[i][j] = RandomIntInclusive(0, this._variety);
            }
        }
        this._field = field;
    }

    getGroup(cellX, cellY, type = undefined, group = [])
    {
        // Проверяем валидность координат (должны лежать в пределах сетки)
        const validX = cellX >= 0 && cellX <= this._cellsX;
        const validY = cellY >= 0 && cellY <= this._cellsY;
        if (!validX || !validY)
            return group;
        
        // Если это первый вызов метода - определяем искомый тип элементов группы
        if (type === undefined)
        {
            type = this._field[cellX][cellY];
            // Рекурсивно вызываем этот же метод, но уже с типом и массивом группы
            return this.getGroup(cellX, cellY, type, group);
        }

        // Проверяем совпадение типов по переданным координатам
        if (this._field[cellX][cellY] !== type)
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
            this.getGroup(item.x, item.y, type, group);
        });

        // На последней итерации вернём массив с координатами ячеек группы
        return group;
    }
}