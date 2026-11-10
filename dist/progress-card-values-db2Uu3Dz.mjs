//#region src/session-cards/progress-card-values.ts
function normalizeProgressCardWrite(input) {
	return {
		markdown: input.markdown?.trim() ? input.markdown : void 0,
		steps: input.steps && input.steps.length > 0 ? input.steps : void 0,
		expectedRevision: input.expectedRevision
	};
}
//#endregion
export { normalizeProgressCardWrite as t };
