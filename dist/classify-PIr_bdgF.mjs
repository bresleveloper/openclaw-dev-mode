import "./message-patterns-DSkmGYcR.mjs";
import { n as classifyFailoverSignalCore, t as classifyFailoverReasonCore } from "./classify-core-Y2V-pZHU.mjs";
import "./classification-rules-CaFCPBKV.mjs";
import { r as classifyProviderPluginError } from "./context-overflow-kbcu3uXy.mjs";
//#region src/agents/failover/classify.ts
function classifyFailoverSignal(signal, opts) {
	return classifyFailoverSignalCore(signal, (context) => classifyProviderPluginError({
		...context,
		providerPlugin: opts?.providerPlugin
	}));
}
function classifyFailoverReason(raw, opts) {
	return classifyFailoverReasonCore(raw, opts, (context) => classifyProviderPluginError({
		...context,
		providerPlugin: opts?.providerPlugin
	}));
}
//#endregion
export { classifyFailoverSignal as n, classifyFailoverReason as t };
