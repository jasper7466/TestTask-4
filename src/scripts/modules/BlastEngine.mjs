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
}