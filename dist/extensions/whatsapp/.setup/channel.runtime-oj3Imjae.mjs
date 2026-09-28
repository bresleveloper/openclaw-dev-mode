import { startWebLoginWithQr as startWebLoginWithQr$1, waitForWebLogin as waitForWebLogin$1 } from "../login-qr-runtime.js";
import { c as logoutWeb, d as readWebAuthExistsBestEffort, f as readWebAuthExistsForDecision, g as readWebSelfId, h as readWebAuthState, m as readWebAuthSnapshotBestEffort, o as getWebAuthAgeMs, p as readWebAuthSnapshot, s as logWebSelfId, x as webAuthExists } from "./auth-store-Dh8a3cba.mjs";
import { t as getActiveWebListener } from "./active-listener-CDjoX9QR.mjs";
import { t as monitorWebChannel } from "./monitor-Bq7Pkogc.mjs";
import { t as loginWeb } from "./login-DpIgPwdk.mjs";
import { whatsappSetupWizard as whatsappSetupWizard$1 } from "./setup-surface-Bvwd4FVQ.mjs";
//#region extensions/whatsapp/src/channel.runtime.ts
async function startWebLoginWithQr(...args) {
	return await startWebLoginWithQr$1(...args);
}
async function waitForWebLogin(...args) {
	return await waitForWebLogin$1(...args);
}
const whatsappSetupWizard = { ...whatsappSetupWizard$1 };
//#endregion
export { getActiveWebListener, getWebAuthAgeMs, logWebSelfId, loginWeb, logoutWeb, monitorWebChannel, readWebAuthExistsBestEffort, readWebAuthExistsForDecision, readWebAuthSnapshot, readWebAuthSnapshotBestEffort, readWebAuthState, readWebSelfId, startWebLoginWithQr, waitForWebLogin, webAuthExists, whatsappSetupWizard };
