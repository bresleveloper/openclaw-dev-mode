import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { r as defaultRuntime } from "./runtime-DlO3PTAd.mjs";
import { f as shortenHomeInString, p as shortenHomePath } from "./utils-DgZn2dLu.mjs";
import { r as resolveStateDir } from "./state-dir-BHJORNly.mjs";
import { T as resolveOAuthDir, m as resolveConfigPath } from "./paths-DGIwWbpu.mjs";
import { t as formatCliCommand } from "./command-format-DwEdrDKL.mjs";
import { n as isRich, r as theme, t as colorize } from "./theme-DzaUZY4q.mjs";
import { n as runExec } from "./exec-DJvyCA0D.mjs";
import { n as LEGACY_IMPLICIT_AGENT_ID } from "./session-key-C09ow4h0.mjs";
import { i as listAgentIds, o as tryResolveDefaultAgentId } from "./agent-roster-BXD1uMJD.mjs";
import { t as createConfigIO } from "./io.factory-GdHkk8Z_.mjs";
import "./agent-scope-CG17uXFn.mjs";
import { r as getRuntimeConfig } from "./io.runtime-BSum32pK.mjs";
import { r as replaceConfigFile } from "./mutate-BkuP-9_H.mjs";
import "./config-9720xhC5.mjs";
import { m as resolveAuthProfileDatabaseFilePaths } from "./sqlite-CW8wNN4G.mjs";
import { t as resolveCommandSecretRefsViaGateway } from "./command-secret-gateway-BTVJMG37.mjs";
import { d as getSecurityAuditCommandSecretTargetIds } from "./command-secret-targets-C5LZrFZ5.mjs";
import { n as formatHelpExamples, t as formatDocsHelp } from "./help-format-xds_bDSp.mjs";
import { t as runSecurityAuditCore } from "./audit-BQiWrID2.mjs";
import { t as collectIncludePathsRecursive } from "./includes-scan-D9Y2RPS5.mjs";
import path from "node:path";
import fs from "node:fs/promises";
import { createIcaclsResetCommand, formatIcaclsResetCommand } from "@openclaw/fs-safe/advanced";
import { walkDirectory } from "@openclaw/fs-safe/walk";
import { modeBits } from "@openclaw/fs-safe/permissions";
//#region src/security/fix.ts
async function applyPermissionFix(target, options) {
	const action = options.platform === "win32" ? {
		kind: "icacls",
		path: target.path,
		command: formatIcaclsResetCommand(target.path, {
			isDir: target.require === "dir",
			env: options.env
		}),
		ok: false
	} : {
		kind: "chmod",
		path: target.path,
		mode: target.mode,
		ok: false
	};
	try {
		const st = await fs.lstat(target.path);
		if (st.isSymbolicLink()) return {
			...action,
			skipped: "symlink"
		};
		if (target.require === "dir" && !st.isDirectory()) return {
			...action,
			skipped: "not-a-directory"
		};
		if (target.require === "file" && !st.isFile()) return {
			...action,
			skipped: "not-a-file"
		};
		if (action.kind === "chmod") {
			if (modeBits(st.mode) === target.mode) return {
				...action,
				skipped: "already"
			};
			await fs.chmod(target.path, target.mode);
		} else {
			const cmd = createIcaclsResetCommand(target.path, {
				isDir: st.isDirectory(),
				env: options.env
			});
			if (!cmd) return {
				...action,
				skipped: "missing-user"
			};
			await options.exec(cmd.command, cmd.args);
			action.command = cmd.display;
		}
		return {
			...action,
			ok: true
		};
	} catch (err) {
		return err.code === "ENOENT" ? {
			...action,
			skipped: "missing"
		} : {
			...action,
			error: String(err)
		};
	}
}
function setGroupPolicyAllowlist(params) {
	if (!params.cfg.channels) return;
	const section = params.cfg.channels[params.channel];
	if (!section || typeof section !== "object") return;
	if (section.groupPolicy === "open") {
		section.groupPolicy = "allowlist";
		params.changes.push(`channels.${params.channel}.groupPolicy=open -> allowlist`);
	}
	const accounts = section.accounts;
	if (!accounts || typeof accounts !== "object") return;
	for (const [accountId, accountValue] of Object.entries(accounts)) {
		if (!accountId) continue;
		if (!accountValue || typeof accountValue !== "object") continue;
		const account = accountValue;
		if (account.groupPolicy === "open") {
			account.groupPolicy = "allowlist";
			params.changes.push(`channels.${params.channel}.accounts.${accountId}.groupPolicy=open -> allowlist`);
		}
	}
}
async function applySecurityFixConfigMutations(params) {
	const channelFixes = await collectChannelSecurityConfigFixMutation({
		cfg: params.cfg,
		env: params.env,
		channelPlugins: params.channelPlugins
	});
	const cfg = structuredClone(channelFixes.cfg ?? {});
	const changes = [];
	for (const channel of Object.keys(cfg.channels ?? {})) setGroupPolicyAllowlist({
		cfg,
		channel,
		changes
	});
	return {
		cfg,
		changes: [...changes, ...channelFixes.changes]
	};
}
async function collectChannelSecurityConfigFixMutation(params) {
	let nextCfg = params.cfg;
	const changes = [];
	const collectPlugins = async () => {
		if (params.channelPlugins) return params.channelPlugins;
		try {
			const pluginIds = Object.keys(params.cfg.channels ?? {}).filter(Boolean);
			if (pluginIds.length === 0) return [];
			const wanted = new Set(pluginIds);
			const { listBundledChannelPlugins } = await import("./bundled-B3fXa_2z.mjs");
			return listBundledChannelPlugins().filter((plugin) => wanted.has(plugin.id));
		} catch {
			return [];
		}
	};
	for (const plugin of await collectPlugins()) {
		const mutation = await plugin.security?.applyConfigFixes?.({
			cfg: nextCfg,
			env: params.env
		});
		if (!mutation || mutation.changes.length === 0) continue;
		nextCfg = mutation.config;
		changes.push(...mutation.changes);
	}
	return {
		cfg: nextCfg,
		changes
	};
}
async function collectSecurityPermissionTargets(params) {
	const targets = [
		{
			path: params.stateDir,
			mode: 448,
			require: "dir"
		},
		{
			path: params.configPath,
			mode: 384,
			require: "file"
		},
		...(params.includePaths ?? []).map((targetPath) => ({
			path: targetPath,
			mode: 384,
			require: "file"
		}))
	];
	const credsDir = resolveOAuthDir(params.env, params.stateDir);
	targets.push({
		path: credsDir,
		mode: 448,
		require: "dir"
	});
	const collectFiles = async (directory, suffix) => {
		const { entries } = await walkDirectory(directory, {
			maxDepth: 1,
			symlinks: "skip",
			include: (entry) => entry.kind === "file" && entry.name.endsWith(suffix)
		}).catch(() => ({ entries: [] }));
		for (const entry of entries) targets.push({
			path: path.join(directory, entry.name),
			mode: 384,
			require: "file"
		});
	};
	await collectFiles(credsDir, ".json");
	const ids = /* @__PURE__ */ new Set([LEGACY_IMPLICIT_AGENT_ID]);
	const defaultAgentId = tryResolveDefaultAgentId(params.cfg);
	if (defaultAgentId) ids.add(defaultAgentId);
	for (const id of listAgentIds(params.cfg)) ids.add(id);
	for (const normalizedAgentId of ids) {
		const agentRoot = path.join(params.stateDir, "agents", normalizedAgentId);
		const agentDir = path.join(agentRoot, "agent");
		const sessionsDir = path.join(agentRoot, "sessions");
		targets.push({
			path: agentRoot,
			mode: 448,
			require: "dir"
		});
		targets.push({
			path: agentDir,
			mode: 448,
			require: "dir"
		});
		for (const databasePath of resolveAuthProfileDatabaseFilePaths(agentDir)) targets.push({
			path: databasePath,
			mode: 384,
			require: "file"
		});
		const authPath = path.join(agentDir, "auth-profiles.json");
		targets.push({
			path: authPath,
			mode: 384,
			require: "file"
		});
		targets.push({
			path: sessionsDir,
			mode: 448,
			require: "dir"
		});
		const storePath = path.join(sessionsDir, "sessions.json");
		targets.push({
			path: storePath,
			mode: 384,
			require: "file"
		});
		await collectFiles(sessionsDir, ".jsonl");
	}
	return targets;
}
async function fixSecurityFootguns(opts) {
	const env = opts?.env ?? process.env;
	const platform = opts?.platform ?? process.platform;
	const exec = opts?.exec ?? runExec;
	const stateDir = opts?.stateDir ?? resolveStateDir(env);
	const configPath = opts?.configPath ?? resolveConfigPath(env, stateDir);
	const actions = [];
	const errors = [];
	const io = createConfigIO({
		env,
		configPath
	});
	const { snapshot: snap, writeOptions } = await io.readConfigFileSnapshotForWrite();
	if (!snap.valid) errors.push(...snap.issues.map((i) => `${i.path}: ${i.message}`));
	let configWritten = false;
	let changes = [];
	if (snap.valid) {
		const fixed = await applySecurityFixConfigMutations({
			cfg: snap.config,
			env,
			channelPlugins: opts?.channelPlugins
		});
		changes = fixed.changes;
		if (changes.length > 0) try {
			await replaceConfigFile({
				nextConfig: fixed.cfg,
				snapshot: snap,
				writeOptions,
				io,
				afterWrite: { mode: "auto" }
			});
			configWritten = true;
		} catch (err) {
			errors.push(`replaceConfigFile failed: ${String(err)}`);
		}
	}
	let includePaths = [];
	if (snap.exists) includePaths = await collectIncludePathsRecursive({
		configPath: snap.path,
		parsed: snap.parsed,
		env
	}).catch(() => []);
	const permissionTargets = await collectSecurityPermissionTargets({
		env,
		stateDir,
		configPath,
		cfg: snap.config ?? {},
		includePaths
	}).catch((err) => {
		errors.push(`collectSecurityPermissionTargets failed: ${String(err)}`);
		return [];
	});
	for (const target of permissionTargets) actions.push(await applyPermissionFix(target, {
		env,
		platform,
		exec
	}));
	return {
		ok: errors.length === 0,
		stateDir,
		configPath,
		configWritten,
		changes,
		actions,
		errors
	};
}
//#endregion
//#region src/cli/security-cli.ts
function parseGatewayAuthMode(value) {
	const mode = normalizeOptionalLowercaseString(value);
	if (!mode) return;
	if (mode === "none" || mode === "token" || mode === "password" || mode === "trusted-proxy") return mode;
	throw new Error("Invalid --auth value. Expected \"none\", \"token\", \"password\", or \"trusted-proxy\".");
}
function buildAuditGatewayAuthOverride(params) {
	if (!params.mode) return;
	if (params.mode === "token" && !params.token) throw new Error("Invalid --auth token: pass --token <token> for audit auth override.");
	if (params.mode === "password" && !params.password) throw new Error("Invalid --auth password: pass --password <password> for audit auth override.");
	return {
		mode: params.mode,
		...params.token ? { token: params.token } : {},
		...params.password ? { password: params.password } : {}
	};
}
function formatSummary(summary) {
	const rich = isRich();
	return [
		colorize(rich, theme.error, `${summary.critical} critical`),
		colorize(rich, theme.warn, `${summary.warn} warn`),
		colorize(rich, theme.muted, `${summary.info} info`)
	].join(" · ");
}
function registerSecurityCli(program) {
	program.command("security").description("Audit local config and state for common security foot-guns").addHelpText("after", () => `\n${theme.heading("Examples:")}\n${formatHelpExamples([
		["openclaw security audit", "Run a local security audit."],
		["openclaw security audit --deep", "Include best-effort live Gateway probes and plugin-owned security audit collectors."],
		["openclaw security audit --deep --token <token>", "Use explicit token for deep probe."],
		["openclaw security audit --deep --password <password>", "Use explicit password for deep probe."],
		["openclaw security audit --auth password --password <password>", "Audit a runtime-only password-mode Gateway secret."],
		["openclaw security audit --fix", "Apply safe remediations and file-permission fixes."],
		["openclaw security audit --json", "Output machine-readable JSON."]
	])}\n${formatDocsHelp("/cli/security")}`).command("audit").description("Audit config + local state for common security foot-guns").option("--deep", "Attempt live Gateway probes and plugin-owned collector checks", false).option("--auth <mode>", "Runtime gateway auth mode (\"none\"|\"token\"|\"password\"|\"trusted-proxy\")").option("--token <token>", "Use explicit gateway token for deep probe auth").option("--password <password>", "Use explicit gateway password for deep probe auth").option("--fix", "Apply safe fixes (tighten defaults + chmod state/config)", false).option("--json", "Print JSON", false).action(async (opts) => {
		const authMode = parseGatewayAuthMode(opts.auth);
		const token = normalizeOptionalString(opts.token);
		const password = normalizeOptionalString(opts.password);
		const auditGatewayAuthOverride = buildAuditGatewayAuthOverride({
			mode: authMode,
			token,
			password
		});
		const fixResult = opts.fix ? await fixSecurityFootguns() : null;
		const sourceConfig = getRuntimeConfig();
		const { resolvedConfig: cfg, diagnostics: secretDiagnostics } = await resolveCommandSecretRefsViaGateway({
			config: sourceConfig,
			commandName: "security audit",
			targetIds: getSecurityAuditCommandSecretTargetIds(),
			mode: "read_only_status"
		});
		const report = await runSecurityAuditCore({
			config: cfg,
			sourceConfig,
			deep: Boolean(opts.deep),
			includeFilesystem: true,
			includeChannelSecurity: true,
			deepProbeAuth: token || password ? {
				...token ? { token } : {},
				...password ? { password } : {}
			} : void 0,
			auditGatewayAuthOverride
		});
		if (opts.json) {
			defaultRuntime.writeJson(fixResult ? {
				fix: fixResult,
				report,
				secretDiagnostics
			} : {
				...report,
				secretDiagnostics
			});
			return;
		}
		const rich = isRich();
		const heading = (text) => rich ? theme.heading(text) : text;
		const muted = (text) => rich ? theme.muted(text) : text;
		const lines = [];
		lines.push(heading("OpenClaw security audit"));
		lines.push(muted(`Summary: ${formatSummary(report.summary)}`));
		if ((report.suppressedFindings?.length ?? 0) > 0) lines.push(muted(`Suppressed: ${report.suppressedFindings?.length ?? 0} configured`));
		lines.push(muted(`Run deeper: ${formatCliCommand("openclaw security audit --deep")}`));
		for (const diagnostic of secretDiagnostics) lines.push(muted(`[secrets] ${diagnostic}`));
		if (fixResult) {
			lines.push(muted(`Fix: ${formatCliCommand("openclaw security audit --fix")}`));
			if (fixResult.errors.length === 0 && fixResult.changes.length === 0 && fixResult.actions.every((a) => !a.ok)) lines.push(muted("Fixes: no changes applied"));
			else {
				lines.push("");
				lines.push(heading("FIX"));
				for (const change of fixResult.changes) lines.push(muted(`  ${shortenHomeInString(change)}`));
				for (const action of fixResult.actions) {
					const command = action.kind === "chmod" ? `chmod ${action.mode.toString(8).padStart(3, "0")} ${shortenHomePath(action.path)}` : shortenHomeInString(action.command);
					if (action.ok) lines.push(muted(`  ${command}`));
					else if (action.skipped) lines.push(muted(`  skip ${command} (${action.skipped})`));
					else if (action.error) lines.push(muted(`  ${command} failed: ${action.error}`));
				}
				for (const err of fixResult.errors) lines.push(muted(`  error: ${shortenHomeInString(err)}`));
			}
		}
		for (const [severity, style] of [
			["critical", theme.error],
			["warn", theme.warn],
			["info", theme.muted]
		]) {
			const list = report.findings.filter((finding) => finding.severity === severity);
			if (list.length === 0) continue;
			const label = colorize(rich, style, severity.toUpperCase());
			lines.push("");
			lines.push(heading(label));
			for (const f of list) {
				lines.push(`${theme.muted(f.checkId)} ${f.title}`);
				lines.push(`  ${f.detail}`);
				if (f.remediation?.trim()) lines.push(`  ${muted(`Fix: ${f.remediation.trim()}`)}`);
			}
		}
		defaultRuntime.log(lines.join("\n"));
	});
}
//#endregion
export { registerSecurityCli };
