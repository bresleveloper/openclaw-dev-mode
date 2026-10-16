import { s as registerSecretValueForRedaction } from "./secret-redaction-registry-DorVHn0l.mjs";
import { t as _usingCtx } from "./usingCtx-DwOBYOJf.mjs";
import { r as isIncognitoSessionKey } from "./session-key-CmZ4o9-l.mjs";
import "./session-key-C09ow4h0.mjs";
import { $r as validateSessionMemberRemoveParams, Qr as validateSessionMemberAddParams, ei as validateSessionMembersListParams, fi as validateSessionVisibilitySetParams, ii as validateSessionPublicShareSetParams } from "./src-l2dWvEsN.mjs";
import { t as ErrorCodes } from "./gateway-error-details-DIefe7Zy.mjs";
import { f as errorShape } from "./error-codes-Dh56LniQ.mjs";
import { d as listProfiles } from "./user-profiles-DYQbtiqy.mjs";
import { h as bumpGatewayAccessRevision } from "./operator-role-policy-BqPaarjx.mjs";
import { s as sessionCreatorProfileId } from "./session-entry-provenance-Bfs2J1E7.mjs";
import { f as resolveSessionPublicShare } from "./session-accessor.sqlite-entry-store-BnbK5FTE.mjs";
import { g as runExclusiveSessionLifecycleMutation } from "./session-lifecycle-admission-GoxISURZ.mjs";
import { s as patchSessionEntryCore } from "./session-accessor.sqlite-entry-AwYVLytL.mjs";
import { u as withSessionEntryReadOnlyInWorker } from "./session-entry-read-runtime-qEzTuOKY.mjs";
import { S as addSessionMemberInWorker, w as removeSessionMemberInWorker } from "./session-accessor-cUVSaeKy.mjs";
import { i as listSessionMembersInWorker } from "./sessions-DNhLX2Ep.mjs";
import { i as gatewayClientSessionCreator } from "./gateway-client-identity-DnDs09-7.mjs";
import { s as buildControlUiUserAvatarPath } from "./control-ui-resource-routes-y_jZ6jnp.mjs";
import "./control-ui-contract-B_YMMx3J.mjs";
import { i as projectSessionActor } from "./session-identity-projection-CViuALyG.mjs";
import { m as isSessionVisibilityAllowed, t as allowedSessionVisibilities, v as resolveSessionVisibility } from "./session-sharing-policy-4QkIpHi4.mjs";
import { r as requireSessionRowProjection } from "./session-row-projection-access-C2RDnj28.mjs";
import { f as invalidateSessionSharingSnapshot } from "./session-sharing-target-read-D_4wDbBo.mjs";
import "./session-sharing-t7UPtrZq.mjs";
import { r as getGatewayLocalUserIngress } from "./local-user-ingress-Ct0iaaFP.mjs";
import { r as emitSessionsChanged } from "./session-change-event-B7XNN_I7.mjs";
import { n as defineValidatedGatewayHandler, t as assertValidParams } from "./validation-Bu27N0nv.mjs";
import { t as loadPublicSessionShareTokenCodec } from "./control-ui-public-session-token-Bnz_h9Li.mjs";
import { i as sharingExpectedEntry, r as prepareManagedSessionAccess } from "./sessions-sharing-authority-exUb7j4B.mjs";
import { t as measureSessionCollaborationPhase } from "./sessions-collaboration-diagnostics-B_xRUlLd.mjs";
import { randomBytes } from "node:crypto";
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
		token: (params.codec ?? loadPublicSessionShareTokenCodec()).mint({
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
	return async ({ params, respond, client, context, ...authority }) => {
		try {
			var _usingCtx$1 = _usingCtx();
			if (!assertValidParams(params, validateSessionMembersListParams, method, respond)) return;
			const access = _usingCtx$1.u(await prepareManagedSessionAccess({
				...authority,
				operation: "read",
				context,
				client,
				sessionKey: params.sessionKey,
				agentId: params.agentId,
				respond
			}));
			if (!access) return;
			const managed = access.target;
			const projection = requireSessionRowProjection(context);
			const profiles = await measureSessionCollaborationPhase(`${method}.profiles`, () => listProfiles());
			const evidenceMembers = (await measureSessionCollaborationPhase(`${method}.evidence`, () => listSessionMembersInWorker({
				agentId: managed.agentId,
				sessionKey: managed.storeKey,
				storePath: managed.storePath
			}))).map(projectSessionMemberEvidence);
			do
				await measureSessionCollaborationPhase(`${method}.projection`, () => projection.ensureMaterialized());
			while (projection.needsMaterialization);
			const entry = await withSessionEntryReadOnlyInWorker({
				agentId: managed.agentId,
				sessionKey: managed.storeKey,
				storePath: managed.storePath,
				projection: "list"
			}, access.assertCurrent, async (read) => {
				if (!read.ok) throw read.error;
				return read.value;
			});
			if (!entry) throw new Error("session changed before sharing read");
			const currentCfg = context.getRuntimeConfig();
			const { target, role } = access.current(entry);
			const publicShareGrant = resolveSessionPublicShare(entry);
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
			const storedOwner = entry.createdActor;
			const owner = sessionCreatorProfileId(storedOwner) ? projectSessionActor(storedOwner, /* @__PURE__ */ new Map(), currentCfg) : storedOwner ? {
				type: storedOwner.type,
				id: storedOwner.id,
				label: storedOwner.label
			} : void 0;
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
				role,
				allowedVisibilities: allowedSessionVisibilities(currentCfg)
			}, void 0);
		} catch (_) {
			_usingCtx$1.e = _;
		} finally {
			_usingCtx$1.d();
		}
	};
}
const sessionSharingHandlers = {
	"session.publicShare.set": defineValidatedGatewayHandler("session.publicShare.set", validateSessionPublicShareSetParams, async ({ params, respond, client, context, ...authority }) => {
		try {
			var _usingCtx3 = _usingCtx();
			const access = _usingCtx3.u(await prepareManagedSessionAccess({
				...authority,
				context,
				client,
				sessionKey: params.sessionKey,
				agentId: params.agentId,
				respond
			}));
			if (!access) return;
			const managed = access.target;
			if (managed.entry.incognito || isIncognitoSessionKey(managed.canonicalKey)) {
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "Incognito sessions cannot be published."));
				return;
			}
			if (managed.entry.sessionId !== params.expectedSessionId) {
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "Session changed; reopen sharing before publishing."));
				return;
			}
			let publicShare;
			await runExclusiveSharingMutation(managed, access.lifecycleStorePath, async () => {
				const { target: current } = access.current();
				const tokenCodec = params.enabled ? loadPublicSessionShareTokenCodec() : void 0;
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
					const publicShareGrant = params.enabled ? previous ?? {
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
				}, { assertCommitAllowed: access.assertCurrent });
				if (!inspected) throw new Error("session changed before sharing mutation");
				if (changed) emitSessionsChanged(context, {
					reason: "sharing",
					sessionKey: current.canonicalKey,
					agentId: current.agentId
				});
			});
			respond(true, {
				ok: true,
				sessionKey: managed.canonicalKey,
				...publicShare ? { publicShare } : {}
			}, void 0);
		} catch (_) {
			_usingCtx3.e = _;
		} finally {
			_usingCtx3.d();
		}
	}),
	"session.visibility.set": defineValidatedGatewayHandler("session.visibility.set", validateSessionVisibilitySetParams, async ({ params, respond, client, context, ...authority }) => {
		try {
			var _usingCtx4 = _usingCtx();
			const access = _usingCtx4.u(await prepareManagedSessionAccess({
				...authority,
				context,
				client,
				sessionKey: params.sessionKey,
				agentId: params.agentId,
				respond
			}));
			if (!access) return;
			const managed = access.target;
			const visibility = params.visibility;
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
				await patchSessionEntryCore(scope, (entry) => {
					inspected = true;
					access.assertEntryManageable(entry);
					if (resolveSessionVisibility(entry) === visibility) return null;
					changed = true;
					return { visibility };
				}, { assertCommitAllowed: () => {
					access.assertCurrent();
					if (!isSessionVisibilityAllowed(context.getRuntimeConfig(), visibility)) throw new Error(`session visibility is disabled: ${visibility}`);
				} });
				if (!inspected) throw new Error("session changed before sharing mutation");
				if (!changed) return;
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
				sessionKey: managed.canonicalKey,
				visibility
			}, void 0);
		} catch (_) {
			_usingCtx4.e = _;
		} finally {
			_usingCtx4.d();
		}
	}),
	"session.members.list": createSessionMembersListHandler("session.members.list"),
	"session.members.listEvidence": createSessionMembersListHandler("session.members.listEvidence"),
	"session.members.add": async ({ params, respond, client, context, ...authority }) => {
		try {
			var _usingCtx5 = _usingCtx();
			if (!assertValidParams(params, validateSessionMemberAddParams, "session.members.add", respond)) return;
			const access = _usingCtx5.u(await prepareManagedSessionAccess({
				...authority,
				context,
				client,
				sessionKey: params.sessionKey,
				agentId: params.agentId,
				respond
			}));
			if (!access) return;
			const managed = access.target;
			const projection = requireSessionRowProjection(context);
			const profiles = await listProfiles();
			do
				await projection.ensureMaterialized();
			while (projection.needsMaterialization);
			access.assertCurrent();
			const actor = actorIdentity(client);
			if (!knownSessionIdentities({
				creators: projection.listCreatedActors(),
				actor,
				profiles
			}).some((identity) => identity.id === params.identityId)) {
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "unknown identity"));
				return;
			}
			await runExclusiveSharingMutation(managed, access.lifecycleStorePath, async () => {
				const { target: current } = access.current();
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
				}, access.assertCurrent)).inserted) return;
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
				sessionKey: managed.canonicalKey,
				identityId: params.identityId
			}, void 0);
		} catch (_) {
			_usingCtx5.e = _;
		} finally {
			_usingCtx5.d();
		}
	},
	"session.members.remove": defineValidatedGatewayHandler("session.members.remove", validateSessionMemberRemoveParams, async ({ params, respond, client, context, ...authority }) => {
		try {
			var _usingCtx6 = _usingCtx();
			const access = _usingCtx6.u(await prepareManagedSessionAccess({
				...authority,
				context,
				client,
				sessionKey: params.sessionKey,
				agentId: params.agentId,
				respond
			}));
			if (!access) return;
			const managed = access.target;
			await runExclusiveSharingMutation(managed, access.lifecycleStorePath, async () => {
				const { target: current } = access.current();
				const scope = {
					agentId: current.agentId,
					sessionKey: current.storeKey,
					storePath: current.storePath
				};
				if (!await removeSessionMemberInWorker(scope, params.identityId, void 0, current.entry.sessionId, access.assertCurrent, sharingExpectedEntry(current))) return;
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
				sessionKey: managed.canonicalKey,
				identityId: params.identityId
			}, void 0);
		} catch (_) {
			_usingCtx6.e = _;
		} finally {
			_usingCtx6.d();
		}
	})
};
//#endregion
export { sessionSharingHandlers };
