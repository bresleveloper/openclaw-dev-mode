import { u as releaseSessionSourceAuthorities } from "./session-source-authority-fdILH-PW.mjs";
import { i as isIncognitoSessionKey } from "./incognito-session-key-BWpn88lo.mjs";
import "./session-key-CSDERtm3.mjs";
import { Ng as errorShape } from "./src-pLJQA6J5.mjs";
import { n as resolveSessionMethodScope } from "./session-method-scopes-base-DP0bm9jg.mjs";
import { c as mayCreateSessionTarget, i as isRequiredSessionTargetMethod } from "./session-method-policy-B7o-3I76.mjs";
import { t as ErrorCodes } from "./gateway-error-details-Cl-eEOTQ.mjs";
import { n as authorizeGatewaySessionCreation, o as operatorSessionCap, u as resolveGatewayOperatorRoleActor } from "./operator-role-policy-Coro3qc5.mjs";
import { o as runWithSessionActorStorage, r as getSessionActorStorageBinding } from "./session-actor-storage-binding-oCtbPk00.mjs";
import { r as resolveRequestedSessionAgentId } from "./session-request-agent-ByGzV8Af.mjs";
import { i as gatewayClientSessionCreator } from "./gateway-client-identity-DXWhtQve.mjs";
import { b as isSessionCreatorProfile, m as resolveIncognitoSessionSharingTarget, n as authorizeIncognitoSessionTarget, o as authorizeSessionAgentRun, r as authorizeOwnSessionMutation, s as authorizeSessionSharingTarget, u as hiddenSessionNotFound, v as sharingIdentity } from "./session-sharing-policy-vx7GWqzs.mjs";
import { t as SessionMutationAuthorizationChangedError } from "./session-mutation-authorization-error-Cdqn6r49.mjs";
import { n as getSessionRowProjection } from "./session-row-projection-access-BUm5f-cY.mjs";
import { n as captureSessionSharingMemoryFacts } from "./session-sharing-incognito-DepuXzQy.mjs";
import { n as captureSessionMutationRouting, t as prepareSessionMutationFacts } from "./session-sharing-preparation-DAfvBDLL.mjs";
import { a as resolveProtectedSessionTargets, i as resolveDirectSessionTargets, o as resolveSessionMutationGuardTarget, s as resolveSessionMutationTargets, t as readSessionSharingStringParam } from "./session-sharing-target-input-Cob8P56S.mjs";
import { _ as withCurrentSessionSharingSource, a as withPreparedSessionSharingSource, c as createSessionCreationAuthorizationRecorder, d as prepareAuthorizedSessionMutationFacts, f as prepareSessionMutationAuthorizationRequest, g as sessionMutationTargetChanged, h as resolveSessionMutationWriteRoute, i as resolveSessionSharingMembership, l as expectedSessionMutationTargetError, m as resolvePreparedTalkAuthorizationTarget, n as isSameSessionSharingSource, o as VISIBILITY_AUTHORIZED_METHODS, p as resolveOwnSessionProfileAuthorization, r as prepareSessionSharingSource, s as assertSessionMutationProjectionCurrent, t as captureSessionSharingTalkAuthority, u as findPreparedSharingTarget } from "./session-sharing-source-DjDkn0NP.mjs";
import { a as createSessionSharingInputAuthority, c as prepareSessionSharingProfiles, i as createSessionSharingConsumption, o as prepareProjectedSessionSharing, r as createSessionListEntryFilter } from "./session-sharing-read-B9_xLej9.mjs";
import { i as readSessionMutationTarget, r as readProjectedSessionMutationTarget } from "./session-sharing-target-read-DwJlM38W.mjs";
//#region src/gateway/session-sharing-describe.ts
function authorizeSessionDescribe(params) {
	const projection = params.sessionRowRead ?? getSessionRowProjection(params.context);
	if (!projection) return null;
	const { cfg, policyConfig } = projection.state;
	for (const target of resolveDirectSessionTargets("sessions.describe", params.requestParams)) {
		const agent = resolveRequestedSessionAgentId(cfg, target.sessionKey, target.agentId);
		if (!agent.ok) return agent.error;
		const row = projection.describe({
			key: target.sessionKey,
			agentId: agent.agentId
		});
		const sharing = prepareProjectedSessionSharing({
			cfg: policyConfig,
			client: params.client,
			isMember: (_target, identityId) => row?.membership.has(identityId) ?? false
		});
		if (row && gatewayClientSessionCreator(params.client) && sharing.sessionCap === "none" && !sharing.isCreator(row.entry.createdActor)) return hiddenSessionNotFound(target.sessionKey);
	}
	return null;
}
//#endregion
//#region src/gateway/session-sharing-worker-grant.ts
/** Legacy locators keep exact agent-store authority without rediscovering shared-state ownership. */
async function prepareSessionSharingWorkerGrant(params) {
	const changed = (key = params.targets[0]?.sessionKey ?? "") => sessionMutationTargetChanged(params.request.method, key);
	if (params.transactionSource && (!params.transactionFacts || params.targets.length !== 1)) throw changed();
	const assertRouting = captureSessionMutationRouting(params.sourceConfig, changed, params.targets);
	let active = true;
	const targets = params.targets.map((target) => ({
		...target,
		resolved: target.resolved && { ...target.resolved },
		memoryFacts: captureSessionSharingMemoryFacts(target, () => {
			if (!active) throw sessionMutationTargetChanged(params.request.method, target.sessionKey);
			assertRouting(params.request.context.getRuntimeConfig());
		})
	}));
	const talkAgentId = params.sourceConfig.talk?.agentId;
	const releases = [];
	const sourceChecks = [];
	let transaction;
	const release = () => {
		active = false;
		return releaseSessionSourceAuthorities(releases.splice(0));
	};
	try {
		const reads = [];
		for (const expected of targets) {
			const initialConfig = params.request.context.getRuntimeConfig();
			assertRouting(initialConfig);
			if (expected.memoryFacts) {
				const target = expected.resolved;
				if (!target) throw changed(expected.sessionKey);
				const source = await prepareSessionSharingSource(target, () => assertRouting(params.request.context.getRuntimeConfig()), expected.memoryFacts);
				releases.push(source);
				sourceChecks.push(source.assertCurrent);
				reads.push((profiles) => {
					source.assertCurrent();
					params.consume(expected, params.request.context.getRuntimeConfig(), {
						target: source.target,
						storageTarget: target,
						members: [],
						isMember: (id) => source.members.includes(id),
						assertCurrent: source.assertCurrent
					}, profiles);
				});
				continue;
			}
			const durableRoute = expected.resolved ?? expected.absentTarget;
			if (!durableRoute) throw changed(expected.sessionKey);
			const prepared = findPreparedSharingTarget(params.request, expected);
			const retained = prepared ? void 0 : await prepareSessionMutationFacts({
				cfg: initialConfig,
				sessionKey: expected.sessionKey,
				agentId: durableRoute.agentId,
				allowMissing: true
			});
			if (retained) releases.push(retained);
			const fallbackSource = (retained?.readCurrent(initialConfig))?.readSource ?? durableRoute.readSource;
			const read = () => {
				if (prepared) return prepared.read();
				const facts = retained.readCurrent(params.request.context.getRuntimeConfig());
				return {
					target: facts.target && {
						...facts.target,
						readSource: fallbackSource
					},
					storageTarget: retained.storageTarget,
					members: [],
					isMember: (id) => facts.membership.has(id),
					assertCurrent: () => {
						retained.readCurrent(params.request.context.getRuntimeConfig());
					}
				};
			};
			const initial = read();
			if (params.transactionFacts && targets.length === 1) {
				const provided = params.transactionSource;
				const capturedSource = initial.target?.readSource ?? prepared?.readSource ?? fallbackSource;
				const source = provided?.source ?? capturedSource;
				if (!source || provided && (provided.agentId !== durableRoute.agentId || provided.sessionKey !== durableRoute.canonicalKey)) throw changed(expected.sessionKey);
				if (capturedSource && (source.agentId !== capturedSource.agentId || source.databaseIdentity !== capturedSource.databaseIdentity || source.databaseBirthtime !== capturedSource.databaseBirthtime)) throw changed(expected.sessionKey);
				transaction = {
					source,
					agentId: durableRoute.agentId,
					sessionKey: expected.resolved?.storeKey ?? durableRoute.canonicalKey,
					assertCurrent(facts) {
						assertLifetimeCurrent();
						const preparedFacts = prepareAuthorizedSessionMutationFacts({
							expected,
							source,
							facts,
							targetChanged: () => changed(expected.sessionKey)
						});
						const cfg = params.request.context.getRuntimeConfig();
						if (provided && params.authorizesAgentRun) {
							const policyConfig = params.request.context.getCommittedRuntimeConfig?.() ?? cfg;
							const sharing = prepareProjectedSessionSharing({
								cfg: policyConfig,
								client: params.request.client,
								profiles,
								isMember: (_target, id) => facts.members.some((member) => member.identityId === id)
							});
							const error = authorizeGatewaySessionCreation({
								cfg: policyConfig,
								client: params.request.client,
								agentId: durableRoute.agentId
							}, { policy: sharing.policy });
							if (error) throw new SessionMutationAuthorizationChangedError(error);
						}
						params.consume(expected, cfg, {
							...preparedFacts,
							members: facts.members,
							isMember: (id) => facts.members.some((member) => member.identityId === id),
							assertCurrent: assertLifetimeCurrent
						}, profiles);
					}
				};
			}
			reads.push((profiles) => params.consume(expected, params.request.context.getRuntimeConfig(), read(), profiles));
		}
		const profiles = params.request.preparedProfiles ?? await prepareSessionSharingProfiles(params.request.client);
		const assertLifetimeCurrent = () => {
			if (!active) throw changed();
			assertRouting(params.request.context.getRuntimeConfig());
			if (params.transactionFacts && params.request.context.getRuntimeConfig().talk?.agentId !== talkAgentId) throw changed();
			profiles.readCurrent();
			for (const assertSource of sourceChecks) assertSource();
		};
		const assertCurrent = () => {
			assertLifetimeCurrent();
			for (const read of reads) read(profiles);
		};
		return {
			assertCurrent,
			assertLifetimeCurrent,
			release,
			...transaction ? { transaction } : {}
		};
	} catch (error) {
		active = false;
		await releaseSessionSourceAuthorities(releases.splice(0), [error]);
		throw error;
	}
}
//#endregion
//#region src/gateway/session-sharing.ts
function resolveSessionMutationAuthorization(request) {
	const requestPreparation = prepareSessionMutationAuthorizationRequest(request);
	if (!requestPreparation.ok) return { error: requestPreparation.error };
	const { params, authorizesAgentRun, bindsProgressLifecycle, adminBypass, targetOwnership } = requestPreparation;
	const memoryBinding = getSessionActorStorageBinding({});
	const withSelectedStorage = (run) => memoryBinding ? runWithSessionActorStorage(memoryBinding, run) : run();
	const authorizesRead = resolveSessionMethodScope(params.method, params.requestParams) === "operator.sessions.read";
	if (!requestPreparation.requiresSessionFacts) return { error: null };
	if (params.method === "sessions.describe") return { error: authorizeSessionDescribe(params) };
	if (params.method === "sessions.list") return { error: null };
	let cachedCfg;
	const getCfg = () => cachedCfg ??= params.context.getRuntimeConfig();
	const getPolicyConfig = () => params.context.getCommittedRuntimeConfig?.() ?? getCfg();
	const consuming = createSessionSharingConsumption({
		client: params.client,
		sharing: params.preparedSharing,
		getProfiles: () => params.preparedProfiles
	});
	const { policy: preparedPolicy, consume: consumeSharing } = consuming;
	const sessionCap = (cfg) => consuming.sharing || consuming.profiles ? preparedPolicy(cfg)?.sessionCap : operatorSessionCap(params.client, cfg);
	const authorizeTargetPolicy = (targetRef, target, readPolicyConfig, projection, members, visibilityAuthorized) => {
		const cfg = readPolicyConfig();
		const policy = preparedPolicy(cfg, members);
		const error = (target && authorizesAgentRun ? authorizeSessionAgentRun({
			cfg,
			client: params.client,
			target
		}, policy ? { policy: policy.policy } : void 0) : null) ?? authorizeIncognitoSessionTarget({
			client: params.client,
			sessionKey: targetRef.sessionKey,
			target
		});
		if (error || !target || (visibilityAuthorized ?? (VISIBILITY_AUTHORIZED_METHODS.has(params.method) && (sessionCap(readPolicyConfig()) ?? "write") === "write"))) return error;
		const identity = sharingIdentity(params.client, resolveGatewayOperatorRoleActor(params.client));
		if (authorizesRead) return (policy ? policy.entryFilter : createSessionListEntryFilter({
			cfg,
			client: params.client
		}))?.(target.storeKey, target.entry) === false ? hiddenSessionNotFound(target.canonicalKey) : null;
		return policy ? authorizeSessionSharingTarget({
			cfg,
			client: params.client,
			target,
			...targetOwnership
		}, {
			value: policy.sessionCap,
			role: policy.roleForTarget(target)
		}) : authorizeSessionSharingTarget({
			cfg,
			client: params.client,
			target,
			...targetOwnership,
			isMember: resolveSessionSharingMembership(target, identity?.id, members, projection)
		});
	};
	const resolveAuthorizedTarget = (targetRef) => {
		if (params.preparedTargets) {
			const retained = findPreparedSharingTarget(params, targetRef);
			if (!retained) return { error: sessionMutationTargetChanged(params.method, targetRef.sessionKey).error };
			consuming.sharing = retained.read();
		}
		return consuming.sharing ? { target: (consuming.sharing.assertCurrent(), consuming.sharing.target) } : readSessionMutationTarget({
			...params,
			cfg: getCfg(),
			targetRef
		});
	};
	const preparedTalk = resolvePreparedTalkAuthorizationTarget(params, getCfg);
	if (preparedTalk.error) return { error: preparedTalk.error };
	const { talkInput, talkSessionTarget } = preparedTalk;
	const talkTargets = talkSessionTarget ? [{
		sessionKey: talkSessionTarget.canonicalKey,
		agentId: talkSessionTarget.agentId
	}] : void 0;
	const { hidesForeignSessions, protectedTargets } = resolveProtectedSessionTargets({
		client: params.client,
		method: params.method,
		requestParams: params.requestParams,
		adminBypass,
		talkTargets,
		sessionCap: () => sessionCap(getPolicyConfig())
	});
	for (const targetRef of protectedTargets) {
		const resolved = resolveAuthorizedTarget(targetRef);
		if ("error" in resolved) return { error: resolved.error };
		const target = resolved.target;
		const error = authorizeIncognitoSessionTarget({
			client: params.client,
			sessionKey: targetRef.sessionKey,
			target
		});
		if (error) return { error };
		if (hidesForeignSessions && target && !(preparedPolicy(getPolicyConfig())?.isCreator(target.entry.createdActor) ?? isSessionCreatorProfile(target.entry.createdActor, params.client?.authenticatedUserProfile?.profileId))) return { error: hiddenSessionNotFound(targetRef.sessionKey) };
	}
	const bindsOwnProfile = params.sessionScope === "operator.sessions.write";
	const ownProfile = resolveOwnSessionProfileAuthorization({
		client: params.client,
		bindsOwnProfile
	});
	if (ownProfile.error) return { error: ownProfile.error };
	const ownSessionProfileId = ownProfile.profileId;
	const requestedCreateKey = readSessionSharingStringParam(params.requestParams, "key");
	const permitsGeneratedSession = params.method === "sessions.create" && !requestedCreateKey;
	const targetRefs = talkTargets ?? resolveSessionMutationTargets({
		method: params.method,
		requestParams: params.requestParams,
		context: params.context
	}) ?? (bindsOwnProfile && !isRequiredSessionTargetMethod(params.method) ? [] : void 0);
	if (params.expectedTarget && targetRefs?.length !== 1) return { error: sessionMutationTargetChanged(params.method, params.expectedTarget.sessionKey).error };
	if (!targetRefs) {
		if (isRequiredSessionTargetMethod(params.method)) return { error: errorShape(ErrorCodes.INVALID_REQUEST, "session mutation target is unavailable", { details: {
			code: "SESSION_MUTATION_TARGET_REQUIRED",
			method: params.method
		} }) };
		return { error: null };
	}
	if (talkSessionTarget && authorizesAgentRun) {
		const cfg = getPolicyConfig();
		const policy = preparedPolicy(cfg);
		const error = authorizeGatewaySessionCreation({
			cfg,
			client: params.client,
			agentId: talkSessionTarget.agentId
		}, policy ? { policy: policy.policy } : void 0);
		if (error) return { error };
	}
	const authorizedTargets = [];
	for (const targetRef of targetRefs) {
		const resolved = resolveAuthorizedTarget(targetRef);
		if ("error" in resolved) return { error: resolved.error };
		const target = resolved.target;
		if (bindsOwnProfile && (params.method === "sessions.patch" || params.method === "sessions.patchMany") && !target) return { error: hiddenSessionNotFound(targetRef.sessionKey) };
		const error = expectedSessionMutationTargetError(params.expectedTarget, target, params.method) ?? authorizeOwnSessionMutation({
			client: params.client,
			target,
			expectedProfileId: ownSessionProfileId,
			isCreator: preparedPolicy(getPolicyConfig())?.isCreator
		}) ?? authorizeTargetPolicy(targetRef, target, getPolicyConfig, "projection" in resolved ? resolved.projection : void 0);
		if (error) return { error };
		authorizedTargets.push({
			...targetRef,
			projection: "projection" in resolved ? resolved.projection : void 0,
			resolved: target ? {
				agentId: target.agentId,
				canonicalKey: target.canonicalKey,
				storeKey: target.storeKey,
				storePath: target.storePath,
				readSource: ("preparedReadSource" in resolved ? resolved.preparedReadSource : void 0) ?? target.readSource
			} : null,
			sessionId: target?.entry.sessionId?.trim() || null,
			...!target && (mayCreateSessionTarget(params.method) || talkSessionTarget && authorizesAgentRun) ? { absentTarget: {
				...consuming.sharing ? consuming.sharing.storageTarget : talkSessionTarget ?? resolveSessionMutationWriteRoute(getCfg(), targetRef),
				readSource: "preparedReadSource" in resolved ? resolved.preparedReadSource : void 0
			} } : {},
			...bindsProgressLifecycle || bindsOwnProfile ? { lifecycleRevision: target?.entry.lifecycleRevision } : {}
		});
	}
	consuming.sharing = void 0;
	const targetChanged = (key) => sessionMutationTargetChanged(params.method, key);
	const assertTalkTargetCurrent = captureSessionSharingTalkAuthority({
		request: params,
		input: talkInput,
		target: talkSessionTarget,
		authorizesAgentRun,
		preparedPolicy
	});
	const assertTargetCurrent = (targetRef, expected, currentCfg, _currentLookupCaches, ensuredSessionId, prepared, currentTalkTarget, bindSessionId = true) => {
		if (!prepared && !consuming.sharing && params.preparedTargets) {
			const retained = findPreparedSharingTarget(params, targetRef);
			if (!retained) throw targetChanged(targetRef.sessionKey);
			const read = retained.read();
			return consumeSharing(read, () => assertTargetCurrent(targetRef, expected, currentCfg, void 0, ensuredSessionId, {
				target: read.target,
				members: read.members.map((member) => member.identityId)
			}, currentTalkTarget, bindSessionId));
		}
		if (!prepared && expected?.absentTarget && !expected.created) {
			const currentRoute = consuming.sharing ? consuming.sharing.storageTarget : currentTalkTarget && currentTalkTarget.agentId === targetRef.agentId && currentTalkTarget.canonicalKey === targetRef.sessionKey ? currentTalkTarget : resolveSessionMutationWriteRoute(currentCfg, targetRef);
			if (currentRoute.agentId !== expected.absentTarget.agentId || currentRoute.canonicalKey !== expected.absentTarget.canonicalKey || currentRoute.storePath !== expected.absentTarget.storePath) throw targetChanged(targetRef.sessionKey);
		}
		assertSessionMutationProjectionCurrent(expected, params.context, () => targetChanged(targetRef.sessionKey));
		const currentProjection = expected?.projection ?? getSessionRowProjection(params.context);
		const projected = !prepared && !consuming.sharing && currentProjection ? readProjectedSessionMutationTarget(targetRef, currentCfg, currentProjection) : void 0;
		if (expected?.projection && projected?.status === "unavailable") throw targetChanged(targetRef.sessionKey);
		const current = prepared ? prepared.target : consuming.sharing ? (consuming.sharing.assertCurrent(), consuming.sharing.target) : projected?.status === "ready" ? projected.target : isIncognitoSessionKey(targetRef.sessionKey) ? resolveIncognitoSessionSharingTarget({
			cfg: currentCfg,
			sessionKey: targetRef.sessionKey,
			agentId: targetRef.agentId
		}) : (() => {
			throw targetChanged(targetRef.sessionKey);
		})();
		const ensuredTarget = talkSessionTarget && authorizesAgentRun && expected?.sessionId === null && ensuredSessionId ? {
			agentId: talkSessionTarget.agentId,
			canonicalKey: talkSessionTarget.canonicalKey,
			storeKey: talkSessionTarget.canonicalKey,
			storePath: talkSessionTarget.storePath
		} : void 0;
		const expectedResolved = expected?.resolved ?? ensuredTarget;
		const expectedSessionId = expected?.sessionId ?? (ensuredTarget ? ensuredSessionId : null);
		if (!(expected !== void 0 && (current === null ? expected.resolved === null && !ensuredSessionId : expectedResolved !== void 0 && expectedResolved !== null && current.agentId === expectedResolved.agentId && current.canonicalKey === expectedResolved.canonicalKey && current.storeKey === expectedResolved.storeKey && isSameSessionSharingSource(current, expectedResolved) && (!bindSessionId || (current.entry.sessionId?.trim() || null) === expectedSessionId) && (!(bindsProgressLifecycle || bindsOwnProfile || expected.created) || current.entry.lifecycleRevision === expected.lifecycleRevision)))) throw targetChanged(targetRef.sessionKey);
		const ownershipError = authorizeOwnSessionMutation({
			client: params.client,
			target: current,
			expectedProfileId: ownSessionProfileId,
			isCreator: preparedPolicy(currentCfg)?.isCreator
		});
		if (ownershipError) throw new SessionMutationAuthorizationChangedError(ownershipError);
		if (!current) return;
		const policyConfig = params.context.getCommittedRuntimeConfig?.() ?? currentCfg;
		const visibilityAuthorized = VISIBILITY_AUTHORIZED_METHODS.has(params.method) && (sessionCap(policyConfig) ?? "write") === "write";
		const error = authorizeTargetPolicy(targetRef, current, () => policyConfig, projected?.status === "ready" ? expected?.projection : void 0, prepared?.members, visibilityAuthorized);
		if (error) throw new SessionMutationAuthorizationChangedError(error);
	};
	const chatTarget = params.method === "chat.send" && authorizedTargets.length === 1 && !talkSessionTarget ? authorizedTargets[0] : void 0;
	const assertAdmittedTargetCurrent = (target, cfg) => assertTargetCurrent(target, target, cfg, void 0, void 0, void 0, void 0, false);
	const assertAdmittedInputCurrent = chatTarget && !isIncognitoSessionKey(chatTarget.sessionKey) ? () => withSelectedStorage(() => assertAdmittedTargetCurrent(chatTarget, params.context.getRuntimeConfig())) : void 0;
	const withCurrentSessionSource = chatTarget ? (consume, assertCurrent = () => assertTargetCurrent(chatTarget, chatTarget, params.context.getRuntimeConfig())) => withSelectedStorage(() => withCurrentSessionSharingSource({
		request: params,
		target: chatTarget,
		changed: () => targetChanged(chatTarget.sessionKey),
		consumeSharing,
		assertCurrent,
		consume
	})) : void 0;
	const withPreparedCurrent = (facts, consume, assertSourceCurrent, assertCurrent = (target, cfg) => assertTargetCurrent(target, target, cfg)) => {
		const expected = authorizedTargets[0];
		assertSourceCurrent();
		const prepared = prepareAuthorizedSessionMutationFacts({
			expected,
			facts,
			targetChanged: () => targetChanged(expected.sessionKey)
		});
		const cfg = params.context.getRuntimeConfig();
		const assertRoutingCurrent = captureSessionMutationRouting(cfg, () => targetChanged(expected.sessionKey), [expected]);
		return consumeSharing({
			...prepared,
			members: facts.members,
			assertCurrent: () => {
				assertSourceCurrent();
				assertRoutingCurrent(params.context.getRuntimeConfig());
			}
		}, () => {
			assertCurrent(expected, cfg);
			return consume();
		});
	};
	const authorization = {
		...params.preparedTargets ? { bindCreation: (target, operation) => findPreparedSharingTarget(params, target)?.bindCreation(operation) } : {},
		...params.method === "sessions.move" || params.method === "sessions.dispatch" || (params.method === "talk.client.create" || params.method === "talk.client.toolCall" || params.method === "talk.session.create") && !authorizedTargets.some((target) => isIncognitoSessionKey(target.sessionKey)) ? { prepareWorkerGrant: (transactionSource) => withSelectedStorage(() => prepareSessionSharingWorkerGrant({
			targets: authorizedTargets,
			request: params,
			sourceConfig: getCfg(),
			authorizesAgentRun,
			transactionFacts: params.method === "talk.client.create" || params.method === "talk.client.toolCall" || params.method === "talk.session.create",
			transactionSource,
			consume: (expected, cfg, prepared, profiles) => consumeSharing(prepared, () => assertTargetCurrent(expected, expected, cfg), profiles)
		})) } : {},
		...chatTarget && withCurrentSessionSource ? {
			withCurrent: async (consume) => {
				const pending = params.preparedTargets?.flatMap((target) => target.prepareRead() ?? []);
				if (pending?.length) await Promise.all(pending);
				if (params.preparedTargets || chatTarget.projection && chatTarget.resolved && chatTarget.projection.sharingTargetState({
					key: chatTarget.resolved.canonicalKey,
					agentId: chatTarget.resolved.agentId
				}).status === "ready") return withSelectedStorage(() => consumeSharing(void 0, () => {
					authorization.assertCurrent();
					return consume();
				}));
				return withCurrentSessionSource(consume);
			},
			withPreparedCurrent
		} : {},
		...assertAdmittedInputCurrent ? { assertAdmittedInputCurrent } : {},
		...talkSessionTarget ? { talkSessionTarget } : {},
		...authorizedTargets.length === 1 && authorizedTargets[0]?.resolved && authorizedTargets[0].sessionId ? { admittedTarget: Object.freeze({
			agentId: authorizedTargets[0].resolved.agentId,
			sessionKey: authorizedTargets[0].resolved.canonicalKey,
			sessionId: authorizedTargets[0].sessionId
		}) } : {},
		recordCreatedSession: createSessionCreationAuthorizationRecorder({
			targets: authorizedTargets,
			talkSessionTarget,
			permitsGeneratedSession
		}),
		assertCurrent: withPreparedSessionSharingSource({
			targets: authorizedTargets,
			sourceConfig: getCfg(),
			request: params,
			ownSessionProfileId,
			talk: talkInput,
			assertTalkTargetCurrent,
			assertTargetCurrent
		}),
		assertTargetCurrent: (targetRef) => {
			const currentCfg = params.context.getRuntimeConfig();
			const { target: normalizedTarget, expected } = resolveSessionMutationGuardTarget(params.method, currentCfg, targetRef, authorizedTargets);
			const currentTalkTarget = assertTalkTargetCurrent(currentCfg);
			withSelectedStorage(() => assertTargetCurrent(normalizedTarget, expected, currentCfg, void 0, targetRef.ensuredSessionId, void 0, currentTalkTarget));
		}
	};
	authorization.admittedInputAuthority = createSessionSharingInputAuthority(params, {
		...authorization,
		withCurrent: withCurrentSessionSource && assertAdmittedInputCurrent ? (consume) => withCurrentSessionSource(consume, assertAdmittedInputCurrent) : withCurrentSessionSource,
		withPreparedCurrent: assertAdmittedInputCurrent ? (facts, consume, assertSourceCurrent) => withPreparedCurrent(facts, consume, assertSourceCurrent, assertAdmittedTargetCurrent) : authorization.withPreparedCurrent
	}, () => consuming.sharing);
	return {
		error: null,
		authorization
	};
}
//#endregion
export { resolveSessionMutationAuthorization as t };
