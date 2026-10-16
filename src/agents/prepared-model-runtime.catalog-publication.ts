import { isDeepStrictEqual } from "node:util";
import { runtimeAuthMetadataState } from "./auth-profiles/runtime-snapshot-owner.js";
import type { ModelCatalogSnapshot } from "./model-catalog.types.js";
import {
  copyPreparedModelFullCatalogAuth,
  getPreparedModelFullCatalogAuth,
} from "./prepared-model-runtime-auth.js";
import { isPreparedModelCatalogFull } from "./prepared-model-runtime.full-catalog.js";

function catalogPublicationContent(catalog: ModelCatalogSnapshot) {
  const { pendingProviders: _pending, refreshFailed: _failed, ...inventory } = catalog;
  // Scoped merges move providers, not their model preference order. Compare a grouped view
  // without changing the published order used by model-selection fallbacks.
  const byProvider = <T extends { provider: string }>(rows: readonly T[] = []) =>
    rows.toSorted((left, right) => left.provider.localeCompare(right.provider));
  const byRuntime = <T extends { provider: string }>(
    scopes: Readonly<Record<string, readonly T[]>> | undefined,
  ) =>
    scopes &&
    Object.fromEntries(
      Object.entries(scopes).map(([runtime, rows]) => [runtime, byProvider(rows)]),
    );
  const auth = getPreparedModelFullCatalogAuth(catalog);
  return {
    ...inventory,
    entries: byProvider(catalog.entries),
    routeVariants: byProvider(catalog.routeVariants),
    staticEntries: byProvider(catalog.staticEntries),
    providerOutcomes: byProvider(catalog.providerOutcomes),
    acceptedDiscoveryOrigins: catalog.acceptedDiscoveryOrigins?.toSorted(
      (left, right) =>
        left.provider.localeCompare(right.provider) ||
        (left.profileId ?? "").localeCompare(right.profileId ?? ""),
    ),
    nativeProviderOutcomes: byRuntime(catalog.nativeProviderOutcomes),
    nativeHostRows: byRuntime(catalog.nativeHostRows),
    authoritative: catalog.authoritative !== false,
    full: isPreparedModelCatalogFull(catalog),
    // Workers can observe auth changes before the parent gets a store publication.
    auth: auth && {
      modes: auth.authModes,
      labels: auth.providerAuthLabels,
      metadata: runtimeAuthMetadataState(auth.authStore),
    },
  };
}

/** Keep inventory identity stable across renewals while adopting the latest private auth. */
export function retainPreparedModelCatalogPublication(
  catalog: ModelCatalogSnapshot | undefined,
  previous: ModelCatalogSnapshot | undefined,
): ModelCatalogSnapshot | undefined {
  if (
    !catalog ||
    !previous ||
    !isDeepStrictEqual(catalogPublicationContent(catalog), catalogPublicationContent(previous))
  ) {
    return catalog;
  }
  copyPreparedModelFullCatalogAuth(catalog, previous);
  return previous;
}
