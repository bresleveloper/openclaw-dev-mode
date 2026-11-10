import { r as theme } from "./theme-DzaUZY4q.mjs";
import { n as renderTable, t as getTerminalTableWidth } from "./table-BerrlExF.mjs";
//#region src/cli/skills-hooks-cli.format.ts
function formatCliStatusTable(params) {
	const columns = [
		{
			key: "Status",
			header: "Status",
			minWidth: 10
		},
		params.nameColumn,
		{
			key: "Description",
			header: "Description",
			minWidth: 24,
			flex: true
		},
		params.sourceColumn
	];
	if (params.verbose) columns.push({
		key: "Missing",
		header: "Missing",
		minWidth: 18,
		flex: true
	});
	return [`${theme.heading(params.title)} ${theme.muted(`(${params.ready}/${params.rows.length} ready)`)}`, renderTable({
		width: getTerminalTableWidth(),
		columns,
		rows: params.rows
	}).trimEnd()].join("\n");
}
function formatCliRequirements(status, groups, configChecks) {
	const populated = groups.filter(([key]) => status.requirements[key].length > 0);
	if (populated.length === 0) return [];
	const formatStatus = (value, satisfied) => satisfied ? theme.success(`✓ ${value}`) : theme.error(`✗ ${value}`);
	return [
		"",
		theme.heading("Requirements:"),
		...populated.map(([key, label]) => {
			const required = status.requirements[key];
			const missing = status.missing[key];
			let value;
			if (key === "anyBins" || key === "os") value = formatStatus(`(${key === "anyBins" ? "any of: " : ""}${required.join(", ")})`, missing.length === 0);
			else if (key === "config" && configChecks) value = configChecks.map((check) => formatStatus(check.path, check.satisfied)).join(", ");
			else value = required.map((entry) => formatStatus(entry, !missing.includes(entry))).join(", ");
			return `${theme.muted(`  ${label}:`)} ${value}`;
		})
	];
}
//#endregion
export { formatCliStatusTable as n, formatCliRequirements as t };
