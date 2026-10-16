import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { moduleResolve } from "import-meta-resolve";
//#region src/plugins/jiti-factory.ts
let factory;
/** Keep Babel's lazy require inside Jiti's CJS module, where native resolver hooks retain its parent. */
const createJiti = (...args) => {
	if (!factory) {
		const entry = moduleResolve("jiti", new URL(import.meta.url), /* @__PURE__ */ new Set(["node", "require"]));
		factory = createRequire(import.meta.url)(fileURLToPath(entry)).createJiti;
	}
	return factory(...args);
};
//#endregion
export { createJiti as t };
