import { startWebLoginWithQr as startWebLoginWithQr$1, waitForWebLogin as waitForWebLogin$1 } from "../login-qr-runtime.js";
import { b as webAuthExists, c as logoutWeb, d as readWebAuthExistsForDecision, f as readWebAuthSnapshot, h as readWebSelfId, m as readWebAuthState, o as getWebAuthAgeMs, p as readWebAuthSnapshotBestEffort, s as logWebSelfId, u as readWebAuthExistsBestEffort } from "./auth-store-D2rN-hP5.mjs";
import { t as getActiveWebListener } from "./active-listener-CDjoX9QR.mjs";
import { t as monitorWebChannel } from "./monitor-BmpwMdyu.mjs";
import { t as loginWeb } from "./login-BtckglqY.mjs";
import { whatsappSetupWizard as whatsappSetupWizard$1 } from "./setup-surface-ClOIMcYx.mjs";
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
