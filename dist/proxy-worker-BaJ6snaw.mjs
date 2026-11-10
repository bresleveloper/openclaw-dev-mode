import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { r as resolveRuntimeWorkerThreadExecArgv } from "./runtime-worker-url-CvMrvFI1.mjs";
import { n as resolveRuntimeProcessEntrypointUrl } from "./runtime-process-url-BCfqgqXF.mjs";
import { n as createCpuTrackedWorker } from "./worker-cpu-c5lFIb1t.mjs";
import { o as copySecretSentinelDecryptionKey } from "./sentinel-DZP_CK2t.mjs";
//#region src/secrets/egress-proxy/proxy-worker.ts
/** The Gateway exchanges grants and health only; all network bytes stay in this Worker. */
async function startSecretEgressProxyWorker(params) {
	const authority = new Int32Array(new SharedArrayBuffer(4));
	const decryptionKey = copySecretSentinelDecryptionKey();
	const workerUrl = resolveRuntimeProcessEntrypointUrl("secretEgressProxy");
	const worker = createCpuTrackedWorker(workerUrl, {
		execArgv: resolveRuntimeWorkerThreadExecArgv(workerUrl),
		workerData: {
			caDir: params.caDir,
			allowedHosts: params.allowedHosts,
			bypassHosts: params.bypassHosts,
			authority,
			decryptionKey
		},
		stdout: true,
		stderr: true
	});
	decryptionKey.fill(0);
	worker.stdout.resume();
	worker.stderr.resume();
	const ready = createDeferredCore();
	const exited = createDeferredCore();
	const pending = /* @__PURE__ */ new Map();
	let nextId = 0;
	let failure;
	let stopping;
	const fail = () => {
		if (failure) return;
		failure = /* @__PURE__ */ new Error("Secret egress proxy Worker is unavailable; restart the Gateway.");
		Atomics.store(authority, 0, 1);
		ready.reject(failure);
		for (const request of pending.values()) request.reject(failure);
		pending.clear();
		if (!stopping) params.onFailure?.();
	};
	worker.on("error", fail);
	worker.once("exit", (code) => {
		if (!stopping || code !== 0 || pending.size > 0) fail();
		exited.resolve();
	});
	worker.on("message", (message) => {
		if (message.kind === "ready") ready.resolve(message);
		else if (message.kind === "fatal") fail();
		else if (message.kind === "audit") params.onAudit(message.event);
		else {
			const request = pending.get(message.id);
			pending.delete(message.id);
			if (message.kind === "failed") request?.reject(/* @__PURE__ */ new Error("Secret egress proxy operation failed."));
			else request?.resolve(message);
		}
	});
	const request = (command) => {
		if (failure) return Promise.reject(failure);
		const deferred = createDeferredCore();
		pending.set(command.id, deferred);
		try {
			worker.postMessage(command, []);
		} catch {
			fail();
		}
		return deferred.promise;
	};
	let address;
	try {
		address = await ready.promise;
	} catch (error) {
		await exited.promise;
		throw error;
	}
	return {
		caCertPath: address.caCertPath,
		proxyOrigin: address.proxyOrigin,
		registerProcess: async (bindings = []) => {
			if (Atomics.load(authority, 0) !== 0) throw failure ?? /* @__PURE__ */ new Error("Secret egress proxy has stopped");
			const grantAuthority = new Int32Array(new SharedArrayBuffer(4));
			const id = ++nextId;
			const reply = await request({
				kind: "register",
				id,
				bindings,
				authority: grantAuthority
			});
			if (reply.kind !== "registered" || Atomics.load(authority, 0) !== 0) throw failure ?? /* @__PURE__ */ new Error("Secret egress proxy has stopped");
			return {
				env: reply.env,
				revoke: () => {
					if (Atomics.exchange(grantAuthority, 0, 1) === 0 && !failure && !stopping) worker.postMessage({
						kind: "revoke",
						id
					}, []);
				}
			};
		},
		getCertificateStatus: async () => {
			if (stopping) throw new Error("Secret egress proxy has stopped");
			const reply = await request({
				kind: "status",
				id: ++nextId
			});
			if (reply.kind !== "status") throw new Error("Secret egress proxy health unavailable");
			return reply.status;
		},
		stop: () => {
			Atomics.store(authority, 0, 1);
			return stopping ??= (async () => {
				try {
					if (!failure) await request({
						kind: "stop",
						id: ++nextId
					});
				} finally {
					await exited.promise;
				}
			})();
		}
	};
}
//#endregion
export { startSecretEgressProxyWorker as t };
