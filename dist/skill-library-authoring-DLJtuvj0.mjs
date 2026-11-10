import { t as SkillLibraryError } from "./skill-library-error-z-Nwz4n5.mjs";
import { x as registerAgentRunDelegatedAuthorityClosedHandler } from "./agent-run-registry-gmaPgO-n.mjs";
import { f as isAgentEventLifecycleGenerationCurrent } from "./agent-events-Bf3Js0D3.mjs";
import { d as hasGatewayAdminScope } from "./operator-scopes-BO7_XQCg.mjs";
import { u as getAdmittedRunDelegatedAuthority } from "./admitted-run-context-h1ULFETN.mjs";
import { s as isOperatorUiClient } from "./message-channel-DmAdWHmL.mjs";
import { p as readResidentUserProfileId, t as captureResidentUserProfileAccess } from "./user-profile-list-BdNJnrJe.mjs";
import { o as getGatewayToolCallerIdentity } from "./gateway-caller-context-Be176_GV.mjs";
import { f as retainGatewayDeviceRevocation } from "./device-revocation-DpGQRUdo.mjs";
import { r as captureGatewayOperatorRunAuthority } from "./operator-run-authority-BcrXDfhQ.mjs";
import { t as formatForLog } from "./ws-log-BIFX57Bv.mjs";
import { d as validateSkillLibraryPath } from "./bundle-CsGYNL0a.mjs";
import { f as waitForChatAbortTerminalPersistence } from "./chat-abort-lifecycle-internal-EU815r6Q.mjs";
import { r as isChatAbortControllerEntryAbortable, t as abortChatRunById } from "./chat-abort-CKC_-urc.mjs";
import { t as abortQueuedChatTurnById } from "./chat-queued-turns-CBHBVpa_.mjs";
import { o as prepareSkillLibrarySession } from "./selection-B3qUGv_G.mjs";
import { f as resolveSkillLibraryActorFromProfile } from "./store-DmveTVM5.mjs";
import { t as readGatewayOperatorRecoverySource } from "./operator-run-recovery-BF0mZGB3.mjs";
import { c as revokeRequesterCronAuthority, r as consumeRequesterCronAuthorityAdmission } from "./requester-cron-authority-DgypcQxN.mjs";
import { a as prepareChatAbortSessionSnapshot, i as deferAbortedPartialPersistence, o as retainChatAbortSessionSnapshot, r as captureAbortedPartial } from "./chat-aborted-partial-BuPGs0tJ.mjs";
import { n as createChatAbortOps } from "./chat-abort-ops-cs9Qjbw9.mjs";
import { a as mutateSkillLibrary, c as saveSkillLibrary, i as listSkillLibrary, n as libraryAuthority, o as readSkillLibrary, s as resolveSkillLibraryPresentation, t as activateLibrarySelection } from "./skills-library-Uk025IKc.mjs";
import { isDeepStrictEqual } from "node:util";
//#region src/gateway/operator-run-cancellation.ts
/** Retain authority before its execution or queue owner can arm cancellation. */
async function retainGatewayOperatorRun(params) {
	const captured = await captureGatewayOperatorRunAuthority(params);
	const releaseSource = captured?.release ?? retainGatewayDeviceRevocation(params.hasCurrentClientAuthority);
	const signal = captured?.authority.signal;
	const partialSession = signal && params.entry ? retainChatAbortSessionSnapshot(params.abortSession ? {
		ok: true,
		value: params.abortSession
	} : await prepareChatAbortSessionSnapshot({
		cfg: params.context.getRuntimeConfig(),
		key: params.entry.sessionKey,
		agentId: params.entry.agentId
	})) : void 0;
	const cancellation = signal && params.entry && partialSession ? createGatewayOperatorRunCancellation({
		signal,
		runId: params.runId,
		entry: params.entry,
		context: params.context,
		session: partialSession.read
	}) : void 0;
	return {
		authority: captured?.authority,
		armCancellation: () => cancellation?.arm(),
		retireCancellation: () => {
			cancellation?.release();
			partialSession?.release();
		},
		release: () => {
			cancellation?.release();
			partialSession?.release();
			releaseSource?.();
		}
	};
}
/** Queue retirement detaches cancellation while the original authority can still settle work. */
function createGatewayOperatorRunCancellation(params) {
	const { signal, runId, entry, context } = params;
	const controller = entry.controller;
	const sessionKey = entry.sessionKey;
	const lifecycleGeneration = entry.lifecycleGeneration;
	let released = false;
	let armed = false;
	let cancellationStarted = false;
	const ownsLifetime = () => !released && (!lifecycleGeneration || isAgentEventLifecycleGenerationCurrent(lifecycleGeneration));
	const ownsActiveRun = () => ownsLifetime() && context.chatAbortControllers.get(runId) === entry && entry.controller === controller && entry.sessionKey === sessionKey && !entry.registrationCleanupRequested && entry.projectSessionTerminalPersistence === void 0 && entry.projectSessionTerminalPersisted !== true && isChatAbortControllerEntryAbortable(entry);
	const cancelQueuedTurn = () => {
		const queued = context.chatQueuedTurns.get(runId);
		if (!ownsLifetime() || queued?.controller !== controller || queued.abortable === false) return;
		abortQueuedChatTurnById(context.chatQueuedTurns, {
			runId,
			sessionKey: queued.sessionKey,
			stopReason: "rpc",
			diagnosticReason: "authority-revoked"
		});
	};
	const cancel = async () => {
		if (context.chatQueuedTurns.get(runId)?.controller === controller) {
			cancelQueuedTurn();
			return;
		}
		if (!ownsActiveRun()) return;
		const text = context.chatRunState.resolveBuffer(runId, { final: true }).text;
		const snapshot = entry.controlUiVisible !== false && text.trim() ? captureAbortedPartial({
			runId,
			sessionKey,
			sessionId: entry.sessionId,
			text,
			abortOrigin: "rpc",
			resolveTerminalProducer: entry.resolveTerminalProducer,
			session: params.session()
		}) : void 0;
		const { aborted } = abortChatRunById(createChatAbortOps(context), {
			runId,
			sessionKey,
			stopReason: "rpc",
			diagnosticReason: "authority-revoked",
			onAbortCommitted: () => deferAbortedPartialPersistence(snapshot, context)
		});
		if (!aborted) return;
		const failures = (await Promise.allSettled([waitForChatAbortTerminalPersistence(entry), ...snapshot ? [import("./chat-transcript-persistence.runtime.js").then((transcript) => transcript.persistAbortedPartials({
			context,
			snapshots: [snapshot]
		}))] : []])).flatMap((result) => result.status === "rejected" ? [result.reason] : []);
		if (failures.length === 1) throw failures[0];
		if (failures.length > 1) throw new AggregateError(failures, "Operator access cancellation did not fully settle");
	};
	const onAbort = () => {
		if (released || cancellationStarted) return;
		cancellationStarted = true;
		context.trackExecution(cancel).catch((error) => {
			context.logGateway.warn(`Operator access cancellation failed: ${formatForLog(error)}`);
		});
	};
	return {
		arm: () => {
			if (released || armed) return;
			armed = true;
			signal.addEventListener("abort", onAbort, { once: true });
			if (signal.aborted) onAbort();
		},
		release: () => {
			released = true;
			signal.removeEventListener("abort", onAbort);
		}
	};
}
//#endregion
//#region src/gateway/server-methods/cron-creator-authority-admission.ts
/** Classifies a direct operator connection without granting any capability. */
function isDirectGatewayUserClient(client) {
	const internal = client?.internal;
	return client != null && internal?.syntheticClient !== true && internal?.senderAttribution === void 0 && internal?.approvalRuntime !== true && internal?.cronRunContinuation !== true && internal?.agentRuntimeIdentity === void 0 && internal?.pluginRuntimeOwnerId === void 0 && internal?.agentRunTracking === void 0 && internal?.pluginSubagentRequester === void 0 && internal?.runtimePluginToolGrant === void 0 && internal?.delegatedToolPolicyHandoffId === void 0;
}
function isDirectGatewayUserTurn(params) {
	return params.runId.trim().length > 0 && isDirectGatewayUserClient(params.client) && Boolean(params.resolvedSessionKey?.trim()) && !params.spawnedBy?.trim() && params.inputProvenance === void 0 && !params.disallowed;
}
function resolveDirectOperatorAuthority(params) {
	const internal = params.client?.internal;
	const runId = params.runId.trim();
	const isDirectTurn = isDirectGatewayUserTurn(params);
	if (isDirectTurn && params.resolvedSessionKey) revokeRequesterCronAuthority(params.resolvedSessionKey);
	return isDirectTurn && hasGatewayAdminScope(params.client) && (internal?.isLocalClient === true || internal?.controlUiAdmin === true) ? Object.freeze({
		runId,
		callerOrigin: internal?.isLocalClient === true ? { kind: "local" } : { kind: "unknown" },
		...internal?.controlUiAdmin === true ? { managementEntitlement: { source: "control-ui-admin" } } : {},
		...internal?.isLocalClient !== true ? { callerScopedCreation: true } : {},
		...params.isCurrent ? { isCurrent: params.isCurrent } : {}
	}) : void 0;
}
/** Mints cron authority for an admitted local operator or authenticated Control UI admin turn. */
function resolveGatewayCronCreatorAuthorityAdmission(params) {
	const request = params.request;
	if (params.isRestartRecoveryResumeRun && params.resolvedSessionKey && params.sessionId && !params.spawnedBy && !params.hasRestoredCronContinuation && !params.isOneShotModelRun && hasGatewayAdminScope(params.client)) {
		const restored = readGatewayOperatorRecoverySource(params.client?.internal?.operatorRunAuthority, {
			runId: params.runId,
			sessionKey: params.resolvedSessionKey,
			sessionId: params.sessionId
		});
		if (restored && (restored.localOperator || restored.controlUiAdmin)) return Object.freeze({
			runId: params.runId,
			callerOrigin: restored.localOperator ? { kind: "local" } : { kind: "unknown" },
			...restored.controlUiAdmin ? { managementEntitlement: { source: "control-ui-admin" } } : {},
			...!restored.localOperator ? { callerScopedCreation: true } : {},
			isCurrent: () => {
				params.client?.internal?.operatorRunAuthority?.assertCurrent();
				return params.isCurrent?.() !== false;
			}
		});
	}
	if (params.client?.internal?.syntheticClient === true && !params.hasRestoredCronContinuation && !params.isOneShotModelRun && !params.isRestartRecoveryResumeRun) {
		const continuation = consumeRequesterCronAuthorityAdmission({
			runId: params.runId,
			sessionKey: params.resolvedSessionKey,
			sessionId: params.sessionId,
			inputProvenance: params.inputProvenance
		});
		if (continuation) return continuation;
	}
	return resolveDirectOperatorAuthority({
		...params,
		disallowed: params.hasRestoredCronContinuation || params.isOneShotModelRun || params.isRestartRecoveryResumeRun || request.modelRun === true || request.acpTurnSource !== void 0 || request.internalRuntimeHandoffId !== void 0 || request.internalExecutionIdentityRetry === true || request.internalExecutionIdentityRecoveryAttempt !== void 0 || request.execApprovalFollowupExpectedSessionId !== void 0 || request.internalEvents !== void 0 || request.sessionEffects === "internal" || request.suppressPromptPersistence === true || request.swarmCollector === true || request.lane === "subagent"
	});
}
/** Current external user input, independently of the permission being admitted. */
function isDirectGatewayChatUserTurn(params) {
	return isDirectGatewayUserTurn({
		...params,
		disallowed: !params.isDirectExternalUser || params.hasExplicitOrigin || params.hasRestoredCronContinuation || params.isSystemGenerated || params.turnKind !== "main"
	});
}
/** Mints the same authority for an admitted ordinary operator chat.send turn. */
function resolveGatewayChatCronCreatorAuthorityAdmission(params) {
	return resolveDirectOperatorAuthority({
		...params,
		disallowed: params.isIncognito || params.isReconnectResume || !isDirectGatewayChatUserTurn(params)
	});
}
//#endregion
//#region src/gateway/session-input-participant.ts
/** Only the live authenticated profile establishes a person; client metadata stays unresolved. */
function resolveGatewayInputParticipant(client, provenance) {
	if (!client || client.internal?.syntheticClient || provenance && provenance.kind !== "external_user") return;
	const profileId = client.authenticatedUserProfile?.profileId;
	if (profileId) return {
		type: "profile",
		id: profileId
	};
	const clientInfo = client.connect?.client;
	return !clientInfo || isOperatorUiClient(clientInfo) ? void 0 : {
		type: "observation",
		pluginId: null,
		accountId: null,
		senderKind: "unknown",
		id: clientInfo.id
	};
}
//#endregion
//#region src/skills/library/authoring.ts
/** Model edits are named changes; unread binary resources retain their exact bytes and modes. */
function mergeSkillLibrarySupportFiles(current, upserts = [], deletes = []) {
	const changed = /* @__PURE__ */ new Set();
	for (const filePath of [...upserts.map((file) => file.path), ...deletes]) {
		validateSkillLibraryPath(filePath);
		const folded = filePath.toLowerCase();
		if (folded === "skill.md" || changed.has(folded)) throw new SkillLibraryError("INVALID_BUNDLE", "Support edits cannot include SKILL.md, duplicate paths, or conflicting upserts and deletes. Use proposal_content for SKILL.md.");
		changed.add(folded);
	}
	const files = new Map(current.map((file) => [file.path, file]));
	for (const filePath of deletes) if (!files.delete(filePath)) throw new SkillLibraryError("INVALID_BUNDLE", `Support file not found: ${filePath}`);
	for (const file of upserts) files.set(file.path, {
		...file,
		executable: file.executable ?? files.get(file.path)?.executable
	});
	return [...files.values()];
}
//#endregion
//#region src/gateway/skill-library-authoring.ts
const active = /* @__PURE__ */ new Map();
/** A mixed-person steer revokes mutation authority without changing the session's committed pins. */
function invalidateSkillAuthoringForOtherRequester(sessionKey, profileId) {
	for (const grant of active.get(sessionKey) ?? []) if (grant.profileId !== profileId) {
		const canonical = readResidentUserProfileId(grant.profileId);
		if (!profileId || !canonical || canonical !== readResidentUserProfileId(profileId)) grant.revoke();
	}
}
function canPrepareSkillAuthoring(options, isHumanTurn) {
	const client = options.client;
	return Boolean(isHumanTurn && client?.authenticatedUserProfile && !client.internal?.syntheticClient && !client.internal?.agentRuntimeIdentity && !client.internal?.senderAttribution && !client.internal?.pluginRuntimeOwnerId && !client.internal?.approvalRuntime && !client.internal?.cronRunContinuation && !client.internal?.delegatedToolPolicyHandoffId);
}
async function prepareGatewaySkillLibrarySession(options, isHumanTurn) {
	if (!canPrepareSkillAuthoring(options, isHumanTurn)) return;
	const client = options.client;
	const authority = libraryAuthority(options);
	const scopes = [...authority.scopes];
	return prepareSkillLibrarySession({
		...authority,
		assertCurrent() {
			authority.assertCurrent();
			if (options.client !== client || client?.authenticatedUserProfile?.profileId !== authority.profileId || !isDeepStrictEqual(client?.connect.scopes ?? [], scopes)) throw new SkillLibraryError("AUTHORITY_EXPIRED", "Skill library requester changed. Retry.");
		}
	});
}
async function prepareGatewaySkillLibraryTurn(request, prepareSessionCreation, onAuthoring) {
	const prepared = await prepareGatewaySkillLibrarySession(request.owner, request.isHumanTurn);
	await prepareSessionCreation(prepared);
	onAuthoring();
	return prepareGatewaySkillAuthoring(request.owner, request.sessionKey, request.isHumanTurn, prepared);
}
/** Only ordinary attributed human ingress may mint a namespace; actions remain normal tool policy. */
async function prepareGatewaySkillAuthoring(options, sessionKey, isHumanTurn, prepared) {
	if (!canPrepareSkillAuthoring(options, isHumanTurn)) return;
	const authority = libraryAuthority(options);
	const library = prepared?.presentation ?? await resolveSkillLibraryPresentation(authority);
	prepared?.assertCurrent();
	authority.assertCurrent();
	if (!library.profileId || library.defaultTarget === "unavailable") return;
	const profileId = library.profileId;
	invalidateSkillAuthoringForOtherRequester(sessionKey, profileId);
	let bound;
	let revoked = false;
	let owner;
	const assertCurrent = () => {
		authority.assertCurrent();
		const caller = getGatewayToolCallerIdentity();
		if (revoked || !bound || !owner || getAdmittedRunDelegatedAuthority(bound) !== owner || caller?.operationalRunInstance !== bound.operationalRunInstance || !caller.receiptAuthority || caller.receiptAuthority() === false) throw new SkillLibraryError("AUTHORITY_EXPIRED", "Personal authoring authority expired or this turn has mixed requesters. Send a fresh attributed message requesting the change.");
	};
	const currentAuthority = {
		...authority,
		assertCurrent,
		namespace: "personal"
	};
	return {
		target: "personal",
		defaultTarget: library.defaultTarget,
		multipleProfiles: library.multipleProfiles,
		bind(context) {
			if (bound) {
				if (context !== bound) throw new SkillLibraryError("AUTHORITY_EXPIRED", "Personal authoring cannot move to a replacement run. Send a fresh message.");
				return;
			}
			bound = context;
			owner = getAdmittedRunDelegatedAuthority(context);
			if (!owner) throw new SkillLibraryError("AUTHORITY_EXPIRED", "Personal authoring run was not admitted.");
			const grant = {
				profileId,
				revoke: () => {
					revoked = true;
				}
			};
			const grants = active.get(sessionKey) ?? /* @__PURE__ */ new Set();
			grants.add(grant);
			active.set(sessionKey, grants);
			const stop = registerAgentRunDelegatedAuthorityClosedHandler((closed) => {
				if (closed !== owner) return;
				revoked = true;
				grants.delete(grant);
				if (!grants.size) active.delete(sessionKey);
				stop();
			});
		},
		assertWorkspaceCurrent() {
			assertCurrent();
			const profile = captureResidentUserProfileAccess(profileId).readCurrentFacts();
			if (!resolveSkillLibraryActorFromProfile(authority, authority.getConfig(), {
				id: profile.profileId,
				role: profile.assignedRole,
				githubLogin: profile.githubLogin
			}).admin) throw new SkillLibraryError("FORBIDDEN", "Workspace authoring requires current administrator authority.");
		},
		async invoke(input) {
			assertCurrent();
			if (input.action === "list") return listSkillLibrary(currentAuthority);
			if (input.action === "read" || input.action === "activate") {
				if (!input.skillId) throw new SkillLibraryError("INVALID_BUNDLE", "Choose skill_id from list.");
				if (input.action === "read") return readSkillLibrary(currentAuthority, input.skillId, input.revision);
				return activateLibrarySelection({
					...options,
					sessionMutationCommitGuard: assertCurrent
				}, {
					sessionKey,
					action: "attach",
					skillId: input.skillId,
					revision: input.revision
				});
			}
			if (input.action !== "create" && (!input.skillId || !input.expectedRevision)) throw new SkillLibraryError("INVALID_BUNDLE", "Read the skill first; supply skill_id and expected_revision from that read.");
			if (input.action === "create" || input.action === "update") {
				const current = input.action === "update" ? await readSkillLibrary(currentAuthority, input.skillId, input.expectedRevision) : void 0;
				const slug = input.slug ?? current?.entry.slug;
				const content = input.content ?? current?.content;
				if (!slug || !content) throw new SkillLibraryError("INVALID_BUNDLE", "Creating a skill requires name (the human slug) and complete proposal_content.");
				return saveSkillLibrary(currentAuthority, {
					slug,
					content,
					files: mergeSkillLibrarySupportFiles(current?.files ?? [], input.files, input.deleteFiles),
					skillId: input.action === "update" ? input.skillId : void 0,
					expectedRevision: input.action === "create" ? null : input.expectedRevision
				});
			}
			return mutateSkillLibrary(currentAuthority, {
				action: input.action,
				skillId: input.skillId,
				expectedRevision: input.expectedRevision,
				revision: input.revision
			});
		}
	};
}
//#endregion
export { isDirectGatewayChatUserTurn as a, resolveGatewayCronCreatorAuthorityAdmission as c, resolveGatewayInputParticipant as i, retainGatewayOperatorRun as l, prepareGatewaySkillAuthoring as n, isDirectGatewayUserClient as o, prepareGatewaySkillLibraryTurn as r, resolveGatewayChatCronCreatorAuthorityAdmission as s, invalidateSkillAuthoringForOtherRequester as t };
