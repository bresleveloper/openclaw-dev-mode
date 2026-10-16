//#region src/node-host/launcher-client.ts
const CHILD_MARKER = Symbol.for("openclaw.node-host.launcher-child");
const MANAGED_STATE_MARKER = Symbol.for("openclaw.node-host.managed-state-path");
/** A companion retains stdin's write end; EOF also retires the node after an app crash. */
function watchNodeHostParentStdin(onClose) {
	const input = process.stdin;
	let closed = false;
	const close = () => {
		if (!closed) {
			closed = true;
			onClose();
		}
	};
	input.once("end", close);
	input.once("error", close);
	input.once("close", close);
	input.resume();
	if (input.readableEnded || input.destroyed) queueMicrotask(close);
	return () => {
		closed = true;
		input.off("end", close);
		input.off("error", close);
		input.off("close", close);
		input.pause();
	};
}
function isNodeHostLauncherChild() {
	return Reflect.get(process, CHILD_MARKER) === true && process.connected;
}
function getManagedNodeHostStatePath() {
	if (!isNodeHostLauncherChild()) return;
	const path = Reflect.get(process, MANAGED_STATE_MARKER);
	return typeof path === "string" ? path : void 0;
}
function sendLauncherMessage(message) {
	return new Promise((resolve, reject) => {
		if (!isNodeHostLauncherChild() || !process.send) {
			reject(/* @__PURE__ */ new Error("The node runtime has no connected update supervisor."));
			return;
		}
		process.send(message, (error) => error ? reject(error) : resolve());
	});
}
async function notifyNodeHostLauncherReady(version) {
	if (isNodeHostLauncherChild()) await sendLauncherMessage({
		type: "openclaw.node.ready",
		version
	});
}
async function setNodeHostLauncherRestartArguments(argv) {
	if (isNodeHostLauncherChild()) await sendLauncherMessage({
		type: "openclaw.node.restart-args",
		argv
	});
}
function requestNodeHostLauncherBootstrap(params) {
	return requestLauncherReply({
		type: "openclaw.node.bootstrap",
		...params
	}, "openclaw.node.bootstrap-result");
}
function requestNodeHostLauncherRestart(params) {
	return requestLauncherReply({
		type: "openclaw.node.restart",
		...params
	}, "openclaw.node.restart-result");
}
function requestLauncherReply(request, responseType) {
	return new Promise((resolve, reject) => {
		const cleanup = () => {
			clearTimeout(timer);
			process.off("message", onMessage);
			process.off("disconnect", onDisconnect);
			process.channel?.unref();
		};
		const fail = (error) => {
			cleanup();
			reject(error);
		};
		const onDisconnect = () => fail(/* @__PURE__ */ new Error("The node update supervisor disconnected."));
		const onMessage = (message) => {
			if (!message || typeof message !== "object" || !("type" in message) || message.type !== responseType) return;
			cleanup();
			if ("ok" in message && message.ok === true) resolve();
			else reject(new Error("error" in message && typeof message.error === "string" ? message.error : "The node update supervisor rejected the restart."));
		};
		const timer = setTimeout(() => fail(/* @__PURE__ */ new Error("The node update supervisor did not acknowledge the restart.")), 3e4);
		process.on("message", onMessage);
		process.once("disconnect", onDisconnect);
		sendLauncherMessage(request).catch(fail);
	});
}
//#endregion
export { requestNodeHostLauncherRestart as a, requestNodeHostLauncherBootstrap as i, isNodeHostLauncherChild as n, setNodeHostLauncherRestartArguments as o, notifyNodeHostLauncherReady as r, watchNodeHostParentStdin as s, getManagedNodeHostStatePath as t };
