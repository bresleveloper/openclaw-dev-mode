import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import "./string-coerce-runtime-BbIJhy7G.mjs";
//#region extensions/telegram/src/audit.ts
function collectTelegramUnmentionedGroupIds(groups) {
	const configuredGroups = groups && typeof groups === "object" ? groups : void 0;
	const hasWildcardUnmentionedGroups = configuredGroups?.["*"]?.requireMention === false && configuredGroups?.["*"]?.enabled !== false;
	const groupIds = [];
	let unresolvedGroups = 0;
	for (const [key, value] of Object.entries(configuredGroups ?? {})) {
		if (key === "*" || !value || typeof value !== "object" || value.enabled === false || value.requireMention !== false) continue;
		const id = normalizeOptionalString(key) ?? "";
		if (!id) continue;
		if (/^-?\d+$/.test(id)) groupIds.push(id);
		else unresolvedGroups += 1;
	}
	groupIds.sort((a, b) => a.localeCompare(b));
	return {
		groupIds,
		unresolvedGroups,
		hasWildcardUnmentionedGroups
	};
}
async function auditTelegramGroupMembership(params) {
	const started = Date.now();
	const token = normalizeOptionalString(params.token) ?? "";
	if (!token || params.groupIds.length === 0) return {
		ok: true,
		checkedGroups: 0,
		unresolvedGroups: 0,
		hasWildcardUnmentionedGroups: false,
		groups: [],
		elapsedMs: Date.now() - started
	};
	const { auditTelegramGroupMembershipImpl } = await import("./audit-membership-runtime-OoICGbDv.mjs");
	return {
		...await auditTelegramGroupMembershipImpl({
			...params,
			token
		}),
		elapsedMs: Date.now() - started
	};
}
//#endregion
export { collectTelegramUnmentionedGroupIds as n, auditTelegramGroupMembership as t };
