var game = null;

enchant();

window.onload = function() {
    game = new Core(1000, 586);
    game.preload('../img/bt12_playmat.jpg');
    preloadImages();

    game.makeLogInScene = function() {
        var scene = new Scene();

        var bg = new Sprite(1000, 586);
        bg.image = game.assets['../img/bt12_playmat.jpg'];
        scene.addChild(bg);

        var usernameTextBox = new InputTextBox();
        usernameTextBox.x = bg.width/2 - usernameTextBox.width/2;
        usernameTextBox.y = bg.height/2 - usernameTextBox.height/2;
        scene.addChild(usernameTextBox);

        var passwordTextBox = new InputTextBox();
        passwordTextBox.x = bg.width/2 - passwordTextBox.width/2;
        passwordTextBox.y = usernameTextBox.y + usernameTextBox.height;
        scene.addChild(passwordTextBox);

        var logInButton = new Button("LogIn", "light", 0, 0);
        logInButton.x = bg.width/2 - logInButton.width;
        logInButton.y = passwordTextBox.y + passwordTextBox.height;
        scene.addChild(logInButton);

        var signUpButton = new Button("SignUp", "light", 0, 0);
        signUpButton.x = logInButton.x + logInButton.width;
        signUpButton.y = logInButton.y;
        scene.addChild(signUpButton);

        scene.on(Event.ENTER_FRAME, function() {
            if(passwordTextBox.value != '') {

            }
        });

        logInButton.on(Event.TOUCH_END, function() {
            Parse.User.logIn(usernameTextBox.value, passwordTextBox.value, {
                success: function(user) {
                    game.replaceScene(game.makeMainMenuScene());
                },
                error: function(user, error) {
                    // The login failed. Check error to see why.
                    alert("Error: " + error.code + " " + error.message);
                }
            });
        });

        signUpButton.on(Event.TOUCH_END, function() {
            var user = new Parse.User();
            user.set("username", usernameTextBox.value);
            user.set("password", passwordTextBox.value);
            user.signUp(null, {
                success: function(user) {
                    alert("YAY");
                },
                error: function(user, error) {
                    // Show the error message somewhere and let the user try again.
                    alert("Error: " + error.code + " " + error.message);
                }
            });
        });

        return scene;
    };
    
    game.makeMainMenuScene = function() {
        var scene = new Scene();
        
        var buildDeckButton = new Button("Build Deck", "light", 0, 0);
        buildDeckButton.on(Event.TOUCH_END, function() {
            game.replaceScene(game.makeBuildDeckScene());
        });
        scene.addChild(buildDeckButton);
        
        scene.addChild(makeLogOutButton());
        
        return scene;
    }
    
    game.makeBuildDeckScene = function() {
        var scene = new Scene();
        
        var Card = new Parse.Object.extend("Card");
        var query = new Parse.Query(Card);
        query.equalTo("skill", "Boost");
        query.find({
            success: function(results) {
                var x = 0;
                var length = 0;
                var y = 0;
                for(var i = 0; i < results.length; i++) {
                    var object = results[i];
                   
                    var card = new Sprite(100, 145);
                    card.image = game.assets["../img/mini/" + object.get("name") + ".jpg"];
                   
                    card.x = x;
                    card.y = y;
                    x += 100;
                   
                    length++;
                   
                    if(length > 10) {
                        length = 0;
                        x = 0;
                        y += 145;
                    }
                   
                    scene.addChild(card);
                }
            },
            error: function(error) {
                alert("Error: " + error.code + " " + error.message);
            }
        });
        
        scene.addChild(makeLogOutButton());
        
        return scene;
    };
};

function preloadImages() {
    var Card = Parse.Object.extend("Card");
    var query = new Parse.Query(Card);
    query.find({
        success: function(results) {
            for(var i = 0; i < results.length; i++) {
                var object = results[i];
                game.preload("../img/full/" + object.get("name") + ".jpg");
                game.preload("../img/mini/" + object.get("name") + ".jpg");
            }
            
            game.onload = function() {
                if(Parse.User.current()) {
                    game.pushScene(game.makeMainMenuScene());
                }
                else {
                    game.pushScene(game.makeLogInScene());
                }
            };
            
            game.start();
        },
        error: function(error) {
            alert("Error: " + error.code + " " + error.message);
        }
    });
}

function makeLogOutButton() {
    var logOutButton = new Button("LogOut", "light", 0, 0);
    
    logOutButton.on(Event.TOUCH_END, function() {
        Parse.User.logOut();
        game.replaceScene(game.makeLogInScene());
    });
    
    logOutButton.y = 300;
    return logOutButton;
}