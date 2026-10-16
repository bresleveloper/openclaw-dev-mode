//#region src/plugin-sdk/boolean-param.d.ts
/** Read boolean or string params from exact or snake_case tool-input keys. */
export declare function readBooleanParam(params: Record<string, unknown>, key: string): boolean | undefined;
//#endregion