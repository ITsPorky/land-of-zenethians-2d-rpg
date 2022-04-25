class Battle {
  constructor() {
    (this.combatants = {
      player1: new Combatant(
        {
          ...Players.player1,
          team: "player",
          hp: 10,
          maxHp: 20,
          xp: 0,
          maxXp: 50,
          level: 1,
          status: null,
          isPlayerControlled: true,
        },
        this
      ),
      enemy1: new Combatant(
        {
          ...Players.player1,
          team: "enemy",
          hp: 10,
          maxHp: 20,
          xp: 0,
          maxXp: 50,
          level: 1,
          status: null,
        },
        this
      ),
    }),
      (this.activeCombatants = {
        player: "player1",
        enemy: "enemy1",
      });
  }

  createElement() {
    this.element = document.createElement("div");
    this.element.classList.add("battle");
    this.element.innerHTML = `
      <div class="battle-hero">
        <img src="${"/assets/images/characters/player.png"}" alt="hero" />
      </div>
      <div class="battle-enemy">
        <img src="${"/assets/images/characters/player.png"}" alt="enemy" />
      </div>
    `;
  }

  init(container) {
    this.createElement();
    container.appendChild(this.element);

    Object.keys(this.combatants).forEach((key) => {
      let combatant = this.combatants[key];
      combatant.id = key;
      combatant.init(this.element);
    });

    this.turnCycle = new TurnCycle({
      battle: this,
      onNewEvent: (event) => {
        return new Promise((resolve) => {
          const battleEvent = new BattleEvent(event, this);
          battleEvent.init(resolve);
        });
      },
    });

    this.turnCycle.init();
  }
}
