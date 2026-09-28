import { c as stringEnum } from "./typebox-DIBvVmm8.mjs";
import "./channel-actions-BjxmEiuN.mjs";
import { Type } from "typebox";
//#region extensions/ollama/src/node-inference-contract.ts
const OLLAMA_NODE_INFERENCE_CAPABILITY = "local-inference";
const OLLAMA_MODELS_COMMAND = "ollama.models";
const OLLAMA_CHAT_COMMAND = "ollama.chat";
const OLLAMA_NODE_INFERENCE_COMMANDS = [OLLAMA_MODELS_COMMAND, OLLAMA_CHAT_COMMAND];
const OLLAMA_NODE_INFERENCE_DEFAULT_PLATFORMS = [
	"macos",
	"linux",
	"windows"
];
const DEFAULT_INFERENCE_TIMEOUT_MS = 12e4;
const DISCOVERY_TRANSPORT_TIMEOUT_MS = 9e4;
const MAX_INFERENCE_TIMEOUT_MS = 6e5;
const MAX_TOKENS = 8192;
const MAX_PROMPT_CHARS = 128e3;
const MAX_SYSTEM_PROMPT_CHARS = 32e3;
const ollamaNodeInferenceToolDefinition = {
	name: "node_inference",
	label: "Node Inference",
	description: "Discover and run chat-capable Ollama models installed on paired desktop/server nodes. Use action=discover first, then action=run with a node and model from that result. Inference stays on the selected node.",
	parameters: Type.Object({
		action: stringEnum(["discover", "run"]),
		node: Type.Optional(Type.String({ description: "Connected node id or display name. Required when ambiguous." })),
		model: Type.Optional(Type.String({ description: "Exact local model name returned by discover." })),
		prompt: Type.Optional(Type.String({ description: "Prompt for action=run." })),
		system: Type.Optional(Type.String({ description: "Optional system prompt for action=run." })),
		temperature: Type.Optional(Type.Number({
			minimum: 0,
			maximum: 2
		})),
		maxTokens: Type.Optional(Type.Integer({
			minimum: 1,
			maximum: MAX_TOKENS
		})),
		timeoutMs: Type.Optional(Type.Integer({
			minimum: 1,
			maximum: MAX_INFERENCE_TIMEOUT_MS
		}))
	}, { additionalProperties: false })
};
//#endregion
export { MAX_SYSTEM_PROMPT_CHARS as a, OLLAMA_MODELS_COMMAND as c, OLLAMA_NODE_INFERENCE_DEFAULT_PLATFORMS as d, ollamaNodeInferenceToolDefinition as f, MAX_PROMPT_CHARS as i, OLLAMA_NODE_INFERENCE_CAPABILITY as l, DISCOVERY_TRANSPORT_TIMEOUT_MS as n, MAX_TOKENS as o, MAX_INFERENCE_TIMEOUT_MS as r, OLLAMA_CHAT_COMMAND as s, DEFAULT_INFERENCE_TIMEOUT_MS as t, OLLAMA_NODE_INFERENCE_COMMANDS as u };
