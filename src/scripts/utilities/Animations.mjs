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

        control.alpha = value;
        if (value <= stop)
        {
            control.selfRemove();
            return true;
        }
        return false;
    }
}

export function move(x, y, speed, accel)
{
    let dirX = undefined;
    let dirY = undefined;

    return (control) => {

        if (dirX == undefined)
        {
            dirX = (control._x < x) ? 1 : -1;
            dirY = (control._y < y) ? 1 : -1;
        }

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