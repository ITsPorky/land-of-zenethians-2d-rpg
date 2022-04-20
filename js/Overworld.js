class Overworld {
  constructor(config) {
    this.element = config.element;
    this.canvas = this.element.querySelector(".game-canvas");
    this.ctx = this.canvas.getContext("2d");
    this.map = null;
  }

  startGameLoop() {
    const step = () => {
      // Clear the canvas
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      // Establish Camera Object.
      const cameraObject = this.map.gameObjects.hero;

      // Update all objects
      Object.values(this.map.gameObjects).forEach((object) => {
        object.update({
          arrow: this.directionInput.direction,
          map: this.map,
        });
      });

      // Draw Lower Layer
      this.map.drawLowerImage(this.ctx, cameraObject);

      // Draw Game Objects
      Object.values(this.map.gameObjects)
        .sort((a, b) => {
          return a.y - b.y;
        })
        .forEach((object) => {
          object.sprite.draw(this.ctx, cameraObject);
        });

      // Draw Upper Layer
      this.map.drawUpperImage(this.ctx, cameraObject);

      requestAnimationFrame(() => {
        step();
      });
    };
    step();
  }

  bindActionInput() {
    new KeyPressListener("Enter", () => {
      // Is there an entity to interact with
      this.map.checkForActionCutscene();
    });
  }

  bindHeroPositionCheck() {
    document.addEventListener("PersonWalkingComplete", (e) => {
      if (e.detail.whoId === "hero") {
        // Heros position has changed
        this.map.checkForFootstepCutscene();
      }
    });
  }

  startMap(mapConfig) {
    this.map = new OverworldMap(mapConfig);
    this.map.overworld = this;
    this.map.mountObjects();
  }

  init() {
    this.startMap(window.OverworldMaps.DemoRoom);

    this.bindActionInput();
    this.bindHeroPositionCheck();

    this.directionInput = new DirectionInput();
    this.directionInput.init();

    this.startGameLoop();

    // this.map.startCutscene([
    //   { who: "hero", type: "walk", direction: "down" },
    //   { who: "hero", type: "walk", direction: "down" },
    //   { who: "npc2", type: "walk", direction: "right" },
    //   { who: "npc2", type: "walk", direction: "right" },
    //   { who: "npc1", type: "stand", direction: "up", time: 100 },
    //   { type: "textMessage", text: "Sup you lil pussy bitch" },
    // ]);
  }
}
