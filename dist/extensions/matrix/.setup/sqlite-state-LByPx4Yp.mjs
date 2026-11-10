import { t as getMatrixRuntime } from "./runtime-1kn1P6io.mjs";
import os from "node:os";
//#region extensions/matrix/src/matrix/sqlite-state.ts
function resolveStateDirOverride(options) {
	if (!options) return;
	return options.stateDir || options.stateRootDir || getMatrixRuntime().state.resolveStateDir(options.env ?? process.env, os.homedir);
}
function resolveMatrixSqliteStateKey(options) {
	return resolveStateDirOverride(options) ?? "";
}
function resolveMatrixSqliteStateEnv(options) {
	const stateDir = resolveStateDirOverride(options);
	if (!stateDir) return options?.env;
	return {
		...options?.env ?? process.env,
		OPENCLAW_STATE_DIR: stateDir
	};
}
async function updateMatrixKeyedState(store, key, update, onUndefined = "keep") {
	let observation = await store.observe(key);
	for (;;) {
		const value = update(observation.value);
		if (value === void 0 && onUndefined === "skip") return false;
		const result = await store.compareAndApply(key, observation.comparison, value === void 0 ? {
			operation: "update",
			action: "keep"
		} : {
			operation: "update",
			action: "set",
			value
		});
		if (result.status !== "conflict") return true;
		observation = result.current;
	}
}
//#endregion
export { resolveMatrixSqliteStateKey as n, updateMatrixKeyedState as r, resolveMatrixSqliteStateEnv as t };
