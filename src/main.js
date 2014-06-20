define(function(require, exports, module) {
    // import dependencies
    var Engine = require('famous/core/Engine');
    var Modifier = require('famous/core/Modifier');
    var Transform = require('famous/core/Transform');
    var ImageSurface = require('famous/surfaces/ImageSurface');
    var Draggable = require('famous/modifiers/Draggable');
    var Easing = require('famous/transitions/Easing');

    // create the main context
    var mainContext = Engine.createContext();

    // your app here
    function getRandomInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1) + min);
    };
    var count = 0;
    var heroSize = 200;
    var enemy1Size = 200;
    var enemy2Size = 200;

    var space = new ImageSurface({
        size: [undefined, undefined],
        classes: ['double-sided'],
        content: 'http://media2.giphy.com/media/OU7JNBypJBWr6/giphy.gif'
   });

    var hero = new ImageSurface({
        size: [heroSize, heroSize],
        content: 'http://31.media.tumblr.com/3c16192b8cefd55d09927f8e381e11c1/tumblr_mkq40f5lk31rlagh6o1_400.gif',
        classes: ['double-sided']
    });

    var heroModifier = new Modifier({
        origin: [0, 0]
    });

    var enemy1 = new ImageSurface({
        size: [enemy1Size, enemy1Size],
        content: 'http://25.media.tumblr.com/3e8f391f294af1e612e58fef1492cfa6/tumblr_mjok1bhPIB1rfjowdo1_500.gif',
        classes: ['enemy']
    });

    var enemy1Modifier = new Modifier({
        origin: [0, 0],
    });

    var animation = function(surface, destinationX, destinationY, duration, curve) {
        surface.setTransform(
            Transform.translate(destinationX, destinationY, 0),
            {duration: duration, curve: curve})
    }

    var enemy1AnimationSW = function() {
        animation(enemy1Modifier, 0, window.innerHeight - enemy1Size, 500, Easing.inOutBack);
    };
    var enemy1AnimationSE = function() {
        animation(enemy1Modifier, window.innerWidth - enemy1Size, window.innerHeight - enemy1Size, 500, Easing.inOutBack);
    };
    var enemy1AnimationNE = function() {
        animation(enemy1Modifier, window.innerWidth - enemy1Size, 0, 500, Easing.inOutBack);
    };
    var enemy1AnimationNW = function() {
        animation(enemy1Modifier, 0, 0, 500, Easing.inOutBack);
    };

    var enemy1Moves = {
        0: enemy1AnimationSE,
        1: enemy1AnimationSW,
        2: enemy1AnimationNE,
        3: enemy1AnimationNW
    }

    var enemy2 = new ImageSurface({
        size: [enemy2Size, enemy2Size],
        content: 'http://fc08.deviantart.net/fs70/f/2011/315/0/8/pixel_adventure_ham_by_c140-d4fvj1e.gif',
        classes: ['enemy']
    });

    var enemy2Modifier = new Modifier({
        origin: [0, 0]
    });

    var enemy2AnimationN = function() {
        animation(enemy2Modifier, 200, 200, 500, Easing.inOutBack);
    };
    var enemy2AnimationS = function() {
        animation(enemy2Modifier, 900, 400, 500, Easing.inOutBack);
    };
    var enemy2AnimationE = function() {
        animation(enemy2Modifier, 200, 400, 500, Easing.inOutBack);
    };
    var enemy2AnimationW = function() {
        animation(enemy2Modifier, 900, 200, 500, Easing.inOutBack);
    };

    var enemy2Moves = {
        0: enemy2AnimationN,
        1: enemy2AnimationS,
        2: enemy2AnimationE,
        3: enemy2AnimationW
    }

    var draggable = new Draggable();
    draggable.subscribe(hero);

    Engine.on('prerender', function() {
        count += 1;
        console.log(count);
        var heroPos = draggable.modify().transform;
        var enemy1Pos = enemy1Modifier.getFinalTransform();
        var enemy2Pos = enemy2Modifier.getFinalTransform();

        // move enemy1 randomly
        if (count % 5 === 0) {
            enemy1Moves[getRandomInt(0, 3)]();
        }

        // move enemy2 randomly
        if (count % 7 === 0) {
            enemy2Moves[getRandomInt(0, 3)]();
        }

        // collision detection 1
        if (heroPos[11] - enemy1Pos[11] < 200 && heroPos[12] + - enemy1Pos[12] < 200 && count > 100 && count % 10 === 0) {
            window.alert('DOG! GAME OVER! Score: ' + count);
        }

        // collision detection 2
        if (heroPos[11] - enemy2Pos[11] < 200 && heroPos[12] + - enemy2Pos[12] < 200 && count > 100 && count % 10 === 0) {
            window.alert('HAM! GAME OVER! Score: ' + count);
        }
    });

    mainContext.add(space);
    mainContext.add(heroModifier).add(draggable).add(hero);
    mainContext.add(enemy1Modifier).add(enemy1);
    mainContext.add(enemy2Modifier).add(enemy2);
});
