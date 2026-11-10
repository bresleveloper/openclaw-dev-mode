import { t as ExitError } from "./runtime-BazLsT0s.mjs";
import { a as registerSecretValueForRedaction } from "./secret-redaction-registry-C0-kg1Rg.mjs";
import { n as normalizeSecretInput } from "./normalize-secret-input-DBJvdk-L.mjs";
import { n as WizardCancelledError } from "./prompts-DLsO8MlU.mjs";
import { t as readByteStreamWithLimit } from "./read-byte-stream-with-limit-CNew-qG0.mjs";
import { t as createClackPrompter } from "./clack-prompter-CALyuZTx.mjs";
import { addAbortSignal } from "node:stream";
//#region src/commands/models/auth-gateway.ts
/** Collect input without loading local config or opening a credential store. */
async function readGatewayApiKeyParams(opts, signal) {
	let input;
	try {
		input = process.stdin.isTTY ? await createClackPrompter(process.stderr, signal).text({
			message: "Paste API key",
			sensitive: true
		}) : (await readByteStreamWithLimit(addAbortSignal(signal, process.stdin), {
			maxBytes: 1048576,
			onOverflow: ({ maxBytes }) => /* @__PURE__ */ new Error(`Piped auth input exceeds ${maxBytes} bytes.`)
		})).toString("utf8");
	} catch (error) {
		if (error instanceof WizardCancelledError) throw new ExitError(0);
		throw error;
	}
	signal.throwIfAborted();
	const apiKey = normalizeSecretInput(input);
	if (!apiKey) throw new Error("No API key was supplied. Rerun this command and paste a non-empty API key, or pipe one to stdin.");
	registerSecretValueForRedaction(apiKey);
	if (!opts.provider) throw new Error("Missing --provider.");
	return {
		provider: opts.provider,
		apiKey,
		agentId: opts.agent
	};
}
//#endregion
export { readGatewayApiKeyParams as t };
