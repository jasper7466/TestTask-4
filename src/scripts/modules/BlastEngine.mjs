import { find } from "core-js/fn/array";

export class BlastEngine
{
    constructor(cellsX, cellsY, variety)
    {
        this._cellsX = cellsX;
        this._cellsY = cellsY;
        this._variety = variety;

        this._field = undefined;
    }

    randomFill()
    {
        const field = new Array();
        for (let i = 0; i < cellsX; i++)
        {
            field[i] = new Array();
            for (let j = 0; j < cellsY; j++)
            {
                arr[i][j] = null;
            }
        }
        this._field = field;
    }
}