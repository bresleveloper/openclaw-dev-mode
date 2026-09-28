import { o as normalizeIMessageHandle } from "../.setup/targets-Cc9vthzI.mjs";
import { executeSqliteQuerySync, executeSqliteQueryTakeFirstSync, getNodeSqliteKysely, openNodeSqliteDatabase } from "openclaw/plugin-sdk/sqlite-worker-runtime";
//#region extensions/imessage/src/chat-db.worker.ts
function appleMessageDateLowerBoundMs(sentAfterMs) {
	if (typeof sentAfterMs !== "number" || !Number.isFinite(sentAfterMs)) return null;
	return Math.max(0, Math.floor((sentAfterMs - 9783072e5 - 5e3) * 1e6));
}
function openExistingSqliteWorkerBackend(_input, context) {
	const db = openNodeSqliteDatabase(context.databasePath, { readOnly: true });
	return {
		execute(command) {
			const query = getNodeSqliteKysely(db);
			if (command.type === "startupWatermark") {
				const row = executeSqliteQueryTakeFirstSync(db, query.selectFrom("message").select((eb) => eb.fn.max("ROWID").as("maxRowid")));
				if (typeof row?.maxRowid === "number" && Number.isFinite(row.maxRowid)) return row.maxRowid;
				return row?.maxRowid === null ? 0 : null;
			}
			if (command.type === "messageGuid") {
				const row = executeSqliteQueryTakeFirstSync(db, query.selectFrom("message").select("guid").where("ROWID", "=", command.input.messageId));
				return typeof row?.guid === "string" ? row.guid : null;
			}
			const { target, text, sentAfterMs } = command.input;
			let selection = query.selectFrom("message as m").leftJoin("chat_message_join as cmj", "cmj.message_id", "m.ROWID").leftJoin("chat as c", "c.ROWID", "cmj.chat_id").leftJoin("handle as h", "h.ROWID", "m.handle_id").select("m.guid").where("m.is_from_me", "=", 1);
			if (text) selection = selection.where("m.text", "=", text);
			const lowerBound = appleMessageDateLowerBoundMs(sentAfterMs);
			if (lowerBound !== null) selection = selection.where("m.date", ">=", lowerBound);
			if (target.kind === "chat_id") selection = selection.where("cmj.chat_id", "=", target.chatId);
			else if (target.kind === "chat_guid") selection = selection.where("c.guid", "=", target.chatGuid);
			else if (target.kind === "chat_identifier") selection = selection.where("c.chat_identifier", "=", target.chatIdentifier);
			else selection = selection.where((eb) => eb.or([eb("h.id", "=", normalizeIMessageHandle(target.to)), eb("h.uncanonicalized_id", "=", target.to)]));
			const rows = executeSqliteQuerySync(db, selection.orderBy("m.date", "desc").orderBy("m.ROWID", "desc").limit(10)).rows;
			return typeof rows[0]?.guid === "string" ? rows[0].guid : null;
		},
		close() {
			db.close();
		}
	};
}
//#endregion
export { openExistingSqliteWorkerBackend };
