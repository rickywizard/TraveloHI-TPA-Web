import background from "../game-assets/background/background.png";
import lifebar from "../game-assets/lifebar full.png";
import win from "../game-assets/win.png";
import draw from "../game-assets/draw.png";
import lose from "../game-assets/lose.png";
import { Player1 } from "./Player1";
import { Player2 } from "./Player2";

export class Background {
  private backgroundImage = new Image();
  private lifebarImage = new Image();
  private drawMatchImage = new Image();
  private winMatchImage = new Image();
  private loseMatchImage = new Image();
  private player1;
  private player2;

  constructor(player1: Player1, player2: Player2) {
    this.backgroundImage.src = background;
    this.lifebarImage.src = lifebar;
    this.drawMatchImage.src = draw;
    this.winMatchImage.src = win;
    this.loseMatchImage.src = lose;
    this.player1 = player1;
    this.player2 = player2;
  }

  draw(ctx: CanvasRenderingContext2D, canvasRef: HTMLCanvasElement) {
    ctx.drawImage(
      this.backgroundImage,
      0,
      0,
      canvasRef.width,
      canvasRef.height
    );
    ctx.fillStyle = "green";
    ctx.fillRect(180, 40, this.player1.getHealth() * 3, 20);
    ctx.save();

    ctx.translate(canvasRef.width, 0)
    ctx.fillStyle = "blue";
    ctx.fillRect(180, 40, this.player2.getHealth() * 3, 20);
    
    ctx.drawImage(this.lifebarImage, 100, 0, 800, 100);
  }
}
