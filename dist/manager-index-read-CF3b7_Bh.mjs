import { n as hasMemorySessionTombstone } from "./memory-session-tombstones-CXVQjYXY.mjs";
import { _ as loadMemoryEmbeddingCache, i as readMemorySourceHash, o as readMemoryDatabaseFacts, r as readMemorySourceChunks, u as loadMemorySourceFileState } from "./manager-source-index-kernel-DMTrRWNm.mjs";
//#region extensions/memory-core/src/memory/manager-index-read.ts
/** Published WAL readers and private shadow writers consume the same read kernels. */
function readMemoryIndex(db, command) {
	switch (command.type) {
		case "index.facts": return {
			type: command.type,
			value: readMemoryDatabaseFacts(db)
		};
		case "source.state": return {
			type: command.type,
			value: loadMemorySourceFileState({
				db,
				...command.input
			})
		};
		case "source.hash": return {
			type: command.type,
			value: readMemorySourceHash(db, command.input.source, command.input.path)
		};
		case "source.chunks": return {
			type: command.type,
			value: readMemorySourceChunks(db, command.input.source, command.input.path)
		};
		case "cache.read": return {
			type: command.type,
			value: loadMemoryEmbeddingCache({
				...command.input,
				db
			})
		};
		case "session.current": return {
			type: command.type,
			value: hasMemorySessionTombstone(db, command.input.agentId, command.input.sessionId) ? "forgotten" : "current"
		};
	}
	return command;
}
//#endregion
export { readMemoryIndex as t };
