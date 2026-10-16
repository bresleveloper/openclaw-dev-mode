import { n as sanitizeTerminalText } from "./safe-text-SY_CvCi3.mjs";
import { n as promptText } from "./prompt-CZNjwnP9.mjs";
//#region src/cli/install-policy-warning-acknowledgement.ts
function resolveInstallPolicyWarningAcknowledgementCliOptions(params) {
	const canPrompt = !params.acknowledgeInstallPolicyWarning && params.allowPrompt !== false && process.stdin.isTTY && process.stdout.isTTY;
	return params.acknowledgeInstallPolicyWarning ? { onInstallPolicyWarning: async () => ({ status: "approved" }) } : canPrompt ? { onInstallPolicyWarning: async (request) => {
		const targetName = sanitizeTerminalText(request.targetName);
		return (await promptText(`type: '${targetName}' to ${request.requestMode} anyway\n> `)).trim() === targetName ? { status: "approved" } : { status: "declined" };
	} } : {};
}
//#endregion
export { resolveInstallPolicyWarningAcknowledgementCliOptions as t };
