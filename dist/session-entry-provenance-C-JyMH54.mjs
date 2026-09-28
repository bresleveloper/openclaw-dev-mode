import "./session-participant-Cj8YyLga.mjs";
//#region src/config/sessions/session-entry-provenance.ts
function sessionCreatorProfileId(actor) {
	return actor?.type === "human" && actor.source === "profile" ? actor.id : void 0;
}
const MAX_SESSION_PARTICIPANTS = 32;
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
		...params.actor ? { createdActor: params.actor } : {},
		createdAt: params.now ?? Date.now(),
		...params.sandbox === "required" ? { sandbox: "required" } : {},
		...params.skillLibrarySelections ? { skillLibrarySelections: params.skillLibrarySelections.map((selection) => ({ ...selection })) } : {}
	};
}
/** Logical nodes retain creation attribution and isolation across writes and rollovers. */
function preserveCreationStamp(entry, authoritative) {
	return authoritative ? {
		...entry,
		createdVia: authoritative.createdVia,
		createdActor: authoritative.createdActor,
		createdAt: authoritative.createdAt,
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
export { preserveCreationStamp as a, inheritSpawnSessionOwner as i, buildSessionCreationStamp as n, sessionCreatorProfileId as o, inheritSessionCreationPolicy as r, sessionPersonalProfileId as s, MAX_SESSION_PARTICIPANTS as t };
