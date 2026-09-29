import { n as resolveOpenClawPackageRoot } from "./openclaw-root-Cur9Uhkp.mjs";
import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { l as withGatewayServiceUpdateAuthority } from "./service-update-authority-DujRnzx9.mjs";
import { D as resolveUpdateInstallRoot } from "./restart-sentinel-KM6PPxhT.mjs";
import { a as withGatewayServiceRebindCapture } from "./service-rebind-CZ92-EFp.mjs";
import { o as withDelegatedUpdateCommandExecutor } from "./update-command-executor-DDhDn9_F.mjs";
import { n as writeGatewayServiceUpdateCapability } from "./update-capability-BmokDcYV.mjs";
//#region src/cli/daemon-cli/update-executor.ts
/** Private stdin is withheld by the updater until the actual PID/start is bound.
* A capability probe never loads the action implementation or consumes a grant. */
async function runGatewayServiceUpdateCommand(mode, action, operation) {
	if (mode === void 0) {
		await operation();
		return;
	}
	if (mode === "check") {
		await writeGatewayServiceUpdateCapability();
		return;
	}
	if (mode !== "run") throw new Error("Unsupported update-owned native command mode.");
	try {
		const chunks = [];
		let bytes = 0;
		for await (const chunk of process.stdin) {
			const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
			bytes += buffer.byteLength;
			if (bytes > 65536) throw new Error("Update executor input exceeds its bound.");
			chunks.push(buffer);
		}
		const input = JSON.parse(Buffer.concat(chunks).toString("utf8"));
		if (!isRecord(input) || input.action !== action || typeof input.targetRoot !== "string" || !isRecord(input.executor) || typeof input.executor.runId !== "string" || typeof input.executor.root !== "string" || typeof input.executor.databasePath !== "string" || typeof input.executor.childKey !== "string" || !isRecord(input.executor.parent) || !isRecord(input.executor.originalParent) || !isRecord(input.executor.databaseIdentity) || typeof input.executor.originalChildKey !== "string" || !isRecord(input.executor.spawner) || (Object.hasOwn(input.executor, "retainedParent") || Object.hasOwn(input.executor, "retainedChildKey")) && (!isRecord(input.executor.retainedParent) || typeof input.executor.retainedChildKey !== "string")) throw new Error("Invalid native update executor input.");
		const grant = input.executor;
		const root = await resolveOpenClawPackageRoot({ moduleUrl: import.meta.url });
		const targetRoot = input.targetRoot;
		if (!root || resolveUpdateInstallRoot(root) !== targetRoot || resolveUpdateInstallRoot(grant.root) !== targetRoot) throw new Error("Native update receiver installation binding does not match its target.");
		await withDelegatedUpdateCommandExecutor(grant, grant.runId, grant.root, async (fence) => withGatewayServiceUpdateAuthority(fence.assertCurrent, async () => {
			if (input.originalDefinition !== void 0) {
				if (action !== "install" || typeof input.originalDefinition !== "string") throw new Error("Invalid rebind action.");
				if (input.originalRuntimePin !== void 0 && typeof input.originalRuntimePin !== "string") throw new Error("Invalid runtime intent binding.");
				await withGatewayServiceRebindCapture(input.originalDefinition, operation, input.originalRuntimePin);
			} else await operation();
		}, { originalRoot: grant.retainedParent?.key ?? grant.originalParent?.key ?? grant.parent.key }));
	} catch (cause) {
		throw new Error("UPDATE_NATIVE_AUTHORITY: " + (cause instanceof Error ? cause.message : String(cause)), { cause });
	}
}
//#endregion
export { runGatewayServiceUpdateCommand };
