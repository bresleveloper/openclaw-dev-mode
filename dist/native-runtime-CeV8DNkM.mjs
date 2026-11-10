import { Fn as object, Jn as string, qn as strictObject } from "./schemas-BOYIvvln.mjs";
import { i as buildNativeRuntimeFetch, n as NativeRuntimeIdentifier, t as NativeRuntimeConfigSchema } from "./native-runtime-config-D6_xgoOl.mjs";
import { t as nativeRuntimeModelUnsupportedReason } from "./native-runtime-model-support-D1OySL9z.mjs";
import { randomUUID } from "node:crypto";
import { realpath, stat } from "node:fs/promises";
import path from "node:path";
import { isCredentialFieldName } from "@openclaw/ai/internal/shared";
import { cleanupSessionResources } from "@openclaw/ai/internal/runtime";
import { createNodeLlmRuntime } from "@openclaw/ai";
import { registerBuiltInApiProviders } from "@openclaw/ai/providers";
//#region src/worker/native-runtime.ts
const BindingSchema = object({ workspacePath: string().optional() });
const SelectionSchema = strictObject({
	provider: NativeRuntimeConfigSchema.shape.models.element.shape.provider,
	modelId: NativeRuntimeIdentifier
});
const MIN_CREDENTIAL_PREFIX_CHARS = 8;
const FULL_CREDENTIAL_PREFIX_SCAN_MAX_CHARS = 16;
async function assertWorkspace(workspace) {
	const canonicalPath = await realpath(workspace.sourcePath);
	const current = await stat(canonicalPath);
	if (canonicalPath !== workspace.canonicalPath || !current.isDirectory() || current.dev !== workspace.dev || current.ino !== workspace.ino) throw new Error("Native runtime workspace changed since startup");
}
/**
* Owns provider I/O in the dedicated runtime process. In particular, do not import
* src/llm/stream: that facade installs Gateway transport policy and auth state.
*/
async function createNativeRuntime(config, credentials) {
	const parsed = NativeRuntimeConfigSchema.parse(config);
	const runtime = createNodeLlmRuntime(void 0, {
		buildModelFetch: buildNativeRuntimeFetch,
		requiresManagedTransport: () => true
	});
	registerBuiltInApiProviders(runtime.registry);
	const models = /* @__PURE__ */ new Map();
	const protocolSecrets = /* @__PURE__ */ new Set();
	const addProtocolSecret = (value) => {
		protocolSecrets.add(value);
		const normalized = value.trim();
		if (normalized) protocolSecrets.add(normalized);
	};
	for (const entry of parsed.models) {
		const ref = `${entry.provider}/${entry.id}`;
		const credential = credentials[ref];
		if (!credential?.trim()) throw new Error(`Native runtime credential is unavailable for ${ref}`);
		addProtocolSecret(credential);
		const unsupportedReason = nativeRuntimeModelUnsupportedReason(entry.api, credential);
		if (!runtime.registry.getApiProvider(entry.api) || unsupportedReason) throw new Error(unsupportedReason ?? `Unsupported native runtime API: ${entry.api}`);
		const { headers: configuredHeaders, ...definition } = entry;
		const headers = Object.fromEntries(Object.entries(configuredHeaders ?? {}).map(([name, value]) => [name.toLowerCase(), value]));
		if (entry.api === "openai-completions" || entry.api === "openai-responses") {
			headers["openai-organization"] ??= "";
			headers["openai-project"] ??= "";
		}
		const model = {
			...definition,
			name: entry.name ?? entry.id,
			reasoning: entry.reasoning ?? false,
			input: entry.input ?? ["text"]
		};
		Object.freeze(model.input);
		Object.freeze(model.cost);
		if (model.thinkingLevelMap) Object.freeze(model.thinkingLevelMap);
		Object.freeze(model);
		models.set(ref, {
			model,
			credential,
			headers: Object.freeze(headers)
		});
		for (const [name, value] of Object.entries(headers)) {
			if (!value) continue;
			addProtocolSecret(value);
			if (isCredentialFieldName(name)) {
				const token = /^(?:Bearer|Basic)\s+(\S+)$/iu.exec(value.trim())?.[1];
				if (token) protocolSecrets.add(token);
			}
		}
	}
	const sourcePath = path.resolve(parsed.workspace);
	const canonicalPath = await realpath(sourcePath);
	const directory = await stat(canonicalPath);
	if (!directory.isDirectory()) throw new Error("Native runtime workspace must be a directory");
	const workspace = {
		sourcePath,
		canonicalPath,
		dev: directory.dev,
		ino: directory.ino
	};
	const protocolSpellings = [...protocolSecrets].flatMap((secret) => [secret, JSON.stringify(secret).slice(1, -1)]);
	const hasCredentialPrefix = (value) => {
		if (typeof value === "string") {
			for (const secret of protocolSecrets) {
				const maxSize = Math.min(value.length, secret.length - 1);
				const minSize = secret.length <= FULL_CREDENTIAL_PREFIX_SCAN_MAX_CHARS ? 1 : MIN_CREDENTIAL_PREFIX_CHARS;
				for (let size = maxSize; size >= minSize && size > 0; size--) if (secret.startsWith(value.slice(-size))) return true;
			}
			return false;
		}
		return value !== null && typeof value === "object" && Object.values(value).some(hasCredentialPrefix);
	};
	let closed = false;
	const activeTurns = /* @__PURE__ */ new Set();
	function assertOpen() {
		if (closed) throw new Error("Native runtime is closed");
	}
	return {
		async withTurn(turn, callback) {
			assertOpen();
			const binding = BindingSchema.parse(turn.binding);
			const selection = SelectionSchema.parse(turn.selection);
			const ref = `${selection.provider}/${selection.modelId}`;
			const registered = models.get(ref);
			if (!registered) throw new Error("Native runtime model selection is not configured");
			await assertWorkspace(workspace);
			const workspacePath = binding.workspacePath ? await realpath(binding.workspacePath) : workspace.canonicalPath;
			if (workspacePath !== workspace.canonicalPath) throw new Error("Native runtime workspace does not match the admitted workspace");
			const assignedStat = await stat(workspacePath);
			if (!assignedStat.isDirectory()) throw new Error("Native runtime assigned workspace is not a directory");
			const assignedWorkspace = {
				...workspace,
				sourcePath: binding.workspacePath ?? workspace.sourcePath,
				canonicalPath: workspacePath,
				dev: assignedStat.dev,
				ino: assignedStat.ino
			};
			assertOpen();
			const controller = new AbortController();
			activeTurns.add(controller);
			const sessionId = randomUUID();
			const assertActive = () => {
				assertOpen();
				if (controller.signal.aborted) throw new Error("Native runtime turn is closed");
			};
			const streamFn = async (model, context, options) => {
				assertActive();
				if (model !== registered.model) throw new Error("Native runtime requires the exact selected local model");
				await assertWorkspace(workspace);
				await assertWorkspace(assignedWorkspace);
				assertActive();
				const localOptions = {
					temperature: options?.temperature,
					maxTokens: registered.model.maxTokens,
					reasoning: options?.reasoning,
					thinkingBudgets: options?.thinkingBudgets,
					responseFormat: options?.responseFormat,
					stop: options?.stop,
					serviceTier: options?.serviceTier,
					cacheRetention: options?.cacheRetention,
					timeoutMs: options?.timeoutMs,
					maxRetryDelayMs: options?.maxRetryDelayMs,
					onActiveResponse: options?.onActiveResponse,
					asyncToolExecution: options?.asyncToolExecution,
					apiKey: registered.credential,
					headers: { ...registered.headers },
					sessionId,
					transport: "sse",
					signal: options?.signal ? AbortSignal.any([controller.signal, options.signal]) : controller.signal
				};
				localOptions.signal?.throwIfAborted();
				return runtime.streamSimple(registered.model, context, localOptions);
			};
			try {
				const result = await callback({
					model: registered.model,
					streamFn,
					workspacePath,
					hasCredentialPrefix: (value) => {
						assertActive();
						return hasCredentialPrefix(value);
					},
					assertProtocolSafe: (value) => {
						assertActive();
						const serialized = JSON.stringify(value);
						if (protocolSpellings.some((secret) => serialized.includes(secret))) throw new Error("Native credential appeared in a protocol payload");
					}
				});
				assertActive();
				await assertWorkspace(workspace);
				await assertWorkspace(assignedWorkspace);
				assertActive();
				return result;
			} finally {
				activeTurns.delete(controller);
				controller.abort();
				cleanupSessionResources(sessionId);
			}
		},
		close() {
			if (closed) return;
			closed = true;
			for (const controller of activeTurns) controller.abort();
			activeTurns.clear();
			for (const registered of models.values()) {
				registered.headers = {};
				registered.credential = "";
			}
			models.clear();
			protocolSecrets.clear();
			protocolSpellings.length = 0;
			runtime.registry.clearApiProviders();
		}
	};
}
//#endregion
export { createNativeRuntime };
