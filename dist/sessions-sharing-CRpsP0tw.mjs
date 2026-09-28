import { r as isIncognitoSessionKey } from "./session-key-CUi_tcgF.mjs";
import "./session-key-CBvmC8zz.mjs";
import { s as registerSecretValueForRedaction } from "./secret-redaction-registry-CKxLTepq.mjs";
import { t as ErrorCodes } from "./gateway-error-details-D85F07e9.mjs";
import { Jr as validateSessionMemberAddParams, Xr as validateSessionMembersListParams, Yr as validateSessionMemberRemoveParams, Zr as validateSessionPublicShareSetParams, ni as validateSessionVisibilitySetParams } from "./src-BRUl7oDv.mjs";
import { f as errorShape } from "./error-codes-DvB36bCj.mjs";
import { p as listProfiles } from "./user-profiles-CRttx6hj.mjs";
import { _ as bumpGatewayAccessRevision } from "./operator-role-policy-Bt6aG_wj.mjs";
import { o as sessionCreatorProfileId } from "./session-entry-provenance-C-JyMH54.mjs";
import { p as resolveSessionPublicShare } from "./session-accessor.sqlite-entry-store-BUBLa7UE.mjs";
import { g as runExclusiveSessionLifecycleMutation } from "./session-lifecycle-admission-Pys9TN37.mjs";
import { d as patchSessionEntryCore } from "./session-accessor.sqlite-entry-BTkJgNr-.mjs";
import { a as loadExactSessionEntryReadOnly } from "./session-accessor.sqlite-exact-read-Dk6_8wqr.mjs";
import { H as addSessionMemberInWorker, W as removeSessionMemberInWorker } from "./session-accessor-C05KQ5A3.mjs";
import { n as resolveRequestedSessionAgentId } from "./session-request-agent-DN7PUqhR.mjs";
import { l as listSessionMembersInWorker } from "./sessions-Cesa3L0p.mjs";
import { s as buildControlUiUserAvatarPath } from "./control-ui-resource-routes-DVy_LnYu.mjs";
import "./control-ui-contract-Dup6xL62.mjs";
import { i as projectSessionActor } from "./session-identity-projection-C0mYume0.mjs";
import { A as allowedSessionVisibilities, G as resolveSessionSharingRole, J as resolveSessionVisibility, K as resolveSessionSharingTarget, R as canManageSessionSharing, U as isSessionVisibilityAllowed, et as gatewayClientSessionCreator, k as invalidateSessionSharingSnapshot } from "./session-sharing-C_5FkkwM.mjs";
import { n as getSessionRowProjection } from "./session-row-projection-access-Bb2a_cNt.mjs";
import { r as emitSessionsChanged } from "./session-change-event-BWFAGeR5.mjs";
import { n as getGatewayLocalUserIngress } from "./local-user-ingress-B0Jbf3Pk.mjs";
import { t as assertValidParams } from "./validation-CFv_zneu.mjs";
import { t as loadPublicSessionShareTokenCodec } from "./control-ui-public-session-token-lrMTWigK.mjs";
import { randomBytes } from "node:crypto";
//#region src/gateway/server-methods/sessions-sharing-authority.ts
function requireCurrentManagedTarget(params) {
	const current = resolveSessionSharingTarget({
		cfg: params.cfg,
		sessionKey: params.authorized.canonicalKey,
		agentId: params.authorized.agentId
	});
	if (!current || current.agentId !== params.authorized.agentId || current.canonicalKey !== params.authorized.canonicalKey || current.storeKey !== params.authorized.storeKey || current.storePath !== params.authorized.storePath || current.entry.sessionId !== params.authorized.entry.sessionId) throw new Error(`session changed before sharing ${params.operation ?? "mutation"}`);
	const role = resolveSessionSharingRole({
		client: params.client,
		cfg: params.cfg,
		target: current
	});
	if (!canManageSessionSharing(role)) throw new Error(`session ownership changed before sharing ${params.operation ?? "mutation"}`);
	return current;
}
function sharingExpectedEntry(target) {
	return {
		sessionId: target.entry.sessionId,
		createdActor: target.entry.createdActor,
		visibility: target.entry.visibility,
		incognito: target.entry.incognito
	};
}
function assertCurrentSharingManager(params) {
	if (!canManageSessionSharing(resolveSessionSharingRole({
		cfg: params.context.getRuntimeConfig(),
		client: params.client,
		target: params.target,
		includeMembership: false
	}))) throw new Error("session ownership changed before sharing mutation");
}
//#endregion
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
		label: profile.displayName?.trim() || profile.githubIdentity?.login || profile.emails[0] || profile.id,
		...profile.hasAvatar ? { avatarUrl: buildControlUiUserAvatarPath(profile.id, profile.updatedAt) } : {}
	});
	return [...identities.values()];
}
//#endregion
//#region src/gateway/server-methods/sessions-sharing.ts
function runExclusiveSharingMutation(target, run) {
	return runExclusiveSessionLifecycleMutation({
		scope: target.storePath,
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
		token: (params.codec ?? loadPublicSessionShareTokenCodec()).mint({
			agentId: params.agentId,
			sessionKey: params.sessionKey,
			sessionId: params.grant.sessionId,
			shareId: params.grant.id
		}),
		createdAt: params.grant.createdAt
	};
}
function requireManageableTarget(params) {
	const requestedAgent = resolveRequestedSessionAgentId(params.cfg, params.sessionKey, params.agentId);
	if (!requestedAgent.ok) {
		params.respond(false, void 0, requestedAgent.error);
		return null;
	}
	const target = resolveSessionSharingTarget({
		cfg: params.cfg,
		sessionKey: params.sessionKey,
		agentId: requestedAgent.agentId
	});
	if (!target) {
		params.respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `unknown session: ${params.sessionKey}`));
		return null;
	}
	const role = resolveSessionSharingRole({
		client: params.client,
		cfg: params.cfg,
		target
	});
	if (!canManageSessionSharing(role)) {
		params.respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "session owner or operator.admin required", { details: {
			code: "SESSION_SHARING_MANAGER_REQUIRED",
			sessionKey: target.canonicalKey
		} }));
		return null;
	}
	return {
		target,
		role
	};
}
function publishSharingChange(params) {
	bumpGatewayAccessRevision();
	invalidateSessionSharingSnapshot(params.event.sessionKey);
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
		agentId: params.agentId
	});
	emitSessionsChanged(params.context, { reason: "sharing" });
}
function createSessionMembersListHandler(method) {
	const evidenceAware = method === "session.members.listEvidence";
	return async ({ params, respond, client, context }) => {
		if (!assertValidParams(params, validateSessionMembersListParams, method, respond)) return;
		const managed = requireManageableTarget({
			cfg: context.getRuntimeConfig(),
			client,
			sessionKey: params.sessionKey,
			agentId: params.agentId,
			respond
		});
		if (!managed) return;
		const projection = getSessionRowProjection(context);
		if (!projection) throw new Error("Session projection is unavailable before Gateway startup completes");
		const profiles = await listProfiles();
		const evidenceMembers = (await listSessionMembersInWorker({
			agentId: managed.target.agentId,
			sessionKey: managed.target.storeKey,
			storePath: managed.target.storePath
		})).map(projectSessionMemberEvidence);
		do
			await projection.ensureMaterialized();
		while (projection.needsMaterialization);
		const currentCfg = context.getRuntimeConfig();
		const target = requireCurrentManagedTarget({
			cfg: currentCfg,
			client,
			authorized: managed.target,
			operation: "read"
		});
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
			profiles
		});
		for (const member of projectedMembers) if (!identities.some((identity) => identity.id === member.identityId)) identities.push({
			type: "human",
			id: member.identityId
		});
		identities.sort((left, right) => (left.label ?? left.id).localeCompare(right.label ?? right.id) || left.id.localeCompare(right.id));
		const storedOwner = target.entry.createdActor;
		const owner = sessionCreatorProfileId(storedOwner) ? projectSessionActor(storedOwner, /* @__PURE__ */ new Map(), currentCfg) : storedOwner ? {
			type: storedOwner.type,
			id: storedOwner.id,
			label: storedOwner.label
		} : void 0;
		const publicShareGrant = resolveSessionPublicShare(loadExactSessionEntryReadOnly({
			agentId: target.agentId,
			sessionKey: target.storeKey,
			storePath: target.storePath
		})?.entry);
		const publicShare = publicShareGrant?.sessionId === target.entry.sessionId ? projectPublicSessionShare({
			agentId: target.agentId,
			sessionKey: target.canonicalKey,
			grant: publicShareGrant
		}) : void 0;
		respond(true, {
			sessionKey: target.canonicalKey,
			...publicShare ? { publicShare } : {},
			...owner?.id ? { owner } : {},
			members: projectedMembers,
			identities,
			role: resolveSessionSharingRole({
				cfg: currentCfg,
				client,
				target
			}),
			allowedVisibilities: allowedSessionVisibilities(currentCfg)
		}, void 0);
	};
}
const sessionSharingHandlers = {
	"session.publicShare.set": async ({ params, respond, client, context }) => {
		if (!assertValidParams(params, validateSessionPublicShareSetParams, "session.publicShare.set", respond)) return;
		const managed = requireManageableTarget({
			cfg: context.getRuntimeConfig(),
			client,
			sessionKey: params.sessionKey,
			agentId: params.agentId,
			respond
		});
		if (!managed) return;
		if (managed.target.entry.incognito || isIncognitoSessionKey(managed.target.canonicalKey)) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "Incognito sessions cannot be published."));
			return;
		}
		if (managed.target.entry.sessionId !== params.expectedSessionId) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "Session changed; reopen sharing before publishing."));
			return;
		}
		let tokenCodec;
		let publicShareGrant;
		let publicShare;
		await runExclusiveSharingMutation(managed.target, async () => {
			const current = requireCurrentManagedTarget({
				cfg: context.getRuntimeConfig(),
				client,
				authorized: managed.target
			});
			tokenCodec = params.enabled ? loadPublicSessionShareTokenCodec() : void 0;
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
				if (!canManageSessionSharing(resolveSessionSharingRole({
					cfg: context.getRuntimeConfig(),
					client,
					target: {
						...current,
						entry
					}
				}))) throw new Error("session ownership changed before sharing mutation");
				const previous = resolveSessionPublicShare(entry);
				publicShareGrant = params.enabled ? previous ?? {
					id: randomBytes(24).toString("hex"),
					sessionId: entry.sessionId,
					createdAt: Date.now()
				} : void 0;
				if (publicShareGrant) registerSecretValueForRedaction(publicShareGrant.id);
				publicShare = publicShareGrant && tokenCodec ? projectPublicSessionShare({
					agentId: current.agentId,
					sessionKey: current.canonicalKey,
					grant: publicShareGrant,
					codec: tokenCodec
				}) : void 0;
				changed = publicShareGrant?.id !== previous?.id;
				return changed ? { publicShare: publicShareGrant } : null;
			}, { assertCommitAllowed: () => {
				requireCurrentManagedTarget({
					cfg: context.getRuntimeConfig(),
					client,
					authorized: current
				});
			} });
			if (!inspected) throw new Error("session changed before sharing mutation");
			if (changed) emitSessionsChanged(context, {
				reason: "sharing",
				sessionKey: current.canonicalKey,
				agentId: current.agentId
			});
		});
		respond(true, {
			ok: true,
			sessionKey: managed.target.canonicalKey,
			...publicShare ? { publicShare } : {}
		}, void 0);
	},
	"session.visibility.set": async ({ params, respond, client, context }) => {
		if (!assertValidParams(params, validateSessionVisibilitySetParams, "session.visibility.set", respond)) return;
		const cfg = context.getRuntimeConfig();
		const managed = requireManageableTarget({
			cfg,
			client,
			sessionKey: params.sessionKey,
			agentId: params.agentId,
			respond
		});
		if (!managed) return;
		const visibility = params.visibility;
		if (!isSessionVisibilityAllowed(cfg, visibility)) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `session visibility is disabled: ${visibility}`, { details: {
				code: "SESSION_VISIBILITY_DISABLED",
				visibility
			} }));
			return;
		}
		await runExclusiveSharingMutation(managed.target, async () => {
			const current = requireCurrentManagedTarget({
				cfg,
				client,
				authorized: managed.target
			});
			if (resolveSessionVisibility(current.entry) === visibility) return;
			const scope = {
				agentId: current.agentId,
				sessionKey: current.canonicalKey,
				storePath: current.storePath
			};
			let sessionChanged = false;
			await patchSessionEntryCore(scope, (entry) => {
				if (entry.sessionId !== current.entry.sessionId) {
					sessionChanged = true;
					return null;
				}
				return { visibility };
			});
			if (sessionChanged) throw new Error("session changed before sharing mutation");
			const now = Date.now();
			const actor = actorIdentity(client);
			publishSharingChange({
				context,
				agentId: current.agentId,
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
		respond(true, {
			ok: true,
			sessionKey: managed.target.canonicalKey,
			visibility
		}, void 0);
	},
	"session.members.list": createSessionMembersListHandler("session.members.list"),
	"session.members.listEvidence": createSessionMembersListHandler("session.members.listEvidence"),
	"session.members.add": async ({ params, respond, client, context }) => {
		if (!assertValidParams(params, validateSessionMemberAddParams, "session.members.add", respond)) return;
		const managed = requireManageableTarget({
			cfg: context.getRuntimeConfig(),
			client,
			sessionKey: params.sessionKey,
			agentId: params.agentId,
			respond
		});
		if (!managed) return;
		const projection = getSessionRowProjection(context);
		if (!projection) throw new Error("Session projection is unavailable before Gateway startup completes");
		const profiles = await listProfiles();
		do
			await projection.ensureMaterialized();
		while (projection.needsMaterialization);
		requireCurrentManagedTarget({
			cfg: context.getRuntimeConfig(),
			client,
			authorized: managed.target
		});
		const actor = actorIdentity(client);
		if (!knownSessionIdentities({
			creators: projection.listCreatedActors(),
			actor,
			profiles
		}).some((identity) => identity.id === params.identityId)) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "unknown identity"));
			return;
		}
		await runExclusiveSharingMutation(managed.target, async () => {
			const current = requireCurrentManagedTarget({
				cfg: context.getRuntimeConfig(),
				client,
				authorized: managed.target
			});
			const scope = {
				agentId: current.agentId,
				sessionKey: current.storeKey,
				storePath: current.storePath
			};
			const now = Date.now();
			if (!(await addSessionMemberInWorker(scope, {
				identityId: params.identityId,
				addedBy: sharingActorStorageRef(actor),
				addedAt: now,
				expectedSessionId: current.entry.sessionId,
				expectedEntry: sharingExpectedEntry(current)
			}, () => {
				assertCurrentSharingManager({
					context,
					client,
					target: current
				});
			})).inserted) return;
			publishSharingChange({
				context,
				agentId: current.agentId,
				actor,
				event: {
					action: "member-added",
					sessionKey: current.canonicalKey,
					agentId: current.agentId,
					identityId: params.identityId,
					ts: now
				}
			});
		});
		respond(true, {
			ok: true,
			sessionKey: managed.target.canonicalKey,
			identityId: params.identityId
		}, void 0);
	},
	"session.members.remove": async ({ params, respond, client, context }) => {
		if (!assertValidParams(params, validateSessionMemberRemoveParams, "session.members.remove", respond)) return;
		const cfg = context.getRuntimeConfig();
		const managed = requireManageableTarget({
			cfg,
			client,
			sessionKey: params.sessionKey,
			agentId: params.agentId,
			respond
		});
		if (!managed) return;
		await runExclusiveSharingMutation(managed.target, async () => {
			const current = requireCurrentManagedTarget({
				cfg,
				client,
				authorized: managed.target
			});
			const scope = {
				agentId: current.agentId,
				sessionKey: current.storeKey,
				storePath: current.storePath
			};
			if (!await removeSessionMemberInWorker(scope, params.identityId, void 0, current.entry.sessionId, () => {
				assertCurrentSharingManager({
					context,
					client,
					target: current
				});
			}, sharingExpectedEntry(current))) return;
			const now = Date.now();
			const actor = actorIdentity(client);
			publishSharingChange({
				context,
				agentId: current.agentId,
				actor,
				event: {
					action: "member-removed",
					sessionKey: current.canonicalKey,
					agentId: current.agentId,
					identityId: params.identityId,
					ts: now
				}
			});
		});
		respond(true, {
			ok: true,
			sessionKey: managed.target.canonicalKey,
			identityId: params.identityId
		}, void 0);
	}
};
//#endregion
export { sessionSharingHandlers };
