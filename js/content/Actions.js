window.Actions = {
  Bow: {
    name: "Bow Attack",
    description: "Fire an arrow at your oppenent",
    success: [
      { type: "textMessage", text: "{CASTER} uses {ACTION}" },
      { type: "animation", animation: "spin" },
      { type: "stateChange", damage: "d6" },
    ],
  },
  Staff: {
    name: "Staff Attack",
    description: "Casts deadly magic at opponent",
    success: [
      { type: "textMessage", text: "{CASTER} uses {ACTION}" },
      { type: "animation", animation: "spin" },
      { type: "stateChange", damage: "d6" },
    ],
  },
  Sword: {
    name: "Sword Attack",
    description: "Slash or stab the opponent with a sword",
    success: [
      { type: "textMessage", text: "{CASTER} uses {ACTION}" },
      { type: "animation", animation: "spin" },
      { type: "stateChange", damage: "d6" },
    ],
  },
  Dagger: {
    name: "Dagger Attack",
    description: "Slash or stab the opponent with a dagger",
    success: [
      { type: "textMessage", text: "{CASTER} uses {ACTION}" },
      { type: "animation", animation: "spin" },
      { type: "stateChange", damage: "d6" },
    ],
  },
  // Status actions
  burning: {
    name: "Burning",
    targetType: "friendly",
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

  // Items
  item_cureStatusPotion: {
    name: "Cure Status Potion",
    description: "Heals the user of all status effects",
    targetType: "friendly",
    success: [
      { type: "textMessage", text: "{CASTER} uses a {ACTION}" },
      { type: "stateChange", status: null },
      {
        type: "textMessage",
        text: "Status effects have been cleared from {TARGET}!",
      },
    ],
  },
  item_hpPotion: {
    name: "Healing Potion",
    description: "Heals the users HP",
    targetType: "friendly",
    success: [
      { type: "textMessage", text: "{CASTER} uses a {ACTION}" },
      { type: "stateChange", recover: 10 },
      {
        type: "textMessage",
        text: "{TARGET}'s HP has been restored!",
      },
    ],
  },
};
