class Overworld {
  constructor(config) {
    this.element = config.element;
    this.canvas = this.element.querySelector(".game-canvas");
    this.ctx = this.canvas.getContext("2d");
    this.map = null;

    this.isContentLoaded = false;
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
          return a.y - b.y - (a.x - b.x); // Sort images for left to right and up to down
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

  drawLoadingScreen() {
    const loadingScreen = document.createElement("div");
    loadingScreen.classList.add("loading-screen");
    loadingScreen.innerHTML = `
      <p class='loading-screen-message'>Loading...</p>
    `;
    this.element.appendChild(loadingScreen);
  }

  init() {
    // Add loading screen to wait until the characters
    // and all entities have been loaded.
    // this.drawLoadingScreen();

    this.startMap(window.OverworldMaps.DemoRoom);

    this.bindActionInput();
    this.bindHeroPositionCheck();

    this.directionInput = new DirectionInput();
    this.directionInput.init();

    this.startGameLoop();

    this.map.startCutscene([
      { type: "battle" },
      // { who: "hero", type: "walk", direction: "down" },
      // { who: "npc1", type: "stand", direction: "up", time: 100 },
      // { type: "textMessage", text: "Welcome to the Land of Zenethians..." },
      // {
      //   type: "textMessage",
      //   text: "Here you will face many challenges. The world of Zenethia is an unforgiving place, filled with lots of mystery...",
      // },
      // {
      //   type: "textMessage",
      //   text: "During your travels you will meet many people and embark on many quests...",
      // },
      // {
      //   type: "textMessage",
      //   text: "Good luck traveller. May Zenethia treat you well...",
      // },
    ]);
  }
}
