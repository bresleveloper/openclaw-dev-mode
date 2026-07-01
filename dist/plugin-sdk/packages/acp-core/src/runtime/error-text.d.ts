import { type AcpRuntimeErrorCode, AcpRuntimeError } from "./errors.js";
/** Formats ACP runtime errors with the operator next-step hint attached when known. */
export declare function formatAcpRuntimeErrorText(error: AcpRuntimeError): string;
/** Normalizes unknown failures into ACP runtime error text for user-facing surfaces. */
export declare function toAcpRuntimeErrorText(params: {
    error: unknown;
    fallbackCode: AcpRuntimeErrorCode;
    fallbackMessage: string;
}): string;
