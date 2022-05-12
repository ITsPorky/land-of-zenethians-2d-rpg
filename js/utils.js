const utils = {
  withGrid(n) {
    return n * 16;
  },
  asGridCoord(x, y) {
    return `${x * 16}, ${y * 16}`;
  },
  nextPosition(initialX, initialY, direction) {
    let x = initialX;
    let y = initialY;
    const size = 16;
    if (direction === "left") {
      x -= size;
    } else if (direction === "right") {
      x += size;
    } else if (direction === "up") {
      y -= size;
    } else if (direction === "down") {
      y += size;
    }
    return { x, y };
  },
  oppositeDirection(direction) {
    switch (direction) {
      case "left":
        return "right";
      case "right":
        return "left";
      case "up":
        return "down";
      case "down":
        return "up";
    }
  },
  wait(ms) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, ms);
    });
  },
  randomFromArray(array) {
    return array[Math.floor(Math.random() * array.length)];
  },
  emitEvent(name, detail) {
    const event = new CustomEvent(name, { detail });
    document.dispatchEvent(event);
  },
  // Dice Methods
  rollDice(numberOfSides, numberOfRolls = 1) {
    let total = 0;
    for (let i = 0; i < numberOfRolls; i++) {
      let roll = Math.floor(Math.random() * numberOfSides) + 1;
      total += roll;
    }
    return total;
  },
  getRollType(value) {
    switch (value) {
      case "d3":
        return this.rollDice(3);
      case "d4":
        return this.rollDice(4);
      case "d6":
        return this.rollDice(6);
      case "d8":
        return this.rollDice(8);
      case "d10":
        return this.rollDice(10);
      case "d12":
        return this.rollDice(12);
      case "2d3":
        return this.rollDice(3, 2);
      case "3d3":
        return this.rollDice(3, 3);
      case "4d3":
        return this.rollDice(3, 4);
      case "2d4":
        return this.rollDice(4, 2);
      case "3d4":
        return this.rollDice(4, 3);
      case "4d4":
        return this.rollDice(4, 4);
      case "2d6":
        return this.rollDice(6, 2);
    }
  },

  // Create Actions

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
  },
  getSprite(data) {
    return data.sprite_url;
  },
};
