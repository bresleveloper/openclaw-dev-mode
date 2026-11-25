import { n as readCodexNativeHistory } from "./.setup/session-history-read-D9RviVHp.mjs";
import { t as projectVerifiedSettledCodexMessages } from "./.setup/settled-turn-evidence-CNHMckER.mjs";
import { serveWorkerTasks } from "openclaw/plugin-sdk/worker-task-server";
// extensions/codex/session-history.worker.ts
async function runCodexHistoryWorkerInput(input) {
	const request = input;
	let version;
	const onSnapshot = (value) => {
		version = value;
	};
	return {
		result: await readCodexNativeHistory(request.target, request.sessionId, (messages) => projectVerifiedSettledCodexMessages(messages, request.evidence), request.admission, onSnapshot, request.physicalSource),
		version
	};
}
serveWorkerTasks(runCodexHistoryWorkerInput);
export {};
