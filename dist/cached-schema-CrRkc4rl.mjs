import { t as pruneMapToMaxSize } from "./map-size-BlrH_CnE.mjs";
import { Clone } from "typebox/value";
//#region src/agents/schema/cached-schema.ts
/** Retain factory-owned schema variants, never the tool's execution or authority. */
function createCachedToolSchema(options) {
	const schemas = /* @__PURE__ */ new Map();
	return (inputs) => {
		const key = options.key(inputs);
		const cached = schemas.get(key);
		if (cached) return cached;
		const schema = Clone(options.build(inputs));
		const pending = [schema];
		while (pending.length > 0) {
			const value = pending.pop();
			if (value && typeof value === "object" && !Object.isFrozen(value)) {
				pending.push(...Object.values(value));
				Object.freeze(value);
			}
		}
		schemas.set(key, schema);
		pruneMapToMaxSize(schemas, 64);
		return schema;
	};
}
//#endregion
export { createCachedToolSchema as t };
