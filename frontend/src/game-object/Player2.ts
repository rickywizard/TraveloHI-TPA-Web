import idle1 from "../game-assets/blast impulse/idle mirrored/idle 1.png"
import idle2 from "../game-assets/blast impulse/idle mirrored/idle 2.png"
import idle3 from "../game-assets/blast impulse/idle mirrored/idle 3.png"
import idle4 from "../game-assets/blast impulse/idle mirrored/idle 4.png"
import idle5 from "../game-assets/blast impulse/idle mirrored/idle 5.png"
import idle6 from "../game-assets/blast impulse/idle mirrored/idle 6.png"

import mirror1 from "../game-assets/blast impulse/idle/idle 1.png";
import mirror2 from "../game-assets/blast impulse/idle/idle 2.png";
import mirror3 from "../game-assets/blast impulse/idle/idle 3.png";
import mirror4 from "../game-assets/blast impulse/idle/idle 4.png";
import mirror5 from "../game-assets/blast impulse/idle/idle 5.png";
import mirror6 from "../game-assets/blast impulse/idle/idle 6.png";

import walk1 from "../game-assets/blast impulse/walking mirrored/1.png";
import walk2 from "../game-assets/blast impulse/walking mirrored/2.png";
import walk3 from "../game-assets/blast impulse/walking mirrored/3.png";

import walkMirror1 from "../game-assets/blast impulse/walking/1.png";
import walkMirror2 from "../game-assets/blast impulse/walking/2.png";
import walkMirror3 from "../game-assets/blast impulse/walking/3.png";

import frontkick1 from "../game-assets/blast impulse/front kick mirrored/a 1.png"
import frontkick2 from "../game-assets/blast impulse/front kick mirrored/a 2.png"
import frontkick3 from "../game-assets/blast impulse/front kick mirrored/a 3.png"

import frontkickMirror1 from "../game-assets/blast impulse/front kick/1.png"
import frontkickMirror2 from "../game-assets/blast impulse/front kick/2.png"
import frontkickMirror3 from "../game-assets/blast impulse/front kick/3.png"

import lowkick1 from "../game-assets/blast impulse/low kick mirrored/1.png"
import lowkick2 from "../game-assets/blast impulse/low kick mirrored/2.png"
import lowkick3 from "../game-assets/blast impulse/low kick mirrored/3.png"
import lowkick4 from "../game-assets/blast impulse/low kick mirrored/4.png"

import lowkickMirror1 from "../game-assets/blast impulse/low kick/1.png"
import lowkickMirror2 from "../game-assets/blast impulse/low kick/2.png"
import lowkickMirror3 from "../game-assets/blast impulse/low kick/3.png"
import lowkickMirror4 from "../game-assets/blast impulse/low kick/4.png"

import jump from "../game-assets/blast impulse/jump mirrored/1.png"

import back1 from "../game-assets/blast impulse/backward mirrored/1.png"
import back2 from "../game-assets/blast impulse/backward mirrored/2.png"
import back3 from "../game-assets/blast impulse/backward mirrored/3.png"

import backMirrored1 from "../game-assets/blast impulse/backward/1.png"
import backMirrored2 from "../game-assets/blast impulse/backward/2.png"
import backMirrored3 from "../game-assets/blast impulse/backward/3.png"

const importImage = (imageUrl: string) => {
  const image = new Image();
  image.src = imageUrl;

  return image;
};

export class Player2 {
  private state: string;
  private x: number;
  private y: number;
  private width: number;
  private height: number;
  private health: number;
  private damage: number;
  private idleImages: HTMLImageElement[];
  private mirrorImages: HTMLImageElement[];
  private walkImages: HTMLImageElement[];
  private walkMirrorImages: HTMLImageElement[];
  private frontkickImages: HTMLImageElement[];
  private frontkickMirrorImages: HTMLImageElement[];
  private lowkickImages: HTMLImageElement[];
  private lowkickMirrorImages: HTMLImageElement[];
  private jumpImages: HTMLImageElement[];
  private backImages: HTMLImageElement[];
  private backMirrorImages: HTMLImageElement[];
  private canMove: boolean;
  private framesMax = 0
  private framesCurrent = 0
  private framesElapsed = 0
  private framesHold = 16.67
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
    damage: number = 0,
    idleImages: string[] = [idle1, idle2, idle3, idle4, idle5, idle6],
    mirrorImages: string[] = [mirror1, mirror2, mirror3, mirror4, mirror5, mirror6],
    walkImages: string[] = [walk1, walk2, walk3, walk1, walk2, walk3],
    walkMirrorImages: string[] = [walkMirror1, walkMirror2, walkMirror3, walkMirror1, walkMirror2, walkMirror3],
    frontkickImages: string[] = [frontkick1, frontkick2, frontkick3, frontkick1, frontkick2, frontkick3],
    frontkickMirrorImages: string[] = [frontkickMirror1, frontkickMirror2, frontkickMirror3, frontkickMirror1, frontkickMirror2, frontkickMirror3],
    lowkickImages: string[] = [lowkick1, lowkick2, lowkick3, lowkick4, lowkick3, lowkick2],
    lowkickMirrorImages: string[] = [lowkickMirror1, lowkickMirror2, lowkickMirror3, lowkickMirror4, lowkickMirror3, lowkickMirror2],
    jumpImages: string[] = [jump, jump, jump, jump, jump, jump],
    backImages: string[] = [back1, back2, back3, back1, back2, back3],
    backMirrorImages: string[] = [backMirrored1, backMirrored2, backMirrored3, backMirrored1, backMirrored2, backMirrored3]
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
    this.walkImages = walkImages.map((img) => importImage(img));
    this.walkMirrorImages = walkMirrorImages.map((img) => importImage(img));
    this.frontkickImages = frontkickImages.map((img) => importImage(img));
    this.frontkickMirrorImages = frontkickMirrorImages.map((img) => importImage(img));
    this.lowkickImages = lowkickImages.map((img) => importImage(img));
    this.lowkickMirrorImages = lowkickMirrorImages.map((img) => importImage(img));
    this.jumpImages = jumpImages.map((img) => importImage(img));
    this.backImages = backImages.map((img) => importImage(img));
    this.backMirrorImages = backMirrorImages.map((img) => importImage(img));
    this.canMove = true
    this.framesMax = this.getCurrentImage().length
    this.framesCurrent = 0
    this.framesElapsed = 0
    this.framesHold = 16.67
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
    return this.health
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
    switch(this.state) {
      case "idle":
        return this.idleImages;
      case "mirror":
        return this.mirrorImages;
      case "walk":
        return this.walkImages;
      case "walkMirror":
        return this.walkMirrorImages;
      case "frontkick":
        return this.frontkickImages;
      case "frontkickMirror":
        return this.frontkickMirrorImages;
      case "lowkick":
        return this.lowkickImages;
      case "lowkickMirror":
        return this.lowkickMirrorImages;
      case "jump":
        return this.jumpImages;
      case "back":
        return this.backImages;
      case "backMirror":
        return this.backMirrorImages;
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

    ctx.strokeStyle = "green";
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
    this.framesElapsed++

    if (Math.floor(this.framesElapsed % this.framesHold) === 0) {
      if (this.framesCurrent < this.framesMax - 1) {
        this.framesCurrent++
      } else {
        this.framesCurrent = 0
      }
    }
  }

  update(ctx: CanvasRenderingContext2D) {
    this.draw(ctx);
    this.animateFrames();
  }
}
