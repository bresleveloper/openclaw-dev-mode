import { c as normalizeOptionalLowercaseString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { n as resolvePreferredOpenClawTmpDir } from "./tmp-openclaw-dir-DR7bHNl9.mjs";
import { n as sha256Hex } from "./node-crypto-BG4u3UnX.mjs";
import "./crypto-digest-y6oZN-_F.mjs";
import { t as KeyedAsyncQueue } from "./keyed-async-queue-CTreGrmR.mjs";
import { r as MAX_IMAGE_BYTES } from "./constants-GzjKtFvA.mjs";
import { t as resolveDefaultModelForAgent } from "./model-selection-config-DYd_ufXT.mjs";
import { i as listRegisteredPluginAgentPromptGuidance } from "./command-registry-state-G8LjgiHf.mjs";
import { r as detectRuntimeShell } from "./shell-utils-WeFwTUA7.mjs";
import "./model-selection-C1qxt1eY.mjs";
import { r as extensionForMime } from "./mime-CGDYrRzL.mjs";
import { t as privateFileStore } from "./private-file-store-DM0i141q.mjs";
import { i as resolveRuntimeOsLabel } from "./os-summary-DH0HB36b.mjs";
import { t as isAcpRuntimeSpawnAvailable } from "./availability-Hy3UfoZt.mjs";
import { n as detectAndLoadPromptImages, r as detectImageReferences } from "./images-Dog21-sT.mjs";
import { t as buildConfiguredAgentSystemPrompt } from "./system-prompt-config-CNHjVkfv.mjs";
import { t as buildSystemPromptParams } from "./system-prompt-params-CH6jpQWl.mjs";
import { t as formatTomlConfigOverride } from "./toml-inline-nu7ilue8.mjs";
import { t as formatCliImageTurnContext } from "./cli-image-turn-correlation-BVXO9f3I.mjs";
import { n as cliBackendLog } from "./log-C-xabBWt.mjs";
import path from "node:path";
import fs from "node:fs/promises";
import os from "node:os";
import crypto from "node:crypto";
import { tempWorkspace } from "@openclaw/fs-safe/temp";
import { stripSystemPromptCacheBoundary } from "@openclaw/ai/internal/shared";
import { fileStore } from "@openclaw/fs-safe/store";
//#region src/agents/cli-runner/helpers.ts
const CLI_RUN_QUEUE = new KeyedAsyncQueue();
const CLI_IMAGE_SWEEP_TTL_MS = 6048e5;
const sweptCliImageRoots = /* @__PURE__ */ new Set();
function isClaudeCliBackendId(providerId) {
	return normalizeOptionalLowercaseString(providerId) === "claude-cli";
}
function enqueueCliRun(key, task) {
	return CLI_RUN_QUEUE.enqueue(key, task);
}
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
		preparedGitCoauthorPrompt: params.preparedGitCoauthorPrompt,
		requesterProfileId: params.requesterProfileId,
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
function normalizeCliModel(modelId, backend) {
	const trimmed = modelId.trim();
	if (!trimmed) return trimmed;
	return backend.modelAliases?.[trimmed] || backend.modelAliases?.[normalizeLowercaseStringOrEmpty(trimmed)] || trimmed;
}
function resolveSystemPromptUsage(params) {
	const systemPrompt = params.systemPrompt?.trim();
	if (!systemPrompt) return null;
	const when = params.backend.systemPromptWhen ?? "first";
	if (when === "never") return null;
	if (when === "first" && !params.isNewSession) return null;
	if (!params.backend.systemPromptArg?.trim() && !params.backend.systemPromptFileArg?.trim() && !params.backend.systemPromptFileConfigKey?.trim()) return null;
	return systemPrompt;
}
function resolveSessionIdToSend(params) {
	const mode = params.backend.sessionMode ?? "always";
	const existing = params.cliSessionId?.trim();
	return {
		sessionId: mode === "none" ? void 0 : mode === "existing" || existing ? existing : crypto.randomUUID(),
		isNew: !existing
	};
}
function resolvePromptInput(params) {
	if (params.backend.input === "stdin" || params.backend.maxPromptArgChars && params.prompt.length > params.backend.maxPromptArgChars) return { stdin: params.prompt };
	return { argsPrompt: params.prompt };
}
function resolveCliImageFileName(image) {
	const ext = extensionForMime(image.mimeType) ?? ".bin";
	return `${sha256Hex(`${image.mimeType}\0${image.data}`)}${ext}`;
}
async function sweepCliImageRoot(imageRoot) {
	if (sweptCliImageRoots.has(imageRoot)) return;
	sweptCliImageRoots.add(imageRoot);
	try {
		await fileStore({ rootDir: imageRoot }).pruneExpired({ ttlMs: CLI_IMAGE_SWEEP_TTL_MS });
	} catch (error) {
		cliBackendLog.debug(`cli image cache sweep failed: ${String(error)}`);
	}
}
function appendImagePathsToPrompt(prompt, paths, prefix = "") {
	if (!paths.length) return prompt;
	const trimmed = prompt.trimEnd();
	return `${trimmed}${trimmed ? "\n\n" : ""}${paths.map((entry) => `${prefix}${entry}`).join("\n")}`;
}
async function writeCliImages(params) {
	const imageRoot = params.backend.imagePathScope === "workspace" ? path.join(params.workspaceDir, ".openclaw-cli-images") : path.join(resolvePreferredOpenClawTmpDir(), "openclaw-cli-images");
	await fs.mkdir(imageRoot, {
		recursive: true,
		mode: 448
	});
	await sweepCliImageRoot(imageRoot);
	const store = privateFileStore(imageRoot);
	const paths = [];
	for (const image of params.images) {
		const fileName = resolveCliImageFileName(image);
		const buffer = Buffer.from(image.data, "base64");
		await store.writeText(fileName, buffer);
		paths.push(store.path(fileName));
	}
	return paths;
}
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
	const imagePaths = await writeCliImages({
		backend: params.backend,
		workspaceDir: params.workspaceDir,
		images: resolvedImages
	});
	if (!params.backend.imageArg || params.backend.input === "stdin" || params.backend.imageArg === "@") {
		if (params.imageTurnKey) prompt = `${prompt.trimEnd()}\n\n${formatCliImageTurnContext(params.imageTurnKey)}`;
		prompt = appendImagePathsToPrompt(prompt, imagePaths, params.backend.imageArg === "@" ? "@" : "");
	}
	return {
		prompt,
		imagePaths
	};
}
function buildCliArgs(params) {
	const args = [...params.baseArgs];
	const shouldSendSystemPrompt = !params.useResume || params.backend.systemPromptWhen === "always" || params.sendSystemPromptOnResume;
	if (params.backend.modelArg && params.modelId) args.push(params.backend.modelArg, params.modelId);
	if (shouldSendSystemPrompt && params.systemPrompt) {
		if (params.systemPromptFilePath && params.backend.systemPromptFileArg) args.push(params.backend.systemPromptFileArg, params.systemPromptFilePath);
		else if (params.systemPromptFilePath && params.backend.systemPromptFileConfigKey) args.push(params.backend.systemPromptFileConfigArg ?? "-c", formatTomlConfigOverride(params.backend.systemPromptFileConfigKey, params.systemPromptFilePath));
		else if (params.backend.systemPromptArg) args.push(params.backend.systemPromptArg, stripSystemPromptCacheBoundary(params.systemPrompt));
	}
	if (!params.useResume && params.sessionId) for (const entry of params.backend.sessionArgs ?? []) args.push(entry.replaceAll("{sessionId}", params.sessionId));
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
	const imageArg = params.backend.imageArg;
	if (params.imagePaths?.length && imageArg && imageArg !== "@") {
		if (params.backend.imageMode === "list") args.push(imageArg, params.imagePaths.join(","));
		else for (const imagePath of params.imagePaths) args.push(imageArg, imagePath);
	}
	return args;
}
//#endregion
export { normalizeCliModel as a, resolvePromptInput as c, writeCliSystemPromptFile as d, isClaudeCliBackendId as i, resolveSessionIdToSend as l, buildCliArgs as n, prepareCliPromptImagePayload as o, enqueueCliRun as r, resolveCliRunQueueKey as s, buildCliAgentSystemPrompt as t, resolveSystemPromptUsage as u };
