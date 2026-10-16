//#region extensions/amazon-bedrock/aws-credential-refresh.ts
/** Keep shared-file refresh on the chain that actually signs the Bedrock request. */
function bedrockCredentialDefaultProvider(init) {
	let provider;
	return async (...args) => {
		const { defaultProvider } = await import("@aws-sdk/credential-provider-node");
		provider ??= defaultProvider({
			...init,
			ignoreCache: true
		});
		return provider(...args);
	};
}
/** Preserve explicit proxy and bearer authentication ahead of the default AWS chain. */
function resolveBedrockRuntimeAuth(bearerToken) {
	const config = { credentialDefaultProvider: bedrockCredentialDefaultProvider };
	if (process.env.AWS_BEDROCK_SKIP_AUTH === "1") {
		if (process.versions?.node || process.versions?.bun) config.credentials = {
			accessKeyId: "dummy-access-key",
			secretAccessKey: "dummy-secret-key"
		};
	} else {
		const token = bearerToken || process.env.AWS_BEARER_TOKEN_BEDROCK || void 0;
		if (token !== void 0) {
			config.token = { token };
			config.authSchemePreference = ["httpBearerAuth"];
		}
	}
	return config;
}
//#endregion
export { bedrockCredentialDefaultProvider, resolveBedrockRuntimeAuth };
