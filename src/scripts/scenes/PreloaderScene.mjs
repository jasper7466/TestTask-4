import { Scene } from '../modules/Scene';
import { Label } from '../modules/Label';

import { config } from '../config';

// Класс сцены игры
export class PreloaderScene extends Scene
{
    constructor(game)
    {
        super();
        this.game = game;

        this.addComponent('waitLabel', new Label(50, '#000', 'Roboto Slab', 'Загрузка...'));
        this.init();
    }

    init()
    {
        // Надпись "Загрузка"
        this.collection.waitLabel.setPosition(config.screenWidth / 2, config.screenHeight / 2);
    }
}