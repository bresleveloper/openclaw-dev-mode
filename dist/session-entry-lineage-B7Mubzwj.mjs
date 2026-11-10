import { y as uniqueStrings } from "./string-normalization-D6DKCpwE.mjs";
import "./session-participant-rDryrWG-.mjs";
//#region src/config/sessions/session-entry-provenance.ts
function sessionCreatorProfileId(actor) {
	return actor?.type === "human" && actor.source === "profile" ? actor.id : void 0;
}
const MAX_SESSION_PARTICIPANTS = 32;
/** Delegation retains contributor identities without inventing child participation. */
function inheritSessionGitContributorProfileIds(parent) {
	if (!parent || parent.incognito) return;
	const directProfileIds = (parent.participants ?? []).flatMap(({ identity }) => identity.type === "profile" ? [identity.id] : []).toSorted();
	const profileIds = [.../* @__PURE__ */ new Set([...parent.inheritedGitContributorProfileIds ?? [], ...directProfileIds])].slice(0, MAX_SESSION_PARTICIPANTS);
	return profileIds.length > 0 ? profileIds : void 0;
}
/** Personal preferences follow the assigned human, otherwise the authenticated human creator. */
function sessionPersonalProfileId(entry) {
	const assigned = entry?.owner?.actor;
	return assigned?.type === "human" ? assigned.id : sessionCreatorProfileId(entry?.createdActor);
}
/** Visible spawns keep the matching verified human parent owner without changing creator attribution. */
function inheritSpawnSessionOwner(source, assignedBy, requesterProfileId, now = Date.now(), resolveProfileId = (profileId) => profileId) {
	const assigned = source?.owner?.actor;
	const owner = assigned ? assigned.type === "human" ? assigned : void 0 : source?.createdActor?.type === "human" && source.createdActor.source === "profile" ? source.createdActor : void 0;
	const directMatch = owner?.id && requesterProfileId && owner.id === requesterProfileId;
	const resolvedOwnerId = !directMatch && owner?.id ? resolveProfileId(owner.id) : owner?.id;
	const resolvedRequesterId = !directMatch && requesterProfileId ? resolveProfileId(requesterProfileId) : requesterProfileId;
	const assignmentActor = resolvedOwnerId && resolvedOwnerId === resolvedRequesterId ? {
		type: "human",
		id: resolvedRequesterId,
		...owner?.label ? { label: owner.label } : {}
	} : assignedBy?.type === "agent" && assignedBy.id ? {
		type: "agent",
		id: assignedBy.id,
		...assignedBy.label ? { label: assignedBy.label } : {}
	} : void 0;
	if (!assignmentActor) return;
	return {
		actor: assignmentActor,
		...assignedBy?.id ? { assignedBy: {
			type: assignedBy.type,
			id: assignedBy.id,
			...assignedBy.label ? { label: assignedBy.label } : {}
		} } : {},
		assignedAt: now
	};
}
function buildSessionCreationStamp(params) {
	return {
		createdVia: params.via,
		...params.surface ? { createdSurface: params.surface } : {},
		...params.actor ? { createdActor: params.actor } : {},
		createdAt: params.now ?? Date.now(),
		...params.sandbox === "required" ? { sandbox: "required" } : {},
		...params.via === "spawn" && !params.incognito && params.inheritedGitContributorProfileIds ? { inheritedGitContributorProfileIds: [...params.inheritedGitContributorProfileIds] } : {},
		...params.skillLibrarySelections ? { skillLibrarySelections: params.skillLibrarySelections.map((selection) => ({ ...selection })) } : {}
	};
}
function buildInboundSessionCreationStamp(ctx) {
	const senderId = ctx?.SenderId?.trim();
	return buildSessionCreationStamp(ctx?.SessionCreation ?? {
		via: "channel",
		...senderId ? { actor: {
			type: "human",
			source: "channel",
			id: senderId,
			label: ctx?.SenderName?.trim() || void 0
		} } : {}
	});
}
/** Logical nodes retain creation attribution and isolation across writes and rollovers. */
function preserveCreationStamp(entry, authoritative) {
	return authoritative ? {
		...entry,
		createdVia: authoritative.createdVia,
		createdSurface: authoritative.createdSurface,
		createdActor: authoritative.createdActor,
		createdAt: authoritative.createdAt,
		inheritedGitContributorProfileIds: authoritative.inheritedGitContributorProfileIds,
		...authoritative.sandbox === "required" ? { sandbox: authoritative.sandbox } : {}
	} : entry;
}
/** Delegation keeps a required parent's human isolation identity, regardless of current roles. */
function inheritSessionCreationPolicy(source, actor) {
	return {
		...source?.sandbox === "required" ? {
			actor: source.createdActor,
			sandbox: "required"
		} : { actor },
		...source?.skillLibrarySelections ? { skillLibrarySelections: source.skillLibrarySelections.map((selection) => ({ ...selection })) } : {}
	};
}
//#endregion
//#region src/config/sessions/session-entry-lineage.ts
/** True when this entry's transcript began as a copy of a parent (actual forkSource ancestry or the legacy/thread-settled marker). */
function sessionEntryForkedFromParent(entry) {
	return entry?.forkSource !== void 0 || entry?.forkedFromParent === true;
}
/** Keep the frozen requester policy and its provenance together across session generations. */
function preserveSessionInheritedToolPolicy(entry) {
	return {
		...entry?.delegatedToolPolicy ? { delegatedToolPolicy: structuredClone(entry.delegatedToolPolicy) } : {},
		...entry?.inheritedToolPolicyVersion ? { inheritedToolPolicyVersion: entry.inheritedToolPolicyVersion } : {},
		...entry?.inheritedToolPolicySource ? { inheritedToolPolicySource: entry.inheritedToolPolicySource } : {},
		...entry?.inheritedToolAllow ? { inheritedToolAllow: [...entry.inheritedToolAllow] } : {},
		...entry?.inheritedToolDeny ? { inheritedToolDeny: [...entry.inheritedToolDeny] } : {}
	};
}
/**
* Builds a spawned child's authority receipt: the exact parent incarnation and the trusted
* owner bit of the spawning invocation. A rowless parent records no incarnation and never
* an owner grant. Explicit undefined values clear a reused child key's previous receipt.
*/
function buildSpawnAuthorityReceipt(parent, requesterSenderIsOwner) {
	return {
		spawnedBySessionId: parent?.sessionId,
		parentSessionLifecycleRevision: parent?.lifecycleRevision,
		spawnedBySenderIsOwner: Boolean(parent && requesterSenderIsOwner === true)
	};
}
/** Builds the stored parent link and spawn-time parent authority receipt for a new session. */
function buildSessionParentLink(params) {
	return {
		...params.parentSessionKey ? { parentSessionKey: params.parentSessionKey } : {},
		...params.parent?.sessionId ? {
			parentSessionId: params.parent.sessionId,
			...params.captureSpawnAuthority ? buildSpawnAuthorityReceipt(params.parent, params.requesterSenderIsOwner) : {}
		} : {}
	};
}
/** Selects parent and spawn lineage that survives an in-place session reset. */
function preserveSessionLineage(entry) {
	return {
		...preserveSessionInheritedToolPolicy(entry),
		spawnedBy: entry?.spawnedBy,
		spawnedBySenderIsOwner: entry?.spawnedBySenderIsOwner,
		spawnedBySessionId: entry?.spawnedBySessionId,
		parentSessionKey: entry?.parentSessionKey,
		parentSessionId: entry?.parentSessionId,
		parentSessionLifecycleRevision: entry?.parentSessionLifecycleRevision,
		forkSource: entry?.forkSource,
		forkedFromParent: sessionEntryForkedFromParent(entry) ? true : void 0,
		spawnDepth: entry?.spawnDepth,
		subagentRole: entry?.subagentRole,
		subagentControlScope: entry?.subagentControlScope
	};
}
function preserveSqliteSameKeySessionRolloverLineage(params) {
	const previousSessionId = params.previous.sessionId.trim();
	const nextSessionId = params.next.sessionId.trim();
	if (!previousSessionId || !nextSessionId || previousSessionId === nextSessionId) return params.next;
	return {
		...params.next,
		previousSessionId,
		usageFamilyKey: params.next.usageFamilyKey ?? params.previous.usageFamilyKey ?? params.sessionKey,
		usageFamilySessionIds: uniqueStrings([
			...params.previous.usageFamilySessionIds ?? [],
			previousSessionId,
			...params.next.usageFamilySessionIds ?? [],
			nextSessionId
		])
	};
}
//#endregion
export { preserveSqliteSameKeySessionRolloverLineage as a, buildInboundSessionCreationStamp as c, inheritSessionGitContributorProfileIds as d, inheritSpawnSessionOwner as f, sessionPersonalProfileId as h, preserveSessionLineage as i, buildSessionCreationStamp as l, sessionCreatorProfileId as m, buildSpawnAuthorityReceipt as n, sessionEntryForkedFromParent as o, preserveCreationStamp as p, preserveSessionInheritedToolPolicy as r, MAX_SESSION_PARTICIPANTS as s, buildSessionParentLink as t, inheritSessionCreationPolicy as u };
