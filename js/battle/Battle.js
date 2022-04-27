class Battle {
  constructor() {
    (this.combatants = {
      player1: new Combatant(
        {
          ...Players.player1,
          actions: [Players.player1.weapon.type],
          team: "player",
          maxHp: Players.player1.hp,
          xp: 20,
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
          actions: [Players.player1.weapon.type],
          team: "enemy",
          maxHp: Players.player1.hp,
          xp: 20,
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
    this.items = [
      { actionId: "item_cureStatusPotion", instanceId: "p1", team: "player" },
      { actionId: "item_cureStatusPotion", instanceId: "p2", team: "player" },
      { actionId: "item_cureStatusPotion", instanceId: "p3", team: "enemy" },
      { actionId: "item_hpPotion", instanceId: "p4", team: "player" },
    ];
  }

  createElement() {
    this.element = document.createElement("div");
    this.element.classList.add("battle");
    // this.element.innerHTML = `
    //   <div class="battle-hero">
    //     <img src="${this.combatants.player1.sprite_url}" alt="hero" />
    //   </div>
    //   <div class="battle-enemy">
    //     <img src="${this.combatants.enemy1.sprite_url}" alt="enemy" />
    //   </div>
    // `;
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
