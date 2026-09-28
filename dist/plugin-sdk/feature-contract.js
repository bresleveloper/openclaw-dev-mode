import { c as isRecord } from "../record-coerce-DItp3I4t.mjs";
//#region src/plugin-sdk/feature-contract.ts
/** Browser-safe typed operations over the existing plugin session-action transport. */
function defineFeatureContract(contract) {
	if (!contract.pluginId.trim() || Object.keys(contract.operations).length > 64 || Object.keys(contract.events).length > 64) throw new Error("Feature contracts require a plugin id and at most 64 operations and events");
	for (const id of Object.keys(contract.operations)) if (!/^[a-z][a-z0-9._-]{0,127}$/u.test(id)) throw new Error(`Invalid feature operation id: ${id}`);
	for (const id of Object.keys(contract.events)) if (!/^[a-z][a-z0-9_-]{0,127}$/u.test(id)) throw new Error(`Invalid feature event id: ${id}`);
	return contract;
}
/** Uses only the current browser connection; it does not mint scopes or a backend client. */
function createFeatureClient(contract, host) {
	if (host.pluginId !== contract.pluginId) throw new Error("Feature contract must belong to the active browser plugin");
	const invoke = async (operation, input, options = {}) => {
		host.signal.throwIfAborted();
		const result = await host.request("plugins.sessionAction", {
			pluginId: contract.pluginId,
			actionId: operation,
			payload: input,
			...options
		});
		host.signal.throwIfAborted();
		if (!isRecord(result) || result.ok !== true) throw new Error(isRecord(result) && typeof result.error === "string" ? result.error : "Feature operation returned an invalid response");
		return result.result;
	};
	const on = (event, listener) => host.onEvent(`plugin.${contract.pluginId}.${event}`, (payload) => listener(payload));
	const watch = (operation, input, options) => {
		if (contract.operations[operation]?.kind !== "query") throw new Error("Only feature queries can be watched");
		let disposed = false;
		let generation = 0;
		let scheduled = false;
		let connected = host.connection.connected;
		const refresh = () => {
			generation += 1;
			if (disposed || !host.connection.connected || scheduled) return;
			scheduled = true;
			queueMicrotask(() => {
				scheduled = false;
				if (disposed || !host.connection.connected) return;
				const current = generation;
				invoke(operation, input, {
					sessionKey: options.sessionKey,
					agentId: options.agentId
				}).then((output) => {
					if (!disposed && current === generation && host.connection.connected) options.onChange(output);
				}, (error) => {
					if (!disposed && current === generation && host.connection.connected) options.onError(error instanceof Error ? error : new Error(String(error)));
				});
			});
		};
		const subscriptions = options.events.map((event) => on(event, refresh));
		subscriptions.push(host.subscribe(() => {
			if (connected !== host.connection.connected) {
				connected = host.connection.connected;
				refresh();
			}
		}));
		const dispose = () => {
			disposed = true;
			generation += 1;
			for (const unsubscribe of subscriptions) unsubscribe();
			host.signal.removeEventListener("abort", dispose);
		};
		host.signal.addEventListener("abort", dispose, { once: true });
		if (host.signal.aborted) dispose();
		else refresh();
		return dispose;
	};
	return {
		invoke,
		on,
		watch
	};
}
//#endregion
export { createFeatureClient, defineFeatureContract };
