import { a as createDeferred } from "./extension-shared-GoQu59iC.mjs";
import crypto from "node:crypto";
//#region extensions/file-transfer/src/workspace-file-create.ts
/** Send bounded messages over the existing paired-node stream, never inline JSON bytes. */
async function createWorkspaceFile(options) {
	options.assertCurrent();
	const sha256 = crypto.createHash("sha256").update(options.data).digest("hex");
	const channel = await options.openDuplex({
		nodeId: options.nodeId,
		command: "file.create",
		params: {
			path: options.path,
			sizeBytes: options.data.byteLength,
			maxBytes: Math.max(1, options.data.byteLength),
			expectedSha256: sha256,
			createParents: options.mkdir,
			followSymlinks: false
		},
		maxMessageBytes: 1048576,
		signal: options.signal,
		assertCurrent: options.assertCurrent,
		timeoutMs: 6e4
	});
	channel.closed.catch(() => {});
	let unsubscribe;
	try {
		options.assertCurrent();
		let receipt = createDeferred();
		let awaiting = false;
		unsubscribe = channel.onMessage((message) => {
			options.assertCurrent();
			if (!awaiting || Buffer.from(message).toString("utf8") !== "ack") throw new Error("Unexpected file.create acknowledgement");
			awaiting = false;
			receipt.resolve();
		});
		for (let offset = 0; offset < options.data.byteLength; offset += 1048576) {
			options.assertCurrent();
			receipt = createDeferred();
			awaiting = true;
			await channel.send(options.data.subarray(offset, offset + 1048576));
			await Promise.race([receipt.promise, channel.closed.then(() => {
				throw new Error("File upload closed before acknowledgement");
			})]);
		}
		options.assertCurrent();
		await channel.send(/* @__PURE__ */ new Uint8Array());
		const result = await channel.closed;
		options.assertCurrent();
		return {
			result,
			sha256
		};
	} finally {
		unsubscribe?.();
		channel.close();
	}
}
//#endregion
export { createWorkspaceFile as t };
