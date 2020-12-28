/**
 *represents a shot when the player fires the cannon
 *@param {number} location inital x location the projectile
 *@param {number} mousePosX the mouse's X coordinate
 *@param {number} mousePosY the mouse's Y coordinate
 */
function CannonShot(location, mousePosX, mousePosY) {
    this.x = location + 37;
    this.y = height - 169;
    //**VARIABLES TO DETERMINE PATH OF A CANNON SHOT**
    this.deltaX;
    this.deltaY;
    this.direction;
    this.speed = 3.0;
    this.mousePosX = mousePosX;
    this.mousePosY = mousePosY;
    /**
     *displays the cannon shots
     */
    this.display = function() {
        fill(random(128, 255), 235, 47);
        noStroke();
        ellipse(this.x, this.y, 50, 50);
    }
    /**
     *moves the cannon shots
     */
    this.move = function() {
        /*determines slope of path, calculates direction, than calculates the
          x and y velocities of the cannon shot
        */
        this.deltaX = (location + 37) - mousePosX;
        this.deltaY = (height - 169) - mousePosY;
        this.direction = atan(this.deltaY / this.deltaX);
        if (this.direction <= 0) {
            this.x = this.x + (this.speed * cos(this.direction));
            this.y = this.y + (this.speed * sin(this.direction));
        } else {
            this.x = this.x - (this.speed * cos(this.direction));
            this.y = this.y - (this.speed * sin(this.direction));
        }
    }
    /**
     *removes the cannon shot when it is no longer on the screen
     */
    this.remove = function() {
        if (this.x > (width + 25) || this.x < -25 || this.y < -25) {
            cannonShots.shift();
        }
    }
    /**
     *runs all the functions within CannonShot
     */
    this.run = function() {
        this.display();
        this.move();
        this.remove();
    }
}
