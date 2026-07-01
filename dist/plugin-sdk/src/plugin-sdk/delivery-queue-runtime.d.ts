import { drainPendingDeliveries as coreDrainPendingDeliveries, type DeliverFn } from "../infra/outbound/delivery-queue.js";
type DrainPendingDeliveriesOptions = Omit<Parameters<typeof coreDrainPendingDeliveries>[0], "deliver"> & {
    /** Optional delivery implementation for tests or plugin-owned send paths. */
    deliver?: DeliverFn;
};
/**
 * Drain queued outbound payloads after a channel reconnect or transport recovery.
 * When no deliver function is provided, the heavy outbound delivery runtime is
 * loaded lazily so importing this SDK subpath does not eagerly bind send internals.
 */
export declare function drainPendingDeliveries(opts: DrainPendingDeliveriesOptions): Promise<void>;
export {};
