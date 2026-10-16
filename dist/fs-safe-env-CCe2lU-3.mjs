//#region src/infra/fs-safe-env.ts
const nativeModeKey = "OPENCLAW_FS_SAFE_NATIVE_MODE";
const legacyModeKeys = ["FS_SAFE_PYTHON_MODE", "OPENCLAW_FS_SAFE_PYTHON_MODE"];
const legacyKeys = [
	...legacyModeKeys,
	"FS_SAFE_PYTHON",
	"OPENCLAW_FS_SAFE_PYTHON",
	"OPENCLAW_PINNED_PYTHON",
	"OPENCLAW_PINNED_WRITE_PYTHON"
];
const fallbacks = /* @__PURE__ */ new WeakMap();
let warned = false;
function nativeModeIsValid(value) {
	const normalized = value?.trim().toLowerCase() ?? "";
	return /^(?:0|false|off|never|1|true|on|auto|required|require)$/u.test(normalized);
}
function currentFallback(env) {
	const fallback = fallbacks.get(env);
	return fallback && env[fallback.key] === fallback.value ? fallback : void 0;
}
/** Read the operator/config inputs without promoting a derived native fallback. */
function fsSafeEnvInput(env) {
	const fallback = currentFallback(env);
	if (!fallback) return env;
	const input = { ...env };
	if (!fallback.existed) delete input[fallback.key];
	else input[fallback.key] = fallback.previous;
	return input;
}
/** Retire our unchanged projection before an environment owner writes real inputs. */
function clearFsSafeEnvFallback(env) {
	const fallback = currentFallback(env);
	fallbacks.delete(env);
	if (!fallback) return;
	if (!fallback.existed) delete env[fallback.key];
	else env[fallback.key] = fallback.previous;
}
/** Preserve OpenClaw's retired Python mode env contract below both native names. */
function normalizeFsSafeNativeEnv(env = process.env) {
	clearFsSafeEnvFallback(env);
	const configured = legacyKeys.filter((key) => env[key] !== void 0);
	if (configured.length && env === process.env && !warned) {
		warned = true;
		process.emitWarning(`${configured.join(", ")} is deprecated. OpenClaw maps legacy mode values to native mode only when neither FS_SAFE_NATIVE_MODE nor OPENCLAW_FS_SAFE_NATIVE_MODE selects a mode. Replace Python mode variables with native mode variables; interpreter path settings are ignored.`, {
			code: "FS_SAFE_PYTHON_DEPRECATED",
			type: "DeprecationWarning"
		});
	}
	if (nativeModeIsValid(env.FS_SAFE_NATIVE_MODE) || nativeModeIsValid(env[nativeModeKey])) return;
	const value = legacyModeKeys.map((key) => env[key]).find((entry) => entry !== void 0);
	if (value === void 0) return;
	const keys = Object.keys(env);
	const key = !keys.includes(nativeModeKey) && Object.hasOwn(env, nativeModeKey) ? keys.find((candidate) => candidate.toUpperCase() === nativeModeKey) ?? nativeModeKey : nativeModeKey;
	const existed = Object.hasOwn(env, key);
	const previous = env[key];
	env[key] = value;
	fallbacks.set(env, {
		key,
		value,
		previous,
		existed
	});
}
//#endregion
export { fsSafeEnvInput as n, normalizeFsSafeNativeEnv as r, clearFsSafeEnvFallback as t };
