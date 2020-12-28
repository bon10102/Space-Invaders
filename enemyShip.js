/**
 *represents a enemy
 *@param {number} location the inital x position where the enemy ship will appear when spawned
 */
function EnemyShip(location) {
    this.x = location;
    this.y = -75;
    /**
     *displays the enemy ships
     */
    this.display = function() {
        image(enemy, this.x, this.y, 75, 75);
    }
    /**
     *moves enemy ships
     */
    this.move = function() {
        this.y += 1;
    }
    /**
     *removes enemy ships when they are no longer on the screen
     */
    this.remove = function() {
        if (this.y > height + 75) {
            enemies.shift();
            healthPercent -= 10;
        }
    }
    /**
     *runs all the functions within nemyShip
     */
    this.run = function() {
        this.display();
        this.move();
        this.remove();
    }
}
