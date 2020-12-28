/**
 *represents a laser beam when the player fires
 *@param {number} location the inital x position where the laser beam will appear when fired
 */
function PlayerLaser(location) {
    this.x = location + 38;
    this.y = height - 160;
    /**
     *displays the laser beams
     */
    this.display = function() {
        noStroke();
        fill(199, 48, 48);
        ellipse(this.x, this.y, 5, 50);
    }
    /**
     *moves the laser beams
     */
    this.move = function() {
        this.y -= 6;
    }
    /**
     *removes the laser beams when they are no longer on screen
     */
    this.remove = function() {
        if (this.y < -60) {
            laserBeams.shift();
        }
    }
    /**
     *runs all the functions within PlayerLaser
     */
    this.run = function() {
        this.display();
        this.move();
        this.remove();
    }
}
