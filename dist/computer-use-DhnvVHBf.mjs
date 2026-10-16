import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import "./computer-use-contract-g23cJXOi.mjs";
import { randomUUID } from "node:crypto";
//#region src/plugins/computer-use-registration.ts
/** Register the canonical node-host command pair for one node-local provider. */
function registerComputerUseProvider(api, provider) {
	let execution;
	let closingPromise;
	let pendingClose;
	const hasActiveWork = () => execution !== void 0 || closingPromise !== void 0 || pendingClose !== void 0;
	const executionEnvelopeFromParams = (paramsJSON) => {
		let value;
		try {
			value = JSON.parse(paramsJSON ?? "{}");
		} catch {
			throw new Error("COMPUTER_INVALID_REQUEST: params must be valid JSON");
		}
		const executionId = isRecord(value) ? value.executionId : void 0;
		if (executionId === void 0) return {
			executionId: void 0,
			value
		};
		if (typeof executionId !== "string" || !(/* @__PURE__ */ new RegExp("^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$", "u")).test(executionId)) throw new Error("COMPUTER_INVALID_REQUEST: executionId is required");
		return {
			executionId,
			value
		};
	};
	const getExecution = async (executionId, context) => {
		for (let barrier = closingPromise; barrier !== void 0; barrier = closingPromise) await barrier;
		if (execution && execution.id !== executionId) throw new Error("COMPUTER_HOST_BUSY: another provider execution owns this computer");
		if (!execution) {
			const opened = provider.openExecution(context?.sessionKey ? {
				executionId,
				sessionKey: context.sessionKey
			} : { executionId });
			opened.catch(() => {
				if (execution?.promise === opened) execution = void 0;
			});
			execution = {
				id: executionId,
				promise: opened
			};
		}
		return execution.promise;
	};
	const closeCurrentExecution = (executionId, reason) => {
		const current = execution;
		if (!current || executionId !== void 0 && current.id !== executionId) return Promise.resolve();
		if (pendingClose) return pendingClose;
		const close = current.promise.then(async (opened) => await opened.close(reason));
		pendingClose = close;
		closingPromise = close;
		close.then(() => {
			if (execution === current) execution = void 0;
			pendingClose = void 0;
			closingPromise = void 0;
		}, () => {
			pendingClose = void 0;
			if (execution !== current) closingPromise = void 0;
		});
		return close;
	};
	const closeExecution = (executionId, reason) => {
		if (!pendingClose) return closeCurrentExecution(executionId, reason);
		const joined = (async () => {
			for (let barrier = pendingClose; barrier !== void 0; barrier = pendingClose) {
				const matchesClosingOwner = executionId === void 0 || execution?.id === executionId;
				try {
					await barrier;
				} catch (error) {
					if (matchesClosingOwner) throw error;
					return;
				}
			}
			await closeCurrentExecution(executionId, reason);
		})();
		joined.catch(() => {});
		return joined;
	};
	api.registerNodeHostCommand({
		command: "screen.snapshot",
		cap: "screen",
		dangerous: false,
		prepare: (context) => provider.prepare?.(context),
		isAvailable: () => provider.isAvailable(),
		hasActiveWork,
		watchAvailability: (context, onChange) => {
			const stopWatching = provider.watchAvailability?.(context, onChange);
			let availabilityStop;
			return async () => {
				availabilityStop ??= Promise.resolve().then(() => stopWatching?.()).catch((error) => {
					availabilityStop = void 0;
					throw error;
				});
				const failures = (await Promise.allSettled([availabilityStop, closeExecution(void 0, "node-host-stop")])).flatMap((result) => result.status === "rejected" ? [result.reason] : []);
				if (failures.length === 1) throw failures[0];
				if (failures.length > 1) throw new AggregateError(failures, "computer provider shutdown failed");
			};
		},
		onDisconnect: async () => await closeExecution(void 0, "gateway-disconnect"),
		handle: async (paramsJSON, _io, context) => {
			const envelope = executionEnvelopeFromParams(paramsJSON);
			if (envelope.executionId) return await (await getExecution(envelope.executionId, context)).snapshot(paramsJSON, context?.signal);
			const executionId = randomUUID();
			const opened = await provider.openExecution(context?.sessionKey ? {
				executionId,
				sessionKey: context.sessionKey
			} : { executionId });
			try {
				return await opened.snapshot(paramsJSON, context?.signal);
			} finally {
				await opened.close("snapshot-complete");
			}
		}
	});
	api.registerNodeHostCommand({
		command: "computer.act",
		cap: "computer",
		dangerous: true,
		computerUse: () => provider.capabilities(),
		isAvailable: () => provider.isAvailable(),
		hasActiveWork,
		handle: async (paramsJSON, _io, context) => {
			const envelope = executionEnvelopeFromParams(paramsJSON);
			if (!envelope.executionId) throw new Error("COMPUTER_INVALID_REQUEST: executionId is required");
			if (isRecord(envelope.value) && envelope.value.action === "__close_execution") {
				const reason = envelope.value.reason;
				await closeExecution(envelope.executionId, typeof reason === "string" && reason.trim() ? reason.slice(0, 64) : "completion");
				return JSON.stringify({ ok: true });
			}
			return await (await getExecution(envelope.executionId, context)).act(paramsJSON, context?.signal);
		}
	});
}
//#endregion
export { registerComputerUseProvider as t };
