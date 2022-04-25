window.Actions = {
  Bow: {
    name: "Bow Attack",
    success: [
      { type: "textMessage", text: "{CASTER} uses {ACTION}" },
      { type: "animation", animation: "spin" },
      { type: "stateChange", damage: 10 },
    ],
  },
  Staff: {
    name: "Staff Attack",
    success: [
      { type: "textMessage", text: "{CASTER} uses {ACTION}" },
      { type: "animation", animation: "spin" },
      { type: "stateChange", damage: 10 },
    ],
  },
  Sword: {
    name: "Sword Attack",
    success: [
      { type: "textMessage", text: "{CASTER} uses {ACTION}" },
      { type: "animation", animation: "spin" },
      { type: "stateChange", damage: 10 },
    ],
  },
  Dagger: {
    name: "Dagger Attack",
    success: [
      { type: "textMessage", text: "{CASTER} uses {ACTION}" },
      { type: "animation", animation: "spin" },
      { type: "stateChange", damage: 10 },
    ],
  },

  burnStatus: {
    name: "Burning Blaze",
    stargetType: "friendly",
    success: [
      { type: "textMessage", text: "{CASTER} uses {ACTION}" },
      { type: "stateChange", status: { type: "burned", duration: 3 } },
    ],
  },
  clumsyStatus: {
    name: "Ice Floor",
    success: [
      { type: "textMessage", text: "{CASTER} uses {ACTION}" },
      { type: "animation", animation: "glob", color: "#dafd2a" },
      { type: "stateChange", status: { type: "slippery", duration: 3 } },
      {
        type: "textMessage",
        text: "{CASTER} is struggling to stay on their feet!",
      },
    ],
  },
};
