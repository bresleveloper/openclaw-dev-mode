import { n as stylePromptMessage } from "./prompt-style-zarsDmI2.mjs";
import { a as guardCancel } from "./onboard-helpers-BpPrDUJb.mjs";
import { t as styleSelectParams } from "./prompt-select-styled-params-DiyhlGNl.mjs";
import { n as resolveDoctorRepairMode, r as shouldAutoApproveDoctorFix } from "./doctor-repair-mode-W3I4YQ3X.mjs";
import { confirm, select } from "@clack/prompts";
//#region src/commands/doctor-prompter.ts
function createDoctorPrompter(params) {
	const repairMode = resolveDoctorRepairMode(params.options);
	const confirmPrompt = async (p) => {
		if (params.signal?.aborted) return false;
		if (repairMode.nonInteractive) return false;
		if (!repairMode.canPrompt) return p.initialValue ?? false;
		const answer = await confirm({
			...p,
			signal: params.signal ? p.signal ? AbortSignal.any([p.signal, params.signal]) : params.signal : p.signal,
			message: stylePromptMessage(p.message)
		});
		return params.signal?.aborted ? false : guardCancel(answer, params.runtime, 130);
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
