import "./accounts-DMtj2E-4.mjs";
import "./normalize-D7kSomXt.mjs";
import "./identity-B3JyPqGO.mjs";
import { l as signalSetupContract, n as createSignalPluginBase, r as signalSetupWizard } from "./channel-E_23H6I6.mjs";
import "./reaction-runtime-api-xqwxFZ2S.mjs";
import "./install-signal-cli-ChvjzM6X.mjs";
import "./monitor-CG20ucVU.mjs";
import "./send-CAlJlhsT.mjs";
import "./probe-2LTiStRi.mjs";
//#region extensions/signal/src/channel.setup.ts
const signalSetupPlugin = { ...createSignalPluginBase({
	setupWizard: signalSetupWizard,
	setupContract: signalSetupContract
}) };
//#endregion
export { signalSetupPlugin as t };
