class GameObject {
  constructor(config) {
    this.id = null;
    this.isMounted = false;
    this.x = config.x || 0;
    this.y = config.y || 0;
    this.direction = config.direction || "down";
    // Get json data from seed
    this.seed = config.seed || "0";
    // Create empty data object
    this.data = {};
    // When data is fetched callback and add data to this.data
    this.fetchData(this.seed, (jsonData) => {
      this.data = jsonData;
      // Create new sprite from API data
      this.sprite = new Sprite({
        gameObject: this,
        src: utils.getSprite(this.data) || "/images/characters/player.png",
      });
    });

    // Create default sprite
    this.sprite = new Sprite({
      gameObject: this,
      src: utils.getSprite(this.data) || "/images/characters/player.png",
    });

    this.behaviourLoop = config.behaviourLoop || [];
    this.behaviourLoopIndex = 0;
    this.talking = config.talking || [];
    console.log("constructor complete", this);
  }

  mount(map) {
    console.log("Mounting....");
    this.isMounted = true;
    map.addWall(this.x, this.y);

    // if we have a behaviour, kick off after a short delay
    setTimeout(() => {
      this.doBehaviourEvent(map);
    }, 10);
  }

  update() {}

  async doBehaviourEvent(map) {
    // Don't do anything if there is a more important cutscene or there is no behaviour config
    if (
      map.isCutscenePlaying ||
      this.behaviourLoop.length === 0 ||
      this.isStanding
    ) {
      return;
    }

    // Setting up our event with relevant info
    let eventConfig = this.behaviourLoop[this.behaviourLoopIndex];
    eventConfig.who = this.id;

    // Create an event instance out of our next event config
    const eventHandler = new OverworldEvent({ map, event: eventConfig });
    await eventHandler.init();

    // Setting next event to fire.
    this.behaviourLoopIndex += 1;
    if (this.behaviourLoopIndex === this.behaviourLoop.length) {
      this.behaviourLoopIndex = 0;
    }

    // Do it again!
    this.doBehaviourEvent(map);
  }

  // Method for fetching API data
  async fetchData(seed, callback) {
    try {
      const api_url = `https://character-generation-api.herokuapp.com/seed/${seed}/metadata`;
      const response = await fetch(api_url);
      const data = await response.json();
      callback(data);
    } catch (err) {
      console.log(err);
    }
  }
}
