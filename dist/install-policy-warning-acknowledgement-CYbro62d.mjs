import { n as sanitizeTerminalText } from "./safe-text-CBmKtmbt.mjs";
import { n as promptText } from "./prompt-BU90Lld0.mjs";
//#region src/cli/install-policy-warning-acknowledgement.ts
function canPromptForInstallPolicyWarning() {
	return process.stdin.isTTY && process.stdout.isTTY;
}
function resolveInstallPolicyWarningAcknowledgementCliOptions(params) {
	const canPrompt = !params.acknowledgeInstallPolicyWarning && params.allowPrompt !== false && canPromptForInstallPolicyWarning();
	return params.acknowledgeInstallPolicyWarning ? { onInstallPolicyWarning: async () => ({ status: "approved" }) } : canPrompt ? { onInstallPolicyWarning: async (request) => {
		const targetName = sanitizeTerminalText(request.targetName);
		return (await promptText(`type: '${targetName}' to ${request.requestMode} anyway\n> `)).trim() === targetName ? { status: "approved" } : { status: "declined" };
	} } : {};
}
//#endregion
export { resolveInstallPolicyWarningAcknowledgementCliOptions as t };
