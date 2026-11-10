import { _ as LLAMA_CPP_PROVIDER_ID } from "./defaults-DX4XN2j1.mjs";
//#region extensions/llama-cpp/src/auth-config.ts
const LLAMA_CPP_DEFAULT_PROFILE_ID = `${LLAMA_CPP_PROVIDER_ID}:default`;
function buildLlamaCppAuthProfileRemovalPatch(config) {
	const profileExists = Boolean(config.auth?.profiles?.[LLAMA_CPP_DEFAULT_PROFILE_ID]);
	const referencedOrders = Object.entries(config.auth?.order ?? {}).filter(([, ids]) => ids.includes(LLAMA_CPP_DEFAULT_PROFILE_ID));
	if (!profileExists && referencedOrders.length === 0) return {};
	const authPatch = {};
	if (profileExists) Reflect.set(authPatch, "profiles", { [LLAMA_CPP_DEFAULT_PROFILE_ID]: void 0 });
	if (referencedOrders.length > 0) Reflect.set(authPatch, "order", Object.fromEntries(referencedOrders.map(([providerId, ids]) => {
		const next = ids.filter((id) => id !== LLAMA_CPP_DEFAULT_PROFILE_ID);
		return [providerId, next.length > 0 ? next : void 0];
	})));
	return { auth: authPatch };
}
//#endregion
export { buildLlamaCppAuthProfileRemovalPatch as n, LLAMA_CPP_DEFAULT_PROFILE_ID as t };
