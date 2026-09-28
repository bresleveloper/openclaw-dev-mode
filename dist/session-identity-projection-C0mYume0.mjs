import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { n as ok, t as err } from "./result-BQGgYouL.mjs";
import { n as normalizeAgentId } from "./agent-id-GA8mwdTG.mjs";
import { O as listAgentIds } from "./agent-scope-config-IQKOEtZ4.mjs";
import "./session-key-CBvmC8zz.mjs";
import { s as looksLikeAvatarPath } from "./avatar-policy-I2uW2Cs8.mjs";
import { t as normalizeControlUiBasePath } from "./control-ui-shared-DqFhbHR8.mjs";
import { c as resolveUserProfileReference, t as getUserProfileDisplay } from "./user-profile-list-B5pNqyXa.mjs";
import { o as sessionCreatorProfileId } from "./session-entry-provenance-C-JyMH54.mjs";
import { q as mergeSessionProfileInvolvement } from "./session-accessor-C05KQ5A3.mjs";
import { n as resolveAgentIdentity } from "./identity-DdUdpaIE.mjs";
import { n as buildControlUiResourcePath, s as buildControlUiUserAvatarPath } from "./control-ui-resource-routes-DVy_LnYu.mjs";
import "./control-ui-contract-Dup6xL62.mjs";
import { t as sortAndLimitBy } from "./sort-and-limit-NdojqZsZ.mjs";
//#region src/gateway/current-user-profile-display.ts
function resolveCurrentUserProfileDisplay(senderId) {
	try {
		const profile = getUserProfileDisplay(senderId);
		const label = normalizeOptionalString(profile.displayName);
		return {
			kind: "resolved",
			profileId: profile.id,
			...label ? { label } : {},
			avatarUrl: buildControlUiUserAvatarPath(profile.id, profile.avatarRevision),
			hasUploadedAvatar: profile.hasAvatar
		};
	} catch {
		return { kind: "unresolved" };
	}
}
//#endregion
//#region src/gateway/session-identity-projection.ts
/** The row owner invalidates these facts on profile/config publication; entry replacement is exact. */
function createSessionIdentityProjection() {
	let owners = /* @__PURE__ */ new WeakMap();
	let participants = /* @__PURE__ */ new WeakMap();
	let people = /* @__PURE__ */ new WeakMap();
	return {
		invalidate() {
			owners = /* @__PURE__ */ new WeakMap();
			participants = /* @__PURE__ */ new WeakMap();
			people = /* @__PURE__ */ new WeakMap();
		},
		owner(...args) {
			const [entry] = args;
			if (!entry) return projectSessionOwner(...args);
			if (!owners.has(entry)) owners.set(entry, projectSessionOwner(...args));
			return owners.get(entry);
		},
		participants(...args) {
			const [entry] = args;
			if (!entry) return projectSessionParticipants(...args);
			let projected = participants.get(entry);
			if (!projected) {
				projected = projectSessionParticipants(...args);
				participants.set(entry, projected);
			}
			return projected;
		},
		people(...args) {
			const [entry] = args;
			let projected = people.get(entry);
			if (!projected) {
				projected = projectSessionPeople(...args);
				people.set(entry, projected);
			}
			return projected;
		}
	};
}
function projectSessionParticipant(identity, profiles, cfg) {
	if (identity.type === "agent" && cfg) {
		const agent = resolveAgentIdentity(cfg, identity.id);
		const label = normalizeOptionalString(agent?.name);
		const avatar = normalizeOptionalString(agent?.avatar);
		return {
			identity,
			...label ? { label } : {},
			...avatar && looksLikeAvatarPath(avatar) ? { avatarUrl: buildControlUiResourcePath("agentAvatar", normalizeControlUiBasePath(cfg.gateway?.controlUi?.basePath), identity.id) } : {}
		};
	}
	if (identity.type !== "profile") return { identity };
	if (!profiles.has(identity.id)) {
		const display = resolveCurrentUserProfileDisplay(identity.id);
		profiles.set(identity.id, display.kind === "resolved" ? display : void 0);
	}
	const profile = profiles.get(identity.id);
	return {
		identity: {
			type: "profile",
			id: profile?.profileId ?? identity.id
		},
		...profile?.label ? { label: profile.label } : {},
		...profile?.hasUploadedAvatar ? { avatarUrl: profile.avatarUrl } : {}
	};
}
/** Resolve merged profiles without rewriting personal choices in other agent stores. */
function projectSessionProfileInvolvement(entry, profileId, profiles) {
	return mergeSessionProfileInvolvement(Object.entries(entry.profileInvolvement?.profiles ?? {}).flatMap(([id, state]) => projectSessionParticipant({
		type: "profile",
		id
	}, profiles).identity.id === profileId ? [state] : []));
}
function projectSessionActor(actor, profiles = /* @__PURE__ */ new Map(), cfg, profileProvenance = true) {
	if (!actor) return;
	const id = normalizeOptionalString(actor.id);
	if (!id) return { type: actor.type };
	const identity = actor.type === "agent" ? {
		type: "agent",
		id
	} : actor.type === "human" && profileProvenance ? {
		type: "profile",
		id
	} : {
		type: "legacy",
		actorType: actor.type,
		source: null,
		id
	};
	return {
		type: actor.type,
		id,
		...projectSessionParticipant(identity, profiles, cfg)
	};
}
/** Projects an identity only when it can own a session durably. */
function projectAssignableSessionOwner(actor, userProfileIdentityById, cfg, configuredAgentIds, profileProvenance = true) {
	if (!actor || actor.type !== "human" && actor.type !== "agent") return;
	const rawId = normalizeOptionalString(actor.id);
	if (!rawId) return;
	const id = actor.type === "agent" ? normalizeAgentId(rawId) : rawId;
	if (actor.type === "agent" && !(configuredAgentIds ?? new Set(listAgentIds(cfg))).has(id)) return;
	if (actor.type === "human" && !profileProvenance) return;
	const projected = projectSessionActor({
		type: actor.type,
		id
	}, userProfileIdentityById, cfg);
	if (!projected?.id || actor.type === "human" && userProfileIdentityById.get(id) === void 0) return;
	return {
		...projected,
		type: actor.type,
		id
	};
}
function projectSessionOwner(entry, userProfileIdentityById, cfg, configuredAgentIds) {
	const persisted = entry?.owner;
	const identities = userProfileIdentityById ?? /* @__PURE__ */ new Map();
	const actor = projectAssignableSessionOwner(persisted?.actor ?? entry?.createdActor, identities, cfg, configuredAgentIds, Boolean(persisted?.actor || sessionCreatorProfileId(entry?.createdActor)));
	if (!actor) return;
	const assignedBy = projectSessionActor(persisted?.assignedBy, identities, cfg);
	return {
		actor,
		...assignedBy ? { assignedBy } : {},
		...persisted?.assignedAt !== void 0 ? { assignedAt: persisted.assignedAt } : {}
	};
}
function projectSessionParticipants(entry, userProfileIdentityById, cfg) {
	const identities = userProfileIdentityById ?? /* @__PURE__ */ new Map();
	const participants = /* @__PURE__ */ new Map();
	for (const { identity } of entry?.participants ?? []) {
		const participant = projectSessionParticipant(identity, identities, cfg);
		participants.set(JSON.stringify(participant.identity), participant);
	}
	return participants;
}
/** Participation, creation, and responsibility are associations, never access grants. */
function projectSessionPeople(entry, identities, owner) {
	const people = /* @__PURE__ */ new Map();
	const addPerson = (participant) => {
		const identity = participant?.identity;
		if (identity?.type === "profile") people.set(identity.id, {
			identity,
			label: participant?.label,
			avatarUrl: participant?.avatarUrl,
			sessionCount: 1
		});
	};
	for (const { identity } of entry.participants ?? []) if (identity.type === "profile") addPerson(projectSessionParticipant(identity, identities));
	addPerson(owner);
	const creatorId = normalizeOptionalString(sessionCreatorProfileId(entry.createdActor));
	if (creatorId) addPerson(projectSessionParticipant({
		type: "profile",
		id: creatorId
	}, identities));
	return [...people.values()];
}
/** Resolve navigation references within the caller-prepared visibility scope. */
function* resolveSessionListProfileReference(reference, entries, identities, allowedProfileIds, shouldYield) {
	const exact = projectSessionParticipant({
		type: "profile",
		id: reference
	}, identities);
	if (identities.get(reference) && (!allowedProfileIds || allowedProfileIds.has(exact.identity.id))) return ok(exact.identity.id);
	const prefix = /^[0-9a-f]{8,32}$/.test(reference);
	const matches = /* @__PURE__ */ new Set();
	for (const [, entry] of entries) {
		if (shouldYield?.()) yield;
		const ids = [sessionCreatorProfileId(entry.createdActor), ...(entry.participants ?? []).flatMap(({ identity }) => identity.type === "profile" ? [identity.id] : [])];
		for (const id of ids) {
			if (id === reference) return ok(exact.identity.id);
			if (id && prefix && id.replaceAll("-", "").toLowerCase().startsWith(reference)) matches.add(projectSessionParticipant({
				type: "profile",
				id
			}, identities).identity.id);
		}
	}
	const durable = resolveUserProfileReference(reference, allowedProfileIds ? { allowedProfileIds } : {});
	if (!durable.ok) return durable;
	if (durable.value) matches.add(durable.value);
	return matches.size > 1 ? err("ambiguous") : ok(matches.values().next().value);
}
function projectSessionPeopleFacet(people, selectedProfileId) {
	const entries = [...people];
	const compare = (a, b) => b.sessionCount - a.sessionCount || (a.label ?? a.identity.id).localeCompare(b.label ?? b.identity.id) || a.identity.id.localeCompare(b.identity.id);
	const visiblePeople = sortAndLimitBy(entries, 60, compare);
	const selected = selectedProfileId ? sortAndLimitBy(entries.filter((person) => person.identity.id === selectedProfileId), 1, compare)[0] : void 0;
	if (selected && !visiblePeople.includes(selected)) visiblePeople.splice(-1, 1, selected);
	return {
		people: visiblePeople,
		selected,
		overflow: entries.length > visiblePeople.length
	};
}
function addSessionOwnerFacetIdentity(ownerFacet, actor) {
	const existing = ownerFacet.get(actor.id);
	if (!existing || existing.type === "human" && actor.type === "agent") ownerFacet.set(actor.id, actor);
}
function sortSessionOwnerFacet(ownerFacet) {
	return [...ownerFacet.values()].toSorted((a, b) => {
		return (a.label ?? a.id).localeCompare(b.label ?? b.id) || a.id.localeCompare(b.id);
	});
}
//#endregion
export { projectSessionOwner as a, projectSessionPeople as c, resolveSessionListProfileReference as d, sortSessionOwnerFacet as f, projectSessionActor as i, projectSessionPeopleFacet as l, createSessionIdentityProjection as n, projectSessionParticipant as o, resolveCurrentUserProfileDisplay as p, projectAssignableSessionOwner as r, projectSessionParticipants as s, addSessionOwnerFacetIdentity as t, projectSessionProfileInvolvement as u };
