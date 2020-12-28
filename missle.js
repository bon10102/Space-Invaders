/**
*represents a missle
*@param {number} offset perlin noise offset used to determine path of missle
*@param {number} location inital x location the missle will spawn at
*/
function Missle(offset, location){
  this.x = location;
  this.y = -113;
  this.off = offset;

  this.display = function(){
    image (missle, this.x, this.y, 18, 113);
  }

  this.move = function(){
    this.off += 0.001;
    this.x = noise (this.off) * width;
    this.y += 3;
  }

  this.remove = function (){
    if (this.y > height+114){
      missles.shift();
    }
  }
  this.run = function (){
    this.display();
    this.move();
    this.remove();
  }
}
