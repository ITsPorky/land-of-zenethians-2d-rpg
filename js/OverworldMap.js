class OverworldMap {
  constructor(config) {
    this.overworld = null;
    this.gameObjects = config.gameObjects;
    this.cutsceneSpaces = config.cutsceneSpaces || {};
    this.walls = config.walls || {};

    this.lowerImage = new Image();
    this.lowerImage.src = config.lowerSrc;

    this.upperImage = new Image();
    this.upperSrc = config.upperSrc;

    this.isCutscenePlaying = false;
  }

  drawLowerImage(ctx, cameraObject) {
    ctx.drawImage(
      this.lowerImage,
      utils.withGrid(10.5) - cameraObject.x,
      utils.withGrid(6) - cameraObject.y
    );
  }

  drawUpperImage(ctx, cameraObject) {
    ctx.drawImage(
      this.upperImage,
      utils.withGrid(10.5) - cameraObject.x,
      utils.withGrid(6) - cameraObject.y
    );
  }

  isSpaceTaken(currentX, currentY, direction) {
    const { x, y } = utils.nextPosition(currentX, currentY, direction);
    return this.walls[`${x}, ${y}`] || false;
  }

  mountObjects() {
    Object.keys(this.gameObjects).forEach((key) => {
      let object = this.gameObjects[key];
      object.id = key;
      // TODO:
      object.mount(this);
    });
  }

  async startCutscene(events) {
    this.isCutscenePlaying = true;

    for (let i = 0; i < events.length; i++) {
      const eventHandler = new OverworldEvent({
        event: events[i],
        map: this,
      });
      await eventHandler.init();
    }

    this.isCutscenePlaying = false;

    // Reset NPCs to do idle behaviour
    Object.values(this.gameObjects).forEach((object) => {
      object.doBehaviourEvent(this);
    });
  }

  checkForActionCutscene() {
    const hero = this.gameObjects["hero"];
    const nextCoords = utils.nextPosition(hero.x, hero.y, hero.direction);
    const match = Object.values(this.gameObjects).find((object) => {
      return `${object.x}, ${object.y}` === `${nextCoords.x}, ${nextCoords.y}`;
    });
    if (!this.isCutscenePlaying && match && match.talking.length) {
      this.startCutscene(match.talking[0].events);
    }
  }

  checkForFootstepCutscene() {
    const hero = this.gameObjects["hero"];
    const match = this.cutsceneSpaces[`${hero.x}, ${hero.y}`];
    if (!this.isCutscenePlaying && match) {
      this.startCutscene(match[0].events);
    }
  }

  addWall(x, y) {
    this.walls[`${x}, ${y}`] = true;
  }

  removeWall(x, y) {
    delete this.walls[`${x}, ${y}`];
  }

  moveWall(wasX, wasY, direction) {
    this.removeWall(wasX, wasY);
    const { x, y } = utils.nextPosition(wasX, wasY, direction);
    this.addWall(x, y);
  }
}

window.OverworldMaps = {
  DemoRoom: {
    lowerSrc: "/assets/images/maps/blank_map.png",
    upperSrc: "",
    gameObjects: {
      hero: new Entity({
        seed: "836",
        isPlayerControlled: true,
        x: utils.withGrid(10),
        y: utils.withGrid(5),
      }),
      npc1: new Entity({
        seed: Math.floor(Math.random() * 1000),
        x: utils.withGrid(5),
        y: utils.withGrid(6),
        behaviourLoop: [
          { type: "walk", direction: "left" },
          { type: "walk", direction: "left" },
          { type: "stand", direction: "up", time: 800 },
          { type: "walk", direction: "up" },
          { type: "walk", direction: "up" },
          { type: "walk", direction: "right" },
          { type: "walk", direction: "right" },
          { type: "walk", direction: "down" },
          { type: "walk", direction: "down" },
        ],
        talking: [
          {
            events: [
              {
                type: "textMessage",
                text: "Sup you lil pussy bitch",
                faceHero: "npc1",
              },
              { type: "textMessage", text: "Leave me alone..." },
              { who: "hero", type: "walk", direction: "right" },
            ],
          },
        ],
      }),
      npc2: new Entity({
        seed: Math.floor(Math.random() * 1000),
        x: utils.withGrid(8),
        y: utils.withGrid(8),
        behaviourLoop: [
          { type: "walk", direction: "right" },
          { type: "walk", direction: "right" },
          { type: "walk", direction: "right" },
          { type: "stand", direction: "down", time: 800 },
          { type: "walk", direction: "left" },
          { type: "walk", direction: "left" },
          { type: "walk", direction: "left" },
          { type: "stand", direction: "down", time: 800 },
        ],
      }),
      npc3: new Entity({
        seed: Math.floor(Math.random() * 1000),
        isPlayerControlled: false,
        x: utils.withGrid(11),
        y: utils.withGrid(8),
      }),
      npc4: new Entity({
        seed: Math.floor(Math.random() * 1000),
        isPlayerControlled: false,
        x: utils.withGrid(12),
        y: utils.withGrid(8),
      }),
      npc5: new Entity({
        seed: Math.floor(Math.random() * 1000),
        isPlayerControlled: false,
        x: utils.withGrid(13),
        y: utils.withGrid(8),
      }),
      npc6: new Entity({
        seed: Math.floor(Math.random() * 1000),
        isPlayerControlled: false,
        x: utils.withGrid(14),
        y: utils.withGrid(8),
      }),
      npc7: new Entity({
        seed: Math.floor(Math.random() * 1000),
        isPlayerControlled: false,
        x: utils.withGrid(15),
        y: utils.withGrid(8),
      }),
    },
    walls: {
      [utils.asGridCoord(0, 1)]: true,
      [utils.asGridCoord(0, 2)]: true,
    },
    cutsceneSpaces: {
      [utils.asGridCoord(7, 4)]: [
        {
          events: [
            { who: "hero", type: "walk", direction: "down" },
            { who: "hero", type: "walk", direction: "left" },
            { type: "textMessage", text: "You can't be in there!" },
          ],
        },
      ],
      [utils.asGridCoord(0, 0)]: [
        {
          events: [{ type: "changeMap", map: "map2" }],
        },
      ],
    },
  },
  map2: {
    lowerSrc: "/assets/images/maps/blank_map.png",
    upperSrc: "",
    gameObjects: {
      hero: new Entity({
        seed: "836",
        isPlayerControlled: true,
        x: utils.withGrid(10),
        y: utils.withGrid(5),
      }),
      npc1: new Entity({
        x: utils.withGrid(5),
        y: utils.withGrid(6),
        behaviourLoop: [
          { type: "walk", direction: "left" },
          { type: "walk", direction: "left" },
          { type: "walk", direction: "right" },
          { type: "walk", direction: "right" },
        ],
        talking: [
          {
            events: [
              {
                type: "textMessage",
                text: "Sup you lil pussy bitch",
                faceHero: "npc1",
              },
              { type: "textMessage", text: "Leave me alone..." },
              { who: "hero", type: "walk", direction: "right" },
            ],
          },
        ],
      }),
    },
    cutsceneSpaces: {
      [utils.asGridCoord(0, 0)]: [
        {
          events: [{ type: "changeMap", map: "DemoRoom" }],
        },
      ],
    },
  },
};
