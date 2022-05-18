class CraftingStation extends GameObject {
  constructor(config) {
    super(config);
    this.isLoaded = true;
    this.sprite = new Sprite({
      gameObject: this,
      src: "/assets/images/objects/crafting-station.png",
      animations: {
        "used-down": [[0, 0]],
        "unused-down": [[1, 0]],
      },
      currentAnimation: "used-down",
    });
  }
}
