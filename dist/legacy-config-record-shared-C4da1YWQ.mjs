import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { t as isBlockedObjectKey } from "./prototype-keys-CuYw53fZ.mjs";
import "./utils-DgZn2dLu.mjs";
//#region src/commands/doctor/shared/legacy-config-record-shared.ts
function someAgentEntry(value, predicate) {
	let matched = false;
	visitAgentEntries({ agents: value }, (agent) => {
		matched ||= predicate(agent);
	});
	return matched;
}
/** Visit mutable agent entries before or after read-time roster normalization. */
function visitAgentEntries(raw, visitor) {
	const agents = isRecord(raw.agents) ? raw.agents : void 0;
	if (isRecord(agents?.entries)) {
		for (const [agentId, entry] of Object.entries(agents.entries)) if (!isBlockedObjectKey(agentId) && isRecord(entry)) visitor(entry, `agents.entries.${agentId}`);
		return;
	}
	if (Array.isArray(agents?.list)) agents.list.forEach((entry, index) => {
		if (isRecord(entry) && !(typeof entry.id === "string" && isBlockedObjectKey(entry.id))) visitor(entry, `agents.list[${index}]`);
	});
}
/** Visit agent defaults and authored entries without copying their mutable fields. */
function visitAgentConfigScopes(raw, visitor) {
	const agents = isRecord(raw.agents) ? raw.agents : void 0;
	if (isRecord(agents?.defaults)) visitor(agents.defaults, "agents.defaults");
	visitAgentEntries(raw, visitor);
}
/** Delete a nested retired config path, with `*` matching record entries. */
function deleteRetiredPath(owner, path, removed, prefix = "") {
	const [key, ...rest] = path;
	if (!isRecord(owner) || !key) return false;
	if (key === "*") {
		let changed = false;
		for (const [entry, value] of Object.entries(owner)) changed = deleteRetiredPath(value, rest, removed, `${prefix}${entry}.`) || changed;
		return changed;
	}
	if (rest.length === 0) {
		if (!Object.hasOwn(owner, key)) return false;
		delete owner[key];
		removed?.push(`${prefix}${key}`);
		return true;
	}
	const child = owner[key];
	if (!isRecord(child) || !deleteRetiredPath(child, rest, removed, `${prefix}${key}.`)) return false;
	if (Object.keys(child).length === 0) delete owner[key];
	return true;
}
/** Visit a channel root followed by its object-shaped accounts in config order. */
function visitChannelEntries(raw, channelId, visitor) {
	const channels = raw.channels;
	if (!isRecord(channels)) return;
	const channel = channels[channelId];
	if (!isRecord(channel)) return;
	visitor(channel, `channels.${channelId}`);
	if (!isRecord(channel.accounts)) return;
	for (const [accountId, account] of Object.entries(channel.accounts)) if (isRecord(account)) visitor(account, `channels.${channelId}.accounts.${accountId}`);
}
function moveLegacyConfigKey(owner, legacyKey, canonicalKey, path, changes) {
	if (!owner || !Object.hasOwn(owner, legacyKey)) return;
	if (owner[canonicalKey] === void 0) {
		owner[canonicalKey] = owner[legacyKey];
		changes.push(`Moved ${path}.${legacyKey} → ${path}.${canonicalKey}.`);
	} else changes.push(`Removed ${path}.${legacyKey} (${path}.${canonicalKey} already set).`);
	delete owner[legacyKey];
}
//#endregion
export { visitAgentEntries as a, visitAgentConfigScopes as i, moveLegacyConfigKey as n, visitChannelEntries as o, someAgentEntry as r, deleteRetiredPath as t };
