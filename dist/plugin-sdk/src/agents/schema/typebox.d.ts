/**
 * Shared TypeBox schema helpers for agent tools.
 *
 * Tool definitions use these helpers for channel targets and common optional
 * numeric fields so provider-facing schemas stay consistent.
 */
import { Type } from "typebox";
export { optionalStringEnum, stringEnum } from "./string-enum.js";
/** Builds a schema for one outbound channel target. */
export declare function channelTargetSchema(options?: {
    description?: string;
}): Type.TString;
/** Builds a schema for multiple outbound channel targets. */
export declare function channelTargetsSchema(options?: {
    description?: string;
}): Type.TArray<Type.TString>;
type IntegerSchemaOptions = {
    description?: string;
    maximum?: number;
};
type NumberSchemaOptions = {
    description?: string;
    deprecated?: boolean;
    minimum?: number;
    maximum?: number;
    exclusiveMinimum?: number;
    exclusiveMaximum?: number;
};
/** Builds an optional finite number schema with caller-provided metadata. */
export declare function optionalFiniteNumberSchema(options?: NumberSchemaOptions): Type.TOptional<Type.TNumber>;
/** Builds an optional positive integer schema. */
export declare function optionalPositiveIntegerSchema(options?: IntegerSchemaOptions): Type.TOptional<Type.TInteger>;
/** Builds an optional non-negative integer schema. */
export declare function optionalNonNegativeIntegerSchema(options?: IntegerSchemaOptions): Type.TOptional<Type.TInteger>;
