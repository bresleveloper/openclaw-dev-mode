//#region src/commands/doctor-state-integrity-format.ts
function countLabel(count, singular, plural = `${singular}s`) {
	return `${count} ${count === 1 ? singular : plural}`;
}
//#endregion
export { countLabel as t };
