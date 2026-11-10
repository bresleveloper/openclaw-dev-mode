import { i as readConfigMachineStateRowInDatabase } from "./config-machine-state-row-BRr4hJIX.mjs";
import { o as writeConfigMachineStateInDatabase } from "./config-machine-state-write-CmW-lLFq.mjs";
import { n as normalizeLocalOnboardingState, t as localOnboardingStateKey } from "./local-onboarding-state-shared-B_n9M7A7.mjs";
//#region src/state/local-onboarding-state.worker.ts
const localOnboardingOperations = { "localOnboarding.complete": (input, context) => context.write(({ db }) => {
	const key = localOnboardingStateKey(input.configPath);
	const row = readConfigMachineStateRowInDatabase(db, key);
	const current = normalizeLocalOnboardingState(row ? JSON.parse(row.value_json) : void 0, input.configPath);
	if (!current || current.runId !== input.runId) return false;
	if (current.status !== "completed") {
		const completed = {
			...current,
			status: "completed",
			completedAtMs: input.nowMs ?? Date.now()
		};
		writeConfigMachineStateInDatabase(db, key, completed);
	}
	return true;
}, { operationLabel: "local-onboarding.complete" }) };
//#endregion
export { localOnboardingOperations };
