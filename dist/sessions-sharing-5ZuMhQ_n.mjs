import { t as _usingCtx } from "./usingCtx-BhiZp_rS.mjs";
import { f as sessionEntryCommitGuardOptions, o as composeSessionSourceAssertion } from "./session-source-authority-fdILH-PW.mjs";
import { i as isIncognitoSessionKey } from "./incognito-session-key-BWpn88lo.mjs";
import "./session-key-CSDERtm3.mjs";
import { Ei as validateSessionPublicShareSetParams, Ng as errorShape, Pi as validateSessionVisibilitySetParams, Si as validateSessionMembersListParams, bi as validateSessionMemberAddParams, xi as validateSessionMemberRemoveParams } from "./src-pLJQA6J5.mjs";
import { t as ErrorCodes } from "./gateway-error-details-Cl-eEOTQ.mjs";
import { s as listResidentUserProfileDisplayFacts } from "./user-profile-list-BdNJnrJe.mjs";
import { g as bumpGatewayAccessRevision } from "./operator-role-policy-Coro3qc5.mjs";
import { m as sessionCreatorProfileId } from "./session-entry-lineage-B7Mubzwj.mjs";
import { S as removeSessionMemberInWorker, y as addSessionMemberInWorker } from "./session-accessor-Czw4l8kI.mjs";
import { o as resolveSessionPublicShare } from "./session-accessor.sqlite-entry-store-B3Lv6xes.mjs";
import { S as runExclusiveSessionLifecycleMutation } from "./session-lifecycle-admission-BihxXo5j.mjs";
import { o as patchSessionEntryCore } from "./session-accessor.sqlite-entry-wJ2W65pX.mjs";
import { n as readSessionMembersInWorker } from "./sessions-CnzPI1yx.mjs";
import { i as gatewayClientSessionCreator } from "./gateway-client-identity-DXWhtQve.mjs";
import { _ as resolveSessionVisibility, p as isSessionVisibilityAllowed, t as allowedSessionVisibilities } from "./session-sharing-policy-vx7GWqzs.mjs";
import { r as requireSessionRowProjection } from "./session-row-projection-access-BUm5f-cY.mjs";
import "./session-sharing-DuL10izq.mjs";
import { s as buildControlUiUserAvatarPath } from "./control-ui-resource-routes-B42sqIG-.mjs";
import "./control-ui-contract-IX_0OA0h.mjs";
import { i as projectSessionActor } from "./session-identity-projection-sgwF_hD_.mjs";
import { n as emitSessionsChanged } from "./session-change-event-0LxChmzi.mjs";
import { n as defineValidatedGatewayHandler } from "./validation--xIH1Pj-.mjs";
import { r as getGatewayLocalUserIngress } from "./local-user-ingress-CiTjOkNL.mjs";
import { n as loadPublicSessionShareTokenCodec, t as encodePublicSessionShareLocator } from "./control-ui-public-session-token-Dcl_JPw_.mjs";
import { r as sharingExpectedEntry, t as prepareManagedSessionAccess } from "./sessions-sharing-authority-D3-YNQkH.mjs";
import { t as prepareSessionPublicShareGrant } from "./session-publication-grant-BzQK6QTg.mjs";
import { t as measureSessionCollaborationPhase } from "./sessions-collaboration-diagnostics-rkGOzsws.mjs";
//#region src/gateway/server-methods/sessions-sharing-identities.ts
function knownSessionIdentities(params) {
	const identities = /* @__PURE__ */ new Map();
	const remember = (identity) => {
		if (!identity?.id) return;
		const current = identities.get(identity.id);
		identities.set(identity.id, {
			type: identity.type,
			id: identity.id,
			...identity.identity ? { identity: identity.identity } : {},
			...identity.avatarUrl ? { avatarUrl: identity.avatarUrl } : {},
			...identity.label ?? current?.label ? { label: identity.label ?? current?.label } : {}
		});
	};
	if (params.actor.state === "present") remember(params.actor.actor);
	for (const creator of params.creators) remember(creator);
	for (const profile of params.profiles) remember({
		type: "human",
		id: profile.id,
		identity: {
			type: "profile",
			id: profile.id
		},
		label: profile.label,
		...profile.hasAvatar ? { avatarUrl: buildControlUiUserAvatarPath(profile.id, profile.updatedAt) } : {}
	});
	return [...identities.values()];
}
//#endregion
//#region src/gateway/server-methods/sessions-sharing.ts
function runExclusiveSharingMutation(target, storePath, run) {
	return runExclusiveSessionLifecycleMutation("sharing", {
		scope: storePath,
		identities: [
			target.canonicalKey,
			target.storeKey,
			...target.storeKeys,
			target.entry.sessionId
		],
		run
	});
}
const UNKNOWN_SHARING_ACTOR_STORAGE_REF = "actor-evidence:unknown";
const UNATTRIBUTED_SHARING_ACTOR_STORAGE_REF = "actor-evidence:unattributed";
const LEGACY_SYNTHETIC_SHARING_ACTOR_STORAGE_REFS = /* @__PURE__ */ new Set(["local-operator", "operator.admin"]);
function actorIdentity(client) {
	const principal = gatewayClientSessionCreator(client);
	if (principal) return {
		state: "present",
		actor: principal
	};
	return getGatewayLocalUserIngress(client)?.facts.invoker?.state === "unknown" ? { state: "unknown" } : { state: "absent" };
}
function sharingActorStorageRef(facts) {
	return facts.state === "present" ? facts.actor.id : facts.state === "unknown" ? UNKNOWN_SHARING_ACTOR_STORAGE_REF : UNATTRIBUTED_SHARING_ACTOR_STORAGE_REF;
}
function projectSessionMemberEvidence(member) {
	const common = {
		identityId: member.identityId,
		addedAt: member.addedAt
	};
	if (member.addedBy === UNKNOWN_SHARING_ACTOR_STORAGE_REF) return {
		...common,
		addedByState: "unknown"
	};
	if (member.addedBy === UNATTRIBUTED_SHARING_ACTOR_STORAGE_REF || LEGACY_SYNTHETIC_SHARING_ACTOR_STORAGE_REFS.has(member.addedBy)) return common;
	return {
		...common,
		addedBy: member.addedBy
	};
}
function projectLegacySessionMember(member) {
	if (!member.addedBy) return null;
	return {
		identityId: member.identityId,
		addedBy: member.addedBy,
		addedAt: member.addedAt
	};
}
function projectPublicSessionShare(params) {
	return {
		token: params.codec.mint({
			agentId: params.agentId,
			sessionKey: params.sessionKey,
			sessionId: params.grant.sessionId,
			shareId: params.grant.id
		}),
		createdAt: params.grant.createdAt
	};
}
function publishSharingChange(params) {
	bumpGatewayAccessRevision();
	const eventOptions = { sessionKeys: [params.event.sessionKey] };
	if (params.actor.state === "present") {
		const event = {
			...params.event,
			actor: params.actor.actor
		};
		params.context.broadcast("session.sharing", event, eventOptions);
	} else {
		const event = {
			...params.event,
			...params.actor.state === "unknown" ? { actorState: "unknown" } : {}
		};
		params.context.broadcast("session.sharing.evidence", event, eventOptions);
	}
	emitSessionsChanged(params.context, {
		reason: "sharing",
		sessionKey: params.event.sessionKey,
		agentId: params.event.agentId
	});
	emitSessionsChanged(params.context, { reason: "sharing" });
}
function defineManagedSessionHandler(method, validate, handler, operation = "mutation") {
	return defineValidatedGatewayHandler(method, validate, async (options) => {
		try {
			var _usingCtx$1 = _usingCtx();
			const access = _usingCtx$1.u(await prepareManagedSessionAccess({
				...options,
				sessionKey: options.params.sessionKey,
				agentId: options.params.agentId,
				operation
			}));
			if (access) await handler(options, access);
		} catch (_) {
			_usingCtx$1.e = _;
		} finally {
			_usingCtx$1.d();
		}
	});
}
function createSessionMembersListHandler(method) {
	const evidenceAware = method === "session.members.listEvidence";
	return defineManagedSessionHandler(method, validateSessionMembersListParams, async ({ respond, client, context }, access) => {
		const managed = access.target;
		const projection = requireSessionRowProjection(context);
		await projection.withSelectionPreparation(async () => {
			do
				await measureSessionCollaborationPhase(`${method}.projection`, () => Promise.resolve(projection.prepareSelection()));
			while (projection.needsSelectionPreparation());
			let tokenCodec = resolveSessionPublicShare(managed.entry) ? await loadPublicSessionShareTokenCodec() : void 0;
			const readEvidence = async () => {
				const evidence = await measureSessionCollaborationPhase(`${method}.evidence`, () => readSessionMembersInWorker({
					agentId: managed.agentId,
					sessionKey: managed.storeKey,
					storePath: managed.storePath
				}));
				access.assertCurrent();
				if (!evidence.entry) throw new Error("session changed before sharing read");
				return {
					entry: evidence.entry,
					members: evidence.members
				};
			};
			let evidence = await readEvidence();
			if (resolveSessionPublicShare(evidence.entry) && !tokenCodec) {
				const prepared = loadPublicSessionShareTokenCodec();
				if (prepared instanceof Promise) {
					tokenCodec = await prepared;
					evidence = await readEvidence();
				} else tokenCodec = prepared;
			}
			const { entry, members: storedMembers } = evidence;
			const publicShareGrant = resolveSessionPublicShare(entry);
			const currentCfg = context.getRuntimeConfig();
			const { target, role } = access.current(entry);
			const evidenceMembers = storedMembers.map(projectSessionMemberEvidence);
			const actor = actorIdentity(client);
			const members = evidenceAware ? evidenceMembers : evidenceMembers.map(projectLegacySessionMember);
			if (!evidenceAware && members.some((member) => member === null)) {
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "session membership includes actor evidence this client cannot represent", { details: {
					code: "SESSION_MEMBER_ACTOR_EVIDENCE_UNSUPPORTED",
					recommendedMethod: "session.members.listEvidence"
				} }));
				return;
			}
			const projectedMembers = members.filter((member) => member !== null);
			const identities = knownSessionIdentities({
				creators: projection.listCreatedActors(),
				actor,
				profiles: listResidentUserProfileDisplayFacts()
			});
			for (const member of projectedMembers) if (!identities.some((identity) => identity.id === member.identityId)) identities.push({
				type: "human",
				id: member.identityId
			});
			identities.sort((left, right) => (left.label ?? left.id).localeCompare(right.label ?? right.id) || left.id.localeCompare(right.id));
			const storedOwner = entry.createdActor;
			const owner = sessionCreatorProfileId(storedOwner) ? projectSessionActor(storedOwner, /* @__PURE__ */ new Map(), currentCfg) : storedOwner ? {
				type: storedOwner.type,
				id: storedOwner.id,
				label: storedOwner.label
			} : void 0;
			const publicShare = publicShareGrant?.sessionId === target.entry.sessionId && tokenCodec ? projectPublicSessionShare({
				agentId: target.agentId,
				sessionKey: target.canonicalKey,
				grant: publicShareGrant,
				codec: tokenCodec
			}) : void 0;
			respond(true, {
				sessionKey: target.canonicalKey,
				...publicShare ? { publicShare } : {},
				...owner?.id ? { owner } : {},
				members: projectedMembers,
				identities,
				role,
				allowedVisibilities: allowedSessionVisibilities(currentCfg)
			}, void 0);
		});
	}, "read");
}
function createSessionMemberMutationHandler(action) {
	return defineManagedSessionHandler(`session.members.${action}`, action === "add" ? validateSessionMemberAddParams : validateSessionMemberRemoveParams, async ({ params, respond, client, context }, access) => {
		const managed = access.target;
		let addActor;
		if (action === "add") {
			const projection = requireSessionRowProjection(context);
			do
				await projection.ensureMaterialized();
			while (projection.needsMaterialization);
			access.assertCurrent();
			addActor = actorIdentity(client);
			if (!knownSessionIdentities({
				creators: projection.listCreatedActors(),
				actor: addActor,
				profiles: listResidentUserProfileDisplayFacts()
			}).some((identity) => identity.id === params.identityId)) {
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "unknown identity"));
				return;
			}
		}
		await runExclusiveSharingMutation(managed, access.lifecycleStorePath, async () => {
			const { target: current } = access.current();
			const scope = {
				agentId: current.agentId,
				sessionKey: current.storeKey,
				storePath: current.storePath
			};
			let now;
			let actor;
			if (addActor) {
				now = Date.now();
				actor = addActor;
				if (!(await addSessionMemberInWorker(scope, {
					identityId: params.identityId,
					addedBy: sharingActorStorageRef(actor),
					addedAt: now,
					expectedSessionId: current.entry.sessionId,
					expectedEntry: sharingExpectedEntry(current)
				}, access.assertCurrent)).inserted) return;
			} else {
				if (!await removeSessionMemberInWorker(scope, params.identityId, void 0, current.entry.sessionId, access.assertCurrent, sharingExpectedEntry(current))) return;
				now = Date.now();
				actor = actorIdentity(client);
			}
			publishSharingChange({
				context,
				actor,
				event: {
					action: action === "add" ? "member-added" : "member-removed",
					sessionKey: current.canonicalKey,
					agentId: current.agentId,
					identityId: params.identityId,
					ts: now
				}
			});
		});
		respond(true, {
			ok: true,
			sessionKey: managed.canonicalKey,
			identityId: params.identityId
		}, void 0);
	});
}
const sessionSharingHandlers = {
	"session.publicShare.set": defineManagedSessionHandler("session.publicShare.set", validateSessionPublicShareSetParams, async ({ params, respond, context }, access) => {
		const managed = access.target;
		if (managed.entry.incognito || isIncognitoSessionKey(managed.canonicalKey)) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "Incognito sessions cannot be published."));
			return;
		}
		if (managed.entry.sessionId !== params.expectedSessionId) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "Session changed; reopen sharing before publishing."));
			return;
		}
		let publicShareGrant;
		let tokenCodec;
		await runExclusiveSharingMutation(managed, access.lifecycleStorePath, async () => {
			tokenCodec = params.enabled ? await loadPublicSessionShareTokenCodec() : void 0;
			const { target: current } = access.current();
			let changed = false;
			let inspected = false;
			await patchSessionEntryCore({
				agentId: current.agentId,
				sessionKey: current.storeKey,
				storePath: current.storePath
			}, (entry) => {
				inspected = true;
				if (entry.sessionId !== params.expectedSessionId) throw new Error("session changed before sharing mutation");
				if (entry.incognito || isIncognitoSessionKey(current.canonicalKey)) throw new Error("Incognito sessions cannot be published.");
				access.assertEntryManageable(entry);
				const previous = resolveSessionPublicShare(entry);
				publicShareGrant = params.enabled ? prepareSessionPublicShareGrant(entry, current.canonicalKey) : void 0;
				if (publicShareGrant) encodePublicSessionShareLocator({
					agentId: current.agentId,
					sessionKey: current.canonicalKey,
					sessionId: publicShareGrant.sessionId,
					shareId: publicShareGrant.id
				});
				changed = publicShareGrant?.id !== previous?.id;
				return changed ? { publicShare: publicShareGrant } : null;
			}, { ...sessionEntryCommitGuardOptions(access.assertCurrent) });
			if (!inspected) throw new Error("session changed before sharing mutation");
			if (changed) {
				access.current();
				emitSessionsChanged(context, {
					reason: "sharing",
					sessionKey: current.canonicalKey,
					agentId: current.agentId
				});
			}
		});
		const { target: published } = access.current();
		const currentGrant = resolveSessionPublicShare(published.entry);
		if (currentGrant?.id !== publicShareGrant?.id) throw new Error("session publication changed before sharing response");
		const publicShare = currentGrant && tokenCodec ? projectPublicSessionShare({
			agentId: published.agentId,
			sessionKey: published.canonicalKey,
			grant: currentGrant,
			codec: tokenCodec
		}) : void 0;
		respond(true, {
			ok: true,
			sessionKey: managed.canonicalKey,
			...publicShare ? { publicShare } : {}
		}, void 0);
	}),
	"session.visibility.set": defineManagedSessionHandler("session.visibility.set", validateSessionVisibilitySetParams, async ({ params, respond, client, context }, access) => {
		const managed = access.target;
		const visibility = params.visibility;
		const assertVisibilityCurrent = () => {
			const { target } = access.current();
			if (resolveSessionVisibility(target.entry) !== visibility) throw new Error("session visibility changed before sharing response");
		};
		if (!isSessionVisibilityAllowed(context.getRuntimeConfig(), visibility)) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `session visibility is disabled: ${visibility}`, { details: {
				code: "SESSION_VISIBILITY_DISABLED",
				visibility
			} }));
			return;
		}
		await runExclusiveSharingMutation(managed, access.lifecycleStorePath, async () => {
			const { target: current } = access.current();
			const scope = {
				agentId: current.agentId,
				sessionKey: current.canonicalKey,
				storePath: current.storePath
			};
			let inspected = false;
			let changed = false;
			const commitGuard = composeSessionSourceAssertion([access.assertCurrent], (assertSources) => {
				assertSources();
				if (!isSessionVisibilityAllowed(context.getRuntimeConfig(), visibility)) throw new Error(`session visibility is disabled: ${visibility}`);
			});
			await patchSessionEntryCore(scope, (entry) => {
				inspected = true;
				access.assertEntryManageable(entry);
				if (resolveSessionVisibility(entry) === visibility) return null;
				changed = true;
				return { visibility };
			}, sessionEntryCommitGuardOptions(commitGuard));
			if (!inspected) throw new Error("session changed before sharing mutation");
			if (!changed) return;
			const now = Date.now();
			const actor = actorIdentity(client);
			assertVisibilityCurrent();
			publishSharingChange({
				context,
				actor,
				event: {
					action: "visibility",
					sessionKey: current.canonicalKey,
					agentId: current.agentId,
					visibility,
					ts: now
				}
			});
		});
		assertVisibilityCurrent();
		respond(true, {
			ok: true,
			sessionKey: managed.canonicalKey,
			visibility
		}, void 0);
	}),
	"session.members.list": createSessionMembersListHandler("session.members.list"),
	"session.members.listEvidence": createSessionMembersListHandler("session.members.listEvidence"),
	"session.members.add": createSessionMemberMutationHandler("add"),
	"session.members.remove": createSessionMemberMutationHandler("remove")
};
//#endregion
export { sessionSharingHandlers };
