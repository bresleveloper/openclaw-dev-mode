import { o as resolveIMessageAccount } from "./accounts-evTpvJMv.mjs";
import { a as imessageCompletionNote, c as imessageSetupStatusBase, l as isAutoManagedIMessageCliPath, o as imessageDmPolicy, r as createIMessageCliPathTextInput, t as IMESSAGE_INSTALL_COMMAND, u as normalizeIMessageCliPathForSetup } from "./setup-core-DqOBe-n0.mjs";
import path from "node:path";
import fs from "node:fs/promises";
import { createDetectedBinaryStatus, setSetupChannelEnabled } from "openclaw/plugin-sdk/setup";
import { truncateUtf16Safe } from "openclaw/plugin-sdk/text-utility-runtime";
import { detectBinary as detectBinary$1, resolveBrewExecutable } from "openclaw/plugin-sdk/setup-tools";
import { isPathStrictlyInside } from "openclaw/plugin-sdk/file-access-runtime";
import { runPluginCommandWithTimeout } from "openclaw/plugin-sdk/run-command";
//#region extensions/imessage/src/install-imsg.ts
const IMESSAGE_BREW_FORMULA = "steipete/tap/imsg";
async function resolveBrewManagedIMessageCliPath(brewExe, cliPath) {
	try {
		const formulae = await runPluginCommandWithTimeout({
			argv: [
				brewExe,
				"list",
				"--formula",
				"--full-name"
			],
			timeoutMs: 1e4
		});
		const installed = formulae.stdout.split(/\r?\n/u).some((formula) => formula.trim() === IMESSAGE_BREW_FORMULA);
		if (formulae.code !== 0 || !installed) return null;
		let resolvedCliPath = cliPath;
		if (!path.isAbsolute(resolvedCliPath)) {
			const resolved = await runPluginCommandWithTimeout({
				argv: [
					"/usr/bin/env",
					"which",
					resolvedCliPath
				],
				timeoutMs: 1e4
			});
			resolvedCliPath = resolved.code === 0 ? resolved.stdout.split(/\r?\n/u)[0]?.trim() ?? "" : "";
		}
		if (!resolvedCliPath) return null;
		const cellar = await runPluginCommandWithTimeout({
			argv: [brewExe, "--cellar"],
			timeoutMs: 1e4
		});
		if (cellar.code !== 0 || !cellar.stdout.trim()) return null;
		const [realCliPath, realFormulaPath] = await Promise.all([fs.realpath(resolvedCliPath), fs.realpath(path.join(cellar.stdout.trim(), "imsg"))]);
		return isPathStrictlyInside(realFormulaPath, realCliPath) ? resolvedCliPath : null;
	} catch {
		return null;
	}
}
async function resolveBrewIMessageCliPath(brewExe) {
	try {
		const result = await runPluginCommandWithTimeout({
			argv: [brewExe, "--prefix"],
			timeoutMs: 1e4
		});
		if (result.code !== 0 || !result.stdout.trim()) return null;
		const candidate = path.join(result.stdout.trim(), "bin", "imsg");
		await fs.access(candidate);
		return candidate;
	} catch {
		return null;
	}
}
async function installIMessageCli(runtime, opts) {
	if (process.platform !== "darwin") return {
		ok: false,
		error: "imsg auto-install is supported only on macOS."
	};
	const brewExe = resolveBrewExecutable();
	if (!brewExe) return {
		ok: false,
		error: `Homebrew is required for imsg setup. Install Homebrew (https://brew.sh), then run: ${IMESSAGE_INSTALL_COMMAND}`
	};
	runtime.log(`${opts?.upgrade ? "Updating" : "Installing"} imsg via Homebrew (${brewExe})...`);
	if (opts?.upgrade) {
		if (!await resolveBrewManagedIMessageCliPath(brewExe, opts.cliPath ?? "imsg")) {
			runtime.log("Keeping the detected imsg binary because Homebrew does not manage it.");
			return { ok: true };
		}
		const update = await runPluginCommandWithTimeout({
			argv: [brewExe, "update"],
			timeoutMs: 3e5
		});
		if (update.code !== 0) return {
			ok: false,
			error: `brew update failed (exit ${update.code}): ${truncateUtf16Safe(update.stderr.trim(), 200)}`
		};
	}
	const command = opts?.upgrade ? ["upgrade", "imsg"] : ["install", "steipete/tap/imsg"];
	const result = await runPluginCommandWithTimeout({
		argv: [brewExe, ...command],
		timeoutMs: 9e5
	});
	if (result.code !== 0) return {
		ok: false,
		error: `brew ${command.join(" ")} failed (exit ${result.code}): ${truncateUtf16Safe(result.stderr.trim(), 200)}`
	};
	const cliPath = await resolveBrewIMessageCliPath(brewExe);
	if (!cliPath) return {
		ok: false,
		error: "brew install succeeded but imsg binary was not found."
	};
	let version;
	try {
		version = (await runPluginCommandWithTimeout({
			argv: [cliPath, "--version"],
			timeoutMs: 1e4
		})).stdout.trim() || void 0;
	} catch {}
	return {
		ok: true,
		cliPath,
		version
	};
}
//#endregion
//#region extensions/imessage/src/setup-surface.ts
const channel = "imessage";
const imessageDetectedBinaryStatus = createDetectedBinaryStatus({
	channelLabel: "iMessage",
	binaryLabel: "imsg",
	...imessageSetupStatusBase,
	resolveBinaryPath: ({ cfg, accountId }) => resolveIMessageAccount({
		cfg,
		accountId
	}).config.cliPath ?? "imsg",
	detectBinary: detectBinary$1
});
const imessageSetupWizard = {
	channel,
	status: {
		...imessageDetectedBinaryStatus,
		async resolveStatusLines(params) {
			const lines = await imessageDetectedBinaryStatus.resolveStatusLines?.(params) ?? [];
			const configuredCliPath = resolveIMessageAccount({
				cfg: params.cfg,
				accountId: params.accountId
			}).config.cliPath;
			const cliPath = configuredCliPath ?? "imsg";
			if (await detectBinary$1(cliPath)) return lines;
			const hint = isAutoManagedIMessageCliPath(cliPath, { explicit: configuredCliPath !== void 0 }) ? `Install imsg on the Messages Mac: ${IMESSAGE_INSTALL_COMMAND}` : `imsg command not found (${cliPath}). Check the configured cliPath or wrapper.`;
			return [...lines, hint];
		}
	},
	prepare: async ({ cfg, accountId, credentialValues, runtime, prompter, options }) => {
		if (!options?.allowIMessageInstall || process.platform !== "darwin") return;
		const credentialCliPath = typeof credentialValues.cliPath === "string" ? credentialValues.cliPath : void 0;
		const configuredCliPath = resolveIMessageAccount({
			cfg,
			accountId
		}).config.cliPath;
		const explicitCliPath = credentialCliPath ?? configuredCliPath;
		const normalizedCliPath = normalizeIMessageCliPathForSetup(explicitCliPath ?? "imsg");
		if (!isAutoManagedIMessageCliPath(normalizedCliPath, { explicit: explicitCliPath !== void 0 })) return;
		const cliDetected = await detectBinary$1(normalizedCliPath);
		if (!await prompter.confirm({
			message: cliDetected ? "imsg detected. Reinstall/update now?" : "imsg not found. Install now?",
			initialValue: !cliDetected
		})) return;
		try {
			await options?.beforePersistentEffect?.();
			const result = await installIMessageCli(runtime, {
				upgrade: cliDetected,
				cliPath: normalizedCliPath
			});
			if (result.ok && result.cliPath) {
				await prompter.note(`Installed imsg at ${result.cliPath}`, "iMessage");
				return { credentialValues: { cliPath: result.cliPath } };
			}
			if (result.ok) await prompter.note(`Using existing imsg at ${normalizedCliPath}; Homebrew does not manage this binary.`, "iMessage");
			if (!result.ok) await prompter.note(result.error ?? "imsg install failed.", "iMessage");
		} catch (error) {
			await prompter.note(`imsg install failed: ${String(error)}`, "iMessage");
		}
	},
	credentials: [],
	textInputs: [createIMessageCliPathTextInput(async ({ currentValue }) => {
		return !await detectBinary$1(currentValue ?? "imsg");
	})],
	completionNote: imessageCompletionNote,
	dmPolicy: imessageDmPolicy,
	disable: (cfg) => setSetupChannelEnabled(cfg, channel, false)
};
//#endregion
export { imessageSetupWizard };
