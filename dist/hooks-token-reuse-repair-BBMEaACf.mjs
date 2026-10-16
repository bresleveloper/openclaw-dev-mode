import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { r as resolveGatewayAuth } from "./auth-resolve-BmUDP1m_.mjs";
import { t as randomToken } from "./random-token-Sl4a6KEQ.mjs";
import { r as materializeGatewayAuthSecretRefs, t as canMaterializeGatewayAuthSecretRefsWithoutExec } from "./auth-config-utils-BzcyvaQI.mjs";
import "./auth-DS7WgSf9.mjs";
//#region src/commands/doctor/shared/hooks-token-reuse-repair.ts
function activeGatewaySharedSecret(auth) {
	if (auth.mode === "token") return normalizeOptionalString(auth.token) ?? "";
	if (auth.mode === "password" || auth.mode === "trusted-proxy") return normalizeOptionalString(auth.password) ?? "";
	return "";
}
async function materializeDoctorGatewayAuthRefs(cfg, env) {
	const materializeParams = {
		cfg,
		env,
		mode: cfg.gateway?.auth?.mode,
		hasTokenOverride: false,
		hasPasswordOverride: false,
		hasTokenFallback: Boolean(normalizeOptionalString(env.OPENCLAW_GATEWAY_TOKEN)),
		hasPasswordFallback: Boolean(normalizeOptionalString(env.OPENCLAW_GATEWAY_PASSWORD))
	};
	if (!canMaterializeGatewayAuthSecretRefsWithoutExec(materializeParams)) return cfg;
	try {
		return await materializeGatewayAuthSecretRefs(materializeParams);
	} catch {
		return cfg;
	}
}
/** Rotate hooks.token when it matches the active Gateway token/password shared secret. */
async function repairHooksTokenReuseGatewayAuth(cfg, env = process.env, createToken = randomToken) {
	const hooksToken = normalizeOptionalString(cfg.hooks?.token) ?? "";
	if (cfg.hooks?.enabled !== true || !hooksToken) return {
		config: cfg,
		changes: []
	};
	const materializedCfg = await materializeDoctorGatewayAuthRefs(cfg, env);
	if (hooksToken !== activeGatewaySharedSecret(resolveGatewayAuth({
		authConfig: materializedCfg.gateway?.auth,
		tailscaleMode: materializedCfg.gateway?.tailscale?.mode ?? "off",
		env
	}))) return {
		config: cfg,
		changes: []
	};
	const nextHooksToken = createToken();
	return {
		config: {
			...cfg,
			hooks: {
				...cfg.hooks,
				token: nextHooksToken
			}
		},
		changes: ["Rotated hooks.token because it reused active Gateway shared-secret auth. Update external hook senders to use the new hooks.token."]
	};
}
//#endregion
export { repairHooksTokenReuseGatewayAuth };
