import { a as asOptionalRecord } from "./record-coerce-TIsquoVR.mjs";
import "./string-coerce-runtime-50qKeWeL.mjs";
import { StringDecoder } from "node:string_decoder";
//#region extensions/file-transfer/src/workspace-worker.ts
async function runNodeWorkspaceWorker(options, command, params, signal, onLine, beforeStart) {
	signal.throwIfAborted();
	const channel = await options.openDuplex({
		nodeId: options.nodeId,
		command,
		params: {
			...params,
			workspaceDir: options.remoteRoot
		},
		signal,
		timeoutMs: onLine || params.operation === "installDependencies" ? 0 : 6e4
	});
	channel.closed.catch(() => {});
	const decoder = new StringDecoder("utf8");
	let text = "";
	let pending = Promise.resolve();
	const unsubscribe = channel.onMessage((message) => {
		signal.throwIfAborted();
		text += decoder.write(Buffer.from(message));
		if (onLine) {
			let newline;
			while ((newline = text.indexOf("\n")) >= 0) {
				const line = text.slice(0, newline);
				pending = pending.then(() => onLine(line, async (value) => {
					signal.throwIfAborted();
					await channel.send(Buffer.from(`${JSON.stringify(value)}\n`));
				}));
				pending.catch(() => {
					channel.close();
				});
				text = text.slice(newline + 1);
			}
		}
	});
	try {
		await beforeStart?.();
		signal.throwIfAborted();
		await channel.send(Buffer.from("start"));
		const result = asOptionalRecord(await channel.closed);
		await pending;
		signal.throwIfAborted();
		if (asOptionalRecord(result?.payload)?.ok !== true) throw new Error("Node workspace worker did not complete");
		return text + decoder.end();
	} finally {
		unsubscribe();
		channel.close();
	}
}
//#endregion
export { runNodeWorkspaceWorker as t };
