import { a as asOptionalRecord } from "./record-coerce-DItp3I4t.mjs";
import "./string-coerce-runtime-C_MKhRVt.mjs";
import { StringDecoder } from "node:string_decoder";
//#region extensions/file-transfer/src/workspace-worker.ts
async function runNodeWorkspaceWorker(options, command, params, signal, onLine) {
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
	const unsubscribe = channel.onMessage((message) => {
		signal.throwIfAborted();
		text += decoder.write(Buffer.from(message));
		if (onLine) {
			let newline;
			while ((newline = text.indexOf("\n")) >= 0) {
				onLine(text.slice(0, newline));
				text = text.slice(newline + 1);
			}
		}
	});
	try {
		await channel.send(Buffer.from("start"));
		const result = asOptionalRecord(await channel.closed);
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
