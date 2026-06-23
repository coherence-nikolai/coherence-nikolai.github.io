const heroLens = {
  surface: {
    kicker: "Visible behavior",
    title: "A guarded reply",
    copy: "The surface may be sharp. The world underneath may be protecting someone from feeling exposed."
  },
  world: {
    kicker: "Possible hidden world",
    title: "Safety before openness",
    copy: "They may be moving through a world where saying too much has cost them something before."
  },
  question: {
    kicker: "Wiser next question",
    title: "What would keep dignity intact?",
    copy: "Before I answer the edge, what response would make it safer for both of us to stay human?"
  }
};

const moments = {
  guarded: {
    label: "Visible behavior",
    title: "A guarded reply",
    surface: "The surface story says: they are being difficult.",
    world: "They may be trying to stay composed because the conversation feels more exposing than it appears.",
    question: "What would help me respond to the person, not just the behavior?"
  },
  late: {
    label: "Visible behavior",
    title: "Late again",
    surface: "The surface story says: they do not respect anyone's time.",
    world: "They may be living in a world of pressure, avoidance, shame, or competing obligations they have not named.",
    question: "What boundary can I keep while still leaving room for what I do not know?"
  },
  silent: {
    label: "Visible behavior",
    title: "No response",
    surface: "The surface story says: they are ignoring me.",
    world: "They may be overwhelmed, unsure how to answer, or protecting a fragile pocket of attention.",
    question: "What would be true, kind, and unclingy from my side?"
  }
};

const heroButtons = document.querySelectorAll("[data-lens]");
const heroKicker = document.querySelector("#hero-lens-kicker");
const heroTitle = document.querySelector("#hero-lens-title");
const heroCopy = document.querySelector("#hero-lens-copy");

function setHeroLens(key) {
  const lens = heroLens[key];
  if (!lens) return;

  heroKicker.textContent = lens.kicker;
  heroTitle.textContent = lens.title;
  heroCopy.textContent = lens.copy;

  heroButtons.forEach((button) => {
    const isSelected = button.dataset.lens === key;
    button.setAttribute("aria-pressed", String(isSelected));
  });
}

heroButtons.forEach((button) => {
  button.addEventListener("click", () => setHeroLens(button.dataset.lens));
});

const momentButtons = document.querySelectorAll("[data-moment]");
const momentLabel = document.querySelector("#moment-label");
const momentTitle = document.querySelector("#moment-title");
const momentSurface = document.querySelector("#moment-surface");
const momentWorld = document.querySelector("#moment-world");
const momentQuestion = document.querySelector("#moment-question");

function setMoment(key) {
  const moment = moments[key];
  if (!moment) return;

  momentLabel.textContent = moment.label;
  momentTitle.textContent = moment.title;
  momentSurface.textContent = moment.surface;
  momentWorld.textContent = moment.world;
  momentQuestion.textContent = moment.question;

  momentButtons.forEach((button) => {
    const isSelected = button.dataset.moment === key;
    button.classList.toggle("is-active", isSelected);
    button.setAttribute("aria-pressed", String(isSelected));
  });
}

momentButtons.forEach((button) => {
  button.addEventListener("click", () => setMoment(button.dataset.moment));
});
