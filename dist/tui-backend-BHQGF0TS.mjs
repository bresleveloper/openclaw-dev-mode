import { t as notifyListeners } from "./listeners-BogSNJ-R.mjs";
import { n as buildAgentMainSessionKey } from "./session-key-CmZ4o9-l.mjs";
import { r as agentSessionKeysMatchByRequestKey } from "./session-key-C09ow4h0.mjs";
import { y as SYSTEM_AGENT_ID } from "./agent-database-admission-dWNS6Rcs.mjs";
import { f as loadOverviewForOperation } from "./operations-execution-helpers-BuNbimSG.mjs";
import { t as executeSystemAgentOperation } from "./operations-CnmxyhD5.mjs";
import { n as isSystemAgentInferenceUnavailableError, t as SystemAgentInferenceUnavailableError } from "./inference-error-D_m-vFb8.mjs";
import { r as formatSystemAgentStartupMessage } from "./overview-BZs3uZvH.mjs";
import { o as resolveSystemAgentVerifiedInferenceState } from "./verified-inference-BLAb2uCx.mjs";
import { t as resolveModelRefOverride } from "./model-ref-override-smHu15tb.mjs";
import { n as SystemAgentChatEngine, t as buildOnboardingWelcome } from "./onboarding-welcome-B3V2oAoR.mjs";
import { randomUUID } from "node:crypto";
//#region src/system-agent/tui-backend.ts
async function loadHostedSetupForTui() {
	const [{ createClackPrompter }, hostedSetup] = await Promise.all([import("./clack-prompter-DJxqUWif.mjs"), import("./hosted-setup.runtime.js")]);
	return {
		createClackPrompter,
		hostedSetup
	};
}
const SYSTEM_AGENT_SESSION_KEY = buildAgentMainSessionKey({ agentId: SYSTEM_AGENT_ID });
const SYSTEM_AGENT_HISTORY_LIMIT = 200;
function createChatEngine(opts) {
	return new SystemAgentChatEngine({
		yes: opts.yes,
		deps: opts.deps,
		surface: "cli",
		verifiedInference: opts.verifiedInference
	});
}
function message(role, text) {
	return {
		role,
		content: [{
			type: "text",
			text
		}],
		timestamp: Date.now()
	};
}
var SystemAgentTuiBackend = class {
	constructor(opts, welcome, engine, route) {
		this.opts = opts;
		this.route = route;
		this.connection = { url: "openclaw local" };
		this.seq = 0;
		this.engineDisposal = null;
		this.inferenceFailure = null;
		this.handoff = null;
		this.requestExit = null;
		this.responseQueue = Promise.resolve();
		this.messages = [];
		this.engine = engine;
		this.appendMessage(message("assistant", welcome));
	}
	setRequestExitHandler(handler) {
		this.requestExit = handler;
		if (this.inferenceFailure) queueMicrotask(handler);
	}
	consumeHandoff() {
		const handoff = this.handoff;
		this.handoff = null;
		return handoff;
	}
	start() {
		queueMicrotask(() => {
			this.onConnected?.();
		});
	}
	stop() {}
	async sendChat(opts) {
		const runId = opts.runId ?? randomUUID();
		const text = opts.message.trim();
		this.appendMessage(message("user", opts.message));
		const response = this.responseQueue.then(() => this.respond(runId, opts.sessionKey, text));
		this.responseQueue = response.catch(() => void 0);
		return { runId };
	}
	async abortChat() {
		return {
			ok: true,
			aborted: false
		};
	}
	async loadHistory(opts) {
		const limit = Math.min(opts.limit ?? SYSTEM_AGENT_HISTORY_LIMIT, SYSTEM_AGENT_HISTORY_LIMIT);
		return {
			sessionId: "openclaw",
			messages: limit > 0 ? this.messages.slice(-limit) : [],
			thinkingLevel: this.route.thinkingLevel,
			verboseLevel: "off"
		};
	}
	async listSessions() {
		return {
			ts: Date.now(),
			path: "openclaw",
			count: 1,
			defaults: {
				model: this.route.model ?? null,
				modelProvider: this.route.modelProvider ?? null,
				contextTokens: null
			},
			sessions: [{
				key: SYSTEM_AGENT_SESSION_KEY,
				sessionId: "openclaw",
				displayName: "OpenClaw",
				updatedAt: Date.now(),
				thinkingLevel: this.route.thinkingLevel,
				verboseLevel: "off",
				model: this.route.model,
				modelProvider: this.route.modelProvider
			}]
		};
	}
	async describeSession(opts) {
		const { sessions, defaults } = await this.listSessions();
		return {
			session: sessions.find((row) => agentSessionKeysMatchByRequestKey(row.key, opts.sessionKey)) ?? null,
			defaults
		};
	}
	async listAgents() {
		return {
			defaultId: SYSTEM_AGENT_ID,
			mainKey: "main",
			scope: "per-sender",
			agents: [{
				id: SYSTEM_AGENT_ID,
				kind: "system",
				name: "OpenClaw"
			}]
		};
	}
	async patchSession(opts) {
		if (opts.model !== void 0) throw new Error("OpenClaw cannot change the model inside its active verified session. Exit and run `openclaw onboard`, then start OpenClaw again.");
		return {
			ok: true,
			path: "openclaw",
			key: SYSTEM_AGENT_SESSION_KEY,
			entry: {
				sessionId: "openclaw",
				displayName: "OpenClaw",
				updatedAt: Date.now()
			},
			resolved: {}
		};
	}
	async resetSession() {
		if (this.inferenceFailure) throw this.inferenceFailure;
		await this.disposeEngine();
		this.engine = createChatEngine(this.opts);
		this.engineDisposal = null;
		const overview = await loadOverviewForOperation(this.opts.deps);
		this.messages.length = 0;
		this.appendMessage(message("assistant", formatSystemAgentStartupMessage(overview)));
		return { ok: true };
	}
	async createSession(_opts) {
		await this.resetSession();
		return {
			ok: true,
			key: SYSTEM_AGENT_SESSION_KEY,
			entry: {
				sessionId: "openclaw",
				updatedAt: Date.now()
			}
		};
	}
	async getGatewayStatus() {
		return (await loadOverviewForOperation(this.opts.deps)).gateway.reachable ? "Gateway reachable" : "Gateway unreachable";
	}
	async listModels() {
		return [];
	}
	async dispose() {
		try {
			await this.disposeEngine();
		} catch (error) {
			if (!this.inferenceFailure) throw error;
		}
	}
	disposeEngine() {
		this.engineDisposal ??= this.engine.dispose();
		return this.engineDisposal;
	}
	appendMessage(entry) {
		this.messages.push(entry);
		if (this.messages.length > SYSTEM_AGENT_HISTORY_LIMIT) this.messages.splice(0, this.messages.length - SYSTEM_AGENT_HISTORY_LIMIT);
	}
	emit(event, payload) {
		const listener = this.onEvent;
		if (!listener) return;
		notifyListeners([listener], {
			event,
			payload,
			seq: ++this.seq
		});
	}
	emitFinal(runId, sessionKey, text) {
		const assistant = message("assistant", text || "OpenClaw listened and found nothing to change.");
		this.appendMessage(assistant);
		this.emit("chat", {
			runId,
			sessionKey,
			state: "final",
			message: assistant
		});
	}
	emitError(runId, sessionKey, error) {
		const errorMessage = error instanceof Error ? error.message : String(error);
		this.emit("chat", {
			runId,
			sessionKey,
			state: "error",
			errorMessage
		});
	}
	async respond(runId, sessionKey, text) {
		if (this.inferenceFailure) {
			this.emitError(runId, sessionKey, this.inferenceFailure);
			queueMicrotask(() => this.requestExit?.());
			return;
		}
		try {
			const reply = await this.engine.handle(text);
			if ((reply.action === "open-tui" || reply.action === "open-setup") && reply.handoff) {
				this.handoff = reply.handoff;
				queueMicrotask(() => this.requestExit?.());
			} else if (reply.action === "exit") queueMicrotask(() => this.requestExit?.());
			this.emitFinal(runId, sessionKey, reply.text);
		} catch (error) {
			if (isSystemAgentInferenceUnavailableError(error)) {
				this.inferenceFailure = error;
				this.handoff = null;
				try {
					await this.disposeEngine();
				} catch {}
				this.emitError(runId, sessionKey, error);
				queueMicrotask(() => this.requestExit?.());
				return;
			}
			this.emitError(runId, sessionKey, error);
		}
	}
};
async function runSetupHandoff(handoff, opts, runtime) {
	if (handoff.target !== "channels" && handoff.target !== "search" && handoff.target !== "gateway") {
		runtime.error("Setup cannot replace the inference route powering OpenClaw. Exit and run `openclaw onboard`, then start OpenClaw again.");
		return;
	}
	const beforePersistentEffect = async () => {
		const binding = opts?.verifiedInference;
		if (!binding) throw new SystemAgentInferenceUnavailableError("conversation");
		try {
			const { resolvePersistentApplyInference } = await import("./system-agent/setup-inference.js");
			if (await resolvePersistentApplyInference({
				binding,
				runtime,
				deps: opts.deps
			})) return;
		} catch (error) {
			if (isSystemAgentInferenceUnavailableError(error)) throw error;
			throw new SystemAgentInferenceUnavailableError("conversation", [error]);
		}
		throw new SystemAgentInferenceUnavailableError("conversation");
	};
	if (handoff.target === "gateway" || handoff.target === "search") {
		const run = handoff.target === "gateway" ? opts.runGatewaySetupHandoff : opts.runSearchSetupHandoff;
		if (run) await run(runtime, beforePersistentEffect);
		else {
			const { createClackPrompter, hostedSetup } = await loadHostedSetupForTui();
			await (handoff.target === "gateway" ? hostedSetup.runHostedGatewaySetup : hostedSetup.runHostedSearchSetup)(createClackPrompter(), beforePersistentEffect, runtime);
		}
		if (handoff.target === "gateway") runtime.log("Done — gateway settings saved. Run `openclaw gateway restart` to apply them.");
		return;
	}
	await (opts.runChannelsAdd ?? (await import("./add-D7O0ATed.mjs")).channelsAddCommand)(handoff.channel ? { channel: handoff.channel } : {}, runtime, {
		hasFlags: false,
		beforePersistentEffect
	});
}
async function runSystemAgentTui(opts, runtime) {
	const binding = opts?.verifiedInference;
	if (!binding) throw new SystemAgentInferenceUnavailableError("conversation");
	const boundOpts = {
		...opts,
		verifiedInference: binding
	};
	let nextInput;
	let welcomeVariant = boundOpts.welcomeVariant;
	for (;;) {
		const route = await requireTuiVerifiedInference(boundOpts);
		const initialMessage = nextInput;
		const engine = createChatEngine(boundOpts);
		let welcome;
		if (welcomeVariant === "onboarding") welcome = (await buildOnboardingWelcome({
			engine,
			localRecovery: true,
			...boundOpts.setupWorkspace ? { workspace: boundOpts.setupWorkspace } : {},
			...boundOpts.setupAgentName ? { agentName: boundOpts.setupAgentName } : {}
		})).text;
		else {
			welcome = formatSystemAgentStartupMessage(await loadOverviewForOperation(boundOpts.deps));
			engine.noteAssistantMessage(welcome);
		}
		welcomeVariant = void 0;
		const backend = new SystemAgentTuiBackend(boundOpts, welcome, engine, route);
		const runTui = boundOpts.runTui ?? (await import("./tui-DG2iL4qh.mjs")).runTui;
		try {
			await runTui({
				local: true,
				session: SYSTEM_AGENT_SESSION_KEY,
				historyLimit: SYSTEM_AGENT_HISTORY_LIMIT,
				backend,
				config: {},
				title: "openclaw setup",
				...initialMessage ? { message: initialMessage } : {}
			});
		} finally {
			await backend.dispose();
		}
		const handoff = backend.consumeHandoff();
		if (!handoff) return;
		if (handoff.kind === "model-setup") {
			runtime.error("OpenClaw cannot replace its active inference route. Run `openclaw onboard` outside this session, then start OpenClaw again.");
			return;
		}
		if (handoff.kind === "open-setup") {
			await runSetupHandoff(handoff, boundOpts, runtime);
			return;
		}
		const result = await executeSystemAgentOperation(handoff, runtime, {
			approved: true,
			deps: boundOpts.deps
		});
		nextInput = result.nextInput;
		if (!nextInput?.trim() && !result.returnToShell) return;
	}
}
async function requireTuiVerifiedInference(opts) {
	const binding = opts?.verifiedInference;
	if (!binding) throw new SystemAgentInferenceUnavailableError("conversation");
	try {
		const verified = await resolveSystemAgentVerifiedInferenceState(binding, opts.deps);
		if (verified) {
			const { config, route } = verified;
			const [{ getPreparedModelCatalogSnapshot }, { resolveThinkingDefault }] = await Promise.all([import("./prepared-model-catalog-sffagvF9.mjs"), import("./model-thinking-default-BjPpFvLh.mjs")]);
			const catalog = getPreparedModelCatalogSnapshot({
				config,
				agentId: route.agentId,
				agentDir: route.agentDir,
				readOnly: true
			})?.entries;
			const model = resolveModelRefOverride(route.modelLabel);
			return {
				model: model.model,
				modelProvider: model.provider,
				thinkingLevel: resolveThinkingDefault({
					cfg: route.runConfig,
					agentId: route.agentId,
					provider: route.provider,
					model: route.model,
					catalog
				})
			};
		}
	} catch (error) {
		throw new SystemAgentInferenceUnavailableError("conversation", [error]);
	}
	throw new SystemAgentInferenceUnavailableError("conversation");
}
//#endregion
export { runSystemAgentTui };
