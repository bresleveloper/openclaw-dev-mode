import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { _ as redactSensitiveText } from "./redact-B5EGyLvV.mjs";
import { f as isDiagnosticsEnabled, o as emitTrustedDiagnosticEvent } from "./diagnostic-events-CVabF32H.mjs";
import { n as resolvePreferredOpenClawTmpDir } from "./tmp-openclaw-dir-BSb3HetY.mjs";
import { a as normalizeOptionalAgentRuntimeId, r as isDefaultAgentRuntimeId } from "./agent-runtime-id-9mBje111.mjs";
import { t as resolveDefaultModelForAgent } from "./model-selection-config-DZ4sk4C2.mjs";
import { n as resolveManifestActivationPluginIds } from "./activation-planner-CtJXavAS.mjs";
import { t as tempWorkspace } from "./private-temp-workspace-DQFTMfun.mjs";
import "./worker-admission-BB3C4gz4.mjs";
import { S as parseWorkerLaunchPlan, a as parseWorkerRuntimeResult } from "./worker-process-protocol-B6pCNPWA.mjs";
import { i as logWarn } from "./logger-BHMMVs5C.mjs";
import { a as WORKER_PROTOCOL_MAX_INFERENCE_PAYLOAD_BYTES, t as WORKER_INFERENCE_MAX_CONTEXT_MESSAGES } from "./worker-inference-m2fwUhbe.mjs";
import { r as MAX_IMAGE_BYTES } from "./constants-DUxuqQz8.mjs";
import { s as getActiveAgentRunDelegatedAuthority, v as registerAgentRunDelegatedAuthorityClosedHandler } from "./agent-run-registry-DO6Dg2r0.mjs";
import { o as resolveEffectiveAgentRuntime } from "./thinking-runtime-Dvszh-e-.mjs";
import { d as readPersistedMediaFacts } from "./media-facts-BEHTU0wM.mjs";
import { r as resolveImageSanitizationLimits } from "./image-sanitization-DhkMOJXD.mjs";
import { u as convertToLlm } from "./session-D9cHHQGH.mjs";
import { o as hasNonzeroUsage, u as normalizeUsage } from "./usage-XXLoqJQC.mjs";
import { f as resolveAdmittedRunActiveAssertion, p as resolvePreparedRunAdmission, u as readAdmittedRunOperatorAuthority } from "./admitted-run-context-BNasoszr.mjs";
import { n as readPersistedMediaImageLayout, t as readPersistedImageBlockFactIndexes } from "./prompt-image-metadata-DjWY92MN.mjs";
import { o as withGatewayToolCallerIdentity } from "./gateway-caller-context-DvDb9xl2.mjs";
import { r as resolveSandboxToolPolicyForAgent } from "./tool-policy-C8ci7WKM.mjs";
import { n as projectEffectiveExecPolicy } from "./session-permission-exec-mode-Bn0mEuts.mjs";
import { n as resolveEffectiveToolFsWorkspaceOnly } from "./tool-fs-policy-DkN5in9o.mjs";
import { n as getAgentScopedMediaLocalRoots } from "./local-roots-CfRBR4Iu.mjs";
import { t as MEDIA_MAX_BYTES } from "./store-CqRcb7T5.mjs";
import { s as resolveMediaReferenceLocalPath } from "./media-reference-CtGDBk0x.mjs";
import { a as readLocalMediaFile } from "./local-media-access-Cxmjo_Ju.mjs";
import { n as recordModelFallbackStop } from "./model-fallback-stop-B0RY23Zf.mjs";
import "./failover-error-C3SnWYBJ.mjs";
import { n as resolveSandboxRuntimeStatus } from "./runtime-status-GvZUbuy9.mjs";
import { i as mintAgentRuntimeIdentityToken, r as measureAgentRuntimeIdentityTokenBytes } from "./agent-runtime-identity-token-C6L1CTtM.mjs";
import { i as buildPersistedUserTurnMessage } from "./user-turn-transcript.message-DpTCMkgY.mjs";
import "./user-turn-transcript-Cqq1jlt5.mjs";
import { v as sameWorkerSessionTurnClaim } from "./placement-record-CB6gcJKw.mjs";
import { a as ensureStagedInputDirectory, l as stagedInputDirectory, u as stagedInputFileName } from "./staged-inputs-De-HBXyz.mjs";
import { r as bindWorkerTurnOwner } from "./placement-turn-claim-events-D2oaSWT4.mjs";
import { n as resolveExecDefaults } from "./exec-defaults-25hFSBa3.mjs";
import { t as resolveConversationCapabilityProfile } from "./conversation-capability-profile-CET85wnK.mjs";
import { i as prepareActiveNodeContext, t as buildActiveNodeContextText } from "./active-node-context-Chc0tKJ6.mjs";
import { t as SessionManager } from "./session-manager-ezhBV3sx.mjs";
import { t as withSessionManagerWrite } from "./session-manager-write-admission-Dwxoskt2.mjs";
import { n as mapThinkingLevelForProvider } from "./utils-CefVZRZM.mjs";
import { a as buildUsageAgentMetaFields, d as resolveFinalAssistantVisibleText, m as resolveReportedModelRef, u as resolveFinalAssistantRawText } from "./helpers-CSSpZic_.mjs";
import { n as pruneProcessedHistoryImages } from "./history-image-prune-C_GWykrf.mjs";
import { i as resolveMediaFactLocalRef } from "./images.media-refs-B62GCpdx.mjs";
import { i as hydratePromptMediaMessages, n as detectAndLoadPromptImages } from "./images-YAaF7CDR.mjs";
import { r as projectConversationToolNames } from "./conversation-tool-policy-pipeline-lj6t0cRI.mjs";
import { t as applyEmbeddedAttemptToolsAllow } from "./attempt-tool-construction-plan-DN-5OrUy.mjs";
import "./messages-BMUSvUyN.mjs";
import { r as mergeUsageIntoAccumulator, t as createUsageAccumulator } from "./usage-accumulator-CKETh8nK.mjs";
import "./worker-skill-workshop-CtIZXAKM.mjs";
import { n as createLibrarySkillWorkshopTool } from "./skill-workshop-tool-library-BZvijf5h.mjs";
import "./skill-resources-C_go8RE1.mjs";
import { n as prepareSkillResourceDelivery } from "./resources-CKVlyZhk.mjs";
import { n as WORKER_REQUIRED_LOCAL_TOOL_NAMES, r as WORKER_SESSION_TOOL_NAMES } from "./tool-authority-Duog_7TW.mjs";
import { i as isWorkerTranscriptMessageFrameSafe, n as cloneImageContent, o as toWorkerTranscriptMessage, r as cloneTextContent, t as WORKER_PROVIDER_REPLAY_LOCAL_RETRY_MESSAGE } from "./transcript-message-D33QMqiJ.mjs";
import { i as supportsCurrentWorkerLaunch, n as StaleWorkerBuildError } from "./admission-BzZXJ5YD.mjs";
import { t as prepareWorkerGitHubBinding } from "./worker-github-binding-BAay-o87.mjs";
import { f as waitForTurnOperation, t as WorkerTurnExecutionError } from "./worker-turn-failure-BrC70-vF.mjs";
import { n as registerWorkerSkillAuthoring } from "./worker-skill-authoring-D8U3rwMj.mjs";
import { n as windowWorkerReplayMessages, t as fitWorkerReplayImages } from "./replay-message-window-Bl3QzLEm.mjs";
import { a as resolveWorkerTurnTranscriptTarget, i as workerWorkspaceFailure, n as reconcileWorkspaceAfterTurn, r as recoverWorkspaceBeforeTurn } from "./workspace-result-finalize-Lvjgw-4M.mjs";
import path from "node:path";
import fs from "node:fs/promises";
import { createHash, randomUUID } from "node:crypto";
//#region src/gateway/worker-environments/worker-tool-authority.ts
function resolveWorkerCapabilityProfile(params) {
	const turn = params.turn;
	const sandboxSessionKey = turn.sandboxSessionKey?.trim() || turn.sessionKey?.trim() || turn.sessionId;
	const sandbox = resolveSandboxRuntimeStatus({
		cfg: turn.config,
		sessionKey: sandboxSessionKey,
		agentId: turn.agentId
	});
	return resolveConversationCapabilityProfile({
		config: turn.config,
		sessionKey: sandboxSessionKey,
		runSessionKey: turn.sessionKey && turn.sessionKey !== sandboxSessionKey ? turn.sessionKey : void 0,
		sessionId: turn.sessionId,
		runId: turn.runId,
		agentId: turn.agentId,
		agentDir: turn.agentDir,
		agentAccountId: turn.agentAccountId,
		messageProvider: turn.messageProvider,
		messageChannel: turn.messageChannel,
		chatType: turn.chatType,
		messageTo: turn.messageTo,
		messageThreadId: turn.messageThreadId,
		currentChannelId: turn.currentChannelId,
		currentMessagingTarget: turn.currentMessagingTarget,
		currentThreadTs: turn.currentThreadTs,
		currentMessageId: turn.currentMessageId,
		groupId: turn.groupId,
		groupChannel: turn.groupChannel,
		groupSpace: turn.groupSpace,
		memberRoleIds: turn.memberRoleIds,
		spawnedBy: turn.spawnedBy,
		senderId: turn.senderId,
		senderName: turn.senderName,
		senderUsername: turn.senderUsername,
		senderE164: turn.senderE164,
		senderIsOwner: turn.senderIsOwner,
		modelProvider: params.modelRef.provider,
		modelId: params.modelRef.model,
		modelHasVision: turn.modelHasVision,
		workspaceDir: turn.workspaceDir,
		cwd: turn.cwd,
		isCanonicalWorkspace: turn.isCanonicalWorkspace,
		promptMode: turn.promptMode,
		skillsSnapshot: turn.skillsSnapshot,
		sandboxToolPolicy: sandbox.sandboxed ? resolveSandboxToolPolicyForAgent(turn.config, sandbox.classificationAgentId, { containedToolNames: params.availableOptionalToolNames?.includes("computer") ? ["computer"] : [] }) : void 0,
		runtimeToolAllowlist: turn.toolsAllow,
		inheritRuntimeToolAllowlist: true,
		runtimePluginToolGrant: turn.runtimePluginToolGrant,
		inputProvenance: turn.inputProvenance,
		trustedInternalHandoff: turn.trustedInternalHandoff,
		scheduledToolPolicy: turn.scheduledToolPolicy
	});
}
/** Resolves the final fixed worker surface at the trusted Gateway handoff boundary. */
function resolveWorkerToolAuthority(params) {
	const turn = params.turn;
	const defaults = resolveExecDefaults({
		cfg: turn.config,
		sessionEntry: turn.execSession,
		execOverrides: turn.execOverrides,
		agentId: turn.agentId,
		sessionKey: turn.sandboxSessionKey?.trim() || turn.sessionKey?.trim() || turn.sessionId
	});
	const policy = projectEffectiveExecPolicy({
		base: {
			...defaults,
			host: defaults.effectiveHost
		},
		scheduledExecTarget: turn.scheduledToolPolicy?.execTarget
	});
	const execUnavailable = policy.ask === "always" || turn.scheduledToolPolicy?.execTarget !== void 0 && defaults.effectiveHost !== "gateway";
	const { effectiveHost: host, security, node: configuredNode } = defaults;
	const ask = policy.ask ?? defaults.ask;
	const node = configuredNode?.trim();
	const exec = host === "node" ? {
		host,
		security,
		ask,
		safeBins: [],
		...node ? { node } : {}
	} : {
		host,
		security,
		ask,
		safeBins: []
	};
	if (turn.disableTools === true || turn.modelRun === true || turn.promptMode === "none") return {
		allowedToolNames: [],
		exec
	};
	const runtimeCappedTools = applyEmbeddedAttemptToolsAllow([
		...WORKER_REQUIRED_LOCAL_TOOL_NAMES,
		...(params.availableOptionalToolNames ?? []).filter((name) => name !== "computer" || turn.modelHasVision !== false),
		...WORKER_SESSION_TOOL_NAMES.filter((name) => name === "skill_workshop" ? turn.skillLibraryAuthoring !== void 0 : name !== "portal" || params.portalAvailable === true)
	].map((name) => ({ name })), turn.toolsAllow);
	const projected = projectConversationToolNames({
		capabilityProfile: resolveWorkerCapabilityProfile(params),
		toolNames: runtimeCappedTools.map((tool) => tool.name),
		warn: logWarn
	});
	if (execUnavailable) logWarn("Worker exec/process withheld: captured exec policy requires local host or interactive approval. Run this turn locally.");
	return {
		allowedToolNames: execUnavailable ? projected.filter((name) => name !== "exec" && name !== "process") : projected,
		exec
	};
}
//#endregion
//#region src/gateway/worker-environments/worker-desktop-launch-plan.ts
/** Plans desktop tools from prepared provider capabilities and normal tool policy. */
async function prepareWorkerDesktopLaunchPlan(params) {
	const preparedComputer = params.turn.modelHasVision !== false && params.protocolFeatures.includes("worker-computer-v1") ? await params.prepareComputer() : void 0;
	const computer = preparedComputer?.descriptor;
	const browserApp = params.desktop?.apps?.find((app) => app.id === "browser");
	const browserAvailable = browserApp !== void 0 && params.turn.config?.browser?.enabled !== false && resolveManifestActivationPluginIds({
		trigger: {
			kind: "capability",
			capability: "tool"
		},
		config: params.turn.config,
		onlyPluginIds: ["browser"]
	}).includes("browser");
	const availableOptionalToolNames = [];
	if (browserAvailable) availableOptionalToolNames.push("browser");
	if (computer) availableOptionalToolNames.push("computer");
	const toolAuthority = resolveWorkerToolAuthority({
		modelRef: params.modelRef,
		turn: params.turn,
		portalAvailable: params.portalAvailable,
		availableOptionalToolNames
	});
	return {
		toolAuthority,
		...computer && toolAuthority.allowedToolNames.includes("computer") ? {
			computer,
			preparedComputer
		} : {},
		...browserApp && toolAuthority.allowedToolNames.includes("browser") ? { browser: {
			cdpUrl: `http://127.0.0.1:${browserApp.cdpPort}`,
			launcherPath: browserApp.executablePath,
			...browserApp.args ? { launcherArgs: [...browserApp.args] } : {}
		} } : {}
	};
}
//#endregion
//#region src/gateway/worker-environments/worker-turn-media.ts
const MAX_WORKER_ATTACHMENT_BYTES = 268435456;
const MAX_WORKER_ATTACHMENT_FILES = 25e3;
function prepareInput(content, media, modelHasVision, imageFactIndexes) {
	const parts = (typeof content === "string" ? [{
		type: "text",
		text: content
	}] : content).filter((part) => modelHasVision || part.type !== "image");
	return {
		parts,
		media,
		unownedImages: parts.filter((part) => part.type === "image").filter((_image, index) => {
			const factIndex = imageFactIndexes?.[index];
			return factIndex == null || !resolveMediaFactLocalRef(media[factIndex]);
		}),
		files: /* @__PURE__ */ new Set()
	};
}
/** Prepare transient worker input; canonical media paths and transcript bytes stay on the Gateway. */
async function prepareWorkerTurnMedia(params) {
	const { turn, signal } = params;
	const assertCurrent = () => {
		signal.throwIfAborted();
		if (!params.isAuthorized()) throw new Error("Worker media preparation lost its active placement or turn claim");
	};
	assertCurrent();
	const recorded = turn.userTurnTranscriptRecorder?.message ?? await turn.userTurnTranscriptRecorder?.resolveMessage();
	assertCurrent();
	const recordedMedia = recorded ? readPersistedMediaFacts(recorded) : void 0;
	const media = recordedMedia?.length ? recordedMedia : turn.media ?? [];
	const localWorkspace = params.workspace.kind === "local" ? params.workspace.path : void 0;
	const localRoots = resolveEffectiveToolFsWorkspaceOnly({
		cfg: turn.config,
		agentId: turn.agentId
	}) ? localWorkspace ? [localWorkspace] : [] : [...getAgentScopedMediaLocalRoots(turn.config ?? {}, turn.agentId), ...localWorkspace ? [localWorkspace] : []];
	const modelHasVision = turn.modelHasVision === true;
	const mediaOptions = {
		workspaceDir: localWorkspace ?? params.remoteWorkspaceDir,
		model: { input: modelHasVision ? ["text", "image"] : ["text"] },
		maxBytes: MAX_IMAGE_BYTES,
		maxDimensionPx: resolveImageSanitizationLimits(turn.config).maxDimensionPx,
		localRoots
	};
	const currentImages = await detectAndLoadPromptImages({
		...mediaOptions,
		prompt: turn.prompt,
		existingImages: turn.images,
		imageOrder: turn.imageOrder,
		media,
		mediaImageLayout: recorded ? readPersistedMediaImageLayout(recorded) : void 0
	});
	assertCurrent();
	if (currentImages.failedMediaCount) throw new Error(`Cloud worker could not load ${currentImages.failedMediaCount} image attachment(s); resend the attachment and retry.`);
	const pruned = pruneProcessedHistoryImages(params.history) ?? params.history;
	const history = await hydratePromptMediaMessages(pruned, mediaOptions);
	assertCurrent();
	const current = prepareInput([{
		type: "text",
		text: turn.prompt
	}, ...currentImages.images], media, modelHasVision, currentImages.imageFactIndexes);
	const replay = new Map(history.flatMap((message) => message.role === "user" ? [[message, prepareInput(message.content, readPersistedMediaFacts(message) ?? [], modelHasVision, readPersistedImageBlockFactIndexes(message))]] : []));
	const inputs = [current, ...replay.values()];
	const projectedPaths = /* @__PURE__ */ new Map();
	let staging;
	try {
		let bytes = 0;
		const stagedPaths = /* @__PURE__ */ new Set();
		const stageFile = async (data, identity, fileName) => {
			assertCurrent();
			const directory = stagedInputDirectory(identity);
			const relative = path.posix.join(directory, stagedInputFileName(fileName));
			const remotePath = path.posix.isAbsolute(params.remoteWorkspaceDir) ? path.posix.join(params.remoteWorkspaceDir, relative) : path.win32.join(params.remoteWorkspaceDir, ...relative.split("/"));
			if (stagedPaths.has(remotePath)) return remotePath;
			bytes += data.length;
			if (bytes > MAX_WORKER_ATTACHMENT_BYTES || stagedPaths.size >= MAX_WORKER_ATTACHMENT_FILES) throw new Error("Cloud worker attachments exceed the workspace transfer budget; send fewer or smaller files.");
			staging ??= await tempWorkspace({
				rootDir: resolvePreferredOpenClawTmpDir(),
				prefix: "worker-attachments-"
			});
			const destination = path.join(staging.dir, ...relative.split("/"));
			assertCurrent();
			await ensureStagedInputDirectory(staging.dir, directory, signal);
			assertCurrent();
			await fs.writeFile(destination, data, {
				mode: 384,
				signal
			});
			stagedPaths.add(remotePath);
			return remotePath;
		};
		for (const input of inputs) {
			for (const fact of input.media) {
				const ref = resolveMediaFactLocalRef(fact);
				if (!ref) continue;
				let remotePath = projectedPaths.get(ref.raw);
				if (!remotePath) {
					let source;
					let data;
					try {
						source = path.resolve(fact.workspaceDir ?? localWorkspace ?? params.remoteWorkspaceDir, await resolveMediaReferenceLocalPath(ref.resolved));
						assertCurrent();
						data = await readLocalMediaFile(source, localRoots, { maxBytes: Math.max(MAX_IMAGE_BYTES, MEDIA_MAX_BYTES) });
					} catch (error) {
						assertCurrent();
						if (input === current) throw error;
						logWarn("worker-media: Omitted an unavailable historical attachment source");
						continue;
					}
					assertCurrent();
					const identity = createHash("sha256").update(source).digest("hex");
					remotePath = await stageFile(data, identity, path.basename(source));
					for (const alias of [
						ref.raw,
						ref.resolved,
						source,
						fact.path,
						fact.url
					]) if (alias) projectedPaths.set(alias, remotePath);
				}
				input.files.add(remotePath);
			}
			for (const image of input.unownedImages) {
				const data = Buffer.from(image.data, "base64");
				const identity = createHash("sha256").update(data).digest("hex");
				input.files.add(await stageFile(data, identity, "image"));
			}
		}
		if (staging) {
			if (!params.tunnel.stageAttachments) throw new Error("Worker transport cannot stage attachments; update and reprovision the worker.");
			assertCurrent();
			await params.tunnel.stageAttachments({
				localPath: staging.dir,
				isAuthorized: params.isAuthorized,
				signal
			});
		}
	} finally {
		await staging?.cleanup();
	}
	assertCurrent();
	const projectText = (text) => {
		let projected = text;
		for (const [source, destination] of projectedPaths) projected = projected.replaceAll(source, destination);
		return projected;
	};
	const projectInput = (input) => {
		const parts = input.parts.map((part) => part.type === "text" ? {
			...cloneTextContent(part),
			text: projectText(part.text)
		} : cloneImageContent(part));
		const text = parts.flatMap((part) => part.type === "text" ? [part.text] : []).join("\n");
		const notes = [...input.files].filter((file) => !text.includes(file)).map((file) => `[media attached: ${file}]`).join("\n");
		if (notes) {
			const index = parts.findIndex((part) => part.type === "text");
			const part = parts[index];
			if (part?.type === "text") parts[index] = {
				...part,
				text: [part.text, notes].filter(Boolean).join("\n")
			};
			else parts.unshift({
				type: "text",
				text: notes
			});
		}
		return parts;
	};
	const prompt = projectInput(current);
	if (!isWorkerTranscriptMessageFrameSafe({
		role: "user",
		content: prompt,
		timestamp: Date.now()
	})) throw new Error("Cloud worker input exceeds its 25 MiB image or 64 KiB text/control limit; send fewer or smaller attachments.");
	return {
		images: currentImages.images,
		imageFactIndexes: currentImages.imageFactIndexes,
		prompt: prompt.length === 1 && prompt[0]?.type === "text" ? prompt[0].text : prompt,
		history: history.map((message) => {
			const input = message.role === "user" ? replay.get(message) : void 0;
			return input ? Object.assign({}, message, { content: projectInput(input) }) : message;
		})
	};
}
//#endregion
//#region src/gateway/worker-environments/worker-turn-payload.ts
function buildWorkerAgentRuntimeIdentity(params) {
	const { turn } = params;
	return {
		agentId: params.agentId,
		sessionKey: params.sessionKey,
		operationalRunInstance: params.admittedRunContext.operationalRunInstance,
		executionIdentityToken: params.admittedRunContext.executionIdentityToken,
		turnSourceChannel: turn.messageChannel ?? turn.messageProvider,
		turnSourceTo: turn.currentMessagingTarget ?? turn.currentChannelId,
		turnSourceAccountId: turn.agentAccountId,
		turnSourceThreadId: turn.currentThreadTs,
		gatewayUiCommandTarget: turn.gatewayUiCommandTarget,
		workerTurnClaim: params.turnClaim
	};
}
async function prepareWorkerAgentRuntimeIdentity(params) {
	const admittedRunContext = await resolvePreparedRunAdmission({
		runId: params.turn.runId,
		runtimeKind: "worker",
		runtimeInstanceId: params.runtimeInstanceId,
		admittedRunContext: params.turn.admittedRunContext,
		preparedRunAdmission: params.turn.preparedRunAdmission
	});
	const assertActive = resolveAdmittedRunActiveAssertion(admittedRunContext, params.turn.abortSignal);
	if (!assertActive) throw new Error("Worker turn has no active admitted execution authority");
	assertActive();
	const runtimeIdentity = buildWorkerAgentRuntimeIdentity({
		...params,
		admittedRunContext
	});
	const takeFinishingOutcome = bindWorkerTurnOwner(params.placements, params.turnClaim, runtimeIdentity.executionIdentityToken, admittedRunContext.operationalRunInstance, {
		agentId: params.agentId,
		sessionKey: params.sessionKey
	}, assertActive, params.turn.prepareAssistantTranscriptMessage, readAdmittedRunOperatorAuthority(admittedRunContext));
	return {
		operationalRunInstance: admittedRunContext.operationalRunInstance,
		runtimeIdentity,
		assertActive,
		takeFinishingOutcome
	};
}
function emitProviderReplayRejected(config, details) {
	if (isDiagnosticsEnabled(config)) emitTrustedDiagnosticEvent({
		type: "payload.large",
		surface: "worker.provider-replay",
		action: "rejected",
		...details
	});
}
function windowInitialMessages(messages) {
	const windowed = windowWorkerReplayMessages(messages, WORKER_INFERENCE_MAX_CONTEXT_MESSAGES - 1);
	if (windowed.kind === "provider-replay-unavailable") return windowed;
	const projected = [];
	for (const message of windowed.messages) {
		const result = toWorkerTranscriptMessage(message, "inference");
		if (!result) continue;
		if (result.kind === "provider-replay-unavailable") return result;
		projected.push(result.message);
	}
	return {
		kind: "complete",
		messages: projected
	};
}
/** Fits replay context before minting the exact worker-bound identity bearer. */
async function fitLaunchDescriptorWithRuntimeIdentity(params) {
	const tokenBytes = measureAgentRuntimeIdentityTokenBytes(params.runtimeIdentity);
	const plan = fitLaunchDescriptor((messages) => params.build("x".repeat(tokenBytes), messages), params.messages, params.measure);
	if (plan.kind !== "launch") return plan;
	const token = await mintAgentRuntimeIdentityToken(params.runtimeIdentity);
	if (Buffer.byteLength(token, "utf8") !== tokenBytes) throw new Error("Agent runtime identity changed while preparing worker launch");
	return {
		kind: "launch",
		plan: {
			...plan.plan,
			assignment: {
				...plan.plan.assignment,
				agentRuntimeIdentityToken: token
			}
		}
	};
}
function fitLaunchDescriptor(build, messages, measure) {
	let initialMessages = fitWorkerReplayImages(messages, (candidate) => measure(build(candidate))) ?? messages;
	while (true) {
		const plan = build(initialMessages);
		const bytes = measure(plan);
		if (bytes <= WORKER_PROTOCOL_MAX_INFERENCE_PAYLOAD_BYTES) return {
			kind: "launch",
			plan
		};
		const replayIndex = initialMessages.findLastIndex((message) => message.role === "assistant" && message.providerReplay !== void 0);
		if (replayIndex === 0) return {
			kind: "provider-replay-unavailable",
			reason: "provider-replay-launch-payload-limit",
			bytes,
			limitBytes: WORKER_PROTOCOL_MAX_INFERENCE_PAYLOAD_BYTES
		};
		const nextTurn = initialMessages.findIndex((message, index) => index > 0 && message.role === "user");
		const nextStart = replayIndex > 0 && (nextTurn < 0 || nextTurn > replayIndex) ? replayIndex : nextTurn;
		if (nextStart < 0) throw new Error("Worker turn context exceeds the launch descriptor payload limit");
		initialMessages = initialMessages.slice(nextStart);
	}
}
function parseRuntimeResult(stdout) {
	let value;
	try {
		value = JSON.parse(stdout.trim());
	} catch (error) {
		throw new Error("Worker process returned invalid output", { cause: error });
	}
	const result = parseWorkerRuntimeResult(value);
	if (!result) throw new Error("Worker process returned invalid output");
	if (result.status === "not-started") throw new Error(result.errorText);
	return result;
}
function assistantText(message) {
	if (message.role !== "assistant") return "";
	return message.content.flatMap((part) => part.type === "text" ? [part.text] : []).join("");
}
function buildWorkerTurnResult(params) {
	const usageAccumulator = createUsageAccumulator();
	const assistants = params.messages.filter((message) => message.role === "assistant");
	let lastRunPromptUsage;
	for (const assistant of assistants) {
		const usage = normalizeUsage(assistant.usage);
		mergeUsageIntoAccumulator(usageAccumulator, usage);
		if (hasNonzeroUsage(usage)) lastRunPromptUsage = usage;
	}
	const lastAssistant = assistants.at(-1);
	const usageMeta = buildUsageAgentMetaFields({
		usageAccumulator,
		latestUsage: lastAssistant?.usage,
		lastRunPromptUsage
	});
	const reportedModelRef = resolveReportedModelRef({
		...params.modelRef,
		assistant: lastAssistant
	});
	const replyText = params.workspaceConflictSummary === void 0 ? params.text : params.text ? `${params.text}\n\n${params.workspaceConflictSummary}` : params.workspaceConflictSummary;
	return {
		...replyText ? { payloads: [{ text: replyText }] } : {},
		meta: {
			durationMs: params.durationMs,
			agentMeta: {
				sessionId: params.sessionId,
				sessionFile: params.sessionFile,
				provider: reportedModelRef.provider,
				model: reportedModelRef.model,
				...usageMeta
			},
			stopReason: params.terminal.stopReason,
			finalAssistantVisibleText: resolveFinalAssistantVisibleText(params.terminal),
			finalAssistantRawText: resolveFinalAssistantRawText(params.terminal)
		}
	};
}
function resolveTurnModelRef(params) {
	const explicitProvider = params.provider?.trim();
	const explicitModel = params.model?.trim();
	const defaults = explicitProvider && explicitModel ? void 0 : resolveDefaultModelForAgent({
		cfg: params.config ?? {},
		agentId: params.agentId
	});
	return {
		provider: explicitProvider ?? defaults?.provider ?? "",
		model: explicitModel ?? defaults?.model ?? ""
	};
}
function assertSupportedTurn(params) {
	if (params.clientTools?.length) throw new Error("Cloud worker turns do not support client-provided tools");
	const modelRef = resolveTurnModelRef(params);
	const explicitRuntime = normalizeOptionalAgentRuntimeId(params.agentHarnessId) ?? normalizeOptionalAgentRuntimeId(params.agentHarnessRuntimeOverride);
	const runtime = explicitRuntime && !isDefaultAgentRuntimeId(explicitRuntime) ? explicitRuntime : resolveEffectiveAgentRuntime({
		cfg: params.config ?? {},
		provider: modelRef.provider,
		modelId: modelRef.model,
		agentId: params.agentId,
		sessionKey: params.sessionKey
	});
	if (runtime !== "openclaw") throw new Error(`Cloud worker turns require the OpenClaw runtime, not ${runtime}`);
	return modelRef;
}
//#endregion
//#region src/gateway/worker-environments/worker-turn-execution.ts
async function executeWorkerTurn(params) {
	const { placement, turn } = params;
	const modelRef = assertSupportedTurn(turn);
	const environment = params.environments.get(placement.environmentId);
	const bootstrapReceipt = environment?.bootstrapReceipt;
	if (environment?.error === "Worker build does not match the current Gateway build; redispatch the session so its worker can bootstrap the current build before retrying.") throw new StaleWorkerBuildError();
	if (!environment || environment.state !== "attached" || environment.ownerEpoch !== placement.activeOwnerEpoch || !bootstrapReceipt || bootstrapReceipt.bundleHash !== placement.workerBundleHash || environment.attachedSessionIds.length !== 1 || environment.attachedSessionIds[0] !== placement.sessionId) throw new Error("Active worker placement does not match its attached environment");
	if (!supportsCurrentWorkerLaunch(bootstrapReceipt)) throw new Error("Active worker bundle lacks the current launch capability; reprovision the worker before launch");
	await recoverWorkspaceBeforeTurn(params);
	const github = await prepareWorkerGitHubBinding({
		sessionId: placement.sessionId,
		sessionKey: placement.sessionKey,
		agentId: placement.agentId,
		assertCurrent: () => params.placements.validateTurnClaim(params.turnClaim)
	});
	const startedAt = Date.now();
	await turn.onExecutionStarted?.({ lifecycleGeneration: turn.lifecycleGeneration });
	params.assertRunCurrent?.();
	turn.abortSignal?.throwIfAborted();
	if (!params.placements.validateTurnClaim(params.turnClaim)) throw new Error("Worker turn claim is no longer current");
	turn.onExecutionPhase?.({
		phase: "runner_entered",
		backend: "cloud-worker"
	});
	const transcriptTarget = resolveWorkerTurnTranscriptTarget(turn);
	const recorder = turn.userTurnTranscriptRecorder;
	const assertContextCurrent = () => {
		params.assertRunCurrent?.();
		turn.abortSignal?.throwIfAborted();
		if (recorder?.isBlocked()) throw new Error("Cloud worker turn input is blocked");
		if (!params.placements.validateTurnClaim(params.turnClaim)) throw new Error("Worker turn claim changed during context preparation");
		resolveWorkerTurnTranscriptTarget({
			...transcriptTarget,
			sessionTarget: transcriptTarget
		});
	};
	assertContextCurrent();
	if (recorder?.hasRuntimePersistencePending()) {
		await recorder.waitForRuntimePersistence();
		assertContextCurrent();
	}
	if (recorder && turn.suppressNextUserMessagePersistence !== true && !recorder.hasPersisted()) {
		const persisted = await recorder.persistApproved({ cwd: params.workspace.kind === "local" ? params.workspace.path : placement.remoteWorkspaceDir });
		if (persisted) turn.onUserMessagePersisted?.(persisted.message);
		assertContextCurrent();
	}
	const receipt = recorder?.getAdmissionReceipt();
	const admission = receipt ? { ...receipt } : void 0;
	if (recorder && !admission) throw new Error("Cloud worker turn has no readable canonical user admission");
	const userMessageAlreadyPersisted = admission !== void 0 || turn.suppressNextUserMessagePersistence === true;
	turn.onExecutionPhase?.({
		phase: "model_resolution",
		backend: "cloud-worker",
		provider: modelRef.provider,
		model: modelRef.model
	});
	const manager = userMessageAlreadyPersisted ? await SessionManager.openModelContextAsync(transcriptTarget, {
		admission,
		signal: turn.abortSignal
	}) : await SessionManager.openAsync(transcriptTarget, void 0, void 0, turn.abortSignal);
	assertContextCurrent();
	const contextMessages = convertToLlm(manager.buildSessionContext().messages);
	const leaf = manager.getLeafEntry();
	const history = !admission && userMessageAlreadyPersisted && leaf?.type === "message" && leaf.message.role === "user" ? contextMessages.slice(0, -1) : contextMessages;
	let baseLeafId = admission?.entryId ?? manager.getLeafId();
	assertContextCurrent();
	const credential = await params.environments.acquireTurnCredential(params.turnClaim);
	const tunnel = await waitForTurnOperation({
		operation: params.environments.startTunnel({
			environmentId: placement.environmentId,
			ownerEpoch: placement.activeOwnerEpoch
		}),
		...turn.abortSignal ? { signal: turn.abortSignal } : {},
		timeoutMs: turn.timeoutMs
	});
	const portalAvailable = Boolean(environment.nodeDeviceId) && environment.sshEndpoint === null && await params.environments.supportsNodePortal?.(placement.environmentId, placement.activeOwnerEpoch) === true;
	const reasoning = mapThinkingLevelForProvider(turn.thinkLevel);
	const { browser, computer, preparedComputer, toolAuthority } = await prepareWorkerDesktopLaunchPlan({
		desktop: environment.desktop,
		protocolFeatures: bootstrapReceipt.protocolFeatures,
		prepareComputer: () => params.environments.prepareComputer?.(params.turnClaim),
		modelRef,
		turn,
		portalAvailable
	});
	params.placements.authorizeWorkerTurnTools(params.turnClaim, toolAuthority.allowedToolNames);
	const { operationalRunInstance, runtimeIdentity, assertActive, takeFinishingOutcome } = await prepareWorkerAgentRuntimeIdentity({
		agentId: placement.agentId,
		runtimeInstanceId: placement.environmentId,
		placements: params.placements,
		sessionKey: placement.sessionKey,
		turn,
		turnClaim: params.turnClaim
	});
	preparedComputer?.bind(operationalRunInstance);
	const authority = getActiveAgentRunDelegatedAuthority(operationalRunInstance);
	const authorityAbort = new AbortController();
	const signal = turn.abortSignal ? AbortSignal.any([turn.abortSignal, authorityAbort.signal]) : authorityAbort.signal;
	const cancel = () => authorityAbort.abort(/* @__PURE__ */ new Error("Worker turn authority closed"));
	const stopWatchingRun = registerAgentRunDelegatedAuthorityClosedHandler((closed) => {
		if (closed === authority) cancel();
	});
	const stopWatchingClaim = params.placements.registerTurnClaimClosedHandler((closed) => {
		if (closed.owner.kind === "worker" && sameWorkerSessionTurnClaim(closed, params.turnClaim)) cancel();
	});
	let revokeSkillAuthoring;
	try {
		const isAuthorized = () => {
			try {
				assertActive();
				signal.throwIfAborted();
				const current = params.environments.get(placement.environmentId);
				return params.placements.validateTurnClaim(params.turnClaim) && current?.state === "attached" && current.ownerEpoch === placement.activeOwnerEpoch && current.attachedSessionIds.length === 1 && current.attachedSessionIds[0] === placement.sessionId;
			} catch {
				return false;
			}
		};
		if (turn.skillLibraryAuthoring && toolAuthority.allowedToolNames.includes("skill_workshop")) {
			if (!bootstrapReceipt.protocolFeatures.includes("worker-skill-workshop-v1")) throw new StaleWorkerBuildError();
			const assertSkillAuthority = () => {
				if (!isAuthorized() || !params.placements.isWorkerTurnToolAuthorized(params.turnClaim, "skill_workshop")) throw new Error("Worker personal authoring authority closed.");
			};
			const capability = turn.skillLibraryAuthoring;
			revokeSkillAuthoring = registerWorkerSkillAuthoring(params.turnClaim, createLibrarySkillWorkshopTool({
				...capability,
				defaultTarget: "personal",
				invoke: (input) => withGatewayToolCallerIdentity({
					agentId: placement.agentId,
					sessionKey: placement.sessionKey,
					operationalRunInstance,
					receiptAuthority: () => {
						assertSkillAuthority();
						return true;
					},
					workerTurnClaim: params.turnClaim
				}, () => capability.invoke(input))
			}), assertSkillAuthority);
		}
		const media = await prepareWorkerTurnMedia({
			turn,
			history,
			workspace: params.workspace,
			remoteWorkspaceDir: placement.remoteWorkspaceDir,
			tunnel,
			isAuthorized,
			signal
		});
		const skillResources = await prepareSkillResourceDelivery(turn.skillsSnapshot, () => {
			if (!isAuthorized()) throw new Error("Worker turn lost authority before skill resource delivery.");
		}, turn.explicitSkillSelections, turn.workspaceDir);
		if (skillResources && !bootstrapReceipt.protocolFeatures.includes("skill-resources-v1")) throw new StaleWorkerBuildError();
		if (!userMessageAlreadyPersisted && !recorder) {
			const canonical = buildPersistedUserTurnMessage({
				text: turn.transcriptPrompt ?? turn.prompt,
				media: turn.media,
				mediaImageLayout: { slots: media.imageFactIndexes.map((factIndex) => ({
					kind: "inline",
					...factIndex === null ? {} : { factIndex }
				})) }
			});
			const message = {
				...canonical,
				content: [{
					type: "text",
					text: turn.transcriptPrompt ?? turn.prompt
				}, ...media.images],
				__openclaw: {
					...canonical["__openclaw"],
					mediaImageBlockFactIndexes: media.imageFactIndexes
				}
			};
			baseLeafId = await withSessionManagerWrite(manager, () => {
				params.assertRunCurrent?.();
				if (!isAuthorized()) throw new Error("Worker turn authority changed before transcript write");
				resolveWorkerTurnTranscriptTarget({
					...transcriptTarget,
					sessionTarget: transcriptTarget
				});
				return manager.appendMessage(message);
			});
			turn.onUserMessagePersisted?.(message);
		}
		const initialMessagePlan = windowInitialMessages(media.history);
		if (initialMessagePlan.kind === "provider-replay-unavailable") {
			const details = initialMessagePlan.details;
			emitProviderReplayRejected(turn.config, "bytes" in details ? details : {
				count: details.messageCount,
				reason: details.reason
			});
			throw new WorkerTurnExecutionError(WORKER_PROVIDER_REPLAY_LOCAL_RETRY_MESSAGE);
		}
		const { bundleHash, openclawVersion, protocolFeatures } = bootstrapReceipt;
		if (!tunnel.launchTurn) throw new Error("Worker tunnel does not support worker turns");
		await prepareActiveNodeContext();
		assertContextCurrent();
		const systemPrompt = [turn.extraSystemPrompt, buildActiveNodeContextText()].filter(Boolean).join("\n\n");
		const launchPlan = await fitLaunchDescriptorWithRuntimeIdentity({
			runtimeIdentity,
			measure: (plan) => tunnel.measureLaunchTurn(plan, params.turnClaim),
			messages: initialMessagePlan.messages,
			build: (agentRuntimeIdentityToken, windowedMessages) => parseWorkerLaunchPlan({
				version: 4,
				admission: {
					environmentId: placement.environmentId,
					credential: credential.credential,
					sessionId: placement.sessionId,
					ownerEpoch: placement.activeOwnerEpoch,
					rpcSetVersion: credential.rpcSetVersion,
					handshake: {
						bundleHash,
						openclawVersion,
						protocolFeatures
					}
				},
				assignment: {
					agentId: placement.agentId,
					operationalRunInstance,
					agentRuntimeIdentityToken,
					runId: turn.runId,
					turnId: randomUUID(),
					prompt: media.prompt,
					suppressPromptTranscript: true,
					workspaceDir: placement.remoteWorkspaceDir,
					...github ? { github } : {},
					...skillResources ? { skillResources } : {},
					...turn.skillLibraryAuthoring && toolAuthority.allowedToolNames.includes("skill_workshop") ? { skillAuthoring: { multipleProfiles: turn.skillLibraryAuthoring.multipleProfiles } } : {},
					...turn.permissionMode ? {
						permissionMode: turn.permissionMode,
						workerContainmentRoot: placement.remoteWorkspaceDir
					} : {},
					modelRef,
					inferenceOptions: reasoning ? { reasoning } : {},
					systemPrompt,
					initialMessages: windowedMessages,
					transcript: {
						baseLeafId,
						nextSeq: (placement.lastTranscriptAckCursor ?? 0) + 1
					},
					liveEvents: {
						ackedSeq: placement.lastLiveEventAckCursor ?? 0,
						nextSeq: (placement.lastLiveEventAckCursor ?? 0) + 1
					},
					toolAuthority,
					...browser ? { browser } : {},
					...computer ? { computer } : {}
				}
			})
		});
		if (launchPlan.kind === "provider-replay-unavailable") {
			emitProviderReplayRejected(turn.config, {
				bytes: launchPlan.bytes,
				limitBytes: launchPlan.limitBytes,
				reason: launchPlan.reason
			});
			throw new WorkerTurnExecutionError(skillResources ? "The selected skills and conversation exceed this worker transport limit. Detach some session skills or start a shorter session, then retry." : WORKER_PROVIDER_REPLAY_LOCAL_RETRY_MESSAGE);
		}
		if (!isAuthorized()) throw new Error("Worker turn authority changed while preparing its launch");
		recorder?.markSentToProvider?.();
		turn.onExecutionPhase?.({
			phase: "attempt_dispatch",
			backend: "cloud-worker"
		});
		const handoffAbort = new AbortController();
		let handoffError;
		let handoffPending;
		let dispatchReady = false;
		const onDispatchReady = () => {
			if (dispatchReady) return;
			dispatchReady = true;
			params.onHandoff();
			turn.onExecutionPhase?.({
				phase: "process_spawned",
				backend: "cloud-worker"
			});
			handoffPending = (async () => {
				try {
					if (!await params.environments.acknowledgeCredentialDelivery(credential)) handoffError = /* @__PURE__ */ new Error("Cloud worker credential owner changed during process handoff");
				} catch (error) {
					handoffError = new Error("Cloud worker credential handoff failed", { cause: error });
				}
				if (handoffError) handoffAbort.abort(handoffError);
			})();
		};
		let processResult;
		try {
			processResult = await tunnel.launchTurn({
				plan: launchPlan.plan,
				turnClaim: params.turnClaim,
				timeoutMs: turn.timeoutMs,
				credentialExpiresAtMs: credential.expiresAtMs,
				signal: AbortSignal.any([signal, handoffAbort.signal]),
				onDispatchReady
			});
		} finally {
			await handoffPending;
		}
		if (environment.nodeDeviceId && environment.sshEndpoint === null) params.onTerminal();
		if (handoffError) throw handoffError;
		if (!dispatchReady) throw new Error("Cloud worker launch completed before transport dispatch");
		if (processResult.code !== 0 || processResult.signal !== null || processResult.killed) {
			const detail = truncateUtf16Safe(redactSensitiveText(processResult.stderr, { mode: "tools" }).replace(/\s+/gu, " ").trim(), 400);
			throw new Error(detail ? `Cloud worker process failed before completing the turn: ${detail}` : "Cloud worker process failed before completing the turn");
		}
		const runtimeResult = parseRuntimeResult(processResult.stdout);
		if (runtimeResult.status === "fenced") throw new Error(`Cloud worker turn was fenced: ${runtimeResult.reason}`);
		const workerTurnFailed = runtimeResult.status === "failed";
		const completed = await SessionManager.openAsync(transcriptTarget);
		if (!params.placements.validateWorkspaceResultClaim(params.turnClaim)) throw new Error("Cloud worker result lost its placement owner during transcript hydration");
		resolveWorkerTurnTranscriptTarget({
			...transcriptTarget,
			sessionTarget: transcriptTarget
		});
		const currentPlacement = params.placements.get(placement.sessionId);
		if (runtimeResult.transcriptLeafId !== completed.getLeafId() || runtimeResult.transcriptNextSeq !== (currentPlacement?.lastTranscriptAckCursor ?? 0) + 1) throw new Error(`Cloud worker result does not match its committed transcript acknowledgement (leaf=${runtimeResult.transcriptLeafId ?? "none"}/${completed.getLeafId() ?? "none"}, nextSeq=${runtimeResult.transcriptNextSeq}/${(currentPlacement?.lastTranscriptAckCursor ?? 0) + 1})`);
		const terminal = runtimeResult.transcriptLeafId ? completed.getEntry(runtimeResult.transcriptLeafId) : void 0;
		if (!terminal || terminal.type !== "message" || terminal.message.role !== "assistant") throw new Error("Cloud worker completed without a terminal assistant transcript message");
		const text = assistantText(terminal.message);
		const baseIndex = completed.getBranch().findIndex((entry) => entry.id === baseLeafId);
		const workerMessages = completed.getBranch().slice(baseIndex + 1).flatMap((entry) => entry.type === "message" ? [entry.message] : []);
		const finishing = workerTurnFailed ? takeFinishingOutcome(credential.deliveryId) : void 0;
		const workerFailure = workerTurnFailed ? new WorkerTurnExecutionError(finishing?.error ?? "Cloud worker turn failed") : void 0;
		if (workerFailure && finishing?.replayInvalid) recordModelFallbackStop(workerFailure);
		const workspaceConflict = await reconcileWorkspaceAfterTurn({
			placement,
			placements: params.placements,
			turnClaim: params.turnClaim,
			workspaceOperations: params.workspaceOperations,
			workspace: params.workspace,
			transcriptTarget,
			tunnel,
			...params.prepareAcceptedWorkspacePublication ? { prepareAcceptedWorkspacePublication: params.prepareAcceptedWorkspacePublication } : {},
			...params.publishAcceptedWorkspace ? { publishAcceptedWorkspace: params.publishAcceptedWorkspace } : {}
		}).catch((reconciliationError) => {
			if (workerFailure) throw workerWorkspaceFailure(workerFailure, reconciliationError);
			throw reconciliationError;
		});
		if (workspaceConflict) {
			const reportedWorkspaceConflict = workspaceConflict;
			await Promise.resolve().then(() => turn.onAgentEvent?.({
				stream: "assistant",
				data: {
					text: text ? `${text}\n\n${reportedWorkspaceConflict.summary}` : reportedWorkspaceConflict.summary,
					delta: `${text ? "\n\n" : ""}${reportedWorkspaceConflict.summary}`
				}
			})).catch(() => void 0);
		}
		if (workerFailure) throw workerFailure;
		return buildWorkerTurnResult({
			messages: workerMessages,
			modelRef,
			terminal: terminal.message,
			durationMs: Date.now() - startedAt,
			sessionId: placement.sessionId,
			sessionFile: turn.sessionFile,
			text,
			workspaceConflictSummary: workspaceConflict?.summary
		});
	} finally {
		revokeSkillAuthoring?.();
		stopWatchingClaim();
		stopWatchingRun();
	}
}
//#endregion
export { executeWorkerTurn };
