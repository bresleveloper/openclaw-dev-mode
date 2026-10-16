import { r as promptYesNo } from "./prompt-CZNjwnP9.mjs";
import { stdin, stdout } from "node:process";
//#region src/cli/clawhub-install-confirmation.ts
function resolveClawHubInstallConfirmation() {
	if (!stdin.isTTY || !stdout.isTTY) return;
	return async () => await promptYesNo("Proceed with installation?");
}
//#endregion
export { resolveClawHubInstallConfirmation as t };
