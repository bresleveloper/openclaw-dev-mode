import { resolveAwsSdkEnvVarName } from "openclaw/plugin-sdk/provider-auth-runtime";
//#region extensions/amazon-bedrock/discovery-shared.ts
/**
* Shared Amazon Bedrock discovery helpers used by plugin runtime and config
* consumers without pulling in the AWS discovery implementation.
*/
/** Resolve the config auth marker that tells OpenClaw to use AWS SDK credentials. */
function resolveBedrockConfigApiKey(env = process.env) {
	return resolveAwsSdkEnvVarName(env);
}
/** Merge an implicit Bedrock provider catalog with any explicit user config. */
function mergeImplicitBedrockProvider(params) {
	const { existing, implicit } = params;
	if (!existing) return implicit;
	return {
		...implicit,
		...existing,
		models: Array.isArray(existing.models) && existing.models.length > 0 ? existing.models : implicit.models
	};
}
//#endregion
export { mergeImplicitBedrockProvider, resolveBedrockConfigApiKey };
