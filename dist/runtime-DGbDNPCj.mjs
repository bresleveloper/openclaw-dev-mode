import { r as resolveStateDir } from "./state-dir-C8s3cOPX.mjs";
import "./paths-orClZ-2Z.mjs";
import { s as emitTrustedDiagnosticEvent } from "./diagnostic-events-C91J-XX8.mjs";
import { t as createSubsystemLogger } from "./subsystem-mStysHHC.mjs";
import { i as publishSecretEgressProxy, t as clearSecretEgressProxy } from "./registry-vAykEA0u.mjs";
import { t as startSecretEgressProxyWorker } from "./proxy-worker-BaJ6snaw.mjs";
import fs from "node:fs";
import path from "node:path";
//#region src/secrets/egress-proxy/runtime.ts
const log = createSubsystemLogger("secrets/egress-proxy");
const SECRET_EGRESS_PROXY_DIR_MODE = 448;
function removeProxyDirBestEffort(proxyDir) {
	try {
		fs.rmSync(proxyDir, {
			recursive: true,
			force: true
		});
		fs.rmdirSync(path.dirname(proxyDir));
	} catch {}
}
function removeStaleProxyDirs(parentDir) {
	for (const entry of fs.readdirSync(parentDir, { withFileTypes: true })) if (entry.isDirectory() && entry.name.startsWith("gateway-")) fs.rmSync(path.join(parentDir, entry.name), {
		recursive: true,
		force: true
	});
}
/** Starts the process-local proxy and registers it as the current Gateway owner. */
async function startGatewaySecretEgressProxy(params) {
	const parentDir = path.join(resolveStateDir(), "secret-egress-proxy");
	fs.mkdirSync(parentDir, {
		recursive: true,
		mode: SECRET_EGRESS_PROXY_DIR_MODE
	});
	fs.chmodSync(parentDir, SECRET_EGRESS_PROXY_DIR_MODE);
	removeStaleProxyDirs(parentDir);
	const proxyDir = fs.mkdtempSync(path.join(parentDir, "gateway-"));
	fs.chmodSync(proxyDir, SECRET_EGRESS_PROXY_DIR_MODE);
	let proxy;
	let handle;
	try {
		proxy = await startSecretEgressProxyWorker({
			caDir: proxyDir,
			...params.allowedHosts !== void 0 ? { allowedHosts: params.allowedHosts } : {},
			...params.bypassHosts ? { bypassHosts: params.bypassHosts } : {},
			onFailure: () => {
				log.error("secret egress proxy Worker stopped; restart the Gateway to restore protected egress");
				if (handle) handle.stop().catch(() => {});
			},
			onAudit: (event) => {
				emitTrustedDiagnosticEvent({
					type: "secret.egress",
					outcome: event.kind,
					substituted: event.substituted
				});
				if (event.reason === "certificate-error") log.warn("secret egress TLS certificate unavailable; check OpenSSL and the system clock, then retry", event);
				else if (event.kind === "refused" || event.substituted) log.info("secret egress request", event);
				else log.debug("secret egress request", event);
			}
		});
		const ownedProxy = proxy;
		const cleanupOnProcessExit = () => removeProxyDirBestEffort(proxyDir);
		process.once("exit", cleanupOnProcessExit);
		const ownedHandle = {
			...ownedProxy,
			stop: async () => {
				clearSecretEgressProxy(ownedHandle);
				process.off("exit", cleanupOnProcessExit);
				try {
					await ownedProxy.stop();
				} finally {
					removeProxyDirBestEffort(proxyDir);
				}
			}
		};
		handle = ownedHandle;
		publishSecretEgressProxy(ownedHandle);
		return ownedHandle;
	} catch (error) {
		await proxy?.stop().catch(() => void 0);
		removeProxyDirBestEffort(proxyDir);
		throw error;
	}
}
//#endregion
export { startGatewaySecretEgressProxy };
