import { d as toErrorObject } from "./error-coercion-BwMr25F8.mjs";
import { n as isErrno } from "./errno-FR4CRyya.mjs";
import "./errors-DPfGDWk1.mjs";
import net from "node:net";
//#region src/infra/ports-probe.ts
const PORT_PROBE_HOSTS = [
	"127.0.0.1",
	"0.0.0.0",
	"::1",
	"::"
];
const LOOPBACK_PORT_PROBE_HOSTS = ["127.0.0.1"];
async function tryListenOnPort(params) {
	if (params.signal?.aborted) throw params.signal.reason;
	const listenOptions = { port: params.port };
	if (params.host) listenOptions.host = params.host;
	if (typeof params.exclusive === "boolean") listenOptions.exclusive = params.exclusive;
	if (params.signal) listenOptions.signal = params.signal;
	return await new Promise((resolve, reject) => {
		const clearAbort = () => params.signal?.removeEventListener("abort", onAbort);
		const onAbort = () => {
			clearAbort();
			reject(toErrorObject(params.signal?.reason, "Port check aborted"));
		};
		params.signal?.addEventListener("abort", onAbort, { once: true });
		const tester = net.createServer().once("error", (error) => {
			clearAbort();
			reject(error);
		}).once("listening", () => {
			const address = tester.address();
			tester.close(() => {
				clearAbort();
				if (!address || typeof address === "string") reject(/* @__PURE__ */ new Error("expected TCP listener address"));
				else resolve(params.port === 0 ? address.port : void 0);
			});
		}).listen(listenOptions);
	});
}
/** Observe a listener without retaining its socket or cancellation hook. */
async function probeTcpListener(port, host, signal, deadlineMs) {
	signal?.throwIfAborted();
	const timeoutMs = deadlineMs === void 0 ? 250 : deadlineMs - Date.now();
	if (timeoutMs <= 0) return "unknown";
	return await new Promise((resolve) => {
		const socket = net.connect({
			host,
			port
		});
		let result = "unknown";
		const destroy = () => socket.destroy();
		signal?.addEventListener("abort", destroy, { once: true });
		socket.once("connect", () => {
			result = "busy";
			destroy();
		});
		socket.once("error", (error) => {
			result = isErrno(error) && error.code === "ECONNREFUSED" ? "free" : "unknown";
			destroy();
		});
		socket.setTimeout(timeoutMs, destroy);
		socket.once("close", () => {
			signal?.removeEventListener("abort", destroy);
			resolve(result);
		});
	});
}
async function isIpv6LoopbackUnavailable(signal) {
	try {
		await tryListenOnPort({
			port: 0,
			host: "::1",
			...signal ? { signal } : {}
		});
		return false;
	} catch (err) {
		return isErrno(err) && err.code === "EADDRNOTAVAIL";
	}
}
async function probePortOnHost(port, host, signal, deadlineMs) {
	try {
		await tryListenOnPort({
			port,
			host,
			exclusive: true,
			...signal ? { signal } : {}
		});
		const confirmed = await probeTcpListener(port, host, signal, deadlineMs);
		if (confirmed === "unknown" && host === "::" && await isIpv6LoopbackUnavailable(signal)) return "free";
		return confirmed;
	} catch (err) {
		signal?.throwIfAborted();
		if (isErrno(err) && err.code === "EADDRINUSE") return "busy";
		if (isErrno(err) && (err.code === "EADDRNOTAVAIL" || err.code === "EAFNOSUPPORT")) return "skip";
		return "unknown";
	}
}
/** Checks selected local addresses without resolving listener diagnostics. */
async function probePortUsage(port, probeHosts = PORT_PROBE_HOSTS, signal, deadlineMs) {
	signal?.throwIfAborted();
	let sawUnknown = false;
	for (const host of probeHosts) {
		const result = await probePortOnHost(port, host, signal, deadlineMs);
		signal?.throwIfAborted();
		if (result === "busy") return "busy";
		if (result === "unknown") sawUnknown = true;
	}
	return sawUnknown ? "unknown" : "free";
}
//#endregion
export { tryListenOnPort as i, probePortUsage as n, probeTcpListener as r, LOOPBACK_PORT_PROBE_HOSTS as t };
