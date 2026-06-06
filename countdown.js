/* ---------------- ELEMENTS ---------------- */
const widget = document.getElementById("widget");
const previewWidget = document.getElementById("previewWidget");

const iconDisplay = document.getElementById("countdownIcon");
const previewIconDisplay = document.getElementById("previewCountdownIcon");

const titleDisplay = document.getElementById("countdownTitle");
const previewTitleDisplay = document.getElementById("previewCountdownTitle");

const textDisplay = document.getElementById("countdownText");
const previewTextDisplay = document.getElementById("previewCountdownText");

const rangeDisplay = document.getElementById("dateRange");
const previewRangeDisplay = document.getElementById("previewDateRange");

const fromInput = document.getElementById("fromDate");
const toInput = document.getElementById("toDate");
const labelInput = document.getElementById("countdownLabel");

const editBtn = document.getElementById("editBtn");
const editOptions = document.getElementById("editOptions");

const themeBtn = document.getElementById("themeBtn");
const themeOptions = document.getElementById("themeOptions");

const appearanceToggle = document.getElementById("appearanceToggle");
const appearanceOptions = document.getElementById("appearanceOptions");

const fontBtn = document.getElementById("fontToggle");
const fontOptions = document.getElementById("fontOptions");

const copyBtn = document.getElementById("copyLinkBtn");
const copyMessage = document.getElementById("copyMessage");

const iconTabs = document.querySelectorAll(".icon-tab");
const iconOptions = document.querySelectorAll(".icon-option");

/* ---------------- URL PARAMS ---------------- */
const params = new URLSearchParams(window.location.search);
const isEmbed = params.get("embed") === "true";

if (isEmbed) {
  document.documentElement.classList.add("embed-mode");
}

/* ---------------- STATE ---------------- */
let state = {
  from: params.get("from") || localStorage.getItem("countdownFrom") || "",
  to: params.get("to") || localStorage.getItem("countdownTo") || "",
  label:
    params.get("label") ||
    localStorage.getItem("countdownLabel") ||
    "your countdown",
  icon: params.get("icon") || localStorage.getItem("countdownIcon") || "1",
  theme: params.get("theme") || localStorage.getItem("countdownTheme") || "beige",
  font: params.get("font") || localStorage.getItem("countdownFont") || "default",
  appearance:
    params.get("appearance") ||
    localStorage.getItem("countdownAppearance") ||
    "system",
};

/* ---------------- HELPERS ---------------- */
function updateBothWidgets(callback) {
  [widget, previewWidget].forEach((el) => {
    if (el) callback(el);
  });
}

function setBothText(mainEl, previewEl, value) {
  [mainEl, previewEl].forEach((el) => {
    if (el) el.textContent = value;
  });
}

function updateBothIcons(callback) {
  [iconDisplay, previewIconDisplay].forEach((icon) => {
    if (icon) callback(icon);
  });
}

function saveState() {
  localStorage.setItem("countdownFrom", state.from);
  localStorage.setItem("countdownTo", state.to);
  localStorage.setItem("countdownLabel", state.label);
  localStorage.setItem("countdownIcon", state.icon);
  localStorage.setItem("countdownTheme", state.theme);
  localStorage.setItem("countdownFont", state.font);
  localStorage.setItem("countdownAppearance", state.appearance);
}

/* ---------------- FORMAT DATE ---------------- */
function formatDate(dateStr) {
  if (!dateStr) return "";

  const d = new Date(`${dateStr}T00:00:00`);

  return d.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

/* ---------------- COUNTDOWN LOGIC ---------------- */
function getCountdownText() {
  const now = new Date();

  if (!state.from || !state.to) {
    return {
      text: "set your dates ✧",
      range: "",
    };
  }

  const fromDate = new Date(`${state.from}T00:00:00`);
  const toDate = new Date(`${state.to}T23:59:59`);

  const remaining = Math.ceil((toDate - now) / (1000 * 60 * 60 * 24));
  const untilStart = Math.ceil((fromDate - now) / (1000 * 60 * 60 * 24));

  let text = "";

  if (now < fromDate) {
    text = `starts in ${untilStart} days`;
  } else if (now >= fromDate && now <= toDate) {
    text = `${remaining} days left`;
  } else {
    text = "completed ✶";
  }

  return {
    text,
    range: `${formatDate(state.from)} → ${formatDate(state.to)}`,
  };
}

function updateCountdown() {
  const countdown = getCountdownText();

  setBothText(textDisplay, previewTextDisplay, countdown.text);
  setBothText(rangeDisplay, previewRangeDisplay, countdown.range);
}

/* ---------------- APPLY UI ---------------- */
function updateUI() {
  setBothText(titleDisplay, previewTitleDisplay, state.label.toLowerCase());
  setIcon(state.icon);
  updateCountdown();
  saveState();
}

function setIcon(icon) {
  state.icon = icon || "1";

  updateBothIcons((iconEl) => {
    iconEl.src = `./assets/icons/${state.icon}.svg`;
    iconEl.classList.remove("icon-wide");

    if (state.icon === "4") {
      iconEl.classList.add("icon-wide");
    }
  });

  saveState();
}

/* ---------------- THEME ---------------- */
function setTheme(theme) {
  state.theme = theme || "beige";

  updateBothWidgets((el) => {
    el.classList.remove("beige", "pink", "blue", "green", "black", "white");
    el.classList.add(state.theme);
  });

  saveState();
}

/* ---------------- FONT ---------------- */
function setFont(font) {
  state.font = font || "default";

  updateBothWidgets((el) => {
    el.classList.remove("font-default", "font-serif", "font-mono");
    el.classList.add(`font-${state.font}`);

    if (state.font === "serif") {
      el.style.fontFamily = "Georgia, serif";
    } else if (state.font === "mono") {
      el.style.fontFamily = "ui-monospace, SFMono-Regular, Menlo, monospace";
    } else {
      el.style.fontFamily =
        "'Satoshi', ui-sans-serif, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
    }
  });

  saveState();
}

/* ---------------- APPEARANCE / BG ---------------- */
function setAppearance(appearance) {
  state.appearance = appearance || "system";

  document.body.classList.remove(
    "appearance-light",
    "appearance-dark",
    "appearance-system"
  );

  document.body.classList.add(`appearance-${state.appearance}`);

  saveState();
}

/* ---------------- EMBED LINK ---------------- */
function buildEmbedURL() {
  const base = window.location.origin + window.location.pathname;

  return `${base}?from=${encodeURIComponent(state.from)}&to=${encodeURIComponent(
    state.to
  )}&label=${encodeURIComponent(state.label)}&icon=${encodeURIComponent(
    state.icon
  )}&theme=${state.theme}&font=${state.font}&appearance=${
    state.appearance
  }&embed=true`;
}

/* ---------------- COPY LINK ---------------- */
if (copyBtn) {
  copyBtn.addEventListener("click", () => {
    navigator.clipboard.writeText(buildEmbedURL());

    if (!copyMessage) return;

    copyMessage.classList.remove("hidden");
    copyMessage.classList.add("show");

    setTimeout(() => {
      copyMessage.classList.add("hidden");
      copyMessage.classList.remove("show");
    }, 2000);
  });
}

/* ---------------- INPUT LISTENERS ---------------- */
fromInput?.addEventListener("change", () => {
  state.from = fromInput.value;
  updateUI();
});

toInput?.addEventListener("change", () => {
  state.to = toInput.value;
  updateUI();
});

labelInput?.addEventListener("input", () => {
  state.label = labelInput.value || "your countdown";
  updateUI();
});

/* ---------------- ICON SELECT ---------------- */
iconOptions.forEach((el) => {
  el.addEventListener("click", () => {
    setIcon(el.dataset.icon);
    updateUI();
  });
});

/* ---------------- ICON CATEGORY FILTER ---------------- */
iconTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    iconTabs.forEach((t) => t.classList.remove("active"));
    tab.classList.add("active");

    const category = tab.dataset.category;

    iconOptions.forEach((icon) => {
      const iconCategory = icon.dataset.category;

      if (category === "all") {
        icon.style.display = "flex";
      } else {
        icon.style.display = iconCategory === category ? "flex" : "none";
      }
    });
  });
});

/* ---------------- POPUPS ---------------- */
editBtn?.addEventListener("click", (e) => {
  e.stopPropagation();

  editOptions?.classList.toggle("hidden");
  themeOptions?.classList.add("hidden");
  appearanceOptions?.classList.add("hidden");
  fontOptions?.classList.add("hidden");
});

themeBtn?.addEventListener("click", (e) => {
  e.stopPropagation();

  themeOptions?.classList.toggle("hidden");
  editOptions?.classList.add("hidden");
  appearanceOptions?.classList.add("hidden");
  fontOptions?.classList.add("hidden");
});

appearanceToggle?.addEventListener("click", (e) => {
  e.stopPropagation();

  appearanceOptions?.classList.toggle("hidden");
  editOptions?.classList.add("hidden");
  themeOptions?.classList.add("hidden");
  fontOptions?.classList.add("hidden");
});

fontBtn?.addEventListener("click", (e) => {
  e.stopPropagation();

  fontOptions?.classList.toggle("hidden");
  editOptions?.classList.add("hidden");
  themeOptions?.classList.add("hidden");
  appearanceOptions?.classList.add("hidden");
});

/* ---------------- OPTIONS ---------------- */
document.querySelectorAll(".theme-circle").forEach((el) => {
  el.addEventListener("click", () => {
    setTheme(el.dataset.theme);
    themeOptions?.classList.add("hidden");
  });
});

document.querySelectorAll(".appearance-option").forEach((el) => {
  el.addEventListener("click", () => {
    setAppearance(el.dataset.appearance);
    appearanceOptions?.classList.add("hidden");
  });
});

document.querySelectorAll(".font-option").forEach((el) => {
  el.addEventListener("click", () => {
    setFont(el.dataset.font);
    fontOptions?.classList.add("hidden");
  });
});

/* ---------------- OUTSIDE CLICK ---------------- */
document.addEventListener("click", (e) => {
  if (!editBtn?.contains(e.target) && !editOptions?.contains(e.target)) {
    editOptions?.classList.add("hidden");
  }

  if (!themeBtn?.contains(e.target) && !themeOptions?.contains(e.target)) {
    themeOptions?.classList.add("hidden");
  }

  if (
    !appearanceToggle?.contains(e.target) &&
    !appearanceOptions?.contains(e.target)
  ) {
    appearanceOptions?.classList.add("hidden");
  }

  if (!fontBtn?.contains(e.target) && !fontOptions?.contains(e.target)) {
    fontOptions?.classList.add("hidden");
  }
});

/* ---------------- INIT ---------------- */
if (fromInput) fromInput.value = state.from;
if (toInput) toInput.value = state.to;
if (labelInput) labelInput.value = state.label;

setTheme(state.theme);
setFont(state.font);
setAppearance(state.appearance);
setIcon(state.icon);
updateUI();

setInterval(updateCountdown, 1000 * 60);
