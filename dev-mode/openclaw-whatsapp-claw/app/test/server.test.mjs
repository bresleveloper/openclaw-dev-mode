import assert from "node:assert/strict";
import { mkdtempSync, writeFileSync, rmSync } from "node:fs";
import { request as httpRequest } from "node:http";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test, { beforeEach, afterEach } from "node:test";
import { setExecRunner, resetExecRunner, clearCache } from "../src/oc-config.mjs";
import { createPanelServer } from "../src/server.mjs";
import { makeTempDb } from "../test-helpers/make-temp-db.mjs";

// OC mock runner: map.config[path] → JSON-stringified for `openclaw config get <path> --json`
//                 map.cron        → JSON-stringified for `openclaw cron list --json`
function makeRunner(map = {}) {
  return (file, args) => {
    if (args[0] === "config" && args[1] === "get") {
      const path = args[2];
      if (map.config && Object.prototype.hasOwnProperty.call(map.config, path)) {
        return JSON.stringify(map.config[path]);
      }
      return "";
    }
    if (args[0] === "cron" && args[1] === "list") {
      return map.cron != null ? JSON.stringify(map.cron) : "[]";
    }
    return "";
  };
}

beforeEach(() => clearCache());
afterEach(() => {
  resetExecRunner();
  clearCache();
});

// All servers need a token now that auth is mandatory.  Tests that are not
// specifically testing the auth gate use DEFAULT_TEST_TOKEN so they don't have
// to repeat the credential on every fetch call.
const DEFAULT_TEST_TOKEN = "default-test-token-for-server-tests";

/** fetch() wrapper that automatically presents DEFAULT_TEST_TOKEN as Bearer. */
function authedFetch(url, opts = {}) {
  const headers = { authorization: `Bearer ${DEFAULT_TEST_TOKEN}`, ...(opts.headers || {}) };
  return fetch(url, { ...opts, headers });
}

/** Start a server on an ephemeral port; return { base, close }. */
async function startTestServer(opts) {
  // Inject the default token unless the caller provides their own.
  const resolvedOpts = { token: DEFAULT_TEST_TOKEN, ...opts };
  const server = createPanelServer(resolvedOpts);
  await new Promise((r) => server.listen(0, "127.0.0.1", r));
  const { port } = server.address();
  return {
    base: `http://127.0.0.1:${port}`,
    // Await this before deleting the temp db: closeAllConnections() drops
    // keep-alive sockets, and the server's 'close' event closes the SQLite
    // handle (an open db file cannot be deleted on Windows).
    close: () =>
      new Promise((resolve) => {
        server.closeAllConnections();
        server.close(() => resolve());
      }),
  };
}

test("GET /api/chats returns chats from the db", async () => {
  const { dbPath, cleanup } = makeTempDb();
  const srv = await startTestServer({ dbPath, publicDir: "/no/such/dir" });
  try {
    const res = await authedFetch(`${srv.base}/api/chats`);
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.ok(Array.isArray(body));
    assert.ok(body.some((c) => c.jid === "111@s.whatsapp.net"));
  } finally {
    await srv.close();
    cleanup();
  }
});

test("GET /api/messages requires a jid", async () => {
  const { dbPath, cleanup } = makeTempDb();
  const srv = await startTestServer({ dbPath, publicDir: "/no/such/dir" });
  try {
    const res = await authedFetch(`${srv.base}/api/messages`);
    assert.equal(res.status, 400);
    const body = await res.json();
    assert.match(body.error, /jid/);
  } finally {
    await srv.close();
    cleanup();
  }
});

test("GET /api/messages?jid= returns that chat's messages", async () => {
  const { dbPath, cleanup } = makeTempDb();
  const srv = await startTestServer({ dbPath, publicDir: "/no/such/dir" });
  try {
    const res = await authedFetch(
      `${srv.base}/api/messages?jid=${encodeURIComponent("111@s.whatsapp.net")}`,
    );
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.equal(body.length, 2);
  } finally {
    await srv.close();
    cleanup();
  }
});

test("GET /api/audit?jid= returns an array", async () => {
  const { dbPath, cleanup } = makeTempDb();
  const srv = await startTestServer({ dbPath, publicDir: "/no/such/dir" });
  try {
    const res = await authedFetch(
      `${srv.base}/api/audit?jid=${encodeURIComponent("111@s.whatsapp.net")}`,
    );
    assert.equal(res.status, 200);
    assert.deepEqual(await res.json(), []);
  } finally {
    await srv.close();
    cleanup();
  }
});

test("a missing db surfaces a 503 with an error message", async () => {
  const srv = await startTestServer({
    dbPath: "/no/such/openclaw-whatsapp-claw.db",
    publicDir: "/no/such/dir",
  });
  try {
    const res = await authedFetch(`${srv.base}/api/chats`);
    assert.equal(res.status, 503);
    const body = await res.json();
    assert.match(body.error, /not found/i);
  } finally {
    await srv.close();
  }
});

test("unknown /api route is 404", async () => {
  const { dbPath, cleanup } = makeTempDb();
  const srv = await startTestServer({ dbPath, publicDir: "/no/such/dir" });
  try {
    const res = await authedFetch(`${srv.base}/api/nope`);
    assert.equal(res.status, 404);
  } finally {
    await srv.close();
    cleanup();
  }
});

// --- Token gate ------------------------------------------------------------
// Auth is always mandatory. The tests below use TEST_TOKEN (a different value
// from DEFAULT_TEST_TOKEN) to verify the gate rejects wrong/missing creds.

/** Single HTTP request that does NOT auto-follow redirects (fetch opaques them). */
function rawRequest(base, path, opts = {}) {
  const url = new URL(path, base);
  const { method = "GET", headers = {}, body } = opts;
  return new Promise((resolve, reject) => {
    const req = httpRequest(
      {
        hostname: url.hostname,
        port: url.port,
        path: url.pathname + url.search,
        method,
        headers,
      },
      (res) => {
        let data = "";
        res.setEncoding("utf8");
        res.on("data", (c) => {
          data += c;
        });
        res.on("end", () => resolve({ status: res.statusCode, headers: res.headers, body: data }));
      },
    );
    req.on("error", reject);
    if (body) {
      req.write(body);
    }
    req.end();
  });
}

const TEST_TOKEN = "s3cr3t-token-value";
const gated = (dbPath) => ({
  dbPath,
  publicDir: "/no/such/dir",
  token: TEST_TOKEN,
});

test("with a token set, /api/chats is 401 without auth", async () => {
  const { dbPath, cleanup } = makeTempDb();
  const srv = await startTestServer(gated(dbPath));
  try {
    const res = await fetch(`${srv.base}/api/chats`);
    assert.equal(res.status, 401);
    assert.match((await res.json()).error, /unauthor/i);
  } finally {
    await srv.close();
    cleanup();
  }
});

test("with a token set, a valid Bearer token reaches /api/chats", async () => {
  const { dbPath, cleanup } = makeTempDb();
  const srv = await startTestServer(gated(dbPath));
  try {
    const res = await fetch(`${srv.base}/api/chats`, {
      headers: { authorization: `Bearer ${TEST_TOKEN}` },
    });
    assert.equal(res.status, 200);
    assert.ok(Array.isArray(await res.json()));
  } finally {
    await srv.close();
    cleanup();
  }
});

test("with a token set, a wrong Bearer token is 401", async () => {
  const { dbPath, cleanup } = makeTempDb();
  const srv = await startTestServer(gated(dbPath));
  try {
    const res = await fetch(`${srv.base}/api/chats`, {
      headers: { authorization: "Bearer definitely-the-wrong-token" },
    });
    assert.equal(res.status, 401);
  } finally {
    await srv.close();
    cleanup();
  }
});

test("with a token set, an unauthenticated page request redirects to /login", async () => {
  const { dbPath, cleanup } = makeTempDb();
  const srv = await startTestServer(gated(dbPath));
  try {
    const res = await rawRequest(srv.base, "/");
    assert.equal(res.status, 302);
    assert.equal(res.headers.location, "/login");
  } finally {
    await srv.close();
    cleanup();
  }
});

test("GET /login serves the login page even when unauthenticated", async () => {
  const { dbPath, cleanup } = makeTempDb();
  const srv = await startTestServer(gated(dbPath));
  try {
    const res = await rawRequest(srv.base, "/login");
    assert.equal(res.status, 200);
    assert.match(res.body, /<form/i);
  } finally {
    await srv.close();
    cleanup();
  }
});

test("POST /login with the correct token sets a cookie and redirects to /", async () => {
  const { dbPath, cleanup } = makeTempDb();
  const srv = await startTestServer(gated(dbPath));
  try {
    const res = await rawRequest(srv.base, "/login", {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: `token=${TEST_TOKEN}`,
    });
    assert.equal(res.status, 302);
    assert.equal(res.headers.location, "/");
    assert.match(String(res.headers["set-cookie"]), /wa_claw_token=/);
  } finally {
    await srv.close();
    cleanup();
  }
});

test("POST /login with a wrong token redirects back to /login", async () => {
  const { dbPath, cleanup } = makeTempDb();
  const srv = await startTestServer(gated(dbPath));
  try {
    const res = await rawRequest(srv.base, "/login", {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: "token=the-wrong-one",
    });
    assert.equal(res.status, 302);
    assert.match(res.headers.location, /\/login/);
  } finally {
    await srv.close();
    cleanup();
  }
});

// ── OC read routes ──────────────────────────────────────────────────────────

test("GET /api/oc/agents returns the mocked agents.list array", async () => {
  const { dbPath, cleanup } = makeTempDb();
  setExecRunner(makeRunner({ config: { "agents.list": [{ id: "main", name: "Main" }] } }));
  const srv = await startTestServer({ dbPath, publicDir: "/no/such/dir" });
  try {
    const res = await authedFetch(`${srv.base}/api/oc/agents`);
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.ok(Array.isArray(body));
    assert.equal(body.length, 1);
    assert.equal(body[0].id, "main");
  } finally {
    await srv.close();
    cleanup();
  }
});

test("GET /api/oc/agents returns [] when CLI yields nothing", async () => {
  const { dbPath, cleanup } = makeTempDb();
  // No runner set → ocConfigGet returns null → server sends []
  const srv = await startTestServer({ dbPath, publicDir: "/no/such/dir" });
  try {
    const res = await authedFetch(`${srv.base}/api/oc/agents`);
    assert.equal(res.status, 200);
    assert.deepEqual(await res.json(), []);
  } finally {
    await srv.close();
    cleanup();
  }
});

test("GET /api/oc/crons returns the mocked cron array", async () => {
  const { dbPath, cleanup } = makeTempDb();
  setExecRunner(makeRunner({ cron: [{ id: "c1", name: "Daily ping" }] }));
  const srv = await startTestServer({ dbPath, publicDir: "/no/such/dir" });
  try {
    const res = await authedFetch(`${srv.base}/api/oc/crons`);
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.ok(Array.isArray(body));
    assert.equal(body.length, 1);
    assert.equal(body[0].id, "c1");
  } finally {
    await srv.close();
    cleanup();
  }
});

test("GET /api/oc/crons returns [] on CLI error (runner throws)", async () => {
  const { dbPath, cleanup } = makeTempDb();
  setExecRunner(() => {
    throw new Error("CLI not found");
  });
  const srv = await startTestServer({ dbPath, publicDir: "/no/such/dir" });
  try {
    const res = await authedFetch(`${srv.base}/api/oc/crons`);
    assert.equal(res.status, 200);
    assert.deepEqual(await res.json(), []);
  } finally {
    await srv.close();
    cleanup();
  }
});

test("GET /api/oc/defaults returns waClaw row + mocked oc when defaults exist", async () => {
  const { dbPath, cleanup } = makeTempDb();
  // First seed the store with a defaults row via /api/claw/defaults POST
  setExecRunner(makeRunner({ config: { "agents.defaults": { model: "gpt-4o" } } }));
  const srv = await startTestServer({ dbPath, publicDir: "/no/such/dir" });
  try {
    // Seed defaults
    const post = await authedFetch(`${srv.base}/api/claw/defaults`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ handler_type: "static", config_json: { text: "hello" } }),
    });
    assert.equal(post.status, 200);

    // Now fetch /api/oc/defaults — runner is still active, cache was cleared by beforeEach
    const res = await authedFetch(`${srv.base}/api/oc/defaults`);
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.ok(body.waClaw !== null, "waClaw should be non-null after seeding defaults");
    assert.equal(body.waClaw.handler_type, "static");
    assert.deepEqual(body.oc, { model: "gpt-4o" });
  } finally {
    await srv.close();
    cleanup();
  }
});

test("GET /api/oc/handler without jid returns 400", async () => {
  const { dbPath, cleanup } = makeTempDb();
  const srv = await startTestServer({ dbPath, publicDir: "/no/such/dir" });
  try {
    const res = await authedFetch(`${srv.base}/api/oc/handler`);
    assert.equal(res.status, 400);
    const body = await res.json();
    assert.match(body.error, /jid/);
  } finally {
    await srv.close();
    cleanup();
  }
});

test("GET /api/oc/handler?jid= after a static custom handler shows source:custom + taxonomy:I1", async () => {
  const { dbPath, cleanup } = makeTempDb();
  // Mock all OC calls to empty so only custom handler appears
  setExecRunner(makeRunner({ config: {}, cron: [] }));
  const srv = await startTestServer({ dbPath, publicDir: "/no/such/dir" });
  try {
    // Seed custom handler
    const jid = "111@s.whatsapp.net";
    const post = await authedFetch(`${srv.base}/api/claw/handler?jid=${encodeURIComponent(jid)}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ handler_type: "static", config_json: { text: "hey" } }),
    });
    assert.equal(post.status, 200);

    const res = await authedFetch(`${srv.base}/api/oc/handler?jid=${encodeURIComponent(jid)}`);
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.ok(Array.isArray(body.handlers), "handlers must be an array");
    const custom = body.handlers.find((h) => h.source === "custom");
    assert.ok(custom, "should have a custom source handler");
    assert.equal(custom.taxonomy, "I1");
    assert.ok(custom.writable, "custom handler should be writable");
    assert.ok(body.taxonomy.includes("I1"), "taxonomy array should include I1");
  } finally {
    await srv.close();
    cleanup();
  }
});

// ── Tutorial prompt route ───────────────────────────────────────────────────

test("GET /api/tutorial/prompt returns 200 text/markdown matching the file content", async () => {
  const { dbPath, cleanup } = makeTempDb();
  const tmpDir = mkdtempSync(join(tmpdir(), "wa-claw-prompt-test-"));
  const promptPath = join(tmpDir, "wa-auto-prompt.md");
  writeFileSync(promptPath, "# WA Auto Prompt\n\nThis is the tutorial.");
  const srv = await startTestServer({ dbPath, publicDir: "/no/such/dir", promptPath });
  try {
    const res = await authedFetch(`${srv.base}/api/tutorial/prompt`);
    assert.equal(res.status, 200);
    assert.ok(res.headers.get("content-type").includes("text/markdown"));
    const text = await res.text();
    assert.equal(text, "# WA Auto Prompt\n\nThis is the tutorial.");
  } finally {
    await srv.close();
    cleanup();
    rmSync(tmpDir, { recursive: true, force: true });
  }
});

test("GET /api/tutorial/prompt with a missing promptPath returns 500 + error JSON", async () => {
  const { dbPath, cleanup } = makeTempDb();
  const srv = await startTestServer({
    dbPath,
    publicDir: "/no/such/dir",
    promptPath: "/no/such/wa-auto-prompt.md",
  });
  try {
    const res = await authedFetch(`${srv.base}/api/tutorial/prompt`);
    assert.equal(res.status, 500);
    const body = await res.json();
    assert.ok(body.error, "should have an error field");
  } finally {
    await srv.close();
    cleanup();
  }
});

// ── Claw handler routes ─────────────────────────────────────────────────────

test("GET /api/claw/handler without jid returns 400", async () => {
  const { dbPath, cleanup } = makeTempDb();
  const srv = await startTestServer({ dbPath, publicDir: "/no/such/dir" });
  try {
    const res = await authedFetch(`${srv.base}/api/claw/handler`);
    assert.equal(res.status, 400);
    const body = await res.json();
    assert.match(body.error, /jid/);
  } finally {
    await srv.close();
    cleanup();
  }
});

test("GET /api/claw/handler?jid= returns null before any handler exists", async () => {
  const { dbPath, cleanup } = makeTempDb();
  const srv = await startTestServer({ dbPath, publicDir: "/no/such/dir" });
  try {
    const res = await authedFetch(
      `${srv.base}/api/claw/handler?jid=${encodeURIComponent("111@s.whatsapp.net")}`,
    );
    assert.equal(res.status, 200);
    assert.equal(await res.json(), null);
  } finally {
    await srv.close();
    cleanup();
  }
});

test("POST /api/claw/handler?jid= valid stores the row; GET returns it with defaults", async () => {
  const { dbPath, cleanup } = makeTempDb();
  const srv = await startTestServer({ dbPath, publicDir: "/no/such/dir" });
  const jid = "111@s.whatsapp.net";
  try {
    const post = await authedFetch(`${srv.base}/api/claw/handler?jid=${encodeURIComponent(jid)}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ handler_type: "static", config_json: { text: "hi" } }),
    });
    assert.equal(post.status, 200);
    assert.deepEqual(await post.json(), { ok: true });

    const get = await authedFetch(`${srv.base}/api/claw/handler?jid=${encodeURIComponent(jid)}`);
    assert.equal(get.status, 200);
    const row = await get.json();
    assert.equal(row.handler_type, "static");
    assert.equal(JSON.parse(row.config_json).text, "hi");
    assert.equal(row.phone_e164, "+111");
  } finally {
    await srv.close();
    cleanup();
  }
});

test("POST /api/claw/handler?jid= with invalid JSON body returns 400 invalid JSON body", async () => {
  const { dbPath, cleanup } = makeTempDb();
  const srv = await startTestServer({ dbPath, publicDir: "/no/such/dir" });
  try {
    const res = await authedFetch(
      `${srv.base}/api/claw/handler?jid=${encodeURIComponent("111@s.whatsapp.net")}`,
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: "not-json{{{",
      },
    );
    assert.equal(res.status, 400);
    const body = await res.json();
    assert.match(body.error, /invalid JSON body/);
  } finally {
    await srv.close();
    cleanup();
  }
});

test("POST /api/claw/handler?jid= with missing handler_type returns 400", async () => {
  const { dbPath, cleanup } = makeTempDb();
  const srv = await startTestServer({ dbPath, publicDir: "/no/such/dir" });
  try {
    const res = await authedFetch(
      `${srv.base}/api/claw/handler?jid=${encodeURIComponent("111@s.whatsapp.net")}`,
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ config_json: {} }),
      },
    );
    assert.equal(res.status, 400);
    const body = await res.json();
    assert.match(body.error, /missing handler_type/);
  } finally {
    await srv.close();
    cleanup();
  }
});

test("POST /api/claw/handler without jid returns 400 missing jid", async () => {
  const { dbPath, cleanup } = makeTempDb();
  const srv = await startTestServer({ dbPath, publicDir: "/no/such/dir" });
  try {
    const res = await authedFetch(`${srv.base}/api/claw/handler`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ handler_type: "static" }),
    });
    assert.equal(res.status, 400);
    const body = await res.json();
    assert.match(body.error, /missing jid/);
  } finally {
    await srv.close();
    cleanup();
  }
});

test("DELETE /api/claw/handler?jid= after a POST returns ok:true; follow-up GET returns null", async () => {
  const { dbPath, cleanup } = makeTempDb();
  const srv = await startTestServer({ dbPath, publicDir: "/no/such/dir" });
  const jid = "111@s.whatsapp.net";
  try {
    await authedFetch(`${srv.base}/api/claw/handler?jid=${encodeURIComponent(jid)}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ handler_type: "static" }),
    });
    const del = await authedFetch(`${srv.base}/api/claw/handler?jid=${encodeURIComponent(jid)}`, {
      method: "DELETE",
    });
    assert.equal(del.status, 200);
    assert.deepEqual(await del.json(), { ok: true });

    const get = await authedFetch(`${srv.base}/api/claw/handler?jid=${encodeURIComponent(jid)}`);
    assert.equal(get.status, 200);
    assert.equal(await get.json(), null);
  } finally {
    await srv.close();
    cleanup();
  }
});

test("PUT /api/claw/handler?jid= returns 405 method not allowed", async () => {
  const { dbPath, cleanup } = makeTempDb();
  const srv = await startTestServer({ dbPath, publicDir: "/no/such/dir" });
  try {
    const res = await authedFetch(
      `${srv.base}/api/claw/handler?jid=${encodeURIComponent("111@s.whatsapp.net")}`,
      { method: "PUT" },
    );
    assert.equal(res.status, 405);
    const body = await res.json();
    assert.match(body.error, /method not allowed/);
  } finally {
    await srv.close();
    cleanup();
  }
});

// ── Claw defaults routes ────────────────────────────────────────────────────

test("GET /api/claw/defaults returns null initially", async () => {
  const { dbPath, cleanup } = makeTempDb();
  const srv = await startTestServer({ dbPath, publicDir: "/no/such/dir" });
  try {
    const res = await authedFetch(`${srv.base}/api/claw/defaults`);
    assert.equal(res.status, 200);
    assert.equal(await res.json(), null);
  } finally {
    await srv.close();
    cleanup();
  }
});

test("POST /api/claw/defaults valid → ok:true; follow-up GET returns the row", async () => {
  const { dbPath, cleanup } = makeTempDb();
  const srv = await startTestServer({ dbPath, publicDir: "/no/such/dir" });
  try {
    const post = await authedFetch(`${srv.base}/api/claw/defaults`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ handler_type: "stateless", config_json: { agent: "main" } }),
    });
    assert.equal(post.status, 200);
    assert.deepEqual(await post.json(), { ok: true });

    const get = await authedFetch(`${srv.base}/api/claw/defaults`);
    assert.equal(get.status, 200);
    const row = await get.json();
    assert.equal(row.handler_type, "stateless");
    assert.equal(JSON.parse(row.config_json).agent, "main");
  } finally {
    await srv.close();
    cleanup();
  }
});

test("POST /api/claw/defaults with invalid JSON returns 400", async () => {
  const { dbPath, cleanup } = makeTempDb();
  const srv = await startTestServer({ dbPath, publicDir: "/no/such/dir" });
  try {
    const res = await authedFetch(`${srv.base}/api/claw/defaults`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: "{{not-json",
    });
    assert.equal(res.status, 400);
    const body = await res.json();
    assert.match(body.error, /invalid JSON body/);
  } finally {
    await srv.close();
    cleanup();
  }
});

test("POST /api/claw/defaults with missing handler_type returns 400", async () => {
  const { dbPath, cleanup } = makeTempDb();
  const srv = await startTestServer({ dbPath, publicDir: "/no/such/dir" });
  try {
    const res = await authedFetch(`${srv.base}/api/claw/defaults`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ config_json: {} }),
    });
    assert.equal(res.status, 400);
    const body = await res.json();
    assert.match(body.error, /missing handler_type/);
  } finally {
    await srv.close();
    cleanup();
  }
});

test("PUT /api/claw/defaults returns 405", async () => {
  const { dbPath, cleanup } = makeTempDb();
  const srv = await startTestServer({ dbPath, publicDir: "/no/such/dir" });
  try {
    const res = await authedFetch(`${srv.base}/api/claw/defaults`, { method: "PUT" });
    assert.equal(res.status, 405);
    const body = await res.json();
    assert.match(body.error, /method not allowed/);
  } finally {
    await srv.close();
    cleanup();
  }
});

// ── Claw last-run routes ────────────────────────────────────────────────────

test("GET /api/claw/last-run without key returns 400 missing key", async () => {
  const { dbPath, cleanup } = makeTempDb();
  const srv = await startTestServer({ dbPath, publicDir: "/no/such/dir" });
  try {
    const res = await authedFetch(`${srv.base}/api/claw/last-run`);
    assert.equal(res.status, 400);
    const body = await res.json();
    assert.match(body.error, /missing key/);
  } finally {
    await srv.close();
    cleanup();
  }
});

test("GET /api/claw/last-run?key= returns null for an absent key", async () => {
  const { dbPath, cleanup } = makeTempDb();
  const srv = await startTestServer({ dbPath, publicDir: "/no/such/dir" });
  try {
    const res = await authedFetch(
      `${srv.base}/api/claw/last-run?key=${encodeURIComponent("no-such-session")}`,
    );
    assert.equal(res.status, 200);
    assert.equal(await res.json(), null);
  } finally {
    await srv.close();
    cleanup();
  }
});

// ── Auth enforcement on new routes ─────────────────────────────────────────

test("with a token set, GET /api/oc/defaults without auth returns 401", async () => {
  const { dbPath, cleanup } = makeTempDb();
  const srv = await startTestServer(gated(dbPath));
  try {
    const res = await fetch(`${srv.base}/api/oc/defaults`);
    assert.equal(res.status, 401);
    assert.match((await res.json()).error, /unauthor/i);
  } finally {
    await srv.close();
    cleanup();
  }
});

test("with a token set, GET /api/claw/handler?jid= without auth returns 401", async () => {
  const { dbPath, cleanup } = makeTempDb();
  const srv = await startTestServer(gated(dbPath));
  try {
    const res = await fetch(
      `${srv.base}/api/claw/handler?jid=${encodeURIComponent("111@s.whatsapp.net")}`,
    );
    assert.equal(res.status, 401);
    assert.match((await res.json()).error, /unauthor/i);
  } finally {
    await srv.close();
    cleanup();
  }
});

test("with a token set, POST /api/claw/defaults without auth returns 401", async () => {
  const { dbPath, cleanup } = makeTempDb();
  const srv = await startTestServer(gated(dbPath));
  try {
    const res = await fetch(`${srv.base}/api/claw/defaults`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ handler_type: "static" }),
    });
    assert.equal(res.status, 401);
    assert.match((await res.json()).error, /unauthor/i);
  } finally {
    await srv.close();
    cleanup();
  }
});
