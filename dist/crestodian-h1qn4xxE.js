import { r as defaultRuntime } from "./runtime-Bz6o617W.js";
import { B as validateCrestodianSetupActivateParams, V as validateCrestodianSetupDetectParams, z as validateCrestodianChatParams } from "./src-CToKmqGn.js";
import { r as formatCrestodianStartupMessage } from "./overview-B2QqbHkB.js";
import { t as buildOnboardingWelcome } from "./onboarding-welcome-B85Jy9U0.js";
import { t as CrestodianChatEngine } from "./chat-engine-b8sWmt4G.js";
import { t as assertValidParams } from "./validation-BlJXIosl.js";
//#region src/gateway/server-methods/crestodian.ts
const MAX_CRESTODIAN_SESSIONS = 8;
async function evictOldestSession(sessions) {
	if (sessions.size < MAX_CRESTODIAN_SESSIONS) return;
	let oldestKey;
	let oldestAt = Number.POSITIVE_INFINITY;
	for (const [key, session] of sessions) if (session.lastUsedAt < oldestAt) {
		oldestAt = session.lastUsedAt;
		oldestKey = key;
	}
	if (oldestKey !== void 0) {
		await sessions.get(oldestKey)?.engine.dispose();
		sessions.delete(oldestKey);
	}
}
const crestodianHandlers = {
	/** Structured onboarding: list reusable AI access on this host. */
	"crestodian.setup.detect": async ({ params, respond }) => {
		if (!assertValidParams(params, validateCrestodianSetupDetectParams, "crestodian.setup.detect", respond)) return;
		const { detectSetupInference } = await import("./setup-inference-C8ipehT_.js");
		respond(true, await detectSetupInference(), void 0);
	},
	/**
	* Structured onboarding: live-test one candidate and persist it on success.
	* Serialized per gateway process implicitly by the app driving one attempt
	* at a time; a failed attempt never mutates config (see setup-inference.ts).
	*/
	"crestodian.setup.activate": async ({ params, respond }) => {
		if (!assertValidParams(params, validateCrestodianSetupActivateParams, "crestodian.setup.activate", respond)) return;
		const { activateSetupInference } = await import("./setup-inference-C8ipehT_.js");
		const runtime = {
			...defaultRuntime,
			exit: (code) => {
				throw new Error(`setup step exited with code ${String(code)}`);
			}
		};
		respond(true, await activateSetupInference({
			kind: params.kind,
			...params.authChoice !== void 0 ? { authChoice: params.authChoice } : {},
			...params.apiKey !== void 0 ? { apiKey: params.apiKey } : {},
			...params.workspace !== void 0 ? { workspace: params.workspace } : {},
			surface: "gateway",
			runtime
		}), void 0);
	},
	"crestodian.chat": async ({ params, respond, context }) => {
		if (!assertValidParams(params, validateCrestodianChatParams, "crestodian.chat", respond)) return;
		const sessions = context.crestodianSessions;
		const sessionId = params.sessionId;
		if (params.reset) {
			await sessions.get(sessionId)?.engine.dispose();
			sessions.delete(sessionId);
		}
		let session = sessions.get(sessionId);
		if (!session) {
			const engine = new CrestodianChatEngine({ surface: "gateway" });
			let welcome;
			if (params.welcomeVariant === "onboarding") welcome = await buildOnboardingWelcome({ engine });
			else {
				welcome = formatCrestodianStartupMessage(await engine.loadOverview());
				engine.noteAssistantMessage(welcome);
			}
			await evictOldestSession(sessions);
			session = {
				engine,
				welcome,
				lastUsedAt: Date.now()
			};
			sessions.set(sessionId, session);
			if (params.message === void 0 || !params.message.trim()) {
				respond(true, {
					sessionId,
					reply: session.welcome,
					action: "none"
				}, void 0);
				return;
			}
		}
		session.lastUsedAt = Date.now();
		if (params.message === void 0 || !params.message.trim()) {
			respond(true, {
				sessionId,
				reply: session.welcome,
				action: "none"
			}, void 0);
			return;
		}
		const reply = await session.engine.handle(params.message);
		const action = reply.action === "open-tui" ? "open-agent" : reply.action;
		respond(true, {
			sessionId,
			reply: reply.text || (action === "open-agent" ? "Setup here is done — continue with your agent." : "Nothing to change."),
			action,
			...reply.sensitive === true ? { sensitive: true } : {}
		}, void 0);
	}
};
//#endregion
export { crestodianHandlers };
