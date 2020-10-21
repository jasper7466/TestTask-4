import { Scene } from '../../framework/engine/Scene';

import { BaseComponent } from '../../framework/components/BaseComponent';
import { Label } from '../../framework/components/Label';
import { Button } from '../../framework/components/Button';

import { config } from '../config';

// Класс сцены стартового меню
export class StartScene extends Scene
{
    constructor(game)
    {
        super();
        this.game = game;

        this.addComponent('layout', new BaseComponent());
        this.addComponent('title', new Label(70, '#FFF', 'Roboto Slab', 'Blast Puzzle'));
        this.addComponent('startButton', new Button(30, '#FFF', 'Roboto Slab', 'Играть'));
    }

    init()
    {
        super.init();
        
        // Фон
        this.collection.layout.setBackgroundImage(this.game.assets.images.startBackground);
        this.collection.layout.setSize(config.screenWidth, config.screenHeight);

        // Заголовок "Blast Puzzle"
        this.collection.title.setPosition(config.screenWidth / 2, config.screenHeight / 4);

        // Кнопка "Играть"
        this.collection.startButton.setBaseImage(this.game.assets.images.buttonBase1);
        this.collection.startButton.setHoverImage(this.game.assets.images.buttonHover1);
        this.collection.startButton.setPressImage(this.game.assets.images.buttonPress1);
        this.collection.startButton.setPosition(config.screenWidth / 2, config.screenHeight / 1.7);
        this.collection.startButton.setAnchor(0.5, 0.5);
        this.collection.startButton.scaleOnBackgroundWidth(200);
        this.collection.startButton.setClickHandler(this.startClickHandler());
    }

    // Обработчик события клика по кнопке "Старт"
    startClickHandler()
    {
        return target => {
            this.game.screen.setScene(this.game.mainScene);
        }
    }
}