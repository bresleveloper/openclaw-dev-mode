import { l as resolveSecretSentinel } from "../../sentinel-D8TyDpFw.mjs";
import { t as startSecretEgressProxyServer } from "../../proxy-server-CWrSvdJC.mjs";
import { parentPort, workerData } from "node:worker_threads";
//#region src/secrets/egress-proxy/proxy.worker.ts
const port = parentPort;
const data = workerData;
const send = (message) => port.postMessage(message);
try {
	const proxy = await startSecretEgressProxyServer({
		caDir: data.caDir,
		allowedHosts: data.allowedHosts,
		bypassHosts: data.bypassHosts,
		resolveSentinel: (sentinel) => resolveSecretSentinel(sentinel, data.decryptionKey),
		onAudit: (event) => send({
			kind: "audit",
			event
		})
	});
	const grants = /* @__PURE__ */ new Map();
	port.on("message", (command) => {
		(async () => {
			switch (command.kind) {
				case "register": {
					const grant = proxy.registerProcess(command.bindings, () => Atomics.load(data.authority, 0) === 0 && Atomics.load(command.authority, 0) === 0);
					grants.set(command.id, grant);
					send({
						kind: "registered",
						id: command.id,
						env: grant.env
					});
					break;
				}
				case "revoke":
					grants.get(command.id)?.revoke();
					grants.delete(command.id);
					break;
				case "status":
					send({
						kind: "status",
						id: command.id,
						status: proxy.getCertificateStatus()
					});
					break;
				case "stop":
					await proxy.stop();
					grants.clear();
					data.decryptionKey.fill(0);
					send({
						kind: "stopped",
						id: command.id
					});
					port.close();
			}
		})().catch(() => send({
			kind: "failed",
			id: command.id
		}));
	});
	send({
		kind: "ready",
		caCertPath: proxy.caCertPath,
		proxyOrigin: proxy.proxyOrigin
	});
} catch {
	send({ kind: "fatal" });
	port.close();
}
//#endregion
export {};
