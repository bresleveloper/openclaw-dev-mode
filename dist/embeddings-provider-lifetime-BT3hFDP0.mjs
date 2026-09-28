import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { i as logWarn } from "./logger-BHMMVs5C.mjs";
//#region src/gateway/embeddings-provider-lifetime.ts
const EMBEDDING_PROVIDER_RETIREMENTS = /* @__PURE__ */ new Map();
const EMBEDDING_PROVIDER_ADMISSION_TAILS = /* @__PURE__ */ new Map();
async function acquireEmbeddingProviderLease(scopeKey, signal, create, holdForCleanup) {
	const previous = EMBEDDING_PROVIDER_ADMISSION_TAILS.get(scopeKey) ?? Promise.resolve();
	const createLease = async () => {
		signal.throwIfAborted();
		await drainEmbeddingProviderRetirements(scopeKey);
		signal.throwIfAborted();
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
		let release = () => {};
		return {
			provider,
			lifecycle: new Promise((resolve) => {
				release = resolve;
			}),
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
async function drainEmbeddingProviderRetirements(scopeKey) {
	const pending = EMBEDDING_PROVIDER_RETIREMENTS.get(scopeKey);
	if (!pending || pending.size === 0) return;
	let firstError;
	let closeFailed = false;
	for (const provider of pending) try {
		await provider.close?.();
		pending.delete(provider);
	} catch (err) {
		if (!closeFailed) firstError = err;
		closeFailed = true;
	}
	if (pending.size === 0) EMBEDDING_PROVIDER_RETIREMENTS.delete(scopeKey);
	if (closeFailed) throw firstError;
}
function retainEmbeddingProviderForRetirement(scopeKey, provider) {
	const pending = EMBEDDING_PROVIDER_RETIREMENTS.get(scopeKey) ?? /* @__PURE__ */ new Set();
	pending.add(provider);
	EMBEDDING_PROVIDER_RETIREMENTS.set(scopeKey, pending);
}
async function closeEmbeddingProvider(scopeKey, provider) {
	try {
		await provider.close?.();
	} catch (closeErr) {
		retainEmbeddingProviderForRetirement(scopeKey, provider);
		logWarn(`openai-compat: failed to close embeddings provider: ${formatErrorMessage(closeErr)}`);
	}
}
async function drainRetainedOpenAiEmbeddingProviders() {
	const activeLifecycles = Array.from(EMBEDDING_PROVIDER_ADMISSION_TAILS.values());
	if (activeLifecycles.length > 0) await Promise.allSettled(activeLifecycles);
	let firstError;
	let closeFailed = false;
	for (const scopeKey of Array.from(EMBEDDING_PROVIDER_RETIREMENTS.keys())) try {
		await drainEmbeddingProviderRetirements(scopeKey);
	} catch (err) {
		if (!closeFailed) firstError = err;
		closeFailed = true;
	}
	if (closeFailed) throw firstError;
}
//#endregion
export { closeEmbeddingProvider as n, drainRetainedOpenAiEmbeddingProviders as r, acquireEmbeddingProviderLease as t };
