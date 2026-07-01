/**
 * integration-check.mjs — End-to-end integration sanity script for the
 * WhatsApp Claw v2 panel.
 *
 * Creates a real temp DB, starts the real HTTP server on an ephemeral port,
 * hits every v2 API endpoint with fetch(), verifies each response, then
 * cleans up. Exits 0 if all checks pass, 1 if any fail.
 *
 * Usage (from the app/ directory):
 *   node scripts/integration-check.mjs
 */

import { setExecRunner, resetExecRunner, clearCache } from "../src/oc-config.mjs";
import { createPanelServer } from "../src/server.mjs";
import { openStore } from "../src/wa-store.mjs";
import { makeTempDb } from "../test-helpers/make-temp-db.mjs";

// ---------------------------------------------------------------------------
// Check helpers
// ---------------------------------------------------------------------------
let passed = 0;
let failed = 0;

function check(label, cond) {
  if (cond) {
    passed++;
    console.log(`  PASS  ${label}`);
  } else {
    failed++;
    console.log(`  FAIL  ${label}`);
  }
}

// ---------------------------------------------------------------------------
// Mock OC runner (mirrors the shape used across the test suite)
// ---------------------------------------------------------------------------
function makeRunner(map) {
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

// ---------------------------------------------------------------------------
// Start server helper — resolves to { base, server }
// ---------------------------------------------------------------------------
function startServer(opts) {
  return new Promise((resolve) => {
    const server = createPanelServer(opts);
    server.listen(0, "127.0.0.1", () => {
      const { port } = server.address();
      resolve({ base: `http://127.0.0.1:${port}`, server });
    });
  });
}

// ---------------------------------------------------------------------------
// Stop server helper — waits for the server to fully close
// ---------------------------------------------------------------------------
function stopServer(server) {
  return new Promise((resolve) => {
    server.closeAllConnections();
    server.close(() => resolve());
  });
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
const JID_111 = "111@s.whatsapp.net";
const JID_222 = "222@s.whatsapp.net";

let cleanup = null;
let srv = null;

try {
  // Step 1: Create temp DB
  const tempDb = makeTempDb();
  cleanup = tempDb.cleanup;
  const { dbPath } = tempDb;

  // Step 2: Pre-insert a static handler for jid 111 via wa-store
  const store = openStore(dbPath);
  store.upsertHandler(JID_111, "static", JSON.stringify({ text: "hi" }), "+111");
  store.close();

  // Setup mock OC runner before starting server
  clearCache();
  setExecRunner(
    makeRunner({
      config: {
        "agents.list": [{ id: "main", name: "Main" }],
        "agents.defaults": { model: "gpt-4o" },
      },
      cron: [{ id: "c1", name: "Daily ping" }],
    }),
  );

  // Step 3: Start the real panel server (ungated — no token)
  const started = await startServer({ dbPath, publicDir: "/no/such/dir" });
  srv = started.server;
  const base = started.base;

  // Step 4 & 5: Hit each endpoint and verify

  // Check 1: GET /api/chats
  {
    const res = await fetch(`${base}/api/chats`);
    const body = await res.json();
    check("GET /api/chats -> 200", res.status === 200);
    check(
      "GET /api/chats -> array containing 111@s.whatsapp.net",
      Array.isArray(body) && body.some((c) => c.jid === JID_111),
    );
  }

  // Check 2: GET /api/messages?jid=111@s.whatsapp.net
  {
    const res = await fetch(`${base}/api/messages?jid=${encodeURIComponent(JID_111)}`);
    const body = await res.json();
    check("GET /api/messages?jid=111 -> 200", res.status === 200);
    check("GET /api/messages?jid=111 -> length 2", Array.isArray(body) && body.length === 2);
  }

  // Check 3: GET /api/audit?jid=111@s.whatsapp.net
  {
    const res = await fetch(`${base}/api/audit?jid=${encodeURIComponent(JID_111)}`);
    const body = await res.json();
    check("GET /api/audit?jid=111 -> 200", res.status === 200);
    check("GET /api/audit?jid=111 -> array", Array.isArray(body));
  }

  // Check 4: GET /api/claw/handler?jid=111 (pre-inserted via wa-store)
  {
    const res = await fetch(`${base}/api/claw/handler?jid=${encodeURIComponent(JID_111)}`);
    const body = await res.json();
    check("GET /api/claw/handler?jid=111 -> 200", res.status === 200);
    check(
      "GET /api/claw/handler?jid=111 -> handler_type static",
      body !== null && body.handler_type === "static",
    );
    let configText = null;
    try {
      configText = JSON.parse(body.config_json).text;
    } catch {
      configText = null;
    }
    check("GET /api/claw/handler?jid=111 -> config_json.text === hi", configText === "hi");
  }

  // Check 5: POST /api/claw/handler?jid=222 (create a stateless handler)
  {
    const res = await fetch(`${base}/api/claw/handler?jid=${encodeURIComponent(JID_222)}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        handler_type: "stateless",
        config_json: { model: "m", prompt: "p" },
      }),
    });
    const body = await res.json();
    check("POST /api/claw/handler?jid=222 -> 200", res.status === 200);
    check("POST /api/claw/handler?jid=222 -> {ok:true}", body !== null && body.ok === true);
  }

  // Check 6: GET /api/claw/handler?jid=222 (just created)
  {
    const res = await fetch(`${base}/api/claw/handler?jid=${encodeURIComponent(JID_222)}`);
    const body = await res.json();
    check("GET /api/claw/handler?jid=222 -> 200", res.status === 200);
    check(
      "GET /api/claw/handler?jid=222 -> handler_type stateless",
      body !== null && body.handler_type === "stateless",
    );
  }

  // Check 7: DELETE /api/claw/handler?jid=222, then GET returns null
  {
    const del = await fetch(`${base}/api/claw/handler?jid=${encodeURIComponent(JID_222)}`, {
      method: "DELETE",
    });
    const delBody = await del.json();
    check("DELETE /api/claw/handler?jid=222 -> 200", del.status === 200);
    check("DELETE /api/claw/handler?jid=222 -> {ok:true}", delBody !== null && delBody.ok === true);

    const get = await fetch(`${base}/api/claw/handler?jid=${encodeURIComponent(JID_222)}`);
    const getBody = await get.json();
    check(
      "GET /api/claw/handler?jid=222 after DELETE -> null",
      get.status === 200 && getBody === null,
    );
  }

  // Check 8: GET /api/claw/defaults (nothing seeded yet)
  {
    const res = await fetch(`${base}/api/claw/defaults`);
    const body = await res.json();
    check("GET /api/claw/defaults (empty) -> 200", res.status === 200);
    check("GET /api/claw/defaults (empty) -> null", body === null);
  }

  // Check 9: POST /api/claw/defaults, then GET returns the row
  {
    const post = await fetch(`${base}/api/claw/defaults`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ handler_type: "static", config_json: { text: "def" } }),
    });
    const postBody = await post.json();
    check("POST /api/claw/defaults -> 200", post.status === 200);
    check("POST /api/claw/defaults -> {ok:true}", postBody !== null && postBody.ok === true);

    const get = await fetch(`${base}/api/claw/defaults`);
    const getBody = await get.json();
    check("GET /api/claw/defaults after POST -> 200", get.status === 200);
    check(
      "GET /api/claw/defaults after POST -> handler_type static",
      getBody !== null && getBody.handler_type === "static",
    );
  }

  // Check 10: GET /api/claw/last-run?key=no-such-session
  {
    const res = await fetch(
      `${base}/api/claw/last-run?key=${encodeURIComponent("no-such-session")}`,
    );
    const body = await res.json();
    check("GET /api/claw/last-run?key=no-such-session -> 200", res.status === 200);
    check("GET /api/claw/last-run?key=no-such-session -> null", body === null);
  }

  // Check 11: GET /api/oc/agents
  {
    const res = await fetch(`${base}/api/oc/agents`);
    const body = await res.json();
    check("GET /api/oc/agents -> 200", res.status === 200);
    check("GET /api/oc/agents -> array length 1", Array.isArray(body) && body.length === 1);
    check(
      "GET /api/oc/agents -> body[0].id === main",
      Array.isArray(body) && body.length > 0 && body[0].id === "main",
    );
  }

  // Check 12: GET /api/oc/crons
  {
    const res = await fetch(`${base}/api/oc/crons`);
    const body = await res.json();
    check("GET /api/oc/crons -> 200", res.status === 200);
    check("GET /api/oc/crons -> array length 1", Array.isArray(body) && body.length === 1);
    check(
      "GET /api/oc/crons -> body[0].id === c1",
      Array.isArray(body) && body.length > 0 && body[0].id === "c1",
    );
  }

  // Check 13: GET /api/oc/defaults (step 9 already seeded defaults row)
  {
    const res = await fetch(`${base}/api/oc/defaults`);
    const body = await res.json();
    check("GET /api/oc/defaults -> 200", res.status === 200);
    check("GET /api/oc/defaults -> object", body !== null && typeof body === "object");
    check(
      "GET /api/oc/defaults -> non-null waClaw (seeded in step 9)",
      body !== null && body.waClaw !== null,
    );
    check(
      "GET /api/oc/defaults -> oc deepEquals {model:gpt-4o}",
      body !== null &&
        body.oc !== null &&
        typeof body.oc === "object" &&
        body.oc.model === "gpt-4o",
    );
  }

  // Check 14: GET /api/oc/handler?jid=111 (has custom static handler from step 2)
  {
    const res = await fetch(`${base}/api/oc/handler?jid=${encodeURIComponent(JID_111)}`);
    const body = await res.json();
    check("GET /api/oc/handler?jid=111 -> 200", res.status === 200);
    check(
      "GET /api/oc/handler?jid=111 -> handlers is array",
      body !== null && Array.isArray(body.handlers),
    );
    const customEntry =
      Array.isArray(body.handlers) &&
      body.handlers.find((h) => h.source === "custom" && h.taxonomy === "I1");
    check(
      "GET /api/oc/handler?jid=111 -> contains custom source=custom taxonomy=I1",
      customEntry !== null && customEntry !== undefined && customEntry !== false,
    );
    check(
      "GET /api/oc/handler?jid=111 -> taxonomy includes I1",
      Array.isArray(body.taxonomy) && body.taxonomy.includes("I1"),
    );
  }

  // Check 15: GET /api/tutorial/prompt
  {
    const res = await fetch(`${base}/api/tutorial/prompt`);
    const text = await res.text();
    check("GET /api/tutorial/prompt -> 200", res.status === 200);
    const contentType = res.headers.get("content-type") || "";
    check(
      "GET /api/tutorial/prompt -> content-type includes text/markdown",
      contentType.includes("text/markdown"),
    );
    check("GET /api/tutorial/prompt -> body non-empty", text.length > 0);
  }
} catch (err) {
  const msg = err instanceof Error ? err.message : String(err);
  console.log(`  ERROR  Unexpected error during checks: ${msg}`);
  failed++;
} finally {
  // Step 6: Clean up — guard each step so one failure does not skip the others
  try {
    resetExecRunner();
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.log(`  WARN  resetExecRunner failed: ${msg}`);
  }

  if (srv !== null) {
    try {
      await stopServer(srv);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.log(`  WARN  server close failed: ${msg}`);
    }
  }

  if (cleanup !== null) {
    try {
      cleanup();
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.log(`  WARN  temp db cleanup failed: ${msg}`);
    }
  }
}

// Step 7: Print summary and exit
console.log(`\nintegration-check: ${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
