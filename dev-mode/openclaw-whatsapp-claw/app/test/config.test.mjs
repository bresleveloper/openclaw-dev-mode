import assert from "node:assert/strict";
import { join } from "node:path";
import test from "node:test";
import { resolveConfig } from "../src/config.mjs";

test("resolveConfig builds the default db path under the home dir", () => {
  const home = join("/tmp", "home");
  const cfg = resolveConfig({ HOME: home, WA_CLAW_TOKEN: "tok" });
  assert.equal(cfg.dbPath, join(home, ".openclaw", "dev-mode", "openclaw-whatsapp-claw.db"));
  assert.equal(cfg.port, 18790);
  assert.ok(cfg.publicDir.endsWith("public"));
});

test("resolveConfig honors env overrides", () => {
  const cfg = resolveConfig({ WA_CLAW_DB: "/x/y.db", WA_CLAW_PORT: "9999", WA_CLAW_TOKEN: "tok" });
  assert.equal(cfg.dbPath, "/x/y.db");
  assert.equal(cfg.port, 9999);
});

test("resolveConfig throws when no token env var is set", () => {
  assert.throws(() => resolveConfig({}), /no auth token/i);
});

test("resolveConfig resolves the auth token from env", () => {
  assert.equal(resolveConfig({ WA_CLAW_TOKEN: "aaa" }).token, "aaa");
  assert.equal(resolveConfig({ OPENCLAW_GATEWAY_TOKEN: "bbb" }).token, "bbb");
  // WA_CLAW_TOKEN takes precedence over OPENCLAW_GATEWAY_TOKEN.
  assert.equal(resolveConfig({ WA_CLAW_TOKEN: "aaa", OPENCLAW_GATEWAY_TOKEN: "bbb" }).token, "aaa");
});
