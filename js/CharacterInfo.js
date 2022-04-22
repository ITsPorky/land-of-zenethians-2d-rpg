class CharacterInfo {
  constructor(seed) {
    this.seed = seed;
    this.data = {};
  }

  async init() {
    this.data = await utils.fetchData(this.seed);
  }
}
