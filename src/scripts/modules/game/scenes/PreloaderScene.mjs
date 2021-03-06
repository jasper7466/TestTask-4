import { Scene } from '../../framework/engine/Scene';

import { Label } from '../../framework/components/Label';

import { config } from '../config';

// Класс сцены игры
export class PreloaderScene extends Scene
{
    constructor(game)
    {
        super();
        this.game = game;

        this.addComponent('waitLabel', new Label(50, '#000', 'Roboto Slab', 'Загрузка...'));
    }

    init()
    {
        super.init();
        
        // Надпись "Загрузка"
        this.collection.waitLabel.setPosition(config.screenWidth / 2, config.screenHeight / 2);
    }
}