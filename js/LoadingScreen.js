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

  isContentLoaded(flag) {
    if (flag === true) {
      return;
    }
    window.setTimeout(this.isContentLoaded(flag), 5000);
  }

  init(container, callback) {
    this.createElement();
    container.appendChild(this.element);

    // Last GameObject
    const last = Object.values(this.overworld.gameObjects).pop();

    // Check each object is loaded
    // Object.values(this.overworld.gameObjects).forEach((object) => {
    //   this.isContentLoaded(object.isLoaded);
    //   console.log(object.isLoaded);
    // });

    // Wait for values before moving on
    const promise = new Promise((resolve, reject) => {
      window.setTimeout(() => {
        if (last.isLoaded === true) {
          resolve();
        }
      }, 1000);
    });

    promise.then(() => {
      callback();
    });
  }
}
