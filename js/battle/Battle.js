class Battle {
  constructor({ map, enemy, onComplete }) {
    console.log(map);
    this.map = map;
    this.enemy = this.map.gameObjects[enemy];
    this.onComplete = onComplete;

    this.combatants = {};

    this.activeCombatants = {
      player: null,
      enemy: null,
    };

    // Dynamically add the player team
    window.playerState.lineup.forEach((id) => {
      this.addPlayerCombatant(id, "player", window.playerState.players[id]);
    });

    // Dynamically add the enemy team
    this.addCombatant(this.enemy.id, "enemy", this.enemy);

    // Start empty
    this.items = [];

    // Add in player items
    window.playerState.inventory.forEach((item) => {
      this.items.push({
        ...item,
        team: "player",
      });
    });
    this.usedInstanceIds = {};
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
    // console.log("Combatants", this.combatants);
    // console.log("Active Combatants", this.activeCombatants);

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
      onWinner: (winner) => {
        if (winner === "player") {
          const playerState = window.playerState;
          Object.keys(playerState.players).forEach((id) => {
            const player = playerState.players[id];
            const combatant = this.combatants[id];
            if (combatant) {
              player.hp = combatant.hp;
              player.xp = combatant.xp;
              player.maxXp = combatant.maxXp;
              player.level = combatant.level;
            }
          });

          // Get rid of player used items
          playerState.inventory = playerState.inventory.filter((item) => {
            return !this.usedInstanceIds[item.instanceId];
          });

          // Send signal to update HUD
          utils.emitEvent("PlayerStateUpdated");
        }

        this.element.remove();
        this.onComplete(winner === "player");
      },
    });

    this.turnCycle.init();
  }
}
