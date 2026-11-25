import { c as parseStrictPositiveInteger, o as floorPositiveFiniteNumber } from "./number-coercion-BO6bhGm6.mjs";
// packages/ai/src/transports/positive-integer.ts
function parsePositiveInteger(value) {
	return typeof value === "string" ? parseStrictPositiveInteger(value) : floorPositiveFiniteNumber(value);
}
export { parsePositiveInteger as t };
