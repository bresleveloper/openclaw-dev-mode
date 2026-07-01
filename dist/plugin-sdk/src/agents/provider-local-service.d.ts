/**
 * Manages optional local provider sidecar processes attached to models. Leases
 * keep shared services alive while requests run and stop them after idle.
 */
import { type ChildProcess } from "node:child_process";
import type { ModelProviderLocalServiceConfig } from "../config/types.models.js";
import type { Model } from "../llm/types.js";
/** Lease returned for a started or already-running local provider service. */
export type ProviderLocalServiceLease = {
    release: () => void;
};
/** Attach local-service startup metadata to a model without mutating the original object. */
export declare function attachModelProviderLocalService<TModel extends object>(model: TModel, service: ModelProviderLocalServiceConfig | undefined): TModel;
/** Read local-service startup metadata attached to a model. */
export declare function getModelProviderLocalService(model: object): ModelProviderLocalServiceConfig | undefined;
/** Ensure a model's local provider service is healthy and return a lease. */
export declare function ensureModelProviderLocalService(model: Model, probeHeaders?: HeadersInit, signal?: AbortSignal | null): Promise<ProviderLocalServiceLease | undefined>;
/** Stop all managed local services and clear process state for tests. */
export declare function stopManagedProviderLocalServicesForTest(): void;
/** Return whether a child process has already reported an exit code or signal. */
export declare function hasLocalServiceProcessExited(child: Pick<ChildProcess, "exitCode" | "signalCode">): boolean;
