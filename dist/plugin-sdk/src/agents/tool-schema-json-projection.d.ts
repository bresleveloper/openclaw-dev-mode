/** JSON-safe schema value used when projecting runtime tool parameters. */
export type RuntimeToolInputSchemaJson = null | boolean | number | string | RuntimeToolInputSchemaJson[] | {
    [key: string]: RuntimeToolInputSchemaJson;
};
/** Projected runtime tool schema plus validation violations. */
export type RuntimeToolInputSchemaProjection = {
    readonly schema: RuntimeToolInputSchemaJson;
    readonly violations: readonly string[];
};
/** Projects one runtime tool input schema to JSON and reports runtime incompatibilities. */
export declare function projectRuntimeToolInputSchema(schema: unknown, path?: string): RuntimeToolInputSchemaProjection;
