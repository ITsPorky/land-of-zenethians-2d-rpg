class Entity extends GameObject {
  constructor(config) {
    super(config);
    this.movingProgressRemaining = 0;

    this.isPlayerControlled = config.isPlayerControlled || false;

    this.directionUpdate = {
      up: ["y", -1],
      down: ["y", 1],
      left: ["x", -1],
      right: ["x", 1],
    };

    this.seed = config.seed || "123";
    this.data = utils.fetchData(config.seed) || utils.fetchData("123");
    this.src = config.src || "/images/characters/player.png";
  }

  update(state) {
    if (this.movingProgressRemaining > 0) {
      this.updatePosition();
    } else {
      //More cases for starting to walk will come here
      //
      //

      //Case: We're keyboard ready and have an arrow pressed
      if (
        !state.map.isCutscenePlaying &&
        this.isPlayerControlled &&
        state.arrow
      ) {
        this.startBehaviour(state, {
          type: "walk",
          direction: state.arrow,
        });
      }
      // this.updateSprite(state);
    }
  }

  startBehaviour(state, behaviour) {
    //Set character direction to whatever behaviour has
    this.direction = behaviour.direction;

    if (behaviour.type === "walk") {
      //Stop here if space is not free
      if (state.map.isSpaceTaken(this.x, this.y, this.direction)) {
        behaviour.retry &&
          setTimeout(() => {
            this.startBehaviour(state, behaviour);
          }, 10);

        return;
      }

      //Ready to walk!
      state.map.moveWall(this.x, this.y, this.direction);
      this.movingProgressRemaining = 16;
      // this.updateSprite(state);
    }

    if (behaviour.type === "stand") {
      setTimeout(() => {
        utils.emitEvent("PersonStandComplete", {
          whoId: this.id,
        });
      }, behaviour.time);
    }
  }

  updatePosition() {
    const [property, change] = this.directionUpdate[this.direction];
    this[property] += change;
    this.movingProgressRemaining -= 1;

    if (this.movingProgressRemaining === 0) {
      //We finished the walk!
      utils.emitEvent("PersonWalkingComplete", {
        whoId: this.id,
      });
    }
  }

  updateSprite() {
    if (this.movingProgressRemaining > 0) {
      this.sprite.setAnimation("walk-" + this.direction);
      return;
    }
    this.sprite.setAnimation("idle-" + this.direction);
  }

  // Other methods for fetching API data
  async fetchData(seed) {
    const response = await fetch(
      `https://character-generation-api.herokuapp.com/seed/${seed}/metadata`
    );
    const entityData = await response.json();
    return entityData;
  }

  getEntityData() {
    return this.entityData;
  }

  getSprite() {
    return this.entityData.sprite_url;
  }
}
