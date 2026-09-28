import "./accounts-BV6tDOTc.mjs";
import "./normalize-l_b99hap.mjs";
import "./identity-YXPmgFMu.mjs";
import "./transport-detection-CoiRl7Gx.mjs";
import "./reaction-runtime-api-BnQGHcrB.mjs";
import { l as signalSetupContract, n as createSignalPluginBase, r as signalSetupWizard } from "./channel-DhzTcFsK.mjs";
import "./install-signal-cli-BDbzFcU2.mjs";
import "./monitor-Dnz6Ygz5.mjs";
import "./send-B78M_eFp.mjs";
import "./probe-DXT2eLnw.mjs";
//#region extensions/signal/src/channel.setup.ts
const signalSetupPlugin = { ...createSignalPluginBase({
	setupWizard: signalSetupWizard,
	setupContract: signalSetupContract
}) };
//#endregion
export { signalSetupPlugin as t };
