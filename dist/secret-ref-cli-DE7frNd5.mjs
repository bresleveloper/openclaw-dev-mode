import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { t as coerceErrorMessage } from "./error-coercion-CvJK4lmH.mjs";
import { n as resolvePreferredOpenClawTmpDir } from "./tmp-openclaw-dir-DR7bHNl9.mjs";
import "./error-runtime-BmospGvZ.mjs";
import "./string-coerce-runtime-50qKeWeL.mjs";
import { c as tryReadSecretFileSync, t as DEFAULT_SECRET_FILE_MAX_BYTES } from "./secret-file-B_nJw6pE.mjs";
import "./secret-file-runtime-DMbN7rMd.mjs";
import { t as createPluginSecretRefSetupCli } from "./secret-ref-runtime-BNieCotQ.mjs";
import "./temp-path-C5ZA6ftW.mjs";
import { t as resolveTrustedOnePasswordCli } from "./onepassword-op-path-E5eCu6G9.mjs";
import { t as encodeOnePasswordSecretId } from "./onepassword-secret-id-BNNC3iLe.mjs";
import path from "node:path";
import { randomUUID } from "node:crypto";
//#region extensions/onepassword/src/secret-ref-cli.ts
const ONEPASSWORD_PROVIDER_ALIAS = "onepassword";
function normalizeOnePasswordSecretId(label, value) {
	try {
		return encodeOnePasswordSecretId(value);
	} catch (error) {
		const detail = coerceErrorMessage(error);
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
async function inspectSecretRefReadiness(params, dependencies = {}) {
	const resolveTrustedCli = dependencies.resolveTrustedCli ?? resolveTrustedOnePasswordCli;
	const readTokenFile = dependencies.readTokenFile ?? ((filePath) => tryReadSecretFileSync(filePath, "1Password service account token", {
		maxBytes: DEFAULT_SECRET_FILE_MAX_BYTES,
		rejectHardlinks: false,
		rejectSymlink: true
	}));
	const configuredOpCommand = normalizeOptionalString(params.env.CLAW_1PASSWORD_OP);
	const opCommand = configuredOpCommand ?? "op";
	let opBinaryPath = null;
	let opStatus;
	try {
		opBinaryPath = await resolveTrustedCli({
			...configuredOpCommand ? { configuredPath: configuredOpCommand } : {},
			pathEnv: params.env.PATH
		}) ?? null;
		opStatus = opBinaryPath ? "ready" : "not-found";
	} catch {
		opStatus = "untrusted";
	}
	let tokenFileStatus;
	try {
		tokenFileStatus = readTokenFile(params.tokenFile) ? "ready" : "missing-or-unsafe";
	} catch {
		tokenFileStatus = "missing-or-unsafe";
	}
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
		writeLine(JSON.stringify(result, null, 2));
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
