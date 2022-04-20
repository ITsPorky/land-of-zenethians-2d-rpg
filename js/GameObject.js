class GameObject {
  constructor(config) {
    this.id = null;
    this.isMounted = false;
    this.x = config.x || 0;
    this.y = config.y || 0;
    this.direction = config.direction || "down";
    this.sprite = new Sprite({
      gameObject: this,
      src: config.src || "/images/characters/player.png",
    });
    this.behaviourLoop = config.behaviourLoop || [];
    this.behaviourLoopIndex = 0;

    this.talking = config.talking || [];
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
}
