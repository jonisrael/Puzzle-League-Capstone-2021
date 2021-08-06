import CURSOR from "assets/Sprites/cursor.png";
console.log(CURSOR);
let a = new Image();
a.src = CURSOR;

class Cursor {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  draw(ctx) {
    let pixelX = this.x * SQ;
    let pixelY = this.y * SQ - rise;
    // ctx.drawImage(CURSOR_IMAGE, pixelX, pixelY)
    const CURSOR_IMAGE = new Image();
    CURSOR_IMAGE.src = "assets/Sprites/cursor.png";
    CURSOR_IMAGE.onload = () => {
      ctx.drawImage(CURSOR_IMAGE, pixelX, pixelY);
    };
  }
}
