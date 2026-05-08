/* ---------------- ELEMENTS ---------------- */
const widget = document.getElementById("widget");

const iconDisplay = document.getElementById("countdownIcon");
const titleDisplay = document.getElementById("countdownTitle");
const textDisplay = document.getElementById("countdownText");
const rangeDisplay = document.getElementById("dateRange");

const fromInput = document.getElementById("fromDate");
const toInput = document.getElementById("toDate");
const labelInput = document.getElementById("countdownLabel");

const editBtn = document.getElementById("editBtn");
const editOptions = document.getElementById("editOptions");

const themeBtn = document.getElementById("themeBtn");
const themeOptions = document.getElementById("themeOptions");

const fontBtn = document.getElementById("fontToggle");
const fontOptions = document.getElementById("fontOptions");

const copyBtn = document.getElementById("copyLinkBtn");
const iconTabs = document.querySelectorAll(".icon-tab");
const iconOptions = document.querySelectorAll(".icon-option");

/* ---------------- URL PARAMS ---------------- */
const params = new URLSearchParams(window.location.search);
const isEmbed = params.get("embed") === "true";

/* ---------------- STATE ---------------- */
let state = {
  from: params.get("from") || "",
  to: params.get("to") || "",
  label: params.get("label") || "your countdown",
  icon: params.get("icon") || "1",
  theme: params.get("theme") || "beige",
  font: params.get("font") || "default"
};

/* hide builder in embed */
if (isEmbed) {
  const builder = document.querySelector(".builder-ui");
  if (builder) builder.style.display = "none";
}

/* ---------------- FORMAT DATE ---------------- */
function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

/* ---------------- COUNTDOWN LOGIC ---------------- */
function updateCountdown() {
  const now = new Date();

  if (!state.from || !state.to) {
    textDisplay.textContent = "set your dates ✧";
    rangeDisplay.textContent = "";
    return;
  }

  const fromDate = new Date(state.from);
  const toDate = new Date(state.to);

  const remaining = Math.ceil((toDate - now) / (1000 * 60 * 60 * 24));
  const untilStart = Math.ceil((fromDate - now) / (1000 * 60 * 60 * 24));

  if (now < fromDate) {
    textDisplay.textContent = `starts in ${untilStart} days`;
  } 
  else if (now >= fromDate && now <= toDate) {
    textDisplay.textContent = `${remaining} days left`;
  } 
  else {
    textDisplay.textContent = "completed ✶";
  }

  rangeDisplay.textContent = `${formatDate(state.from)} → ${formatDate(state.to)}`;
}

/* ---------------- APPLY UI ---------------- */
function updateUI() {
  titleDisplay.textContent = state.label.toLowerCase();
  updateCountdown();
}

function setIcon(icon) {
  state.icon = icon;
  iconDisplay.src = "./assets/icons/" + state.icon + ".svg";

  // remove any previous sizing classes
  iconDisplay.classList.remove("icon-wide");

  // apply special sizing for icon 4
  if (state.icon === "4") {
    iconDisplay.classList.add("icon-wide");
  }
}

/* ---------------- ICON CATEGORY FILTER ---------------- */

iconTabs.forEach(tab => {
  tab.addEventListener("click", () => {

    // active state styling
    iconTabs.forEach(t => t.classList.remove("active"));
    tab.classList.add("active");

    const category = tab.dataset.category;

    iconOptions.forEach(icon => {
      const iconCategory = icon.dataset.category;

      if (category === "all") {
        icon.style.display = "flex";
      } else {
        icon.style.display =
          iconCategory === category ? "flex" : "none";
      }
    });

  });
});
/* ---------------- THEME ---------------- */
function setTheme(theme) {
  state.theme = theme;

  widget.classList.remove("beige", "pink", "blue", "green", "black", "white");
  widget.classList.add(theme);
}

/* ---------------- FONT ---------------- */
function setFont(font) {
  state.font = font;

  widget.classList.remove("font-default", "font-serif", "font-mono");
  widget.classList.add(`font-${font}`);
}

/* ---------------- EMBED LINK ---------------- */
function buildEmbedURL() {
  const base = window.location.origin + window.location.pathname;

  return `${base}?from=${state.from}&to=${state.to}&label=${encodeURIComponent(state.label)}&icon=${encodeURIComponent(state.icon)}&theme=${state.theme}&font=${state.font}&embed=true`;
}

/* ---------------- COPY LINK ---------------- */
if (copyBtn) {
  copyBtn.addEventListener("click", () => {
    navigator.clipboard.writeText(buildEmbedURL());

    const msg = document.getElementById("copyMessage");
    if (!msg) return;

    msg.classList.remove("hidden");
    msg.classList.add("show");

    setTimeout(() => {
      msg.classList.add("hidden");
      msg.classList.remove("show");
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
document.querySelectorAll(".icon-option").forEach(el => {
  el.addEventListener("click", () => {
    setIcon(el.dataset.icon);
    updateUI();
  });
});

/* ---------------- POPUPS ---------------- */
editBtn?.addEventListener("click", (e) => {
  e.stopPropagation();
  editOptions.classList.toggle("hidden");
});

themeBtn?.addEventListener("click", (e) => {
  e.stopPropagation();
  themeOptions.classList.toggle("hidden");
});

fontBtn?.addEventListener("click", (e) => {
  e.stopPropagation();
  fontOptions.classList.toggle("hidden");
});

/* ---------------- OPTIONS ---------------- */
document.querySelectorAll(".theme-circle").forEach(el => {
  el.addEventListener("click", () => {
    setTheme(el.dataset.theme);
    themeOptions.classList.add("hidden");
  });
});

document.querySelectorAll(".font-option").forEach(el => {
  el.addEventListener("click", () => {
    setFont(el.dataset.font);
    fontOptions.classList.add("hidden");
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
setIcon(state.icon);
updateUI();
