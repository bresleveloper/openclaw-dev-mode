import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { r as defaultRuntime } from "./runtime-DlO3PTAd.mjs";
import { t as readSecretFromFile } from "./secret-file-CbewS3sM.mjs";
//#region src/cli/gateway-secret-options.ts
function resolveGatewaySecretOption(directValue, fileValue, kind) {
	const direct = normalizeOptionalString(directValue);
	const file = normalizeOptionalString(fileValue);
	if (direct && file) throw new Error(`Use either --${kind} or --${kind}-file for Gateway ${kind}.`);
	return file ? readSecretFromFile(file, `Gateway ${kind}`) : direct;
}
function warnGatewaySecretCliFlag(flag) {
	defaultRuntime.error(`Warning: ${flag} can be exposed via process listings. Prefer ${flag}-file or environment variables.`);
}
function resolveGatewayAuthOptions(opts) {
	const gatewayToken = resolveGatewaySecretOption(opts.token, opts.tokenFile, "token");
	const gatewayPassword = resolveGatewaySecretOption(opts.password, opts.passwordFile, "password");
	if (opts.token) warnGatewaySecretCliFlag("--token");
	if (opts.password) warnGatewaySecretCliFlag("--password");
	return {
		gatewayToken,
		gatewayPassword
	};
}
//#endregion
export { resolveGatewayAuthOptions as t };
