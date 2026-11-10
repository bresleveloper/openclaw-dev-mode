import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { i as logWarn } from "./logger-DHVmYOKs.mjs";
//#region src/gateway/embeddings-provider-lifetime.ts
const FAILED_EMBEDDING_PROVIDER_SCOPES = /* @__PURE__ */ new Set();
const EMBEDDING_PROVIDER_ADMISSION_TAILS = /* @__PURE__ */ new Map();
async function acquireEmbeddingProviderLease(scopeKey, signal, create, holdForCleanup) {
	const previous = EMBEDDING_PROVIDER_ADMISSION_TAILS.get(scopeKey) ?? Promise.resolve();
	const createLease = async () => {
		signal.throwIfAborted();
		if (FAILED_EMBEDDING_PROVIDER_SCOPES.has(scopeKey)) throw new Error("Embedding provider cleanup failed; restart the Gateway before retrying.");
		const provider = await create();
		if (signal.aborted) {
			await closeEmbeddingProvider(scopeKey, provider);
			signal.throwIfAborted();
		}
		if (!holdForCleanup(provider)) return {
			provider,
			lifecycle: Promise.resolve(),
			release: () => {}
		};
		const { promise: lifecycle, resolve: release } = createDeferredCore();
		return {
			provider,
			lifecycle,
			release
		};
	};
	const acquired = previous.then(createLease, createLease);
	const tail = acquired.then(async ({ lifecycle }) => await lifecycle).then(() => void 0, () => void 0);
	EMBEDDING_PROVIDER_ADMISSION_TAILS.set(scopeKey, tail);
	tail.then(() => {
		if (EMBEDDING_PROVIDER_ADMISSION_TAILS.get(scopeKey) === tail) EMBEDDING_PROVIDER_ADMISSION_TAILS.delete(scopeKey);
	});
	const { provider, release } = await acquired;
	return {
		provider,
		release
	};
}
async function closeEmbeddingProvider(scopeKey, provider) {
	try {
		await provider.close?.();
	} catch (closeErr) {
		FAILED_EMBEDDING_PROVIDER_SCOPES.add(scopeKey);
		logWarn(`openai-compat: failed to close embeddings provider; restart the Gateway before retrying: ${formatErrorMessage(closeErr)}`);
	}
}
async function drainRetainedOpenAiEmbeddingProviders() {
	await Promise.allSettled(EMBEDDING_PROVIDER_ADMISSION_TAILS.values());
}
//#endregion
export { closeEmbeddingProvider as n, drainRetainedOpenAiEmbeddingProviders as r, acquireEmbeddingProviderLease as t };
