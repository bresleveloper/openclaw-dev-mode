import { i as formatErrorMessage } from "./errors-sMD712F3.js";
import { c as isRecord } from "./utils-CRO4LGEB.js";
import { i as getRuntimeConfig } from "./io-DxnOT4sF.js";
import "./error-runtime-CDUW9C58.js";
import "./runtime-config-snapshot-Bad5bZfJ.js";
import "./string-coerce-runtime-ZbuYDJgZ.js";
import "./gateway-runtime-BE_o8NR2.js";
import { n as callGatewayFromCli, t as addGatewayClientOptions } from "./gateway-rpc-X6FYVl58.js";
import { t as resolveWorkboardCardByIdOrPrefix } from "./card-lookup-BoXKYGHH.js";
//#region extensions/workboard/src/cli.ts
function writeJson(value) {
	process.stdout.write(`${JSON.stringify(value, null, 2)}\n`);
}
function writeLine(value) {
	process.stdout.write(`${value}\n`);
}
function splitLabels(value) {
	return value?.split(",").map((entry) => entry.trim()).filter(Boolean);
}
function formatCardLine(card) {
	const boardId = card.metadata?.automation?.boardId ?? "default";
	const agent = card.agentId ? ` ${card.agentId}` : "";
	return `${card.id.slice(0, 8)}  ${card.status.padEnd(8)}  ${card.priority.padEnd(6)}  ${boardId}${agent}  ${card.title}`;
}
function redactClaimToken(card) {
	const claim = card.metadata?.claim;
	if (!claim) return card;
	return {
		...card,
		metadata: {
			...card.metadata,
			claim: {
				...claim,
				token: "[redacted]"
			}
		}
	};
}
function redactDispatchResult(result) {
	return {
		...result,
		promoted: result.promoted.map(redactClaimToken),
		reclaimed: result.reclaimed.map(redactClaimToken),
		blocked: result.blocked.map(redactClaimToken),
		orchestrated: result.orchestrated.map(redactClaimToken)
	};
}
function writeCards(cards, options) {
	if (options.json) {
		writeJson({ cards: cards.map(redactClaimToken) });
		return;
	}
	for (const card of cards) writeLine(formatCardLine(card));
}
async function callWorkboardGateway(method, options, params) {
	return await callGatewayFromCli(method, options, params, {
		mode: "cli",
		scopes: ["operator.write", "operator.read"]
	});
}
function isGatewayUnavailableError(error) {
	const message = formatErrorMessage(error).toLowerCase();
	return [
		"econnrefused",
		"econnreset",
		"ehostunreach",
		"enotfound",
		"gateway not connected",
		"gateway unavailable",
		"unknown method: workboard.cards.dispatch"
	].some((marker) => message.includes(marker));
}
function hasExplicitGatewayTarget(options) {
	return Boolean(options.url?.trim() || options.token?.trim());
}
function hasConfiguredRemoteGatewayTarget() {
	if (process.env.OPENCLAW_GATEWAY_URL?.trim()) return true;
	try {
		return getRuntimeConfig().gateway?.mode === "remote";
	} catch {
		return false;
	}
}
function registerWorkboardCli(params) {
	const workboard = params.program.command("workboard").description("Manage Workboard cards and worker dispatch");
	workboard.command("list").description("List Workboard cards").option("--board <id>", "Board id").option("--status <status>", "Filter by status").option("--include-archived", "Include archived cards (default false)").option("--json", "Print JSON", false).action(async (options) => {
		let cards = await params.store.list({ boardId: options.board });
		if (!options.json && options.includeArchived !== true) cards = cards.filter((card) => !card.metadata?.archivedAt);
		if (options.status) cards = cards.filter((card) => card.status === options.status);
		writeCards(cards, options);
	});
	workboard.command("create").argument("<title...>", "Card title").description("Create a Workboard card").option("--notes <text>", "Card notes").option("--status <status>", "Initial status", "todo").option("--priority <priority>", "Priority", "normal").option("--agent <id>", "Assigned agent id").option("--board <id>", "Board id").option("--labels <items>", "Comma-separated labels").option("--json", "Print JSON", false).action(async (title, options) => {
		const card = await params.store.create({
			title: title.join(" "),
			notes: options.notes,
			status: options.status,
			priority: options.priority,
			agentId: options.agent,
			boardId: options.board,
			labels: splitLabels(options.labels)
		});
		if (options.json) writeJson({ card: redactClaimToken(card) });
		else writeLine(formatCardLine(card));
	});
	workboard.command("show").argument("<id>", "Card id or prefix").description("Show one Workboard card").option("--json", "Print JSON", false).action(async (id, options) => {
		const { card, error } = resolveWorkboardCardByIdOrPrefix(await params.store.list(), id);
		if (!card) throw new Error(error);
		if (options.json) writeJson({ card: redactClaimToken(card) });
		else {
			writeLine(formatCardLine(card));
			if (card.notes) writeLine(card.notes);
		}
	});
	addGatewayClientOptions(workboard.command("dispatch").description("Promote ready cards and start worker runs through the Gateway").option("--board <id>", "Dispatch a single board").option("--json", "Print JSON", false)).action(async (options) => {
		try {
			const result = await callWorkboardGateway("workboard.cards.dispatch", options, { boardId: options.board });
			if (options.json) writeJson(result);
			else {
				const record = isRecord(result) ? result : {};
				writeLine(`dispatch complete: started=${Array.isArray(record.started) ? record.started.length : 0} failures=${Array.isArray(record.startFailures) ? record.startFailures.length : 0}`);
			}
		} catch (error) {
			if (!isGatewayUnavailableError(error) || hasExplicitGatewayTarget(options) || hasConfiguredRemoteGatewayTarget()) throw error;
			const result = redactDispatchResult(await params.store.dispatch({ boardId: options.board }));
			if (options.json) writeJson({
				...result,
				gatewayUnavailable: true
			});
			else writeLine(`gateway unavailable; data dispatch only: promoted=${result.promoted.length} blocked=${result.blocked.length}`);
		}
	});
}
//#endregion
export { registerWorkboardCli };
