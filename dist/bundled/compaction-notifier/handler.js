import { s as asFiniteNumber } from "../../number-coercion-CkhMiRw8.mjs";
//#region src/hooks/bundled/compaction-notifier/handler.ts
const handler = async (event) => {
	try {
		const context = event.context;
		if (event.type === "session" && event.action === "compact:before") {
			const messageCount = asFiniteNumber(context.messageCount);
			const messageSuffix = messageCount !== void 0 && messageCount >= 0 ? ` (${messageCount} messages)` : "";
			event.messages.push(`🧹 Compacting context${messageSuffix} so I can continue without losing history…`);
			return;
		}
		if (event.type === "session" && event.action === "compact:after") {
			if (context.compactionOutcome === "skipped") {
				event.messages.push("✅ Nothing to compact. Continuing from where I left off.");
				return;
			}
			const tokensBefore = asFiniteNumber(context.tokensBefore);
			const tokensAfter = asFiniteNumber(context.tokensAfter);
			const tokenDelta = tokensBefore !== void 0 && tokensAfter !== void 0 ? ` (${tokensBefore.toLocaleString()} → ${tokensAfter.toLocaleString()} tokens)` : "";
			event.messages.push(`✅ Context compacted${tokenDelta}. Continuing from where I left off.`);
		}
	} catch (error) {
		console.warn(`[compaction-notifier] failed: ${error instanceof Error ? error.message : String(error)}`);
	}
};
//#endregion
export { handler as default };
