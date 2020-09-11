// Конфигурационный файл

// Набор изображений
export const images = {
    tile: require('../images/tile.png'),                    // Обесцвеченный спрайт тайла
    tileBlock: require('../images/blocks.png'),             // Обесцвеченный спрайт тайла
    field: require('../images/field.png'),                  // Фон игрового поля
    moves: require('../images/moves.png'),                  // Фон метки "Ходы"
    bar: require('../images/bar.png'),                      // Спрайт полосы прогресса
    barBack: require('../images/bar_back.png'),             // Спрайт фона полосы прогресса
    scorePanel: require('../images/score_panel.png'),       // Фон панели очков/ходов
    topPanel: require('../images/top_panel.png'),           // Фон верхней панели
    background: require('../images/background.png'),        // Фон игровой сцены
    progressPanel: require('../images/progress_panel.png'), // Фон панели прогресса
    pauseBase: require('../images/pause_base.png'),         // Кнопка "Пауза". Базовый спрайт
    pauseHover: require('../images/pause_hover.png'),       // Кнопка "Пауза". Спрайт наведения
    pausePress: require('../images/pause_press.png'),       // Кнопка "Пауза". Спрайт нажатия
    buttonBase2: require('../images/button2_base.png'),     // Кнопка, тип 2. Базовый спрайт
    buttonHover2: require('../images/button2_hover.png'),   // Кнопка, тип 2. Спрайт наведения
    buttonPress2: require('../images/button2_press.png')    // Кнопка, тип 2. Спрайт нажатия
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
    scoreToWin: 2000,       // Кол-во очков для выйгрыша
    movesLimit: 50,         // Лимит ходов
    shuffles: 3,            // Количество перемешиваний
    minGroup: 3,            // Минимальный размер группы на удаление
    superGroup: 4,          // Минимальный размер группы для создания супер-тайла
    boosters: 2,            // Количество бустеров
    boostR: 1               // Радиус действия бустера
}