import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { n as resolvePreferredOpenClawTmpDir } from "./tmp-openclaw-dir-BSb3HetY.mjs";
import "./string-coerce-runtime-C_MKhRVt.mjs";
import { c as tryReadSecretFileSync, t as DEFAULT_SECRET_FILE_MAX_BYTES } from "./secret-file-BqGFHdII.mjs";
import "./secret-file-runtime-C-pb0auB.mjs";
import { t as createPluginSecretRefSetupCli } from "./secret-ref-runtime-B0T63SP-.mjs";
import "./temp-path-PENdksor.mjs";
import { t as resolveTrustedOnePasswordCli } from "./onepassword-op-path-CX5JE67M.mjs";
import { t as encodeOnePasswordSecretId } from "./onepassword-secret-id-Dpv-acHb.mjs";
import path from "node:path";
import { randomUUID } from "node:crypto";
//#region extensions/onepassword/src/secret-ref-cli.ts
const ONEPASSWORD_PROVIDER_ALIAS = "onepassword";
function normalizeOnePasswordSecretId(label, value) {
	try {
		return encodeOnePasswordSecretId(value);
	} catch (error) {
		const detail = error instanceof Error ? error.message : String(error);
		throw new Error(`Invalid ${label} 1Password SecretRef id: ${detail}`, { cause: error });
	}
}
const onePasswordSecretRefSetupCli = createPluginSecretRefSetupCli({
	productName: "1Password",
	secretIdLabel: "1Password SecretRef id",
	secretIdPlaceholder: "1password-secret-id",
	defaultProviderAlias: ONEPASSWORD_PROVIDER_ALIAS,
	pluginIntegration: {
		pluginId: "onepassword",
		integrationId: "onepassword"
	},
	normalizeSecretId: normalizeOnePasswordSecretId,
	defaultPlanPath: () => path.join(resolvePreferredOpenClawTmpDir(), `openclaw-1password-secrets-${randomUUID()}.json`),
	beforeApplyCommands: ["openclaw plugins enable onepassword", "openclaw onepassword secretref status"]
});
function writeLine(message = "") {
	process.stdout.write(`${message}\n`);
}
function writeJson(value) {
	process.stdout.write(`${JSON.stringify(value, null, 2)}\n`);
}
async function inspectSecretRefReadiness(params, dependencies = {}) {
	const resolveTrustedCli = dependencies.resolveTrustedCli ?? resolveTrustedOnePasswordCli;
	const readTokenFile = dependencies.readTokenFile ?? ((filePath) => tryReadSecretFileSync(filePath, "1Password service account token", {
		maxBytes: DEFAULT_SECRET_FILE_MAX_BYTES,
		rejectHardlinks: false,
		rejectSymlink: true
	}));
	const configuredOpCommand = normalizeOptionalString(params.env.CLAW_1PASSWORD_OP);
	const opCommand = configuredOpCommand ?? "op";
	const { opBinaryPath, opStatus } = await (async () => {
		try {
			const resolvedPath = await resolveTrustedCli({
				...configuredOpCommand ? { configuredPath: configuredOpCommand } : {},
				pathEnv: params.env.PATH
			}) ?? null;
			return {
				opBinaryPath: resolvedPath,
				opStatus: resolvedPath ? "ready" : "not-found"
			};
		} catch {
			return {
				opBinaryPath: null,
				opStatus: "untrusted"
			};
		}
	})();
	const tokenFileStatus = (() => {
		try {
			return readTokenFile(params.tokenFile) ? "ready" : "missing-or-unsafe";
		} catch {
			return "missing-or-unsafe";
		}
	})();
	return {
		opCommand,
		opBinaryPath,
		opStatus,
		tokenFile: params.tokenFile,
		tokenFileStatus,
		prerequisitesReady: opStatus === "ready" && tokenFileStatus === "ready"
	};
}
async function runStatus(params, options) {
	const { providerAlias, provider, providerReady } = onePasswordSecretRefSetupCli.inspectProvider(params.config, options.providerAlias);
	const readiness = await inspectSecretRefReadiness({
		env: params.env ?? process.env,
		tokenFile: params.tokenFile
	});
	const issues = [
		...providerReady ? [] : [provider.configured ? "provider-misconfigured" : "provider-not-configured"],
		...readiness.opStatus === "ready" ? [] : [`op-${readiness.opStatus}`],
		...readiness.tokenFileStatus === "ready" ? [] : ["token-file-missing-or-unsafe"]
	];
	const result = {
		providerAlias,
		provider,
		providerReady,
		...readiness,
		ready: providerReady && readiness.prerequisitesReady,
		issues
	};
	if (options.json) {
		writeJson(result);
		return;
	}
	writeLine(`1Password provider: ${providerReady ? "ready" : provider.configured ? "misconfigured" : "not configured"}`);
	if (provider.source) writeLine(`Source: ${provider.source}`);
	if (provider.command) writeLine(`Command: ${provider.command}`);
	if (provider.pluginIntegration) writeLine(`Plugin integration: ${provider.pluginIntegration.pluginId}:${provider.pluginIntegration.integrationId}`);
	writeLine(`op command: ${readiness.opCommand}`);
	writeLine(`op status: ${readiness.opStatus}`);
	if (readiness.opBinaryPath) writeLine(`op binary: ${readiness.opBinaryPath}`);
	writeLine(`token file: ${readiness.tokenFileStatus}`);
	writeLine(`prerequisites ready: ${readiness.prerequisitesReady ? "yes" : "no"}`);
	writeLine(`ready: ${result.ready ? "yes" : "no"}`);
	if (issues.length === 0) return;
	writeLine();
	writeLine("Next actions:");
	if (!providerReady) writeLine("  Generate and apply a 1Password SecretRef setup plan.");
	if (readiness.opStatus === "not-found") writeLine("  Install the official 1Password CLI or set CLAW_1PASSWORD_OP.");
	else if (readiness.opStatus === "untrusted") writeLine("  Use an absolute 1Password CLI path that is not replaceable by another user.");
	if (readiness.tokenFileStatus !== "ready") writeLine(`  Create a non-empty service-account token file at ${readiness.tokenFile}.`);
}
function registerOnePasswordSecretRefCommands(params) {
	const secretRef = params.command.command("secretref").description("Manage 1Password SecretRefs");
	secretRef.command("status").description("Show 1Password SecretRef provider status").option("--json", "Print JSON status").option("--provider-alias <alias>", "Secret provider alias to inspect").action((options) => runStatus(params, options));
	onePasswordSecretRefSetupCli.registerSetupCommand(secretRef);
}
//#endregion
export { registerOnePasswordSecretRefCommands };
