export { asFiniteNumber as asNumber } from "../../packages/normalization-core/src/number-coercion.js";
import { readStringValue } from "../../packages/normalization-core/src/string-coerce.js";
export { asRecord } from "../../packages/normalization-core/src/record-coerce.js";
export { asBoolean } from "../utils/boolean.js";
export declare const asString: typeof readStringValue;
export declare function resolveTempPathParts(opts: {
    ext: string;
    tmpDir?: string;
    id?: string;
}): {
    ext: string;
    tmpDir: string;
    id: string;
};
