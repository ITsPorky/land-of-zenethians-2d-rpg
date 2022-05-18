class Sprite {
  constructor(config) {
    // Setup Image
    this.image = new Image();
    this.image.src = config.src;
    this.image.onload = () => {
      this.isLoaded = true;
    };

    // Shadow
    this.shadow = new Image();
    this.useShadow = true;
    if (this.useShadow) {
      this.shadow.src = "/assets/images/characters/shadow.png";
    }
    this.shadow.onload = () => {
      this.isShadowLoaded = true;
    };

    // Configuring Animation & Initial State
    this.animations = config.animations || {
      "idle-down": [[0, 0]],
      "idle-right": [[0, 1]],
      "idle-up": [[0, 2]],
      "idle-left": [[0, 3]],
    };
    this.currentAnimation = config.currentAnimation || "idle-down";
    this.currentAnimationFrame = 0;

    this.animationFrameLimit = config.animationFrameLimit || 8; // change default value to change animation speed
    this.animationFrameProgress = this.animationFrameLimit;

    // Reference the game object
    this.gameObject = config.gameObject;
  }

  get frame() {
    return this.animations[this.currentAnimation][this.currentAnimationFrame];
  }

  setAnimation(key) {
    if (this.currentAnimation !== key) {
      this.currentAnimation = key;
      this.currentAnimationFrame = 0;
      this.animationFrameProgress = this.animationFrameLimit;
    }
  }

  updateAnimationProgress() {
    // Downtick frame progress
    if (this.animationFrameProgress > 0) {
      this.animationFrameProgress -= 1;
      return;
    }

    // Reset the Counter
    this.animationFrameProgress = this.animationFrameLimit;
    this.currentAnimationFrame = +1;

    if (this.frame === undefined) {
      this.currentAnimationFrame = 0;
    }
  }

  draw(ctx, cameraObject) {
    // Get sprite sizing and correctly position.
    if (this.gameObject.is32x32) {
      // place 32x32 sprites on 16x16 squares
      const size = 32;
      const x = this.gameObject.x - 8 + utils.withGrid(10.5) - cameraObject.x;
      const y = this.gameObject.y - 22 + utils.withGrid(6) - cameraObject.y; // 18

      this.isShadowLoaded && ctx.drawImage(this.shadow, x, y + 2);

      const [frameX, frameY] = this.frame;

      this.isLoaded &&
        ctx.drawImage(
          this.image,
          frameX * size,
          frameY * size,
          size,
          size,
          x,
          y,
          size,
          size
        ); // try changing 32 to 16 and vice/versa
    } else {
      // place 16x16 sprites on 16x16 squares
      const size = 16;
      const x = this.gameObject.x - 8 + utils.withGrid(10.5) - cameraObject.x;
      const y = this.gameObject.y - 22 + utils.withGrid(6) - cameraObject.y; // 18

      this.isShadowLoaded && ctx.drawImage(this.shadow, x, y + 2);

      const [frameX, frameY] = this.frame;

      this.isLoaded &&
        ctx.drawImage(
          this.image,
          frameX * size,
          frameY * size,
          size,
          size,
          x,
          y,
          size,
          size
        ); // try changing 32 to 16 and vice/versa
    }

    this.updateAnimationProgress();
  }
}
