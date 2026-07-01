/**
 * Channel message capability derivation.
 *
 * Computes durable-final delivery requirements from a concrete outbound payload.
 */
import type { DeriveDurableFinalDeliveryRequirementsParams, DurableFinalDeliveryRequirementMap } from "./types.js";
/** Derives the adapter capabilities core needs before it can require durable final delivery. */
export declare function deriveDurableFinalDeliveryRequirements(params: DeriveDurableFinalDeliveryRequirementsParams): DurableFinalDeliveryRequirementMap;
