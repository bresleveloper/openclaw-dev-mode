import { d as toStringifiedError } from "./error-coercion-CvJK4lmH.mjs";
import { n as registerListener, t as notifyListeners } from "./listeners-BogSNJ-R.mjs";
import { t as createSubsystemLogger } from "./subsystem-I-uqdx4f.mjs";
import { r as PreparedModelRuntimePublicationSupersededError } from "./prepared-model-runtime.errors-5KDV2tDJ.mjs";
import { isDeepStrictEqual } from "node:util";
//#region src/agents/prepared-model-runtime.publication-events.ts
const log = createSubsystemLogger("agents/prepared-model-runtime");
/** Reports model changes only after the catalog owner commits its complete publication. */
function notifyPreparedModelCatalogPublication(change, refreshStatusChanged = false) {
	notifyPreparedModelRuntimePublication({
		phase: "catalog-published",
		modelFactsChanged: change !== void 0 && (change.previous.catalog ?? change.staticCatalog) !== (change.current.catalog ?? change.staticCatalog),
		...refreshStatusChanged ? { refreshStatusChanged: true } : {}
	});
}
const publicationListeners = /* @__PURE__ */ new Set();
/** Completes catalog attempts without withdrawing their prepared turn runtime. */
function createCatalogAttemptReporter(owner, source, isCurrent, beforeProviderFailure, isPublished) {
	const attempt = owner.catalogAttempt && isDeepStrictEqual(owner.catalogAttempt.source, source) ? owner.catalogAttempt : {
		source,
		failedProviders: {
			provider: /* @__PURE__ */ new Set(),
			native: /* @__PURE__ */ new Set()
		}
	};
	const pendingProviders = {
		provider: void 0,
		native: void 0
	};
	const pendingCount = () => (pendingProviders.provider?.length ?? 0) + (pendingProviders.native?.length ?? 0);
	const failed = (error, providers, kind = "provider") => {
		if (isCurrent() && !(error instanceof PreparedModelRuntimePublicationSupersededError)) {
			const pending = pendingProviders[kind];
			const scope = providers ?? pending ?? [];
			const failedScope = scope.length ? scope : [void 0];
			if (pending === void 0 && failedScope.every((provider) => attempt.failedProviders[kind].has(provider))) return;
			if (kind === "provider") beforeProviderFailure();
			for (const provider of failedScope) attempt.failedProviders[kind].add(provider);
			pendingProviders[kind] = void 0;
			owner.catalogAttempt = attempt;
			if (isPublished?.() !== false) notifyPreparedModelRuntimePublication({
				phase: "catalog-failed",
				error: toStringifiedError(error),
				modelFactsChanged: false
			});
		}
	};
	const hasFailedProviders = () => attempt.failedProviders.provider.size > 0 || attempt.failedProviders.native.size > 0;
	return {
		setPending: (providers, kind = "provider") => {
			pendingProviders[kind] = providers;
		},
		withRefreshStatus: (catalog) => {
			const nativeOutcomes = Object.values(catalog.nativeProviderOutcomes ?? {}).flat();
			if (attempt.failedProviders.native.size > 0 || nativeOutcomes.some((outcome) => outcome.status !== "ready")) catalog.authoritative = false;
			Object.defineProperty(catalog, "pendingProviders", {
				enumerable: true,
				configurable: true,
				get: () => pendingCount() ? [.../* @__PURE__ */ new Set([...pendingProviders.provider ?? [], ...pendingProviders.native ?? []])] : void 0
			});
			Object.defineProperty(catalog, "refreshFailed", {
				enumerable: true,
				configurable: true,
				get: () => hasFailedProviders() || nativeOutcomes.some((outcome) => outcome.status === "unavailable") || catalog.providerOutcomes?.some((outcome) => outcome.status === "unavailable") || void 0
			});
			return catalog;
		},
		published: (providers, kind, publication) => {
			const previouslyFailed = hasFailedProviders();
			const previouslyPendingCount = pendingCount();
			const acquisitionKind = kind ?? "provider";
			const remaining = providers ? pendingProviders[acquisitionKind]?.filter((provider) => !providers.includes(provider)) : void 0;
			pendingProviders[acquisitionKind] = remaining?.length ? remaining : void 0;
			if (providers) for (const provider of providers) attempt.failedProviders[acquisitionKind].delete(provider);
			else attempt.failedProviders[acquisitionKind].clear();
			owner.catalogAttempt = attempt;
			const change = publication?.();
			if (isPublished?.() !== false) notifyPreparedModelCatalogPublication(change, previouslyPendingCount !== pendingCount() || previouslyFailed !== hasFailedProviders());
		},
		failed
	};
}
/** Observes committed prepared model/auth generations without starting discovery. */
function registerPreparedModelRuntimePublicationListener(listener) {
	return registerListener(publicationListeners, listener);
}
function notifyPreparedModelRuntimePublication(event) {
	notifyListeners(publicationListeners, event, (error) => {
		log.warn(`prepared model runtime publication listener failed: ${String(error)}`);
	});
}
function resetPreparedModelRuntimePublicationListenersForTest() {
	publicationListeners.clear();
}
//#endregion
export { resetPreparedModelRuntimePublicationListenersForTest as a, registerPreparedModelRuntimePublicationListener as i, notifyPreparedModelCatalogPublication as n, notifyPreparedModelRuntimePublication as r, createCatalogAttemptReporter as t };
