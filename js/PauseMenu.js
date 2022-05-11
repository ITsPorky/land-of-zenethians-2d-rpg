class PauseMenu {
  constructor({ onComplete }) {
    this.onComplete = onComplete;
  }

  getOptions(pageKey) {
    if (pageKey === "root") {
      // Case 1: SHow the first page of options
      const lineupPlayers = playerState.lineup.map((id) => {
        const player = playerState.players[id];
        // const base = players[playerId];
        return {
          label: player.name,
          description: player.description,
          handler: () => {
            this.keyboardMenu.setOptions(this.getOptions(id));
          },
        };
      });

      return [
        ...lineupPlayers,
        // All of our players
        {
          label: "Save",
          description: "Save your progress",
          handler: () => {
            // came back later
          },
        },
        {
          label: "Close",
          description: "Close menu",
          handler: () => {
            this.close();
          },
        },
      ];
    }

    // Case 2: Show the options for just one player (by id)
    const unequppied = Object.keys(playerState.players)
      .filter((id) => {
        return playerState.lineup.indexOf(id) === -1;
      })
      .map((id) => {
        const { playerId } = playerState.players[id];
        const base = players[playerId];
        return {
          label: `Swap for ${base.name}`,
          description: base.description,
          handler: () => {
            playerState.swapLineup(pageKey, id);
            this.keyboardMenu.setOptions(this.getOptions("root"));
          },
        };
      });

    return [
      ...unequppied,
      // Swap for any unequipped player
      {
        label: "Move to front",
        descripotion: "Move player to the front of party",
        handler: () => {
          playerState.moveToFront(pageKey);
          this.keyboardMenu.setOptions(this.getOptions("root"));
        },
      },
      {
        label: "Back",
        descripotion: "Back to root menu",
        handler: () => {
          this.keyboardMenu.setOptions(this.getOptions("root"));
        },
      },
    ];
  }

  createElement() {
    this.element = document.createElement("div");
    this.element.classList.add("pause-menu");
    this.element.innerHTML = `
      <h2>Pause Menu</h2>
    `;
  }

  close() {
    this.esc?.unbind();
    this.keyboardMenu.end();
    this.element.remove();
    this.onComplete();
  }

  async init(container) {
    this.createElement();
    this.keyboardMenu = new KeyboardMenu({
      descriptionContainer: container,
    });
    this.keyboardMenu.init(this.element);
    this.keyboardMenu.setOptions(this.getOptions("root"));

    container.appendChild(this.element);

    utils.wait(200);
    this.esc = new KeyPressListener("Escape", () => {
      this.close();
    });
  }
}
