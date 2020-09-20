import { Scene } from '../../framework/engine/Scene';

import { Grid } from '../../framework/components/Grid';
import { BaseComponent } from '../../framework/components/BaseComponent';
import { Label } from '../../framework/components/Label';
import { Button } from '../../framework/components/Button';
import { ToggleButton } from '../../framework/components/ToggleButton';
import { ProgressBar } from '../../framework/components/ProgressBar';

import { config } from '../config';

// Класс сцены игры
export class MainScene extends Scene
{
    constructor(game)
    {
        super();
        this.game = game;

        this.addComponent('layout', new BaseComponent());
        this.addComponent('grid', new Grid(config.cellsX, config.cellsY));
        this.addComponent('scorePanel', new BaseComponent());
        this.addComponent('topPanel', new BaseComponent());
        this.addComponent('progressPanel', new BaseComponent());
        this.addComponent('movesCaption', new Label(30, '#FFF', 'Roboto Slab', 'Ходы:'));
        this.addComponent('movesLabel', new Label(90, '#FFF', 'Roboto Slab'));
        this.addComponent('scoreCaption', new Label(30, '#FFF', 'Roboto Slab', 'Очки:'));
        this.addComponent('scoreLabel', new Label(50, '#FFF', 'Roboto Slab', 0));
        this.addComponent('bannerLabel', new Label(90, '#CFF', 'Roboto Slab'));
        this.addComponent('groupsLabel', new Label(20, '#FFF', 'Roboto Slab'));
        this.addComponent('shuffleButton', new Button(20, '#FFF', 'Roboto Slab', `Перемешать (x${config.shuffles})`));
        this.addComponent('boosterButton', new ToggleButton(20, '#FFF', 'Roboto Slab', `Бустер (x${config.boosters})`));
        this.addComponent('pauseButton', new ToggleButton());
        this.addComponent('progress', new ProgressBar());
        this.addComponent('progressLabel', new Label(20, '#FFF', 'Roboto Slab', 'Прогресс'));
    }

    init()
    {
        super.init();
        
        // Фон
        this.collection.layout.setBackgroundImage(this.game.assets.images.background);
        this.collection.layout.setSize(config.screenWidth, config.screenHeight);

        // Игровое поле
        this.collection.grid.setBackgroundImage(this.game.assets.images.field);
        this.collection.grid.setSize(config.gridWidth, config.gridHeight);
        this.collection.grid.setPosition(config.gridX, config.gridY);

        // Панель информации
        this.collection.scorePanel.setBackgroundImage(this.game.assets.images.scorePanel);
        this.collection.scorePanel.setAnchor(0.5, 0.5);
        this.collection.scorePanel.scaleOnBackgroundWidth(300);
        this.collection.scorePanel.setPosition(780, 300);

        // Заголовок "Ходы"
        this.collection.movesCaption.setPosition(780, 160);

        // Поле вывода количества ходов
        this.collection.movesLabel.setBackgroundImage(this.game.assets.images.moves);
        this.collection.movesLabel.setAnchor(0.5, 0.7);
        this.collection.movesLabel.scaleOnBackgroundWidth(180);
        this.collection.movesLabel.setText(config.movesLimit);
        this.collection.movesLabel.setPosition(780, 300);

        // Заголовок "Очки"
        this.collection.scoreCaption.setPosition(780, 370);

        // Поле вывода количества очков
        this.collection.scoreLabel.setPosition(780, 410);
        
        // Поле вывода сообщений
        this.collection.bannerLabel.setPosition(config.screenWidth / 2, config.screenHeight / 2);

        // Поле вывода количества доступных ходов
        this.collection.groupsLabel.setPosition(150, 130);
        // this.collection.groupsLabel.setText('Доступно ходов: 0'); FIXME:

        // Кнопка "Перемешать"
        this.collection.shuffleButton.setBaseImage(this.game.assets.images.buttonBase2);
        this.collection.shuffleButton.setHoverImage(this.game.assets.images.buttonHover2);
        this.collection.shuffleButton.setPressImage(this.game.assets.images.buttonPress2);
        this.collection.shuffleButton.setPosition(780, 500);
        this.collection.shuffleButton.setAnchor(0.5, 0.5);
        this.collection.shuffleButton.scaleOnBackgroundWidth(200);
        this.collection.shuffleButton.setSize(200, 60);
        this.collection.shuffleButton.setClickHandler(this.shuffleClickHandler());

        // Кнопка "Бустер"
        this.collection.boosterButton.setBaseImage(this.game.assets.images.buttonBase2);
        this.collection.boosterButton.setHoverImage(this.game.assets.images.buttonHover2);
        this.collection.boosterButton.setPressImage(this.game.assets.images.buttonPress2);
        this.collection.boosterButton.setPosition(780, 570);
        this.collection.boosterButton.setAnchor(0.5, 0.5);
        this.collection.boosterButton.scaleOnBackgroundWidth(200);
        this.collection.boosterButton.setSize(200, 60);
        this.collection.boosterButton.setClickHandler(this.boosterClickHandler());

        // Кнопка "Пауза"
        this.collection.pauseButton.setBaseImage(this.game.assets.images.pauseBase);
        this.collection.pauseButton.setHoverImage(this.game.assets.images.pauseHover);
        this.collection.pauseButton.setPressImage(this.game.assets.images.pausePress);
        this.collection.pauseButton.setPosition(930, 50);
        this.collection.pauseButton.setAnchor(0.5, 0.5);
        this.collection.pauseButton.scaleOnBackgroundWidth(60);
        this.collection.pauseButton.setClickHandler(this.pauseClickHandler());

        // Полоса прогресса
        this.collection.progress.setBackgroundImage(this.game.assets.images.barBack);
        this.collection.progress.setBarImage(this.game.assets.images.bar);
        this.collection.progress.setSize(300, 25);
        this.collection.progress.setAnchor(0.5, 0.5);
        this.collection.progress.setPosition(config.screenWidth / 2, 45);
        this.collection.progress.setBorder(3);
        this.collection.progress.setProgress(0);

        // Верхняя панель
        this.collection.topPanel.setBackgroundImage(this.game.assets.images.topPanel);
        this.collection.topPanel.setSize(700, 100);
        this.collection.topPanel.setAnchor(0.5, 0);
        this.collection.topPanel.setPosition(config.screenWidth / 2, 0);

        // Панель прогресса
        this.collection.progressPanel.setBackgroundImage(this.game.assets.images.progressPanel);
        this.collection.progressPanel.setSize(400, 70);
        this.collection.progressPanel.setAnchor(0.5, 0);
        this.collection.progressPanel.setPosition(config.screenWidth / 2, 0);

        // Заголовок "Прогресс"
        this.collection.progressLabel.setPosition(config.screenWidth / 2, 15);
    }

    // Метод обновления показателей
    updateStats()
    {
        this.collection.movesLabel.setText(this.game.state.moves);
        this.collection.scoreLabel.setText(this.game.state.score);
        this.collection.progress.setProgress(this.game.state.progress);
    }

    // Метод блокировки пользовательского интерфейса
    uiLock()
    {
        this.collection.grid.stopEventPropagation();        // Блокируем распространение событий на поле
        this.collection.shuffleButton.disableEvents();      // Блокируем события кнопки "Перемешать"
        this.collection.boosterButton.disableEvents();      // Блокируем события кнопки "Бустер"
    }

    // Метод разблокировки пользовательского интерфейса
    uiUnlock()
    {
        this.collection.grid.allowEventPropagation();       // Разрешаем распространение событий на поле
        this.collection.shuffleButton.enableEvents();       // Разрешаем события кнопки "Перемешать"
        if (this.game.state.boosters > 0)
            this.collection.boosterButton.enableEvents();   // Разрешаем события кнопки "Бустер"
    }

    // Обработчик события клика по тайлу
    tileClickHandler()
    {
        return target => {
             this.game.state.isPressed = true;     // Выставляем флаг нажатия
             this.game.state.target = target;      // Указываем ссылку на сущность
        }
    }

    // Обработчик события клика по кнопке "Пауза"
    pauseClickHandler()
    {
        return target => {
            if (target.getState())
            {
                this.collection.bannerLabel.setText('Пауза');
                this.uiLock();
            }
            else
            {
                this.collection.bannerLabel.setText('');
                this.uiUnlock();
            }
        }
    }

    // Обработчик события клика по кнопке "Бустер"
    boosterClickHandler()
    {
        return target => {
            this.game.state.isBoosted = (target.getState() && this.game.state.boosters > 0);
        }
    }

    // Обработчик события клика по кнопке "Перемешать"
    shuffleClickHandler()
    {
        return target => {
            if (this.game.state.shuffles == 0)
                return;
            this.game.state.shuffles--;
            target.setText(`Перемешать (x${this.game.state.shuffles})`);
            this.game.state.isShuffling = true;
        }
    }
}