import { s as isUnscopedSessionKeySentinel } from "./session-key-CBvmC8zz.mjs";
import { l as resolveSessionStorePathCore } from "./paths-CcMbq5NY.mjs";
import { _ as resolveSessionAgentId } from "./agent-scope-CTuYDtny.mjs";
import { T as resolveSessionStorePathForScope } from "./session-accessor.sqlite-entry-BTkJgNr-.mjs";
import { t as formatTokenCount } from "./token-format-o0FIe7MV.mjs";
import { i as formatUsd, r as formatCostUsageCachePrefix } from "./usage-format-CisMpgmJ.mjs";
import { a as loadCostUsageSummary, n as loadSessionCostSummary } from "./session-cost-usage-DWPW66cA.mjs";
//#region src/auto-reply/reply/commands-session-cost.runtime.ts
async function formatSessionUsageCostSummary(params) {
	const agentId = (params.sessionKey && !isUnscopedSessionKeySentinel(params.sessionKey) ? resolveSessionAgentId({
		sessionKey: params.sessionKey,
		config: params.cfg,
		agentId: params.agentId
	}) : params.agentId) ?? "main";
	const sessionSummary = await loadSessionCostSummary({
		sessionId: params.sessionEntry?.sessionId,
		sessionEntry: params.sessionEntry,
		...params.sessionEntry?.sessionId && params.sessionKey ? { sessionTarget: {
			agentId,
			sessionId: params.sessionEntry.sessionId,
			sessionKey: params.sessionKey,
			storePath: resolveSessionStorePathForScope({
				agentId,
				sessionKey: params.sessionKey,
				storePath: params.storePath ?? resolveSessionStorePathCore(params.cfg.session?.store, { agentId })
			})
		} } : {},
		config: params.cfg,
		agentId
	});
	const summary = await loadCostUsageSummary({
		config: params.cfg,
		agentId
	});
	const sessionCost = formatUsd(sessionSummary?.totalCost);
	const sessionTokens = sessionSummary?.totalTokens ? formatTokenCount(sessionSummary.totalTokens) : void 0;
	const sessionSuffix = (sessionSummary?.missingCostEntries ?? 0) > 0 ? " (partial)" : "";
	const sessionLine = sessionCost || sessionTokens ? `Session ${sessionCost ?? "n/a"}${sessionSuffix}${sessionTokens ? ` · ${sessionTokens} tokens` : ""}` : "Session n/a";
	const todayKey = (/* @__PURE__ */ new Date()).toLocaleDateString("en-CA");
	const todayEntry = summary.daily.find((entry) => entry.date === todayKey);
	const todayCost = formatUsd(todayEntry?.totalCost);
	const todaySuffix = (todayEntry?.missingCostEntries ?? 0) > 0 ? " (partial)" : "";
	const todayLine = `Today ${todayCost ?? "n/a"}${todaySuffix}`;
	const last30Cost = formatUsd(summary.totals.totalCost);
	const last30Suffix = summary.totals.missingCostEntries > 0 ? " (partial)" : "";
	const last30Line = `Last 30d ${last30Cost ?? "n/a"}${last30Suffix}`;
	return `💸 Usage cost\n${sessionLine}\n${formatCostUsageCachePrefix(summary.cacheStatus)}${todayLine}\n${last30Line}`;
}
//#endregion
export { formatSessionUsageCostSummary };
