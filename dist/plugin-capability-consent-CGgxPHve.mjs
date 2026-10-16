import { n as sanitizeTerminalText } from "./safe-text-SY_CvCi3.mjs";
import { t as formatPluginCapabilityConsentLines } from "./plugin-capability-consent-C9XqXUw9.mjs";
//#region src/wizard/plugin-capability-consent.ts
/** Present the same artifact review in terminal and Gateway-backed setup wizards. */
function createPluginCapabilityConsentPrompter(prompter, beforePersistentEffect) {
	return async (review) => {
		await prompter.note(formatPluginCapabilityConsentLines(review).join("\n"), "Plugin capabilities");
		if (!await prompter.confirm({
			message: `Accept these capabilities for "${sanitizeTerminalText(review.pluginId)}"?`,
			initialValue: false
		})) return prompter.cancel?.("Plugin capability review was declined.");
		await beforePersistentEffect?.();
		return { reviewToken: review.reviewToken };
	};
}
//#endregion
export { createPluginCapabilityConsentPrompter as t };
