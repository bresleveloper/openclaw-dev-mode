import { d as toStringifiedError } from "./error-coercion-C787aVxk.mjs";
import { t as createSubsystemLogger } from "./subsystem-DleLyu58.mjs";
import { n as PreparedModelRuntimePublicationSupersededError } from "./prepared-model-runtime.errors-18hyOf9a.mjs";
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
function createCatalogAttemptReporter(owner, source, isCurrent) {
	const attempt = owner.catalogAttempt && isDeepStrictEqual(owner.catalogAttempt.source, source) ? owner.catalogAttempt : {
		source,
		failedProviders: {
			provider: /* @__PURE__ */ new Set(),
			native: /* @__PURE__ */ new Set()
		}
	};
	let pendingProviders = [];
	let pendingKind = "provider";
	const failed = (error, providers = pendingProviders, kind = pendingKind, beforePublish) => {
		if (isCurrent() && !(error instanceof PreparedModelRuntimePublicationSupersededError)) {
			beforePublish?.();
			const attemptError = toStringifiedError(error);
			for (const provider of providers.length ? providers : [void 0]) attempt.failedProviders[kind].add(provider);
			pendingProviders = [];
			owner.catalogAttempt = attempt;
			notifyPreparedModelRuntimePublication({
				phase: "catalog-failed",
				error: attemptError,
				modelFactsChanged: false
			});
		}
	};
	const hasFailedProviders = () => attempt.failedProviders.provider.size > 0 || attempt.failedProviders.native.size > 0;
	return {
		started: (providers, kind = "provider") => {
			pendingProviders = providers;
			pendingKind = kind;
		},
		withRefreshStatus: (catalog) => {
			if (attempt.failedProviders.native.size > 0) catalog.authoritative = false;
			Object.defineProperty(catalog, "pendingProviders", {
				enumerable: true,
				configurable: true,
				get: () => pendingProviders.length ? pendingProviders : void 0
			});
			Object.defineProperty(catalog, "refreshFailed", {
				enumerable: true,
				configurable: true,
				get: () => hasFailedProviders() || catalog.providerOutcomes?.some((outcome) => outcome.status !== "ready") || void 0
			});
			return catalog;
		},
		published: (providers, kind, publication) => {
			const previouslyFailed = hasFailedProviders();
			const previouslyPendingCount = pendingProviders.length;
			const acquisitionKind = kind ?? "provider";
			pendingProviders = providers ? pendingProviders.filter((provider) => !providers.includes(provider)) : [];
			if (providers) for (const provider of providers) attempt.failedProviders[acquisitionKind].delete(provider);
			else attempt.failedProviders[acquisitionKind].clear();
			owner.catalogAttempt = attempt;
			notifyPreparedModelCatalogPublication(publication, previouslyPendingCount !== pendingProviders.length || previouslyFailed !== hasFailedProviders());
		},
		failed,
		createFailureHandler: (providers, beforeProviderFailure) => {
			let settled = false;
			return (error, providerIds, kind) => {
				if (settled) return;
				settled = true;
				failed(error, kind === "provider" ? providerIds ?? providers : providerIds, kind, kind === "provider" ? () => beforeProviderFailure(providerIds) : void 0);
			};
		}
	};
}
/** Observes committed prepared model/auth generations without starting discovery. */
function registerPreparedModelRuntimePublicationListener(listener) {
	publicationListeners.add(listener);
	return () => publicationListeners.delete(listener);
}
function notifyPreparedModelRuntimePublication(event) {
	for (const listener of publicationListeners) try {
		listener(event);
	} catch (error) {
		log.warn(`prepared model runtime publication listener failed: ${String(error)}`);
	}
}
function resetPreparedModelRuntimePublicationListenersForTest() {
	publicationListeners.clear();
}
//#endregion
export { resetPreparedModelRuntimePublicationListenersForTest as a, registerPreparedModelRuntimePublicationListener as i, notifyPreparedModelCatalogPublication as n, notifyPreparedModelRuntimePublication as r, createCatalogAttemptReporter as t };
