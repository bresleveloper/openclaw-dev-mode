import { c as normalizeOptionalLowercaseString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import { t as hasErrnoCode } from "./errno-CkbDOfLk.mjs";
import { n as resolvePreferredOpenClawTmpDir } from "./tmp-openclaw-dir-BSb3HetY.mjs";
import { t as resolveDefaultModelForAgent } from "./model-selection-config-DZ4sk4C2.mjs";
import { t as KeyedAsyncQueue } from "./keyed-async-queue-CTreGrmR.mjs";
import { t as tempWorkspace } from "./private-temp-workspace-DQFTMfun.mjs";
import { r as MAX_IMAGE_BYTES } from "./constants-DUxuqQz8.mjs";
import { s as listRegisteredPluginAgentPromptGuidance } from "./command-registration-vCqATNjA.mjs";
import { r as detectRuntimeShell } from "./shell-utils-nhIjchOP.mjs";
import "./model-selection-CaFyCMqp.mjs";
import { r as extensionForMime } from "./mime-1zBUMwu6.mjs";
import { t as privateFileStore } from "./private-file-store-DcTFLQxK.mjs";
import { i as resolveRuntimeOsLabel } from "./os-summary-B-12bRQs.mjs";
import { t as AGENT_LANE_SUBAGENT } from "./lanes-CI0_P-yC.mjs";
import { t as isAcpRuntimeSpawnAvailable } from "./availability-DLM4e556.mjs";
import { n as detectAndLoadPromptImages, r as detectImageReferences } from "./images-YAaF7CDR.mjs";
import { a as buildConfiguredAgentSystemPrompt, t as buildSystemPromptParams } from "./system-prompt-params-FwwZtF-t.mjs";
import { t as formatTomlConfigOverride } from "./toml-inline-kFOEkXyt.mjs";
import { t as formatCliImageTurnContext } from "./cli-image-turn-correlation-BVjxe73p.mjs";
import { n as cliBackendLog } from "./log-lbZDIx37.mjs";
import { n as CLI_RESUME_WATCHDOG_DEFAULTS, r as CLI_WATCHDOG_MIN_TIMEOUT_MS, t as CLI_FRESH_WATCHDOG_DEFAULTS } from "./cli-watchdog-defaults-CzmnkdzO.mjs";
import path from "node:path";
import fs from "node:fs/promises";
import os from "node:os";
import crypto from "node:crypto";
import { stripSystemPromptCacheBoundary } from "@openclaw/ai/internal/shared";
//#region src/agents/cli-runner/reliability.ts
/**
* Watchdog and supervisor key helpers for CLI runner reliability.
*/
function pickWatchdogProfile(backend, useResume, trigger, hasExplicitRunTimeout) {
	const configured = useResume ? backend.reliability?.watchdog?.resume : backend.reliability?.watchdog?.fresh;
	const defaults = useResume && !configured && (trigger === "cron" || hasExplicitRunTimeout === true) ? CLI_FRESH_WATCHDOG_DEFAULTS : useResume ? CLI_RESUME_WATCHDOG_DEFAULTS : CLI_FRESH_WATCHDOG_DEFAULTS;
	const ratio = (() => {
		const value = configured?.noOutputTimeoutRatio;
		if (typeof value !== "number" || !Number.isFinite(value)) return defaults.noOutputTimeoutRatio;
		return Math.max(.05, Math.min(.95, value));
	})();
	const minMs = (() => {
		const value = configured?.minMs;
		if (typeof value !== "number" || !Number.isFinite(value)) return defaults.minMs;
		return Math.max(CLI_WATCHDOG_MIN_TIMEOUT_MS, Math.floor(value));
	})();
	const maxMs = (() => {
		const value = configured?.maxMs;
		if (typeof value !== "number" || !Number.isFinite(value)) return defaults.maxMs;
		return Math.max(CLI_WATCHDOG_MIN_TIMEOUT_MS, Math.floor(value));
	})();
	return {
		noOutputTimeoutMs: void 0,
		noOutputTimeoutRatio: ratio,
		minMs: Math.min(minMs, maxMs),
		maxMs: Math.max(minMs, maxMs)
	};
}
/** Resolves the no-output watchdog timeout for a fresh or resumed CLI run. */
function resolveCliNoOutputTimeoutMs(params) {
	if (params.expectedQuiet) return params.timeoutMs;
	const hasExplicitRunTimeout = typeof params.runTimeoutOverrideMs === "number" && Number.isFinite(params.runTimeoutOverrideMs) && params.runTimeoutOverrideMs > 0;
	const profile = pickWatchdogProfile(params.backend, params.useResume, params.trigger, hasExplicitRunTimeout);
	const cap = Math.max(CLI_WATCHDOG_MIN_TIMEOUT_MS, params.timeoutMs - 1e3);
	if (profile.noOutputTimeoutMs !== void 0) return Math.min(profile.noOutputTimeoutMs, cap);
	const computed = Math.floor(params.timeoutMs * profile.noOutputTimeoutRatio);
	const bounded = Math.min(profile.maxMs, Math.max(profile.minMs, computed));
	return Math.min(bounded, cap);
}
function resolveCliRunTimeoutOverrideMs(params) {
	if (params.runTimeoutOverrideMs !== void 0) return params.runTimeoutOverrideMs;
	const configuredTimeoutSeconds = params.config?.agents?.defaults?.timeoutSeconds;
	return params.lane !== AGENT_LANE_SUBAGENT && typeof configuredTimeoutSeconds === "number" && Number.isFinite(configuredTimeoutSeconds) && configuredTimeoutSeconds > 0 ? params.timeoutMs : void 0;
}
/** Builds a supervisor scope key for session-owned CLI processes. */
function buildCliSupervisorScopeKey(params) {
	const commandToken = normalizeLowercaseStringOrEmpty(path.basename(params.backend.command ?? ""));
	const backendToken = normalizeLowercaseStringOrEmpty(params.backendId);
	const sessionToken = params.cliSessionId?.trim();
	if (!sessionToken) return;
	return `cli:${backendToken}:${commandToken}:${sessionToken}`;
}
//#endregion
//#region src/agents/cli-runner/helpers.ts
/**
* Shared helpers for CLI runner prompts, args, queueing, sessions, and image
* payload preparation.
*/
const CLI_RUN_QUEUE = new KeyedAsyncQueue();
const CLI_IMAGE_SWEEP_TTL_MS = 6048e5;
const sweptCliImageRoots = /* @__PURE__ */ new Set();
function isClaudeCliBackendId(providerId) {
	return normalizeOptionalLowercaseString(providerId) === "claude-cli";
}
/** Enqueues a CLI run under a backend/session key to prevent unsafe overlap. */
function enqueueCliRun(key, task) {
	return CLI_RUN_QUEUE.enqueue(key, task);
}
/** Resolves the serialization key for a CLI backend run. */
function resolveCliRunQueueKey(params) {
	const requiresLiveSessionSerialization = params.liveSession !== void 0;
	if (params.serialize === false && !requiresLiveSessionSerialization) return `${params.backendId}:${params.runId}`;
	const ownerKey = params.ownerKey?.trim();
	if (requiresLiveSessionSerialization && ownerKey) return `${params.backendId}:owner:${ownerKey}`;
	if (isClaudeCliBackendId(params.backendId)) {
		const sessionId = params.cliSessionId?.trim();
		if (sessionId) return `${params.backendId}:session:${sessionId}`;
		if (ownerKey) return `${params.backendId}:owner:${ownerKey}`;
		const workspaceDir = params.workspaceDir.trim();
		if (workspaceDir) return `${params.backendId}:workspace:${workspaceDir}`;
	}
	return params.backendId;
}
/** Builds the system prompt sent to a CLI-backed agent runtime. */
function buildCliAgentSystemPrompt(params) {
	const runtimeCwd = params.cwd?.trim() || params.workspaceDir;
	const defaultModelRef = resolveDefaultModelForAgent({
		cfg: params.config ?? {},
		agentId: params.agentId
	});
	const defaultModelLabel = `${defaultModelRef.provider}/${defaultModelRef.model}`;
	const { runtimeInfo, userTimezone, userDate } = buildSystemPromptParams({
		config: params.config,
		agentId: params.agentId,
		workspaceDir: runtimeCwd,
		cwd: runtimeCwd,
		runtime: {
			sessionKey: params.sessionKey,
			sessionId: params.sessionId,
			host: "openclaw",
			os: resolveRuntimeOsLabel(),
			arch: os.arch(),
			node: process.version,
			model: params.modelDisplay,
			defaultModel: defaultModelLabel,
			shell: detectRuntimeShell(),
			channel: params.runtimeChannel,
			chatType: params.runtimeChatType,
			capabilities: params.runtimeCapabilities
		}
	});
	return buildConfiguredAgentSystemPrompt({
		config: params.config,
		preparedModelRuntime: params.preparedModelRuntime,
		agentId: params.agentId,
		workspaceDir: params.workspaceDir,
		runtimeCwd,
		extraSystemPrompt: params.extraSystemPrompt,
		sourceReplyDeliveryMode: params.sourceReplyDeliveryMode,
		requireExplicitMessageTarget: params.requireExplicitMessageTarget,
		silentReplyPromptMode: params.silentReplyPromptMode,
		ownerNumbers: params.ownerNumbers,
		reasoningTagHint: false,
		docsPath: params.docsPath,
		sourcePath: params.sourcePath,
		acpEnabled: isAcpRuntimeSpawnAvailable({ config: params.config }),
		promptSurface: "cli_backend",
		nativeCommandGuidanceLines: listRegisteredPluginAgentPromptGuidance({ surface: "cli_backend" }),
		runtimeInfo,
		toolNames: params.tools.map((tool) => tool.name),
		messageTool: params.tools.find((tool) => tool.name.trim().toLowerCase() === "message"),
		skillsPrompt: params.skillsPrompt,
		userTimezone,
		userDate,
		contextFiles: params.contextFiles,
		bootstrapMode: params.bootstrapMode,
		bootstrapTruncationNotice: params.bootstrapTruncationNotice
	});
}
/** Applies backend model aliases to a requested CLI model id. */
function normalizeCliModel(modelId, backend) {
	const trimmed = modelId.trim();
	if (!trimmed) return trimmed;
	const direct = backend.modelAliases?.[trimmed];
	if (direct) return direct;
	const lower = normalizeLowercaseStringOrEmpty(trimmed);
	const mapped = backend.modelAliases?.[lower];
	if (mapped) return mapped;
	return trimmed;
}
/** Decides whether a system prompt should be sent for this CLI turn. */
function resolveSystemPromptUsage(params) {
	const systemPrompt = params.systemPrompt?.trim();
	if (!systemPrompt) return null;
	const when = params.backend.systemPromptWhen ?? "first";
	if (when === "never") return null;
	if (when === "first" && !params.isNewSession) return null;
	if (!params.backend.systemPromptArg?.trim() && !params.backend.systemPromptFileArg?.trim() && !params.backend.systemPromptFileConfigKey?.trim()) return null;
	return systemPrompt;
}
/** Resolves the CLI session id to send and whether the turn starts a new session. */
function resolveSessionIdToSend(params) {
	const mode = params.backend.sessionMode ?? "always";
	const existing = params.cliSessionId?.trim();
	if (mode === "none") return {
		sessionId: void 0,
		isNew: !existing
	};
	if (mode === "existing") return {
		sessionId: existing,
		isNew: !existing
	};
	if (existing) return {
		sessionId: existing,
		isNew: false
	};
	return {
		sessionId: crypto.randomUUID(),
		isNew: true
	};
}
/** Routes prompt text to argv or stdin based on backend input policy. */
function resolvePromptInput(params) {
	if ((params.backend.input ?? "arg") === "stdin") return { stdin: params.prompt };
	if (params.backend.maxPromptArgChars && params.prompt.length > params.backend.maxPromptArgChars) return { stdin: params.prompt };
	return { argsPrompt: params.prompt };
}
function resolveCliImagePath(image) {
	const ext = extensionForMime(image.mimeType) ?? ".bin";
	const digest = crypto.createHash("sha256").update(image.mimeType).update("\0").update(image.data).digest("hex");
	return path.join(resolvePreferredOpenClawTmpDir(), "openclaw-cli-images", `${digest}${ext}`);
}
function resolveCliImageRoot(params) {
	if (params.backend.imagePathScope === "workspace") return path.join(params.workspaceDir, ".openclaw-cli-images");
	return path.join(resolvePreferredOpenClawTmpDir(), "openclaw-cli-images");
}
async function sweepCliImageRoot(imageRoot) {
	if (sweptCliImageRoots.has(imageRoot)) return;
	sweptCliImageRoots.add(imageRoot);
	try {
		const cutoffMs = Date.now() - CLI_IMAGE_SWEEP_TTL_MS;
		const entries = await fs.readdir(imageRoot, { withFileTypes: true });
		for (const entry of entries) {
			if (!entry.isFile()) continue;
			const entryPath = path.join(imageRoot, entry.name);
			const stat = await fs.stat(entryPath).catch((error) => {
				if (hasErrnoCode(error, "ENOENT")) return;
				throw error;
			});
			if (!stat) continue;
			if (stat.mtimeMs >= cutoffMs) continue;
			try {
				await fs.rm(entryPath, { force: true });
			} catch (error) {
				if (!hasErrnoCode(error, "ENOENT")) throw error;
			}
		}
	} catch (error) {
		cliBackendLog.debug(`cli image cache sweep failed: ${String(error)}`);
	}
}
function appendImagePathsToPrompt(prompt, paths, prefix = "") {
	if (!paths.length) return prompt;
	const trimmed = prompt.trimEnd();
	return `${trimmed}${trimmed ? "\n\n" : ""}${paths.map((entry) => `${prefix}${entry}`).join("\n")}`;
}
/** Writes CLI image payloads to private paths and returns their file paths. */
async function writeCliImages(params) {
	const imageRoot = resolveCliImageRoot({
		backend: params.backend,
		workspaceDir: params.workspaceDir
	});
	await fs.mkdir(imageRoot, {
		recursive: true,
		mode: 448
	});
	await sweepCliImageRoot(imageRoot);
	const store = privateFileStore(imageRoot);
	const paths = [];
	for (const image of params.images) {
		const fileName = path.basename(resolveCliImagePath(image));
		const buffer = Buffer.from(image.data, "base64");
		await store.writeText(fileName, buffer);
		paths.push(store.path(fileName));
	}
	const cleanup = async () => {};
	return {
		paths,
		cleanup
	};
}
/** Writes a temporary system prompt file when the backend needs file-based prompts. */
async function writeCliSystemPromptFile(params) {
	if (!params.backend.systemPromptFileArg?.trim() && !params.backend.systemPromptFileConfigKey?.trim()) return { cleanup: async () => {} };
	const workspace = await tempWorkspace({
		rootDir: resolvePreferredOpenClawTmpDir(),
		prefix: "openclaw-cli-system-prompt-"
	});
	return {
		filePath: await workspace.write("system-prompt.md", stripSystemPromptCacheBoundary(params.systemPrompt)),
		cleanup: () => workspace.cleanup().then(() => void 0)
	};
}
/** Prepares prompt text and image paths for a CLI backend run. */
async function prepareCliPromptImagePayload(params) {
	let prompt = params.prompt;
	const imagePrompt = params.imagePrompt ?? prompt;
	const imageResult = params.imagePrompt !== void 0 || Boolean(params.media?.length) || Boolean(params.mediaImageLayout) || !params.images?.length && detectImageReferences(imagePrompt).length > 0 ? await detectAndLoadPromptImages({
		prompt: imagePrompt,
		media: params.media,
		workspaceDir: params.workspaceDir,
		model: { input: ["text", "image"] },
		existingImages: params.images,
		imageOrder: params.imageOrder,
		mediaImageLayout: params.mediaImageLayout,
		maxBytes: MAX_IMAGE_BYTES,
		localRoots: params.localRoots
	}) : void 0;
	if (imageResult?.failedMediaCount) throw new Error(`failed to hydrate ${imageResult.failedMediaCount} structured image attachment(s) for CLI input`);
	const resolvedImages = imageResult?.images ?? params.images ?? [];
	if (resolvedImages.length === 0) return { prompt };
	const imagePayload = await writeCliImages({
		backend: params.backend,
		workspaceDir: params.workspaceDir,
		images: resolvedImages
	});
	const imagePaths = imagePayload.paths;
	if (!params.backend.imageArg || params.backend.input === "stdin" || params.backend.imageArg === "@") {
		if (params.imageTurnKey) prompt = `${prompt.trimEnd()}\n\n${formatCliImageTurnContext(params.imageTurnKey)}`;
		prompt = appendImagePathsToPrompt(prompt, imagePaths, params.backend.imageArg === "@" ? "@" : "");
	}
	return {
		prompt,
		imagePaths,
		cleanupImages: imagePayload.cleanup
	};
}
/** Builds final CLI argv from backend config and prepared prompt/session inputs. */
function buildCliArgs(params) {
	const args = [...params.baseArgs];
	const shouldSendSystemPrompt = !params.useResume || params.backend.systemPromptWhen === "always" || params.sendSystemPromptOnResume;
	if (params.backend.modelArg && params.modelId) args.push(params.backend.modelArg, params.modelId);
	if (shouldSendSystemPrompt && params.systemPrompt && params.systemPromptFilePath && params.backend.systemPromptFileArg) args.push(params.backend.systemPromptFileArg, params.systemPromptFilePath);
	else if (shouldSendSystemPrompt && params.systemPrompt && params.systemPromptFilePath && params.backend.systemPromptFileConfigKey) args.push(params.backend.systemPromptFileConfigArg ?? "-c", formatTomlConfigOverride(params.backend.systemPromptFileConfigKey, params.systemPromptFilePath));
	else if (shouldSendSystemPrompt && params.systemPrompt && params.backend.systemPromptArg) args.push(params.backend.systemPromptArg, stripSystemPromptCacheBoundary(params.systemPrompt));
	if (!params.useResume && params.sessionId) {
		if (params.backend.sessionArgs && params.backend.sessionArgs.length > 0) for (const entry of params.backend.sessionArgs) args.push(entry.replaceAll("{sessionId}", params.sessionId));
	}
	if (params.useResume && params.forkResume) {
		if (!params.backend.forkArg) throw new Error("CLI backend does not support forked session resume");
		args.push(params.backend.forkArg);
	}
	if (params.resumeAt) {
		if (!params.useResume || !params.backend.resumeAtArg) throw new Error("CLI backend does not support checkpointed session resume");
		args.push(params.backend.resumeAtArg, params.resumeAt);
	}
	if (params.promptArg !== void 0) {
		let replacedPromptPlaceholder = false;
		for (let i = 0; i < args.length; i += 1) if (args[i] === "{prompt}") {
			args[i] = params.promptArg;
			replacedPromptPlaceholder = true;
		}
		if (!replacedPromptPlaceholder) args.push(params.promptArg);
	}
	if (params.imagePaths && params.imagePaths.length > 0) {
		const mode = params.backend.imageMode ?? "repeat";
		const imageArg = params.backend.imageArg;
		if (imageArg && imageArg !== "@") {
			if (mode === "list") args.push(imageArg, params.imagePaths.join(","));
			else for (const imagePath of params.imagePaths) args.push(imageArg, imagePath);
		}
	}
	return args;
}
//#endregion
export { normalizeCliModel as a, resolvePromptInput as c, writeCliSystemPromptFile as d, buildCliSupervisorScopeKey as f, isClaudeCliBackendId as i, resolveSessionIdToSend as l, resolveCliRunTimeoutOverrideMs as m, buildCliArgs as n, prepareCliPromptImagePayload as o, resolveCliNoOutputTimeoutMs as p, enqueueCliRun as r, resolveCliRunQueueKey as s, buildCliAgentSystemPrompt as t, resolveSystemPromptUsage as u };
