class LoadingScreen {
  constructor(data) {
    this.data = data;
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

  isContentLoaded(condition, callback) {
    return new Promise((resolve) => {
      function checkFlag() {
        if (condition.isLoaded === true) {
          console.log("Content loaded...");
          callback();
          resolve();
        } else {
          console.log("Loading...");
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
    const last = Object.values(this.data).pop();

    await this.isContentLoaded(last, callback);
  }
}
