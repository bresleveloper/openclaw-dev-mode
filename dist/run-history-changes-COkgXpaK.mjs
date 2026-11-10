import { i as sqlPublicationAnchor } from "./sql-connection-DmQzXTVz.mjs";
import { t as deferSqlitePostCommitPublication } from "./sqlite-post-commit-22SfWsLt.mjs";
import { a as readTrackedStateDatabaseIdentity } from "./openclaw-state-db-handle-B6qa1Bui.mjs";
import { BroadcastChannel } from "node:worker_threads";
//#region src/cron/store/run-history-changes.ts
const channelName = `openclaw.cron.history.${process.pid}`;
/** History writers notify retention only after their owning transaction commits. */
function publishCronRunHistoryChange(database) {
	const publish = () => {
		const channel = new BroadcastChannel(channelName);
		try {
			channel.postMessage.bind(channel)(readTrackedStateDatabaseIdentity(sqlPublicationAnchor(database))?.canonicalPath);
		} finally {
			channel.close();
		}
	};
	if (!deferSqlitePostCommitPublication(database, publish)) publish();
}
function subscribeCronRunHistoryChanges(listener) {
	const channel = new BroadcastChannel(channelName);
	channel.unref();
	channel.addEventListener("message", (event) => {
		if (typeof event.data === "string") listener(event.data);
	});
	return () => channel.close();
}
//#endregion
export { subscribeCronRunHistoryChanges as n, publishCronRunHistoryChange as t };
