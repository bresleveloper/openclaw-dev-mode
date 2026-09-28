import { n as stylePromptMessage } from "./prompt-style-zarsDmI2.mjs";
import { a as guardCancel } from "./onboard-helpers-0ZuVvEiw.mjs";
import { t as styleSelectParams } from "./prompt-select-styled-params-Di2tA0mA.mjs";
import { n as resolveDoctorRepairMode, r as shouldAutoApproveDoctorFix } from "./doctor-repair-mode-BfAIXJao.mjs";
import { confirm, select } from "@clack/prompts";
//#region src/commands/doctor-prompter.ts
/** Doctor prompt adapter that centralizes repair, force, update, and noninteractive behavior. */
/** Creates a doctor prompter honoring --fix, --yes, --force, noninteractive, and update modes. */
function createDoctorPrompter(params) {
	const repairMode = resolveDoctorRepairMode(params.options);
	const confirmPrompt = async (p) => {
		if (repairMode.nonInteractive) return false;
		if (!repairMode.canPrompt) return p.initialValue ?? false;
		return guardCancel(await confirm({
			...p,
			message: stylePromptMessage(p.message)
		}), params.runtime, 130);
	};
	const confirmDefault = async (p) => {
		if (shouldAutoApproveDoctorFix(repairMode)) return true;
		return confirmPrompt(p);
	};
	return {
		confirm: confirmDefault,
		confirmAutoFix: confirmDefault,
		confirmAggressiveAutoFix: async (p) => {
			if (shouldAutoApproveDoctorFix(repairMode, { requiresForce: true })) return true;
			if (repairMode.shouldRepair && !repairMode.shouldForce) return false;
			return confirmPrompt(p);
		},
		confirmRuntimeRepair: async (p) => {
			const { requiresInteractiveConfirmation, ...confirmParams } = p;
			if (requiresInteractiveConfirmation !== true && shouldAutoApproveDoctorFix(repairMode, { blockDuringUpdate: true })) return true;
			if (requiresInteractiveConfirmation === true && !repairMode.canPrompt) return false;
			return confirmPrompt(confirmParams);
		},
		select: async (p, fallback) => {
			if (!repairMode.canPrompt || repairMode.shouldRepair) return fallback;
			return guardCancel(await select(styleSelectParams(p)), params.runtime, 130);
		},
		shouldRepair: repairMode.shouldRepair,
		shouldForce: repairMode.shouldForce,
		repairMode
	};
}
//#endregion
export { createDoctorPrompter };
