import { readFile } from "node:fs/promises";
import { createServer } from "node:http";
import { extname, join, normalize, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { isAuthorized, tokensMatch, TOKEN_COOKIE } from "./auth.mjs";
import { readLogTail } from "./log.mjs";
import {
  getDefaults,
  getHandlerForJid,
  jidToPhone,
  ocConfigGet,
  ocCronList,
  ocModelsList,
} from "./oc-config.mjs";
import { openStore } from "./wa-store.mjs";

// Default location of wa-auto-prompt.md, two levels up from app/src/ at the
// panel root. Overridable via the `promptPath` server option (used by tests).
const DEFAULT_PROMPT_PATH = fileURLToPath(new URL("../../wa-auto-prompt.md", import.meta.url));

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
};

function sendJson(res, status, body) {
  const data = JSON.stringify(body);
  res.writeHead(status, { "content-type": "application/json; charset=utf-8" });
  res.end(data);
}

function redirect(res, location, extraHeaders = {}) {
  res.writeHead(302, { location, ...extraHeaders });
  res.end();
}

/** Read a request body up to `limit` bytes; returns "" if it overflows. */
function readBody(req, limit = 8192) {
  return new Promise((resolvePromise) => {
    let data = "";
    let aborted = false;
    req.on("data", (chunk) => {
      data += chunk;
      if (data.length > limit) {
        aborted = true;
      }
    });
    req.on("end", () => resolvePromise(aborted ? "" : data));
    req.on("error", () => resolvePromise(""));
  });
}

/** Read and JSON-parse a request body. Returns { ok, value } — ok:false on empty/overflow/parse error. */
async function readJsonBody(req, limit = 262144) {
  const raw = await readBody(req, limit);
  if (!raw) {
    return { ok: false };
  }
  try {
    return { ok: true, value: JSON.parse(raw) };
  } catch {
    return { ok: false };
  }
}

/** Normalize a config_json field to a TEXT string for SQLite. Objects → JSON; strings pass through; nullish → "{}". */
function serializeConfig(config) {
  if (config == null) {
    return "{}";
  }
  if (typeof config === "string") {
    return config;
  }
  return JSON.stringify(config);
}

/** Build the auth cookie. Adds `Secure` when the request arrived over HTTPS. */
function buildAuthCookie(value, req) {
  const https = req.headers["x-forwarded-proto"] === "https";
  return (
    `${TOKEN_COOKIE}=${encodeURIComponent(value)}; Path=/; HttpOnly; SameSite=Strict` +
    (https ? "; Secure" : "")
  );
}

async function serveLoginPage(publicDir, res) {
  res.writeHead(200, { "content-type": MIME[".html"] });
  try {
    res.end(await readFile(join(publicDir, "login.html")));
  } catch {
    // Fallback when login.html is missing — keeps the panel usable.
    res.end(
      '<!doctype html><meta charset="utf-8"><title>Sign in</title>' +
        '<form method="POST" action="/login">' +
        '<input name="token" type="password" placeholder="Gateway token" autofocus>' +
        "<button>Sign in</button></form>",
    );
  }
}

async function serveStatic(pathname, publicDir, res) {
  const rel = pathname === "/" ? "index.html" : pathname.replace(/^\/+/, "");
  const full = normalize(join(publicDir, rel));
  // Path-traversal guard: resolved path must stay inside publicDir.
  if (full !== publicDir && !full.startsWith(publicDir + sep)) {
    sendJson(res, 403, { error: "forbidden" });
    return;
  }
  try {
    const data = await readFile(full);
    res.writeHead(200, {
      "content-type": MIME[extname(full)] || "application/octet-stream",
    });
    res.end(data);
  } catch {
    res.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
    res.end("Not found");
  }
}

/**
 * Create the panel HTTP server (not yet listening).
 * @param {{ dbPath: string, publicDir: string, token?: string, promptPath?: string }} opts
 *   `token` — when non-empty, every request must present it (an
 *   `Authorization: Bearer` header or the wa_claw_token cookie). When empty,
 *   the panel is UNGATED.
 *   `promptPath` — path to wa-auto-prompt.md served by GET /api/tutorial/prompt;
 *   defaults to the panel-root file.
 * @returns {import("node:http").Server}
 */
export function createPanelServer({
  dbPath,
  publicDir,
  token = "",
  promptPath = DEFAULT_PROMPT_PATH,
}) {
  let store = null;
  // Lazily open the store; on failure leave it null so the next request retries.
  function getStore() {
    if (!store) {
      store = openStore(dbPath);
    }
    return store;
  }

  const server = createServer(async (req, res) => {
    const url = new URL(req.url, "http://127.0.0.1");
    try {
      // --- Auth endpoints — always reachable, even unauthenticated ---
      if (url.pathname === "/login") {
        if (req.method === "POST") {
          const submitted = new URLSearchParams(await readBody(req)).get("token") || "";
          if (token && tokensMatch(submitted, token)) {
            redirect(res, "/", {
              "set-cookie": buildAuthCookie(submitted, req),
            });
          } else {
            redirect(res, "/login?error=1");
          }
          return;
        }
        await serveLoginPage(publicDir, res);
        return;
      }
      if (url.pathname === "/logout") {
        redirect(res, "/login", {
          "set-cookie": `${TOKEN_COOKIE}=; Path=/; Max-Age=0; HttpOnly; SameSite=Strict`,
        });
        return;
      }

      // --- Token gate (a no-op when `token` is empty) ---
      if (!isAuthorized(req, token)) {
        if (url.pathname.startsWith("/api/")) {
          sendJson(res, 401, { error: "unauthorized" });
        } else {
          redirect(res, "/login");
        }
        return;
      }

      // --- Data API ---
      if (url.pathname === "/api/chats") {
        sendJson(res, 200, getStore().listChats());
        return;
      }
      if (url.pathname === "/api/messages") {
        const jid = url.searchParams.get("jid");
        if (!jid) {
          sendJson(res, 400, { error: "missing jid" });
          return;
        }
        sendJson(res, 200, getStore().getMessages(jid));
        return;
      }
      if (url.pathname === "/api/audit") {
        const jid = url.searchParams.get("jid");
        if (!jid) {
          sendJson(res, 400, { error: "missing jid" });
          return;
        }
        sendJson(res, 200, getStore().getAudit(jid));
        return;
      }
      // --- OC config (read-only) ---
      if (url.pathname === "/api/oc/defaults") {
        sendJson(res, 200, getDefaults(getStore()));
        return;
      }
      if (url.pathname === "/api/oc/handler") {
        const jid = url.searchParams.get("jid");
        if (!jid) {
          sendJson(res, 400, { error: "missing jid" });
          return;
        }
        sendJson(res, 200, getHandlerForJid(jid, getStore()));
        return;
      }
      if (url.pathname === "/api/oc/agents") {
        sendJson(res, 200, ocConfigGet("agents.list") ?? []);
        return;
      }
      if (url.pathname === "/api/oc/crons") {
        sendJson(res, 200, ocCronList());
        return;
      }
      if (url.pathname === "/api/oc/models") {
        sendJson(res, 200, ocModelsList());
        return;
      }
      if (url.pathname === "/api/tutorial/prompt") {
        try {
          const text = await readFile(promptPath, "utf8");
          res.writeHead(200, { "content-type": "text/markdown; charset=utf-8" });
          res.end(text);
        } catch {
          sendJson(res, 500, { error: "wa-auto-prompt.md not found" });
        }
        return;
      }
      // --- WA Claw custom handlers (read + write) ---
      if (url.pathname === "/api/claw/handler") {
        const jid = url.searchParams.get("jid");
        if (!jid) {
          sendJson(res, 400, { error: "missing jid" });
          return;
        }
        if (req.method === "GET") {
          sendJson(res, 200, getStore().getHandler(jid));
          return;
        }
        if (req.method === "POST") {
          const parsed = await readJsonBody(req);
          if (!parsed.ok) {
            sendJson(res, 400, { error: "invalid JSON body" });
            return;
          }
          const body = parsed.value;
          const handlerType = body?.handler_type;
          if (typeof handlerType !== "string" || !handlerType) {
            sendJson(res, 400, { error: "missing handler_type" });
            return;
          }
          const configJson = serializeConfig(body?.config_json);
          const phoneE164 =
            typeof body?.phone_e164 === "string" && body.phone_e164
              ? body.phone_e164
              : jidToPhone(jid);
          getStore().upsertHandler(jid, handlerType, configJson, phoneE164);
          sendJson(res, 200, { ok: true });
          return;
        }
        if (req.method === "DELETE") {
          getStore().deleteHandler(jid);
          sendJson(res, 200, { ok: true });
          return;
        }
        sendJson(res, 405, { error: "method not allowed" });
        return;
      }
      if (url.pathname === "/api/claw/defaults") {
        if (req.method === "GET") {
          sendJson(res, 200, getStore().getDefaults());
          return;
        }
        if (req.method === "POST") {
          const parsed = await readJsonBody(req);
          if (!parsed.ok) {
            sendJson(res, 400, { error: "invalid JSON body" });
            return;
          }
          const body = parsed.value;
          const handlerType = body?.handler_type;
          if (typeof handlerType !== "string" || !handlerType) {
            sendJson(res, 400, { error: "missing handler_type" });
            return;
          }
          const configJson = serializeConfig(body?.config_json);
          getStore().upsertDefaults(handlerType, configJson);
          sendJson(res, 200, { ok: true });
          return;
        }
        sendJson(res, 405, { error: "method not allowed" });
        return;
      }
      if (url.pathname === "/api/claw/last-run") {
        const key = url.searchParams.get("key");
        if (!key) {
          sendJson(res, 400, { error: "missing key" });
          return;
        }
        sendJson(res, 200, getStore().getLastRun(key));
        return;
      }
      if (url.pathname === "/api/claw/log") {
        const logPath = join(dbPath, "..", "openclaw-whatsapp-claw.log");
        sendJson(res, 200, { entries: readLogTail(logPath) });
        return;
      }
      if (url.pathname.startsWith("/api/")) {
        sendJson(res, 404, { error: "not found" });
        return;
      }
      await serveStatic(url.pathname, publicDir, res);
    } catch (err) {
      sendJson(res, 503, {
        error: err instanceof Error ? err.message : String(err),
      });
    }
  });

  // Close the SQLite handle when the server closes. On Windows an open db
  // file cannot be deleted, so this lets temp dirs (and tests) clean up.
  server.on("close", () => {
    if (store) {
      try {
        store.close();
      } catch {
        /* ignore */
      }
      store = null;
    }
  });

  return server;
}

/**
 * Open the server and start listening on the loopback interface.
 * @param {{ dbPath: string, port: number, publicDir: string, token?: string }} config
 * @returns {Promise<import("node:http").Server>}
 */
export function startPanelServer(config) {
  const server = createPanelServer(config);
  return new Promise((resolvePromise) => {
    server.listen(config.port, "127.0.0.1", () => resolvePromise(server));
  });
}
