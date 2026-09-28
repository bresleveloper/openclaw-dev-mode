import { l as resolveIMessageRemoteHost, o as resolveIMessageAccount, r as listEnabledIMessageAccounts, s as resolveIMessageDuplicateSourceOwner } from "./accounts-CUxZrTcY.mjs";
import { _ as imessageDmPolicy, b as isAutoManagedIMessageCliPath, d as probeIMessage, g as imessageCompletionNote, m as createIMessageCliPathTextInput, p as IMESSAGE_INSTALL_COMMAND, x as normalizeIMessageCliPathForSetup, y as imessageSetupStatusBase } from "./group-policy-Cjztkquv.mjs";
import { t as IMESSAGE_LEGACY_OUTBOUND_SEND_DEP_KEYS } from "./outbound-send-deps-B-QEsLSM.mjs";
import { t as sendMessageIMessage } from "./send-odAfTQ2J.mjs";
import { t as monitorIMessageProvider } from "./monitor-BJ3Ozi6I.mjs";
import { createAccountStatusSink, resolveOutboundSendDep } from "openclaw/plugin-sdk/channel-outbound";
import path from "node:path";
import { resolveChannelMediaMaxBytes } from "openclaw/plugin-sdk/account-helpers";
import fs from "node:fs/promises";
import { createDetectedBinaryStatus, setSetupChannelEnabled } from "openclaw/plugin-sdk/setup";
import { truncateUtf16Safe } from "openclaw/plugin-sdk/text-utility-runtime";
import { detectBinary as detectBinary$1, resolveBrewExecutable } from "openclaw/plugin-sdk/setup-tools";
import { runPluginCommandWithTimeout } from "openclaw/plugin-sdk/run-command";
//#region extensions/imessage/src/install-imsg.ts
const IMESSAGE_BREW_FORMULA = "steipete/tap/imsg";
function isPathInside(parentPath, candidatePath) {
	const relative = path.relative(parentPath, candidatePath);
	return relative.length > 0 && relative !== ".." && !relative.startsWith(`..${path.sep}`) && !path.isAbsolute(relative);
}
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
		return isPathInside(realFormulaPath, realCliPath) ? resolvedCliPath : null;
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
	configuredLabel: imessageSetupStatusBase.configuredLabel,
	unconfiguredLabel: imessageSetupStatusBase.unconfiguredLabel,
	configuredHint: imessageSetupStatusBase.configuredHint,
	unconfiguredHint: imessageSetupStatusBase.unconfiguredHint,
	configuredScore: imessageSetupStatusBase.configuredScore,
	unconfiguredScore: imessageSetupStatusBase.unconfiguredScore,
	resolveConfigured: imessageSetupStatusBase.resolveConfigured,
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
//#region extensions/imessage/src/channel.runtime.ts
async function sendIMessageOutbound(params) {
	const send = resolveOutboundSendDep(params.deps, "imessage", { legacyKeys: IMESSAGE_LEGACY_OUTBOUND_SEND_DEP_KEYS }) ?? sendMessageIMessage;
	const maxBytes = resolveChannelMediaMaxBytes({
		cfg: params.cfg,
		resolveChannelLimitMb: () => resolveIMessageAccount(params).config.mediaMaxMb
	});
	const result = await send(params.to, params.text, {
		config: params.cfg,
		...params.mediaUrl ? { mediaUrl: params.mediaUrl } : {},
		...params.mediaAccess ? { mediaAccess: params.mediaAccess } : {},
		...params.mediaLocalRoots?.length ? { mediaLocalRoots: params.mediaLocalRoots } : {},
		...params.mediaReadFile ? { mediaReadFile: params.mediaReadFile } : {},
		...params.audioAsVoice ? { audioAsVoice: true } : {},
		maxBytes,
		accountId: params.accountId ?? void 0,
		replyToId: params.replyToId ?? void 0,
		conversationReadOrigin: params.conversationReadOrigin,
		assertDirectAdapterHandoff: params.assertDirectAdapterHandoff,
		onPlatformSendDispatch: params.onPlatformSendDispatch,
		...params.onDeliveryResult ? { onDeliveryResult: params.onDeliveryResult } : {}
	});
	const meta = {
		...result.meta,
		...result.guid ? { imessageMessageGuid: result.guid } : {},
		...result.sentText ? { imessageVisibleText: result.sentText } : {}
	};
	return Object.keys(meta).length > 0 ? {
		...result,
		meta
	} : result;
}
async function probeIMessageAccount(params) {
	return await probeIMessage(params?.timeoutMs, {
		cliPath: params?.cliPath,
		dbPath: params?.dbPath,
		remoteHost: params?.remoteHost,
		forceRefresh: true
	});
}
async function startIMessageGatewayAccount(ctx) {
	const account = ctx.account;
	const cliPath = account.config.cliPath?.trim() || "imsg";
	const dbPath = account.config.dbPath?.trim();
	ctx.setStatus({
		accountId: account.accountId,
		cliPath,
		dbPath: dbPath ?? null
	});
	await Promise.all(listEnabledIMessageAccounts(ctx.cfg).map(async (candidate) => {
		await resolveIMessageRemoteHost({
			cliPath: candidate.config.cliPath?.trim() || "imsg",
			remoteHost: candidate.config.remoteHost
		});
	}));
	const ownerAccountId = resolveIMessageDuplicateSourceOwner({
		cfg: ctx.cfg,
		account
	});
	if (ownerAccountId) {
		ctx.log?.info?.(`[${account.accountId}] skipping watcher: duplicate iMessage source; using account "${ownerAccountId}"`);
		if (ctx.abortSignal.aborted) return;
		await new Promise((resolve) => {
			ctx.abortSignal.addEventListener("abort", () => resolve(), { once: true });
		});
		return;
	}
	const statusSink = createAccountStatusSink({
		accountId: account.accountId,
		setStatus: ctx.setStatus
	});
	statusSink({ lifecycle: "starting" });
	ctx.log?.info?.(`[${account.accountId}] starting provider (${cliPath}${dbPath ? ` db=${dbPath}` : ""})`);
	return await monitorIMessageProvider({
		accountId: account.accountId,
		config: ctx.cfg,
		runtime: ctx.runtime,
		abortSignal: ctx.abortSignal,
		channelRuntime: ctx.channelRuntime,
		statusSink
	});
}
//#endregion
export { imessageSetupWizard, probeIMessageAccount, sendIMessageOutbound, startIMessageGatewayAccount };
