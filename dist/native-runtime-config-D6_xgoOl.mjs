import { Et as _enum, Jn as string, Ln as partialRecord, Lt as boolean, Nt as array, Pn as number, Un as record, qn as strictObject } from "./schemas-BOYIvvln.mjs";
import { n as MODEL_CATALOG_THINKING_LEVELS } from "./model-catalog-types-VH0V5RHR.mjs";
import { f as isLoopbackIpAddress } from "./ip-Df-yvQzE.mjs";
//#region src/worker/native-runtime-transport.ts
/** Explicit loopback literals support same-host proxies and isolated wire proof without DNS. */
function isNativeRuntimeEndpoint(value) {
	try {
		const url = new URL(value);
		return (url.protocol === "https:" || url.protocol === "http:" && isLoopbackIpAddress(url.hostname)) && !url.username && !url.password && !url.search && !url.hash && !/[{}]/.test(value);
	} catch {
		return false;
	}
}
/** The operator selects one origin, not an authority to replay credentials through redirects. */
function buildNativeRuntimeFetch(model) {
	if (!isNativeRuntimeEndpoint(model.baseUrl)) throw new Error("Native inference requires HTTPS or a literal loopback HTTP endpoint");
	const origin = new URL(model.baseUrl).origin;
	const fetcher = globalThis.fetch;
	return (input, init) => {
		const target = new URL(typeof input === "string" ? input : input instanceof URL ? input.href : input.url);
		if (target.origin !== origin || target.username || target.password) throw new Error("Native inference request left its configured endpoint origin");
		return fetcher(input, {
			...init,
			redirect: "error"
		});
	};
}
//#endregion
//#region src/worker/native-runtime-config.ts
const ThinkingSchema = _enum(MODEL_CATALOG_THINKING_LEVELS);
const NativeRuntimeIdentifier = string().trim().min(1).max(256);
const provider = NativeRuntimeIdentifier.refine((value) => !value.includes("/"), "Provider must not contain /");
const baseUrl = string().url().refine(isNativeRuntimeEndpoint, "Expected HTTPS (or literal loopback HTTP) without credentials, query, or placeholders");
/** Trusted local startup configuration, never a turn-wire configuration surface. */
const NativeRuntimeModelSchema = strictObject({
	provider,
	id: NativeRuntimeIdentifier,
	api: NativeRuntimeIdentifier,
	baseUrl,
	name: NativeRuntimeIdentifier.optional(),
	contextWindow: number().int().positive(),
	maxTokens: number().int().positive(),
	reasoning: boolean().optional(),
	thinkingLevelMap: partialRecord(ThinkingSchema, string().nullable()).optional(),
	cost: strictObject({
		input: number().finite().nonnegative(),
		output: number().finite().nonnegative(),
		cacheRead: number().finite().nonnegative(),
		cacheWrite: number().finite().nonnegative()
	}),
	input: array(_enum(["text", "image"])).min(1).optional(),
	headers: record(string(), string()).optional()
});
/** Canonical node models and exact workspace projected into one trusted worker child. */
const NativeRuntimeConfigSchema = strictObject({
	models: array(NativeRuntimeModelSchema).min(1).superRefine((models, ctx) => {
		const refs = /* @__PURE__ */ new Set();
		models.forEach((model, index) => {
			const ref = `${model.provider}/${model.id}`;
			if (refs.has(ref)) ctx.addIssue({
				code: "custom",
				path: [index],
				message: "Duplicate native runtime model"
			});
			refs.add(ref);
		});
	}),
	workspace: string().trim().min(1)
});
//#endregion
export { buildNativeRuntimeFetch as i, NativeRuntimeIdentifier as n, NativeRuntimeModelSchema as r, NativeRuntimeConfigSchema as t };
