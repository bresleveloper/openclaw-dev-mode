import { t as formatTokenCount } from "./token-format-DW77OPWV.mjs";
import { a as formatUsd, i as formatCostUsageCachePrefix } from "./usage-format-DT58obO2.mjs";
import { r as theme, t as colorize } from "./theme-DzaUZY4q.mjs";
import { i as formatMissingCostEntries } from "./session-cost-usage-totals-Blmg-HFT.mjs";
//#region src/cli/gateway-cli/usage-cost-renderer.ts
function renderGatewayCostUsageSummary(summary, days, rich) {
	const formatTotals = (totals) => {
		const known = `${formatUsd(totals.totalCost) ?? "$0.00"} · ${formatTokenCount(totals.totalTokens) ?? "0"} tokens`;
		return totals.usageReport?.state === "unavailable" ? `unavailable (known subtotal: ${known})` : known;
	};
	const cachePrefix = formatCostUsageCachePrefix(summary.cacheStatus);
	const lines = [colorize(rich, theme.heading, `Usage cost (${days} days)`), `${cachePrefix}${colorize(rich, theme.muted, "Total:")} ${formatTotals(summary.totals)}`];
	if (summary.totals.missingCostEntries > 0) lines.push(`${colorize(rich, theme.muted, "Missing cost:")} ${formatMissingCostEntries(summary.totals)}`);
	const latest = summary.daily.at(-1);
	if (latest) lines.push(`${colorize(rich, theme.muted, "Latest day:")} ${latest.date} · ${formatTotals(latest)}`);
	return lines;
}
//#endregion
export { renderGatewayCostUsageSummary };
