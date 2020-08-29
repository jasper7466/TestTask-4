// "Затухание" (изменение прозрачности)
export function fade(start, stop, speed, accel)
{
    let value = start;
    if (stop < 0)
        stop = 0;

    return control => {
        value -= (speed + accel) / 60;
        
        if (value < stop)
            value = stop;

        control._alpha = value;
        if (value <= stop)
        {
            return true;
        }
        return false;
    }
}

// Функция перемещения компонента в заданные координаты
export function move(x, y, speed, accel)
{
    let dirX = undefined;       // Направление движения по X
    let dirY = undefined;       // Направление движения по Y

    return (control) => {

        if (dirX == undefined)  // Определяем направления (знак)
        {
            dirX = (control._x < x) ? 1 : -1;
            dirY = (control._y < y) ? 1 : -1;
        }
        
        // Выполняем смещение
        control._x += dirX * (speed + accel) / 60;
        control._y += dirY * (speed + accel) / 60;

        if (control._x < x)
            control._x = x;
            
        if (control._y > y)
            control._y = y;

        if (control._x == x && control._y == y)
            return true;
        return false;
    }
}