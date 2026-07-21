import { t as formatCliCommand } from "./command-format-H_Arqann.js";
import { r as defaultRuntime } from "./runtime-Bz6o617W.js";
import { s as success, t as danger } from "./globals-BElpud1m.js";
import { r as logInfo } from "./logger-D7QYAmug.js";
import { i as getRuntimeConfig } from "./io-DxnOT4sF.js";
import "./logging-core-w7LEX8Sa.js";
import { t as renderQrTerminal } from "./qr-terminal-74jn4ch4.js";
import "./runtime-config-snapshot-Bad5bZfJ.js";
import "./runtime-env-Ds0QYZS5.js";
import "./cli-runtime-DJOXyIoh.js";
import { a as resolveWhatsAppAccount } from "./accounts-CTXNcJZ8.js";
import { a as resolveWhatsAppSocketTiming } from "./socket-timing-nmoE1btQ.js";
import { y as restoreCredsFromBackupIfNeeded } from "./auth-store-Cmf6GUiW.js";
import { t as createWaSocket } from "./session-Bl3_JezT.js";
import { a as closeWaSocketSoon, o as waitForWhatsAppLoginResult } from "./connection-controller-CLPANvIP.js";
//#region extensions/whatsapp/src/login.ts
const QR_LINK_INSTRUCTION = "Open the WhatsApp app, go to Linked Devices, then scan this QR:";
const CLEAR_TERMINAL = "\x1B[2J\x1B[H";
async function loginWeb(verbose, waitForConnection, runtime = defaultRuntime, accountId) {
	const cfg = getRuntimeConfig();
	const account = resolveWhatsAppAccount({
		cfg,
		accountId
	});
	const socketTiming = resolveWhatsAppSocketTiming(cfg);
	const restoredFromBackup = await restoreCredsFromBackupIfNeeded(account.authDir);
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
		onQr
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
			onSocketReplaced: (replacementSock) => {
				sock = replacementSock;
			}
		});
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
export { loginWeb as t };
