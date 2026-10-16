import { i as sha256StableValue, n as sha256Hex } from "./node-crypto-BG4u3UnX.mjs";
import { serializeModelRequestBody } from "@openclaw/ai/internal/openai";
//#region src/agents/embedded-agent-runner/provider-prompt-serialization.ts
function prepareProviderPrompt({ payload, encode }) {
	if (!encode) return {
		...sha256StableValue(payload),
		encoded: void 0
	};
	const encoded = serializeModelRequestBody(payload);
	return {
		digest: sha256Hex(encoded.body),
		byteWeight: encoded.body.byteLength,
		encoded
	};
}
//#endregion
export { prepareProviderPrompt as t };
