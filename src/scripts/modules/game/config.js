// Конфигурационный файл

// Набор изображений
export const images = {
    tile: require('./assets/tile.png'),                    // Обесцвеченный спрайт тайла
    tileBlock: require('./assets/blocks.png'),             // Обесцвеченный спрайт тайла
    field: require('./assets/field.png'),                  // Фон игрового поля
    moves: require('./assets/moves.png'),                  // Фон метки "Ходы"
    bar: require('./assets/bar.png'),                      // Спрайт полосы прогресса
    barBack: require('./assets/bar_back.png'),             // Спрайт фона полосы прогресса
    scorePanel: require('./assets/score_panel.png'),       // Фон панели очков/ходов
    topPanel: require('./assets/top_panel.png'),           // Фон верхней панели
    background: require('./assets/background.png'),        // Фон игровой сцены
    startBackground: require('./assets/start_background.png'),    // Фон стартовой сцены
    progressPanel: require('./assets/progress_panel.png'), // Фон панели прогресса
    pauseBase: require('./assets/pause_base.png'),         // Кнопка "Пауза". Базовый спрайт
    pauseHover: require('./assets/pause_hover.png'),       // Кнопка "Пауза". Спрайт наведения
    pausePress: require('./assets/pause_press.png'),       // Кнопка "Пауза". Спрайт нажатия
    buttonBase1: require('./assets/button1_base.png'),     // Кнопка, тип 1. Базовый спрайт
    buttonHover1: require('./assets/button1_hover.png'),   // Кнопка, тип 1. Спрайт наведения
    buttonPress1: require('./assets/button1_press.png'),   // Кнопка, тип 1. Спрайт нажатия
    buttonBase2: require('./assets/button2_base.png'),     // Кнопка, тип 2. Базовый спрайт
    buttonHover2: require('./assets/button2_hover.png'),   // Кнопка, тип 2. Спрайт наведения
    buttonPress2: require('./assets/button2_press.png')    // Кнопка, тип 2. Спрайт нажатия
}

// Набор спрайтов супер-тайлов
export const superSprites = {
    blue: require('./assets/bolt-1-blue.png'),
    purple: require('./assets/bolt-2-purple.png'),
    red: require('./assets/bolt-3-red.png'),
    yellow: require('./assets/bolt-4-yellow.png'),
    green: require('./assets/bolt-5-green.png'),
    brown: require('./assets/bolt-6-brown.png')
}

// Конфигурация
export const config = {
    screenWidth: 1000,      // Ширина экрана
    screenHeight: 700,      // Высота экрана
    gridWidth: 500,         // Ширина игрового поля
    gridHeight: 500,        // Высота игрового поля
    gridX: 50,              // Положение игрового поля по X
    gridY: 150,             // Положение игрового поля по Y
    cellsX: 7,              // Размер сетки поля по оси X
    cellsY: 7,              // Размер сетки поля по оси Y
    variety: 5,             // Кол-во разновидностей тайлов
    tileAnchor: [0, 0.109375],  // Точка привязки для тайла
    scoreToWin: 2000,       // Кол-во очков для выйгрыша
    movesLimit: 50,         // Лимит ходов
    shuffles: 3,            // Количество перемешиваний
    minGroup: 2,            // Минимальный размер группы на удаление
    superGroup: 4,          // Минимальный размер группы для создания супер-тайла
    boosters: 2,            // Количество бустеров
    boostR: 1,              // Радиус действия бустера
    preloaderDelay: 1500    // Задержка для прелоадера
}