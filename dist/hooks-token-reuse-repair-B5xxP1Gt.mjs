import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { n as resolveGatewayAuth } from "./auth-resolve-BeCTtDNQ.mjs";
import "./auth-CRxiLJL8.mjs";
import { t as randomToken } from "./random-token-B1woZa_H.mjs";
import { r as materializeGatewayAuthSecretRefs, t as canMaterializeGatewayAuthSecretRefsWithoutExec } from "./auth-config-utils-Dhjw7M6e.mjs";
//#region src/commands/doctor/shared/hooks-token-reuse-repair.ts
function activeGatewaySharedSecret(auth) {
	if (auth.mode === "token") return normalizeOptionalString(auth.token) ?? "";
	if (auth.mode === "password" || auth.mode === "trusted-proxy") return normalizeOptionalString(auth.password) ?? "";
	return "";
}
/** Rotate hooks.token when it matches the active Gateway token/password shared secret. */
function repairHooksTokenReuseGatewayAuth(cfg, env = process.env, createToken = randomToken) {
	return repairHooksTokenReuseGatewayAuthAfterMaterializingRefs(cfg, env, createToken);
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
async function repairHooksTokenReuseGatewayAuthAfterMaterializingRefs(cfg, env, createToken) {
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
