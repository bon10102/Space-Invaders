/*
Space Invaders Clone
Revision Date: 28/12/2020
*/
//**VARIABLES IMAGES ARE LOADED INTO**
var player;
var enemy;
var missile;
var crosshair;
//**VARIABLES TO CONTROL THE PLAYER'S SPACESHIP**
var spaceshipMove = 0;
var spaceshipPos;
var crosshairX;
var crosshairY;
//**ARRAYS THAT HOLD DIFFERENT OBJECTS WITHIN THE GAME**
var laserBeams = [];
var enemies = [];
var missiles = [];
var cannonShots = [];
//determines the amount of time needed before the lasgun can be fired again
var fireDelay = 0;
//variable to determine when a missle should spawn
var missileSpawn = 0;
//determines which weapon is selected. 0 is for lasgun, 1 is for lucifer cannon
var weaponSelect = 0;
//weapon charge (in percent) of lucifer cannon
var chargePercent = 100;
//determies the status of the game (score, health)
var score = 0;
var healthPercent = 100;
//variable to determine when a enemy ship should spawn
var enemySpawn = 0;
/*
**VARIABLES TO DETERMINE DIFFICULTY**
difficulty affects the rate which enemy waves spawn,
the recharge rate of the lucifer cannon,
and how often missiles will be fired
*/
var enemySpawnFrequency;
var rechargeSpeed;
var missleFrequency;
//**BUTTON AND SELECTION MENU VARIABLES**
var difficultySelect = true;
var difficultyOption;
var confirmDifficulty;
var returnToTitle;
var reset;

function setup() {
    createCanvas(1000, 1000);
    //load images into variables for later use
    player = loadImage("assets/spaceship.png", 0, 0);
    enemy = loadImage("assets/enemy.png", 0, 0);
    missile = loadImage("assets/missile.png", 0, 0);
    crosshair = loadImage("assets/crosshair.png", 0, 0);
    //player's spaceship starts out in the center of the screen
    spaceshipPos = width / 2 - 49;

    // **TITLE SCREEN HTML ELEMENTS**

    //dropdown difficulty selecton menu
    difficultyOption = createSelect();
    difficultyOption.position(width / 2, height / 2);
    difficultyOption.option('easy');
    difficultyOption.option('medium');
    difficultyOption.option('hard');
    difficultyOption.option('ur gonna die');
    //button to confirm the difficulty and begin game
    confirmDifficulty = createButton('continue');
    confirmDifficulty.position(width / 2 + 10, height / 2 + 200);
    confirmDifficulty.mousePressed(gameStart);

    //**MAIN (GAME) HTML ELEMENTS**

    //button to quit and return to title screen
    returnToTitle = createButton('return to title screen');
    returnToTitle.position(800, 900);
    returnToTitle.mousePressed(resetGame);

    //**SCORE/DEATH SCREEN HTML ELEMENTS**

    //button to reset game and return to title screen
    reset = createButton('reset');
    reset.position(width / 2, height / 2 + 200);
    reset.mousePressed(resetGame);
}

function draw() {
    //displays the title screen
    if (difficultySelect == true) {
        difficultyScreen();
    } else if (healthPercent <= 0) { //displays the score/death screen
        deathScreen();
    } else { //displays the game screen
        background(0);
        for (var i = 0; i < laserBeams.length; i++) {
            laserBeams[i].run();
        }
        for (var i = 0; i < enemies.length; i++) {
            enemies[i].run();
        }
        for (var i = 0; i < missiles.length; i++) {
            missiles[i].run();
        }
        for (var i = 0; i < cannonShots.length; i++) {
            cannonShots[i].run();
        }
        //make the button to return to title screen visible
        returnToTitle.show();
        enemySpawn--;
        fireDelay--;
        //how often missiles will spawn
        missileSpawn = parseInt(random(1, missleFrequency));
        if (chargePercent < 100) {
            //how fast the lucifer cannon will recharge
            chargePercent += rechargeSpeed;
        }
        //determines when enemies should spawn
        if (enemySpawn <= 0) {
            enemySpawn = enemySpawnFrequency;
            for (var i = 0; i < 5; i++) {
                var location = (i / 5) * width;
                enemies.push(new EnemyShip(location + 40));
            }
        }
        //determines when missiles should spawn
        if (missileSpawn == 1) {
            missiles.push(new Missile(random(-100, 100), random(18, width - 18)));
        }

        //**CODE FOR HIT DETECTION BETWEEN VARIOUS OBJECTS**

        //hit detection between enemy ships and laser beams
        if (enemies.length > laserBeams.length) {
            for (var j = enemies.length - 1; j >= 0; j--) {
                for (var i = laserBeams.length - 1; i >= 0; i--) {
                    if (laserBeams[i].x > enemies[j].x && laserBeams[i].x < enemies[j].x + 75 && laserBeams[i].y < enemies[j].y + 75 && laserBeams[i].y > enemies[j].y) {
                        score += 1;
                        laserBeams.splice(i, 1);
                        enemies.splice(j, 1);
                    }
                }
            }
        }
        if (enemies.length <= laserBeams.length) {
            for (var j = laserBeams.length - 1; j >= 0; j--) {
                for (var i = enemies.length - 1; i >= 0; i--) {
                    if (laserBeams[j].x > enemies[i].x && laserBeams[j].x < enemies[i].x + 75 && laserBeams[j].y < enemies[i].y + 75 && laserBeams[j].y > enemies[i].y) {
                        score += 1;
                        enemies.splice(i, 1);
                        laserBeams.splice(j, 1);
                    }
                }
            }
        }
        //hit detection between missiles and cannon shots
        for (var l = cannonShots.length - 1; l >= 0; l--) {
            for (var k = missiles.length - 1; k >= 0; k--) {
                if (cannonShots[l].x + 25 > missiles[k].x && cannonShots[l].x - 25 < missiles[k].x + 18 && cannonShots[l].y < missiles[k].y + 113 && cannonShots[l].y > missiles[k].y) {
                    score += 10;
                    missiles.splice(k, 1);
                }
            }
        }
        //hit detection between enemies and cannon shots
        for (var i = enemies.length - 1; i >= 0; i--) {
            for (var j = cannonShots.length - 1; j >= 0; j--) {
                if (cannonShots[j].x + 25 > enemies[i].x && cannonShots[j].x - 25 < enemies[i].x + 75 && cannonShots[j].y < enemies[i].y + 75 && cannonShots[j].y > enemies[i].y) {
                    score += 1;
                    enemies.splice(i, 1);
                }
            }
        }
        //hit detection between missiles and laser beams
        if (laserBeams.length > missiles.length) {
            for (var l = laserBeams.length - 1; l >= 0; l--) {
                for (var k = missiles.length - 1; k >= 0; k--) {
                    if (laserBeams[l].x > missiles[k].x && laserBeams[l].x < missiles[k].x + 18 && laserBeams[l].y < missiles[k].y + 113 && laserBeams[l].y > missiles[k].y) {
                        score += 10;
                        laserBeams.splice(l, 1);
                        missiles.splice(k, 1);
                    }
                }
            }
        }
        if (laserBeams.length < missiles.length) {
            for (var k = missiles.length - 1; k >= 0; k--) {
                for (var l = laserBeams.length - 1; l >= 0; l--) {
                    if (laserBeams[l].x > missiles[k].x && laserBeams[l].x < missiles[k].x + 18 && laserBeams[l].y < missiles[k].y + 113 && laserBeams[l].y > missiles[k].y) {
                        score += 10;
                        missiles.splice(k, 1);
                        laserBeams.splice(l, 1);
                    }
                }
            }
        }

        controlPanel();
        spaceship();
    }
}

function keyPressed() {
    //spacebar fires laser gun
    if (key == ' ') {
        if (weaponSelect == 0) {
            if (fireDelay < 0) { //adds delay between spots to prevent spamming
                laserBeams.push(new PlayerLaser(spaceshipPos));
                fireDelay = 10;
            }
        }
    }
}

function keyTyped() {
    //**KEYS TO CONTROL THE PLAYER'S MOVEMENT**
    if (key === 'a' || key === 'A') {
        spaceshipMove = -7;
    }
    if (key === 'd' || key === 'D') {
        spaceshipMove = 7;
    }
    //**KEYS TO CONTROL WHICH WEAPON IS SELECTED**
    if (key === '1') {
        weaponSelect = 0;
    }
    if (key === '2') {
        weaponSelect = 1;
    }
    return false;
}

function keyReleased() {
    //stops spaceship if movement keys are released
    if (key === 'a' || key === 'd' || key === 'A' || key === 'D') {
        spaceshipMove = 0;
    }
}

function mousePressed() {
    //fires cannon when mouse is pressed, the cannon's charge must be at 100%
    if (weaponSelect == 1 && chargePercent >= 100) {
        if (mouseY < height - 175) {
            cannonShots.push(new CannonShot(spaceshipPos, mouseX, mouseY));
            chargePercent = 0;
        }
    }
}

function spaceship() {
    spaceshipPos = spaceshipPos + spaceshipMove;
    image(player, spaceshipPos, height - 169, 79, 49);
    //**TARGETING LINE FOR CANNON, UPDATES WEAPONS INFORMATION PANEL**
    if (weaponSelect == 1) {
        fill(0);
        textSize(20);
        strokeWeight(1.5);
        text("WEAPON SELECTED: LUCIFER CANNON", 20, 920);
        //**MESSAGE NEXT TO CROSSHAIR TELLING CANNON STATUS**
        if (chargePercent >= 100) {
            noStroke();
            fill(0, 255, 0);
            text("CANNON RDY", mouseX + 40, mouseY);
        } else {
            noStroke();
            if (second() % 2 == 1) {
                fill(255, 0, 0);
            }
            if (second() % 2 == 0) {
                fill(0);
            }
            text("CANNON NOT RDY", mouseX + 40, mouseY);
        }
        //**PREVENTS CANNON SHOTS FROM GOING BACKWARDS (DOWN)
        if (mouseY > height - 175) {
            stroke(199, 48, 48);
            strokeWeight(3);
            line(spaceshipPos + 37, height - 160, mouseX, height - 175);
            image(crosshair, mouseX - 25, height - 205, 58, 58);
        } else {
            stroke(199, 48, 48);
            strokeWeight(3);
            line(spaceshipPos + 37, height - 160, mouseX, mouseY);
            image(crosshair, mouseX - 25, mouseY - 30, 58, 58);
        }
    } else {
        fill(0);
        strokeWeight(1.5);
        textSize(20);
        text("WEAPON SELECTED: LASGUN", 20, 920);
    }
    /*
    **CHECKS TO MAKE SURE SPACESHIP IS ON SCREEN. IF NOT, IT IS
    MOVED BACK ONTO THE SCREEN**
    */
    if (spaceshipPos < 0) {
        spaceshipPos = 0;
        spaceshipMove = 0;
    }
    if (spaceshipPos > width - 79) {
        spaceshipPos = width - 79;
        spaceshipMove = 0
    }
}

function controlPanel() {
    fill(200);
    noStroke();
    //**BACKGROUND FOR CONTROL PANEL AT THE BOTTOM OF THE SCREEN**
    rect(0, height - 120, width, 120);
    stroke(0);
    strokeWeight(3);
    line(440, 1000, 440, 880);
    strokeWeight(1.5);
    fill(0);
    textSize(20);
    text("SCORE: " + score, 500, 920);
    text("HEALTH: " + healthPercent + "%", 500, 960);
    //**ACTIVATES LUCIFER CANNON CONTROL PANEL**
    if (weaponSelect == 1) {
        noStroke();
        if (chargePercent / 100 < 0.4) {
            fill(255, 10, 10);
        }
        if (chargePercent / 100 >= 0.4 && chargePercent / 100 <= 0.8) {
            fill(255, 255, 10);
        }
        if (chargePercent / 100 > 0.8) {
            fill(10, 255, 10);
        }
        rect(231, 937, 150 * (chargePercent / 100), 30);
        stroke(0);
        strokeWeight(2);
        noFill();
        rect(231, 937, 150, 30);
        noFill();
        stroke(0);
        strokeWeight(1.5);
        text("WEAPON CHARGE:", 20, 960);
        text(int(chargePercent) + "%", 280, 960);
    }
}
/**
 *displays title screen
 */
function difficultyScreen() {
    returnToTitle.hide();
    reset.hide();
    noStroke();
    fill(50);
    rect(0, 0, width, height);
    fill(255);
    textSize(40);
    text("DEFEND YOUR SPACE STATION", width / 2 - 265, 360);
    textSize(25);
    text("CONTROLS", 20, 20);
    text("A & D - MOVE SPACESHIP", 20, 60);
    text("1 - SELECT LASGUN", 20, 90);
    text("2 - SELECT LUCIFER CANNON", 20, 120);
    text("SPACE - FIRE LASGUN", 20, 150);
    text("LEFT CLICK - FIRE LUCIFER CANNON", 20, 180);
    text("MOUSE - AIM LUCIFER CANNON", 20, 210);
    //**DESCRIPTION FOR EACH DIFFICULTY VARIABLE**
    if (difficultyOption.value() == 'easy') {
        text("- lots of time between enemy waves", 350, 800);
        text("- weapon recharge times are fast", 350, 840);
        text("- missles are infrequent", 350, 880);
    }
    if (difficultyOption.value() == 'medium') {
        text("- less times between enemy waves", 350, 800);
        text("- weapon recharge times are slower", 350, 840);
        text("- missles are more frequent", 350, 880);
    }
    if (difficultyOption.value() == 'hard') {
        text("- almost no time between enemy waves", 350, 800);
        text("- weapon recharge times are very slow", 350, 840);
        text("- missles are frequent", 350, 880);
    }
    if (difficultyOption.value() == 'ur gonna die') {
        text("- GG have fun (crashes may occur)", 350, 800);
    }
}
/**
 *displays game over screen
 */
function deathScreen() {
    returnToTitle.hide();
    reset.show()
    noStroke();
    fill(50);
    rect(0, 0, width, height);
    textSize(40);
    fill(255);
    text("YOUR SPACE STATION HAS BEEN DESTROYED", 40, 500);
    text("YOUR FINAL SCORE IS: " + score, height / 2 - 235, 550);
}

//**FUNCTIONS FOR BUTTONS**

/**
 *what occurs when the "confirm" button is pressed on title screen
 */
function gameStart() {
    weaponSelect = 0;
    //**SETS DIFFICULTY VARIABLES ACCORDING TO WHAT THE PLAYER SELECTS**
    if (difficultyOption.value() == 'easy') {
        enemySpawnFrequency = 600;
        rechargeSpeed = 0.5;
        missleFrequency = 500;
    }
    if (difficultyOption.value() == 'medium') {
        enemySpawnFrequency = 400;
        rechargeSpeed = 0.4;
        missleFrequency = 300;
    }
    if (difficultyOption.value() == 'hard') {
        enemySpawnFrequency = 300;
        rechargeSpeed = 0.3;
        missleFrequency = 200;
    }
    if (difficultyOption.value() == 'ur gonna die') {
        enemySpawnFrequency = 120;
        rechargeSpeed = 0.1;
        missleFrequency = 100;
    }
    difficultyOption.hide();
    confirmDifficulty.hide();
    difficultySelect = false;
}
/**
 *what occurs when the "reset" or "return to title" is pressed
 */
function resetGame() {
    difficultyOption.show();
    confirmDifficulty.show();
    //**RESET ALL GAME VARIABLES**
    spaceshipPos = width / 2 - 49;
    chargePercent = 100;
    weaponSelect = 0;
    score = 0;
    difficultySelect = true;
    healthPercent = 100;
    laserBeams = [];
    enemies = [];
    missiles = [];
    cannonShots = [];
}
