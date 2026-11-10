import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { a as resolveGlobalSingleton } from "./global-singleton-DrXvEBww.mjs";
import "./src-Djeo9OvP.mjs";
import { t as stableStringify } from "./stable-stringify-Djn3uxNo.mjs";
import { r as normalizeArrayBackedTrimmedStringList } from "./string-normalization-D6DKCpwE.mjs";
import { a as hasGatewayClientCap, t as GATEWAY_CLIENT_CAPS } from "./client-info-BgcoFakQ.mjs";
import "./user-profile-constants-DfyZS95p.mjs";
import { t as normalizeChatType } from "./chat-type-qwvaeaJu.mjs";
import { t as warnPluginSdkDeprecation } from "./sdk-deprecation-DjTmOhOX.mjs";
import { h as resolveSessionAgentId } from "./agent-scope-DXrnO3F4.mjs";
import { l as readToolAllowlistIntersection, t as attachToolAllowlistIntersection } from "./tool-policy-shared-PsZCKeeN.mjs";
import { a as isRuntimeToolAllowed, o as isToolAllowedByPolicies } from "./tool-policy-match--5jlhAPZ.mjs";
import "./tool-policy-14GRhbFd.mjs";
import { t as captureRuntimeConfig } from "./runtime-source-projection-DAkjzBhe.mjs";
import { t as assertAdmittedRunOperatorAuthority } from "./admitted-run-context-h1ULFETN.mjs";
import { t as resolveGroupSessionKey } from "./group-qLatmSbQ.mjs";
import { i as getCommandOwnerAuthority, n as bindCommandOwnerAuthority } from "./command-owner-authority-DGt-GTro.mjs";
import { g as retainPreparedSessionEntryPredicate } from "./session-accessor.sqlite-entry-cache-publication-state-4Z0giEC3.mjs";
import { a as readCapturedSessionActorEntry, n as captureSessionActorStorageOwner } from "./session-actor-storage-binding-oCtbPk00.mjs";
import { t as assertSessionEntryCohortScope } from "./session-entry-cohort-scope-BWJvT1Qn.mjs";
import { c as withSessionEntriesFromStoresInWorker } from "./session-entry-read-runtime-CgqUrGct.mjs";
import { I as prepareSessionCapabilityRead, N as createMemorySessionCapabilityStore } from "./session-accessor.sqlite-entry-store-B3Lv6xes.mjs";
import { n as prepareGatewaySessionEntryReadOnlyInWorker } from "./session-utils-store-worker-u3lCvEEg.mjs";
import { r as readOperatorModelPolicyMembership } from "./operator-model-policy-3pT6BgLA.mjs";
import { i as transferRequesterProfile, n as getRequesterProfile, r as readTransferredRequesterProfile } from "./requester-profile-u6QLGOHK.mjs";
import { _ as recordPreparedToolAuthorityRead, g as readReplyInputChannel, l as isSharedGatewayOwnerRunAuthority, n as bindReplyInputChannel, r as bindReplyToolAuthorityCallerRead } from "./host-private-capabilities-eTr803c9.mjs";
import { r as resolveSandboxRuntimeStatus } from "./runtime-status-DWm-5zUj.mjs";
import { t as resolveOriginMessageProvider } from "./origin-routing-BwhrEsoP.mjs";
import { r as resolveConversationCapabilityProfile } from "./conversation-capability-profile-BVWQsqkw.mjs";
import { i as resolveConversationToolPolicies } from "./conversation-tool-policy-pipeline-DNbcwb7L.mjs";
import { r as GATEWAY_OWNER_ONLY_CORE_TOOLS } from "./dangerous-tools-7P77gGzs.mjs";
import { createHash } from "node:crypto";
import { isDeepStrictEqual } from "node:util";
//#region src/auto-reply/reply/reply-tool-authority-cohort.ts
function captureReplyToolAuthoritySession(loaded) {
	return {
		storePath: loaded.storePath,
		canonicalKey: loaded.canonicalKey,
		storeKeys: [...loaded.storeKeys],
		agentId: loaded.agentId,
		source: loaded.capturedReadSource,
		sources: loaded.capturedReadSources,
		sessionId: loaded.entry?.sessionId,
		lifecycleRevision: loaded.entry?.lifecycleRevision
	};
}
/** Refresh classification on the admitted owner without changing the independent caller plan. */
async function withReplyToolAuthorityCohort(params) {
	const { reader, original, readPlan } = params;
	reader?.assertCurrent();
	if (!reader || !original || !readPlan || !original.source || original.sources?.length !== 1 || original.storeKeys.length !== 1 || original.storeKeys[0] !== original.canonicalKey || original.canonicalKey !== reader.sessionKey || original.agentId !== reader.logicalAgentId || original.source.path !== reader.database.path) {
		const value = await params.prepare();
		reader?.assertCurrent();
		return value;
	}
	const assertCurrent = () => {
		params.assertCurrent();
		readPlan.assertCurrent();
		reader.assertCurrent();
	};
	const key = assertSessionEntryCohortScope(reader, {
		agentId: original.agentId,
		storePath: original.source.path,
		sessionKey: original.canonicalKey,
		env: params.env
	});
	const preparedEntry = await reader.withRead({
		sessionKeys: [key],
		snapshotFields: []
	}, assertCurrent, (read, assertPrepared) => {
		assertPrepared();
		const entry = read.entries.find((row) => row.sessionKey === key)?.entry;
		if (!isDeepStrictEqual(read.source, original.source) || entry?.sessionId !== original.sessionId || entry?.lifecycleRevision !== original.lifecycleRevision) throw new Error("Tool authority classification source changed");
		assertPrepared();
		return entry;
	});
	const value = await params.consume(preparedEntry);
	assertCurrent();
	return value;
}
//#endregion
//#region src/auto-reply/reply/reply-tool-authority-inbound.ts
const authorizedCrossSurfaceContinuations = /* @__PURE__ */ new WeakMap();
function applyReplyToolAuthorityOverlay(snapshot, overlay) {
	return {
		...snapshot,
		originatingChannel: overlay.originatingChannel,
		operatorAuthority: overlay.operatorAuthority,
		toolsAllow: overlay.toolsAllow,
		disableTools: overlay.disableTools,
		run: {
			...snapshot.run,
			permissionMode: overlay.permissionMode,
			toolOverrides: overlay.toolOverrides,
			messageProvider: overlay.messageProvider,
			chatType: overlay.chatType,
			agentAccountId: overlay.agentAccountId,
			conversationToolPolicy: overlay.conversationToolPolicy,
			groupId: overlay.groupId,
			groupChannel: overlay.groupChannel,
			groupSpace: overlay.groupSpace,
			memberRoleIds: overlay.memberRoleIds,
			spawnedBy: overlay.spawnedBy,
			senderId: overlay.senderId,
			senderName: overlay.senderName,
			senderUsername: overlay.senderUsername,
			senderE164: overlay.senderE164,
			senderIsOwner: overlay.senderIsOwner,
			inputProvenance: overlay.inputProvenance,
			trustedInternalHandoff: overlay.trustedInternalHandoff,
			scheduledToolPolicy: overlay.scheduledToolPolicy,
			runtimePluginToolGrant: overlay.runtimePluginToolGrant,
			traceAuthorized: overlay.traceAuthorized,
			approvalReviewerDeviceId: overlay.approvalReviewerDeviceId,
			clientCaps: overlay.clientCaps,
			gatewayUiCommandTarget: overlay.gatewayUiCommandTarget,
			toolBindings: overlay.toolBindings
		}
	};
}
function readAuthorizedCrossSurfaceContinuation(caller) {
	const continuation = authorizedCrossSurfaceContinuations.get(caller);
	continuation?.assertCurrent();
	return continuation;
}
function resolveAuthorizedCrossSurfaceContinuation(params) {
	const { caller, snapshot } = params;
	if (!caller.sessionKey?.trim() || caller.sessionKey.trim() !== snapshot.run.sessionKey?.trim() || caller.inputProvenance && caller.inputProvenance.kind !== "external_user" || snapshot.run.inputProvenance && snapshot.run.inputProvenance.kind !== "external_user") return;
	const incumbentProfile = readTransferredRequesterProfile(params.incumbent);
	const incomingProfile = readTransferredRequesterProfile(caller);
	const incumbentChannel = readReplyInputChannel(snapshot.run);
	const incomingChannel = readReplyInputChannel(caller);
	if (incumbentChannel && incomingChannel && incumbentProfile && incomingProfile && incumbentProfile.id !== "gateway-owner" && incumbentProfile.id === incomingProfile.id) {
		const continuation = {
			kind: "verified-profile",
			allowPendingUserInputAnswer: false,
			assertCurrent: () => {
				if (!incumbentProfile.isCurrent() || !incomingProfile.isCurrent()) throw new Error("Requester profile binding is no longer current");
			}
		};
		authorizedCrossSurfaceContinuations.set(caller, continuation);
		return continuation;
	}
	const incumbentShared = isSharedGatewayOwnerRunAuthority(snapshot.operatorAuthority);
	if (incumbentShared === isSharedGatewayOwnerRunAuthority(caller.operatorAuthority)) return;
	if (!(incumbentShared ? incomingChannel : incumbentChannel)) return;
	const shared = incumbentShared ? snapshot.operatorAuthority : caller.operatorAuthority;
	const owner = incumbentShared ? getCommandOwnerAuthority(caller) : getCommandOwnerAuthority(snapshot.run);
	if (caller.allowCollaborativeSteering !== true && (!shared?.scopes.includes("operator.admin") || owner?.isCurrent() !== true)) return;
	const continuation = {
		kind: "shared-owner",
		allowPendingUserInputAnswer: false,
		assertCurrent: () => {
			shared?.assertCurrent();
			if (caller.allowCollaborativeSteering !== true && owner?.isCurrent() !== true) throw new Error("Channel owner authority is no longer current");
		}
	};
	authorizedCrossSurfaceContinuations.set(caller, continuation);
	return continuation;
}
/** Projects current inbound facts against the active run's frozen authority snapshot. */
function resolveInboundReplyToolAuthorityOverlay(params) {
	const { ctx } = params;
	const overlay = {
		sessionKey: normalizeOptionalString(ctx.SessionKey),
		operatorAuthority: params.operatorAuthority,
		permissionMode: params.sessionEntry?.permissionMode,
		toolOverrides: params.sessionEntry?.toolOverrides,
		originatingChannel: ctx.OriginatingChannel,
		messageProvider: resolveOriginMessageProvider({
			originatingChannel: ctx.OriginatingChannel,
			provider: ctx.Provider ?? ctx.Surface
		}),
		chatType: normalizeChatType(ctx.ChatType),
		agentAccountId: ctx.AccountId,
		conversationToolPolicy: ctx.ConversationToolPolicy,
		groupId: resolveGroupSessionKey(ctx)?.id,
		groupChannel: normalizeOptionalString(ctx.GroupChannel) ?? normalizeOptionalString(ctx.GroupSubject),
		groupSpace: normalizeOptionalString(ctx.GroupSpace),
		memberRoleIds: normalizeArrayBackedTrimmedStringList(ctx.MemberRoleIds),
		spawnedBy: normalizeOptionalString(params.sessionEntry?.spawnedBy),
		senderId: normalizeOptionalString(ctx.SenderId),
		senderName: normalizeOptionalString(ctx.SenderName),
		senderUsername: normalizeOptionalString(ctx.SenderUsername),
		senderE164: normalizeOptionalString(ctx.SenderE164),
		senderIsOwner: params.senderIsOwner,
		gitContributorProfileId: getRequesterProfile(ctx)?.id,
		inputProvenance: ctx.InputProvenance,
		allowCollaborativeSteering: params.allowCollaborativeSteering,
		trustedInternalHandoff: void 0,
		scheduledToolPolicy: void 0,
		runtimePluginToolGrant: void 0,
		toolsAllow: params.toolsAllow,
		disableTools: params.disableTools,
		traceAuthorized: params.senderIsOwner || (ctx.GatewayClientScopes ?? []).includes("operator.admin"),
		approvalReviewerDeviceId: normalizeOptionalString(ctx.ApprovalReviewerDeviceId),
		clientCaps: ctx.GatewayClientCaps,
		gatewayUiCommandTarget: ctx.GatewayUiCommandTarget,
		toolBindings: ctx.GatewayRunToolBindings
	};
	transferRequesterProfile(ctx, overlay);
	bindReplyInputChannel(overlay, ctx.SenderIsBot ? void 0 : ctx.Provider ?? ctx.Surface);
	const ownerAuthority = getCommandOwnerAuthority(ctx);
	if (ownerAuthority) bindCommandOwnerAuthority(overlay, ownerAuthority);
	return overlay;
}
//#endregion
//#region src/auto-reply/reply/reply-tool-authority-memory.ts
/** Pin one memory namespace for both classification and capability policy. */
function captureMemoryReplyToolAuthoritySession(sessionKey, assertCurrent) {
	if (!sessionKey) return;
	const memory = captureSessionActorStorageOwner({ sessionKey }, {
		assertCurrent,
		authorize: assertCurrent
	});
	if (!memory) return;
	return {
		capabilities: createMemorySessionCapabilityStore(memory),
		readEntry: () => {
			memory.authority.assertCurrent();
			memory.owner?.assertCurrent();
			memory.binding?.actor.assertReadable();
			return readCapturedSessionActorEntry(memory, sessionKey);
		}
	};
}
/** The final tool check consumes current actor policy; no native reader is retained. */
function prepareMemoryReplyToolAuthorityCaller(readEntry, assertActive, accepts) {
	const assertCurrent = () => {
		assertActive();
		if (!accepts(readEntry())) throw new Error("question answer caller policy does not match its creator");
	};
	return {
		reads: [],
		assertPrepared: assertCurrent,
		prepareCurrent: async () => assertCurrent(),
		retainCurrent: () => ({
			assertCurrent,
			release() {}
		})
	};
}
//#endregion
//#region src/auto-reply/reply/reply-tool-authority.ts
function resolveReplyToolSandboxParams(execution) {
	return {
		cfg: execution.config,
		agentId: execution.agentId,
		sessionKey: execution.sessionKey,
		classificationSessionKey: execution.runtimePolicySessionKey ?? execution.sessionKey
	};
}
function resolveReplyToolAuthorityContext(snapshot, route, preparedSandbox, preparedSessionCapabilityStore) {
	const execution = snapshot.run;
	const provider = route?.provider ?? execution.provider;
	const model = route?.model ?? execution.model;
	const policySessionKey = execution.runtimePolicySessionKey ?? execution.sessionKey;
	const sandboxRuntime = preparedSandbox;
	return {
		provider,
		model,
		capabilityProfile: resolveConversationCapabilityProfile({
			config: execution.config,
			sessionId: execution.sessionId,
			sessionKey: execution.sessionKey,
			preparedSessionCapabilityStore,
			sandboxSessionKey: policySessionKey,
			agentId: execution.agentId,
			agentAccountId: execution.agentAccountId,
			modelProvider: provider,
			modelId: model,
			messageProvider: execution.messageProvider,
			messageChannel: snapshot.originatingChannel,
			conversationToolPolicy: execution.conversationToolPolicy,
			groupId: execution.groupId,
			groupChannel: execution.groupChannel,
			groupSpace: execution.groupSpace,
			spawnedBy: execution.spawnedBy,
			senderId: execution.senderId,
			senderName: execution.senderName,
			senderUsername: execution.senderUsername,
			senderE164: execution.senderE164,
			senderIsOwner: execution.senderIsOwner,
			workspaceDir: execution.workspaceDir,
			cwd: execution.cwd,
			sandboxToolPolicy: sandboxRuntime.sandboxed ? sandboxRuntime.toolPolicy : void 0,
			inputProvenance: execution.inputProvenance,
			trustedInternalHandoff: execution.trustedInternalHandoff,
			scheduledToolPolicy: execution.scheduledToolPolicy,
			runtimePluginToolGrant: execution.runtimePluginToolGrant
		})
	};
}
/** Screen needs browser control; theme remains requester-scoped without it. */
function resolveReplyPersonalToolTargets(input, preparedProfile) {
	const target = input.run.gatewayUiCommandTarget;
	let policies;
	const isAllowed = (toolName) => {
		if (input.disableTools === true || !isRuntimeToolAllowed(toolName, input.toolsAllow)) return false;
		policies ??= resolveConversationToolPolicies({ capabilityProfile: preparedProfile });
		return isToolAllowedByPolicies(toolName, [...Object.values(policies), input.run.senderIsOwner === false ? { deny: [...GATEWAY_OWNER_ONLY_CORE_TOOLS] } : void 0]);
	};
	return {
		screenTarget: target && hasGatewayClientCap(input.run.clientCaps, GATEWAY_CLIENT_CAPS.UI_COMMANDS) && isAllowed("screen") ? target : void 0,
		themeProfileId: target?.profileId && isAllowed("theme") ? target.profileId : void 0
	};
}
const operatorAuthorityIdentities = resolveGlobalSingleton(Symbol.for("openclaw.replyOperatorAuthorityIdentities"), () => ({
	keys: /* @__PURE__ */ new WeakMap(),
	nextId: 1
}));
/** Compare original live owners without treating profile labels as authority. */
function resolveReplyOperatorAuthorityKey(authority) {
	if (!authority) return "";
	const source = authority.source ?? authority;
	let identity = operatorAuthorityIdentities.keys.get(source);
	if (identity === void 0) {
		identity = operatorAuthorityIdentities.nextId++;
		operatorAuthorityIdentities.keys.set(source, identity);
	}
	return JSON.stringify([
		authority.profileId,
		[...new Set(authority.scopes.map((scope) => scope.trim()).filter(Boolean))].toSorted(),
		identity
	]);
}
function assertCurrentOperatorAuthority(authority) {
	if (authority) {
		assertAdmittedRunOperatorAuthority(authority);
		authority.assertCurrent();
	}
}
/** Fingerprints the complete model-facing tool authority owned by one queued turn. */
function resolveFollowupRunToolAuthorityFingerprint(snapshot, preparedContext) {
	const execution = snapshot.run;
	const { provider, model, capabilityProfile } = preparedContext;
	const authority = snapshot.operatorAuthority;
	assertCurrentOperatorAuthority(authority);
	const { screenTarget, themeProfileId } = resolveReplyPersonalToolTargets(snapshot, capabilityProfile);
	return createHash("sha256").update(stableStringify({
		provider,
		model,
		policy: capabilityProfile.policy,
		operatorAuthority: authority ? {
			scopes: [...new Set(authority.scopes)].toSorted(),
			rolePolicy: authority.rolePolicy,
			gatewayAccessGrant: authority.gatewayAccessGrant === void 0 ? resolveReplyOperatorAuthorityKey(authority) : authority.gatewayAccessGrant,
			modelPolicy: readOperatorModelPolicyMembership(authority.modelPolicy) ?? resolveReplyOperatorAuthorityKey(authority)
		} : void 0,
		toolsAllow: snapshot.toolsAllow,
		toolsAllowIntersection: snapshot.toolsAllow ? readToolAllowlistIntersection(snapshot.toolsAllow) : void 0,
		disableTools: snapshot.disableTools === true,
		sessionFile: execution.sessionFile,
		agentDir: execution.agentDir,
		workspaceDir: execution.workspaceDir,
		cwd: execution.cwd,
		permissionMode: execution.permissionMode,
		toolOverrides: execution.toolOverrides,
		execOverrides: execution.execOverrides,
		elevatedLevel: execution.elevatedLevel,
		bashElevated: execution.bashElevated,
		traceAuthorized: execution.traceAuthorized === true,
		authProfile: execution.authProfileIdSource === "auto" ? { source: "auto" } : { id: execution.authProfileId },
		clientCaps: [...new Set(execution.clientCaps ?? [])].toSorted(),
		gatewayUiCommandTarget: authority && screenTarget?.profileId === authority.profileId ? { ownProfile: true } : screenTarget,
		themeProfileId: authority && themeProfileId === authority.profileId ? { ownProfile: true } : themeProfileId,
		toolBindings: execution.toolBindings
	})).digest("hex");
}
async function prepareFollowupRunToolAuthorityFingerprint(snapshot, route, assertCurrent = () => {}) {
	const owner = prepareReplyToolAuthority(snapshot);
	try {
		await owner.fingerprintAsync(route);
		assertCurrent();
		return {
			read: () => {
				assertCurrent();
				return owner.fingerprint(route);
			},
			release: owner.close
		};
	} catch (error) {
		owner.close();
		throw error;
	}
}
/** Capture execution policy once; incoming overlays replace only caller-owned facts. */
function resolvePreparedReplyToolAuthorityFingerprint(input, route, entry, narrow, preparedSessionCapabilityStore) {
	const sandbox = resolveSandboxRuntimeStatus({
		...resolveReplyToolSandboxParams(input.run),
		preparedSessionEntry: entry ?? null
	});
	const preparedInput = narrow?.(input, sandbox) ?? input;
	return resolveFollowupRunToolAuthorityFingerprint(preparedInput, resolveReplyToolAuthorityContext(preparedInput, route, sandbox, preparedSessionCapabilityStore));
}
function prepareReplyToolAuthority(run, narrow, resolveReader) {
	const handoff = run.run.trustedInternalHandoff;
	const toolsAllow = run.toolsAllow ? [...run.toolsAllow] : void 0;
	const intersection = run.toolsAllow ? readToolAllowlistIntersection(run.toolsAllow)?.map((restriction) => restriction.slice()) : void 0;
	if (toolsAllow && intersection) attachToolAllowlistIntersection(toolsAllow, intersection);
	const snapshot = {
		originatingChannel: run.originatingChannel,
		operatorAuthority: run.operatorAuthority,
		toolsAllow,
		disableTools: run.disableTools === true,
		run: {
			...run.run,
			config: run.run.config ? captureRuntimeConfig(run.run.config) : void 0,
			conversationToolPolicy: structuredClone(run.run.conversationToolPolicy),
			inputProvenance: structuredClone(run.run.inputProvenance),
			scheduledToolPolicy: structuredClone(run.run.scheduledToolPolicy),
			runtimePluginToolGrant: structuredClone(run.run.runtimePluginToolGrant),
			trustedInternalHandoff: handoff ? {
				...handoff,
				settleBatch: handoff.settleBatch && {
					...handoff.settleBatch,
					sourceSessionKeys: [...handoff.settleBatch.sourceSessionKeys]
				}
			} : void 0,
			toolOverrides: structuredClone(run.run.toolOverrides),
			execOverrides: structuredClone(run.run.execOverrides),
			bashElevated: structuredClone(run.run.bashElevated),
			toolBindings: structuredClone(run.run.toolBindings),
			clientCaps: run.run.clientCaps ? [...run.run.clientCaps] : void 0,
			gatewayUiCommandTarget: structuredClone(run.run.gatewayUiCommandTarget),
			memberRoleIds: run.run.memberRoleIds ? [...run.run.memberRoleIds] : void 0
		}
	};
	const resolveContinuation = (overlay) => overlay ? resolveAuthorizedCrossSurfaceContinuation({
		incumbent: run,
		snapshot,
		caller: overlay
	}) : void 0;
	const projectInput = (overlay) => {
		const continuation = resolveContinuation(overlay);
		continuation?.assertCurrent();
		return continuation ? snapshot : overlay ? applyReplyToolAuthorityOverlay(snapshot, overlay) : snapshot;
	};
	const env = { ...process.env };
	const sessionKey = snapshot.run.runtimePolicySessionKey ?? snapshot.run.sessionKey;
	const memory = captureMemoryReplyToolAuthoritySession(sessionKey, () => assertCurrentOperatorAuthority(snapshot.operatorAuthority));
	const readMemoryEntry = memory?.readEntry;
	const memoryCapabilities = memory?.capabilities;
	let captured;
	let capturedReadPlan;
	const releases = /* @__PURE__ */ new Set();
	let closed = false;
	const assertOpen = () => {
		if (closed) throw new Error("Reply tool authority is closed");
		assertCurrentOperatorAuthority(snapshot.operatorAuthority);
	};
	const close = () => {
		closed = true;
		for (const release of releases) release();
		releases.clear();
	};
	const classificationFacts = (entry) => ({
		sessionId: entry?.sessionId,
		lifecycleRevision: entry?.lifecycleRevision,
		sandbox: entry?.sandbox,
		sandboxMode: entry?.sandboxMode,
		createdActor: entry?.createdActor
	});
	const retainEntry = (entry) => {
		if (memory || !captured?.source || typeof captured.source.databaseIdentity !== "string") return {
			assertCurrent() {},
			release() {}
		};
		const predicate = retainPreparedSessionEntryPredicate({
			databaseIdentity: `file:${captured.source.databaseIdentity}`,
			sessionKey: captured.canonicalKey,
			entry,
			matches: (before, after) => stableStringify(classificationFacts(before)) === stableStringify(classificationFacts(after))
		});
		const release = () => {
			predicate.release();
			releases.delete(release);
		};
		releases.add(release);
		return {
			release,
			assertCurrent() {
				assertOpen();
				if (!predicate.isCurrent()) {
					const reason = predicate.canRefresh() ? "entry predicate pending or unknown" : "entry predicate changed or released";
					throw new Error(`Tool authority classification session changed (${reason})`);
				}
			}
		};
	};
	const prepareEntry = async (input, route, entry) => {
		assertOpen();
		if (captured && (entry?.sessionId !== captured.sessionId || entry?.lifecycleRevision !== captured.lifecycleRevision)) throw new Error("Tool authority classification source changed");
		const assertEntry = retainEntry(entry);
		let selectedInput = input;
		let selectedRoute = route;
		const resolveFingerprint = () => resolvePreparedReplyToolAuthorityFingerprint(selectedInput, selectedRoute, readMemoryEntry ? readMemoryEntry() : entry, narrow, memoryCapabilities);
		const prepared = await prepareSessionCapabilityRead(() => {
			assertOpen();
			capturedReadPlan?.assertCurrent();
			assertEntry.assertCurrent();
			return resolveFingerprint();
		}).catch((error) => {
			assertEntry.release();
			throw error;
		});
		releases.add(prepared.release);
		return {
			read: prepared.read,
			evaluate(nextInput, nextRoute) {
				selectedInput = nextInput;
				selectedRoute = nextRoute;
				return prepared.read();
			}
		};
	};
	const prepareFresh = async (input, route) => {
		assertOpen();
		assertCurrentOperatorAuthority(input.operatorAuthority);
		let entry;
		if (readMemoryEntry) entry = readMemoryEntry();
		else if (capturedReadPlan) entry = await withSessionEntriesFromStoresInWorker(capturedReadPlan.reads, (reads) => capturedReadPlan.selectPrepared(reads));
		else if (sessionKey) {
			const preparedLookup = await prepareGatewaySessionEntryReadOnlyInWorker({
				cfg: snapshot.run.config ?? {},
				key: sessionKey,
				agentId: resolveSessionAgentId({
					config: snapshot.run.config,
					sessionKey,
					fallbackAgentId: sessionKey === snapshot.run.sessionKey ? snapshot.run.agentId : void 0
				}),
				env,
				assertActive: assertOpen
			});
			entry = preparedLookup.loaded.entry;
			captured ??= captureReplyToolAuthoritySession(preparedLookup.loaded);
			capturedReadPlan ??= preparedLookup.readPlan;
		}
		return prepareEntry(input, route, entry);
	};
	const prepare = (input, route) => memory ? prepareFresh(input, route) : withReplyToolAuthorityCohort({
		reader: resolveReader?.(),
		original: captured,
		readPlan: capturedReadPlan,
		env,
		assertCurrent: assertOpen,
		prepare: () => prepareFresh(input, route),
		consume: (entry) => prepareEntry(input, route, entry)
	});
	let fingerprintRead;
	let projectionRead;
	const result = {
		close,
		personalToolOwner: {
			operatorAuthority: snapshot.operatorAuthority,
			senderId: snapshot.run.senderId,
			senderName: snapshot.run.senderName,
			gatewayUiCommandTarget: snapshot.run.gatewayUiCommandTarget
		},
		requestedRoute: Object.freeze({
			provider: snapshot.run.provider,
			model: snapshot.run.model
		}),
		fingerprint: (route) => {
			warnPluginSdkDeprecation({
				family: "reply-tool-authority-sync-preparation",
				method: "ReplyToolAuthoritySnapshot.fingerprint",
				replacement: "await fingerprintAsync()"
			});
			if (!fingerprintRead) throw new Error("Reply tool authority requires asynchronous preparation");
			return fingerprintRead.evaluate(snapshot, route);
		},
		fingerprintAsync: async (route) => {
			const prepared = await prepare(snapshot, route);
			fingerprintRead = prepared;
			return prepared.read();
		},
		projectAsync: async (overlay, route) => {
			const continuation = resolveContinuation(overlay);
			continuation?.assertCurrent();
			const prepared = await prepare(projectInput(overlay), route);
			continuation?.assertCurrent();
			projectionRead = prepared;
			return prepared.read();
		},
		project: (overlay, route) => {
			warnPluginSdkDeprecation({
				family: "reply-tool-authority-sync-preparation",
				method: "ReplyToolAuthoritySnapshot.project",
				replacement: "await projectAsync()"
			});
			const prepared = projectionRead ?? fingerprintRead;
			if (!prepared) throw new Error("Reply tool authority requires asynchronous preparation");
			return prepared.evaluate(projectInput(overlay), route);
		}
	};
	bindReplyToolAuthorityCallerRead(result.projectAsync, async (caller, expected, route, assertActive) => {
		const continuation = resolveContinuation(caller);
		const assertCallerCurrent = () => {
			assertActive();
			continuation?.assertCurrent();
		};
		assertCallerCurrent();
		if (readMemoryEntry) {
			const projected = projectInput(caller);
			const policy = await prepareSessionCapabilityRead(() => {
				assertCallerCurrent();
				return [snapshot, projected].every((input) => resolvePreparedReplyToolAuthorityFingerprint(input, route, readMemoryEntry(), void 0, memoryCapabilities) === expected);
			});
			releases.add(policy.release);
			const prepared = prepareMemoryReplyToolAuthorityCaller(readMemoryEntry, assertActive, () => policy.read());
			recordPreparedToolAuthorityRead({
				...prepared,
				assertLegacyCurrent: () => prepared.assertPrepared([])
			});
			return prepared;
		}
		if (!captured) await prepare(snapshot, route);
		assertActive();
		const original = captured;
		const projected = projectInput(caller);
		const plan = capturedReadPlan;
		if (original && !plan) throw new Error("Tool authority classification source is unavailable");
		const assertSources = () => {
			assertCallerCurrent();
			plan?.assertCurrent();
		};
		const assertEntry = (entry) => {
			assertSources();
			if (original && (entry?.sessionId !== original.sessionId || entry?.lifecycleRevision !== original.lifecycleRevision)) throw new Error("Tool authority classification session changed (caller session identity)");
			for (const input of [snapshot, projected]) if (resolvePreparedReplyToolAuthorityFingerprint(input, route, entry, narrow) !== expected) throw new Error("question answer caller policy does not match its creator");
			assertSources();
		};
		const reads = plan?.reads ?? [];
		let currentEntry;
		let receipt;
		const installCurrent = (currentReads) => {
			assertSources();
			currentEntry = plan?.selectPrepared(currentReads);
			receipt?.release();
			receipt = retainEntry(currentEntry);
		};
		await withSessionEntriesFromStoresInWorker(reads, installCurrent);
		const policy = await prepareSessionCapabilityRead(() => {
			receipt?.assertCurrent();
			assertEntry(currentEntry);
		});
		releases.add(policy.release);
		const assertPrepared = (currentReads) => {
			installCurrent(currentReads);
			policy.read();
		};
		const prepared = {
			reads,
			assertPrepared,
			prepareCurrent: () => withSessionEntriesFromStoresInWorker(reads, assertPrepared),
			retainCurrent() {
				policy.read();
				return {
					assertCurrent: policy.read,
					release() {}
				};
			}
		};
		recordPreparedToolAuthorityRead({
			...prepared,
			assertLegacyCurrent: policy.read
		});
		return prepared;
	});
	return result;
}
//#endregion
export { resolveReplyToolAuthorityContext as a, resolveReplyPersonalToolTargets as i, prepareReplyToolAuthority as n, readAuthorizedCrossSurfaceContinuation as o, resolveReplyOperatorAuthorityKey as r, resolveInboundReplyToolAuthorityOverlay as s, prepareFollowupRunToolAuthorityFingerprint as t };
