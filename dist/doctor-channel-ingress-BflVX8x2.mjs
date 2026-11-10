import { t as quoteCliArg } from "./quote-cli-arg-BEt71TUh.mjs";
import { t as formatCliCommand } from "./command-format-CYoE8cOC.mjs";
import { t as note } from "./note-CmoIRLec.mjs";
import { n as countFailedChannelIngressQueueEntries } from "./ingress-queue-health-BCifBLIU.mjs";
//#region src/commands/doctor-channel-ingress.ts
async function noteChannelIngressDeadLetters(options = {}) {
	const failed = await countFailedChannelIngressQueueEntries(options.stateDir);
	const first = failed[0];
	if (!first) return;
	const lines = failed.map((entry) => `- ${entry.channelId}/${entry.accountId}: ${entry.count} dead-lettered ingress event${entry.count === 1 ? "" : "s"}.`);
	lines.push(`- Inspect with ${formatCliCommand(`openclaw channels dead-letters list --channel ${quoteCliArg(first.channelId)} --account ${quoteCliArg(first.accountId)}`)}.`);
	(options.noteFn ?? note)(lines.join("\n"), "Channel ingress");
}
//#endregion
export { noteChannelIngressDeadLetters };
