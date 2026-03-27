// Purpose: wire popup controls to capture/runtime contracts and quick handoff actions.
// Inputs: popup clicks + chrome.storage state. Outputs: capture toggle, recent list, editor handoff, advanced diagnostics actions.
const captureToggle = document.getElementById("captureToggle");
const captureToggleLabel = document.getElementById("captureToggleLabel");
const captureStatus = document.getElementById("captureStatus");
const recentCaptureList = document.getElementById("recentCaptureList");
const openInspectorFooter = document.getElementById("openInspectorFooter");
const openEditor = document.getElementById("openEditor");
const checkLocalEditor = document.getElementById("checkLocalEditor");
const syncSignIn = document.getElementById("syncSignIn");
const syncSignOut = document.getElementById("syncSignOut");
const authStateText = document.getElementById("authStateText");
const syncStateText = document.getElementById("syncStateText");

const HOSTED_EDITOR_URL = "https://cap-me-action.vercel.app";
const DEFAULT_SYNC_CONFIG = {
  enabled: false,
  autoUploadOnStop: false,
  endpointUrl: "",
  editorUrl: HOSTED_EDITOR_URL,
  authSignedOut: false,
  allowedEmails: [],
  maskInputValues: true,
  accountEmail: null
};
let autoSyncDefaultsAnnounced = false;

function getStorage(keys) {
  return new Promise((resolve) => chrome.storage.local.get(keys, resolve));
}

function setStorage(value) {
  return new Promise((resolve) => chrome.storage.local.set(value, resolve));
}

function sendRuntimeMessage(message) {
  return new Promise((resolve) => chrome.runtime.sendMessage(message, resolve));
}

function normalizeSyncConfig(value) {
  const endpointUrl = String(value?.endpointUrl ?? DEFAULT_SYNC_CONFIG.endpointUrl).trim();
  return {
    ...DEFAULT_SYNC_CONFIG,
    ...(value ?? {}),
    endpointUrl,
    editorUrl: String(value?.editorUrl ?? DEFAULT_SYNC_CONFIG.editorUrl).trim() || DEFAULT_SYNC_CONFIG.editorUrl,
    enabled: Boolean(value?.enabled),
    autoUploadOnStop: Boolean(value?.autoUploadOnStop),
    authSignedOut: Boolean(value?.authSignedOut),
    allowedEmails: Array.isArray(value?.allowedEmails)
      ? value.allowedEmails.map((x) => String(x).trim().toLowerCase()).filter(Boolean)
      : [],
    accountEmail: value?.accountEmail ? String(value.accountEmail).trim().toLowerCase() : null
  };
}

function getAuthStateText(authReady, syncConfig) {
  if (authReady?.status === "token_available") {
    const email = authReady?.accountEmail || syncConfig.accountEmail;
    return email ? `Auth: signed in as ${email}.` : "Auth: signed in (token available).";
  }
  if (authReady?.status === "token_unavailable") {
    return "Auth: not signed in (token unavailable).";
  }
  if (!authReady?.ok) {
    const code = authReady?.errorCode ? ` (${authReady.errorCode})` : "";
    return `Auth: check failed${code}.`;
  }
  return "Auth: unknown state.";
}

function getSyncStateText(syncConfig, latestSession, syncState, authReady) {
  if (!syncConfig.endpointUrl) {
    return "Sync: endpoint missing. Configure once in Diagnostics & Advanced Settings.";
  }
  if (!syncConfig.enabled) {
    return "Sync: disabled in advanced settings.";
  }
  if (!syncConfig.autoUploadOnStop) {
    return "Sync: enabled, but auto-sync on stop is disabled.";
  }
  if (authReady?.status !== "token_available") {
    return "Sync: ready after sign-in. Auto-sync will run on capture stop.";
  }
  if (!latestSession) {
    return "Sync: ready. Capture a session; it will auto-sync on stop.";
  }
  const status = latestSession.sync?.status ?? "local";
  const code = latestSession.sync?.errorCode ?? syncState?.lastErrorCode ?? null;
  if (status === "synced") {
    return "Sync: latest session synced.";
  }
  if (status === "pending") {
    return "Sync: latest session pending upload/retry.";
  }
  if (status === "failed" || status === "blocked") {
    return `Sync: latest session ${status}${code ? ` (${code})` : ""}.`;
  }
  return "Sync: ready. Latest session is local/not uploaded yet.";
}

async function maybeApplyOperatorSyncDefaults(syncConfig, authReady) {
  if (!syncConfig.endpointUrl || authReady?.status !== "token_available") {
    return { changed: false, syncConfig };
  }
  if (syncConfig.enabled && syncConfig.autoUploadOnStop) {
    return { changed: false, syncConfig };
  }
  const next = {
    ...syncConfig,
    enabled: true,
    autoUploadOnStop: true
  };
  await setStorage({ syncConfig: next });
  return { changed: true, syncConfig: next };
}

async function checkLocalEditorReady() {
  const response = await sendRuntimeMessage({ type: "CHECK_LOCAL_EDITOR_READY" });
  if (response?.status === "healthy") {
    return `Local editor is healthy at ${response.url}.`;
  }
  if (response?.status === "reachable_unhealthy") {
    const suffix = response.httpStatus ? ` (HTTP ${response.httpStatus})` : "";
    return `Local editor responded but is not healthy at ${response.url}${suffix}.`;
  }
  if (response?.status === "timeout") {
    return "Local editor check timed out. Start or restart `pnpm dev:app`.";
  }
  return "Local editor is unreachable. Start `pnpm dev:app` and try again.";
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;");
}

function formatRelativeTime(ts) {
  if (!ts) {
    return "Unknown";
  }
  const diffMs = Math.max(0, Date.now() - ts);
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) {
    return "Just now";
  }
  if (minutes < 60) {
    return `${minutes}m ago`;
  }
  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours}h ago`;
  }
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function getLatestSession(sessions) {
  if (!sessions.length) {
    return null;
  }
  return [...sessions].sort((a, b) => (b.updatedAt ?? 0) - (a.updatedAt ?? 0))[0] ?? null;
}

function getLatestStepBySession(steps) {
  const map = {};
  for (const step of steps) {
    if (!step?.sessionId) {
      continue;
    }
    const existing = map[step.sessionId];
    if (!existing || (step.at ?? 0) > (existing.at ?? 0)) {
      map[step.sessionId] = step;
    }
  }
  return map;
}

async function openEditorForSession(sessionId) {
  const response = await sendRuntimeMessage({
    type: "OPEN_EDITOR",
    payload: { source: "capture", sessionId }
  });
  if (!response?.ok) {
    throw new Error(response?.error || "OPEN_EDITOR_FAILED");
  }
  return response;
}

function renderRecentSessions(sessions, latestStepBySession) {
  const topSessions = [...sessions].sort((a, b) => (b.updatedAt ?? 0) - (a.updatedAt ?? 0)).slice(0, 3);
  if (topSessions.length === 0) {
    recentCaptureList.innerHTML = '<p class="empty">No sessions yet. Start capture and interact with a page. Hotkeys: Alt+Shift+R/Z/M.</p>';
    return;
  }

  recentCaptureList.innerHTML = topSessions
    .map((session) => {
      const title = escapeHtml(session.lastTitle || session.startTitle || session.lastUrl || "Untitled session");
      const when = formatRelativeTime(session.updatedAt ?? session.startedAt);
      const latestStep = latestStepBySession[session.id];
      const thumbStyle = latestStep?.thumbnailDataUrl
        ? ` style="background-image:url('${escapeHtml(latestStep.thumbnailDataUrl)}')"`
        : "";
      const syncState = session.sync?.status ? ` | sync: ${escapeHtml(session.sync.status)}` : "";
      return `<article class="recent-item" data-session-id="${escapeHtml(session.id)}" role="button" tabindex="0">
        <div class="recent-thumb"${thumbStyle}></div>
        <div>
          <p class="recent-title">${title}</p>
          <p class="recent-meta">${session.stepsCount || 0} steps - ${escapeHtml(when)}${syncState}</p>
        </div>
      </article>`;
    })
    .join("");
}

async function refreshState() {
  const store = await getStorage(["captureState", "sessions", "steps", "syncConfig", "syncState"]);
  const captureState = store.captureState ?? { isCapturing: false };
  const sessions = store.sessions ?? [];
  const latestStepBySession = getLatestStepBySession(store.steps ?? []);
  let syncConfig = normalizeSyncConfig(store.syncConfig);
  const syncState = store.syncState ?? null;
  const latestSession = getLatestSession(sessions);
  const authReady = await sendRuntimeMessage({ type: "CHECK_SYNC_AUTH_READY" });
  const defaultsResult = await maybeApplyOperatorSyncDefaults(syncConfig, authReady);
  if (defaultsResult.changed) {
    syncConfig = defaultsResult.syncConfig;
    if (!autoSyncDefaultsAnnounced) {
      captureStatus.textContent = "Team sync auto-sync enabled for this signed-in operator.";
      autoSyncDefaultsAnnounced = true;
    }
  }
  const isCapturing = Boolean(captureState.isCapturing);

  captureToggleLabel.textContent = isCapturing ? "Stop Recording" : "Start Recording";
  captureStatus.textContent = isCapturing
    ? "Recording in progress..."
    : "Click to start capturing clicks & types";
    
  const dot = document.getElementById("captureDot");
  if (dot) {
    if (isCapturing) {
      dot.classList.add("recording");
    } else {
      dot.classList.remove("recording");
    }
  }

  renderRecentSessions(sessions, latestStepBySession);
  authStateText.textContent = getAuthStateText(authReady, syncConfig);
  syncStateText.textContent = getSyncStateText(syncConfig, latestSession, syncState, authReady);
}

async function toggleCapture() {
  const store = await getStorage(["captureState"]);
  const isCapturing = Boolean(store.captureState?.isCapturing);
  const type = isCapturing ? "STOP_CAPTURE" : "START_CAPTURE";
  const response = await sendRuntimeMessage({ type });
  if (type === "STOP_CAPTURE") {
    if (response?.queuedSessionId) {
      captureStatus.textContent = "Capture stopped. Team sync queued automatically.";
    } else {
      captureStatus.textContent = "Capture stopped.";
    }
  }
  await refreshState();
}

function openInspectorPage() {
  chrome.tabs.create({ url: chrome.runtime.getURL("inspector.html") });
}

async function handleOpenEditor() {
  const store = await getStorage(["sessions"]);
  const sessions = store.sessions ?? [];
  const latest = getLatestSession(sessions);
  if (!latest) {
    captureStatus.textContent = "No captured session yet. Start capture first.";
    return;
  }
  const response = await openEditorForSession(latest.id);
  captureStatus.textContent = `Opened editor for ${latest.id}.`;
  if (typeof response?.url === "string" && response.url.startsWith("http://localhost")) {
    captureStatus.textContent = `Opened local editor for ${latest.id}.`;
  }
}

async function handleSyncSignIn() {
  const response = await sendRuntimeMessage({ type: "AUTH_SIGN_IN" });
  if (!response?.ok) {
    const detail = String(response?.error ?? "").trim();
    captureStatus.textContent =
      `Sign in failed: ${response?.errorCode ?? "unknown error"}` + (detail ? ` (${detail})` : "");
    await refreshState();
    return;
  }
  captureStatus.textContent = response?.accountEmail
    ? `Signed in as ${response.accountEmail}.`
    : "Signed in for team sync.";
  await refreshState();
}

async function handleSyncSignOut() {
  const response = await sendRuntimeMessage({ type: "AUTH_SIGN_OUT" });
  if (!response?.ok) {
    captureStatus.textContent = `Sign out failed: ${response?.errorCode ?? "unknown error"}.`;
    await refreshState();
    return;
  }
  captureStatus.textContent = "Signed out for team sync.";
  await refreshState();
}

async function handleRecentSessionOpen(sessionId) {
  const response = await openEditorForSession(sessionId);
  captureStatus.textContent =
    typeof response?.url === "string" && response.url.startsWith("http://localhost")
      ? `Opened local editor for ${sessionId}.`
      : `Opened editor for ${sessionId}.`;
}

async function handleCheckLocalEditor() {
  captureStatus.textContent = "Checking local editor...";
  captureStatus.textContent = await checkLocalEditorReady();
}

captureToggle.addEventListener("click", () => {
  toggleCapture().catch(() => {
    captureStatus.textContent = "Failed to toggle capture mode.";
  });
});
openInspectorFooter.addEventListener("click", openInspectorPage);
openEditor.addEventListener("click", () => {
  handleOpenEditor().catch(() => {
    captureStatus.textContent = "Unable to open editor. Start the app with pnpm dev:app and try again.";
  });
});
checkLocalEditor.addEventListener("click", () => {
  handleCheckLocalEditor().catch(() => {
    captureStatus.textContent = "Local editor check failed. Start the app with pnpm dev:app and try again.";
  });
});
syncSignIn.addEventListener("click", () => {
  handleSyncSignIn().catch(() => {
    captureStatus.textContent = "Unable to sign in for team sync.";
  });
});
syncSignOut.addEventListener("click", () => {
  handleSyncSignOut().catch(() => {
    captureStatus.textContent = "Unable to sign out for team sync.";
  });
});
recentCaptureList.addEventListener("click", (event) => {
  const card = event.target.closest("[data-session-id]");
  if (!card) {
    return;
  }
  const sessionId = card.getAttribute("data-session-id");
  if (sessionId) {
    void handleRecentSessionOpen(sessionId);
  }
});
recentCaptureList.addEventListener("keydown", (event) => {
  if (event.key !== "Enter" && event.key !== " ") {
    return;
  }
  const card = event.target.closest("[data-session-id]");
  if (!card) {
    return;
  }
  event.preventDefault();
  const sessionId = card.getAttribute("data-session-id");
  if (sessionId) {
    void handleRecentSessionOpen(sessionId);
  }
});

refreshState();
