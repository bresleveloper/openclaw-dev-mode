import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { p as resolveSecretInputRef, u as normalizeSecretInputString } from "./types.secrets-B5xWSzLp.mjs";
//#region src/gateway/auth-token-source-conflict.ts
const GATEWAY_ENV_TOKEN = "OPENCLAW_GATEWAY_TOKEN";
const GATEWAY_SERVICE_KIND = "gateway";
/** Returns a warning when env token precedence can diverge from configured gateway auth. */
function resolveGatewayAuthTokenSourceConflict(params) {
	const envToken = normalizeOptionalString(params.env.OPENCLAW_GATEWAY_TOKEN);
	if (!envToken) return null;
	if (params.env.OPENCLAW_SERVICE_KIND?.trim() === GATEWAY_SERVICE_KIND) return null;
	if (params.cfg.gateway?.mode === "remote") return null;
	const authMode = params.cfg.gateway?.auth?.mode;
	if (authMode === "password" || authMode === "none" || authMode === "trusted-proxy") return null;
	const tokenInput = params.cfg.gateway?.auth?.token;
	const { ref } = resolveSecretInputRef({
		value: tokenInput,
		defaults: params.cfg.secrets?.defaults
	});
	if (ref?.source === "env" && ref.id === GATEWAY_ENV_TOKEN) return null;
	const configToken = ref ? void 0 : normalizeSecretInputString(tokenInput);
	if (!ref && !configToken) return null;
	if (configToken === envToken) return null;
	const title = `${GATEWAY_ENV_TOKEN} conflicts with gateway.auth.token`;
	const detail = `${GATEWAY_ENV_TOKEN} is set while gateway.auth.token uses a different configured source. Configured local Gateway clients and the managed gateway service prefer gateway.auth.token. Environment credentials remain active for explicit environment URL and node-host targets, so a stale value can still authenticate against the wrong target.`;
	const remediation = `Remove ${GATEWAY_ENV_TOKEN} from the shell, ~/.openclaw/.env, or launchctl env if gateway.auth.token is intended, or point gateway.auth.token at \${${GATEWAY_ENV_TOKEN}} if the env var should be canonical.`;
	return {
		checkId: "gateway.env_token_overrides_config",
		severity: "warn",
		title,
		detail,
		remediation,
		diagnostic: `${title}: ${remediation}`
	};
}
//#endregion
export { resolveGatewayAuthTokenSourceConflict as t };
