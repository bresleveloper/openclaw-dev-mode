import { u as toErrorObject } from "./error-coercion-C787aVxk.mjs";
import { n as runtimeProcessEntrypoints } from "./runtime-process-entrypoints-DazJcPEG.mjs";
import { AsyncLocalStorage } from "node:async_hooks";
//#region src/process/spawn-broker/context.ts
const context = new AsyncLocalStorage();
let gatewayStartupDisabled = false;
/** A failed startup optimization stays disabled across Gateway restarts in this process. */
async function startGatewaySpawnBroker(options) {
	if (gatewayStartupDisabled) return;
	let broker;
	let entryPath = runtimeProcessEntrypoints.spawnBroker.distWorkerPath;
	try {
		const { createSpawnBrokerHost, spawnBrokerEntryPath } = await import("./host-BXnlbIQ7.mjs");
		entryPath = spawnBrokerEntryPath;
		broker = createSpawnBrokerHost({ onReady: options.onReady });
		await broker.ready();
		return broker;
	} catch (error) {
		gatewayStartupDisabled = true;
		let reason = toErrorObject(error, "Spawn broker startup failed").message;
		try {
			await broker?.close();
		} catch (cleanupError) {
			reason += `; cleanup failed: ${toErrorObject(cleanupError, "Spawn broker cleanup failed").message}`;
		}
		await options.onStartupFailure(`spawn broker startup failed: ${reason}; runtime entry=${entryPath}; in-process spawning is in effect for the lifetime of this process`.replaceAll("\r", " ").replaceAll("\n", " "));
		return;
	}
}
function runWithSpawnBroker(host, run) {
	return context.run(host, run);
}
function getSpawnBroker() {
	return gatewayStartupDisabled ? void 0 : context.getStore();
}
//#endregion
export { runWithSpawnBroker as n, startGatewaySpawnBroker as r, getSpawnBroker as t };
