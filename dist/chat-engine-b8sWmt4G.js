import { v as resolveStateDir } from "./paths-BMBAvkNf.js";
import { i as buildAgentMainSessionKey } from "./session-key-VWT_xzM9.js";
import { t as isSensitiveConfigPath } from "./sensitive-paths-DYIyGcFS.js";
import { a as parseCrestodianOperation, i as isPersistentCrestodianOperation, n as executeCrestodianOperation, t as describeCrestodianPersistentOperation } from "./operations-BxcLOxmC.js";
import { i as loadCrestodianOverview } from "./overview-B2QqbHkB.js";
import { t as approvalQuestion } from "./dialogue-BhyR5hvd.js";
import { n as classifyCrestodianApprovalText } from "./approval-intent-kLBVl8-j.js";
import { r as selectCrestodianLocalPlannerBackends } from "./assistant-backends-C96KpxKv.js";
import { t as CRESTODIAN_AGENT_SYSTEM_PROMPT } from "./assistant-prompts-C2-exuV_.js";
import { t as WizardSession } from "./session-Db7bzmh4.js";
import path from "node:path";
import fs from "node:fs/promises";
import { randomUUID } from "node:crypto";
//#region src/crestodian/agent-turn.ts
/**
* Crestodian is a real agent: same loop, session transcript, and tool pipeline
* as regular agents — restricted to the single ring-zero `crestodian` tool.
* Embedded runtimes enforce that restriction with toolsAllow; CLI harnesses
* (claude-cli, gemini-cli) cannot, so they get the tool over a dedicated stdio
* MCP server that replaces the normal bundle MCP surface for the run. Turns
* share one persistent session so the conversation has genuine multi-turn
* memory. When no loop-capable backend exists, the caller falls back to the
* single-turn planner.
*/
const CRESTODIAN_AGENT_ID = "crestodian";
const AGENT_TURN_TIMEOUT_MS = 12e4;
function createCrestodianAgentSession() {
	return {
		sessionId: `crestodian-${randomUUID()}`,
		proposalRef: {}
	};
}
function extractRunText(result) {
	return result.meta?.finalAssistantVisibleText ?? result.meta?.finalAssistantRawText ?? result.payloads?.map((payload) => payload.text?.trim()).filter(Boolean).join("\n");
}
async function ensureCrestodianDirs(sessionId) {
	const base = path.join(resolveStateDir(), "crestodian");
	const workspaceDir = path.join(base, "workspace");
	await fs.mkdir(workspaceDir, { recursive: true });
	await fs.mkdir(path.join(base, "sessions"), { recursive: true });
	return {
		workspaceDir,
		sessionFile: path.join(base, "sessions", `${sessionId}.jsonl`)
	};
}
async function cleanupCrestodianAgentSession(session) {
	const sessionFile = path.join(resolveStateDir(), "crestodian", "sessions", `${session.sessionId}.jsonl`);
	await fs.rm(sessionFile, { force: true });
}
async function planCrestodianAgentTurn(params, deps, workspaceDir) {
	const configuredModel = params.overview.defaultModel;
	if (configuredModel) {
		const snapshot = await (deps.readConfigFileSnapshot ?? (await import("./config/config.js")).readConfigFileSnapshot)();
		const runConfig = snapshot.runtimeConfig ?? snapshot.config ?? {};
		const { isCliProvider, resolveDefaultModelForAgent } = await import("./model-selection-B-Q3YQMF.js");
		const ref = resolveDefaultModelForAgent({
			cfg: runConfig,
			agentId: CRESTODIAN_AGENT_ID
		});
		if (isCliProvider(ref.provider, runConfig)) return {
			runner: "cli",
			runConfig,
			modelLabel: configuredModel,
			provider: ref.provider,
			model: ref.model
		};
		return {
			runner: "embedded",
			runConfig,
			modelLabel: configuredModel
		};
	}
	const backend = selectCrestodianLocalPlannerBackends(params.overview)[0];
	if (!backend) return null;
	const base = {
		runConfig: backend.buildConfig(workspaceDir),
		modelLabel: backend.label,
		provider: backend.provider,
		model: backend.model
	};
	return backend.runner === "cli" ? {
		runner: "cli",
		...base
	} : {
		runner: "embedded",
		agentHarnessId: "codex",
		...base
	};
}
/**
* CLI harnesses run the crestodian tool in a stdio MCP subprocess, so the
* in-process proposalRef/directiveRef cannot be shared with the host. Mirror
* the tool's transitions from the harness tool events instead: a denial
* registers the exact-operation hash, a mismatch voids it, an executed
* mutation consumes it, and directive actions replay the interactive handoff —
* same lifecycle as crestodian-tool.ts enforces.
*/
async function mirrorCrestodianToolStateFromEvents(params) {
	const [{ onAgentEvent }, { extractToolResultText }, { resolveCrestodianProposalTransition, resolveCrestodianDirectiveTransition }] = await Promise.all([
		import("./agent-events-CjfpXsS3.js"),
		import("./embedded-agent-subscribe.tools-C3u-wAC2.js"),
		import("./crestodian-tool-BG8wQ6l7.js")
	]);
	return onAgentEvent((evt) => {
		if (evt.runId !== params.runId || evt.stream !== "tool" || evt.data.phase !== "result") return;
		const name = typeof evt.data.name === "string" ? evt.data.name : "";
		if (name !== "crestodian" && !name.endsWith("__crestodian")) return;
		const args = typeof evt.data.args === "object" && evt.data.args !== null ? evt.data.args : {};
		const resultText = extractToolResultText(evt.data.result) ?? "";
		const transition = resolveCrestodianProposalTransition({
			args,
			resultText
		});
		if (transition) params.proposalRef.current = transition.proposal;
		const directive = resolveCrestodianDirectiveTransition({
			args,
			resultText
		});
		if (directive) params.directiveRef.current = directive;
	});
}
/**
* Run one Crestodian turn through the embedded agent loop. Returns null when
* no loop-capable backend is available or the run fails, so the caller can
* degrade to the planner.
*/
async function runCrestodianAgentTurnWithDeps(params, deps = {}) {
	const { workspaceDir, sessionFile } = await ensureCrestodianDirs(params.session.sessionId);
	const plan = await planCrestodianAgentTurn(params, deps, workspaceDir);
	if (!plan) return null;
	const runId = `crestodian-turn-${randomUUID()}`;
	const shared = {
		sessionId: params.session.sessionId,
		sessionKey: buildAgentMainSessionKey({ agentId: CRESTODIAN_AGENT_ID }),
		agentId: CRESTODIAN_AGENT_ID,
		trigger: "manual",
		sessionFile,
		workspaceDir,
		config: plan.runConfig,
		prompt: params.input,
		timeoutMs: AGENT_TURN_TIMEOUT_MS,
		runId,
		messageChannel: "crestodian",
		messageProvider: "crestodian"
	};
	const directiveRef = {};
	const crestodianTool = {
		surface: params.surface,
		approvalArmed: params.approvalArmed,
		proposalRef: params.session.proposalRef,
		directiveRef
	};
	try {
		let result;
		if (plan.runner === "cli") {
			const runCli = deps.runCliAgent ?? (await import("./cli-runner-BK2Mhugs.js")).runCliAgent;
			const stopToolStateMirror = await mirrorCrestodianToolStateFromEvents({
				runId,
				proposalRef: params.session.proposalRef,
				directiveRef
			});
			try {
				result = await runCli({
					...shared,
					provider: plan.provider,
					model: plan.model,
					extraSystemPrompt: CRESTODIAN_AGENT_SYSTEM_PROMPT,
					extraSystemPromptStatic: CRESTODIAN_AGENT_SYSTEM_PROMPT,
					crestodianTool,
					...params.session.cliSessionId ? { cliSessionId: params.session.cliSessionId } : {},
					cleanupCliLiveSessionOnRunEnd: true
				});
			} finally {
				stopToolStateMirror();
			}
			const agentMeta = result.meta?.agentMeta;
			if (agentMeta?.clearCliSessionBinding) delete params.session.cliSessionId;
			else if (agentMeta?.cliSessionBinding?.sessionId) params.session.cliSessionId = agentMeta.cliSessionBinding.sessionId;
		} else result = await (deps.runEmbeddedAgent ?? (await import("./embedded-agent-75K82y9l.js")).runEmbeddedAgent)({
			...shared,
			extraSystemPrompt: CRESTODIAN_AGENT_SYSTEM_PROMPT,
			toolsAllow: ["crestodian"],
			crestodianTool,
			disableMessageTool: true,
			...plan.provider ? { provider: plan.provider } : {},
			...plan.model ? { model: plan.model } : {},
			...plan.agentHarnessId ? {
				agentHarnessId: plan.agentHarnessId,
				cleanupBundleMcpOnRunEnd: true
			} : {}
		});
		const text = extractRunText(result)?.trim();
		if (!text) return null;
		return {
			text,
			modelLabel: plan.modelLabel,
			...directiveRef.current ? { directive: directiveRef.current } : {}
		};
	} catch {
		return null;
	}
}
const runCrestodianAgentTurn = (params) => runCrestodianAgentTurnWithDeps(params);
//#endregion
//#region src/crestodian/chat-engine.ts
function createHostedWizardRuntime(runtime) {
	return {
		...runtime,
		exit: (code) => {
			throw new Error(`hosted wizard exited with code ${String(code)}`);
		}
	};
}
function createCaptureRuntime() {
	const lines = [];
	return {
		log: (...args) => lines.push(args.join(" ")),
		error: (...args) => lines.push(args.join(" ")),
		exit: (code) => {
			throw new Error(`Crestodian operation exited with code ${String(code)}`);
		},
		read: () => lines.join("\n").trim()
	};
}
function defaultChannelSetupWizardRunner(channel) {
	return async (prompter) => {
		const [{ readSetupConfigFileSnapshot, writeWizardConfigFile }, { createChannelOnboardingPostWriteHookCollector, runCollectedChannelOnboardingPostWriteHooks, setupChannels }] = await Promise.all([import("./setup.shared-BQEP9sD0.js"), import("./onboard-channels-sOgXPP97.js")]);
		const snapshot = await readSetupConfigFileSnapshot();
		const baseConfig = snapshot.valid ? snapshot.sourceConfig ?? snapshot.config : {};
		const { defaultRuntime } = await import("./runtime-Dvam4E8I.js");
		const runtime = createHostedWizardRuntime(defaultRuntime);
		const postWriteHooks = createChannelOnboardingPostWriteHookCollector();
		const committedConfig = await writeWizardConfigFile(await setupChannels(baseConfig, runtime, prompter, {
			initialSelection: [channel],
			forceAllowFromChannels: [channel],
			allowIMessageInstall: true,
			allowSignalInstall: true,
			deferStatusUntilSelection: true,
			quickstartDefaults: true,
			skipDmPolicyPrompt: true,
			skipConfirm: true,
			onPostWriteHook: (hook) => postWriteHooks.collect(hook)
		}), { allowConfigSizeDrop: false });
		await runCollectedChannelOnboardingPostWriteHooks({
			hooks: postWriteHooks.drain(),
			cfg: committedConfig,
			runtime
		});
	};
}
function defaultModelSetupWizardRunner(workspace) {
	return async (prompter) => {
		const [{ runCrestodianModelSetup }, { defaultRuntime }] = await Promise.all([import("./model-setup-CHhLTk_L.js"), import("./runtime-Dvam4E8I.js")]);
		await runCrestodianModelSetup({
			workspace,
			prompter,
			runtime: createHostedWizardRuntime(defaultRuntime)
		});
	};
}
function formatWizardOptions(step) {
	return (step.options ?? []).map((option, index) => {
		const hint = option.hint ? ` — ${option.hint}` : "";
		return `${index + 1}. ${option.label}${hint}`;
	});
}
function renderWizardStep(step) {
	const lines = [];
	if (step.title) lines.push(`**${step.title}**`);
	if (step.message) lines.push(step.message);
	switch (step.type) {
		case "select":
			lines.push(...formatWizardOptions(step), "Reply with a number.");
			break;
		case "multiselect":
			lines.push(...formatWizardOptions(step), "Reply with numbers (e.g. 1,3) or `none`.");
			break;
		case "confirm":
			lines.push("Reply yes or no.");
			break;
		case "text":
			if (step.placeholder) lines.push(`(e.g. ${step.placeholder})`);
			lines.push("Type your answer.");
			break;
		default: break;
	}
	lines.push("Say `cancel` to stop this setup.");
	return lines.filter(Boolean).join("\n");
}
/** Map a chat reply to a wizard step answer; null means "could not parse". */
function parseWizardAnswer(step, text) {
	const trimmed = text.trim();
	if (step.type === "confirm") {
		const intent = classifyCrestodianApprovalText(trimmed);
		if (intent === "approve") return { value: true };
		if (intent === "decline") return { value: false };
		return null;
	}
	if (step.type === "text") return { value: trimmed };
	const options = step.options ?? [];
	const matchOption = (token) => {
		const index = Number(token);
		if (Number.isInteger(index) && index >= 1 && index <= options.length) return options[index - 1];
		const lower = token.toLowerCase();
		return options.find((option) => option.label.toLowerCase() === lower || typeof option.value === "string" && option.value.toLowerCase() === lower);
	};
	if (step.type === "select") {
		const option = matchOption(trimmed);
		return option ? { value: option.value } : null;
	}
	if (step.type === "multiselect") {
		if (/^none$/i.test(trimmed)) return { value: [] };
		const tokens = trimmed.split(/[\s,]+/).map((token) => token.trim()).filter(Boolean);
		const values = [];
		for (const token of tokens) {
			const option = matchOption(token);
			if (!option) return null;
			values.push(option.value);
		}
		return { value: values };
	}
	return { value: step.type === "action" ? true : void 0 };
}
function formatOperationError(error) {
	return `That did not go through: ${error instanceof Error ? error.message : String(error)}`;
}
/**
* A typed `config set` against a sensitive path carries a raw secret; the
* stored history feeds future planner prompts (and CLI-harness transcripts),
* so the value is masked the same way hosted-wizard secrets are.
*/
function redactSensitiveCommandText(text) {
	const operation = parseCrestodianOperation(text);
	if (operation.kind === "config-set" && isSensitiveConfigPath(operation.path)) return `config set ${operation.path} <redacted secret>`;
	return text;
}
/**
* Hard ceiling for one AI turn. Planner backends carry their own timeouts,
* but a wedged local CLI (heavy user config, hung app-server) must never
* freeze the conversation — after this we answer deterministically.
*/
const ASSISTANT_TURN_DEADLINE_MS = 6e4;
const AGENT_TURN_DEADLINE_MS = 18e4;
async function withDeadline(work, fallback, deadlineMs) {
	let timer;
	const deadline = new Promise((resolve) => {
		timer = setTimeout(() => resolve(fallback), deadlineMs);
		timer.unref?.();
	});
	try {
		return await Promise.race([work, deadline]);
	} finally {
		clearTimeout(timer);
	}
}
var CrestodianChatEngine = class {
	constructor(opts = {}) {
		this.opts = opts;
		this.pending = null;
		this.wizardBridge = null;
		this.history = [];
		this.agentSession = createCrestodianAgentSession();
		this.turnQueue = Promise.resolve();
	}
	/**
	* Seed a proposed operation that the user's next approval will apply. Used
	* by first-run onboarding: the welcome message states the plan, the user
	* just agrees.
	*/
	propose(operation) {
		this.clearPendingProposals();
		this.pending = operation;
		return describeCrestodianPersistentOperation(operation);
	}
	hasPendingProposal() {
		return this.pending !== null;
	}
	/** Record a host-rendered assistant message (welcome) so AI turns see it. */
	noteAssistantMessage(text) {
		this.history.push({
			role: "assistant",
			text
		});
	}
	async dispose() {
		this.wizardBridge?.session.cancel();
		this.wizardBridge = null;
		await cleanupCrestodianAgentSession(this.agentSession);
	}
	async handle(text) {
		const turn = this.turnQueue.then(() => this.handleSerialized(text));
		this.turnQueue = turn.catch(() => void 0);
		return await turn;
	}
	async handleSerialized(text) {
		const sensitiveTurn = this.wizardBridge?.step?.sensitive === true;
		const reply = await this.resolveTurn(text);
		this.history.push({
			role: "user",
			text: sensitiveTurn ? "<redacted secret>" : redactSensitiveCommandText(text)
		});
		if (reply.text) this.history.push({
			role: "assistant",
			text: reply.text
		});
		return {
			...reply,
			...this.wizardBridge?.step?.sensitive === true ? { sensitive: true } : {}
		};
	}
	async resolveTurn(text) {
		if (this.wizardBridge) return {
			text: await this.resolveWizardBridgeReply(text),
			action: "none"
		};
		const trimmed = text.trim();
		if (!trimmed) return {
			text: "Tiny claw tap: tell me what you want — setup, repair, channels, anything config.",
			action: "none"
		};
		if (/^(quit|exit)$/i.test(trimmed)) return {
			text: "Crestodian retracts into shell. Bye.",
			action: "exit"
		};
		const typed = parseCrestodianOperation(text);
		if (typed.kind === "config-set" && isSensitiveConfigPath(typed.path)) return await this.runOperation(typed, void 0);
		const intent = await this.classifyApprovalIntent(text);
		if (this.pending) {
			if (intent === "approve") return await this.applyPendingProposal();
			if (intent === "decline") {
				const skippedModelSetup = this.pending.kind === "model-setup";
				this.clearPendingProposals();
				return {
					text: skippedModelSetup ? "Skipped. Crestodian remains available in deterministic mode; say `configure model provider` when you are ready." : "Skipped. No barnacles on config today.",
					action: "none"
				};
			}
		}
		if (intent === "decline") this.agentSession.proposalRef.current = void 0;
		return await this.resolveAssistantTurn(text, intent === "approve");
	}
	async classifyApprovalIntent(text) {
		if (!(this.pending !== null || this.agentSession.proposalRef.current !== void 0)) return "other";
		return await (this.opts.classifyApproval ?? (await import("./approval-intent-B0faT7oY.js")).classifyCrestodianApprovalIntent)({
			message: text,
			...this.pending ? { proposal: describeCrestodianPersistentOperation(this.pending) } : {}
		});
	}
	async applyPendingProposal() {
		const pending = this.pending;
		this.clearPendingProposals();
		if (!pending) return {
			text: "",
			action: "none"
		};
		if (pending.kind === "channel-setup") return {
			text: await this.startChannelSetupWizard(pending.channel),
			action: "none"
		};
		if (pending.kind === "model-setup") return await this.startModelSetup(pending.workspace);
		const capture = createCaptureRuntime();
		let result;
		try {
			result = await executeCrestodianOperation(pending, capture, {
				approved: true,
				deps: this.commandDeps()
			});
		} catch (error) {
			capture.error(formatOperationError(error));
		}
		const verify = result?.applied ? await this.verifyConfigAfterWrite() : null;
		const followUp = this.armFollowUp(result?.followUp);
		return {
			text: [
				capture.read() || "Applied. Audit entry written.",
				verify,
				followUp
			].filter(Boolean).join("\n\n"),
			action: "none"
		};
	}
	/**
	* AI turn: the custodian persona answers and acts through the ring-zero
	* tool. Falls back to the single-turn planner, then to the anchored typed
	* grammar when no model backend is usable at all.
	*/
	async resolveAssistantTurn(text, approvalArmed) {
		const overview = await this.loadOverview();
		const agentTurn = this.opts.runAgentTurn ?? runCrestodianAgentTurn;
		try {
			const loopReply = await withDeadline(agentTurn({
				input: this.pending ? `[pending-proposal] Awaiting the user's approval: ${describeCrestodianPersistentOperation(this.pending)}. If they want it (or a variant), drive it through the crestodian tool yourself.\n${text}` : text,
				overview,
				surface: this.opts.surface ?? "cli",
				approvalArmed,
				session: this.agentSession
			}).catch(() => null), null, AGENT_TURN_DEADLINE_MS);
			if (loopReply?.text) {
				this.pending = null;
				return await this.applyAgentTurnReply(loopReply);
			}
		} catch {}
		const plan = await withDeadline((this.opts.planWithAssistant ?? (await import("./assistant-BBs9tIoE.js")).planCrestodianCommand)({
			input: text,
			overview,
			history: this.history,
			...this.pending ? { pendingOperation: describeCrestodianPersistentOperation(this.pending) } : {}
		}).catch(() => null), null, ASSISTANT_TURN_DEADLINE_MS).catch(() => null);
		if (!plan) return this.resolveDeterministicTurn(text);
		const replyText = plan.reply ?? "";
		if (!plan.command) return {
			text: replyText || "…",
			action: "none"
		};
		const operation = parseCrestodianOperation(plan.command);
		if (operation.kind === "none") return {
			text: replyText || "…",
			action: "none"
		};
		const provenance = `(${plan.modelLabel ?? "model"} → \`${plan.command}\`)`;
		const executed = await this.runOperation(operation, provenance);
		return {
			...executed,
			text: [replyText, executed.text].filter(Boolean).join("\n\n")
		};
	}
	async applyAgentTurnReply(loopReply) {
		if (loopReply.directive?.kind === "channel-setup") {
			const wizardIntro = await this.startChannelSetupWizard(loopReply.directive.channel);
			return {
				text: [loopReply.text, wizardIntro].filter(Boolean).join("\n\n"),
				action: "none"
			};
		}
		if (loopReply.directive?.kind === "model-setup") {
			const setup = await this.startModelSetup(loopReply.directive.workspace);
			return {
				...setup,
				text: [loopReply.text, setup.text].filter(Boolean).join("\n\n")
			};
		}
		if (loopReply.directive?.kind === "open-tui") return {
			text: loopReply.text,
			action: "open-tui",
			handoff: loopReply.directive
		};
		return {
			text: loopReply.text,
			action: "none"
		};
	}
	/**
	* Last resort with zero usable models: the anchored typed grammar keeps
	* setup/repair working on a fresh or broken machine (docs/cli/crestodian.md,
	* configless contract). This is never reached while any model answers.
	*/
	async resolveDeterministicTurn(text) {
		const direct = parseCrestodianOperation(text);
		if (direct.kind !== "none") return await this.runOperation(direct, void 0);
		return {
			text: ["I could not reach a model for that (deterministic mode).", "I can run doctor/status/health, check or restart Gateway, list agents/models, configure a model provider, set default model, connect channels (`connect telegram`), show audit, or switch to your agent TUI."].join("\n"),
			action: "none"
		};
	}
	async runOperation(operation, provenance) {
		if (operation.kind === "open-tui") return {
			text: "Opening your normal agent TUI. Use /crestodian there to come back.",
			action: "open-tui",
			handoff: operation
		};
		if (operation.kind === "channel-setup") return {
			text: await this.startChannelSetupWizard(operation.channel),
			action: "none"
		};
		if (operation.kind === "model-setup") return await this.startModelSetup(operation.workspace);
		const capture = createCaptureRuntime();
		if (isPersistentCrestodianOperation(operation) && !this.opts.yes) {
			this.clearPendingProposals();
			this.pending = operation;
			await executeCrestodianOperation(operation, capture, {
				approved: false,
				deps: this.commandDeps()
			});
			return {
				text: [
					provenance,
					capture.read(),
					approvalQuestion(operation)
				].filter(Boolean).join("\n\n"),
				action: "none"
			};
		}
		let result;
		try {
			result = await executeCrestodianOperation(operation, capture, {
				approved: this.opts.yes === true || !isPersistentCrestodianOperation(operation),
				deps: this.commandDeps()
			});
		} catch (error) {
			capture.error(formatOperationError(error));
		}
		const verify = result?.applied ? await this.verifyConfigAfterWrite() : null;
		const followUp = this.armFollowUp(result?.followUp);
		const reply = [
			provenance,
			capture.read(),
			verify,
			followUp
		].filter(Boolean).join("\n\n");
		if (operation.kind === "none" && reply.includes("Bye.")) return {
			text: reply,
			action: "exit"
		};
		return {
			text: reply,
			action: "none"
		};
	}
	async loadOverview() {
		if (this.opts.deps?.loadOverview) return await this.opts.deps.loadOverview();
		return await loadCrestodianOverview();
	}
	/**
	* Post-write hook: re-validate openclaw.json after every applied operation.
	* On failure the exact schema issues go straight back into the conversation
	* (and to the AI, which proposes one corrective command) so a bad write is
	* caught and fixed in the same chat instead of surfacing at gateway start.
	*/
	async verifyConfigAfterWrite() {
		let issuesText;
		try {
			const { readConfigFileSnapshot } = await import("./config/config.js");
			const snapshot = await readConfigFileSnapshot();
			if (!snapshot.exists || snapshot.valid) return null;
			const issues = (snapshot.issues ?? []).map((issue) => `${issue.path ? `${issue.path}: ` : ""}${issue.message}`);
			issuesText = issues.length > 0 ? issues.join("\n") : "unknown validation failure";
		} catch {
			return null;
		}
		const notice = `⚠ openclaw.json failed validation after that write:\n${issuesText}`;
		const recovery = await this.resolveAssistantTurn(`[config-verify] The config file is now invalid:\n${issuesText}\nPropose one corrective command from the allowed list.`, false);
		if (!recovery.text || recovery.text.includes("deterministic mode")) return `${notice}\nSay \`doctor fix\` to repair it, or \`config schema <path>\` to check the expected shape.`;
		return `${notice}\n\n${recovery.text}`;
	}
	commandDeps() {
		if (!this.opts.deps && !this.opts.surface) return;
		return {
			...this.opts.deps,
			...this.opts.surface ? { setupSurface: this.opts.surface } : {}
		};
	}
	clearPendingProposals() {
		this.pending = null;
		this.agentSession.proposalRef.current = void 0;
	}
	armFollowUp(operation) {
		if (operation?.kind !== "model-setup") return null;
		this.pending = operation;
		return ["No usable model provider is configured, so the agent cannot answer yet.", "Configure a model provider now? Say yes or no."].join("\n");
	}
	async startChannelSetupWizard(channel) {
		const runWizard = this.opts.runChannelSetupWizard ?? ((ch, prompter) => defaultChannelSetupWizardRunner(ch)(prompter));
		const session = new WizardSession((prompter) => runWizard(channel, prompter));
		this.wizardBridge = {
			session,
			step: null,
			kind: "channel",
			label: channel,
			autoSelectChannel: channel
		};
		return await this.pumpWizardBridge();
	}
	async startModelSetup(workspace) {
		if ((this.opts.surface ?? "cli") === "cli") return {
			text: "Opening masked model-provider setup in the terminal.",
			action: "open-tui",
			handoff: {
				kind: "model-setup",
				...workspace ? { workspace } : {}
			}
		};
		const runWizard = this.opts.runModelSetupWizard ?? ((dir, prompter) => defaultModelSetupWizardRunner(dir)(prompter));
		const session = new WizardSession((prompter) => runWizard(workspace, prompter));
		this.wizardBridge = {
			session,
			step: null,
			kind: "model",
			label: "model provider"
		};
		return {
			text: await this.pumpWizardBridge(),
			action: "none"
		};
	}
	/**
	* "connect telegram" already names the channel; answer the wizard's channel
	* selection step automatically instead of echoing the full channel wall.
	*/
	tryAutoSelectChannel(step) {
		const bridge = this.wizardBridge;
		const channel = bridge?.autoSelectChannel;
		if (!bridge || !channel) return null;
		if (step.type !== "select" && step.type !== "multiselect") return null;
		const match = (step.options ?? []).find((option) => typeof option.value === "string" && option.value.toLowerCase() === channel);
		if (!match) return null;
		bridge.autoSelectChannel = void 0;
		return { value: step.type === "multiselect" ? [match.value] : match.value };
	}
	/** Advance the hosted wizard to the next interactive step (or completion). */
	async pumpWizardBridge() {
		const bridge = this.wizardBridge;
		if (!bridge) return "";
		const result = await bridge.session.next();
		if (result.done) {
			this.wizardBridge = null;
			const label = bridge.label;
			if (result.status === "done") {
				if (bridge.kind === "model") {
					const overview = await this.loadOverview();
					const verify = await this.verifyConfigAfterWrite();
					return [overview.defaultModel ? `Done — default model is ${overview.defaultModel}.` : "Model provider setup finished without a default model. Crestodian remains in deterministic mode.", verify ?? ""].filter(Boolean).join("\n");
				}
				const { appendCrestodianAuditEntry } = await import("./audit-B2gvcw13.js");
				await appendCrestodianAuditEntry({
					operation: "channels.setup",
					summary: `Configured channel ${label} via chat setup`,
					details: { channel: label }
				});
				const verify = await this.verifyConfigAfterWrite();
				return [
					`Done — ${label} is configured.`,
					"Say `restart gateway` to apply channel changes, or `channels` to review.",
					verify ?? ""
				].filter(Boolean).join("\n");
			}
			if (result.status === "cancelled") return bridge.kind === "model" ? "Model provider setup cancelled. Crestodian remains in deterministic mode." : "Channel setup cancelled. Nothing was changed beyond completed steps.";
			return `${bridge.kind === "model" ? "Model provider" : "Channel"} setup stopped: ${result.error ?? "unknown error"}`;
		}
		bridge.step = result.step ?? null;
		if (bridge.step) {
			const auto = this.tryAutoSelectChannel(bridge.step);
			if (auto) {
				const step = bridge.step;
				bridge.step = null;
				await bridge.session.answer(step.id, auto.value);
				return await this.pumpWizardBridge();
			}
			if (this.opts.surface === "cli" && bridge.step.sensitive === true) {
				bridge.session.cancel();
				this.wizardBridge = null;
				return bridge.kind === "model" ? ["Sensitive input is not accepted in the Crestodian TUI because terminal input is visible.", "Run `openclaw configure --section model` to finish setup with masked prompts."].join("\n") : ["Sensitive input is not accepted in the Crestodian TUI because terminal input is visible.", `Run \`openclaw channels add --channel ${bridge.label}\` to finish setup with masked prompts.`].join("\n");
			}
			if (bridge.step.type === "note" || bridge.step.type === "progress") {
				const step = bridge.step;
				bridge.step = null;
				await bridge.session.answer(step.id, void 0);
				const next = await this.pumpWizardBridge();
				return [renderWizardStep(step), next].filter(Boolean).join("\n\n");
			}
			if (bridge.step.type === "action" && bridge.step.executor !== "client") {
				const step = bridge.step;
				bridge.step = null;
				await bridge.session.answer(step.id, true);
				return await this.pumpWizardBridge();
			}
		}
		return bridge.step ? renderWizardStep(bridge.step) : "";
	}
	async resolveWizardBridgeReply(text) {
		const bridge = this.wizardBridge;
		if (!bridge) return "";
		if (/^(cancel|abort|stop|quit|exit)$/i.test(text.trim())) {
			bridge.session.cancel();
			return await this.pumpWizardBridge();
		}
		const step = bridge.step;
		if (!step) return await this.pumpWizardBridge();
		const answer = parseWizardAnswer(step, text);
		if (!answer) return ["I could not match that answer.", renderWizardStep(step)].join("\n");
		const validationError = await bridge.session.answer(step.id, answer.value);
		if (validationError) return [validationError, renderWizardStep(step)].join("\n\n");
		return await this.pumpWizardBridge();
	}
};
//#endregion
export { CrestodianChatEngine as t };
