import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { d as pathExists } from "./fs-safe-BAPek8At.mjs";
import { n as resolvePreferredOpenClawTmpDir } from "./tmp-openclaw-dir-BSb3HetY.mjs";
import "./string-coerce-runtime-C_MKhRVt.mjs";
import { t as createPluginSecretRefSetupCli } from "./secret-ref-runtime-B0T63SP-.mjs";
import "./security-runtime-HdPo6iAV.mjs";
import "./temp-path-PENdksor.mjs";
import { t as parseVaultSecretId } from "./vault-secret-id-r3Pg3gBq.mjs";
import { fileURLToPath } from "node:url";
import path from "node:path";
//#region extensions/vault/src/cli.ts
const VAULT_PROVIDER_ALIAS = "vault";
function normalizeVaultSecretId(label, value) {
	try {
		parseVaultSecretId(value);
		return value;
	} catch {
		throw new Error(`Invalid ${label} Vault secret id: ${value}`);
	}
}
const vaultSecretRefSetupCli = createPluginSecretRefSetupCli({
	productName: "Vault",
	secretIdLabel: "Vault secret id",
	secretIdPlaceholder: "vault-secret-id",
	defaultProviderAlias: VAULT_PROVIDER_ALIAS,
	pluginIntegration: {
		pluginId: "vault",
		integrationId: "vault"
	},
	normalizeSecretId: normalizeVaultSecretId,
	defaultPlanPath: () => path.join(resolvePreferredOpenClawTmpDir(), `openclaw-vault-secrets-${process.pid}.json`)
});
function writeLine(message = "") {
	process.stdout.write(`${message}\n`);
}
function writeJson(value) {
	process.stdout.write(`${JSON.stringify(value, null, 2)}\n`);
}
function resolverScriptPathCandidates(baseUrl) {
	return [fileURLToPath(new URL("../vault-secret-ref-resolver.js", baseUrl)), fileURLToPath(new URL("./extensions/vault/vault-secret-ref-resolver.js", baseUrl))];
}
async function resolveResolverScriptPath(baseUrl = import.meta.url, exists = pathExists) {
	const candidates = resolverScriptPathCandidates(baseUrl);
	for (const candidate of candidates) if (await exists(candidate)) return candidate;
	return candidates[0];
}
async function runStatus(config, options) {
	const { providerAlias, provider } = vaultSecretRefSetupCli.inspectProvider(config, options.providerAlias);
	const authMethod = normalizeOptionalString(process.env.OPENCLAW_VAULT_AUTH_METHOD) ?? "token";
	const result = {
		providerAlias,
		provider,
		resolverScript: await resolveResolverScriptPath(),
		vaultAddr: normalizeOptionalString(process.env.VAULT_ADDR),
		authMethod,
		authMount: normalizeOptionalString(process.env.OPENCLAW_VAULT_AUTH_MOUNT) ?? (authMethod === "kubernetes" ? "kubernetes" : "jwt"),
		authRole: normalizeOptionalString(process.env.OPENCLAW_VAULT_AUTH_ROLE),
		hasJwtFile: Boolean(normalizeOptionalString(process.env.OPENCLAW_VAULT_JWT_FILE)),
		hasVaultTokenFile: Boolean(normalizeOptionalString(process.env.VAULT_TOKEN_FILE)),
		kvMount: normalizeOptionalString(process.env.OPENCLAW_VAULT_KV_MOUNT) ?? "secret",
		kvVersion: normalizeOptionalString(process.env.OPENCLAW_VAULT_KV_VERSION) ?? "2",
		hasVaultToken: Boolean(normalizeOptionalString(process.env.VAULT_TOKEN))
	};
	if (options.json) {
		writeJson(result);
		return;
	}
	writeLine(`Vault provider: ${provider.configured ? "configured" : "not configured"}`);
	if (provider.source) writeLine(`Source: ${provider.source}`);
	if (provider.command) writeLine(`Command: ${provider.command}`);
	if (provider.pluginIntegration) writeLine(`Plugin integration: ${provider.pluginIntegration.pluginId}:${provider.pluginIntegration.integrationId}`);
	writeLine(`Resolver: ${result.resolverScript}`);
	writeLine(`VAULT_ADDR: ${result.vaultAddr ?? "not set"}`);
	writeLine(`Auth method: ${result.authMethod}`);
	writeLine(`VAULT_TOKEN: ${result.hasVaultToken ? "set" : "not set"}`);
	writeLine(`VAULT_TOKEN_FILE: ${result.hasVaultTokenFile ? "set" : "not set"}`);
	writeLine(`Auth mount: ${result.authMount}`);
	writeLine(`Auth role: ${result.authRole ?? "not set"}`);
	writeLine(`OPENCLAW_VAULT_JWT_FILE: ${result.hasJwtFile ? "set" : "not set"}`);
	writeLine(`KV mount: ${result.kvMount}`);
	writeLine(`KV version: ${result.kvVersion}`);
}
function registerVaultCommands(params) {
	const vault = params.program.command("vault").description("Manage Vault SecretRefs");
	vault.command("status").description("Show Vault SecretRef provider status").option("--json", "Print JSON status").option("--provider-alias <alias>", "Secret provider alias to inspect").action((options) => runStatus(params.config, options));
	vaultSecretRefSetupCli.registerSetupCommand(vault);
}
//#endregion
export { registerVaultCommands };
