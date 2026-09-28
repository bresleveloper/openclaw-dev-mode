import { s as isBuiltInDefaultSecretProviderRef } from "./ref-contract-BVi3ykLT.mjs";
//#region src/plugin-sdk/secret-ref-readonly.internal.ts
/** Checks env provider selection and allowlists without resolving a credential. */
function canResolveEnvSecretRefInReadOnlyPath(params) {
	const providerConfig = params.cfg?.secrets?.providers?.[params.provider];
	if (providerConfig?.source === "env") {
		const allowlist = providerConfig.allowlist;
		return !allowlist || allowlist.includes(params.id);
	}
	return isBuiltInDefaultSecretProviderRef(params.cfg ?? {}, {
		source: "env",
		provider: params.provider,
		id: params.id
	});
}
//#endregion
export { canResolveEnvSecretRefInReadOnlyPath as t };
