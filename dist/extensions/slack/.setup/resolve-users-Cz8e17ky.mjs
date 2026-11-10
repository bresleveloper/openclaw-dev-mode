import { t as __exportAll } from "./rolldown-runtime-B4FMCO8f.mjs";
import { s as resolveWorkspaceQualifiedSlackTarget } from "./target-parsing-FFE26kOV.mjs";
import { c as collectSlackCursorPages, u as createSlackLookupClient } from "./probe-IiHogLQN.mjs";
import { normalizeLowercaseStringOrEmpty, normalizeOptionalLowercaseString, normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
//#region extensions/slack/src/resolve-users.ts
var resolve_users_exports = /* @__PURE__ */ __exportAll({ resolveSlackUserAllowlist: () => resolveSlackUserAllowlist });
function parseSlackUserInput(raw) {
	const trimmed = raw.trim();
	if (!trimmed) return {};
	const mention = trimmed.match(/^<@([A-Z0-9]+)>$/i);
	if (mention) return { id: mention[1]?.toUpperCase() };
	const prefixed = trimmed.replace(/^(slack:|user:)/i, "");
	if (/^[A-Z][A-Z0-9]+$/i.test(prefixed)) return { id: prefixed.toUpperCase() };
	if (trimmed.includes("@") && !trimmed.startsWith("@")) return { email: normalizeLowercaseStringOrEmpty(trimmed) };
	const name = trimmed.replace(/^@/, "").trim();
	return name ? { name } : {};
}
async function listSlackUsers(client) {
	return collectSlackCursorPages({
		fetchPage: (cursor) => client.users.list({
			limit: 200,
			cursor
		}),
		collectPageItems: (res) => (res.members ?? []).map((member) => {
			const id = normalizeOptionalString(member.id);
			const name = normalizeOptionalString(member.name);
			if (!id || !name) return null;
			const profile = member.profile ?? {};
			return {
				id,
				name,
				displayName: normalizeOptionalString(profile.display_name),
				realName: normalizeOptionalString(profile.real_name) ?? normalizeOptionalString(member.real_name),
				email: normalizeOptionalLowercaseString(profile.email),
				deleted: Boolean(member.deleted),
				isBot: Boolean(member.is_bot),
				isAppUser: Boolean(member.is_app_user)
			};
		}).filter((user) => user !== null)
	});
}
function matchesSlackUserName(user, name) {
	const target = normalizeLowercaseStringOrEmpty(name);
	return [
		user.name,
		user.displayName,
		user.realName
	].some((value) => {
		const candidate = normalizeLowercaseStringOrEmpty(value);
		return Boolean(candidate) && candidate === target;
	});
}
function scoreSlackUser(user) {
	return (user.deleted ? 0 : 3) + (user.isBot || user.isAppUser ? 0 : 2);
}
async function resolveSlackUserAllowlist(params) {
	const entries = params.entries.map((input) => ({
		input,
		workspace: resolveWorkspaceQualifiedSlackTarget(input, "user"),
		parsed: parseSlackUserInput(input)
	}));
	const users = entries.some(({ workspace }) => !workspace) ? await listSlackUsers(params.client ?? createSlackLookupClient(params.token)) : [];
	return entries.map(({ input, workspace, parsed }) => {
		if (workspace) return workspace;
		const matches = users.filter((user) => parsed.id ? user.id === parsed.id : parsed.email ? user.email === parsed.email : parsed.name ? matchesSlackUserName(user, parsed.name) : false);
		const match = parsed.id ? matches[0] : matches.toSorted((a, b) => scoreSlackUser(b) - scoreSlackUser(a))[0];
		if (!parsed.id && !match) return {
			input,
			resolved: false
		};
		const result = {
			input,
			resolved: true,
			id: parsed.id ?? match?.id,
			name: match?.displayName ?? match?.realName ?? match?.name,
			email: match?.email,
			deleted: match?.deleted,
			isBot: match?.isBot
		};
		if (!parsed.id) result.note = matches.length > 1 ? "multiple matches; chose best" : void 0;
		return result;
	});
}
//#endregion
export { resolve_users_exports as n, resolveSlackUserAllowlist as t };
