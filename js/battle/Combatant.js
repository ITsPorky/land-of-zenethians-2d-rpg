class Combatant {
  constructor(config, battle) {
    Object.keys(config).forEach((key) => {
      this[key] = config[key];
    });

    this.battle = battle;
  }

  get hpPercent() {
    const percent = (this.hp / this.maxHp) * 100;
    return percent > 0 ? percent : 0;
  }

  get xpPercent() {
    return (this.xp / this.maxXp) * 100;
  }

  get isActive() {
    return this.battle.activeCombatants[this.team === this.id];
  }

  createElement() {
    this.hudElement = document.createElement("div");
    this.hudElement.classList.add("combatant");
    this.hudElement.setAttribute("data-combatant", this.id);
    this.hudElement.setAttribute("data-team", this.team);
    this.hudElement.innerHTML = `
      <p class="combatant-name">${this.name}</p>
      <p class="combatant-level"></p>
      <div class="combatant-character-crop">
        <img class="combatant-character" src="${this.sprite_url}" alt="${this.name}" />
      </div>
      <p class="combatant-type">${this.class}</p>
      <p class="combatant-life-value">HP:${this.hp}/${this.maxHp}</p>
      <svg viewBox="0 0 26 3" class="combatant-life-container">
        <rect x=0 y=0 width="0%" height=1 fill="#82ff71" />
        <rect x=0 y=0 width="0%" height=2 fill="#3ef126" />
      </svg>
      <p class="combatant-xp-value">XP:${this.xp}/${this.maxXp}</p>
      <svg viewBox="0 0 26 2" class="combatant-xp-container">
        <rect x=0 y=0 width="0%" height=1 fill="#ffd76a" />
        <rect x=0 y=0 width="0%" height=2 fill="#329cff" />
      </svg>
      <p class="combatant-status"></p>
    `;

    this.characterElement = document.createElement("img");
    this.characterElement.classList.add("character");
    this.characterElement.setAttribute("src", this.sprite_url);
    this.characterElement.setAttribute("alt", this.name);
    this.characterElement.setAttribute("data-team", this.team);

    this.hpFills = this.hudElement.querySelectorAll(
      ".combatant-life-container > rect"
    );
    this.xpFills = this.hudElement.querySelectorAll(
      ".combatant-xp-container > rect"
    );
  }

  update(changes = {}) {
    // Update anything incoming
    Object.keys(changes).forEach((key) => {
      this[key] = changes[key];
    });

    // Update HP & XP percent fills
    this.hpFills.forEach((rect) => (rect.style.width = `${this.hpPercent}%`));
    this.xpFills.forEach((rect) => (rect.style.width = `${this.xpPercent}%`));

    // Update level on screen
    this.hudElement.querySelector(".combatant-level").innerHTML = this.level;
    this.characterElement.setAttribute("data-active", this.isActive);

    // Update status
    const statusElement = this.hudElement.querySelector(".combatant-status");
    if (this.status) {
      statusElement.innerText = this.status.type;
      statusElement.style.display = "block";
    } else {
      statusElement.innerText = "";
      statusElement.style.display = "none";
    }
  }

  getReplacedEvents(originalEvents) {
    if (
      this.status?.type === "slippery" &&
      utils.randomFromArray([true, false, false])
    ) {
      return [{ type: "textMessage", text: `${this.name} flops over!` }];
    }

    return originalEvents;
  }

  getPostEvents() {
    if (this.status?.type === "burned") {
      return [
        { type: "textMessage", text: "I am burned!" },
        { type: "stateChange", recover: 5, onCaster: true },
      ];
    }

    return [];
  }

  decrementStatus() {
    if (this.status?.duration > 0) {
      this.status.duration -= 1;
      if (this.status.duration === 0) {
        this.update({
          status: null,
        });
        return {
          type: "textMessage",
          text: `The ${this.status.type} status expired on {PLAYER NAME}!`,
        };
      }
    }
    return null;
  }

  init(container) {
    this.createElement();
    container.appendChild(this.hudElement);
    container.appendChild(this.characterElement);
    this.update();
  }
}
