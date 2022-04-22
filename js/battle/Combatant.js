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

  get hpPercent() {
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
        <img class="combatant-character" src="${this.src}" alt="${this.name}" />
      </div>
      <p class="combatant-type">${this.type}</p>
      <svg viewBox="0 0 26 3" class="combatant-life-container">
        <rect x=0 y=0 width="0%" height=1 fill="#82ff71" />
        <rect x=0 y=0 width="0%" height=2 fill="#3ef126" />
      </svg>
      <svg viewBox="0 0 26 2" class="combatant-xp-container">
        <rect x=0 y=0 width="0%" height=1 fill="#ffd76a" />
        <rect x=0 y=0 width="0%" height=2 fill="#ffc934" />
      </svg>
      <p class="combatant-status"></p>
    `;

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
    this.hpFills.forEach((rect) => (rect.style.width = `${this.hpPercent}%`));
    this.hudElement.querySelector(".combatant-level").innerHTML = this.level;
  }

  init(container) {
    this.createElement();
    container.appendChild(this.hudElement);
    this.update();
  }
}
