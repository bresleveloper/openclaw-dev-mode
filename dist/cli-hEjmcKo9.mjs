import { w as parseStrictPositiveInteger } from "./number-coercion-CkhMiRw8.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { a as isImplicitLocalGatewayTargetFromCli, n as callGatewayFromCli, t as addGatewayClientOptions } from "./gateway-rpc-Wcwajg7Y.mjs";
import "./string-coerce-runtime-BbIJhy7G.mjs";
import "./number-runtime-D3v2w3D4.mjs";
import { t as runWithLocalStateOwner } from "./local-state-owner-B_m2_iCc.mjs";
import { n as parseTimeoutMsWithFallback } from "./parse-timeout-DRdbYkg7.mjs";
import "./gateway-runtime-DVShvn9X.mjs";
import "./cli-state-owner-CBu2WDHQ.mjs";
import { n as redactDispatchResult, t as redactClaimToken } from "./card-redaction-BHQMNjYT.mjs";
import { u as WORKBOARD_STATUSES } from "./src-uqZESs4H.mjs";
import { t as resolveWorkboardCardByIdOrPrefix } from "./card-lookup-BoXKYGHH.mjs";
//#region extensions/workboard/src/cli.ts
function parseMaxStarts(value) {
	const parsed = parseStrictPositiveInteger(value);
	if (parsed === void 0) throw Object.assign(/* @__PURE__ */ new Error("--max-starts must be a positive integer."), {
		name: "InvalidArgumentError",
		code: "commander.invalidArgument",
		exitCode: 1
	});
	return parsed;
}
function writeJson(value) {
	process.stdout.write(`${JSON.stringify(value, null, 2)}\n`);
}
function writeLine(value) {
	process.stdout.write(`${value}\n`);
}
function formatCardLine(card) {
	const boardId = card.metadata?.automation?.boardId ?? "default";
	const agent = card.agentId ? ` ${card.agentId}` : "";
	const archived = card.metadata?.archivedAt ? " (archived)" : "";
	return `${card.id.slice(0, 8)}  ${card.status.padEnd(8)}  ${card.priority.padEnd(6)}  ${boardId}${agent}  ${card.title}${archived}`;
}
function writeCards(cards, options) {
	if (options.json) {
		writeJson({ cards: cards.map(redactClaimToken) });
		return;
	}
	for (const card of cards) writeLine(formatCardLine(card));
}
function writeCard(card, options) {
	if (options.json) writeJson({ card: redactClaimToken(card) });
	else writeLine(formatCardLine(card));
}
function registerWorkboardCli(params) {
	const local = (method, input, action, options) => runWithLocalStateOwner({
		method: `${method}.owner`,
		params: input,
		target: "Workboard",
		...options,
		recoveryCommand: "openclaw workboard list --json",
		runLocal: ({ assertCurrent }) => params.withStore(async (store) => {
			assertCurrent();
			return await action(store, assertCurrent);
		})
	});
	const list = (boardId) => local("workboard.cards.list", { boardId }, async (store) => ({ cards: await store.list({ boardId }) }));
	const workboard = params.program.command("workboard").description("Manage Workboard cards and worker dispatch");
	workboard.command("list").description("List Workboard cards").option("--board <id>", "Board id").addOption(workboard.createOption("--status <status>", "Filter by status").choices([...WORKBOARD_STATUSES])).option("--include-archived", "Include archived cards (default false)").option("--json", "Print JSON", false).action(async (options) => {
		let cards = (await list(options.board)).cards;
		if (!options.json && options.includeArchived !== true) cards = cards.filter((card) => !card.metadata?.archivedAt);
		if (options.status) cards = cards.filter((card) => card.status === options.status);
		writeCards(cards, options);
	});
	workboard.command("create").argument("<title...>", "Card title").description("Create a Workboard card").option("--notes <text>", "Card notes").option("--status <status>", "Initial status", "todo").option("--priority <priority>", "Priority", "normal").option("--agent <id>", "Assigned agent id").option("--board <id>", "Board id").option("--labels <items>", "Comma-separated labels").option("--json", "Print JSON", false).action(async (title, options) => {
		const input = {
			title: title.join(" "),
			notes: options.notes,
			status: options.status,
			priority: options.priority,
			agentId: options.agent,
			boardId: options.board,
			labels: options.labels
		};
		const { card } = await local("workboard.cards.create", input, async (store, assertCurrent) => ({ card: await store.create({
			...input,
			workspaceAccess: { unrestricted: true }
		}, void 0, assertCurrent) }));
		writeCard(card, options);
	});
	workboard.command("show").argument("<id>", "Card id or prefix").description("Show one Workboard card").option("--json", "Print JSON", false).action(async (id, options) => {
		const cards = (await list()).cards;
		const { card, error } = resolveWorkboardCardByIdOrPrefix(cards, id);
		if (!card) throw new Error(error);
		writeCard(card, options);
		if (!options.json && card.notes) writeLine(card.notes);
	});
	workboard.command("move").argument("<id>", "Card id or prefix").description("Move a Workboard card to another status").requiredOption("--status <status>", "Target status").option("--json", "Print JSON", false).action(async (id, options) => {
		if (!WORKBOARD_STATUSES.includes(options.status)) throw new Error(`--status must be one of: ${WORKBOARD_STATUSES.join(", ")}.`);
		const cards = (await list()).cards;
		const { card, error } = resolveWorkboardCardByIdOrPrefix(cards, id);
		if (!card) throw new Error(error);
		const input = {
			id: card.id,
			status: options.status,
			expectedUpdatedAt: card.updatedAt
		};
		const { card: updated } = await local("workboard.cards.move", input, async (store, assertCurrent) => ({ card: await store.move(card.id, options.status, void 0, void 0, {
			expectedUpdatedAt: card.updatedAt,
			assertOwnerCurrent: assertCurrent
		}) }));
		writeCard(updated, options);
	});
	addGatewayClientOptions(workboard.command("dispatch").description("Promote ready cards and start worker runs through the Gateway").option("--board <id>", "Dispatch a single board").option("--max-starts <count>", "Maximum new worker runs to start in this pass (default 3)", parseMaxStarts).option("--admin", "Request full-host workspace access", false).option("--json", "Print JSON", false)).action(async (options) => {
		const method = options.maxStarts === void 0 ? "workboard.cards.dispatch" : "workboard.cards.dispatchWithOptions";
		const input = {
			boardId: options.board,
			...options.maxStarts !== void 0 ? { maxStarts: options.maxStarts } : {}
		};
		const scopes = options.admin ? [
			"operator.admin",
			"operator.write",
			"operator.read"
		] : ["operator.write", "operator.read"];
		const result = await (!options.token?.trim() && !options.password?.trim() && await isImplicitLocalGatewayTargetFromCli(options) ? local(method, input, async (store, assertCurrent) => ({
			...redactDispatchResult(await store.dispatch({
				boardId: options.board,
				assertOwnerCurrent: assertCurrent
			})),
			gatewayUnavailable: true,
			started: [],
			startFailures: []
		}), {
			scopes,
			timeoutMs: parseTimeoutMsWithFallback(options.timeout, 3e4, { invalidType: "error" }),
			expectFinal: options.expectFinal
		}) : callGatewayFromCli(method, options, input, {
			mode: "cli",
			scopes
		}));
		if (options.json) writeJson(result);
		else {
			const record = isRecord(result) ? result : {};
			if (record.gatewayUnavailable === true) {
				writeLine(`gateway unavailable; data dispatch only: promoted=${Array.isArray(record.promoted) ? record.promoted.length : 0} blocked=${Array.isArray(record.blocked) ? record.blocked.length : 0}`);
				return;
			}
			const started = Array.isArray(record.started) ? record.started.length : 0;
			const failures = Array.isArray(record.startFailures) ? record.startFailures : [];
			writeLine(`dispatch complete: started=${started} failures=${failures.length}`);
			for (const failure of failures) if (isRecord(failure) && typeof failure.cardId === "string" && typeof failure.error === "string") writeLine(`${failure.cardId.slice(0, 8)}: ${failure.error}`);
		}
	});
}
//#endregion
export { registerWorkboardCli };
