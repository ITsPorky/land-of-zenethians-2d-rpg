class Battle {
  constructor({ enemy, onComplete }) {
    this.enemy = enemy;
    this.onComplete = onComplete;

    this.combatants = {
      // player1: new Combatant(
      //   {
      //     ...Players.player1,
      //     actions: [Players.player1.weapon.type],
      //     team: "player",
      //     maxHp: Players.player1.hp,
      //     xp: 0,
      //     maxXp: 50,
      //     level: 1,
      //     status: null,
      //     isPlayerControlled: true,
      //   },
      //   this
      // ),
      // enemy1: new Combatant(
      //   {
      //     ...Players.player1,
      //     actions: [Players.player1.weapon.type],
      //     team: "enemy",
      //     maxHp: Players.player1.hp,
      //     xp: 20,
      //     maxXp: 50,
      //     level: 1,
      //     status: null,
      //   },
      //   this
      // ),
    };

    this.activeCombatants = {
      player: null,
      enemy: null,
    };

    // Dynamically add the player team
    window.playerState.lineup.forEach((id) => {
      this.addPlayerCombatant(id, "player", window.playerState.player[id]);
    });

    console.log(this.enemy.attributes);
    // Dynamically add the enemy team
    this.addCombatant(this.enemy.id, "enemy", this.enemy);

    this.items = [
      // { actionId: "item_cureStatusPotion", instanceId: "p1", team: "player" },
      // { actionId: "item_cureStatusPotion", instanceId: "p2", team: "player" },
      // { actionId: "item_cureStatusPotion", instanceId: "p3", team: "enemy" },
      // { actionId: "item_hpPotion", instanceId: "p4", team: "player" },
    ];
  }

  addPlayerCombatant(id, team, config) {
    this.combatants[id] = new Combatant(
      {
        ...Players[config.playerId],
        ...config,
        team,
        isPlayerControlled: team === "player",
      },
      this
    );

    // Populate first active combatant
    this.activeCombatants[team] = this.activeCombatants[team] || id;
  }

  addCombatant(id, team, combatantData) {
    this.combatants[id] = new Combatant(
      {
        ...combatantData.attributes,
        actions: [combatantData.attributes.weapon.type],
        team,
        maxHp: combatantData.attributes.hp,
        xp: 40,
        maxXp: 50,
        level: 1,
        status: null,
        isPlayerControlled: team === "player",
      },
      this
    );
    // Populate first active combatant
    this.activeCombatants[team] = this.activeCombatants[team] || id;
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
    console.log("Combatants", this.combatants);
    console.log("Active Combatants", this.activeCombatants);

    this.createElement();
    container.appendChild(this.element);

    this.playerTeam = new Team("player", "Hero");
    this.enemyTeam = new Team("enemy", "Villain");

    Object.keys(this.combatants).forEach((key) => {
      let combatant = this.combatants[key];
      combatant.id = key;
      combatant.init(this.element);

      // Add correct team
      if (combatant.team === "player") {
        this.playerTeam.combatants.push(combatant);
      } else if (combatant.team === "enemy") {
        this.enemyTeam.combatants.push(combatant);
      }
    });

    this.playerTeam.init(this.element);
    this.enemyTeam.init(this.element);

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
