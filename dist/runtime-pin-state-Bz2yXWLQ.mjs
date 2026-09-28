import { g as resolveNodeServiceIdentityEnvironment } from "./constants-CJCmIHb-.mjs";
import { Et as _enum, Fn as object, Jn as string, xn as literal } from "./schemas-BOYIvvln.mjs";
import { m as resolveConfigPathCandidate } from "./paths-DehQwyE0.mjs";
import { n as sha256Hex } from "./node-crypto-Df3MIs6V.mjs";
import "./crypto-digest-D9Nqq3c7.mjs";
import { n as readConfigMachineState } from "./config-machine-state-BfMkd608.mjs";
import { r as updateConfigMachineState } from "./config-machine-state-write-CSLKAek3.mjs";
import { s as resolveSystemdServiceName } from "./systemd-service-files-tGuARbbA.mjs";
import { n as resolveLaunchAgentLabel } from "./launchd-label-i3x9UrUR.mjs";
import { a as resolveManagedGatewayServiceCommand } from "./service-types-d44oynyj.mjs";
import { u as resolveTaskName } from "./schtasks-layout-ZxN1sGLi.mjs";
//#region src/daemon/runtime-pin-state.ts
/** Explicit runtime intent, owned by a managed service in the canonical machine-state store. */
const pinSchema = object({
	runtime: _enum(["node", "bun"]),
	path: string().min(1)
});
const recordSchema = object({
	version: literal(1),
	pin: pinSchema,
	definition: string()
});
function resolveScope({ kind, env }) {
	const nativeEnv = kind === "node" ? {
		...env,
		...resolveNodeServiceIdentityEnvironment()
	} : env;
	const name = process.platform === "darwin" ? resolveLaunchAgentLabel(nativeEnv) : process.platform === "win32" ? resolveTaskName(nativeEnv).toLowerCase() : resolveSystemdServiceName(nativeEnv);
	return {
		key: `daemon-runtime-pin:${sha256Hex(JSON.stringify([
			kind,
			process.platform,
			name,
			resolveConfigPathCandidate(env)
		]))}`,
		options: { env }
	};
}
function revision(value) {
	return sha256Hex(JSON.stringify(value ?? null));
}
function definition(command) {
	const managed = resolveManagedGatewayServiceCommand(command);
	if (!managed) return;
	return sha256Hex(JSON.stringify([managed.programArguments, managed.workingDirectory ?? null]));
}
/** Missing definitions have no live pin. An altered definition must be intentionally re-pinned. */
function readDaemonRuntimePin(scope, command) {
	const { key, options } = resolveScope(scope);
	const value = readConfigMachineState(key, options, { artifactPreservingReadOnly: true });
	const snapshot = {
		revision: revision(value),
		stored: value !== void 0,
		definition: definition(command)
	};
	if (value === void 0 || !command) return snapshot;
	const record = recordSchema.parse(value);
	if (record.definition !== definition(command)) throw new Error("Managed service changed since its runtime pin was saved. Reinstall with an explicit --runtime or --runtime-path to select runtime intent.");
	return {
		...snapshot,
		pin: record.pin
	};
}
/** Explicit install selection may replace obsolete metadata without adopting it. */
function readDaemonRuntimePinForInstall(scope, command, explicit) {
	return {
		...readDaemonRuntimePin(scope, explicit ? null : command),
		definition: definition(command)
	};
}
/** Called while holding the native service operation lock, before any service side effect. */
function assertDaemonRuntimePinCurrent(scope, expected) {
	const { key, options } = resolveScope(scope);
	if (revision(readConfigMachineState(key, options, { artifactPreservingReadOnly: true })) !== expected.revision) throw new Error("Runtime pin changed during service planning; rerun the install.");
}
/** The native definition is verified by the caller; the synchronous transaction rejects stale writes. */
function commitDaemonRuntimePin(scope, update, command) {
	const { key, options } = resolveScope(scope);
	if (!update.pin && update.expected.revision === revision(void 0)) {
		assertDaemonRuntimePinCurrent(scope, update.expected);
		return;
	}
	const binding = definition(command);
	if (update.pin && !binding) throw new Error("Cannot save a runtime pin without a managed service definition.");
	updateConfigMachineState(key, (current) => {
		if (revision(current) !== update.expected.revision) throw new Error("Runtime pin changed before persistence; service may have changed, rerun install with an explicit runtime selection.");
		return update.pin ? {
			version: 1,
			pin: pinSchema.parse(update.pin),
			definition: binding
		} : void 0;
	}, options);
}
function assertDaemonRuntimePinDefinition(expected, actual) {
	if (definition(expected) !== definition(actual)) throw new Error("Managed service readback differs from the runtime pin plan; pin metadata was not changed.");
}
/** Revalidate the inspected managed definition after acquiring native mutation custody. */
function assertDaemonRuntimePinPlan(expected, command) {
	if (expected.definition !== definition(command)) throw new Error("Managed service changed during runtime pin planning; rerun the install.");
}
//#endregion
export { readDaemonRuntimePin as a, commitDaemonRuntimePin as i, assertDaemonRuntimePinDefinition as n, readDaemonRuntimePinForInstall as o, assertDaemonRuntimePinPlan as r, assertDaemonRuntimePinCurrent as t };
