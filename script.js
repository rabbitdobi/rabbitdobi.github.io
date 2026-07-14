const composerData = {
  "lawful-good": {
    key: "bach",
    name: "Johann Sebastian Bach",
    shortName: "Bach",
    alignment: "Lawful Good",
    monogram: "JB",
    description: "Meticulous counterpoint, spiritual clarity, and an extraordinary sense of balance make Bach the architect of this grid.",
    work: "Goldberg Variations"
  },
  "neutral-good": {
    key: "schubert",
    name: "Franz Schubert",
    shortName: "Schubert",
    alignment: "Neutral Good",
    monogram: "FS",
    description: "Schubert pairs natural melodic warmth with intimate melancholy. His music feels humane, direct, and quietly generous.",
    work: "Impromptu in G-flat major, D. 899 No. 3"
  },
  "chaotic-good": {
    key: "beethoven",
    name: "Ludwig van Beethoven",
    shortName: "Beethoven",
    alignment: "Chaotic Good",
    monogram: "LB",
    description: "Beethoven bends inherited forms toward freedom, struggle, and hard-won joy. The rules matter—until expression demands that they change.",
    work: "Symphony No. 7"
  },
  "lawful-neutral": {
    key: "brahms",
    name: "Johannes Brahms",
    shortName: "Brahms",
    alignment: "Lawful Neutral",
    monogram: "JB",
    description: "Brahms combines disciplined architecture with dense Romantic feeling. Every detail sounds considered, grounded, and deeply crafted.",
    work: "Symphony No. 4"
  },
  "neutral-neutral": {
    key: "debussy",
    name: "Claude Debussy",
    shortName: "Debussy",
    alignment: "True Neutral",
    monogram: "CD",
    description: "Debussy lets harmony, color, and atmosphere coexist without forcing a single destination. His music lives beautifully between clarity and mystery.",
    work: "La mer"
  },
  "chaotic-neutral": {
    key: "mahler",
    name: "Gustav Mahler",
    shortName: "Mahler",
    alignment: "Chaotic Neutral",
    monogram: "GM",
    description: "Mahler's vast sound worlds swing between tenderness, irony, collapse, and transcendence. Contradiction is not a flaw—it is the whole universe.",
    work: "Symphony No. 5"
  },
  "lawful-evil": {
    key: "wagner",
    name: "Richard Wagner",
    shortName: "Wagner",
    alignment: "Lawful Evil",
    monogram: "RW",
    description: "Wagner builds immense dramatic systems from leitmotifs, chromatic tension, and relentless control. The result is commanding and inescapable.",
    work: "Prelude to Tristan und Isolde"
  },
  "neutral-evil": {
    key: "scriabin",
    name: "Alexander Scriabin",
    shortName: "Scriabin",
    alignment: "Neutral Evil",
    monogram: "AS",
    description: "Scriabin's mystical harmonies and ecstatic climaxes glow with seductive unease, suspended between private revelation and cosmic obsession.",
    work: "The Poem of Ecstasy"
  },
  "chaotic-evil": {
    key: "ligeti",
    name: "György Ligeti",
    shortName: "Ligeti",
    alignment: "Chaotic Evil",
    monogram: "GL",
    description: "Ligeti turns dense textures, impossible rhythms, and uncanny sonorities into meticulously controlled chaos that feels entirely new.",
    work: "Atmosphères"
  }
};

document.querySelectorAll(".contact-form").forEach((form) => {
  const status = form.querySelector(".form-status");

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const fields = {
      name: form.elements.name,
      email: form.elements.email,
      message: form.elements.message
    };
    const errors = {};

    if (!fields.name.value.trim()) errors.name = "Please enter your name.";
    if (!fields.email.value.trim()) {
      errors.email = "Please enter your email.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email.value.trim())) {
      errors.email = "Please enter a valid email address.";
    }
    if (!fields.message.value.trim()) errors.message = "Please enter a message.";

    Object.entries(fields).forEach(([name, field]) => {
      const errorElement = form.querySelector(`[data-error-for="${name}"]`);
      const message = errors[name] || "";
      errorElement.textContent = message;
      field.setAttribute("aria-invalid", message ? "true" : "false");
    });

    if (Object.keys(errors).length) {
      status.textContent = "Please check the highlighted fields.";
      status.style.color = "var(--danger)";
      fields[Object.keys(errors)[0]].focus();
      return;
    }

    status.textContent = "Your message looks ready to send!";
    status.style.color = "var(--success)";
  });
});

const detailPanel = document.querySelector("#composer-detail");
const composerButtons = document.querySelectorAll(".composer-cell");

function findComposerByKey(key) {
  return Object.values(composerData).find((composer) => composer.key === key);
}

function showComposer(composer) {
  if (!composer || !detailPanel) return;
  detailPanel.querySelector(".detail-alignment").textContent = composer.alignment;
  detailPanel.querySelector(".composer-monogram").textContent = composer.monogram;
  detailPanel.querySelector("h3").textContent = composer.name;
  detailPanel.querySelector(".detail-description").textContent = composer.description;
  detailPanel.querySelector(".detail-work").innerHTML = `<strong>Start with:</strong> ${composer.work}`;

  composerButtons.forEach((button) => {
    const isActive = button.dataset.composer === composer.key;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
}

composerButtons.forEach((button) => {
  button.setAttribute("aria-pressed", "false");
  button.addEventListener("click", () => showComposer(findComposerByKey(button.dataset.composer)));
});

if (detailPanel) showComposer(composerData["lawful-good"]);

const quiz = document.querySelector("#composer-quiz");

if (quiz) {
  const resultPanel = document.querySelector("#quiz-result");
  const errorMessage = quiz.querySelector(".quiz-error");

  quiz.addEventListener("submit", (event) => {
    event.preventDefault();
    const answers = new FormData(quiz);
    const structure = answers.get("structure");
    const mood = answers.get("mood");
    const experience = answers.get("experience");

    if (!structure || !mood || !experience) {
      errorMessage.textContent = "Please answer all three questions before revealing your match.";
      return;
    }

    errorMessage.textContent = "";
    let horizontalScore = { lawful: -2, neutral: 0, chaotic: 2 }[structure];
    let verticalScore = { good: -2, neutral: 0, evil: 2 }[mood];

    if (experience === "lawful-good") {
      horizontalScore -= 1;
      verticalScore -= 1;
    } else if (experience === "chaotic-evil") {
      horizontalScore += 1;
      verticalScore += 1;
    }

    const horizontal = horizontalScore < 0 ? "lawful" : horizontalScore > 0 ? "chaotic" : "neutral";
    const vertical = verticalScore < 0 ? "good" : verticalScore > 0 ? "evil" : "neutral";
    const composer = composerData[`${horizontal}-${vertical}`];

    resultPanel.querySelector(".result-alignment").textContent = composer.alignment;
    resultPanel.querySelector(".result-name").textContent = composer.name;
    resultPanel.querySelector(".result-description").textContent = composer.description;
    resultPanel.querySelector(".result-work").innerHTML = `<strong>Recommended:</strong> ${composer.work}`;
    resultPanel.hidden = false;
    resultPanel.focus();
    showComposer(composer);
  });

  document.querySelector("#retake-quiz").addEventListener("click", () => {
    quiz.reset();
    resultPanel.hidden = true;
    errorMessage.textContent = "";
    quiz.querySelector("input").focus();
  });
}
