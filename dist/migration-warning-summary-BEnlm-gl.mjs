function formatMigrationWarningSummary(params) {
	const shown = Math.min(params.count, 5);
	return `${params.summary}; showing ${shown} example(s), ${params.count - shown} omitted. ` + params.detail;
}
//#endregion
export { formatMigrationWarningSummary as t };
