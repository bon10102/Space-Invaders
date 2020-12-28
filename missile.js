/**
 *represents a missle
 *@param {number} offset perlin noise offset used to determine path of missle
 *@param {number} location inital x location the missle will spawn at
 */
function Missile(offset, location) {
    this.x = location;
    this.y = -113;
    //perlin noise offset
    this.off = offset;
    /**
     *displays the missiles
     */
    this.display = function() {
        image(missile, this.x, this.y, 18, 113);
    }
    /**
     *moves the missiles
     */
    this.move = function() {
        this.off += 0.001;
        this.x = noise(this.off) * width;
        this.y += 3;
    }
    /**
     *removes the missiles when they are no longer on the screen
     */
    this.remove = function() {
        if (this.y > height + 114) {
            missiles.shift();
            healthPercent -= 20;
        }
    }
    /**
     *runs all the functions within Missile
     */
    this.run = function() {
        this.display();
        this.move();
        this.remove();
    }
}
