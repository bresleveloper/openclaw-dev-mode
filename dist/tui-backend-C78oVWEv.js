import { i as buildAgentMainSessionKey } from "./session-key-VWT_xzM9.js";
import { t as notifyListeners } from "./listeners-BogSNJ-R.js";
import { n as executeCrestodianOperation } from "./operations-BxcLOxmC.js";
import { i as loadCrestodianOverview, r as formatCrestodianStartupMessage } from "./overview-B2QqbHkB.js";
import { t as buildOnboardingWelcome } from "./onboarding-welcome-B85Jy9U0.js";
import { x as runTui } from "./tui-CkBXI8pt.js";
import { t as CrestodianChatEngine } from "./chat-engine-b8sWmt4G.js";
import { randomUUID } from "node:crypto";
//#region src/crestodian/tui-backend.ts
const CRESTODIAN_AGENT_ID = "crestodian";
const CRESTODIAN_SESSION_KEY = buildAgentMainSessionKey({ agentId: CRESTODIAN_AGENT_ID });
function createEmbeddedModelSetupRuntime(runtime) {
	return {
		...runtime,
		exit: (code) => {
			throw new Error(`embedded model setup exited with code ${String(code)}`);
		}
	};
}
function createChatEngine(opts) {
	return new CrestodianChatEngine({
		yes: opts.yes,
		deps: opts.deps,
		planWithAssistant: opts.planWithAssistant,
		surface: "cli",
		...opts.runChannelSetupWizard ? { runChannelSetupWizard: opts.runChannelSetupWizard } : {}
	});
}
async function loadOverviewForTui(opts) {
	if (opts.deps?.loadOverview) return await opts.deps.loadOverview();
	return await loadCrestodianOverview();
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
function splitModelRef(ref) {
	const trimmed = ref?.trim();
	if (!trimmed) return {};
	const slash = trimmed.indexOf("/");
	if (slash <= 0 || slash >= trimmed.length - 1) return { model: trimmed };
	return {
		provider: trimmed.slice(0, slash),
		model: trimmed.slice(slash + 1)
	};
}
var CrestodianTuiBackend = class {
	constructor(opts, welcome, engine) {
		this.opts = opts;
		this.connection = { url: "crestodian local" };
		this.seq = 0;
		this.handoff = null;
		this.requestExit = null;
		this.messages = [];
		this.engine = engine;
		this.messages.push(message("assistant", welcome));
	}
	setRequestExitHandler(handler) {
		this.requestExit = handler;
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
		this.messages.push(message("user", opts.message));
		this.respond(runId, opts.sessionKey, text);
		return { runId };
	}
	async abortChat() {
		return {
			ok: true,
			aborted: false
		};
	}
	async loadHistory() {
		return {
			sessionId: "crestodian",
			messages: this.messages,
			thinkingLevel: "off",
			verboseLevel: "off"
		};
	}
	async listSessions() {
		const model = splitModelRef((await loadOverviewForTui(this.opts)).defaultModel);
		return {
			ts: Date.now(),
			path: "crestodian",
			count: 1,
			defaults: {
				model: model.model ?? null,
				modelProvider: model.provider ?? null,
				contextTokens: null
			},
			sessions: [{
				key: CRESTODIAN_SESSION_KEY,
				sessionId: "crestodian",
				displayName: "Crestodian",
				updatedAt: Date.now(),
				thinkingLevel: "off",
				verboseLevel: "off",
				model: model.model,
				modelProvider: model.provider
			}]
		};
	}
	async listAgents() {
		return {
			defaultId: CRESTODIAN_AGENT_ID,
			mainKey: "main",
			scope: "per-sender",
			agents: [{
				id: CRESTODIAN_AGENT_ID,
				name: "Crestodian"
			}]
		};
	}
	async patchSession(opts) {
		const model = splitModelRef(typeof opts.model === "string" ? opts.model : void 0);
		return {
			ok: true,
			path: "crestodian",
			key: CRESTODIAN_SESSION_KEY,
			entry: {
				sessionId: "crestodian",
				displayName: "Crestodian",
				updatedAt: Date.now(),
				...model.model ? { model: model.model } : {},
				...model.provider ? { modelProvider: model.provider } : {}
			},
			resolved: {
				modelProvider: model.provider,
				model: model.model
			}
		};
	}
	async resetSession() {
		await this.engine.dispose();
		this.engine = createChatEngine(this.opts);
		const overview = await loadOverviewForTui(this.opts);
		this.messages.splice(0, this.messages.length, message("assistant", formatCrestodianStartupMessage(overview)));
		return { ok: true };
	}
	async createSession(_opts) {
		await this.resetSession();
		return {
			ok: true,
			key: CRESTODIAN_SESSION_KEY,
			entry: {
				sessionId: "crestodian",
				updatedAt: Date.now()
			}
		};
	}
	async getGatewayStatus() {
		return (await loadOverviewForTui(this.opts)).gateway.reachable ? "Gateway reachable" : "Gateway unreachable";
	}
	async listModels() {
		return [];
	}
	async dispose() {
		await this.engine.dispose();
	}
	nextSeq() {
		this.seq += 1;
		return this.seq;
	}
	emit(event, payload) {
		const listener = this.onEvent;
		if (!listener) return;
		notifyListeners([listener], {
			event,
			payload,
			seq: this.nextSeq()
		});
	}
	emitFinal(runId, sessionKey, text) {
		const assistant = message("assistant", text || "Crestodian listened and found nothing to change.");
		this.messages.push(assistant);
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
		try {
			const reply = await this.engine.handle(text);
			if (reply.action === "open-tui" && reply.handoff) {
				this.handoff = reply.handoff;
				queueMicrotask(() => this.requestExit?.());
			} else if (reply.action === "exit") queueMicrotask(() => this.requestExit?.());
			this.emitFinal(runId, sessionKey, reply.text);
		} catch (error) {
			this.emitError(runId, sessionKey, error);
		}
	}
};
async function runCrestodianTui(opts, runtime) {
	let nextInput;
	let welcomeVariant = opts.welcomeVariant;
	for (;;) {
		const initialMessage = nextInput;
		nextInput = void 0;
		const engine = createChatEngine(opts);
		let welcome;
		if (welcomeVariant === "onboarding") welcome = await buildOnboardingWelcome({
			engine,
			...opts.setupWorkspace ? { workspace: opts.setupWorkspace } : {}
		});
		else {
			welcome = formatCrestodianStartupMessage(await loadOverviewForTui(opts));
			engine.noteAssistantMessage(welcome);
		}
		welcomeVariant = void 0;
		const backend = new CrestodianTuiBackend(opts, welcome, engine);
		const runTui$1 = opts.runTui ?? runTui;
		try {
			await runTui$1({
				local: true,
				session: CRESTODIAN_SESSION_KEY,
				historyLimit: 200,
				backend,
				config: {},
				title: "openclaw crestodian",
				...initialMessage ? { message: initialMessage } : {}
			});
		} finally {
			await backend.dispose();
		}
		const handoff = backend.consumeHandoff();
		if (!handoff) return;
		if (handoff.kind === "model-setup") {
			const [{ createClackPrompter }, { runCrestodianModelSetup }] = await Promise.all([import("./clack-prompter-By8x0yay.js"), import("./model-setup-CHhLTk_L.js")]);
			const runModelSetup = opts.runModelSetup ?? runCrestodianModelSetup;
			try {
				const result = await runModelSetup({
					...handoff.workspace ? { workspace: handoff.workspace } : {},
					prompter: createClackPrompter(),
					runtime: createEmbeddedModelSetupRuntime(runtime)
				});
				runtime.log(result.model ? `Default model configured: ${result.model}` : "Model provider setup finished without a default model.");
			} catch (error) {
				const { WizardCancelledError } = await import("./prompts-vF5K3BVp.js");
				if (!(error instanceof WizardCancelledError)) runtime.error(`Model provider setup failed: ${error instanceof Error ? error.message : String(error)}`);
			}
			continue;
		}
		nextInput = (await executeCrestodianOperation(handoff, runtime, {
			approved: true,
			deps: opts.deps
		})).nextInput;
		if (!nextInput?.trim()) return;
	}
}
//#endregion
export { runCrestodianTui };
