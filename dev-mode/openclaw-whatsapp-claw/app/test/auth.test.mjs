import assert from "node:assert/strict";
import test from "node:test";
import {
  tokensMatch,
  parseCookies,
  extractRequestToken,
  isAuthorized,
  TOKEN_COOKIE,
} from "../src/auth.mjs";

test("tokensMatch is true only for identical non-empty strings", () => {
  assert.equal(tokensMatch("abc123", "abc123"), true);
  assert.equal(tokensMatch("abc123", "abc124"), false);
  assert.equal(tokensMatch("abc", "abcd"), false); // length mismatch
  assert.equal(tokensMatch("", ""), false); // empty rejected
  assert.equal(tokensMatch(undefined, "abc"), false);
  assert.equal(tokensMatch("abc", null), false);
});

test("parseCookies splits a Cookie header", () => {
  assert.deepEqual(parseCookies("a=1; b=2"), { a: "1", b: "2" });
  assert.deepEqual(parseCookies(""), {});
  assert.deepEqual(parseCookies(undefined), {});
  assert.equal(parseCookies("wa_claw_token=xy%20z").wa_claw_token, "xy z");
});

test("extractRequestToken prefers the Bearer header, falls back to the cookie", () => {
  assert.equal(extractRequestToken({ headers: { authorization: "Bearer tok-1" } }), "tok-1");
  assert.equal(extractRequestToken({ headers: { authorization: "bearer tok-2" } }), "tok-2");
  assert.equal(extractRequestToken({ headers: { cookie: `${TOKEN_COOKIE}=tok-3` } }), "tok-3");
  assert.equal(extractRequestToken({ headers: {} }), "");
});

test("isAuthorized rejects when the expected token is empty", () => {
  assert.equal(isAuthorized({ headers: {} }, ""), false);
});

test("isAuthorized checks the presented token when one is configured", () => {
  const expected = "the-secret-value";
  assert.equal(
    isAuthorized({ headers: { authorization: "Bearer the-secret-value" } }, expected),
    true,
  );
  assert.equal(isAuthorized({ headers: { authorization: "Bearer nope" } }, expected), false);
  assert.equal(isAuthorized({ headers: {} }, expected), false);
});
