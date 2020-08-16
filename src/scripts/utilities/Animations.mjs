// "Затухание" (изменение прозрачности)
export function fade(start, stop, speed, accel)
{
    let value = start;
    if (stop < 0)
        stop = 0;

    return (control) => {
        value -= (speed + accel) / 60;
        
        if (value < stop)
            value = stop;

        control.alpha = value;
        if (value <= stop)
            return true;
        return false;
    }
}