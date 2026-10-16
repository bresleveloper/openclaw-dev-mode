import { a as resolveGlobalSingleton } from "./global-singleton-0m-JziJW.mjs";
import { r as getAsyncWorkSignal } from "./async-work-scope-BYeX3gh6.mjs";
import { t as containsAsciiControlCharacter } from "./string-normalization-CECOqf64.mjs";
import { c as isPathInside$1, m as readLocalFileFromRoots, x as resolveLocalPathFromRootsSync } from "./fs-safe-BUXBSN-4.mjs";
import { k as getActiveDiagnosticTraceContext } from "./diagnostic-events-BADdmgZf.mjs";
import { r as sha256HexPrefixCore } from "./node-crypto-BG4u3UnX.mjs";
import "./crypto-digest-y6oZN-_F.mjs";
import { i as normalizePathPrepend, n as findPathKey, t as applyPathPrepend } from "./path-prepend-Cv1ulMUG.mjs";
import { _ as resolveSessionAgentIdStrict } from "./agent-scope-CG17uXFn.mjs";
import { a as getGatewayContextResolver } from "./gateway-context-binding-VqB7gkMe.mjs";
import { a as getPluginRuntimeGatewayRequestScope, c as withPluginRuntimeGatewayRequestScope } from "./gateway-request-scope-BSmCVVpP.mjs";
import { s as isToolExecutionAllowed } from "./tool-policy-shared-DWHChhWM.mjs";
import { d as getAgentRunLifecycleGeneration } from "./agent-run-registry-BaxMDLZF.mjs";
import { c as emitAgentRunOutputTokens, h as registerAgentEventLifecycleRotationHandler } from "./agent-events-GvNTkbe3.mjs";
import { a as capturePluginLifecycleAuthority } from "./registry-lifecycle-Dekhrk9Y.mjs";
import { l as getActivePluginRegistry } from "./runtime-D4MkflNJ.mjs";
import { a as withInstallationTarget, n as getInstallationTarget, r as installationTargetEnv } from "./installation-target-context-BOfhXm_n.mjs";
import { s as openOpenClawAgentDatabase } from "./openclaw-agent-db-DBug3LUA.mjs";
import { b as runBeforeToolCallHook, c as rewrapToolWithBeforeToolCallHook } from "./agent-tools.before-tool-call-C25aU-xP.mjs";
import { s as getOwnedSessionTranscriptWriterFence } from "./transcript-write-context-m7NE2aEm.mjs";
import { o as getActiveSecretsRuntimeConfigSnapshot } from "./runtime-state-D5wZ6Dom.mjs";
import { _ as retainAdmittedRunBeforeToolCallRecovery, c as getAdmittedRunDelegatedAuthority, f as readAdmittedRunOperatorAuthority, r as bindOperatorModelExecution, t as assertAdmittedRunOperatorAuthority } from "./admitted-run-context-QJnFIxUZ.mjs";
import { d as readPersistedMediaFacts } from "./media-facts-CJdQ4R61.mjs";
import { o as waitForSessionTranscriptProjection } from "./session-transcript-reconcile-Dv1lK4ND.mjs";
import { f as sessionTranscriptIndexNeedsReconcile } from "./session-transcript-index-FbEuN6S5.mjs";
import { c as getUserTurnTranscriptAdmissionOwner } from "./session-transcript-read-fence-DfxRHzep.mjs";
import { a as loadSessionEntry, o as loadSessionEntryReadOnly } from "./session-accessor.sqlite-entry-AwYVLytL.mjs";
import { p as publishTranscriptUpdate } from "./session-history-eviction-Cj2-Mfrh.mjs";
import { h as redactTranscriptMessage } from "./session-accessor.sqlite-transcript-store-CV2CGkbJ.mjs";
import { u as rewriteTranscriptMessageAtAnchor } from "./session-accessor-cUVSaeKy.mjs";
import { n as readActiveTranscriptEntryAnchor } from "./session-accessor.sqlite-transcript-anchor-eRtZH9vP.mjs";
import { a as sessionMatchesExpectedTranscriptTurn } from "./session-turn.kernel-BgyMSLiQ.mjs";
import { r as resolveSessionTranscriptDatabasePath } from "./session-accessor.transcript-target-CpxKGy_2.mjs";
import { g as throwAgentRunRestartAbortReason } from "./run-termination-DGv2EKii.mjs";
import { i as copyAgentToolMetadata, u as createCronScheduledToolProjection } from "./agent-tool-metadata-BiQWQ4ti.mjs";
import { a as attachInternalToolExecutionPreparer, p as getInternalToolExecutionPreparer } from "./internal-hooks-Cr0v44EY.mjs";
import { a as getGatewayToolCallerIdentity, d as withGatewayToolCallerIdentity, h as wrapToolWithGatewayCallerIdentity, n as createAdmittedGatewayToolCallerIdentity, u as withGatewayToolApprovalOwner } from "./gateway-caller-context-DWr-fdGt.mjs";
import { n as resolveEffectiveToolFsWorkspaceOnly } from "./tool-fs-policy-DAGJ2iyt.mjs";
import { d as markToolExecutionNotStarted } from "./tool-result-error-DGhCl3TG.mjs";
import { t as callGatewayTool } from "./gateway-w2F8o2pH.mjs";
import { t as bindAgentToolSourceExecutionGuard } from "./agent-tool-source-execution-guard-Mz8w3cgU.mjs";
import { a as registerAgentHarnessScheduledToolProjectionCapability, d as withAgentQuestionAnswerAuthority, l as resolveAgentQuestionAnswerAuthority, o as registerAgentHarnessTtsProvenanceTransferCapability, r as registerAgentHarnessBeforeToolCallRetention } from "./host-private-capabilities-D9XrALSb.mjs";
import { t as buildActiveNodeContextText } from "./active-node-context-DpQMef3G.mjs";
import { t as registerMcpToolApprovalBinding } from "./mcp-tool-approval-binding-Cidlw1Iq.mjs";
import { s as prepareSystemRunMutableFileApproval } from "./system-run-approval-binding-D_QCHpDn.mjs";
import { t as buildAgentHookContextChannelFields } from "./hook-agent-context-Bx9S6KFK.mjs";
import { t as resolveSkillResourceCandidates } from "./resource-candidates-BYKrDnY1.mjs";
import { m as wrapToolWithAbortSignal } from "./tool-contract-error-EveBd172.mjs";
import { n as createOpenClawCodingToolsInternal } from "./agent-tools-BnAlih5u.mjs";
import { n as resolveExecToolConfig } from "./lazy-exec-tool-DaqWwvlf.mjs";
import { l as prepareGitHubToolEnvironment } from "./github-tool-identity-2S4ost1l.mjs";
import { s as MAX_SKILL_INSTRUCTION_BYTES } from "./openclaw-tools-Dd40cGRU.mjs";
import { t as resolveToolLoopDetectionConfig } from "./tool-loop-detection-config-CBwhju1Y.mjs";
import { o as transferCoreTtsToolResultProvenance, r as getCoreTtsToolResultMediaUrls } from "./tts-tool-result-provenance-CHcSX7Wg.mjs";
import { t as log } from "./logger-BpegRAAz.mjs";
import { t as runBestEffortCallback } from "./embedded-agent-subscribe.callback-BBye3ou6.mjs";
import { t as bindHarnessReplyMedia } from "./reply-media-DWnUcmc6.mjs";
import { i as resolveSandboxSkillRuntimeInputs } from "./sandbox-skills-8n2dfUP3.mjs";
import { t as prepareInstalledSkillCatalog } from "./installed-skill-runtime-XGedGv38.mjs";
import { t as formatHarnessApprovalPresentation } from "./native-hook-relay-approval-presentation-I_71t5cb.mjs";
import path from "node:path";
import { isDeepStrictEqual } from "node:util";
import { isPathInsideWithRealpath } from "@openclaw/fs-safe/path";
//#region src/sessions/user-turn-transcript-annotation.ts
/** Core-only binding performed by the harness host before invoking plugin code. */
function bindUserTurnTranscriptAnnotation(params) {
	const owner = getUserTurnTranscriptAdmissionOwner(params.recorder);
	const receipt = owner?.receipt();
	const message = owner?.message();
	if (!owner || !receipt || !message || owner.blocked() || message.excludeFromContext === true) return;
	let admission = structuredClone(receipt);
	let admittedMessage = structuredClone(message);
	const target = { ...params.target };
	const selected = loadSessionEntry({
		...target,
		readConsistency: "latest"
	});
	const fence = getOwnedSessionTranscriptWriterFence({ sessionTarget: target });
	if (target.sessionId !== admission.sessionId || target.sessionKey !== admission.sessionKey || target.agentId !== admission.agentId || resolveSessionTranscriptDatabasePath(target) !== admission.storePath || !selected || selected.sessionId !== admission.sessionId || selected.activeWriterRunId !== void 0 && selected.activeWriterRunId !== params.runId) return;
	const expectedLifecycleRevision = target.expectedLifecycleRevision ?? fence?.expectedLifecycleRevision ?? selected.lifecycleRevision ?? null;
	const expectedWriterRunId = target.expectedWriterRunId ?? fence?.expectedWriterRunId;
	const assertCurrent = () => {
		params.assertCurrent();
		const current = loadSessionEntry({
			...target,
			readConsistency: "latest"
		});
		const { logicalTurnId: _logicalTurnId, role: _role, ...anchor } = admission;
		if (params.abortSignal?.aborted || owner.blocked() || !isDeepStrictEqual(owner.receipt(), admission) || !isDeepStrictEqual(owner.message(), admittedMessage) || admittedMessage["__openclaw"]?.steerTargetRunId !== void 0 || !sessionMatchesExpectedTranscriptTurn(current ? { entry: current } : void 0, {
			expectedSessionId: admission.sessionId,
			expectedLifecycleRevision,
			expectedWriterRunId
		}) || fence?.expectedWriterRunId !== void 0 && current?.activeWriterRunId !== fence.expectedWriterRunId || fence?.expectedLifecycleRevision !== void 0 && current?.lifecycleRevision !== fence.expectedLifecycleRevision || current?.activeWriterRunId !== selected.activeWriterRunId || sessionTranscriptIndexNeedsReconcile(openOpenClawAgentDatabase({
			agentId: admission.agentId,
			path: admission.storePath
		}).db, admission.sessionId) || !isDeepStrictEqual(readActiveTranscriptEntryAnchor(admission), anchor)) throw new Error("current user admission is no longer available for native annotation");
	};
	return async (annotation) => {
		const fields = {
			mirrorIdentity: annotation.mirrorIdentity,
			upstreamUserText: annotation.upstreamUserText,
			mirrorOrigin: annotation.mirrorOrigin,
			mirrorSourceFingerprint: annotation.mirrorSourceFingerprint,
			runId: params.runId
		};
		if (Object.values(fields).some((value) => typeof value !== "string") || !fields.mirrorIdentity || !fields.mirrorOrigin || !fields.mirrorSourceFingerprint) throw new Error("native prompt annotation requires complete provenance");
		assertCurrent();
		if (sha256HexPrefixCore(JSON.stringify({
			role: "user",
			content: admittedMessage.content,
			upstreamUserText: fields.upstreamUserText || void 0
		}), 32) !== fields.mirrorSourceFingerprint) throw new Error("native prompt annotation does not match admitted content");
		let verified = false;
		const rewritten = await rewriteTranscriptMessageAtAnchor(admission, (current) => {
			assertCurrent();
			if (!isDeepStrictEqual(current, admittedMessage)) throw new Error("native prompt annotation cannot replace an edited admission");
			const metadata = admittedMessage["__openclaw"] ?? {};
			if (metadata.runTerminal !== void 0 || Object.entries(fields).some(([key, value]) => metadata[key] !== void 0 && metadata[key] !== value)) throw new Error("native prompt annotation conflicts with recorded provenance");
			const next = {
				...admittedMessage,
				__openclaw: {
					...metadata,
					...fields
				}
			};
			if (!isDeepStrictEqual(redactTranscriptMessage(next, params.config), next)) throw new Error("native prompt annotation would restore redacted evidence");
			verified = true;
			return isDeepStrictEqual(next, admittedMessage) ? void 0 : next;
		});
		if (!verified) throw new Error("native prompt admission disappeared before annotation");
		if (rewritten) {
			admission = {
				...admission,
				generation: rewritten.generation
			};
			admittedMessage = structuredClone(rewritten.message);
			owner.refresh({ ...admission }, rewritten.message);
			await waitForSessionTranscriptProjection(admission, params.abortSignal);
		}
		assertCurrent();
		if (rewritten) {
			await publishTranscriptUpdate(admission, {
				message: rewritten.message,
				messageId: admission.entryId,
				messageSeq: admission.activeMessagePosition + 1
			});
			assertCurrent();
		}
	};
}
//#endregion
//#region src/agents/harness/host-bound-tool.ts
function gateBoundTool(tool, assertActive, observeResult) {
	const execute = tool.execute;
	const sourcePreparer = getInternalToolExecutionPreparer(tool);
	if (!execute && !sourcePreparer) return tool;
	const gated = {
		...tool,
		...execute ? { execute: async (...args) => {
			try {
				assertActive();
			} catch (error) {
				throw markToolExecutionNotStarted(error);
			}
			const result = await execute(...args);
			assertActive();
			observeResult(result);
			return result;
		} } : {}
	};
	copyAgentToolMetadata(tool, gated, (source) => gateBoundTool(source, assertActive, observeResult));
	if (sourcePreparer) attachInternalToolExecutionPreparer(gated, async (preparationParams) => {
		assertActive();
		const prepared = await sourcePreparer(preparationParams);
		try {
			assertActive();
		} catch (error) {
			prepared.dispose();
			throw error;
		}
		if (prepared.kind === "immediate") {
			if (prepared.outcome.kind === "result") observeResult(prepared.outcome.result);
			return prepared;
		}
		return {
			...prepared,
			execute: async (onImplementationStart) => {
				assertActive();
				const result = await prepared.execute(onImplementationStart);
				assertActive();
				observeResult(result);
				return result;
			}
		};
	});
	return gated;
}
//#endregion
//#region src/agents/harness/host-snapshot.ts
function freezeSnapshot(value, seen = /* @__PURE__ */ new WeakSet()) {
	if (!value || typeof value !== "object" || seen.has(value)) return value;
	seen.add(value);
	for (const nested of Object.values(value)) freezeSnapshot(nested, seen);
	return Object.freeze(value);
}
/** Host capabilities retain immutable input facts independently of caller mutation. */
function cloneHostSnapshot(value) {
	return freezeSnapshot(structuredClone(value));
}
//#endregion
//#region src/agents/harness/host-capability-workspace.ts
function captureRequiredWorkspaceToolFloor(attempt, pluginId, config) {
	if (attempt.requireWorkspaceOnly !== true) return;
	const requiredWorkspace = {
		workspaceDir: attempt.workspaceDir,
		cwd: attempt.cwd ?? attempt.workspaceDir,
		root: attempt.sandbox?.enabled ? attempt.sandbox.workspaceDir : attempt.sessionRoot ?? attempt.workspaceDir,
		sandbox: attempt.sandbox ? Object.freeze({
			...attempt.sandbox,
			tools: cloneHostSnapshot(attempt.sandbox.tools)
		}) : void 0,
		permissionMode: attempt.permissionMode
	};
	if (!requiredWorkspace.workspaceDir || !requiredWorkspace.root) throw new Error("required workspace tool surface has no captured root");
	const root = requiredWorkspace.root;
	const apply = (options) => {
		const requestedPermissionRoot = options?.sessionPermissionPolicy?.root;
		if (requestedPermissionRoot && requestedPermissionRoot !== root && !isPathInsideWithRealpath(root, requestedPermissionRoot)) throw new Error("tool permission root escapes the captured required workspace");
		return {
			config,
			workspaceDir: requiredWorkspace.workspaceDir,
			cwd: requiredWorkspace.cwd,
			sandbox: requiredWorkspace.sandbox,
			requireWorkspaceOnly: true,
			sessionPermissionPolicy: requiredWorkspace.permissionMode || options?.sessionPermissionPolicy ? {
				root: requestedPermissionRoot ?? root,
				mode: requiredWorkspace.permissionMode === "read-only" || options?.sessionPermissionPolicy?.mode === "read-only" ? "read-only" : requiredWorkspace.permissionMode ?? options.sessionPermissionPolicy.mode
			} : void 0,
			...pluginId === "codex" ? {
				exec: {
					...options?.exec,
					mode: "deny"
				},
				toolConstructionPlan: {
					...options?.toolConstructionPlan ?? {
						includeBaseCodingTools: options?.includeCoreTools !== false,
						includeChannelTools: options?.includeCoreTools !== false,
						includeOpenClawTools: options?.includeCoreTools !== false,
						includePluginTools: true
					},
					includeShellTools: false
				}
			} : {}
		};
	};
	return {
		root,
		apply
	};
}
//#endregion
//#region src/agents/harness/host-environment.ts
const MAX_NATIVE_OPERATION_CWD_BYTES = 4096;
function normalizeNativeOperationCwd(value, attemptCwd) {
	if (typeof value !== "string") throw new Error("native operation cwd must be a string");
	const normalized = value.trim();
	if (!normalized) throw new Error("native operation cwd must not be empty");
	if (Buffer.byteLength(normalized, "utf8") > MAX_NATIVE_OPERATION_CWD_BYTES) throw new Error(`native operation cwd must not exceed ${MAX_NATIVE_OPERATION_CWD_BYTES} bytes`);
	if (containsAsciiControlCharacter(normalized)) throw new Error("native operation cwd must not contain control characters");
	return path.resolve(attemptCwd ?? process.cwd(), normalized);
}
/** Capture non-secret environment facts once; the harness owns their placement. */
function prepareAgentHarnessEnvironment(params) {
	const execConfig = resolveExecToolConfig({
		cfg: params.config,
		agentId: params.sandboxAgentId ?? resolveSessionAgentIdStrict(params)
	});
	const hasConfiguredPrefix = normalizePathPrepend(execConfig.configuredPathPrepend).length > 0;
	const pathKey = findPathKey(process.env);
	const localToolEnv = hasConfiguredPrefix ? { [pathKey]: process.env[pathKey] ?? "" } : void 0;
	const localToolPathPrepend = hasConfiguredPrefix ? Object.freeze(normalizePathPrepend(execConfig.pathPrepend)) : void 0;
	if (localToolEnv && localToolPathPrepend) {
		applyPathPrepend(localToolEnv, [...localToolPathPrepend]);
		Object.freeze(localToolEnv);
	}
	const identity = prepareGitHubToolEnvironment({
		config: params.config ?? {},
		sourceConfig: getActiveSecretsRuntimeConfigSnapshot()?.sourceConfig,
		agentId: params.agentId ?? "main"
	});
	const localProcessEnv = installationTargetEnv(params.installationTarget);
	return Object.freeze({
		credentialScrubEnv: Object.freeze({ ...identity.credentialScrubEnv }),
		localIdentityEnv: Object.freeze({ ...identity.localIdentityEnv }),
		managedLocalIdentity: identity.managedLocalIdentity,
		...localProcessEnv ? { localProcessEnv } : {},
		...localToolEnv ? {
			localToolEnv,
			localToolPathPrepend
		} : {}
	});
}
//#endregion
//#region src/agents/harness/context-media.ts
/** Captures media policy before plugin invocation while keeping extraction dependencies lazy. */
function bindHarnessContextMedia(params) {
	const { attempt, config, assertActive } = params;
	if (!attempt.workspaceDir || !attempt.model) return;
	const modelInput = structuredClone(attempt.model.input);
	Object.freeze(modelInput);
	const contextMedia = Object.freeze({
		config,
		workspaceDir: attempt.sandbox?.enabled ? attempt.sandbox.workspaceDir : attempt.workspaceDir,
		agentWorkspaceDir: attempt.workspaceDir,
		modelInput,
		agentId: attempt.agentId,
		channelId: attempt.messageChannel ?? attempt.messageProvider,
		accountId: attempt.agentAccountId,
		...attempt.sandbox?.enabled && attempt.sandbox.fsBridge ? { sandbox: Object.freeze({
			root: attempt.sandbox.workspaceDir,
			bridge: attempt.sandbox.fsBridge
		}) } : {}
	});
	const assertCurrent = () => {
		assertActive();
		attempt.abortSignal?.throwIfAborted();
	};
	return async (request) => {
		assertCurrent();
		const { prepareHarnessContextMedia } = await import("./context-media-runtime-DI6DoMgJ.mjs");
		assertCurrent();
		const result = await prepareHarnessContextMedia({
			...request,
			...contextMedia,
			assertCurrent
		});
		assertCurrent();
		return result;
	};
}
//#endregion
//#region src/agents/harness/input-attachments.ts
/** Capture original input and policy before the plugin confirms actual execution placement. */
function bindHarnessInputAttachments(params) {
	const { attempt, config, assertActive } = params;
	const attemptSignal = attempt.abortSignal;
	const inputWorkspaceDir = attempt.workspaceDir;
	const inputTimeoutMs = attempt.timeoutMs;
	const initialInput = {
		media: structuredClone(attempt.inputAttachmentMedia ?? attempt.media),
		userTurnTranscriptRecorder: attempt.userTurnTranscriptRecorder
	};
	const resolveInputAttachmentMedia = async () => {
		assertActive();
		attemptSignal?.throwIfAborted();
		const recorder = initialInput.userTurnTranscriptRecorder;
		const message = await recorder?.resolveMessage() ?? recorder?.message;
		assertActive();
		attemptSignal?.throwIfAborted();
		const media = structuredClone((message ? readPersistedMediaFacts(message) : void 0) ?? initialInput.media ?? []);
		return Object.freeze(media.map((fact) => Object.freeze(fact)));
	};
	const inputPolicyEligible = !attempt.sandbox?.enabled && !attempt.requireWorkspaceOnly && !attempt.modelRun && attempt.promptMode !== "none" && (!attempt.permissionMode || attempt.permissionMode === "full") && !resolveEffectiveToolFsWorkspaceOnly({
		cfg: config,
		agentId: attempt.agentId
	});
	let inputReadAllowed = false;
	return {
		resolveInputAttachmentMedia,
		prepareInputAttachments: inputWorkspaceDir && inputTimeoutMs !== void 0 ? async (request) => {
			const assertCurrent = () => {
				assertActive();
				attemptSignal?.throwIfAborted();
				request.signal?.throwIfAborted();
				request.assertCurrent();
			};
			assertCurrent();
			if (!inputReadAllowed || !inputPolicyEligible) return;
			const { prepareAgentWorkspaceAttachments } = await import("./workspace-access-D2z0k4Ia.mjs");
			assertCurrent();
			const result = await prepareAgentWorkspaceAttachments({
				workspaceDir: inputWorkspaceDir,
				localExecution: {
					config,
					readAllowed: inputReadAllowed,
					maxChars: request.maxChars
				},
				turn: {
					...request.turn ?? initialInput,
					config,
					timeoutMs: inputTimeoutMs,
					abortSignal: request.signal ?? attemptSignal
				},
				assertCurrent
			});
			assertCurrent();
			return result;
		} : void 0,
		setInputAttachmentReadAllowed: (allowed) => {
			assertActive();
			inputReadAllowed = allowed;
		}
	};
}
//#endregion
//#region src/agents/harness/host-media.ts
/** Bind media capabilities to the same captured attempt policy and host lifetime. */
function bindHarnessMedia(params) {
	const { resolveInputAttachmentMedia, prepareInputAttachments, setInputAttachmentReadAllowed } = bindHarnessInputAttachments(params);
	const prepareContextMedia = bindHarnessContextMedia(params);
	const prepareReplyMedia = bindHarnessReplyMedia(params);
	return {
		capabilities: {
			resolveInputAttachmentMedia,
			...prepareContextMedia ? { prepareContextMedia } : {},
			...prepareInputAttachments ? { prepareInputAttachments } : {},
			...prepareReplyMedia ? { prepareReplyMedia } : {}
		},
		setInputAttachmentReadAllowed
	};
}
//#endregion
//#region src/agents/harness/host-skills.ts
/** Catalog identity is host-owned; readable paths follow the effective tool placement. */
function bindHostSkillCatalog(params) {
	return (placement, permissionRoot) => {
		params.assertCurrent();
		if (!params.readable) return [];
		const sandbox = params.sandbox?.enabled ? params.sandbox : placement ?? params.sandbox;
		const inputs = resolveSandboxSkillRuntimeInputs({
			sandbox,
			skillsAnchorWorkspace: params.workspaceDir,
			skillsSnapshot: params.snapshot
		});
		const catalog = prepareInstalledSkillCatalog({
			snapshot: inputs.skillsSnapshot,
			workspaceDir: inputs.skillsWorkspaceDir,
			sandbox,
			assertCurrent: params.assertCurrent
		});
		if (!params.requiredRoot) return catalog;
		const requiredRoot = permissionRoot ?? params.requiredRoot;
		if (!isPathInside$1(params.requiredRoot, requiredRoot)) throw new Error("Skill permission root escapes the captured required workspace.");
		return catalog.filter((skill) => {
			if (!sandbox?.enabled) return resolveLocalPathFromRootsSync({
				filePath: skill.source.filePath,
				roots: [requiredRoot],
				requireFile: true
			}) !== null;
			const resolved = sandbox.fsBridge?.resolvePath({
				filePath: skill.location,
				cwd: sandbox.containerWorkdir
			});
			return resolved?.hostPath !== void 0 && isPathInside$1(requiredRoot, resolved.hostPath);
		}).map((skill) => {
			const entry = Object.assign({}, skill);
			entry.source = { filePath: skill.source.filePath };
			entry.reader = async ({ location, signal }) => {
				params.assertCurrent();
				signal?.throwIfAborted();
				const maxBytes = skill.promptListed ? Number.MAX_SAFE_INTEGER : MAX_SKILL_INSTRUCTION_BYTES;
				let content;
				if (sandbox?.enabled) {
					if (!sandbox.fsBridge?.readFileWithSource) throw new Error("Sandbox skill reads require a source-aware filesystem bridge.");
					const result = await sandbox.fsBridge.readFileWithSource({
						filePath: location,
						cwd: sandbox.containerWorkdir,
						signal,
						maxBytes
					});
					if (result.workspaceRelativePath === void 0 || !isPathInside$1(requiredRoot, path.resolve(sandbox.workspaceDir, result.workspaceRelativePath))) throw new Error("Skill instructions escape the captured required workspace.");
					content = result.data;
				} else {
					const result = await readLocalFileFromRoots({
						filePath: location,
						roots: [requiredRoot],
						hardlinks: "reject",
						symlinks: "follow-within-root",
						maxBytes
					});
					if (!result) throw new Error("Skill instructions escape the captured required workspace.");
					content = result.buffer;
				}
				params.assertCurrent();
				signal?.throwIfAborted();
				return content.toString("utf8");
			};
			return entry;
		});
	};
}
//#endregion
//#region src/agents/harness/host-source-authority.ts
/** Native delegation cannot select a person, so its live turn must remain unambiguous. */
function bindHarnessNativeSpawnAuthority(participants, assertActive) {
	return participants ? () => {
		assertActive();
		participants.resolve()?.assertCurrent();
	} : void 0;
}
/** Acquires original-source model authority while the issuing host is active. */
function bindHarnessModelExecution(admittedRunContext, model, assertActive) {
	assertActive();
	return bindOperatorModelExecution(readAdmittedRunOperatorAuthority(admittedRunContext), model);
}
const retainedSources = resolveGlobalSingleton(Symbol.for("openclaw.harness.retainedSources"), () => /* @__PURE__ */ new Set());
registerAgentEventLifecycleRotationHandler("harness-retained-sources", () => {
	const retiring = [...retainedSources];
	retainedSources.clear();
	for (const controller of retiring) controller.abort(/* @__PURE__ */ new Error("agent harness retained source is no longer active"));
});
/** Transfers original-source custody while the issuing foreground host is still live. */
function retainHarnessSource(admittedRunContext, assertActive, nativeModelPolicySupported = false) {
	assertActive();
	const lifecycleGeneration = getAgentRunLifecycleGeneration();
	const source = readAdmittedRunOperatorAuthority(admittedRunContext);
	if (!source) return;
	const modelExecution = nativeModelPolicySupported ? void 0 : bindOperatorModelExecution(source, void 0);
	const release = nativeModelPolicySupported ? source.retain?.() : modelExecution?.release;
	const assertSourceCurrent = () => {
		if (nativeModelPolicySupported) source.assertCurrent();
		else modelExecution?.assertCurrent();
	};
	try {
		assertActive();
		assertSourceCurrent();
		assertActive();
	} catch (error) {
		release?.();
		throw error;
	}
	let released = false;
	let modelLifetime;
	const lifecycle = new AbortController();
	retainedSources.add(lifecycle);
	const authoritySignal = modelExecution?.signal ?? source.signal;
	const signal = authoritySignal ? AbortSignal.any([authoritySignal, lifecycle.signal]) : lifecycle.signal;
	const assertRetained = () => {
		if (released || getAgentRunLifecycleGeneration() !== lifecycleGeneration) throw new Error("agent harness retained source is no longer active");
		signal.throwIfAborted();
	};
	const assertCurrent = () => {
		assertRetained();
		assertSourceCurrent();
		assertRetained();
	};
	return Object.freeze({
		signal,
		assertCurrent,
		get modelPolicyRequired() {
			assertCurrent();
			const required = source.modelPolicy !== void 0;
			assertCurrent();
			return required;
		},
		get sourceIdentity() {
			assertCurrent();
			const identity = source.source;
			assertCurrent();
			return identity;
		},
		bindModelExecution: (model) => {
			assertCurrent();
			const binding = bindOperatorModelExecution(source, model);
			if (!binding) return;
			const assertBindingCurrent = () => {
				binding.assertCurrent();
				assertRetained();
			};
			try {
				assertBindingCurrent();
			} catch (error) {
				binding.release();
				throw error;
			}
			modelLifetime ??= new AbortController();
			return {
				signal: AbortSignal.any([
					signal,
					modelLifetime.signal,
					binding.signal
				]),
				assertCurrent: assertBindingCurrent,
				release: binding.release
			};
		},
		release: () => {
			if (!released) {
				released = true;
				retainedSources.delete(lifecycle);
				modelLifetime?.abort(/* @__PURE__ */ new Error("agent harness retained source is no longer active"));
				release?.();
			}
		}
	});
}
function assertCompactionSource(source) {
	if (!source || !Object.hasOwn(source, "operatorAuthority")) throw new Error("Compaction requires its original host source authority");
	source.assertActive();
	if (source.operatorAuthority !== void 0) {
		assertAdmittedRunOperatorAuthority(source.operatorAuthority);
		source.operatorAuthority.assertCurrent();
	}
}
/** Retains the existing issuer through queueing; the compaction work owner releases it. */
function retainAgentHarnessCompactionSource(source) {
	assertCompactionSource(source);
	const release = source.operatorAuthority?.retain?.();
	try {
		assertCompactionSource(source);
	} catch (error) {
		release?.();
		throw error;
	}
	let released = false;
	return () => {
		if (!released) {
			released = true;
			release?.();
		}
	};
}
//#endregion
//#region src/agents/harness/host-trajectory.ts
/** Keeps trajectory callbacks bound to the exact foreground host lifetime. */
function bindHarnessTrajectory(recorder, assertActive) {
	return Object.freeze({
		recordEvent: (type, data) => {
			assertActive();
			recorder.recordEvent(type, data);
		},
		flush: async () => {
			assertActive();
			await recorder.flush();
			assertActive();
		}
	});
}
//#endregion
//#region src/agents/harness/node-execution-authority.ts
/** Full is admitted host authority, narrowed to one placement claim, never a request flag. */
function createSessionNodeAuthorities(attempt, pluginId, requiredNodeCommands, assertActive, signal) {
	const admittedFull = attempt.permissionMode === "full";
	const resolveContext = getGatewayContextResolver(attempt.admittedRunContext);
	const context = resolveContext?.();
	const target = attempt.sessionTarget;
	const gatewayRegistry = getActivePluginRegistry();
	const pluginOwners = [gatewayRegistry, getPluginRuntimeGatewayRequestScope()?.pluginRegistry ?? gatewayRegistry].map((owner) => {
		const record = owner?.plugins.find((candidate) => candidate.id === pluginId);
		return owner && record ? capturePluginLifecycleAuthority(owner, record, { scopedRuntime: owner !== gatewayRegistry }) : void 0;
	});
	const assertPlacementCurrent = getPluginRuntimeGatewayRequestScope()?.assertNodeExecutionCurrent;
	if (!context || !target?.storePath || !attempt.agentId || !attempt.sessionKey || !attempt.sessionId || !assertPlacementCurrent) return {};
	const session = {
		agentId: attempt.agentId,
		sessionKey: attempt.sessionKey,
		storePath: target.storePath
	};
	const assertRequestCurrent = (request) => {
		if (request.source === "session-full" && (!admittedFull || !requiredNodeCommands.has(request.command))) throw new Error("admitted node execution authority does not cover this command");
		assertActive();
		const entry = loadSessionEntryReadOnly(session);
		if (signal.aborted || getActivePluginRegistry() !== gatewayRegistry || pluginOwners.some((isCurrent) => !isCurrent?.()) || request.source === "session-full" && (attempt.permissionMode !== "full" || !requiredNodeCommands.has(request.command)) || resolveContext && resolveContext() !== context || request.pluginId !== pluginId || !entry || entry.sessionId !== attempt.sessionId || request.source === "session-full" && entry.permissionMode !== "full" || request.workspace.sessionKey !== attempt.sessionKey || request.workspace.sessionId !== attempt.sessionId) throw new Error("admitted node execution authority is no longer current");
		assertPlacementCurrent({
			...request,
			runId: attempt.runId,
			agentId: session.agentId
		});
	};
	const invokeWithSessionNodeAuthority = async (request, invoke) => {
		if (request.source === "session-full" && (!admittedFull || !requiredNodeCommands.has(request.command))) return;
		const assertCurrent = () => assertRequestCurrent(request);
		assertCurrent();
		const result = await invoke(assertCurrent, signal);
		assertCurrent();
		return result;
	};
	return {
		invokeWithSessionNodeAuthority,
		nodePlacementGrantAuthority: {
			agentId: session.agentId,
			sessionKey: attempt.sessionKey,
			runId: attempt.runId,
			assertCurrent: (request) => assertRequestCurrent({
				...request,
				source: "human-approved"
			})
		}
	};
}
//#endregion
//#region src/agents/harness/host-capability.ts
/** Creates a closure-bound capability before plugin invocation. */
function createAgentHarnessHostCapabilities(params) {
	const attempt = params.attempt;
	const runtimePluginToolGrant = attempt.runtimePluginToolGrant ? Object.freeze({
		pluginId: attempt.runtimePluginToolGrant.pluginId,
		toolNames: Object.freeze([...attempt.runtimePluginToolGrant.toolNames])
	}) : void 0;
	const githubPublicationAvailable = attempt.githubPublicationAvailable;
	const workSignal = getAsyncWorkSignal();
	const attemptSignal = attempt.abortSignal;
	const installationTarget = getInstallationTarget();
	const { sessionKey, onAgentEvent } = attempt;
	const requiredNodeCommands = new Set(params.requiredNodeCommands);
	const nativeModelPolicySupported = params.nativeModelPolicySupport === "exact";
	const operationalRunInstance = attempt.admittedRunContext.operationalRunInstance;
	const delegatedAuthority = getAdmittedRunDelegatedAuthority(attempt.admittedRunContext);
	const requesterProfileId = readAdmittedRunOperatorAuthority(attempt.admittedRunContext)?.profileId;
	if (!delegatedAuthority) throw new Error("agent harness host capability requires active admitted run authority");
	const { lifecycleGeneration } = delegatedAuthority;
	const { runId } = delegatedAuthority.operationalRunInstance;
	const coreTtsToolResults = /* @__PURE__ */ new WeakSet();
	let active = true;
	const capabilityAbortController = new AbortController();
	const inheritedCaller = getGatewayToolCallerIdentity();
	const sourceCaller = inheritedCaller?.operationalRunInstance === operationalRunInstance ? inheritedCaller : void 0;
	let personalToolParticipants = sourceCaller?.personalToolParticipants;
	const callerIdentity = createAdmittedGatewayToolCallerIdentity({
		admittedRunContext: attempt.admittedRunContext,
		receiptAuthority: assertActive,
		approvalSignals: [capabilityAbortController.signal, ...attemptSignal ? [attemptSignal] : []],
		agentId: attempt.agentId,
		sessionKey: attempt.sessionKey,
		turnSourceChannel: attempt.messageChannel ?? attempt.messageProvider,
		turnSourceTo: attempt.currentMessagingTarget ?? attempt.currentChannelId,
		turnSourceAccountId: attempt.agentAccountId,
		turnSourceThreadId: attempt.currentThreadTs
	});
	const inactiveError = (message) => {
		throwAgentRunRestartAbortReason(attemptSignal?.aborted ? attemptSignal.reason : workSignal?.reason);
		return new Error(message);
	};
	const boundGatewayContext = getGatewayContextResolver(attempt.admittedRunContext);
	function assertActive() {
		if (!active || attempt.admittedRunContext.operationalRunInstance !== operationalRunInstance || getAdmittedRunDelegatedAuthority(attempt.admittedRunContext) !== delegatedAuthority || boundGatewayContext && callerIdentity?.gatewayContextResolver?.() === void 0) throw inactiveError("agent harness host capability is no longer active");
		if (sourceCaller && (sourceCaller.agentId !== attempt.agentId || sourceCaller.sessionKey !== attempt.sessionKey) || sourceCaller?.workerTurnClaim && (sourceCaller.workerTurnClaim.sessionId !== attempt.sessionId || sourceCaller.workerTurnClaim.runId !== attempt.runId) || sourceCaller?.workerTurnClaim && !sourceCaller.receiptAuthority || sourceCaller?.receiptAuthority?.() === false) throw new Error("agent harness host capability lost its source execution claim");
	}
	const observeCoreTtsToolResult = (result) => {
		if (typeof result === "object" && result !== null && getCoreTtsToolResultMediaUrls(result)) coreTtsToolResults.add(result);
	};
	const requester = {
		...attempt.messageChannel ?? attempt.messageProvider ? { channel: attempt.messageChannel ?? attempt.messageProvider ?? void 0 } : {},
		...attempt.agentAccountId ? { accountId: attempt.agentAccountId } : {},
		...attempt.senderId ? { senderId: attempt.senderId } : {},
		...attempt.senderIsOwner !== void 0 ? { senderIsOwner: attempt.senderIsOwner } : {},
		...attempt.memberRoleIds?.length ? { roleIds: Object.freeze([...attempt.memberRoleIds]) } : {}
	};
	const config = attempt.config ? cloneHostSnapshot(attempt.config) : void 0;
	const hostSandboxEnabled = attempt.sandbox?.enabled === true;
	const requiredWorkspace = captureRequiredWorkspaceToolFloor(attempt, params.pluginId, config);
	const capturedWorkspaceOptions = requiredWorkspace?.apply();
	const media = bindHarnessMedia({
		attempt,
		config,
		assertActive,
		signal: capabilityAbortController.signal
	});
	const recorder = attempt.userTurnTranscriptRecorder;
	const sessionTarget = attempt.sessionTarget ? cloneHostSnapshot(attempt.sessionTarget) : void 0;
	const annotateCurrentUserTurn = attempt.userTurnTranscriptRecorder && attempt.sessionTarget && attempt.agentId && attempt.sessionId && attempt.sessionKey && attempt.sessionTarget.storePath && !attempt.suppressNextUserMessagePersistence && attempt.trigger !== "memory" ? bindUserTurnTranscriptAnnotation({
		recorder: attempt.userTurnTranscriptRecorder,
		target: {
			...attempt.sessionTarget,
			agentId: attempt.agentId,
			sessionId: attempt.sessionId,
			sessionKey: attempt.sessionKey,
			storePath: attempt.sessionTarget.storePath
		},
		runId: attempt.runId,
		config,
		abortSignal: attempt.abortSignal ? AbortSignal.any([attempt.abortSignal, capabilityAbortController.signal]) : capabilityAbortController.signal,
		assertCurrent: () => {
			assertActive();
			if (attempt.userTurnTranscriptRecorder !== recorder || !isDeepStrictEqual(attempt.sessionTarget, sessionTarget) || sessionTarget?.agentId !== void 0 && sessionTarget.agentId !== attempt.agentId || sessionTarget?.sessionId !== void 0 && sessionTarget.sessionId !== attempt.sessionId || sessionTarget?.sessionKey !== void 0 && sessionTarget.sessionKey !== attempt.sessionKey) throw new Error("native prompt annotation lost its source execution claim");
		}
	}) : void 0;
	const skillsSnapshot = attempt.skillsSnapshot ? cloneHostSnapshot(attempt.skillsSnapshot) : void 0;
	const getInstalledSkills = bindHostSkillCatalog({
		snapshot: skillsSnapshot,
		workspaceDir: capturedWorkspaceOptions?.workspaceDir ?? attempt.bootstrapWorkspaceDir ?? attempt.workspaceDir ?? attempt.cwd ?? process.cwd(),
		sandbox: requiredWorkspace ? capturedWorkspaceOptions?.sandbox : attempt.sandbox,
		requiredRoot: requiredWorkspace?.root,
		readable: attempt.operation !== "settled-tool-finalization" && (!attempt.toolExecutionAllow || isToolExecutionAllowed(attempt.toolExecutionAllow, "read")),
		assertCurrent: assertActive
	});
	const preparedRunEnvironment = prepareAgentHarnessEnvironment({
		config,
		agentId: attempt.agentId,
		sessionKey: attempt.sessionKey,
		sandboxAgentId: attempt.sandboxAgentId,
		installationTarget
	});
	const skillUsagePaths = attempt.sandbox?.skillUsagePaths ? cloneHostSnapshot(attempt.sandbox.skillUsagePaths) : void 0;
	const hookContext = Object.freeze({
		...attempt.agentId ? { agentId: attempt.agentId } : {},
		...config ? { config } : {},
		...attempt.cwd ? { cwd: attempt.cwd } : {},
		...attempt.workspaceDir ? { workspaceDir: attempt.workspaceDir } : {},
		...attempt.sessionKey ? { sessionKey: attempt.sessionKey } : {},
		...attempt.sessionId ? { sessionId: attempt.sessionId } : {},
		runId: attempt.runId,
		...buildAgentHookContextChannelFields(attempt),
		...Object.keys(requester).length > 0 ? { requester: Object.freeze(requester) } : {},
		...getActiveDiagnosticTraceContext() ? { trace: getActiveDiagnosticTraceContext() } : {},
		...skillsSnapshot ? { skillsSnapshot } : {},
		...skillUsagePaths ? { skillUsagePaths } : {},
		...attempt.onToolOutcome ? { onToolOutcome: attempt.onToolOutcome } : {},
		...attempt.allocateToolOutcomeOrdinal ? { allocateToolOutcomeOrdinal: attempt.allocateToolOutcomeOrdinal } : {},
		...attempt.sandbox?.enabled && attempt.sandbox.workspaceAccess === "rw" && attempt.sandbox.fsBridge ? { sandbox: Object.freeze({
			root: attempt.sandbox.workspaceDir,
			bridge: attempt.sandbox.fsBridge
		}) } : {},
		loopDetection: cloneHostSnapshot(resolveToolLoopDetectionConfig({
			cfg: config,
			agentId: attempt.agentId
		})),
		trigger: attempt.trigger,
		approvalReviewerDeviceId: attempt.approvalReviewerDeviceId,
		turnSourceChannel: attempt.messageChannel ?? attempt.messageProvider,
		turnSourceTo: attempt.currentMessagingTarget ?? attempt.currentChannelId,
		turnSourceAccountId: attempt.agentAccountId,
		turnSourceThreadId: attempt.currentThreadTs
	});
	const withCaller = async (run, signal) => await withGatewayToolCallerIdentity(callerIdentity && signal ? {
		...callerIdentity,
		approvalSignals: [...callerIdentity.approvalSignals ?? [], signal]
	} : callerIdentity, run);
	const runBeforeToolCallWithAssertion = async (assertCurrent, { nativeOperation, approvalMode, ...request }) => {
		assertCurrent();
		const hostApprovalMode = approvalMode === "defer" ? "defer" : "request";
		const actionCwd = nativeOperation?.cwd !== void 0 ? normalizeNativeOperationCwd(nativeOperation.cwd, hookContext.cwd) : void 0;
		const actionHookContext = actionCwd ? Object.freeze({
			...hookContext,
			cwd: actionCwd
		}) : hookContext;
		const result = await runBeforeToolCallHook({
			...request,
			approvalMode: hostApprovalMode,
			ctx: actionHookContext
		});
		assertCurrent();
		return result;
	};
	const runBeforeToolCall = async (request) => await withCaller(async () => await runBeforeToolCallWithAssertion(assertActive, request), request.signal);
	registerAgentHarnessBeforeToolCallRetention(runBeforeToolCall, () => {
		const recovery = retainAdmittedRunBeforeToolCallRecovery(attempt.admittedRunContext);
		if (!recovery) return;
		const assertRecoveryActive = () => {
			if (attempt.abortSignal?.aborted || attempt.admittedRunContext.operationalRunInstance !== operationalRunInstance || boundGatewayContext && callerIdentity?.gatewayContextResolver?.() === void 0) throw inactiveError("agent harness retained host policy is no longer active");
			recovery.assertActive();
		};
		return Object.freeze({
			assertActive: assertRecoveryActive,
			release: recovery.release,
			runBeforeToolCall: async (request) => await runBeforeToolCallWithAssertion(assertRecoveryActive, request)
		});
	});
	const trajectoryRecorder = attempt.trajectoryRecorder;
	const scheduledToolSources = /* @__PURE__ */ new WeakMap();
	const bindTools = (tools, options, observeResult) => {
		assertActive();
		const boundAbortSignal = attempt.abortSignal ? AbortSignal.any([attempt.abortSignal, capabilityAbortController.signal]) : capabilityAbortController.signal;
		const bindingCwd = options?.cwd !== void 0 ? normalizeNativeOperationCwd(options.cwd, hookContext.cwd) : void 0;
		const bindingHookContext = bindingCwd ? Object.freeze({
			...hookContext,
			cwd: bindingCwd
		}) : hookContext;
		return tools.map((tool) => bindAgentToolSourceExecutionGuard(tool, assertActive)).map((tool) => rewrapToolWithBeforeToolCallHook(tool, bindingHookContext)).map((tool) => callerIdentity ? wrapToolWithGatewayCallerIdentity(tool, callerIdentity) : tool).map((tool) => wrapToolWithAbortSignal(tool, boundAbortSignal)).map((tool) => gateBoundTool(tool, assertActive, observeResult));
	};
	const bindToolSurface = (tools, options) => bindTools(tools, options, () => {});
	const bindModelExecution = nativeModelPolicySupported ? (model) => bindHarnessModelExecution(attempt.admittedRunContext, model, assertActive) : void 0;
	const capabilities = Object.freeze({
		kind: "agent-harness-host-capability",
		version: 1,
		assertActive,
		get assertNativeSubagentSpawnAllowed() {
			return bindHarnessNativeSpawnAuthority(personalToolParticipants, assertActive);
		},
		...bindModelExecution ? { bindModelExecution } : {},
		retainSourceAuthority: () => retainHarnessSource(attempt.admittedRunContext, assertActive, nativeModelPolicySupported),
		reportOutputTokens: (outputTokens) => {
			assertActive();
			const data = emitAgentRunOutputTokens({
				runId,
				lifecycleGeneration,
				sessionKey,
				outputTokens
			});
			if (data && onAgentEvent) runBestEffortCallback({
				label: "usage agent event",
				log,
				callback: () => onAgentEvent({
					stream: "usage",
					data
				})
			});
		},
		...annotateCurrentUserTurn ? { annotateCurrentUserTurn } : {},
		...media.capabilities,
		...trajectoryRecorder ? { trajectory: bindHarnessTrajectory(trajectoryRecorder, assertActive) } : {},
		preparedEnvironment: () => {
			assertActive();
			return preparedRunEnvironment;
		},
		activeComputerContext: () => {
			assertActive();
			return buildActiveNodeContextText(requesterProfileId);
		},
		bindToolSurface,
		createToolSurface: (options, bindingOptions) => {
			assertActive();
			const effectiveOptions = {
				...options,
				...requiredWorkspace?.apply(options)
			};
			const tools = bindTools(withAgentQuestionAnswerAuthority(resolveAgentQuestionAnswerAuthority(capabilities), () => withInstallationTarget(installationTarget, () => createOpenClawCodingToolsInternal({
				...effectiveOptions,
				githubPublicationAvailable,
				runtimePluginToolGrant,
				skillsSnapshot: options?.skillsSnapshot ?? skillsSnapshot,
				installedSkills: getInstalledSkills(effectiveOptions.sandbox, effectiveOptions.sessionPermissionPolicy?.root),
				skillUsagePaths: options?.skillUsagePaths ?? skillUsagePaths,
				operationalRunInstance
			}, !requiredWorkspace && !hostSandboxEnabled && !options?.sandbox?.enabled && options?.includeCoreTools !== false && options?.toolConstructionPlan?.includeBaseCodingTools !== false ? resolveSkillResourceCandidates(skillsSnapshot) : void 0))), bindingOptions, observeCoreTtsToolResult);
			for (const tool of tools) if (tool.name === "exec" || tool.name === "process") scheduledToolSources.set(tool, Object.freeze({
				targetTool: tool.name,
				execute: tool.execute
			}));
			return tools;
		},
		prepareMutableFileApproval: async (request) => {
			assertActive();
			const prepared = await prepareSystemRunMutableFileApproval(request);
			assertActive();
			if (!prepared.ok) return prepared;
			return Object.freeze({
				ok: true,
				requiresOneShot: prepared.requiresOneShot,
				revalidate: async () => {
					assertActive();
					const current = await prepared.revalidate();
					assertActive();
					return current;
				}
			});
		},
		runBeforeToolCall,
		requestApproval: async (request) => {
			assertActive();
			request.signal?.throwIfAborted();
			const releaseMcpBinding = request.mcpTool && request.toolCallId && request.isMcpToolApprovalActive && attempt.agentId ? registerMcpToolApprovalBinding({
				authority: delegatedAuthority,
				agentId: attempt.agentId,
				toolCallId: request.toolCallId,
				...request.mcpTool,
				isActive: () => {
					assertActive();
					return !request.signal?.aborted && request.isMcpToolApprovalActive();
				}
			}) : void 0;
			try {
				const result = await withCaller(async () => await withGatewayToolApprovalOwner(params.pluginId, async () => await callGatewayTool("plugin.approval.request", { timeoutMs: request.transportTimeoutMs ?? request.timeoutMs }, {
					...formatHarnessApprovalPresentation(request),
					...request.detail !== void 0 ? { detail: request.detail } : {},
					severity: request.severity,
					toolName: request.toolName,
					toolCallId: request.toolCallId,
					...request.mcpTool ? { mcpTool: request.mcpTool } : {},
					timeoutMs: request.timeoutMs,
					twoPhase: true,
					...request.allowedDecisions ? { allowedDecisions: request.allowedDecisions } : {}
				}, {
					expectFinal: false,
					requireAgentRuntimeIdentity: true,
					signal: request.signal
				})), request.signal);
				assertActive();
				request.signal?.throwIfAborted();
				return result;
			} finally {
				releaseMcpBinding?.();
			}
		},
		waitForApproval: async (request) => {
			assertActive();
			const result = await withCaller(async () => await callGatewayTool("plugin.approval.waitDecision", { timeoutMs: request.transportTimeoutMs ?? request.timeoutMs }, { id: request.approvalId }, { signal: request.signal }), request.signal);
			assertActive();
			if (result?.id !== request.approvalId) return;
			return {
				decision: result.decision,
				terminalReason: result.terminalReason
			};
		}
	});
	registerAgentHarnessScheduledToolProjectionCapability({
		hostCapabilities: capabilities,
		ownerPluginId: params.pluginId,
		create: (sourceTool, projection) => {
			assertActive();
			const source = scheduledToolSources.get(sourceTool);
			if (!source || sourceTool.name !== source.targetTool || sourceTool.execute !== source.execute) throw new Error("scheduled tool projection source was not created by this host capability");
			return createCronScheduledToolProjection(sourceTool, assertActive, source.targetTool, projection);
		}
	});
	registerAgentHarnessTtsProvenanceTransferCapability({
		hostCapabilities: capabilities,
		ownerPluginId: params.pluginId,
		transfer: (toolResult, attemptResult, eligibleMediaUrls) => {
			assertActive();
			if (typeof toolResult !== "object" || toolResult === null || !coreTtsToolResults.has(toolResult)) return attemptResult;
			return transferCoreTtsToolResultProvenance(toolResult, attemptResult, eligibleMediaUrls, operationalRunInstance);
		}
	});
	return {
		capabilities,
		setInputAttachmentReadAllowed: media.setInputAttachmentReadAllowed,
		runWithScope: (run) => {
			const preparedCaller = getGatewayToolCallerIdentity();
			if (preparedCaller?.operationalRunInstance === operationalRunInstance) {
				personalToolParticipants ??= preparedCaller.personalToolParticipants;
				if (callerIdentity && personalToolParticipants) callerIdentity.personalToolParticipants = personalToolParticipants;
			}
			const nodeAuthorities = createSessionNodeAuthorities(attempt, params.pluginId, requiredNodeCommands, assertActive, attempt.abortSignal ? AbortSignal.any([attempt.abortSignal, capabilityAbortController.signal]) : capabilityAbortController.signal);
			return withPluginRuntimeGatewayRequestScope({
				isWebchatConnect: () => false,
				...getPluginRuntimeGatewayRequestScope(),
				...nodeAuthorities
			}, run);
		},
		close: () => {
			if (!active) return;
			active = false;
			capabilityAbortController.abort();
		}
	};
}
//#endregion
export { assertCompactionSource as n, retainAgentHarnessCompactionSource as r, createAgentHarnessHostCapabilities as t };
