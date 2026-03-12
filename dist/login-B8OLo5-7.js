import { n as info, t as danger, u as success } from "./globals-BozXJ-QJ.js";
import { Ws as loadConfig } from "./model-selection-BRhJAUKb.js";
import { p as defaultRuntime } from "./subsystem-NSiOA8hi.js";
import { r as logInfo } from "./logger-CX3t1bKz.js";
import { t as formatCliCommand } from "./command-format-Dl98Vqkn.js";
import { U as resolveWhatsAppAccount, Y as logoutWeb } from "./plugins-7t5A5YJP.js";
import { i as waitForWaConnection, n as formatError, t as createWaSocket } from "./session-DPizSM5T.js";
import { DisconnectReason } from "@whiskeysockets/baileys";
//#region src/web/login.ts
async function loginWeb(verbose, waitForConnection, runtime = defaultRuntime, accountId) {
	const wait = waitForConnection ?? waitForWaConnection;
	const account = resolveWhatsAppAccount({
		cfg: loadConfig(),
		accountId
	});
	const sock = await createWaSocket(true, verbose, { authDir: account.authDir });
	logInfo("Waiting for WhatsApp connection...", runtime);
	try {
		await wait(sock);
		console.log(success("✅ Linked! Credentials saved for future sends."));
	} catch (err) {
		const code = err?.error?.output?.statusCode ?? err?.output?.statusCode;
		if (code === 515) {
			console.log(info("WhatsApp asked for a restart after pairing (code 515); creds are saved. Restarting connection once…"));
			try {
				sock.ws?.close();
			} catch {}
			const retry = await createWaSocket(false, verbose, { authDir: account.authDir });
			try {
				await wait(retry);
				console.log(success("✅ Linked after restart; web session ready."));
				return;
			} finally {
				setTimeout(() => retry.ws?.close(), 500);
			}
		}
		if (code === DisconnectReason.loggedOut) {
			await logoutWeb({
				authDir: account.authDir,
				isLegacyAuthDir: account.isLegacyAuthDir,
				runtime
			});
			console.error(danger(`WhatsApp reported the session is logged out. Cleared cached web session; please rerun ${formatCliCommand("openclaw channels login")} and scan the QR again.`));
			throw new Error("Session logged out; cache cleared. Re-run login.", { cause: err });
		}
		const formatted = formatError(err);
		console.error(danger(`WhatsApp Web connection ended before fully opening. ${formatted}`));
		throw new Error(formatted, { cause: err });
	} finally {
		setTimeout(() => {
			try {
				sock.ws?.close();
			} catch {}
		}, 500);
	}
}
//#endregion
export { loginWeb as t };
