const PREFIX = "northstar.v1";

export function loadState(key, fallback) {
  try {
    const raw = localStorage.getItem(`${PREFIX}.${key}`);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function saveState(key, value) {
  try {
    localStorage.setItem(`${PREFIX}.${key}`, JSON.stringify(value));
  } catch {
    // Ignore storage write failures so the app stays usable in restricted browsers.
  }
}

export function clearNamespace() {
  try {
    Object.keys(localStorage)
      .filter((key) => key.startsWith(`${PREFIX}.`))
      .forEach((key) => localStorage.removeItem(key));
  } catch {
    // Ignore storage clear failures for resilience.
  }
}

export async function copyText(text) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const field = document.createElement("textarea");
  field.value = text;
  field.setAttribute("readonly", "readonly");
  field.style.position = "absolute";
  field.style.left = "-9999px";
  document.body.appendChild(field);
  field.select();
  document.execCommand("copy");
  document.body.removeChild(field);
}

export function formatRelativeDue(dateString) {
  if (!dateString) return "No due date set";

  const today = new Date();
  const due = new Date(dateString);
  today.setHours(0, 0, 0, 0);
  due.setHours(0, 0, 0, 0);

  const diff = Math.round((due - today) / 86400000);

  if (Number.isNaN(diff)) return "Due date unavailable";
  if (diff === 0) return "Due today";
  if (diff === 1) return "Due tomorrow";
  if (diff < 0) return `${Math.abs(diff)} day${Math.abs(diff) === 1 ? "" : "s"} overdue`;
  return `Due in ${diff} day${diff === 1 ? "" : "s"}`;
}

export function friendlyTime(minutes) {
  if (minutes <= 5) return "5 minutes";
  if (minutes < 60) return `${minutes} minutes`;
  if (minutes === 60) return "1 hour";
  return `${Math.round(minutes / 60)} hours`;
}

export function stampNow() {
  return new Date().toISOString();
}
