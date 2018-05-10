
//// Define some game constants
const N_ENEMIES = 5;               // number of enemies
const LANES     = [60, 145, 225];  // enemy lanes y axis positions
const MIN_DIST  = 50;              // minimum collision distance

//// Auxiliary functions
// Random enemy position in the X axis
function randomX() {
    return -300 + Math.floor(Math.random()*200);
}
// Get a random lane (1 out of 3) for an enemy
function randomLane() {
    return LANES[Math.floor(Math.random()*LANES.length)];
}
// Get a random speed for an enemy
function randomSpeed() {
    return 140 + Math.floor(Math.random()*80);
}
// Show message in info box
function infoBox(text) {
    document.querySelector('#info-box-text').textContent = text;
    document.querySelector('#info-box').classList.remove('hidden');

    setTimeout(function() {
        document.querySelector('#info-box').classList.add('hidden');
    }, 2000);
}
// Reset game board state
function startGame() {
    infoBox('Use the arrow keys to reach the water, good luck!');

    resetBoard();
}
function resetGame() {
    infoBox('You got caught, try again!');

    resetBoard();
}
function resetBoard() {
    // reset enemies list
    allEnemies = [];
    for (let i = 0; i < N_ENEMIES; i++) {
        allEnemies.push(new Enemy());
    }

    // reset player
    player = new Player();
    player.running = true;
}
// PLayer reached water -- game won
function gameWon() {
    if (player.won === false) {
        allEnemies = [];
        player.won = true;

        infoBox("Well done!");

        // restart game after timeout
        setTimeout(function() { startGame(); }, 2000);
    }
}

//// Enemy Object
// Enemies the player must avoid
var Enemy = function() {
    // reset enemy position, lane, and speed
    this.reset();

    // the image/sprite for our enemies, this uses
    this.sprite = 'images/enemy-bug.png';
};

// Update the enemy's position,
Enemy.prototype.update = function(dt) {
    // Move enemy in the x axis on every update
    this.x += this.speed * dt;

    // reset enemy when it goes off-grid
    if (this.x > 600) {
        this.reset();
    }
};

// Reset enemy with random position, lane, and speed
Enemy.prototype.reset = function() {
    this.x = randomX();
    this.y = randomLane();
    this.speed = randomSpeed();
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

//// Player class
var Player = function() {
    this.x = 202;
    this.y = 300;

    this.won = false;
    this.moves = 0;

    this.sprite = 'images/char-boy.png';
};
Player.prototype.update = function(dt) {
    // Check for collision with enemies on update
    if (this.checkCollisions()) 
       resetGame();

    // Check if player won on every update
    if (this.checkVictory())
        gameWon();
};
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y)
};
Player.prototype.handleInput = function(key) {
    // update player posistion according to key press
    // keeping the player inside the board
    if (key == 'left' && this.x >= 101)
        this.x -= 101;
    if (key == 'right' && this.x <= 401)
        this.x += 101;
    if (key == 'up' && this.y >= 60)
        this.y -= 80;
    if (key == 'down' && this.y <= 300)
        this.y += 80;

        console.log('x: '+this.x+' y: '+this.y);
};
Player.prototype.checkCollisions = function() {
    let collision = false;

    allEnemies.forEach(function(e) {
        // calculate the euclidean distance between the player and enemy
        const d = Math.sqrt( (e.x-player.x)**2 + (e.y-player.y)**2 );
        //console.log("player: "+player.x+","+player.y+"  distance: "+d);
        // if the distance is less than the defined threshold a collision is found
        if (d < MIN_DIST)
            collision = true;
    });

    return collision;
};
Player.prototype.checkVictory = function() {
    return (this.y <= 0 ? true : false);
};

// Create placeholders and start game
let allEnemies, player;
startGame();


//// Event listeners
// This listens for key presses and sends the keys to the
// Player.handleInput() method
document.addEventListener('keyup', function(e) {
    var allowedKeys = { 37: 'left', 38: 'up', 39: 'right', 40: 'down' };
    player.handleInput(allowedKeys[e.keyCode]);
});
