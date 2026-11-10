import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { r as resolveGatewayAuth } from "./auth-resolve-BLx2Z8Ad.mjs";
import "./auth-fv7y-hds.mjs";
import { r as materializeGatewayAuthSecretRefs, t as canMaterializeGatewayAuthSecretRefsWithoutExec } from "./auth-config-utils-BW1BkpUK.mjs";
import { t as randomToken } from "./random-token-Sl4a6KEQ.mjs";
//#region src/commands/doctor/shared/hooks-token-reuse-repair.ts
/** Rotate hooks.token when it matches the active Gateway token/password shared secret. */
async function repairHooksTokenReuseGatewayAuth(cfg, env = process.env, createToken = randomToken) {
	const hooksToken = normalizeOptionalString(cfg.hooks?.token) ?? "";
	if (cfg.hooks?.enabled !== true || !hooksToken) return {
		config: cfg,
		changes: []
	};
	const materializeParams = {
		cfg,
		env,
		mode: cfg.gateway?.auth?.mode,
		hasTokenOverride: false,
		hasPasswordOverride: false,
		hasTokenFallback: Boolean(normalizeOptionalString(env.OPENCLAW_GATEWAY_TOKEN)),
		hasPasswordFallback: Boolean(normalizeOptionalString(env.OPENCLAW_GATEWAY_PASSWORD))
	};
	const materializedCfg = await (canMaterializeGatewayAuthSecretRefsWithoutExec(materializeParams) ? materializeGatewayAuthSecretRefs(materializeParams).catch(() => cfg) : cfg);
	const auth = resolveGatewayAuth({
		authConfig: materializedCfg.gateway?.auth,
		tailscaleMode: materializedCfg.gateway?.tailscale?.mode ?? "off",
		env
	});
	const sharedSecret = auth.mode === "token" ? auth.token : auth.mode === "password" || auth.mode === "trusted-proxy" ? auth.password : void 0;
	if (hooksToken !== (normalizeOptionalString(sharedSecret) ?? "")) return {
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
