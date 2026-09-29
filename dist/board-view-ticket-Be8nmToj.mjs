import { t as safeEqualSecret } from "./secret-equal-DRsL8lKD.mjs";
import { a as capturePluginRegistryLifecycleEpoch, p as isPluginRegistryLifecycleEpochActive } from "./registry-lifecycle-BhTDZAHB.mjs";
import { createHmac, randomBytes } from "node:crypto";
//#region src/gateway/board-view-ticket.ts
const BOARD_HTTP_PATH_PREFIX = "/__openclaw__/board/";
const BOARD_VIEW_TICKET_TTL_MS = 12e5;
const BOARD_VIEW_TICKET_SCOPE = "board-widget-view";
const BOARD_VIEW_TICKET_MAX_LENGTH = 2048;
const ticketSecret = randomBytes(32);
const ticketAuthorities = /* @__PURE__ */ new WeakMap();
var BoardGatewayUnavailableError = class extends Error {
	constructor() {
		super("dashboard unavailable");
		this.name = "BoardGatewayUnavailableError";
	}
};
function signTicketPayload(payload, secret) {
	return createHmac("sha256", secret).update(`${BOARD_VIEW_TICKET_SCOPE}\0${payload}`).digest("base64url");
}
function isValidClaims(value) {
	if (!value || typeof value !== "object") return false;
	const claims = value;
	return typeof claims.sessionKey === "string" && claims.sessionKey.length > 0 && claims.sessionKey.length <= 512 && (claims.agentId === void 0 || typeof claims.agentId === "string" && claims.agentId.length > 0 && claims.agentId.length <= 64) && typeof claims.name === "string" && claims.name.length > 0 && claims.name.length <= 64 && Number.isSafeInteger(claims.revision) && (claims.revision ?? 0) >= 1 && typeof claims.viewGeneration === "string" && /^[a-f0-9]{32}$/u.test(claims.viewGeneration) && typeof claims.authorityGeneration === "string" && /^[A-Za-z0-9_-]{32}$/u.test(claims.authorityGeneration) && Number.isSafeInteger(claims.expiresAtMs) && typeof claims.nonce === "string" && /^[A-Za-z0-9_-]{32}$/u.test(claims.nonce) && (claims.pluginFrame === void 0 || typeof claims.pluginFrame === "object" && typeof claims.pluginFrame.pluginKind === "string" && claims.pluginFrame.pluginKind.length <= 128 && typeof claims.pluginFrame.scopedHostUrl === "string" && claims.pluginFrame.scopedHostUrl.length <= 1024);
}
function captureBoardViewTicketAuthority(input) {
	let currentContext;
	try {
		currentContext = input.resolveGatewayContext();
	} catch {
		throw new BoardGatewayUnavailableError();
	}
	if (currentContext !== input.gatewayContext || input.gatewayContext.resolveGatewayContext !== input.resolveGatewayContext) throw new BoardGatewayUnavailableError();
	const methodRegistry = input.gatewayContext.getGatewayMethodRegistry?.();
	const pluginRegistryEpoch = input.pluginRegistry ? capturePluginRegistryLifecycleEpoch(input.pluginRegistry) : void 0;
	if (input.pluginRegistry && !pluginRegistryEpoch) throw new BoardGatewayUnavailableError();
	const existing = ticketAuthorities.get(input.gatewayContext);
	if (existing?.resolveGatewayContext === input.resolveGatewayContext && existing.methodRegistry === methodRegistry && existing.pluginRegistry === input.pluginRegistry && existing.pluginRegistryEpoch === pluginRegistryEpoch) return existing;
	const authority = {
		...input,
		generation: randomBytes(24).toString("base64url"),
		...methodRegistry ? { methodRegistry } : {},
		...pluginRegistryEpoch ? { pluginRegistryEpoch } : {}
	};
	ticketAuthorities.set(input.gatewayContext, authority);
	return authority;
}
function requireBoardViewTicketAuthority(claims, gatewayContext) {
	const authority = gatewayContext ? ticketAuthorities.get(gatewayContext) : void 0;
	let currentContext;
	try {
		currentContext = authority?.resolveGatewayContext();
	} catch {
		throw new BoardGatewayUnavailableError();
	}
	if (!gatewayContext || !authority || authority.generation !== claims.authorityGeneration || authority.gatewayContext !== gatewayContext || currentContext !== gatewayContext || gatewayContext.resolveGatewayContext !== authority.resolveGatewayContext || authority.methodRegistry && gatewayContext.getGatewayMethodRegistry?.() !== authority.methodRegistry || authority.pluginRegistry && (!authority.pluginRegistryEpoch || !isPluginRegistryLifecycleEpochActive(authority.pluginRegistry, authority.pluginRegistryEpoch))) throw new BoardGatewayUnavailableError();
	return authority;
}
function createBoardViewTicket(params) {
	const nowMs = params.nowMs ?? Date.now();
	const authority = captureBoardViewTicketAuthority(params.authority);
	const claims = {
		sessionKey: params.sessionKey,
		...params.agentId ? { agentId: params.agentId } : {},
		name: params.name,
		revision: params.revision,
		viewGeneration: params.viewGeneration,
		authorityGeneration: authority.generation,
		expiresAtMs: nowMs + BOARD_VIEW_TICKET_TTL_MS,
		nonce: randomBytes(24).toString("base64url"),
		...params.pluginFrame ? { pluginFrame: params.pluginFrame } : {}
	};
	if (!Number.isSafeInteger(nowMs) || !isValidClaims(claims)) throw new Error("invalid board view ticket binding");
	const payload = Buffer.from(JSON.stringify(claims), "utf8").toString("base64url");
	return {
		ticket: `v1.${payload}.${signTicketPayload(payload, ticketSecret)}`,
		expiresAtMs: claims.expiresAtMs
	};
}
function verifyBoardViewTicket(value, options = {}) {
	const nowMs = options.nowMs ?? Date.now();
	if (!Number.isSafeInteger(nowMs) || value.length > BOARD_VIEW_TICKET_MAX_LENGTH) return;
	const parts = value.split(".");
	if (parts.length !== 3 || parts[0] !== "v1") return;
	const [, payload, signature] = parts;
	if (!payload || !signature) return;
	const expectedSignature = signTicketPayload(payload, ticketSecret);
	if (!safeEqualSecret(signature, expectedSignature)) return;
	let claims;
	try {
		claims = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
	} catch {
		return;
	}
	if (!isValidClaims(claims) || claims.expiresAtMs <= nowMs) return;
	return claims;
}
function resolveAuthorizedBoardViewTicketClaims(value, options = {}) {
	const claims = verifyBoardViewTicket(value, options);
	if (!claims) return;
	try {
		requireBoardViewTicketAuthority(claims, options.gatewayContext);
		return claims;
	} catch {
		return;
	}
}
function buildBoardWidgetFrameUrl(params) {
	return `${BOARD_HTTP_PATH_PREFIX}${encodeURIComponent(params.sessionKey)}/${encodeURIComponent(params.name)}/index.html?bt=${encodeURIComponent(params.ticket)}`;
}
//#endregion
export { createBoardViewTicket as a, verifyBoardViewTicket as c, buildBoardWidgetFrameUrl as i, BOARD_VIEW_TICKET_TTL_MS as n, requireBoardViewTicketAuthority as o, BoardGatewayUnavailableError as r, resolveAuthorizedBoardViewTicketClaims as s, BOARD_HTTP_PATH_PREFIX as t };
