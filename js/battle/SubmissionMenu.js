class SubmissionMenu {
  constructor({ caster, enemy, onComplete }) {
    this.caster = caster;
    this.enemy = enemy;
    this.onComplete = onComplete;
  }

  getPages() {
    return {
      root: [
        {
          label: "Attack",
          description: "Choose an attack",
          handler: () => {
            // Do something when chosen...
            console.log("GO TO ATTACKS PAGE");
          },
        },
        {
          label: "Items",
          description: "Choose an item",
          handler: () => {
            // Go to items page...
            console.log("GO TO ITEMS PAGE");
          },
        },
        {
          label: "Swap",
          description: "Change to another party member...",
          handler: () => {
            // Swap to another party member...
            console.log("SWAP PARTY MEMBER");
          },
        },
      ],
      attacks: [],
    };
  }

  decide() {
    this.onComplete({
      action: Actions[this.caster.actions[0]],
      target: this.enemy,
    });
  }

  showMenu(container) {
    this.keyboardMenu = new KeyboardMenu();
    this.keyboardMenu.init(container);
    this.keyboardMenu.setOptions(this.getPages.root);
  }

  init(container) {
    if (this.caster.isPlayerControlled) {
      // Show menu
      this.showMenu(container);
    } else {
      this.decide();
    }
  }
}
