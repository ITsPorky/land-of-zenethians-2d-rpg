class TurnCycle {
  constructor({ battle, onNewEvent, onWinner }) {
    this.battle = battle;
    this.onNewEvent = onNewEvent;
    this.onWinner = onWinner;
    this.currentTeam = "player"; // or enemy
  }

  async turn() {
    // Get the caster
    const casterId = this.battle.activeCombatants[this.currentTeam];
    const caster = this.battle.combatants[casterId];
    const enemyId =
      this.battle.activeCombatants[
        caster.team === "player" ? "enemy" : "player"
      ];
    const enemy = this.battle.combatants[enemyId];

    const submission = await this.onNewEvent({
      type: "submissionMenu",
      caster,
      enemy,
    });

    if (submission.instanceId) {
      // Add to list to persist to player list later
      this.battle.usedInstanceIds[submission.instanceId] = true;

      // Remove item from battle state
      this.battle.items = this.battle.items.filter(
        (i) => i.instanceId !== submission.instanceId
      );
    }

    const resultingEvents = caster.getReplacedEvents(submission.action.success);

    for (let i = 0; i < resultingEvents.length; i++) {
      const event = {
        ...resultingEvents[i],
        submission,
        action: submission.action,
        caster,
        target: submission.target,
      };
      await this.onNewEvent(event);
    }

    // Did the target die?
    const targetDead = submission.target.hp <= 0;
    if (targetDead) {
      await this.onNewEvent({
        type: "textMessage",
        text: `${submission.target.name} is dead!`,
      });

      if (submission.target.team === "enemy") {
        const playerId = this.battle.activeCombatants.player;
        const xp = submission.target.givesXP;

        await this.onNewEvent({
          type: "textMessage",
          text: `${this.battle.combatants[playerId].name} gained ${xp} XP!`,
        });

        await this.onNewEvent({
          type: "giveXP",
          xp,
          combatant: this.battle.combatants[playerId],
        });
      }
    }

    // Do we have a winning team?
    const winner = this.getWinningTeam();
    if (winner) {
      await this.onNewEvent({
        type: "textMessage",
        text: "Winner!",
      });
      this.onWinner(winner);
      return;
    }

    // Check for post events
    // (DO things after original turn submission)
    const postEvents = caster.getPostEvents();
    for (let i = 0; i < postEvents.length; i++) {
      const event = {
        ...postEvents[i],
        submission,
        action: submission.action,
        caster,
        target: submission.target,
      };
      await this.onNewEvent(event);
    }

    // Check for a status expire
    const expiredEvent = caster.decrementStatus();
    if (expiredEvent) {
      await this.onNewEvent(expiredEvent);
    }

    // Swap active team for next turn
    this.currentTeam = this.currentTeam === "player" ? "enemy" : "player";

    // Recursivly call to play the next turn
    this.turn();
  }

  getWinningTeam() {
    let aliveTeams = {};
    Object.values(this.battle.combatants).forEach((c) => {
      if (c.hp > 0) {
        aliveTeams[c.team] = true;
      }
    });
    if (!aliveTeams["player"]) {
      return "enemy";
    }
    if (!aliveTeams["enemy"]) {
      return "player";
    }
  }

  async init() {
    await this.onNewEvent({
      type: "textMessage",
      text: `Yo have enetered combat with ${this.battle.enemy.attributes.name}`,
    });

    // Start the first turn
    this.turn();
  }
}
