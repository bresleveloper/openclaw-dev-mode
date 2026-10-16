import { normalizeLowercaseStringOrEmpty } from "openclaw/plugin-sdk/string-coerce-runtime";
import { parseAccessGroupAllowFromEntry } from "openclaw/plugin-sdk/access-groups";
const mattermostIngressIdentity = {
	key: "sender-id",
	authentication: "verified",
	normalize: normalizeMattermostAllowEntry,
	aliases: [{
		key: "sender-name",
		kind: "plugin:mattermost-user-name",
		normalizeEntry: normalizeMattermostAllowEntry,
		normalizeSubject: normalizeMattermostAllowEntry,
		authentication: "mutable"
	}],
	isWildcardEntry: (entry) => normalizeMattermostAllowEntry(entry) === "*",
	resolveEntryId: ({ entryIndex, fieldKey }) => `mattermost-entry-${entryIndex + 1}:${fieldKey === "sender-name" ? "name" : "user"}`
};
function normalizeMattermostAllowEntry(entry) {
	const trimmed = entry.trim();
	if (!trimmed) return "";
	if (trimmed === "*") return "*";
	const accessGroupName = parseAccessGroupAllowFromEntry(trimmed);
	if (accessGroupName) return `accessGroup:${accessGroupName}`;
	const normalized = trimmed.replace(/^(mattermost|user):/i, "").replace(/^@/, "").trim();
	return normalized ? normalizeLowercaseStringOrEmpty(normalized) : "";
}
//#endregion
export { normalizeMattermostAllowEntry as n, mattermostIngressIdentity as t };
