// Класс базового компонента
import { BaseComponent } from '../modules/framework/components/BaseComponent';

// Точка привязки тайла
const tile_anchor = [0, 0.109375];

// "Фабрика" тайлов
export function TileFactory(arr, index = undefined)
{
    if (index < 0 || index === undefined)
        return undefined;

    // Создаём компонент
    const tile = new BaseComponent();
    tile.setBackgroundImage(arr[index]);    // Устанавливаем фоновое изображение
    tile.resizeOnBackground();              // Устанавливаем размер как у фонового изображения
    tile.setAnchor(...tile_anchor);         // Задаём точку привязки

    return tile;
}