import {
  filterChats,
  formatTimestamp,
  messageLineClass,
  buildHandlerSections,
  buildHandlerPayload,
  parseHandlerConfig,
  defaultHandlerLabel,
  parseDefaultsConfig,
  buildDefaultsPayload,
  HANDLER_FLOW_CHARTS,
} from "/lib.js";

// Sentinel selectedJid for the fixed "Defaults" entry — not a real chat.
const DEFAULTS_KEY = "__defaults__";

const state = {
  chats: [],
  selectedJid: null,
  editMode: false,
  ocSettings: null,
  selectedChat: null,
  audit: [],
  defaults: null,
};

const els = {
  banner: document.getElementById("banner"),
  search: document.getElementById("search"),
  defaultsItem: document.getElementById("defaults-item"),
  logItem: document.getElementById("log-item"),
  tutorialItem: document.getElementById("tutorial-item"),
  chatList: document.getElementById("chat-list"),
  contentHeader: document.getElementById("content-header"),
  messageList: document.getElementById("message-list"),
  ocPanel: document.getElementById("oc-panel"),
  logView: document.getElementById("log-view"),
  tutorialView: document.getElementById("tutorial-view"),
  layout: document.getElementById("layout"),
};

function showBanner(msg) {
  els.banner.textContent = msg;
  els.banner.classList.remove("hidden");
}
function clearBanner() {
  els.banner.classList.add("hidden");
}

async function api(path) {
  const res = await fetch(path);
  let body;
  try {
    body = await res.json();
  } catch {
    body = null;
  }
  if (!res.ok) {
    throw new Error((body && body.error) || `HTTP ${res.status}`);
  }
  return body;
}

async function apiSend(path, method, body) {
  const res = await fetch(path, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body == null ? undefined : JSON.stringify(body),
  });
  let parsed;
  try {
    parsed = await res.json();
  } catch {
    parsed = null;
  }
  if (!res.ok) {
    throw new Error((parsed && parsed.error) || `HTTP ${res.status}`);
  }
  return parsed;
}

function renderChats() {
  els.defaultsItem.classList.toggle("selected", state.selectedJid === DEFAULTS_KEY);
  const filtered = filterChats(state.chats, els.search.value);
  els.chatList.replaceChildren(
    ...filtered.map((c) => {
      const li = document.createElement("li");
      li.className = "chat-item" + (c.jid === state.selectedJid ? " selected" : "");
      li.textContent = `${c.displayName} (${c.messageCount})`;
      li.title = c.jid;
      li.addEventListener("click", () => selectChat(c.jid));
      return li;
    }),
  );
}

function renderMessages(messages) {
  els.messageList.replaceChildren(
    ...messages.map((m) => {
      const li = document.createElement("li");
      li.className = messageLineClass(m);
      const who = m.fromMe ? "me" : m.pushName || m.sender || "?";
      li.textContent = `[${formatTimestamp(m.timestamp)}] ${who}: ${m.body}`;
      return li;
    }),
  );
  // Start at the latest message — the conversation reads bottom-anchored.
  els.messageList.scrollTop = els.messageList.scrollHeight;
}

// Show a loading indicator in Column 3 while data is being fetched.
function renderOcLoading() {
  els.ocPanel.replaceChildren();
  const spinner = document.createElement("div");
  spinner.className = "oc-spinner";
  spinner.textContent = "Loading...";
  els.ocPanel.append(spinner);
}

// Show an error scoped to Column 3 only (Columns 1-2 are unaffected).
function renderOcError(message) {
  els.ocPanel.replaceChildren();
  const errDiv = document.createElement("div");
  errDiv.className = "oc-error";
  errDiv.textContent = "Failed to load OC settings: " + message;
  els.ocPanel.append(errDiv);
}

// Build the inline editor form for custom I1/I2 handler creation/update.
// Pre-fills from the existing claw row (or empty for a new handler).
// Returns a DOM node containing the form.
function buildEditForm() {
  const { handlerType: initialType, config } = parseHandlerConfig(
    state.ocSettings ? state.ocSettings.claw : null,
  );

  const wrapper = document.createElement("section");
  wrapper.className = "handler-card handler-edit";

  const h3 = document.createElement("h3");
  h3.textContent = "Edit Instant Handler";
  wrapper.append(h3);

  // Handler-type selector.
  const typeLabel = document.createElement("label");
  typeLabel.textContent = "Type: ";
  const typeSelect = document.createElement("select");
  typeSelect.className = "oc-edit-type";
  const optStatic = document.createElement("option");
  optStatic.value = "static";
  optStatic.textContent = "Static reply (I1)";
  const optStateless = document.createElement("option");
  optStateless.value = "stateless";
  optStateless.textContent = "Stateless AI (I2)";
  typeSelect.append(optStatic, optStateless);
  typeSelect.value = initialType;
  typeLabel.append(typeSelect);
  wrapper.append(typeLabel);

  // Field area — re-rendered when type changes.
  const fieldArea = document.createElement("div");
  fieldArea.className = "oc-edit-fields";
  wrapper.append(fieldArea);

  function renderFields(selectedType) {
    fieldArea.replaceChildren();
    if (selectedType === "static") {
      const textLabel = document.createElement("label");
      textLabel.textContent = "Reply text:";
      const textarea = document.createElement("textarea");
      textarea.className = "oc-edit-text";
      textarea.value = String(config.text ?? "");
      textLabel.append(textarea);
      fieldArea.append(textLabel);
    } else {
      const modelLabel = document.createElement("label");
      modelLabel.textContent = "Model:";
      const modelSelect = document.createElement("select");
      modelSelect.className = "oc-edit-model-select";
      const placeholderOpt = document.createElement("option");
      placeholderOpt.value = "";
      placeholderOpt.textContent = "(loading models...)";
      modelSelect.append(placeholderOpt);
      modelLabel.append(modelSelect);
      fieldArea.append(modelLabel);

      const overrideLabel = document.createElement("label");
      overrideLabel.textContent = "Model override:";
      const modelInput = document.createElement("input");
      modelInput.className = "oc-edit-model";
      modelInput.type = "text";
      modelInput.placeholder = "(leave empty to use dropdown selection)";
      modelInput.value = "";
      overrideLabel.append(modelInput);
      fieldArea.append(overrideLabel);

      api("/api/oc/models")
        .then((data) => {
          modelSelect.replaceChildren();
          const defOpt = document.createElement("option");
          defOpt.value = "";
          defOpt.textContent = data.defaultModel
            ? "(OC default: " + data.defaultModel + ")"
            : "(no default)";
          modelSelect.append(defOpt);
          for (const m of data.available || []) {
            const opt = document.createElement("option");
            opt.value = m.id;
            opt.textContent = m.id + (m.available === false ? " (unavailable)" : "");
            modelSelect.append(opt);
          }
          const currentModel = String(config.model ?? "");
          if (currentModel) {
            const matchesDropdown = (data.available || []).some((m) => m.id === currentModel);
            if (matchesDropdown) {
              modelSelect.value = currentModel;
            } else {
              modelInput.value = currentModel;
            }
          }
        })
        .catch(() => {
          modelSelect.replaceChildren();
          const errOpt = document.createElement("option");
          errOpt.value = "";
          errOpt.textContent = "(failed to load models)";
          modelSelect.append(errOpt);
          modelInput.value = String(config.model ?? "");
        });

      const promptLabel = document.createElement("label");
      promptLabel.textContent = "Prompt:";
      const promptTextarea = document.createElement("textarea");
      promptTextarea.className = "oc-edit-prompt";
      promptTextarea.value = String(config.prompt ?? "");
      promptLabel.append(promptTextarea);
      fieldArea.append(promptLabel);
    }
  }

  renderFields(typeSelect.value);

  typeSelect.addEventListener("change", () => {
    renderFields(typeSelect.value);
  });

  // Button row.
  const btnRow = document.createElement("div");
  btnRow.className = "oc-edit-buttons";

  const saveBtn = document.createElement("button");
  saveBtn.textContent = "Save";
  saveBtn.addEventListener("click", async () => {
    const selectedType = typeSelect.value;
    let values = {};
    if (selectedType === "static") {
      const textarea = fieldArea.querySelector(".oc-edit-text");
      values = { text: textarea ? textarea.value : "" };
    } else {
      const modelOverride = fieldArea.querySelector(".oc-edit-model");
      const modelSelect = fieldArea.querySelector(".oc-edit-model-select");
      const promptTextarea = fieldArea.querySelector(".oc-edit-prompt");
      const overrideVal = modelOverride ? modelOverride.value.trim() : "";
      const selectVal = modelSelect ? modelSelect.value : "";
      values = {
        model: overrideVal || selectVal,
        prompt: promptTextarea ? promptTextarea.value : "",
      };
    }
    try {
      const payload = buildHandlerPayload(selectedType, values);
      await apiSend(
        `/api/claw/handler?jid=${encodeURIComponent(state.selectedJid)}`,
        "POST",
        payload,
      );
      state.editMode = false;
      selectChat(state.selectedJid);
    } catch (err) {
      showBanner(err.message);
    }
  });

  const cancelBtn = document.createElement("button");
  cancelBtn.textContent = "Cancel";
  cancelBtn.addEventListener("click", () => {
    state.editMode = false;
    rerenderOcPanel();
  });

  btnRow.append(saveBtn, cancelBtn);

  // Optional: Remove handler button when a custom handler exists.
  if (state.ocSettings && state.ocSettings.claw) {
    const removeBtn = document.createElement("button");
    removeBtn.textContent = "Remove handler";
    removeBtn.addEventListener("click", async () => {
      try {
        await apiSend(
          `/api/claw/handler?jid=${encodeURIComponent(state.selectedJid)}`,
          "DELETE",
          null,
        );
        state.editMode = false;
        selectChat(state.selectedJid);
      } catch (err) {
        showBanner(err.message);
      }
    });
    btnRow.append(removeBtn);
  }

  wrapper.append(btnRow);
  return wrapper;
}

function typeBadgeFor(taxonomy) {
  const t = String(taxonomy || "");
  if (t === "I1") {
    return { cls: "type-static", label: "Static" };
  }
  if (t === "I2") {
    return { cls: "type-stateless", label: "Stateless" };
  }
  if (t === "I3" || t === "I4") {
    return { cls: "type-binding", label: "Binding" };
  }
  if (t.startsWith("S")) {
    return { cls: "type-cron", label: "Scheduled" };
  }
  return { cls: "", label: t || "Other" };
}

function outcomeBadgeClass(outcome) {
  switch (String(outcome || "").toLowerCase()) {
    case "replied":
      return "outcome-replied";
    case "silent":
      return "outcome-silent";
    case "escalated":
      return "outcome-escalated";
    case "error":
      return "outcome-error";
    default:
      return "";
  }
}

function auditExcerpt(text, max) {
  const s = text == null ? "" : String(text);
  return s.length > max ? s.slice(0, max) + "..." : s;
}

function renderOcSettings(ocData) {
  const sections = buildHandlerSections(ocData);
  if (sections.length === 0) {
    const p = document.createElement("p");
    p.className = "muted";
    p.textContent = "No specific handler. Uses OC defaults.";
    // Link to Defaults entry.
    const link = document.createElement("a");
    link.href = "#";
    link.textContent = "Go to Defaults";
    link.addEventListener("click", (e) => {
      e.preventDefault();
      selectDefaults();
    });
    return [p, link];
  }
  return sections.map((sec) => {
    const section = document.createElement("section");
    section.className = "handler-card";
    const header = document.createElement("div");
    header.className = "handler-card-header";
    const h3 = document.createElement("h3");
    h3.textContent = sec.title;
    const badge = typeBadgeFor(sec.taxonomy);
    const badgeSpan = document.createElement("span");
    badgeSpan.className = "type-badge" + (badge.cls ? " " + badge.cls : "");
    badgeSpan.textContent = badge.label;
    header.append(h3, badgeSpan);
    const dl = document.createElement("dl");
    dl.className = "oc-info";
    for (const [label, value] of sec.rows) {
      const dt = document.createElement("dt");
      dt.textContent = label;
      const dd = document.createElement("dd");
      dd.textContent = String(value);
      dl.append(dt, dd);
    }
    const srcDiv = document.createElement("div");
    srcDiv.className = "handler-source" + (sec.readOnly ? " read-only" : "");
    srcDiv.textContent = "Source: " + sec.source;
    section.append(header, dl, srcDiv);
    return section;
  });
}

function renderOcPanel(chat, audit, ocData) {
  els.ocPanel.replaceChildren();

  // Section title header.
  const titleDiv = document.createElement("div");
  titleDiv.className = "oc-section-title";
  const displayName = chat ? chat.displayName : "";
  const phone = ocData && ocData.phone ? " (" + ocData.phone + ")" : "";
  titleDiv.textContent = "OC Settings: " + displayName + phone;

  // [Edit] [Refresh] action buttons.
  const actionsDiv = document.createElement("div");
  actionsDiv.className = "oc-actions";

  const editBtn = document.createElement("button");
  editBtn.textContent = state.editMode ? "Cancel" : "Edit";
  editBtn.addEventListener("click", () => {
    state.editMode = !state.editMode;
    rerenderOcPanel();
  });

  const refreshBtn = document.createElement("button");
  refreshBtn.textContent = "Refresh";
  refreshBtn.addEventListener("click", () => {
    selectChat(state.selectedJid);
  });

  actionsDiv.append(editBtn, refreshBtn);

  // Chat info dl.
  const dl = document.createElement("dl");
  dl.className = "oc-info";
  const rows = [
    ["JID", chat ? chat.jid : ""],
    ["Type", chat ? chat.chatType : ""],
    ["Messages", String(chat ? chat.messageCount : 0)],
  ];
  for (const [label, value] of rows) {
    const dt = document.createElement("dt");
    dt.textContent = label;
    const dd = document.createElement("dd");
    dd.textContent = value;
    dl.append(dt, dd);
  }

  // Handler area: edit form or read-only cards.
  let handlerContent;
  if (state.editMode) {
    handlerContent = [buildEditForm()];
  } else {
    handlerContent = renderOcSettings(ocData || { handlers: [] });
  }

  // Audit section (always read-only, shown in both modes).
  const h3 = document.createElement("h3");
  h3.textContent = `Audit (${audit.length})`;
  const ul = document.createElement("ul");
  ul.className = "audit-list";
  for (const a of audit) {
    const li = document.createElement("li");
    li.className = "audit-entry";

    const tsSpan = document.createElement("span");
    tsSpan.className = "audit-ts";
    tsSpan.textContent = formatTimestamp(a.ts);
    li.append(tsSpan);

    const outcomeText = a.outcome || "unknown";
    const outcomeCls = outcomeBadgeClass(outcomeText);
    const outcomeSpan = document.createElement("span");
    outcomeSpan.className = "outcome-badge" + (outcomeCls ? " " + outcomeCls : "");
    outcomeSpan.textContent = outcomeText;
    li.append(outcomeSpan);

    if (a.handler) {
      const handlerSpan = document.createElement("span");
      handlerSpan.className = "audit-handler";
      handlerSpan.textContent = a.handler;
      li.append(handlerSpan);
    }

    if (a.detail) {
      const detailSpan = document.createElement("span");
      detailSpan.className = "audit-detail";
      detailSpan.textContent = auditExcerpt(a.detail, 60);
      li.append(detailSpan);
    }

    ul.append(li);
  }

  els.ocPanel.append(titleDiv, actionsDiv, dl, ...handlerContent, h3, ul);
}

// Re-render Column 3 from cached state without a network fetch.
function rerenderOcPanel() {
  renderOcPanel(state.selectedChat, state.audit, state.ocSettings ? state.ocSettings.oc : null);
}

async function fetchOcSettings(jid) {
  const enc = encodeURIComponent(jid);
  const [oc, claw] = await Promise.all([
    api(`/api/oc/handler?jid=${enc}`),
    api(`/api/claw/handler?jid=${enc}`),
  ]);
  return { oc, claw };
}

async function selectChat(jid) {
  state.selectedJid = jid;
  state.editMode = false;
  renderChats();
  const chat = state.chats.find((c) => c.jid === jid);
  els.contentHeader.textContent = chat ? `${chat.displayName} — ${chat.jid}` : jid;

  // Show loading spinner in Column 3 immediately (the OC fetch is slow — it shells out).
  renderOcLoading();

  // Fetch messages and audit — failure uses global banner; Column 3 keeps the spinner.
  let messages;
  let audit;
  try {
    messages = await api(`/api/messages?jid=${encodeURIComponent(jid)}`);
    renderMessages(messages);
    audit = await api(`/api/audit?jid=${encodeURIComponent(jid)}`);
    clearBanner();
  } catch (err) {
    showBanner(err.message);
    return;
  }

  // Fetch OC/Claw settings in a separate try/catch — failure renders an error
  // inside Column 3 only, leaving Columns 1-2 intact.
  try {
    const settings = await fetchOcSettings(jid);
    state.ocSettings = settings;
    state.selectedChat = chat;
    state.audit = audit;
    renderOcPanel(chat, audit, settings.oc);
  } catch (err) {
    renderOcError(err.message);
  }
}

// Build the inline editor form for the WA Claw defaults (I1/I2/none).
// Returns a DOM node containing the form.
function buildDefaultsEditForm() {
  const { handlerType: initialType, config } = parseDefaultsConfig(
    state.defaults ? state.defaults.claw : null,
  );

  const wrapper = document.createElement("section");
  wrapper.className = "handler-card handler-edit";

  const h3 = document.createElement("h3");
  h3.textContent = "Edit Default Behavior";
  wrapper.append(h3);

  // Handler-type selector.
  const typeLabel = document.createElement("label");
  typeLabel.textContent = "Type: ";
  const typeSelect = document.createElement("select");
  typeSelect.className = "oc-edit-type";
  const optNone = document.createElement("option");
  optNone.value = "none";
  optNone.textContent = "None -- no default reply";
  const optStatic = document.createElement("option");
  optStatic.value = "static";
  optStatic.textContent = "Static reply (I1)";
  const optStateless = document.createElement("option");
  optStateless.value = "stateless";
  optStateless.textContent = "Stateless AI (I2)";
  typeSelect.append(optNone, optStatic, optStateless);
  typeSelect.value = initialType;
  typeLabel.append(typeSelect);
  wrapper.append(typeLabel);

  // Model field — always shown.
  const modelLabel = document.createElement("label");
  modelLabel.textContent = "Model:";
  const modelSelect = document.createElement("select");
  modelSelect.className = "oc-edit-model-select";
  const placeholderOpt = document.createElement("option");
  placeholderOpt.value = "";
  placeholderOpt.textContent = "(loading models...)";
  modelSelect.append(placeholderOpt);
  modelLabel.append(modelSelect);
  wrapper.append(modelLabel);

  const overrideLabel = document.createElement("label");
  overrideLabel.textContent = "Model override:";
  const modelInput = document.createElement("input");
  modelInput.className = "oc-edit-model oc-edit-owner";
  modelInput.type = "text";
  modelInput.placeholder = "(leave empty to use dropdown selection)";
  modelInput.value = "";
  overrideLabel.append(modelInput);
  wrapper.append(overrideLabel);

  api("/api/oc/models")
    .then((data) => {
      modelSelect.replaceChildren();
      const defOpt = document.createElement("option");
      defOpt.value = "";
      defOpt.textContent = data.defaultModel
        ? "(OC default: " + data.defaultModel + ")"
        : "(no default)";
      modelSelect.append(defOpt);
      for (const m of data.available || []) {
        const opt = document.createElement("option");
        opt.value = m.id;
        opt.textContent = m.id + (m.available === false ? " (unavailable)" : "");
        modelSelect.append(opt);
      }
      const currentModel = String(config.model ?? "");
      if (currentModel) {
        const matchesDropdown = (data.available || []).some((m) => m.id === currentModel);
        if (matchesDropdown) {
          modelSelect.value = currentModel;
        } else {
          modelInput.value = currentModel;
        }
      }
    })
    .catch(() => {
      modelSelect.replaceChildren();
      const errOpt = document.createElement("option");
      errOpt.value = "";
      errOpt.textContent = "(failed to load models)";
      modelSelect.append(errOpt);
      modelInput.value = String(config.model ?? "");
    });

  // Owner phone field — always shown.
  const ownerLabel = document.createElement("label");
  ownerLabel.textContent = "Owner phone:";
  const ownerInput = document.createElement("input");
  ownerInput.className = "oc-edit-model oc-edit-owner";
  ownerInput.type = "text";
  ownerInput.placeholder = "+972...";
  ownerInput.value = String(config.owner_phone ?? "");
  ownerLabel.append(ownerInput);
  wrapper.append(ownerLabel);

  // Type-specific field area — re-rendered when type changes.
  const fieldArea = document.createElement("div");
  fieldArea.className = "oc-edit-fields";
  wrapper.append(fieldArea);

  function renderTypeFields(selectedType) {
    fieldArea.replaceChildren();
    if (selectedType === "static") {
      const textLabel = document.createElement("label");
      textLabel.textContent = "Reply text:";
      const textarea = document.createElement("textarea");
      textarea.className = "oc-edit-text";
      textarea.value = String(config.text ?? "");
      textLabel.append(textarea);
      fieldArea.append(textLabel);
    } else if (selectedType === "stateless") {
      const promptLabel = document.createElement("label");
      promptLabel.textContent = "Prompt:";
      const promptTextarea = document.createElement("textarea");
      promptTextarea.className = "oc-edit-prompt";
      promptTextarea.value = String(config.prompt ?? "");
      promptLabel.append(promptTextarea);
      fieldArea.append(promptLabel);
    }
    // "none" has no type-specific field.
  }

  renderTypeFields(typeSelect.value);

  typeSelect.addEventListener("change", () => {
    renderTypeFields(typeSelect.value);
  });

  // Button row.
  const btnRow = document.createElement("div");
  btnRow.className = "oc-edit-buttons";

  const saveBtn = document.createElement("button");
  saveBtn.textContent = "Save";
  saveBtn.addEventListener("click", async () => {
    const selectedType = typeSelect.value;
    const overrideVal = modelInput.value.trim();
    const selectVal = modelSelect ? modelSelect.value : "";
    const model = overrideVal || selectVal;
    const ownerPhone = ownerInput.value;
    let text = "";
    let prompt = "";
    if (selectedType === "static") {
      const ta = fieldArea.querySelector(".oc-edit-text");
      text = ta ? ta.value : "";
    }
    if (selectedType === "stateless") {
      const ta = fieldArea.querySelector(".oc-edit-prompt");
      prompt = ta ? ta.value : "";
    }
    try {
      const payload = buildDefaultsPayload(selectedType, { model, ownerPhone, text, prompt });
      await apiSend("/api/claw/defaults", "POST", payload);
      state.editMode = false;
      await selectDefaults();
    } catch (err) {
      showBanner(err instanceof Error ? err.message : String(err));
    }
  });

  const cancelBtn = document.createElement("button");
  cancelBtn.textContent = "Cancel";
  cancelBtn.addEventListener("click", () => {
    state.editMode = false;
    rerenderDefaultsPanel();
  });

  btnRow.append(saveBtn, cancelBtn);
  wrapper.append(btnRow);
  return wrapper;
}

// Re-render Column 3 Defaults panel from cached state.defaults without a network fetch.
function rerenderDefaultsPanel() {
  renderDefaultsPanel();
}

// Render Column 3 (els.ocPanel) for the Defaults entry.
function renderDefaultsPanel() {
  els.ocPanel.replaceChildren();

  // Title.
  const titleDiv = document.createElement("div");
  titleDiv.className = "oc-section-title";
  titleDiv.textContent = "Default Behavior";

  // Actions row.
  const actionsDiv = document.createElement("div");
  actionsDiv.className = "oc-actions";

  const editBtn = document.createElement("button");
  editBtn.textContent = state.editMode ? "Cancel" : "Edit";
  editBtn.addEventListener("click", () => {
    state.editMode = !state.editMode;
    rerenderDefaultsPanel();
  });

  const refreshBtn = document.createElement("button");
  refreshBtn.textContent = "Refresh";
  refreshBtn.addEventListener("click", () => {
    selectDefaults();
  });

  actionsDiv.append(editBtn, refreshBtn);
  els.ocPanel.append(titleDiv, actionsDiv);

  // Edit mode: show edit form only.
  if (state.editMode) {
    els.ocPanel.append(buildDefaultsEditForm());
    return;
  }

  // Read mode: WA Claw Default card.
  const clawCard = document.createElement("section");
  clawCard.className = "handler-card";
  const clawHeader = document.createElement("div");
  clawHeader.className = "handler-card-header";
  const clawH3 = document.createElement("h3");
  clawH3.textContent = "WA Claw Default";
  clawHeader.append(clawH3);
  clawCard.append(clawHeader);

  const clawRow = state.defaults ? state.defaults.claw : null;
  if (clawRow == null) {
    const noConfig = document.createElement("p");
    noConfig.className = "muted";
    noConfig.textContent = "No WA Claw default configured. Click Edit to set one.";
    clawCard.append(noConfig);
  } else {
    const { handlerType, config } = parseDefaultsConfig(clawRow);
    const dl = document.createElement("dl");
    dl.className = "oc-info";

    function addRow(label, value) {
      const dt = document.createElement("dt");
      dt.textContent = label;
      const dd = document.createElement("dd");
      dd.textContent = String(value);
      dl.append(dt, dd);
    }

    addRow("Handler", defaultHandlerLabel(handlerType));
    addRow("Model", config.model || "(none)");
    if (handlerType === "static") {
      addRow("Text", config.text || "(empty)");
    }
    if (handlerType === "stateless") {
      const promptText = config.prompt || "(empty)";
      addRow("Prompt", promptText.length > 200 ? promptText.slice(0, 200) + "..." : promptText);
    }
    if (config.owner_phone) {
      addRow("Owner phone", config.owner_phone);
    }
    addRow("Updated", clawRow.updated_at || "");
    clawCard.append(dl);
  }

  els.ocPanel.append(clawCard);

  // Read mode: OC Agent Defaults card.
  const ocCard = document.createElement("section");
  ocCard.className = "handler-card";
  const ocHeader = document.createElement("div");
  ocHeader.className = "handler-card-header";
  const ocH3 = document.createElement("h3");
  ocH3.textContent = "OC Agent Defaults";
  ocHeader.append(ocH3);
  ocCard.append(ocHeader);

  const ocNote = document.createElement("p");
  ocNote.className = "muted";
  ocNote.textContent = "(applies to chats routed to OC)";
  ocCard.append(ocNote);

  const ocData = state.defaults ? state.defaults.oc : null;
  if (ocData == null) {
    const noOc = document.createElement("p");
    noOc.className = "muted";
    noOc.textContent = "OC agents.defaults not available.";
    ocCard.append(noOc);
  } else {
    const ocDl = document.createElement("dl");
    ocDl.className = "oc-info";

    function addOcRow(label, value) {
      if (value == null || value === "") {
        return;
      }
      if (typeof value === "object") {
        return;
      }
      const dt = document.createElement("dt");
      dt.textContent = label;
      const dd = document.createElement("dd");
      dd.textContent = String(value);
      ocDl.append(dt, dd);
    }

    addOcRow("Model", ocData.model);

    // Fallbacks: try both known field names; join array with ", ".
    const fallbacksRaw = Array.isArray(ocData.fallbackModels)
      ? ocData.fallbackModels
      : Array.isArray(ocData.modelFallbacks)
        ? ocData.modelFallbacks
        : null;
    if (fallbacksRaw && fallbacksRaw.length > 0) {
      const dt = document.createElement("dt");
      dt.textContent = "Fallbacks";
      const dd = document.createElement("dd");
      dd.textContent = fallbacksRaw.join(", ");
      ocDl.append(dt, dd);
    }

    addOcRow("Thinking", ocData.thinkingDefault);
    const toolsProfile =
      ocData.tools && typeof ocData.tools === "object" && !Array.isArray(ocData.tools)
        ? ocData.tools.profile
        : null;
    addOcRow("Tools", toolsProfile);

    ocCard.append(ocDl);
  }

  els.ocPanel.append(ocCard);
}

// Fetch both defaults endpoints and render the Defaults panel.
async function selectDefaults() {
  state.selectedJid = DEFAULTS_KEY;
  state.editMode = false;
  renderChats();
  els.contentHeader.textContent = "Settings Defaults";

  const info = document.createElement("li");
  info.className = "info-line";
  info.textContent =
    "Defaults -- the shared fallback handler applied to any chat without its own assignment.";
  els.messageList.replaceChildren(info);

  renderOcLoading();

  try {
    const [claw, oc] = await Promise.all([api("/api/claw/defaults"), api("/api/oc/defaults")]);
    state.defaults = { claw, oc: oc ? oc.oc : null };
    renderDefaultsPanel();
    clearBanner();
  } catch (err) {
    renderOcError(err instanceof Error ? err.message : String(err));
  }
}

function hideLog() {
  els.layout.classList.remove("hidden");
  els.logView.classList.add("hidden");
}

async function renderLog() {
  els.logView.replaceChildren();

  const backBtn = document.createElement("button");
  backBtn.className = "tutorial-back";
  backBtn.textContent = "Back";
  backBtn.addEventListener("click", hideLog);
  els.logView.append(backBtn);

  const title = document.createElement("div");
  title.className = "tutorial-section-title";
  title.textContent = "WA Claw Log (last 30 entries)";
  els.logView.append(title);

  try {
    const data = await api("/api/claw/log");
    const entries = data.entries || [];
    if (entries.length === 0) {
      const empty = document.createElement("p");
      empty.className = "muted";
      empty.textContent = "No log entries yet.";
      els.logView.append(empty);
      return;
    }
    const table = document.createElement("table");
    table.className = "log-table";
    const thead = document.createElement("thead");
    const headerRow = document.createElement("tr");
    for (const col of ["Timestamp", "Level", "Function", "Message"]) {
      const th = document.createElement("th");
      th.textContent = col;
      headerRow.append(th);
    }
    thead.append(headerRow);
    table.append(thead);
    const tbody = document.createElement("tbody");
    for (const entry of entries) {
      const tr = document.createElement("tr");
      tr.className = entry.level === "error" ? "log-row-error" : "";
      const tdTs = document.createElement("td");
      tdTs.textContent = entry.ts ? entry.ts.replace("T", " ").slice(0, 19) : "";
      const tdLevel = document.createElement("td");
      tdLevel.textContent = entry.level || "";
      const tdFn = document.createElement("td");
      tdFn.textContent = entry.fn || "";
      const tdMsg = document.createElement("td");
      tdMsg.textContent = entry.raw || entry.message || "";
      tr.append(tdTs, tdLevel, tdFn, tdMsg);
      tbody.append(tr);
    }
    table.append(tbody);
    els.logView.append(table);
  } catch (err) {
    const errDiv = document.createElement("div");
    errDiv.className = "oc-error";
    errDiv.textContent = String(err instanceof Error ? err.message : err);
    els.logView.append(errDiv);
  }
}

function showLog() {
  els.layout.classList.add("hidden");
  els.tutorialView.classList.add("hidden");
  els.logView.classList.remove("hidden");
  renderLog();
}

function hideTutorial() {
  els.layout.classList.remove("hidden");
  els.tutorialView.classList.add("hidden");
  els.logView.classList.add("hidden");
}

async function renderTutorial() {
  els.tutorialView.replaceChildren();

  // Back button.
  const backBtn = document.createElement("button");
  backBtn.className = "tutorial-back";
  backBtn.textContent = "Back";
  backBtn.addEventListener("click", hideTutorial);
  els.tutorialView.append(backBtn);

  // Handler Paths section title.
  const flowTitle = document.createElement("div");
  flowTitle.className = "tutorial-section-title";
  flowTitle.textContent = "Handler Paths";
  els.tutorialView.append(flowTitle);

  // Flow chart groups.
  for (const group of HANDLER_FLOW_CHARTS) {
    const groupHeading = document.createElement("div");
    groupHeading.className = "tutorial-flow-group";
    groupHeading.textContent = group.group;
    els.tutorialView.append(groupHeading);

    for (const handler of group.handlers) {
      const card = document.createElement("div");
      card.className = "flow-card";

      // Header: badge + name.
      const cardHeader = document.createElement("div");
      cardHeader.className = "flow-card-header";
      const idBadge = document.createElement("span");
      idBadge.className = "flow-id";
      idBadge.textContent = handler.id;
      const nameSpan = document.createElement("span");
      nameSpan.textContent = handler.name;
      cardHeader.append(idBadge, nameSpan);

      // Flow row: boxes and arrows.
      const flowRow = document.createElement("div");
      flowRow.className = "flow-row";
      const steps = handler.flow.split(" → ");
      for (let i = 0; i < steps.length; i++) {
        const box = document.createElement("div");
        box.className = "flow-box";
        box.textContent = steps[i];
        flowRow.append(box);
        if (i < steps.length - 1) {
          const arrow = document.createElement("div");
          arrow.className = "flow-arrow";
          arrow.textContent = "→";
          flowRow.append(arrow);
        }
      }

      card.append(cardHeader, flowRow);
      els.tutorialView.append(card);
    }
  }

  // AI Static Prompt section title.
  const promptTitle = document.createElement("div");
  promptTitle.className = "tutorial-section-title";
  promptTitle.textContent = "AI Static Prompt (wa-auto-prompt.md) — read only";
  els.tutorialView.append(promptTitle);

  // Fetch and render the prompt.
  try {
    const res = await fetch("/api/tutorial/prompt");
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }
    const text = await res.text();
    const pre = document.createElement("pre");
    pre.className = "tutorial-prompt";
    pre.textContent = text;
    els.tutorialView.append(pre);
  } catch (err) {
    const errDiv = document.createElement("div");
    errDiv.className = "oc-error";
    errDiv.textContent = String(err instanceof Error ? err.message : err);
    els.tutorialView.append(errDiv);
  }
}

function showTutorial() {
  els.layout.classList.add("hidden");
  els.tutorialView.classList.remove("hidden");
  renderTutorial();
}

async function init() {
  els.search.addEventListener("input", renderChats);
  els.defaultsItem.addEventListener("click", selectDefaults);
  els.logItem.addEventListener("click", showLog);
  els.tutorialItem.addEventListener("click", showTutorial);
  try {
    state.chats = await api("/api/chats");
    clearBanner();
    renderChats();
  } catch (err) {
    showBanner(`Cannot load chats: ${err.message}`);
  }
}

init();
