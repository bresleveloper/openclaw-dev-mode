import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { randomUUID } from "node:crypto";
import { isDeepStrictEqual } from "node:util";
//#region src/agents/auth-profiles/authorization-lifetime.ts
const intents = /* @__PURE__ */ new WeakMap();
const prepared = /* @__PURE__ */ new WeakMap();
const inheritedContinuations = /* @__PURE__ */ new WeakMap();
/** Only the peer-settlement owner may retire a verified shared-credential mirror without reauthorizing. */
function continueAuthProfileAuthorizationInheritance(profiles, profileId, previous) {
	let entries = inheritedContinuations.get(profiles);
	if (!entries) {
		entries = /* @__PURE__ */ new Map();
		inheritedContinuations.set(profiles, entries);
	}
	entries.set(profileId, {
		kind: "refresh",
		previous: structuredClone(previous),
		used: false
	});
}
function copyAuthProfileAuthorizationInheritance(source, target) {
	const entries = inheritedContinuations.get(source);
	if (entries) inheritedContinuations.set(target, entries);
}
/** Only refresh-owner CAS producers carry continuity; a supplied JSON field cannot grant it. */
function continueAuthProfileAuthorization(previous, next) {
	intents.set(next, {
		kind: "refresh",
		previous: structuredClone(previous),
		used: false
	});
	return next;
}
/** Explicit login/upsert is replacement even when the operator supplies identical bytes. */
function replaceAuthProfileAuthorization(next) {
	intents.set(next, {
		kind: "replace",
		used: false
	});
	return next;
}
function copyAuthProfileAuthorizationIntent(source, target) {
	const intent = intents.get(source);
	if (intent) intents.set(target, intent);
}
/** Transfer native callback intent separately from caller-controlled credential JSON. */
function takeAuthProfileAuthorizationWriteIntents(profiles) {
	const captured = [];
	const take = (profileId, inherited, intent) => {
		if (intent && !intent.used) {
			const { used: _used, ...value } = intent;
			captured.push({
				profileId,
				inherited,
				intent: value
			});
			intent.used = true;
		}
	};
	for (const [profileId, credential] of Object.entries(profiles)) take(profileId, false, intents.get(credential));
	for (const [profileId, intent] of inheritedContinuations.get(profiles) ?? []) take(profileId, true, intent);
	return captured;
}
/** Only the private host/worker exchange may reattach transferred write intent. */
function restoreAuthProfileAuthorizationWriteIntents(profiles, captured) {
	for (const { profileId, inherited, intent } of captured) if (inherited && intent.kind === "refresh") continueAuthProfileAuthorizationInheritance(profiles, profileId, intent.previous);
	else if (!inherited && Object.hasOwn(profiles, profileId)) intents.set(profiles[profileId], {
		...intent,
		used: false
	});
}
function readAuthProfileAuthorizationLifetimes(raw) {
	if (!isRecord(raw) || raw.authorizationLifetimes === void 0) return {};
	if (!isRecord(raw.authorizationLifetimes)) throw new Error("Invalid auth profile authorization metadata");
	const entries = [];
	for (const [profileId, value] of Object.entries(raw.authorizationLifetimes)) {
		if (typeof value !== "string" || !/^[a-f0-9-]{36}$/.test(value)) throw new Error("Invalid auth profile authorization metadata");
		entries.push([profileId, value]);
	}
	return Object.fromEntries(entries);
}
function readAuthProfileAuthorizationLifetime(raw, profileId) {
	const lifetimes = readAuthProfileAuthorizationLifetimes(raw);
	return Object.hasOwn(lifetimes, profileId) ? lifetimes[profileId] : void 0;
}
function prepareAuthProfileAuthorizationWrite(existing, incoming) {
	const lifetimes = readAuthProfileAuthorizationLifetimes(existing);
	if (!isRecord(incoming) || !isRecord(incoming.profiles)) {
		if (Object.keys(lifetimes).length) throw new Error("Invalid auth profile credential payload");
		return incoming;
	}
	if (prepared.has(incoming) && isDeepStrictEqual(prepared.get(incoming), existing)) return incoming;
	if (Object.keys(lifetimes).length === 0) {
		for (const credential of Object.values(incoming.profiles)) {
			const intent = isRecord(credential) ? intents.get(credential) : void 0;
			if (intent) intent.used = true;
		}
		const { authorizationLifetimes: _untrusted, ...payload } = incoming;
		return payload;
	}
	const previousProfiles = isRecord(existing) && isRecord(existing.profiles) ? existing.profiles : {};
	for (const profileId of Object.keys(lifetimes)) {
		const previous = previousProfiles[profileId];
		const next = incoming.profiles[profileId];
		const intent = isRecord(next) ? intents.get(next) : inheritedContinuations.get(incoming.profiles)?.get(profileId);
		const continuing = intent && !intent.used && intent.kind === "refresh" && isDeepStrictEqual(intent.previous, previous);
		if (intent && !intent.used && intent.kind === "replace" || !isDeepStrictEqual(previous, next) && !continuing) lifetimes[profileId] = randomUUID();
		if (intent) intent.used = true;
	}
	const payload = {
		...incoming,
		authorizationLifetimes: lifetimes
	};
	prepared.set(payload, existing);
	return payload;
}
/** Enrollment changes no credential bytes and must run in the canonical writer transaction. */
function enrollAuthProfileAuthorization(raw, profileId) {
	if (!isRecord(raw) || !isRecord(raw.profiles)) throw new Error("Invalid auth profile credential payload");
	const lifetimes = readAuthProfileAuthorizationLifetimes(raw);
	if (Object.hasOwn(lifetimes, profileId)) return raw;
	return {
		...raw,
		authorizationLifetimes: {
			...lifetimes,
			[profileId]: randomUUID()
		}
	};
}
//#endregion
export { enrollAuthProfileAuthorization as a, readAuthProfileAuthorizationLifetimes as c, takeAuthProfileAuthorizationWriteIntents as d, copyAuthProfileAuthorizationIntent as i, replaceAuthProfileAuthorization as l, continueAuthProfileAuthorizationInheritance as n, prepareAuthProfileAuthorizationWrite as o, copyAuthProfileAuthorizationInheritance as r, readAuthProfileAuthorizationLifetime as s, continueAuthProfileAuthorization as t, restoreAuthProfileAuthorizationWriteIntents as u };
