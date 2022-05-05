class LoadingScreen {
  constructor(overworld) {
    this.overworld = overworld;
    this.element = null;
  }

  createElement() {
    this.element = document.createElement("div");
    this.element.classList.add("loading-screen");
    this.element.innerHTML = `
      <p class='loading-screen-message'>Loading...</p>
    `;
  }

  removeLoadingScreen() {
    this.element.remove();
  }

  async waitForCondition(condition, callback) {
    while (condition === false) {
      if (condition === true) {
        console.log("met");
        callback();
      }
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  isContentLoaded(condition, callback) {
    return new Promise((resolve) => {
      function checkFlag() {
        console.log(condition);
        if (condition.isLoaded === true) {
          console.log("met");
          callback();
          resolve();
        } else {
          console.log("start again");
          window.setTimeout(checkFlag, 100);
        }
      }
      checkFlag();
    });
  }

  async init(container, callback) {
    this.createElement();
    container.appendChild(this.element);

    // Last GameObject
    const last = Object.values(this.overworld.gameObjects).pop();

    await this.isContentLoaded(last, callback);

    // Check each object is loaded
    // Object.values(this.overworld.gameObjects).forEach((object) => {
    //   this.isContentLoaded(object.isLoaded);
    //   console.log(object.isLoaded);
    // });

    // Wait for values before moving on
    // const promise = new Promise(async (resolve, reject) => {
    //   console.log("Entered Promise");
    //   window.setTimeout(() => {
    //     if (last.isLoaded === true) {
    //       resolve();
    //     } else {
    //       reject();
    //     }
    //   }, 100);
    // });

    // promise.then(() => {
    //   console.log("resolved");
    //   callback();
    // });

    // promise.catch(() => {
    //   console.log("Loading Screen Error!");
    // });
  }
}
