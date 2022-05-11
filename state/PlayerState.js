class PlayerState {
  constructor(data) {
    this.players = {
      player1: {
        ...Players.player1,
        actions: [Players.player1.weapon.type],
        maxHp: Players.player1.hp,
        xp: 40,
        maxXp: 50,
        level: 1,
        status: null,
        isPlayerControlled: true,
      },
    };
    this.lineup = ["player1"];
    this.inventory = [
      { actionId: "item_cureStatusPotion", instanceId: "p1" },
      { actionId: "item_cureStatusPotion", instanceId: "p2" },
      { actionId: "item_hpPotion", instanceId: "p4" },
    ];

    this.storyFlags = {
      TALKED_TO_NPC1: true,
    };
  }

  swapLineup(oldId, incomingId) {
    const oldIndex = this.lineup.indexOf(oldId);
    this.lineup[oldIndex] = incomingId;
    utils.emitEvent("LineupChanged");
  }

  moveToFront(futureFrontId) {
    this.lineup = this.lineup.filter(id !== futureFrontId);
    this.lineup.unshift(futureFrontId);

    utils.emitEvent("LineupChanged");
  }
}

window.playerState = new PlayerState();
