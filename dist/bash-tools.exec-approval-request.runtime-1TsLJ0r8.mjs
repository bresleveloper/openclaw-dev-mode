import { n as explainShellCommand } from "./extract-CfkpViVt.mjs";
import { t as formatCommandSpans } from "./format-BoHFBFmQ.mjs";
//#region src/agents/bash-tools.exec-approval-request.runtime.ts
/**
* Lazy runtime for exec approval command highlighting.
* Kept separate so importing approval request code does not load the command
* explainer until command spans are explicitly requested.
*/
/** Resolve command spans used to highlight exec approval prompts. */
async function resolveExecApprovalCommandSpans(command) {
	const explanation = await explainShellCommand(command);
	const commandSpans = formatCommandSpans(explanation);
	return commandSpans.length > 0 ? commandSpans : void 0;
}
//#endregion
export { resolveExecApprovalCommandSpans };
