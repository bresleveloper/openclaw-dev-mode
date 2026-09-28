import { n as sha256Base64Url } from "./crypto-digest-D9Nqq3c7.mjs";
//#region src/gateway/server/ws-shared-generation.ts
function resolveSharedGatewaySessionGeneration(auth, trustedProxies) {
	const secret = auth.mode === "token" || auth.mode === "password" ? auth[auth.mode] : void 0;
	if (typeof secret === "string" && secret.trim().length > 0) return sha256Base64Url(`${auth.mode}\u0000${secret}`);
	if (auth.mode === "trusted-proxy") return sha256Base64Url(JSON.stringify({
		mode: auth.mode,
		trustedProxy: {
			userHeader: auth.trustedProxy?.userHeader,
			requiredHeaders: [...auth.trustedProxy?.requiredHeaders ?? []].toSorted(),
			allowUsers: [...auth.trustedProxy?.allowUsers ?? []].toSorted(),
			allowLoopback: auth.trustedProxy?.allowLoopback
		},
		trustedProxies: [...trustedProxies ?? []].toSorted()
	}));
}
//#endregion
export { resolveSharedGatewaySessionGeneration as t };
