import type { ValidationError } from "../../../packages/gateway-protocol/src/index.js";
export { safeParseJson } from "../server-json.js";
import type { RespondFn } from "./types.js";
/**
 * Shared response adapters for node-related gateway methods.
 */
type ValidatorFn = ((value: unknown) => boolean) & {
    errors?: ValidationError[] | null;
};
/** Responds with the protocol validation error for invalid method params. */
export declare function respondInvalidParams(params: {
    respond: RespondFn;
    method: string;
    validator: ValidatorFn;
}): void;
/** Converts thrown node-handler failures into `UNAVAILABLE` protocol errors. */
export declare function respondUnavailableOnThrow(respond: RespondFn, fn: () => Promise<void>): Promise<void>;
/** Narrows successful node invoke results or responds with the node error details. */
export declare function respondUnavailableOnNodeInvokeError<T extends {
    ok: boolean;
    error?: unknown;
}>(respond: RespondFn, res: T): res is T & {
    ok: true;
};
