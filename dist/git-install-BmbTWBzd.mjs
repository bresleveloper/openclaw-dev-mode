import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { o as resolveUserPath } from "./home-dir-BKwhAL2c.mjs";
import "./fs-safe-defaults-D3xd3zKO.mjs";
import { d as pathExists } from "./fs-safe-BAPek8At.mjs";
import "./utils-aKqR_F_U.mjs";
import { o as redactSensitiveUrlLikeString } from "./redact-sensitive-url-DspuXlEe.mjs";
import { n as sanitizeForLog } from "./ansi-CWsy0bu4.mjs";
import { r as sha256HexPrefixCore } from "./node-crypto-Df3MIs6V.mjs";
import "./crypto-digest-D9Nqq3c7.mjs";
import { o as resolveDefaultPluginGitDir } from "./install-paths-DnOgVB7K.mjs";
import { t as PLUGIN_INSTALL_ERROR_CODE } from "./install-types-auyGAGw8.mjs";
import { t as hasHttpUrlPrefix } from "./url-protocol-OU3K-ySz.mjs";
import { i as runCommandWithTimeout } from "./exec-shcN2-sN.mjs";
import { c as withInstallWorkspace, d as resolveTimedInstallModeOptions, u as resolveInstallWorkTimeoutMs } from "./install-source-utils-CeCvRCDR.mjs";
import { a as resolvePackageDirInstallTransaction, i as requestDeferredPackageDirInstall, o as createSafeNpmInstallArgs, r as installPackageDir, s as createSafeNpmInstallEnv } from "./install-package-dir-DZA6fMda.mjs";
import { I as attachPluginInstallTransaction, M as emitPluginAuditSecurityEvent, N as emitPluginInstallSecurityEvent, P as pluginAuditOutcomeForReason, T as loadPluginInstallRuntime, V as resolvePluginInstallTransactionRequest, x as ensureInstallTargetAvailableForMode } from "./npm-managed-root-7qY5QxhU.mjs";
import { a as installPluginFromInstalledPackageDir } from "./install-Cnpp6OhU.mjs";
import { n as preflightPluginGitInstallPolicy } from "./install-security-scan-D-EfiJK1.mjs";
import path from "node:path";
import fs from "node:fs/promises";
//#region src/infra/git-source.ts
/** Acquires a tree; callers retain source policy and ownership of its staging directory. */
async function acquireGitSource(params) {
	const run = (argv, cwd, work = false) => runCommandWithTimeout(argv, {
		...params.commandEnv?.(),
		...cwd ? { cwd } : {},
		timeoutMs: work ? resolveInstallWorkTimeoutMs(params.workTimeoutMs, params.timeoutMs ?? 12e4) : params.timeoutMs ?? 12e4
	});
	const failure = async (details) => {
		await params.cleanupOnFailure?.();
		if (params.formatFailure) return {
			ok: false,
			error: params.formatFailure(details)
		};
		const safe = (value) => sanitizeForLog(redactSensitiveUrlLikeString(value));
		const label = safe(params.label);
		const ref = safe(params.ref ?? "");
		const detail = safe(details.stderr.trim() || details.stdout.trim() || "git failed");
		return {
			ok: false,
			error: details.action === "resolve ref" ? `failed to resolve ref ${ref} in ${label}` : `failed to ${details.action}${details.action === "checkout" ? ` ${params.ref}` : ""} ${label}: ${detail}`
		};
	};
	const argv = ["git", "clone"];
	if (!params.ref || params.refMode === "shallow-branch") argv.push("--depth", "1");
	if (params.ref && params.refMode === "shallow-branch") argv.push("--branch", params.ref);
	if (params.cloneSeparator !== false) argv.push("--");
	argv.push(params.url, params.repoDir);
	const clone = await run(argv, void 0, true);
	if (clone.code !== 0) return await failure({
		action: "clone",
		...clone
	});
	if (params.ref && params.refMode !== "shallow-branch") {
		let checkoutRef = params.ref;
		if (params.refMode === "resolve-remote") {
			const candidates = params.ref.startsWith("origin/") ? [params.ref] : [params.ref, `origin/${params.ref}`];
			let commitish;
			for (const candidate of candidates) {
				const resolved = await run([
					"git",
					"rev-parse",
					"--verify",
					"--quiet",
					`${candidate}^{commit}`
				], params.repoDir);
				const commit = normalizeOptionalString(resolved.stdout);
				if (resolved.code === 0 && commit) {
					commitish = commit;
					break;
				}
			}
			if (!commitish) return await failure({
				action: "resolve ref",
				stdout: "",
				stderr: ""
			});
			checkoutRef = commitish;
		}
		const checkout = await run([
			"git",
			"switch",
			"--detach",
			"--",
			checkoutRef
		], params.repoDir, true);
		if (checkout.code !== 0) return await failure({
			action: "checkout",
			...checkout
		});
	}
	if (params.recordCommit === false) return { ok: true };
	const rev = await run([
		"git",
		"rev-parse",
		"HEAD"
	], params.repoDir);
	if (rev.code !== 0) return await failure({
		action: "resolve commit for",
		...rev
	});
	return {
		ok: true,
		commit: normalizeOptionalString(rev.stdout)
	};
}
//#endregion
//#region src/plugins/git-install.ts
const GIT_SPEC_PREFIX = "git:";
const DEFAULT_GIT_TIMEOUT_MS = 12e4;
const FULL_GIT_COMMIT_PATTERN = /^[0-9a-f]{40}$/i;
/** Returns true for full commit SHAs that do not require branch/tag drift checks. */
function isImmutableGitCommitRef(ref) {
	return FULL_GIT_COMMIT_PATTERN.test(ref ?? "");
}
function splitGitSpecRef(input) {
	const hashIndex = input.lastIndexOf("#");
	if (hashIndex > 0) return {
		base: input.slice(0, hashIndex),
		ref: normalizeOptionalString(input.slice(hashIndex + 1))
	};
	for (let atIndex = input.lastIndexOf("@"); atIndex > 0; atIndex = input.lastIndexOf("@", atIndex - 1)) {
		const base = input.slice(0, atIndex);
		const ref = normalizeOptionalString(input.slice(atIndex + 1));
		if (ref && isGitSpecBase(base)) return {
			base,
			ref
		};
	}
	return { base: input };
}
function isGitSpecBase(value) {
	return looksLikeGitHubRepoShorthand(value) || looksLikeGitHubHostPath(value) || looksLikeUrlGitSpecBase(value) || looksLikeScpGitUrl(value) || value.endsWith(".git") || value.startsWith("./") || value.startsWith("../") || value.startsWith("~/");
}
function looksLikeGitHubRepoShorthand(value) {
	return /^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+(?:\.git)?$/.test(value);
}
function looksLikeGitHubHostPath(value) {
	return /^github\.com\/[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+(?:\.git)?$/i.test(value);
}
function isGitUrl(value) {
	if (value.startsWith("-")) return false;
	return /^(?:ssh|git|file):\/\//i.test(value) || looksLikeScpGitUrl(value) || value.endsWith(".git");
}
function looksLikeScpGitUrl(value) {
	return /^[^@\s]+@[^:\s]+:.+/.test(value);
}
function looksLikeUrlGitSpecBase(value) {
	try {
		const url = new URL(value);
		if (![
			"http:",
			"https:",
			"ssh:",
			"git:",
			"file:"
		].includes(url.protocol)) return false;
		if (url.protocol === "file:") return url.pathname.length > 1;
		return Boolean(url.hostname) && url.pathname.length > 1;
	} catch {
		return false;
	}
}
function stripGitSuffix(value) {
	return value.replace(/\.git$/i, "");
}
function normalizeGitHubRepo(value) {
	const repo = stripGitSuffix(value.replace(/^github\.com\//i, ""));
	return {
		url: `https://github.com/${repo}.git`,
		label: repo
	};
}
function normalizeGitLabel(value) {
	if (hasHttpUrlPrefix(value) || /^(?:ssh|git|file):\/\//i.test(value)) try {
		const url = new URL(value);
		return stripGitSuffix(`${url.hostname}${url.pathname}`).replace(/^\/+/, "");
	} catch {
		return stripGitSuffix(value);
	}
	return stripGitSuffix(value);
}
function parseGitPluginSpec(raw) {
	const trimmed = raw.trim();
	if (!trimmed.toLowerCase().startsWith(GIT_SPEC_PREFIX)) return null;
	const body = trimmed.slice(4).trim();
	if (!body) return null;
	const split = splitGitSpecRef(body);
	const base = split.base.trim();
	if (!base) return null;
	if (looksLikeGitHubRepoShorthand(base) || looksLikeGitHubHostPath(base)) {
		const normalized = normalizeGitHubRepo(base);
		return {
			input: trimmed,
			url: normalized.url,
			ref: split.ref,
			label: normalized.label,
			normalizedSpec: `${GIT_SPEC_PREFIX}${normalized.url}${split.ref ? `@${split.ref}` : ""}`
		};
	}
	if (hasHttpUrlPrefix(base) || isGitUrl(base) || base.startsWith("./") || base.startsWith("../") || base.startsWith("~/")) {
		const url = base.startsWith("./") || base.startsWith("../") || base.startsWith("~/") ? resolveUserPath(base) : base;
		return {
			input: trimmed,
			url,
			ref: split.ref,
			label: normalizeGitLabel(url),
			normalizedSpec: `${GIT_SPEC_PREFIX}${url}${split.ref ? `@${split.ref}` : ""}`
		};
	}
	return null;
}
function createGitCommandEnv() {
	return {
		GIT_TERMINAL_PROMPT: "0",
		GIT_CONFIG_NOSYSTEM: "1",
		GIT_TEMPLATE_DIR: "",
		GIT_EDITOR: "",
		GIT_SEQUENCE_EDITOR: "",
		GIT_EXTERNAL_DIFF: "",
		GIT_DIR: void 0,
		GIT_WORK_TREE: void 0,
		GIT_COMMON_DIR: void 0,
		GIT_INDEX_FILE: void 0,
		GIT_OBJECT_DIRECTORY: void 0,
		GIT_ALTERNATE_OBJECT_DIRECTORIES: void 0,
		GIT_NAMESPACE: void 0,
		GIT_EXEC_PATH: void 0,
		GIT_SSL_NO_VERIFY: void 0
	};
}
function resolveGitInstallRepoDir(params) {
	const gitRoot = params.gitDir ? resolveUserPath(params.gitDir) : resolveDefaultPluginGitDir();
	const redactedSpec = redactSensitiveUrlLikeString(params.source.normalizedSpec);
	return path.join(gitRoot, `git-${sha256HexPrefixCore(redactedSpec, 16)}`, "repo");
}
async function withGitStagingDir(persistentRepoDir, fn) {
	if (!persistentRepoDir) return await withInstallWorkspace("openclaw-git-plugin-", fn);
	const targetParent = path.dirname(persistentRepoDir);
	try {
		await fs.mkdir(targetParent, {
			recursive: true,
			mode: 448
		});
	} catch {
		return await withInstallWorkspace("openclaw-git-plugin-", fn);
	}
	let callbackStarted = false;
	try {
		return await withInstallWorkspace("openclaw-git-plugin-", async (tmpDir) => {
			callbackStarted = true;
			return await fn(tmpDir);
		}, { rootDir: targetParent });
	} catch (err) {
		if (callbackStarted) throw err;
		return await withInstallWorkspace("openclaw-git-plugin-", fn);
	}
}
async function replaceManagedGitRepo(params) {
	let artifactConsentFailure;
	const reviewFinalArtifact = async (stagedRepoDir) => {
		try {
			await params.onBeforePublish?.(stagedRepoDir);
			return { ok: true };
		} catch (error) {
			artifactConsentFailure = { error };
			throw error;
		}
	};
	try {
		const installParams = {
			sourceDir: params.stagedRepoDir,
			targetDir: params.persistentRepoDir,
			mode: await pathExists(params.persistentRepoDir) ? "update" : "install",
			timeoutMs: DEFAULT_GIT_TIMEOUT_MS,
			copyErrorPrefix: "failed to replace managed git plugin repository",
			hasDeps: false,
			depsLogMessage: "",
			afterInstall: reviewFinalArtifact,
			beforePersistentApply: params.beforePersistentApply
		};
		const result = await installPackageDir(params.deferCommit ? requestDeferredPackageDirInstall(installParams, params.assertOwned) : installParams);
		if (artifactConsentFailure) throw artifactConsentFailure.error;
		const transaction = result.ok ? resolvePackageDirInstallTransaction(result) : void 0;
		return result.ok ? {
			ok: true,
			...transaction ? { transaction } : {}
		} : result;
	} catch (err) {
		if (artifactConsentFailure) throw artifactConsentFailure.error;
		return {
			ok: false,
			error: `failed to replace managed git plugin repository: ${String(err)}`
		};
	}
}
function buildBlockedGitInstallResult(params) {
	return {
		ok: false,
		error: params.blocked.reason,
		...params.blocked.code === "security_scan_failed" ? { code: PLUGIN_INSTALL_ERROR_CODE.SECURITY_SCAN_FAILED } : params.blocked.code === "security_scan_blocked" ? { code: PLUGIN_INSTALL_ERROR_CODE.SECURITY_SCAN_BLOCKED } : {}
	};
}
async function installPluginFromGitSpec(params) {
	const parsed = parseGitPluginSpec(params.spec);
	if (!parsed) return {
		ok: false,
		error: `unsupported git: plugin spec: ${params.spec}`
	};
	const { workTimeoutMs } = resolveTimedInstallModeOptions(params, {});
	const persistentRepoDir = resolveGitInstallRepoDir({
		gitDir: params.gitDir,
		source: parsed
	});
	const effectiveMode = params.mode === "update" && await pathExists(persistentRepoDir) ? "update" : "install";
	const availability = await ensureInstallTargetAvailableForMode({
		runtime: await loadPluginInstallRuntime(),
		targetPath: persistentRepoDir,
		mode: effectiveMode
	});
	if (!availability.ok) return availability;
	return await withGitStagingDir(params.dryRun ? void 0 : persistentRepoDir, async (tmpDir) => {
		const repoDir = path.join(tmpDir, "repo");
		params.logger?.info?.(`Cloning ${sanitizeForLog(redactSensitiveUrlLikeString(parsed.label))}...`);
		const acquired = await acquireGitSource({
			...parsed,
			repoDir,
			refMode: "resolve-remote",
			timeoutMs: params.timeoutMs,
			workTimeoutMs,
			commandEnv: () => ({ env: createGitCommandEnv() })
		});
		if (!acquired.ok) return acquired;
		const installPolicyRequest = {
			kind: "plugin-git",
			requestedSpecifier: parsed.input,
			source: {
				kind: "git",
				authority: "third-party",
				mutable: !isImmutableGitCommitRef(parsed.ref),
				network: true
			}
		};
		const preflight = await preflightPluginGitInstallPolicy({
			config: params.config,
			onInstallPolicyWarning: params.onInstallPolicyWarning,
			logger: params.logger ?? {},
			mode: effectiveMode,
			pluginId: params.expectedPluginId ?? parsed.label,
			requestedSpecifier: parsed.input,
			source: installPolicyRequest.source,
			sourcePath: repoDir
		});
		if (preflight?.blocked) {
			const reason = preflight.blocked.code === "security_scan_failed" ? "security_scan_failed" : "security_scan_blocked";
			emitPluginAuditSecurityEvent({
				outcome: pluginAuditOutcomeForReason(reason),
				reason,
				pluginId: params.expectedPluginId,
				mode: effectiveMode,
				sourceFamily: "git"
			});
			return buildBlockedGitInstallResult({ blocked: preflight.blocked });
		}
		if (!params.dryRun) {
			params.logger?.info?.("Installing plugin dependencies with npm…");
			const install = await runCommandWithTimeout(["npm", ...createSafeNpmInstallArgs({
				omitDev: true,
				loglevel: "error",
				noAudit: true,
				noFund: true
			})], {
				cwd: repoDir,
				timeoutMs: resolveInstallWorkTimeoutMs(workTimeoutMs, Math.max(params.timeoutMs ?? DEFAULT_GIT_TIMEOUT_MS, 3e5)),
				env: createSafeNpmInstallEnv(process.env, {
					npmConfigCwd: repoDir,
					packageLock: true,
					quiet: true
				})
			});
			if (install.code !== 0) return {
				ok: false,
				error: `npm install failed: ${install.stderr.trim() || install.stdout.trim()}`
			};
		}
		const result = await installPluginFromInstalledPackageDir({
			onInstallPolicyWarning: params.onInstallPolicyWarning,
			config: params.config,
			packageDir: repoDir,
			dryRun: params.dryRun,
			expectedPluginId: params.expectedPluginId,
			logger: params.logger,
			mode: effectiveMode,
			emitSuccessSecurityEvent: false,
			installPolicyRequest
		});
		if (!result.ok) return result;
		let transaction;
		if (!params.dryRun) {
			const transactionRequest = resolvePluginInstallTransactionRequest(params);
			const replaceResult = await replaceManagedGitRepo({
				stagedRepoDir: repoDir,
				persistentRepoDir,
				deferCommit: transactionRequest?.deferCommit,
				assertOwned: transactionRequest?.assertOwned,
				onBeforePublish: async (stagedArtifactDir) => {
					await params.onBeforePluginArtifactCommit?.({
						pluginId: result.pluginId,
						...effectiveMode === "update" ? { currentArtifactDir: persistentRepoDir } : {},
						stagedArtifactDir,
						mode: effectiveMode
					});
				},
				beforePersistentApply: params.beforePersistentApply
			});
			if (!replaceResult.ok) return replaceResult;
			transaction = replaceResult.transaction;
			emitPluginInstallSecurityEvent({
				pluginId: result.pluginId,
				mode: effectiveMode,
				sourceFamily: "git",
				extensionCount: result.extensions.length,
				hasVersion: Boolean(result.version),
				trustedSourceLinkedOfficialInstall: params.trustedSourceLinkedOfficialInstall
			});
		}
		const installed = {
			...result,
			targetDir: params.dryRun ? result.targetDir : persistentRepoDir,
			git: {
				url: parsed.url,
				ref: parsed.ref,
				commit: acquired.commit,
				resolvedAt: (/* @__PURE__ */ new Date()).toISOString()
			}
		};
		return transaction ? attachPluginInstallTransaction(installed, transaction) : installed;
	});
}
//#endregion
export { acquireGitSource as i, isImmutableGitCommitRef as n, parseGitPluginSpec as r, installPluginFromGitSpec as t };
