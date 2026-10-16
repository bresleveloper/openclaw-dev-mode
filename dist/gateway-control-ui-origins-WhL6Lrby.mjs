import { n as DEFAULT_GATEWAY_PORT } from "./paths-DGIwWbpu.mjs";
import { t as resolveGatewayPublicOrigin } from "./gateway-public-origin-BcHLka2A.mjs";
//#region src/config/gateway-control-ui-origins.ts
/** An authored list overrides the advertised origin, including an empty list. */
function resolveControlUiAllowedOrigins(config) {
	const configured = config?.gateway?.controlUi?.allowedOrigins;
	if (configured !== void 0) return configured;
	const origin = resolveGatewayPublicOrigin(config);
	return origin ? [origin] : [];
}
/** Narrows arbitrary config/runtime bind values to non-loopback bind modes. */
function isGatewayNonLoopbackBindMode(bind) {
	return bind === "lan" || bind === "tailnet" || bind === "custom" || bind === "auto";
}
/** Returns whether Control UI origin config is already explicit enough for non-loopback binds. */
function hasConfiguredControlUiAllowedOrigins(params) {
	if (params.dangerouslyAllowHostHeaderOriginFallback === true) return true;
	const allowedOrigins = params.allowedOrigins === void 0 && typeof params.publicOrigin === "string" ? resolveControlUiAllowedOrigins({ gateway: { publicOrigin: params.publicOrigin } }) : params.allowedOrigins;
	return Array.isArray(allowedOrigins) && allowedOrigins.some((origin) => typeof origin === "string" && origin.trim().length > 0);
}
/** Resolves the gateway port used when constructing default Control UI origins. */
function resolveGatewayPortWithDefault(port, fallback = DEFAULT_GATEWAY_PORT) {
	return typeof port === "number" && port > 0 ? port : fallback;
}
/** Builds loopback plus custom-bind Control UI origins for a resolved gateway port. */
function buildDefaultControlUiAllowedOrigins(params) {
	const origins = /* @__PURE__ */ new Set([`http://localhost:${params.port}`, `http://127.0.0.1:${params.port}`]);
	const customBindHost = params.customBindHost?.trim();
	if (params.bind === "custom" && customBindHost) origins.add(`http://${customBindHost}:${params.port}`);
	return [...origins];
}
/** Seeds safe default Control UI origins before non-loopback gateway startup validation. */
function ensureControlUiAllowedOriginsForNonLoopbackBind(config, opts) {
	const effectiveBind = opts?.runtimeBind ?? config.gateway?.bind ?? (opts?.isContainerEnvironment?.() ? "auto" : void 0);
	if (!isGatewayNonLoopbackBindMode(effectiveBind)) return {
		config,
		seededOrigins: null,
		bind: null
	};
	if (opts?.requireControlUiEnabled && config.gateway?.controlUi?.enabled === false) return {
		config,
		seededOrigins: null,
		bind: effectiveBind
	};
	if (hasConfiguredControlUiAllowedOrigins({
		allowedOrigins: config.gateway?.controlUi?.allowedOrigins,
		publicOrigin: config.gateway?.publicOrigin,
		dangerouslyAllowHostHeaderOriginFallback: config.gateway?.controlUi?.dangerouslyAllowHostHeaderOriginFallback
	})) return {
		config,
		seededOrigins: null,
		bind: effectiveBind
	};
	const seededOrigins = buildDefaultControlUiAllowedOrigins({
		port: resolveGatewayPortWithDefault(opts?.runtimePort ?? config.gateway?.port, opts?.defaultPort),
		bind: effectiveBind,
		customBindHost: config.gateway?.customBindHost
	});
	return {
		config: {
			...config,
			gateway: {
				...config.gateway,
				controlUi: {
					...config.gateway?.controlUi,
					allowedOrigins: seededOrigins
				}
			}
		},
		seededOrigins,
		bind: effectiveBind
	};
}
//#endregion
export { resolveControlUiAllowedOrigins as a, isGatewayNonLoopbackBindMode as i, ensureControlUiAllowedOriginsForNonLoopbackBind as n, resolveGatewayPortWithDefault as o, hasConfiguredControlUiAllowedOrigins as r, buildDefaultControlUiAllowedOrigins as t };
