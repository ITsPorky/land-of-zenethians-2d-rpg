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
};
