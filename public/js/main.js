var game = null;

enchant();

window.onload = function() {
    game = new Core(1000, 586);
    game.preload('../img/bt12_playmat.jpg');

    game.onload = function() {
        var bg = new Sprite(1000, 586);
        bg.image = game.assets['../img/bt12_playmat.jpg'];
        game.rootScene.addChild(bg);
    }

    game.start();
};
