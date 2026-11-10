import { r as isRetainedStep } from "./update-run-codec-Guyb20ob.mjs";
//#region src/infra/update-run-step-key.ts
const RELEASED_STEP_KEYS = /* @__PURE__ */ new Map([
	["package-install", "global update"],
	["package-install-omit-optional", "global update (omit optional)"],
	["git-fetch", "git fetch"],
	["git-fetch-tags", "git fetch tags"],
	["git-fetch-target-tag", "git fetch target tag"],
	["git-target-inspection-fetch", "git target inspection fetch"],
	["git-import-admitted-target", "git import admitted target"]
]);
function updateRunStepKey(step) {
	return RELEASED_STEP_KEYS.get(step) ?? step;
}
//#endregion
//#region src/infra/update-run-step-upsert.ts
/** Kept apart from update-run-step.ts: the codec import must not reach the Control UI bundle. */
function upsertStep(record, input) {
	const step = {
		...input,
		step: updateRunStepKey(input.step)
	};
	const index = record.steps.findIndex((existing) => existing.step === step.step);
	if (index >= 0) record.steps[index] = {
		...record.steps[index],
		...step
	};
	else record.steps.push(step);
	while (record.steps.length > 128) {
		const disposable = record.steps.findIndex((entry) => !isRetainedStep(entry));
		if (disposable < 0) throw new Error("Update run retained steps exceed the step limit");
		record.steps.splice(disposable, 1);
	}
}
//#endregion
export { updateRunStepKey as n, upsertStep as t };
