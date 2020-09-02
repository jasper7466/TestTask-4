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
        
        let pos = control.getPosition();    // Получаем текущее положение

        // Выполняем смещение
        pos.x += dirX * (speed + accel) / 60;
        pos.y += dirY * (speed + accel) / 60;

        control.setPosition(pos.x, pos.y);

        if (pos.x * dirX > x * dirX)
            control.setX(x);
            
        if (pos.y * dirY > y * dirY)
            control.setY(y);

        if (control._x == x && control._y == y)
            return true;
        return false;
    }
}