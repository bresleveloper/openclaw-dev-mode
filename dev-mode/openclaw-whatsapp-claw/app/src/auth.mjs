// Token gate for the WhatsApp Claw panel.
//
// The panel reuses the OpenClaw gateway auth token (OPENCLAW_GATEWAY_TOKEN).
// Auth is mandatory — the panel refuses to start without a token.

import { timingSafeEqual } from "node:crypto";

/** Cookie name the panel uses to carry the token through a browser session. */
export const TOKEN_COOKIE = "wa_claw_token";

/**
 * Constant-time string comparison. Returns false for non-strings, empty
 * strings, or differing byte lengths (length is not treated as secret).
 * @param {unknown} a
 * @param {unknown} b
 * @returns {boolean}
 */
export function tokensMatch(a, b) {
  if (typeof a !== "string" || typeof b !== "string" || a === "" || b === "") {
    return false;
  }
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ba.length !== bb.length) {
    return false;
  }
  return timingSafeEqual(ba, bb);
}

/**
 * Parse a Cookie header into a plain object.
 * @param {string|undefined} header
 * @returns {Record<string, string>}
 */
export function parseCookies(header) {
  /** @type {Record<string, string>} */
  const out = {};
  if (typeof header !== "string" || header === "") {
    return out;
  }
  for (const part of header.split(";")) {
    const eq = part.indexOf("=");
    if (eq < 0) {
      continue;
    }
    const key = part.slice(0, eq).trim();
    if (key) {
      out[key] = decodeURIComponent(part.slice(eq + 1).trim());
    }
  }
  return out;
}

/**
 * Extract a presented token from a request. An "Authorization: Bearer <t>"
 * header takes precedence over the wa_claw_token cookie.
 * @param {{ headers?: Record<string, string|undefined> }} req
 * @returns {string}
 */
export function extractRequestToken(req) {
  const auth = req.headers?.authorization;
  if (typeof auth === "string" && auth.slice(0, 7).toLowerCase() === "bearer ") {
    return auth.slice(7).trim();
  }
  return parseCookies(req.headers?.cookie)[TOKEN_COOKIE] || "";
}

/**
 * Whether a request may access gated resources.
 * @param {{ headers?: Record<string, string|undefined> }} req
 * @param {string} expectedToken
 * @returns {boolean}
 */
export function isAuthorized(req, expectedToken) {
  return tokensMatch(extractRequestToken(req), expectedToken);
}
