import idle1 from "../game-assets/sword impulse/idle/sword-impulse_01.png";
import idle2 from "../game-assets/sword impulse/idle/sword-impulse_02.png";
import idle3 from "../game-assets/sword impulse/idle/sword-impulse_03.png";
import idle4 from "../game-assets/sword impulse/idle/sword-impulse_04.png";
import idle5 from "../game-assets/sword impulse/idle/sword-impulse_05.png";
import idle6 from "../game-assets/sword impulse/idle/sword-impulse_06.png";

import mirror1 from "../game-assets/sword impulse/idle mirrored/sword-impulse_01.png";
import mirror2 from "../game-assets/sword impulse/idle mirrored/sword-impulse_02.png";
import mirror3 from "../game-assets/sword impulse/idle mirrored/sword-impulse_03.png";
import mirror4 from "../game-assets/sword impulse/idle mirrored/sword-impulse_04.png";
import mirror5 from "../game-assets/sword impulse/idle mirrored/sword-impulse_05.png";
import mirror6 from "../game-assets/sword impulse/idle mirrored/sword-impulse_06.png";

import walking1 from "../game-assets/sword impulse/walking/sword-impulse_1.png";
import walking2 from "../game-assets/sword impulse/walking/sword-impulse_2.png";
import walking3 from "../game-assets/sword impulse/walking/sword-impulse_3.png";
import walking4 from "../game-assets/sword impulse/walking/sword-impulse_4.png";
import walking5 from "../game-assets/sword impulse/walking/sword-impulse_5.png";
import walking6 from "../game-assets/sword impulse/walking/sword-impulse_6.png";
import walking7 from "../game-assets/sword impulse/walking/sword-impulse_7.png";
import walking8 from "../game-assets/sword impulse/walking/sword-impulse_8.png";
import walking9 from "../game-assets/sword impulse/walking/sword-impulse_9.png";
import walking10 from "../game-assets/sword impulse/walking/sword-impulse_10.png";

import backward1 from "../game-assets/sword impulse/backward/sword-impulse_1.png";
import backward2 from "../game-assets/sword impulse/backward/sword-impulse_2.png";
import backward3 from "../game-assets/sword impulse/backward/sword-impulse_3.png";
import backward4 from "../game-assets/sword impulse/backward/sword-impulse_4.png";
import backward5 from "../game-assets/sword impulse/backward/sword-impulse_5.png";
import backward6 from "../game-assets/sword impulse/backward/sword-impulse_6.png";
import backward7 from "../game-assets/sword impulse/backward/sword-impulse_7.png";
import backward8 from "../game-assets/sword impulse/backward/sword-impulse_8.png";
import backward9 from "../game-assets/sword impulse/backward/sword-impulse_9.png";
import backward10 from "../game-assets/sword impulse/backward/sword-impulse_10.png";

import jumping1 from "../game-assets/sword impulse/jumping/sword-impulse_jump_01.png"
import jumping2 from "../game-assets/sword impulse/jumping/sword-impulse_jump_02.png"
import jumping3 from "../game-assets/sword impulse/jumping/sword-impulse_jump_03.png"
import jumping4 from "../game-assets/sword impulse/jumping/sword-impulse_jump_04.png"
import jumping5 from "../game-assets/sword impulse/jumping/sword-impulse_jump_05.png"
import jumping6 from "../game-assets/sword impulse/jumping/sword-impulse_jump_06.png"

import frontkick1 from "../game-assets/sword impulse/front kick/sword-impulse_01.png" 
import frontkick2 from "../game-assets/sword impulse/front kick/sword-impulse_02.png" 
import frontkick3 from "../game-assets/sword impulse/front kick/sword-impulse_03.png" 
import frontkick4 from "../game-assets/sword impulse/front kick/sword-impulse_04.png" 

import backkick1 from "../game-assets/sword impulse/front kick mirrored/sword-impulse_01.png"
import backkick2 from "../game-assets/sword impulse/front kick mirrored/sword-impulse_02.png"
import backkick3 from "../game-assets/sword impulse/front kick mirrored/sword-impulse_03.png"
import backkick4 from "../game-assets/sword impulse/front kick mirrored/sword-impulse_04.png"

import lowkick1 from "../game-assets/sword impulse/low kick/sword-impulse_01.png"
import lowkick2 from "../game-assets/sword impulse/low kick/sword-impulse_02.png"
import lowkick3 from "../game-assets/sword impulse/low kick/sword-impulse_03.png"

import lowbackkick1 from "../game-assets/sword impulse/low kick mirrored/sword-impulse_01.png"
import lowbackkick2 from "../game-assets/sword impulse/low kick mirrored/sword-impulse_02.png"
import lowbackkick3 from "../game-assets/sword impulse/low kick mirrored/sword-impulse_03.png"

const importImage = (imageUrl: string) => {
  const image = new Image();
  image.src = imageUrl;

  return image;
};

export class Player1 {
  private state: string;
  private x: number;
  private y: number;
  private width: number;
  private height: number;
  private health: number;
  private damage: number;
  private idleImages: HTMLImageElement[];
  private mirrorImages: HTMLImageElement[];
  private walkingImages: HTMLImageElement[];
  private backwardImages: HTMLImageElement[];
  private jumpingImages: HTMLImageElement[];
  private frontkickImages: HTMLImageElement[];
  private backkickImages: HTMLImageElement[];
  private lowkickImages: HTMLImageElement[];
  private lowbackkickImages: HTMLImageElement[];
  private canMove: boolean;
  private framesMax = 0;
  private framesCurrent = 0;
  private framesElapsed = 0;
  private framesHold = 16.67;
  collisionBox: {
    x: number;
    y: number;
    width: number;
    height: number
  };

  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    state: string = "idle",
    health: number = 100,
    damage: number = 10,
    idleImages: string[] = [idle1, idle2, idle3, idle4, idle5, idle6],
    mirrorImages: string[] = [mirror1, mirror2, mirror3, mirror4, mirror5, mirror6],
    walkingImages: string[] = [walking1, walking2, walking3, walking4, walking5, walking6, walking7,walking8, walking9, walking10],
    backwardImages: string[] = [backward1, backward2, backward3, backward4, backward4, backward5, backward6, backward7, backward8, backward9, backward10],
    jumpingImages: string[] = [jumping1, jumping2, jumping3, jumping4, jumping5, jumping6],
    frontkickImages: string[] = [frontkick1, frontkick2, frontkick3, frontkick4, frontkick3, frontkick2],
    backkickImages: string[] = [backkick1, backkick2, backkick3, backkick4, backkick3, backkick2],
    lowkickImages: string[] = [lowkick1, lowkick2, lowkick3, lowkick1, lowkick2, lowkick3],
    lowbackkickImages: string[] = [lowbackkick1, lowbackkick2, lowbackkick3, lowbackkick1, lowbackkick2, lowbackkick3]
  ) {
    this.state = state;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.health = health;
    this.damage = damage;
    this.idleImages = idleImages.map((img) => importImage(img));
    this.mirrorImages = mirrorImages.map((img) => importImage(img));
    this.walkingImages = walkingImages.map((img) => importImage(img));
    this.backwardImages = backwardImages.map((img) => importImage(img));
    this.jumpingImages = jumpingImages.map((img) => importImage(img));
    this.frontkickImages = frontkickImages.map((img) => importImage(img));
    this.backkickImages = backkickImages.map((img) => importImage(img));
    this.lowkickImages = lowkickImages.map((img) => importImage(img));
    this.lowbackkickImages = lowbackkickImages.map((img) => importImage(img));
    this.canMove = true;
    this.framesMax = this.getCurrentImage().length;
    this.framesCurrent = 0;
    this.framesElapsed = 0;
    this.framesHold = 16.67;
    this.collisionBox = {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height
    }
  }

  getWidth(): number {
    return this.width
  }

  getX(): number {
    return this.x;
  }

  setX(x: number) {
    this.x = x;
  }
  
  getY(): number {
    return this.y;
  }

  setY(y: number) {
    this.y = y;
  }

  getHealth(): number {
    return this.health;
  }

  setHealth(health: number) {
    this.health = health;
  }

  getDamage(): number {
    return this.damage
  }
  
  setDamage(damage: number) {
    this.damage = damage
  }

  getState(): string {
    return this.state
  }

  setState(state: string) {
    this.state = state;
  }

  getCanMove(): boolean {
    return this.canMove;
  }

  setCanMove(canMove: boolean) {
    this.canMove = canMove;
  }

  getCurrentImage(): HTMLImageElement[] {
    switch (this.state) {
      case "idle":
        return this.idleImages;
      case "mirror":
        return this.mirrorImages;
      case "walkingFront":
        return this.walkingImages;
      case "walkingBack":
        return this.backwardImages;
      case "jump":
        return this.jumpingImages;
      case "frontkick":
        return this.frontkickImages;
      case "backkick":
        return this.backkickImages;
      case "lowkick":
        return this.lowkickImages;
      case "lowbackkick":
        return this.lowbackkickImages;
      default:
        return this.idleImages;
    }
  }

  updateCollisionBox() {
    this.collisionBox = {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    const currentSprite = this.getCurrentImage();
    const borderWidth = 3;

    ctx.strokeStyle = "red";
    ctx.lineWidth = borderWidth;
    ctx.strokeRect(this.x, this.y, this.width, this.height);

    let currentImage = currentSprite[this.framesCurrent]
    if (currentImage instanceof HTMLImageElement) {
      ctx.drawImage(
        currentImage,
        this.x,
        this.y,
        this.width,
        this.height
      );
    }
  }

  animateFrames() {
    this.framesElapsed++;

    if (Math.floor(this.framesElapsed % this.framesHold) === 0) {
      if (this.framesCurrent < this.framesMax - 1) {
        this.framesCurrent++;
      } else {
        this.framesCurrent = 0;
      }
    }
  }

  update(ctx: CanvasRenderingContext2D) {
    this.draw(ctx);
    this.animateFrames();
  }
}
