import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
//#region src/config/io.write-errors.ts
const CONFIG_VALIDATION_FAILED_CODE = "CONFIG_VALIDATION_FAILED";
const CONFIG_INCLUDE_OWNERSHIP_CODE = "CONFIG_INCLUDE_OWNERSHIP";
/** A completed file write must not be handled as a retryable pre-write refusal. */
var ConfigWritePostCommitError = class extends Error {
	constructor(params) {
		const recovery = {
			restored: "The config write was rolled back.",
			"not-restored": "The write was not rolled back. Inspect the current config before retrying.",
			unknown: "Rollback could not be confirmed. Inspect the current config before retrying."
		}[params.rollbackStatus];
		super(params.publication === "partial" ? `Config publication failed after removing ${params.configPath}: ${formatErrorMessage(params.cause)}\n${recovery} Inspect recovery backups at ${params.configPath}.bak.` : `Config was written to ${params.configPath}, but post-write processing failed: ${formatErrorMessage(params.cause)}\n${recovery}`, { cause: params.cause });
		this.name = "ConfigWritePostCommitError";
		this.configPath = params.configPath;
		this.rollbackStatus = params.rollbackStatus;
		this.publication = params.publication ?? "complete";
		this.recoveryBackupPath = params.publication === "partial" ? `${params.configPath}.bak` : void 0;
	}
};
function hasConfigWriteErrorCode(error, code) {
	return error instanceof Error && "code" in error && error.code === code;
}
/**
* Typed write refusal for a candidate that fails schema validation, so doctor
* can render "config left unchanged" plus the offending paths instead of crashing.
*/
function createConfigValidationFailedError(issues) {
	const issue = issues[0];
	return Object.assign(new Error(formatConfigValidationFailure(issue?.path || "<root>", issue?.message ?? "invalid")), {
		code: CONFIG_VALIDATION_FAILED_CODE,
		issues
	});
}
/** True when a config write was refused because the candidate failed schema validation. */
function isConfigValidationFailedError(error) {
	return hasConfigWriteErrorCode(error, CONFIG_VALIDATION_FAILED_CODE);
}
/**
* Typed write refusal for a candidate that would flatten an $include-owned value
* into the root file, so doctor can record "config left unchanged" with the
* owning path instead of surfacing a raw error after advertising the repair.
*/
function createConfigIncludeOwnershipError(refusal) {
	return Object.assign(/* @__PURE__ */ new Error(`Config write would flatten $include-owned config at ${refusal.ownedConfigPath}; edit that include file directly or remove the $include first.`), {
		code: CONFIG_INCLUDE_OWNERSHIP_CODE,
		...refusal
	});
}
/** True when a config write was refused because it would flatten an included file. */
function isConfigIncludeOwnershipError(error) {
	return hasConfigWriteErrorCode(error, CONFIG_INCLUDE_OWNERSHIP_CODE);
}
const OPEN_DM_POLICY_ALLOW_FROM_RE = /^(?<policyPath>[a-z0-9_.-]+)\s*=\s*"open"\s+requires\s+(?<allowPath>[a-z0-9_.-]+)(?:\s+\(or\s+[a-z0-9_.-]+\))?\s+to include "\*"$/i;
function formatConfigValidationFailure(pathLabel, issueMessage) {
	const match = issueMessage.match(OPEN_DM_POLICY_ALLOW_FROM_RE);
	const policyPath = match?.groups?.policyPath?.trim();
	const allowPath = match?.groups?.allowPath?.trim();
	if (!policyPath || !allowPath) return `Config validation failed: ${pathLabel}: ${issueMessage}`;
	return [
		`Config validation failed: ${pathLabel}`,
		"",
		`Configuration mismatch: ${policyPath} is "open", but ${allowPath} does not include "*".`,
		"",
		"Fix with:",
		`  openclaw config set ${allowPath} '["*"]'`,
		"",
		"Or switch policy:",
		`  openclaw config set ${policyPath} "pairing"`
	].join("\n");
}
//#endregion
export { isConfigValidationFailedError as a, isConfigIncludeOwnershipError as i, createConfigIncludeOwnershipError as n, createConfigValidationFailedError as r, ConfigWritePostCommitError as t };
