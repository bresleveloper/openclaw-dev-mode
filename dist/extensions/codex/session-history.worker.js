import { n as readCodexNativeHistory } from "./.setup/session-history-read-BI_2jRED.mjs";
import { t as projectVerifiedSettledCodexMessages } from "./.setup/settled-turn-evidence-B5Ew3UUB.mjs";
import { serveWorkerTasks } from "openclaw/plugin-sdk/worker-task-server";
//#region extensions/codex/session-history.worker.ts
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
//#endregion
export {};
