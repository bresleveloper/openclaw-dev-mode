import { t as __exportAll } from "./rolldown-runtime-BBjsoOtd.mjs";
import { a as resolveWhatsAppAccount } from "./accounts-F0vHuze2.mjs";
import { y as restoreCredsFromBackupIfNeeded } from "./auth-store-D2rN-hP5.mjs";
import { _ as renderQrTerminal, h as resolveWhatsAppSocketTiming, r as createWaSocket } from "./socket-close-ecLUztyz.mjs";
import { a as closeWaSocketSoon, o as waitForWhatsAppLoginResult } from "./connection-controller-CoQ6I_sh.mjs";
import { formatCliCommand } from "openclaw/plugin-sdk/cli-runtime";
import { logInfo } from "openclaw/plugin-sdk/logging-core";
import { danger, defaultRuntime, success } from "openclaw/plugin-sdk/runtime-env";
import { createDeferred } from "openclaw/plugin-sdk/extension-shared";
import { getRuntimeConfig } from "openclaw/plugin-sdk/runtime-config-snapshot";
//#region extensions/whatsapp/src/login.ts
var login_exports = /* @__PURE__ */ __exportAll({ loginWeb: () => loginWeb });
const QR_LINK_INSTRUCTION = "Open the WhatsApp app, go to Linked Devices, then scan this QR:";
const CLEAR_TERMINAL = "\x1B[2J\x1B[H";
async function loginWeb(verbose, waitForConnection, runtime = defaultRuntime, accountId, options) {
	const cfg = getRuntimeConfig();
	const account = resolveWhatsAppAccount({
		cfg,
		accountId
	});
	const socketTiming = resolveWhatsAppSocketTiming();
	const restoredFromBackup = await restoreCredsFromBackupIfNeeded(account.authDir, { beforeCredentialPersistence: options?.beforeCredentialPersistence });
	const credentialPersistenceState = { failure: null };
	const credentialPersistenceFailure = createDeferred();
	const onCredentialPersistenceError = (error) => {
		if (credentialPersistenceState.failure) return;
		credentialPersistenceState.failure = { error };
		credentialPersistenceFailure.resolve(credentialPersistenceState.failure);
	};
	const credentialPersistenceTasks = /* @__PURE__ */ new Set();
	const onCredentialPersistenceTask = (task) => {
		credentialPersistenceTasks.add(task);
		task.then(() => credentialPersistenceTasks.delete(task), () => credentialPersistenceTasks.delete(task));
	};
	const waitForCredentialPersistence = async () => {
		await new Promise((resolve) => {
			setImmediate(resolve);
		});
		while (credentialPersistenceTasks.size > 0) await Promise.allSettled(credentialPersistenceTasks);
	};
	const credentialPersistenceOptions = options?.beforeCredentialPersistence ? {
		beforeCredentialPersistence: async () => {
			try {
				await options.beforeCredentialPersistence?.();
			} catch (error) {
				onCredentialPersistenceError(error);
				throw error;
			}
		},
		onCredentialPersistenceError,
		onCredentialPersistenceTask
	} : {};
	let qrVersion = 0;
	const onQr = (qr) => {
		const currentQrVersion = ++qrVersion;
		renderQrTerminal(qr, { small: true }).then((output) => {
			if (currentQrVersion !== qrVersion) return;
			const refreshPrefix = currentQrVersion > 1 && process.stdout.isTTY ? CLEAR_TERMINAL : "";
			const renderedQr = output.endsWith("\n") ? output.slice(0, -1) : output;
			runtime.log(`${refreshPrefix}${QR_LINK_INSTRUCTION}\n${renderedQr}`);
		}).catch((err) => {
			if (currentQrVersion !== qrVersion) return;
			runtime.error(`failed rendering WhatsApp QR: ${String(err)}`);
		});
	};
	let sock = await createWaSocket(false, verbose, {
		authDir: account.authDir,
		...socketTiming,
		onQr,
		...credentialPersistenceOptions
	});
	logInfo("Waiting for WhatsApp connection...", runtime);
	try {
		const result = await waitForWhatsAppLoginResult({
			sock,
			authDir: account.authDir,
			isLegacyAuthDir: account.isLegacyAuthDir,
			verbose,
			runtime,
			waitForConnection,
			socketTiming,
			onQr,
			...credentialPersistenceOptions,
			...options?.beforeCredentialPersistence ? {
				credentialPersistenceFailure: credentialPersistenceFailure.promise,
				getCredentialPersistenceFailure: () => credentialPersistenceState.failure,
				waitForCredentialPersistence
			} : {},
			onSocketReplaced: (replacementSock) => {
				sock = replacementSock;
			}
		});
		if (credentialPersistenceState.failure) throw credentialPersistenceState.failure.error;
		if (result.outcome === "connected") {
			runtime.log(success(result.restarted ? "✅ Linked after restart; web session ready." : restoredFromBackup ? "✅ Recovered from creds.json.bak; web session ready." : "✅ Linked! Credentials saved for future sends."));
			return;
		}
		if (result.outcome === "logged-out") {
			runtime.error(danger(`WhatsApp reported the session is logged out. Cleared cached web session; please rerun ${formatCliCommand("openclaw channels login")} and scan the QR again.`));
			throw new Error("Session logged out; cache cleared. Re-run login.", { cause: result.error });
		}
		runtime.error(danger(`WhatsApp Web connection ended before fully opening. ${result.message}`));
		throw new Error(result.message, { cause: result.error });
	} finally {
		closeWaSocketSoon(sock);
	}
}
//#endregion
export { login_exports as n, loginWeb as t };
