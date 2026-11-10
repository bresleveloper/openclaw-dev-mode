import "./accounts-B0Pba1-q.mjs";
import "./normalize-D7kSomXt.mjs";
import "./identity-B3JyPqGO.mjs";
import { f as signalSetupContract, n as createSignalPluginBase, r as signalSetupWizard } from "./channel-CM-rLLPN.mjs";
import "./reaction-runtime-api-mdO4k0yv.mjs";
import "./install-signal-cli-hYVLYGXe.mjs";
import "./monitor-C6u1JV2C.mjs";
import "./send-CM7-016e.mjs";
import "./probe-D_93QCe0.mjs";
//#region extensions/signal/src/channel.setup.ts
const signalSetupPlugin = createSignalPluginBase({
	setupWizard: signalSetupWizard,
	setupContract: signalSetupContract
});
//#endregion
export { signalSetupPlugin as t };
