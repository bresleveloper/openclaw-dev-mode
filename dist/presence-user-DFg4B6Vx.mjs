import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
//#region src/shared/presence-user.ts
function firstSorted(values) {
	return [...values].map(normalizeOptionalString).filter((value) => value !== void 0).toSorted()[0];
}
function presenceEntrySortKey(entry) {
	return [
		normalizeOptionalString(entry.host) ?? "",
		normalizeOptionalString(entry.platform) ?? "",
		normalizeOptionalString(entry.deviceFamily) ?? "",
		normalizeOptionalString(entry.instanceId) ?? "",
		String(entry.ts ?? 0).padStart(16, "0")
	].join("\0");
}
function compareText(a, b) {
	return a < b ? -1 : a > b ? 1 : 0;
}
/** Presence namespaces come from recorded identity, never display metadata or raw-id shape. */
function presenceUserKey(user) {
	return user.identity ? `profile:${user.identity.id}` : `raw:${user.id}`;
}
/** Online people use the identity namespace established by authentication. */
function groupPresenceUsers(entries) {
	const grouped = /* @__PURE__ */ new Map();
	for (const entry of entries) {
		if (entry.reason === "disconnect" || !entry.user?.id) continue;
		const key = presenceUserKey(entry.user);
		const existing = grouped.get(key);
		if (existing) existing.push(entry);
		else grouped.set(key, [entry]);
	}
	return { users: [...grouped.entries()].toSorted(([a], [b]) => compareText(a, b)).map(([, userEntries]) => ({
		id: userEntries[0].user.id,
		identity: userEntries[0].user.identity,
		name: firstSorted(userEntries.map((entry) => entry.user?.name)),
		email: firstSorted(userEntries.map((entry) => entry.user?.email)),
		avatarUrl: firstSorted(userEntries.map((entry) => entry.user?.avatarUrl)),
		watchedSessions: [...new Set(userEntries.flatMap((entry) => entry.watchedSessions ?? []))].toSorted(),
		entries: userEntries.toSorted((a, b) => compareText(presenceEntrySortKey(a), presenceEntrySortKey(b)))
	})) };
}
//#endregion
export { presenceUserKey as n, groupPresenceUsers as t };
