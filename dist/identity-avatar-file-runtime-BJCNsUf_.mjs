import { t as localAgentAvatarRevision } from "./identity-avatar-file-B-RTE8eg.mjs";
import { t as prepareCachedIdentityRead } from "./identity-file-runtime-BY6_8LBB.mjs";
//#region src/agents/identity-avatar-file-runtime.ts
function prepareLocalAgentAvatar(input) {
	return prepareCachedIdentityRead({
		runtimeKey: Symbol.for("openclaw.localAgentAvatars"),
		worker: "localAgentAvatar",
		readerName: "Avatar reader",
		key: () => JSON.stringify([
			input.workspaceDir,
			input.source,
			input.readBody
		]),
		input: (_key, knownRevision) => ({
			...input,
			knownRevision
		}),
		revision: (entry) => localAgentAvatarRevision(entry.file),
		sizeOf: (entry) => entry.file.body?.byteLength ?? 0,
		prepare: (result, previous) => {
			if ("kind" in result) return previous;
			return result.ok ? {
				ok: true,
				file: {
					...result.file,
					body: result.file.body ? Buffer.from(result.file.body.buffer, result.file.body.byteOffset, result.file.body.byteLength) : void 0
				}
			} : result;
		},
		isLoaded: (result) => result.ok
	});
}
//#endregion
export { prepareLocalAgentAvatar };
