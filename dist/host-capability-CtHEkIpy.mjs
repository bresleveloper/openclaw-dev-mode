import { a as resolveGlobalSingleton } from "./global-singleton-DrXvEBww.mjs";
import { r as getAsyncWorkSignal } from "./async-work-scope-BH2yUdBz.mjs";
import { t as containsAsciiControlCharacter } from "./string-normalization-D6DKCpwE.mjs";
import { g as getGatewayContextResolver, l as withPluginRuntimeGatewayRequestScope, o as getPluginRuntimeGatewayRequestScope } from "./gateway-request-scope-1BXD1G3l.mjs";
import { k as getActiveDiagnosticTraceContext } from "./diagnostic-events-C91J-XX8.mjs";
import { r as sha256HexPrefixCore } from "./node-crypto-BG4u3UnX.mjs";
import "./crypto-digest-y6oZN-_F.mjs";
import { a as isSameOpenClawAgentDatabasePath } from "./openclaw-agent-db.paths-BGqL4GOe.mjs";
import { c as isPathInside, m as readLocalFileFromRoots, x as resolveLocalPathFromRootsSync } from "./fs-safe-6Z4UiMS4.mjs";
import { n as captureOpenClawStateReadWorkerContext } from "./openclaw-state-worker-context-BDhKaXgP.mjs";
import { f as getAgentRunLifecycleGeneration } from "./agent-run-registry-gmaPgO-n.mjs";
import { u as emitAgentRunOutputTokens, v as registerAgentEventLifecycleRotationHandler } from "./agent-events-Bf3Js0D3.mjs";
import { a as captureExternalSessionCommitGuard, o as composeSessionSourceAssertion } from "./session-source-authority-fdILH-PW.mjs";
import { a as capturePluginLifecycleAuthority } from "./registry-lifecycle-CjTFYNkp.mjs";
import { l as getActivePluginRegistry } from "./runtime-DkPagH0y.mjs";
import { t as warnPluginSdkDeprecation } from "./sdk-deprecation-DjTmOhOX.mjs";
import { a as getActiveSecretsRuntimeConfigSnapshot } from "./runtime-state-DDDhACod.mjs";
import { g as resolveSessionAgentIdStrict } from "./agent-scope-DXrnO3F4.mjs";
import { o as isToolExecutionAllowed } from "./tool-policy-shared-PsZCKeeN.mjs";
import { n as getUserTurnTranscriptAdmissionOwner } from "./user-turn-transcript-admission-BZunVvZI.mjs";
import { i as captureAdmittedRunActiveAssertion, m as readAdmittedRunOperatorAuthority, r as bindOperatorModelExecution, t as assertAdmittedRunOperatorAuthority, u as getAdmittedRunDelegatedAuthority, y as retainAdmittedRunBeforeToolCallRecovery } from "./admitted-run-context-h1ULFETN.mjs";
import { P as sessionMatchesExpectedTranscriptTurn } from "./session-actor-memory-owner-BSARM2d5.mjs";
import { g as throwAgentRunRestartAbortReason } from "./run-termination-Dwf1ksjA.mjs";
import { i as captureExecRequestCustody } from "./exec-request-context-CWnK9ayt.mjs";
import { d as withGatewayToolApprovalOwner, f as withGatewayToolCallerIdentity, n as captureGatewayToolReceiptAssertion, o as getGatewayToolCallerIdentity, r as createAdmittedGatewayToolCallerIdentity } from "./gateway-caller-context-Be176_GV.mjs";
import { u as createCronScheduledToolProjection } from "./agent-tool-metadata-Dj6F-G24.mjs";
import { r as resolveSqliteSessionKey } from "./session-accessor.sqlite-scope-helpers-XTtpZpWK.mjs";
import { g as retainPreparedSessionEntryPredicate } from "./session-accessor.sqlite-entry-cache-publication-state-4Z0giEC3.mjs";
import { f as readPersistedMediaFacts } from "./media-facts-BIPREXi-.mjs";
import { a as readCapturedSessionActorEntry, n as captureSessionActorStorageOwner } from "./session-actor-storage-binding-oCtbPk00.mjs";
import "./session-accessor.sqlite-scope-9ysL95gx.mjs";
import { l as withSessionEntryReadOnlyInWorker } from "./session-entry-read-runtime-CgqUrGct.mjs";
import { c as waitForSessionTranscriptProjection } from "./session-transcript-reconcile-BkwlDaaD.mjs";
import { l as rewritePreparedTranscriptMessageAtAnchor } from "./session-accessor-Czw4l8kI.mjs";
import { t as SessionRowProjectionBinding } from "./session-row-projection-binding-_jtkstu1.mjs";
import { i as readActiveTranscriptEntryAnchor } from "./session-accessor.sqlite-transcript-anchor-Dc-2VOHU.mjs";
import { u as getOwnedSessionTranscriptWriterFence } from "./transcript-write-context-C02sC3zd.mjs";
import { n as publishTranscriptUpdate } from "./session-accessor.sqlite-events-B20eyHIG.mjs";
import { i as resolveSessionTranscriptDatabasePath } from "./session-accessor.transcript-target-DDngfM5X.mjs";
import { c as prepareGitHubToolEnvironment } from "./github-tool-identity-BEdbceu6.mjs";
import { _ as runBeforeToolCallHook } from "./agent-tools.before-tool-call-CtP0G8Wg.mjs";
import { E as withAgentQuestionAnswerAuthority, b as registerAgentHarnessScheduledToolProjectionCapability, v as registerAgentHarnessBeforeToolCallRetention, w as resolveAgentQuestionAnswerAuthority, x as registerAgentHarnessTtsProvenanceTransferCapability } from "./host-private-capabilities-eTr803c9.mjs";
import { i as normalizePathPrepend, n as findPathKey, t as applyPathPrepend } from "./path-prepend-D21kYd3c.mjs";
import { n as resolveEffectiveToolFsWorkspaceOnly } from "./tool-fs-policy-C65zBDHN.mjs";
import { a as withInstallationTarget, n as getInstallationTarget, r as installationTargetEnv } from "./installation-target-context-B9ZDUs_O.mjs";
import { t as callGatewayTool } from "./gateway-BC8tozR0.mjs";
import { t as buildActiveNodeContextText } from "./active-node-context-DpQMef3G.mjs";
import { t as registerMcpToolApprovalBinding } from "./mcp-tool-approval-binding-CrGONV5N.mjs";
import { s as prepareSystemRunMutableFileApproval } from "./system-run-approval-binding-DJ0HBEkx.mjs";
import { t as buildAgentHookContextChannelFields } from "./hook-agent-context-C9bjjC7S.mjs";
import { t as captureSessionEntryCurrentCheckAsyncInternal } from "./session-entry-current-check-Df7ye0eB.mjs";
import { a as prepareSkillLibrarySelection, i as loadSkillLibrarySelection } from "./selection-B3qUGv_G.mjs";
import { t as resolveSkillResourceCandidates } from "./resource-candidates-DWvSV-Yb.mjs";
import { i as createOpenClawCodingToolsInternalAsync, r as createOpenClawCodingToolsInternal } from "./agent-tools-QGgE-Vnu.mjs";
import { n as resolveExecToolConfig } from "./lazy-exec-tool-6rMYuHYl.mjs";
import { s as MAX_SKILL_INSTRUCTION_BYTES } from "./openclaw-tools-lor9xxfh.mjs";
import { t as resolveToolLoopDetectionConfig } from "./tool-loop-detection-config-uCpxGkcu.mjs";
import { o as transferCoreTtsToolResultProvenance, r as getCoreTtsToolResultMediaUrls } from "./tts-tool-result-provenance-BbSbWcUn.mjs";
import { t as log } from "./logger-BpVUgEyL.mjs";
import { t as runBestEffortCallback } from "./embedded-agent-subscribe.callback-BBye3ou6.mjs";
import { a as prepareHostWorkspaceReadiness, o as cloneHostSnapshot, r as captureRequiredWorkspaceToolFloor, t as bindHostToolSurface } from "./host-bound-tool-xXnbsmZ9.mjs";
import { t as bindHarnessReplyMedia } from "./reply-media-DtJachzW.mjs";
import { i as resolveSandboxSkillRuntimeInputs } from "./sandbox-skills-DF-8lllB.mjs";
import { t as prepareInstalledSkillCatalog } from "./installed-skill-runtime-Cl4Ax5o3.mjs";
import { t as formatHarnessApprovalPresentation } from "./native-hook-relay-approval-presentation-ZgNfnklL.mjs";
import path from "node:path";
import { isDeepStrictEqual } from "node:util";
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
	const fence = getOwnedSessionTranscriptWriterFence({ sessionTarget: target });
	if (target.sessionId !== admission.sessionId || target.sessionKey !== admission.sessionKey || target.agentId !== admission.agentId || !isSameOpenClawAgentDatabasePath(resolveSessionTranscriptDatabasePath(target), admission.storePath)) return;
	const assertLive = () => {
		params.assertCurrent();
		if (params.abortSignal?.aborted || owner.blocked() || !isDeepStrictEqual(owner.receipt(), admission) || !isDeepStrictEqual(owner.message(), admittedMessage) || admittedMessage["__openclaw"]?.steerTargetRunId !== void 0) throw new Error("current user admission is no longer available for native annotation");
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
		assertLive();
		if (sha256HexPrefixCore(JSON.stringify({
			role: "user",
			content: admittedMessage.content,
			upstreamUserText: fields.upstreamUserText || void 0
		}), 32) !== fields.mirrorSourceFingerprint) throw new Error("native prompt annotation does not match admitted content");
		const entryAuthority = await captureSessionEntryCurrentCheckAsyncInternal({
			...target,
			fields: [
				"sessionId",
				"lifecycleRevision",
				"activeWriterRunId"
			],
			errorMessage: "current user admission is no longer available for native annotation"
		});
		try {
			const selected = entryAuthority.entry;
			if (!selected || selected.sessionId !== admission.sessionId || selected.activeWriterRunId !== void 0 && selected.activeWriterRunId !== params.runId) throw new Error("current user admission is no longer available for native annotation");
			const expectedLifecycleRevision = target.expectedLifecycleRevision ?? fence?.expectedLifecycleRevision ?? selected.lifecycleRevision ?? null;
			const expectedWriterRunId = target.expectedWriterRunId ?? fence?.expectedWriterRunId;
			if (!sessionMatchesExpectedTranscriptTurn({ entry: selected }, {
				expectedSessionId: admission.sessionId,
				expectedLifecycleRevision,
				expectedWriterRunId
			}) || fence?.expectedWriterRunId !== void 0 && selected.activeWriterRunId !== fence.expectedWriterRunId || fence?.expectedLifecycleRevision !== void 0 && selected.lifecycleRevision !== fence.expectedLifecycleRevision) throw new Error("current user admission is no longer available for native annotation");
			const assertNativeCurrent = () => {
				assertLive();
				entryAuthority.source();
				const { logicalTurnId: _logicalTurnId, role: _role, ...anchor } = admission;
				if (!isDeepStrictEqual(readActiveTranscriptEntryAnchor(admission), anchor)) throw new Error("current user admission is no longer available for native annotation");
			};
			let verified = false;
			const { logicalTurnId: _logicalTurnId, role: _role, ...anchor } = admission;
			const rewritten = await rewritePreparedTranscriptMessageAtAnchor(anchor, (current) => {
				assertLive();
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
				verified = true;
				return isDeepStrictEqual(next, admittedMessage) ? void 0 : next;
			}, {
				active: "exact",
				expectedEntry: {
					lifecycleRevision: expectedLifecycleRevision,
					activeWriterRunId: expectedWriterRunId ?? selected.activeWriterRunId ?? null
				},
				assertCurrent: assertLive,
				assertNativeCurrent
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
			assertLive();
			if (rewritten) {
				await publishTranscriptUpdate(admission, {
					message: rewritten.message,
					messageId: admission.entryId,
					messageSeq: admission.activeMessagePosition + 1
				});
				assertLive();
			}
		} finally {
			entryAuthority.release();
		}
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
		localGitConfigParameters: identity.localGitConfigParameters,
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
		const { prepareHarnessContextMedia } = await import("./context-media-runtime-CpIyUNsF.mjs");
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
			const { prepareAgentWorkspaceAttachments } = await import("./workspace-access-jQNDRZ85.mjs");
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
//#region src/agents/harness/host-requester.ts
/** Requester facts a harness host forwards to tool hooks, frozen from the admitted attempt. */
function buildHarnessHostRequester(attempt) {
	return {
		...attempt.messageChannel ?? attempt.messageProvider ? { channel: attempt.messageChannel ?? attempt.messageProvider ?? void 0 } : {},
		...attempt.agentAccountId ? { accountId: attempt.agentAccountId } : {},
		...attempt.senderId ? { senderId: attempt.senderId } : {},
		...attempt.senderIsOwner !== void 0 ? { senderIsOwner: attempt.senderIsOwner } : {},
		...attempt.memberRoleIds?.length ? { roleIds: Object.freeze([...attempt.memberRoleIds]) } : {}
	};
}
//#endregion
//#region src/agents/harness/host-skills.ts
/** Carry the admitted pin's prepared entries through awaited tool construction. */
async function prepareHostSkillLibraryResources(selections, assertActive) {
	const context = captureOpenClawStateReadWorkerContext();
	return {
		entries: cloneHostSnapshot(await prepareSkillLibrarySelection(selections, { env: context.environment }, assertActive)),
		assertCurrent: assertActive
	};
}
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
		if (!isPathInside(params.requiredRoot, requiredRoot)) throw new Error("Skill permission root escapes the captured required workspace.");
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
			return resolved?.hostPath !== void 0 && isPathInside(requiredRoot, resolved.hostPath);
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
					if (result.workspaceRelativePath === void 0 || !isPathInside(requiredRoot, path.resolve(sandbox.workspaceDir, result.workspaceRelativePath))) throw new Error("Skill instructions escape the captured required workspace.");
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
/** Keep the original run and caller predicates attached to every host capability. */
function bindHarnessHostSourceAuthority(params) {
	const { attempt, sourceCaller, inactiveError } = params;
	const operationalRunInstance = attempt.admittedRunContext.operationalRunInstance;
	const admittedSource = captureAdmittedRunActiveAssertion(attempt.admittedRunContext, params.delegatedAuthority);
	const checkAdmitted = (assertSource) => {
		if (!params.isActive() || !admittedSource || attempt.admittedRunContext.operationalRunInstance !== operationalRunInstance) throw inactiveError("agent harness host capability is no longer active");
		try {
			assertSource();
		} catch {
			throw inactiveError("agent harness host capability is no longer active");
		}
		if (!params.isGatewayCurrent()) throw inactiveError("agent harness host capability is no longer active");
	};
	const assertAdmitted = composeSessionSourceAssertion([admittedSource], checkAdmitted);
	const receipt = sourceCaller?.receiptAuthority;
	const assertReceipt = receipt && captureGatewayToolReceiptAssertion(receipt, "agent harness host capability lost its source execution claim");
	const checkCaller = (assertSource) => {
		if (sourceCaller && (sourceCaller.agentId !== attempt.agentId || sourceCaller.sessionKey !== attempt.sessionKey) || sourceCaller?.workerTurnClaim && (sourceCaller.workerTurnClaim.sessionId !== attempt.sessionId || sourceCaller.workerTurnClaim.runId !== attempt.runId) || sourceCaller?.workerTurnClaim && !receipt) throw new Error("agent harness host capability lost its source execution claim");
		assertSource();
	};
	const assertCaller = composeSessionSourceAssertion([captureExternalSessionCommitGuard(assertReceipt)], checkCaller);
	return Object.assign(composeSessionSourceAssertion([assertAdmitted, assertCaller]), { assertScopeCurrent: () => {
		checkAdmitted(() => admittedSource?.assertScopeCurrent());
		checkCaller(() => (assertReceipt?.assertScopeCurrent ?? assertReceipt)?.());
	} });
}
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
function bindHarnessTrajectory(attempt, assertActive, assertScopeCurrent) {
	const recorder = attempt.trajectoryRecorder;
	if (!recorder) return {};
	const workSignal = getAsyncWorkSignal();
	const attemptSignal = attempt.abortSignal;
	const operationalRunInstance = attempt.admittedRunContext.operationalRunInstance;
	const assertCleanupActive = () => {
		assertScopeCurrent();
		if (attempt.admittedRunContext.operationalRunInstance !== operationalRunInstance || attempt.trajectoryRecorder !== recorder) throw new Error("agent harness trajectory cleanup is no longer active");
	};
	return { trajectory: Object.freeze({
		recordEvent: (type, data) => {
			workSignal?.throwIfAborted();
			attemptSignal?.throwIfAborted();
			assertActive();
			assertCleanupActive();
			recorder.recordEvent(type, data);
		},
		flush: async () => {
			assertCleanupActive();
			await recorder.flush();
			assertCleanupActive();
		}
	}) };
}
//#endregion
//#region src/agents/harness/node-execution-authority.ts
/** Full is admitted host authority, narrowed to one placement claim, never a request flag. */
async function createSessionNodeAuthorities(attempt, pluginId, requiredNodeCommands, assertActive, signal) {
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
	const source = captureSessionActorStorageOwner(session, {
		assertCurrent: assertActive,
		authorize() {}
	});
	const readProjected = () => {
		const owner = context.sessionRowProjectionOwner;
		return owner instanceof SessionRowProjectionBinding ? owner.readCommittedEntry({
			agentId: session.agentId,
			storePath: session.storePath,
			key: session.sessionKey
		}) : void 0;
	};
	const projected = source ? void 0 : readProjected();
	let retained;
	let retainedFullPermission;
	let sessionAllowed = false;
	let fullPermissionAllowed = false;
	if (!source && !projected) try {
		await withSessionEntryReadOnlyInWorker(session, assertActive, async (read, owner) => {
			if (!read.ok) throw read.error;
			const entry = read.value;
			sessionAllowed = entry?.sessionId === attempt.sessionId;
			fullPermissionAllowed = entry?.permissionMode === "full";
			if (owner.source) {
				const predicate = {
					databaseIdentity: `file:${owner.source.databaseIdentity}`,
					sessionKey: resolveSqliteSessionKey(session.sessionKey, session.agentId),
					entry
				};
				retained = retainPreparedSessionEntryPredicate({
					...predicate,
					matches: (before, after) => before?.sessionId === after?.sessionId
				});
				if (admittedFull) retainedFullPermission = retainPreparedSessionEntryPredicate({
					...predicate,
					matches: (before, after) => before?.permissionMode === after?.permissionMode
				});
			}
		});
	} catch (error) {
		retained?.release();
		retainedFullPermission?.release();
		throw error;
	}
	const assertRequestCurrent = (request) => {
		assertActive();
		const entry = source ? readCapturedSessionActorEntry(source, session.sessionKey) : projected ? readProjected()?.entry : void 0;
		const currentSessionAllowed = source || projected ? entry !== void 0 && entry.sessionId === attempt.sessionId && (request.source !== "session-full" || entry.permissionMode === "full") : sessionAllowed && retained?.isCurrent() && (request.source !== "session-full" || fullPermissionAllowed && retainedFullPermission?.isCurrent());
		if (signal.aborted || getActivePluginRegistry() !== gatewayRegistry || pluginOwners.some((isCurrent) => !isCurrent?.()) || request.source === "session-full" && (attempt.permissionMode !== "full" || !requiredNodeCommands.has(request.command)) || resolveContext && resolveContext() !== context || request.pluginId !== pluginId || !currentSessionAllowed || request.workspace.sessionKey !== attempt.sessionKey || request.workspace.sessionId !== attempt.sessionId) throw new Error("admitted node execution authority is no longer current");
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
		release: () => {
			retained?.release();
			retainedFullPermission?.release();
		},
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
	const requestCustody = captureExecRequestCustody(attempt);
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
	const denyToolCalls = params.toolCalls === "deny";
	const operationalRunInstance = attempt.admittedRunContext.operationalRunInstance;
	const delegatedAuthority = getAdmittedRunDelegatedAuthority(attempt.admittedRunContext);
	const requesterProfileId = readAdmittedRunOperatorAuthority(attempt.admittedRunContext)?.profileId;
	if (!delegatedAuthority) throw new Error("agent harness host capability requires active admitted run authority");
	const { lifecycleGeneration } = delegatedAuthority;
	const { runId } = delegatedAuthority.operationalRunInstance;
	const coreTtsToolResults = /* @__PURE__ */ new WeakSet();
	let active = true;
	const capabilityAbortController = new AbortController();
	const bindAbortSignal = (signal) => signal ? AbortSignal.any([signal, capabilityAbortController.signal]) : capabilityAbortController.signal;
	const inheritedCaller = getGatewayToolCallerIdentity();
	const sourceCaller = inheritedCaller?.operationalRunInstance === operationalRunInstance ? inheritedCaller : void 0;
	let personalToolParticipants = sourceCaller?.personalToolParticipants;
	const inactiveError = (message) => {
		throwAgentRunRestartAbortReason(attemptSignal?.aborted ? attemptSignal.reason : workSignal?.reason);
		return new Error(message);
	};
	const boundGatewayContext = getGatewayContextResolver(attempt.admittedRunContext);
	const assertActive = bindHarnessHostSourceAuthority({
		attempt,
		delegatedAuthority,
		sourceCaller,
		isActive: () => active,
		isGatewayCurrent: () => !boundGatewayContext || callerIdentity?.gatewayContextResolver?.() !== void 0,
		inactiveError
	});
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
	const workspaceReadiness = prepareHostWorkspaceReadiness(sessionKey, assertActive);
	const observeCoreTtsToolResult = (result) => {
		if (typeof result === "object" && result !== null && getCoreTtsToolResultMediaUrls(result)) coreTtsToolResults.add(result);
	};
	const requester = buildHarnessHostRequester(attempt);
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
		abortSignal: bindAbortSignal(attempt.abortSignal),
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
	const hookContextForOperation = (operation) => {
		const cwd = operation?.cwd !== void 0 ? normalizeNativeOperationCwd(operation.cwd, hookContext.cwd) : void 0;
		return cwd ? Object.freeze({
			...hookContext,
			cwd
		}) : hookContext;
	};
	const runBeforeToolCallWithAssertion = async (assertCurrent, { nativeOperation, approvalMode, ...request }) => {
		assertCurrent();
		if (denyToolCalls) return {
			blocked: true,
			kind: "veto",
			reason: "Tool calls are denied for this side question."
		};
		if (workspaceReadiness.beforeToolCall) await workspaceReadiness.beforeToolCall(request, assertCurrent);
		const hostApprovalMode = approvalMode === "defer" ? "defer" : "request";
		const actionHookContext = hookContextForOperation(nativeOperation);
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
	const scheduledToolSources = /* @__PURE__ */ new WeakMap();
	const bindTools = (tools, options, observeResult) => bindHostToolSurface(tools, {
		assertActive,
		observeResult,
		callerIdentity,
		hookContext: hookContextForOperation(options),
		abortSignal: bindAbortSignal(attempt.abortSignal),
		workspaceReadiness: workspaceReadiness.readiness
	});
	const bindToolSurface = (tools, options) => bindTools(tools, options, () => {});
	const bindModelExecution = nativeModelPolicySupported ? (model) => bindHarnessModelExecution(attempt.admittedRunContext, model, assertActive) : void 0;
	const skillResourceSnapshot = (options) => !requiredWorkspace && !hostSandboxEnabled && !options?.sandbox?.enabled && options?.includeCoreTools !== false && options?.toolConstructionPlan?.includeBaseCodingTools !== false ? skillsSnapshot : void 0;
	const toolConstructionInputs = (options, libraryEntries, assertCurrent = assertActive) => {
		assertCurrent();
		const effectiveOptions = {
			...options,
			...requiredWorkspace?.apply(options)
		};
		return {
			options: {
				...effectiveOptions,
				githubPublicationAvailable,
				runtimePluginToolGrant,
				skillsSnapshot: options?.skillsSnapshot ?? skillsSnapshot,
				installedSkills: getInstalledSkills(effectiveOptions.sandbox, effectiveOptions.sessionPermissionPolicy?.root),
				skillUsagePaths: options?.skillUsagePaths ?? skillUsagePaths,
				operationalRunInstance
			},
			skillReadResources: resolveSkillResourceCandidates(skillResourceSnapshot(options), libraryEntries)
		};
	};
	const bindCreatedTools = (sourceTools, bindingOptions) => {
		const tools = bindTools(sourceTools, bindingOptions, observeCoreTtsToolResult);
		for (const tool of tools) if (tool.name === "exec" || tool.name === "process") scheduledToolSources.set(tool, Object.freeze({
			targetTool: tool.name,
			execute: tool.execute
		}));
		return tools;
	};
	const withToolConstructionScope = (run) => withAgentQuestionAnswerAuthority(resolveAgentQuestionAnswerAuthority(capabilities), () => withInstallationTarget(installationTarget, run));
	const capabilities = Object.freeze({
		kind: "agent-harness-host-capability",
		version: 1,
		assertActive,
		captureRequestCustody: () => {
			assertActive();
			return requestCustody;
		},
		...workspaceReadiness.capability ? { workspaceReadiness: workspaceReadiness.capability } : {},
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
		...bindHarnessTrajectory(attempt, assertActive, assertActive.assertScopeCurrent),
		preparedEnvironment: () => {
			assertActive();
			return preparedRunEnvironment;
		},
		activeComputerContext: () => {
			assertActive();
			return buildActiveNodeContextText(requesterProfileId);
		},
		bindToolSurface,
		/** @deprecated Await createToolSurfaceAsync for worker-backed tool construction. Supported through 2026-12-31. */
		createToolSurface: (options, bindingOptions) => {
			warnPluginSdkDeprecation({
				family: "agent-harness-host",
				method: "createToolSurface",
				replacement: "createToolSurfaceAsync",
				compatibility: "Synchronous tool construction retains its pinned skill resources."
			});
			const inputs = toolConstructionInputs(options, loadSkillLibrarySelection(skillResourceSnapshot(options)?.librarySelections ?? []));
			return bindCreatedTools(withToolConstructionScope(() => createOpenClawCodingToolsInternal(inputs.options, inputs.skillReadResources)), bindingOptions);
		},
		createToolSurfaceAsync: async (options, bindingOptions) => {
			const librarySelections = skillResourceSnapshot(options)?.librarySelections ?? [];
			const library = librarySelections.length ? await prepareHostSkillLibraryResources(librarySelections, assertActive) : void 0;
			const inputs = toolConstructionInputs(options, library?.entries ?? [], library?.assertCurrent);
			const sourceTools = await withToolConstructionScope(() => createOpenClawCodingToolsInternalAsync(inputs.options, inputs.skillReadResources, void 0, void 0, {
				assertCurrent: library?.assertCurrent ?? assertActive,
				signal: bindAbortSignal(attemptSignal)
			}));
			return bindCreatedTools(sourceTools, bindingOptions);
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
		runWithScope: async (run) => {
			const preparedCaller = getGatewayToolCallerIdentity();
			if (preparedCaller?.operationalRunInstance === operationalRunInstance) {
				personalToolParticipants ??= preparedCaller.personalToolParticipants;
				if (callerIdentity && personalToolParticipants) callerIdentity.personalToolParticipants = personalToolParticipants;
			}
			const { release, ...nodeAuthorities } = await createSessionNodeAuthorities(attempt, params.pluginId, requiredNodeCommands, assertActive, bindAbortSignal(attempt.abortSignal));
			try {
				return await withPluginRuntimeGatewayRequestScope({
					isWebchatConnect: () => false,
					...getPluginRuntimeGatewayRequestScope(),
					...nodeAuthorities
				}, run);
			} finally {
				release?.();
			}
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
