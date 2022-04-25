window.BattleAnimations = {
  async spin(event, onComplete) {
    const element = event.caster;
    const animationClassName =
      event.caster.team === "player" ? "enemy" : "player";
    element.classList.add(animationClassName);

    // Remove class when animation is fully complete
    element.addEventListener(
      "animationend",
      () => {
        element.classList.remove(animationClassName);
      },
      {
        once: true,
      }
    );

    // Continue battle cycle after animation
    await utils.wait(100);
    onComplete();
  },
  async glob(event, onComplete) {
    const { caster } = event;
    let div = document.createElement("div");
    div.classList.add("glob-orb");
    div.classList.add(
      caster.team === "player" ? "battle-glob-right" : "battle-glob-left"
    );

    div.innerHTML = `
      <svg viewBox="0 0 32 32" width="32" height="32">
        <circle cx="16" cy="16" r="16" fill="${event.color}" />
      </svg>
    `;

    // Remove class when animation is complete
    div.addEventListener("animationend", () => {
      div.remove();
    });

    document.querySelector(".battle").appendChild(div);

    // Continue battle cycle after animation
    await utils.wait(820);
    onComplete();
  },
};
