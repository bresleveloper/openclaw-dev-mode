import { t as createDeferredCore } from "../../deferred-D0La5CRk.mjs";
import { n as requestExitAfterOneShotOutput, r as runCliWithExitFinalization } from "../../one-shot-exit-maXyqxro.mjs";
import { r as getRuntimeConfig } from "../../io.runtime-BN-rPaec.mjs";
import "../../config-Ciq2mxdN.mjs";
import { a as listRegisteredNodeHostCapsAndCommands, o as notifyRegisteredNodeHostCommandDisconnect, r as invokeRegisteredNodeHostCommand, s as watchRegisteredNodeHostCommandAvailability, t as ensureNodeHostPluginRegistry } from "../../plugin-node-host-BtwfDvOk.mjs";
import { n as parseComputerHostInput } from "../../computer-protocol-BHvtEXcO.mjs";
import { createInterface } from "node:readline";
//#region src/gateway/desktop/computer.worker.ts
/** Private desktop process; shares node provider commands without a node connection. */
async function runComputerHost() {
	const input = createInterface({
		input: process.stdin,
		crlfDelay: Infinity
	});
	const requests = /* @__PURE__ */ new Map();
	const operations = /* @__PURE__ */ new Set();
	const completion = createDeferredCore();
	const write = (message) => process.stdout.write(`${JSON.stringify(message)}\n`);
	const log = (message) => process.stderr.write(`${message}\n`);
	let startup;
	let stopWatching;
	let stopping;
	let stopped = false;
	const stop = (execution) => {
		if (stopping) return stopping;
		stopped = true;
		if (!execution) for (const request of requests.values()) request.abort(/* @__PURE__ */ new Error("Computer host is stopping"));
		stopping = (async () => {
			await startup?.catch(() => {});
			await Promise.allSettled(operations);
			try {
				if (execution) await invokeRegisteredNodeHostCommand("computer.act", JSON.stringify({
					action: "__close_execution",
					...execution
				}));
				await notifyRegisteredNodeHostCommandDisconnect();
			} finally {
				stopWatching?.();
				input.close();
				requestExitAfterOneShotOutput();
			}
		})();
		stopping.then(completion.resolve, completion.reject);
		return stopping;
	};
	const stopAfterError = (error) => {
		write({
			type: "error",
			message: error instanceof Error ? error.message : String(error)
		});
		stop();
	};
	input.on("line", (line) => {
		if (stopped) return;
		let message;
		try {
			message = parseComputerHostInput(JSON.parse(line));
		} catch {
			stopAfterError(/* @__PURE__ */ new Error("Invalid computer host request"));
			return;
		}
		if (message.type === "stop") {
			stop(message.execution);
			return;
		}
		if (message.type === "cancel") {
			requests.get(message.id)?.abort(/* @__PURE__ */ new Error("Computer invocation cancelled"));
			return;
		}
		if (message.type === "start") {
			if (startup) {
				stopAfterError(/* @__PURE__ */ new Error("Computer host was already started"));
				return;
			}
			const pluginIds = message.pluginIds;
			startup = (async () => {
				const context = {
					config: getRuntimeConfig(),
					env: process.env
				};
				await ensureNodeHostPluginRegistry({
					...context,
					onlyPluginIds: pluginIds,
					commandAllowlist: /* @__PURE__ */ new Set(["screen.snapshot", "computer.act"]),
					logger: {
						info: log,
						warn: log,
						error: log,
						debug: log
					}
				});
				if (stopped) return;
				const declaration = listRegisteredNodeHostCapsAndCommands(context);
				if (!declaration.computerUse || !declaration.commands.includes("screen.snapshot")) throw new Error("COMPUTER_DRIVER_UNAVAILABLE: the Gateway desktop provider is unavailable");
				stopWatching = watchRegisteredNodeHostCommandAvailability(context, () => {
					const next = listRegisteredNodeHostCapsAndCommands(context);
					if (!next.computerUse || !next.commands.includes("screen.snapshot")) stopAfterError(/* @__PURE__ */ new Error("COMPUTER_DRIVER_UNAVAILABLE: the desktop provider closed"));
				});
				write({
					type: "ready",
					computerUse: declaration.computerUse
				});
			})();
			startup.catch(stopAfterError);
			return;
		}
		const request = message;
		if (!startup || requests.has(request.id)) {
			stopAfterError(/* @__PURE__ */ new Error("Computer host request is not admitted"));
			return;
		}
		const controller = new AbortController();
		requests.set(request.id, controller);
		const operation = (async () => {
			try {
				await startup;
				controller.signal.throwIfAborted();
				if (stopped) throw new Error("Computer host is stopping");
				const payload = await invokeRegisteredNodeHostCommand(request.command, request.paramsJSON, void 0, {
					signal: controller.signal,
					sessionKey: request.sessionKey,
					sendNodeEvent: async () => {
						throw new Error("Computer host does not publish node events");
					}
				});
				if (payload === null) throw new Error("COMPUTER_DRIVER_UNAVAILABLE: computer command is unavailable");
				write({
					type: "result",
					id: request.id,
					payload
				});
			} catch (error) {
				write({
					type: "error",
					id: request.id,
					message: error instanceof Error ? error.message : String(error)
				});
			} finally {
				requests.delete(request.id);
			}
		})();
		operations.add(operation);
		operation.finally(() => operations.delete(operation));
	});
	input.on("close", () => void stop());
	process.once("SIGINT", () => void stop());
	process.once("SIGTERM", () => void stop());
	await completion.promise;
}
runCliWithExitFinalization({
	run: runComputerHost,
	onError: (error) => {
		process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
		process.exitCode = 1;
	}
});
//#endregion
export {};
