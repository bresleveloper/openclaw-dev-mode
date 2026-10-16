//#region src/wizard/prompts.ts
/**
* Device-code phishing gets the victim to enter the attacker's code, so warning
* only against sharing the code misses the actual attack. Wording tracks the
* Codex CLI prompt so operators see one story across both tools.
*/
const DEVICE_CODE_PHISHING_WARNING = "Continue only if you started this sign-in yourself. If a website or another person gave you this code, cancel.";
var WizardCancelledError = class extends Error {
	constructor(message = "wizard cancelled") {
		super(message);
		this.name = "WizardCancelledError";
	}
};
var WizardNavigationError = class extends Error {
	constructor(direction) {
		super(`wizard navigate ${direction}`);
		this.direction = direction;
		this.name = "WizardNavigationError";
	}
};
//#endregion
export { WizardCancelledError as n, WizardNavigationError as r, DEVICE_CODE_PHISHING_WARNING as t };
