class KeyboardMenu {
  constructor() {
    this.options = [];
    this.up = null;
    this.down = null;
    this.prevFocus = null;
  }

  setOptions(options) {
    this.options = options;
    this.element.innerHTML = this.options
      .map((option, index) => {
        const disabledAttr = option.disable ? "disabled" : "";
        return `
        <div class="option">
          <button ${disabledAttr} data-button="${index}" data-description="${
          option.description
        }">
            ${option.label}
          </button>
          <span class="right">${option.right ? option.right() : ""}</span>
        </div>
      `;
      })
      .join("");

    this.element.querySelector("button").forEach((button) => {
      button.addEventListener("click", () => {
        const chosenOption = this.options[Number(button.dataset.button)];
        chosenOption.handler();
      });

      button.addEventListener("mouseenter", () => {
        button.focus();
      });
      button.addEventListener("focus", () => {
        this.prevFocus = button;
        this.descriptionElementText.innerHTML = button.dataset.description;
      });
    });
  }

  createElement() {
    this.element = document.createElement("div");
    this.element.classList.add("keyboard-menu");

    // Description box element
    this.descriptionElement = document.createElement("div");
    this.descriptionElement.classList.add("description-box");
    this.descriptionElement.innerHTML = `<p></p>`;
    this.descriptionElementText = this.descriptionElement.querySelector("p");
  }

  init(container) {
    this.createElement();
    container.appendChild(this.descriptionElement);
    container.appendChild(this.element);
  }
}
