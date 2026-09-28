import { i as copyConfigResolutionFactsExcept } from "./resolution-facts-CSuKIPux.mjs";
//#region src/gateway/secret-input-paths.ts
/** Stable scan order for Gateway secret-ref credential selection. */
const ALL_GATEWAY_SECRET_INPUT_PATHS = [
	"gateway.auth.token",
	"gateway.auth.password",
	"gateway.remote.token",
	"gateway.remote.password"
];
/** Narrow an arbitrary error/config path to one of the supported Gateway secret inputs. */
function isSupportedGatewaySecretInputPath(path) {
	return ALL_GATEWAY_SECRET_INPUT_PATHS.includes(path);
}
/** Read a Gateway secret input without assuming whether it is plaintext, a ref, or absent. */
function readGatewaySecretInputValue(config, path) {
	if (path === "gateway.auth.token") return config.gateway?.auth?.token;
	if (path === "gateway.auth.password") return config.gateway?.auth?.password;
	if (path === "gateway.remote.token") return config.gateway?.remote?.token;
	return config.gateway?.remote?.password;
}
/** Replace one Gateway secret input and consume its pending authored provenance atomically. */
function assignResolvedGatewaySecretInput(params) {
	const { config, path, value } = params;
	let assigned = false;
	if (path === "gateway.auth.token") {
		if (config.gateway?.auth) {
			config.gateway.auth.token = value;
			assigned = true;
		}
	} else if (path === "gateway.auth.password") {
		if (config.gateway?.auth) {
			config.gateway.auth.password = value;
			assigned = true;
		}
	} else if (path === "gateway.remote.token") {
		if (config.gateway?.remote) {
			config.gateway.remote.token = value;
			assigned = true;
		}
	} else if (config.gateway?.remote) {
		config.gateway.remote.password = value;
		assigned = true;
	}
	if (assigned) copyConfigResolutionFactsExcept(config, config, [path]);
}
/** Distinguish token paths from password paths for auth-mode precedence checks. */
function isTokenGatewaySecretInputPath(path) {
	return path === "gateway.auth.token" || path === "gateway.remote.token";
}
//#endregion
export { readGatewaySecretInputValue as a, isTokenGatewaySecretInputPath as i, assignResolvedGatewaySecretInput as n, isSupportedGatewaySecretInputPath as r, ALL_GATEWAY_SECRET_INPUT_PATHS as t };
