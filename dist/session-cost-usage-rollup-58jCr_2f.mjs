import { n as cloneCostUsageTotals, r as createEmptyCostUsageTotals, t as addCostUsageTotals } from "./session-cost-usage-totals-D4e-85ui.mjs";
//#region src/shared/usage-aggregates.ts
const UNKNOWN_USAGE_CREATOR_KEY = "[\"unknown\"]";
/** Builds a collision-free identity while preserving legacy missing-as-unknown grouping. */
function usageModelIdentity(provider, model) {
	return JSON.stringify([provider ?? "unknown", model ?? "unknown"]);
}
/** Extends the model identity with its calendar bucket without delimiter ambiguity. */
function usageDailyModelIdentity(date, provider, model) {
	return JSON.stringify([
		date,
		provider ?? "unknown",
		model ?? "unknown"
	]);
}
function createLatencyAccumulator() {
	return {
		count: 0,
		sum: 0,
		min: Number.POSITIVE_INFINITY,
		max: 0,
		p95Max: 0
	};
}
function mergeLatency(target, source) {
	target.count += source.count;
	target.sum += source.avgMs * source.count;
	target.min = Math.min(target.min, source.minMs);
	target.max = Math.max(target.max, source.maxMs);
	target.p95Max = Math.max(target.p95Max, source.p95Ms);
}
function summarizeLatency(value) {
	return {
		count: value.count,
		avgMs: value.count ? value.sum / value.count : 0,
		minMs: value.min === Number.POSITIVE_INFINITY ? 0 : value.min,
		maxMs: value.max,
		p95Ms: value.p95Max
	};
}
function mergeModelUsage(map, key, entry, model) {
	const existing = map.get(key) ?? {
		provider: entry.provider,
		model,
		count: 0,
		totals: createEmptyCostUsageTotals()
	};
	existing.count += entry.count;
	addCostUsageTotals(existing.totals, entry.totals);
	map.set(key, existing);
}
function mergeGroupedTotals(map, key, usage) {
	if (!key) return;
	const totals = map.get(key) ?? createEmptyCostUsageTotals();
	addCostUsageTotals(totals, usage);
	map.set(key, totals);
}
function compareModelUsage(left, right) {
	return right.totals.totalCost - left.totals.totalCost || right.totals.totalTokens - left.totals.totalTokens;
}
/** Shared accounting for gateway-wide results and filtered Control UI session rows. */
function createUsageAggregateAccumulator() {
	const totals = createEmptyCostUsageTotals();
	const messages = {
		total: 0,
		user: 0,
		assistant: 0,
		toolCalls: 0,
		toolResults: 0,
		errors: 0
	};
	const tools = /* @__PURE__ */ new Map();
	const models = /* @__PURE__ */ new Map();
	const providers = /* @__PURE__ */ new Map();
	const agents = /* @__PURE__ */ new Map();
	const channels = /* @__PURE__ */ new Map();
	const creators = /* @__PURE__ */ new Map();
	const days = /* @__PURE__ */ new Map();
	const costDays = /* @__PURE__ */ new Map();
	const dailyLatency = /* @__PURE__ */ new Map();
	const dailyModels = /* @__PURE__ */ new Map();
	const latency = createLatencyAccumulator();
	let sessionCount = 0;
	let longestSessionDurationMs = 0;
	function getDay(date) {
		let day = days.get(date);
		if (!day) {
			day = {
				date,
				tokens: 0,
				cost: 0,
				messages: 0,
				toolCalls: 0,
				errors: 0
			};
			days.set(date, day);
		}
		return day;
	}
	function add({ usage, agentId, channel, createdActor, creatorKey = UNKNOWN_USAGE_CREATOR_KEY }) {
		if (!usage) return;
		addCostUsageTotals(totals, usage);
		longestSessionDurationMs = Math.max(longestSessionDurationMs, usage.durationMs ?? 0);
		const countedSession = usage.firstActivity !== void 0 || (usage.messageCounts?.total ?? 0) > 0;
		if (countedSession) sessionCount += 1;
		if (usage.messageCounts) {
			messages.total += usage.messageCounts.total;
			messages.user += usage.messageCounts.user;
			messages.assistant += usage.messageCounts.assistant;
			messages.toolCalls += usage.messageCounts.toolCalls;
			messages.toolResults += usage.messageCounts.toolResults;
			messages.errors += usage.messageCounts.errors;
		}
		for (const tool of usage.toolUsage?.tools ?? []) tools.set(tool.name, (tools.get(tool.name) ?? 0) + tool.count);
		for (const entry of usage.modelUsage ?? []) {
			mergeModelUsage(models, usageModelIdentity(entry.provider, entry.model), entry, entry.model);
			mergeModelUsage(providers, entry.provider ?? "unknown", entry, void 0);
		}
		mergeGroupedTotals(agents, agentId, usage);
		mergeGroupedTotals(channels, channel, usage);
		const creator = creators.get(creatorKey) ?? {
			key: creatorKey,
			...createdActor ? { actor: createdActor } : {},
			totals: createEmptyCostUsageTotals(),
			sessionCount: 0,
			daily: /* @__PURE__ */ new Map(),
			sessionActivity: /* @__PURE__ */ new Map()
		};
		addCostUsageTotals(creator.totals, usage);
		if (countedSession) {
			creator.sessionCount += 1;
			const dates = [.../* @__PURE__ */ new Set([
				...usage.activityDates ?? [],
				...usage.dailyBreakdown?.map(({ date }) => date) ?? [],
				...usage.dailyMessageCounts?.map(({ date }) => date) ?? []
			])].toSorted();
			const key = JSON.stringify(dates);
			const activity = creator.sessionActivity.get(key) ?? {
				dates,
				sessionCount: 0
			};
			activity.sessionCount += 1;
			creator.sessionActivity.set(key, activity);
		}
		creators.set(creatorKey, creator);
		if (usage.latency && usage.latency.count > 0) mergeLatency(latency, usage.latency);
		for (const day of usage.dailyLatency ?? []) {
			const existing = dailyLatency.get(day.date) ?? createLatencyAccumulator();
			mergeLatency(existing, day);
			dailyLatency.set(day.date, existing);
		}
		for (const day of usage.dailyBreakdown ?? []) {
			const existing = getDay(day.date);
			existing.tokens += day.tokens;
			existing.cost += day.cost;
			mergeGroupedTotals(costDays, day.date, day);
			mergeGroupedTotals(creator.daily, day.date, day);
		}
		for (const day of usage.dailyMessageCounts ?? []) {
			const existing = getDay(day.date);
			existing.messages += day.total;
			existing.toolCalls += day.toolCalls;
			existing.errors += day.errors;
		}
		for (const day of usage.dailyModelUsage ?? []) {
			const key = usageDailyModelIdentity(day.date, day.provider, day.model);
			const existing = dailyModels.get(key) ?? {
				date: day.date,
				provider: day.provider,
				model: day.model,
				tokens: 0,
				cost: 0,
				count: 0
			};
			existing.tokens += day.tokens;
			existing.cost += day.cost;
			existing.count += day.count;
			dailyModels.set(key, existing);
		}
	}
	function finish() {
		const toolEntries = Array.from(tools, ([name, count]) => ({
			name,
			count
		})).toSorted((a, b) => b.count - a.count);
		return {
			sessionCount,
			...longestSessionDurationMs > 0 ? { longestSessionDurationMs } : {},
			messages,
			tools: {
				totalCalls: toolEntries.reduce((sum, { count }) => sum + count, 0),
				uniqueTools: tools.size,
				tools: toolEntries
			},
			byModel: Array.from(models.values()).toSorted(compareModelUsage),
			byProvider: Array.from(providers.values()).toSorted(compareModelUsage),
			byAgent: Array.from(agents, ([agentId, groupTotals]) => ({
				agentId,
				totals: groupTotals
			})).toSorted((a, b) => b.totals.totalCost - a.totals.totalCost),
			byChannel: Array.from(channels, ([channel, groupTotals]) => ({
				channel,
				totals: groupTotals
			})).toSorted((a, b) => b.totals.totalCost - a.totals.totalCost),
			byCreator: Array.from(creators.values(), ({ daily, sessionActivity, ...creator }) => ({
				...creator,
				daily: Array.from(daily, ([date, dayTotals]) => ({
					date,
					...dayTotals
				})).toSorted((a, b) => a.date.localeCompare(b.date)),
				sessionActivity: Array.from(sessionActivity.values()).toSorted((a, b) => a.dates.join(",").localeCompare(b.dates.join(",")))
			})).toSorted((a, b) => b.totals.totalCost - a.totals.totalCost || b.totals.totalTokens - a.totals.totalTokens || a.key.localeCompare(b.key)),
			costDaily: Array.from(costDays, ([date, groupTotals]) => ({
				date,
				...groupTotals
			})).toSorted((a, b) => a.date.localeCompare(b.date)),
			latency: latency.count > 0 ? summarizeLatency(latency) : void 0,
			dailyLatency: Array.from(dailyLatency, ([date, value]) => ({
				date,
				...summarizeLatency(value)
			})).toSorted((a, b) => a.date.localeCompare(b.date)),
			modelDaily: Array.from(dailyModels.values()).toSorted((a, b) => a.date.localeCompare(b.date) || b.cost - a.cost),
			daily: Array.from(days.values()).toSorted((a, b) => a.date.localeCompare(b.date))
		};
	}
	return {
		totals,
		add,
		finish
	};
}
//#endregion
//#region src/infra/session-cost-usage-rollup.ts
const MAX_LATENCY_MS = 432e5;
const MAX_LATENCY_CENTROIDS = 64;
const ERROR_STOP_REASONS = /* @__PURE__ */ new Set([
	"error",
	"aborted",
	"timeout"
]);
function emptyMessageCounts() {
	return {
		total: 0,
		user: 0,
		assistant: 0,
		toolCalls: 0,
		toolResults: 0,
		errors: 0
	};
}
function createLatencyAggregate() {
	return {
		centroids: [],
		count: 0,
		max: 0,
		sum: 0
	};
}
function compressLatencyCentroids(aggregate) {
	while (aggregate.centroids.length > MAX_LATENCY_CENTROIDS) {
		aggregate.centroids.sort((a, b) => a.value - b.value);
		let mergeIndex = 0;
		let smallestGap = Number.POSITIVE_INFINITY;
		for (let index = 1; index < aggregate.centroids.length; index += 1) {
			const gap = (aggregate.centroids[index]?.value ?? 0) - (aggregate.centroids[index - 1]?.value ?? 0);
			if (gap < smallestGap) {
				smallestGap = gap;
				mergeIndex = index - 1;
			}
		}
		const left = aggregate.centroids[mergeIndex];
		const right = aggregate.centroids[mergeIndex + 1];
		if (!left || !right) break;
		const count = left.count + right.count;
		aggregate.centroids.splice(mergeIndex, 2, {
			count,
			value: (left.value * left.count + right.value * right.count) / count
		});
	}
}
function addLatencyValue(aggregate, value) {
	const wasEmpty = aggregate.count === 0;
	aggregate.count += 1;
	aggregate.sum += value;
	aggregate.min = wasEmpty ? value : Math.min(aggregate.min ?? value, value);
	aggregate.max = Math.max(aggregate.max, value);
	aggregate.centroids.push({
		count: 1,
		value
	});
	compressLatencyCentroids(aggregate);
}
function mergeLatencyAggregate(target, source) {
	if (source.count === 0) return;
	const targetWasEmpty = target.count === 0;
	const sourceMin = source.min ?? source.max;
	target.count += source.count;
	target.sum += source.sum;
	target.min = targetWasEmpty ? sourceMin : Math.min(target.min ?? target.max, sourceMin);
	target.max = Math.max(target.max, source.max);
	target.centroids.push(...source.centroids.map((centroid) => ({
		count: centroid.count,
		value: centroid.value
	})));
	compressLatencyCentroids(target);
}
function createUntimestampedRollup() {
	return {
		totals: createEmptyCostUsageTotals(),
		messageCounts: emptyMessageCounts(),
		tools: [],
		models: []
	};
}
function createSessionUsageRollupData() {
	return {
		buckets: {},
		untimestamped: createUntimestampedRollup()
	};
}
function incrementTool(tools, name) {
	const existing = tools.find((entry) => entry.name === name);
	if (existing) existing.count += 1;
	else tools.push({
		name,
		count: 1
	});
}
function mergeTools(target, tools) {
	for (const tool of tools) target.set(tool.name, (target.get(tool.name) ?? 0) + tool.count);
}
function addModelUsage(models, provider, model, totals) {
	if (!provider && !model) return;
	const modelRef = usageModelIdentity(provider, model);
	let existing = models.find((entry) => usageModelIdentity(entry.provider, entry.model) === modelRef);
	if (!existing) {
		existing = {
			provider,
			model,
			count: 0,
			totals: createEmptyCostUsageTotals()
		};
		models.push(existing);
	}
	existing.count += 1;
	addCostUsageTotals(existing.totals, totals);
}
function mergeModels(target, models) {
	for (const model of models) {
		const modelRef = usageModelIdentity(model.provider, model.model);
		const existing = target.get(modelRef) ?? {
			provider: model.provider,
			model: model.model,
			count: 0,
			totals: createEmptyCostUsageTotals()
		};
		existing.count += model.count;
		addCostUsageTotals(existing.totals, model.totals);
		target.set(modelRef, existing);
	}
}
function addMessageContribution(target, contribution) {
	if (contribution.role === "user") {
		target.user += 1;
		target.total += 1;
	} else if (contribution.role === "assistant") {
		target.assistant += 1;
		target.total += 1;
	}
	target.toolCalls += contribution.toolNames.length;
	target.toolResults += contribution.toolResultCounts.total;
	target.errors += contribution.toolResultCounts.errors;
	if (contribution.stopReason && ERROR_STOP_REASONS.has(contribution.stopReason)) target.errors += 1;
}
function createBucket(timestampMs) {
	return {
		timestampMs,
		...createUntimestampedRollup(),
		latency: createLatencyAggregate()
	};
}
function appendSessionUsageRollupContribution(rollup, contribution) {
	const timestamp = contribution.timestamp;
	const timedBucket = timestamp === void 0 ? void 0 : rollup.buckets[String(timestamp)] ??= createBucket(timestamp);
	const bucket = timedBucket ?? rollup.untimestamped;
	addMessageContribution(bucket.messageCounts, contribution);
	for (const toolName of contribution.toolNames) incrementTool(bucket.tools, toolName);
	if (contribution.usageTotals) {
		addCostUsageTotals(bucket.totals, contribution.usageTotals);
		addModelUsage(bucket.models, contribution.provider, contribution.model, contribution.usageTotals);
	}
	if (!timedBucket) return;
	if (contribution.role === "assistant") {
		const sourceUserTimestamp = contribution.durationMs === void 0 ? rollup.lastUserTimestamp : void 0;
		const latencyMs = contribution.durationMs ?? (sourceUserTimestamp !== void 0 ? Math.max(0, timedBucket.timestampMs - sourceUserTimestamp) : void 0);
		if (latencyMs !== void 0 && Number.isFinite(latencyMs) && latencyMs <= MAX_LATENCY_MS) addLatencyValue(timedBucket.latency, latencyMs);
	}
	if (contribution.role === "user") rollup.lastUserTimestamp = timedBucket.timestampMs;
}
function computeLatencyStats(aggregate) {
	if (aggregate.count === 0) return;
	const targetCount = Math.ceil(aggregate.count * .95);
	let seen = 0;
	let p95Ms = aggregate.max;
	for (const centroid of aggregate.centroids.toSorted((a, b) => a.value - b.value)) {
		seen += centroid.count;
		if (seen >= targetCount) {
			p95Ms = centroid.value;
			break;
		}
	}
	return {
		count: aggregate.count,
		avgMs: aggregate.sum / aggregate.count,
		p95Ms,
		minMs: aggregate.min ?? aggregate.max,
		maxMs: aggregate.max
	};
}
function getUtcQuarterHourBucketKey(date) {
	const dateKey = `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}-${String(date.getUTCDate()).padStart(2, "0")}`;
	const quarterIndex = Math.floor((date.getUTCHours() * 60 + date.getUTCMinutes()) / 15);
	return {
		date: dateKey,
		quarterIndex,
		bucketId: `${dateKey}\0${quarterIndex}`
	};
}
function addMessageCounts(target, source) {
	target.total += source.total;
	target.user += source.user;
	target.assistant += source.assistant;
	target.toolCalls += source.toolCalls;
	target.toolResults += source.toolResults;
	target.errors += source.errors;
}
function sortedModelUsage(models, sortByUsage = true) {
	if (models.size === 0) return;
	const values = Array.from(models.values());
	return sortByUsage ? values.toSorted((a, b) => {
		return b.totals.totalCost - a.totals.totalCost || b.totals.totalTokens - a.totals.totalTokens;
	}) : values;
}
function buildToolUsage(tools, sortTiesByName = true) {
	if (tools.size === 0) return;
	const entries = Array.from(tools, ([name, count]) => ({
		name,
		count
	})).toSorted((a, b) => b.count - a.count || (sortTiesByName ? a.name.localeCompare(b.name) : 0));
	return {
		totalCalls: entries.reduce((sum, entry) => sum + entry.count, 0),
		uniqueTools: entries.length,
		tools: entries
	};
}
function createDatedRowsAccumulator(add, options) {
	const rows = /* @__PURE__ */ new Map();
	const keyOf = options?.key ?? ((row) => row.quarterIndex === void 0 ? row.date : `${row.date}:${row.quarterIndex}`);
	const clone = options?.clone ?? ((row) => ({ ...row }));
	return {
		add(source) {
			for (const row of source ?? []) {
				const key = keyOf(row);
				const existing = rows.get(key);
				if (existing) add(existing, row);
				else rows.set(key, clone(row));
			}
		},
		finish() {
			return rows.size ? Array.from(rows.values()).toSorted((a, b) => a.date.localeCompare(b.date) || (a.quarterIndex ?? 0) - (b.quarterIndex ?? 0)) : void 0;
		}
	};
}
function mergeMessageCountSummaries(left, right) {
	if (!left) return right ? { ...right } : void 0;
	const counts = { ...left };
	if (right) addMessageCounts(counts, right);
	return counts;
}
function mergeLatencyStats(left, right) {
	if (!left && !right) return;
	const leftCount = left?.count ?? 0;
	const rightCount = right?.count ?? 0;
	const count = leftCount + rightCount;
	return {
		count,
		avgMs: count > 0 ? ((left?.avgMs ?? 0) * leftCount + (right?.avgMs ?? 0) * rightCount) / count : 0,
		p95Ms: Math.max(left?.p95Ms ?? 0, right?.p95Ms ?? 0),
		minMs: Math.min(left?.minMs ?? Number.POSITIVE_INFINITY, right?.minMs ?? Number.POSITIVE_INFINITY),
		maxMs: Math.max(left?.maxMs ?? 0, right?.maxMs ?? 0)
	};
}
function createSessionCostSummaryAccumulator(identity) {
	const target = {
		...createEmptyCostUsageTotals(),
		...identity
	};
	const activityDates = /* @__PURE__ */ new Set();
	const dailyBreakdown = createDatedRowsAccumulator((current, row) => {
		addCostUsageTotals(current, row);
		current.tokens += row.tokens;
		current.cost += row.cost;
	}, { clone: (row) => ({
		...row,
		...cloneCostUsageTotals(row)
	}) });
	const dailyMessageCounts = createDatedRowsAccumulator(addMessageCounts);
	const quarterMessages = createDatedRowsAccumulator(addMessageCounts);
	const quarterTokens = createDatedRowsAccumulator((current, row) => {
		current.input += row.input;
		current.output += row.output;
		current.cacheRead += row.cacheRead;
		current.cacheWrite += row.cacheWrite;
		current.totalTokens += row.totalTokens;
		current.totalCost += row.totalCost;
	});
	const dailyLatency = createDatedRowsAccumulator((current, row) => {
		const count = current.count + row.count;
		current.avgMs = count > 0 ? (current.avgMs * current.count + row.avgMs * row.count) / count : 0;
		current.count = count;
		current.p95Ms = Math.max(current.p95Ms, row.p95Ms);
		current.minMs = Math.min(current.minMs, row.minMs);
		current.maxMs = Math.max(current.maxMs, row.maxMs);
	});
	const dailyModels = createDatedRowsAccumulator((current, row) => {
		current.tokens += row.tokens;
		current.cost += row.cost;
		current.count += row.count;
	}, { key: (row) => usageDailyModelIdentity(row.date, row.provider, row.model) });
	return {
		add(source) {
			addCostUsageTotals(target, source);
			target.firstActivity = target.firstActivity === void 0 ? source.firstActivity : source.firstActivity === void 0 ? target.firstActivity : Math.min(target.firstActivity, source.firstActivity);
			target.lastActivity = target.lastActivity === void 0 ? source.lastActivity : source.lastActivity === void 0 ? target.lastActivity : Math.max(target.lastActivity, source.lastActivity);
			if (target.firstActivity !== void 0 && target.lastActivity !== void 0) target.durationMs = Math.max(0, target.lastActivity - target.firstActivity);
			for (const date of source.activityDates ?? []) activityDates.add(date);
			dailyBreakdown.add(source.dailyBreakdown);
			dailyMessageCounts.add(source.dailyMessageCounts);
			quarterMessages.add(source.utcQuarterHourMessageCounts);
			quarterTokens.add(source.utcQuarterHourTokenUsage);
			dailyLatency.add(source.dailyLatency);
			dailyModels.add(source.dailyModelUsage);
			target.messageCounts = mergeMessageCountSummaries(target.messageCounts, source.messageCounts);
			const tools = /* @__PURE__ */ new Map();
			mergeTools(tools, target.toolUsage?.tools ?? []);
			mergeTools(tools, source.toolUsage?.tools ?? []);
			target.toolUsage = buildToolUsage(tools, false);
			const models = /* @__PURE__ */ new Map();
			mergeModels(models, target.modelUsage ?? []);
			mergeModels(models, source.modelUsage ?? []);
			target.modelUsage = sortedModelUsage(models, false);
			target.latency = mergeLatencyStats(target.latency, source.latency);
		},
		finish() {
			if (activityDates.size) target.activityDates = Array.from(activityDates).toSorted();
			target.dailyBreakdown = dailyBreakdown.finish();
			target.dailyMessageCounts = dailyMessageCounts.finish();
			target.utcQuarterHourMessageCounts = quarterMessages.finish();
			target.utcQuarterHourTokenUsage = quarterTokens.finish();
			target.dailyLatency = dailyLatency.finish();
			target.dailyModelUsage = dailyModels.finish();
			return target;
		}
	};
}
function usageBucketsInRange(rollup, startMs, endMs) {
	return Object.values(rollup.buckets).filter((bucket) => bucket.timestampMs >= startMs && bucket.timestampMs <= endMs).toSorted((a, b) => a.timestampMs - b.timestampMs);
}
function buildSessionCostSummaryFromRollup(params) {
	const totals = createEmptyCostUsageTotals();
	const messageCounts = emptyMessageCounts();
	const tools = /* @__PURE__ */ new Map();
	const models = /* @__PURE__ */ new Map();
	const activityDates = /* @__PURE__ */ new Set();
	const dailyUsage = /* @__PURE__ */ new Map();
	const dailyMessages = /* @__PURE__ */ new Map();
	const quarterMessages = /* @__PURE__ */ new Map();
	const quarterTokens = /* @__PURE__ */ new Map();
	const dailyLatencies = /* @__PURE__ */ new Map();
	const dailyModels = /* @__PURE__ */ new Map();
	const allLatencies = createLatencyAggregate();
	let firstActivity;
	let lastActivity;
	const mergeBucket = (bucket) => {
		const date = new Date(bucket.timestampMs);
		const dayKey = params.formatDay(date);
		const quarter = getUtcQuarterHourBucketKey(date);
		firstActivity = firstActivity === void 0 ? bucket.timestampMs : Math.min(firstActivity, bucket.timestampMs);
		lastActivity = lastActivity === void 0 ? bucket.timestampMs : Math.max(lastActivity, bucket.timestampMs);
		activityDates.add(dayKey);
		addCostUsageTotals(totals, bucket.totals);
		addMessageCounts(messageCounts, bucket.messageCounts);
		mergeTools(tools, bucket.tools);
		mergeModels(models, bucket.models);
		const daily = dailyUsage.get(dayKey) ?? createEmptyCostUsageTotals();
		addCostUsageTotals(daily, bucket.totals);
		dailyUsage.set(dayKey, daily);
		const dailyMessage = dailyMessages.get(dayKey) ?? {
			date: dayKey,
			...emptyMessageCounts()
		};
		addMessageCounts(dailyMessage, bucket.messageCounts);
		dailyMessages.set(dayKey, dailyMessage);
		const quarterMessage = quarterMessages.get(quarter.bucketId) ?? {
			date: quarter.date,
			quarterIndex: quarter.quarterIndex,
			...emptyMessageCounts()
		};
		addMessageCounts(quarterMessage, bucket.messageCounts);
		quarterMessages.set(quarter.bucketId, quarterMessage);
		const quarterUsage = quarterTokens.get(quarter.bucketId) ?? {
			date: quarter.date,
			quarterIndex: quarter.quarterIndex,
			input: 0,
			output: 0,
			cacheRead: 0,
			cacheWrite: 0,
			totalTokens: 0,
			totalCost: 0
		};
		quarterUsage.input += bucket.totals.input;
		quarterUsage.output += bucket.totals.output;
		quarterUsage.cacheRead += bucket.totals.cacheRead;
		quarterUsage.cacheWrite += bucket.totals.cacheWrite;
		quarterUsage.totalTokens += bucket.totals.totalTokens;
		quarterUsage.totalCost += bucket.totals.totalCost;
		quarterTokens.set(quarter.bucketId, quarterUsage);
		for (const model of bucket.models) {
			const modelBucketId = usageDailyModelIdentity(dayKey, model.provider, model.model);
			const existing = dailyModels.get(modelBucketId) ?? {
				date: dayKey,
				provider: model.provider,
				model: model.model,
				tokens: 0,
				cost: 0,
				count: 0
			};
			existing.tokens += model.totals.totalTokens;
			existing.cost += model.totals.totalCost;
			existing.count += model.count;
			dailyModels.set(modelBucketId, existing);
		}
		mergeLatencyAggregate(allLatencies, bucket.latency);
		const dailyLatency = dailyLatencies.get(dayKey) ?? createLatencyAggregate();
		mergeLatencyAggregate(dailyLatency, bucket.latency);
		dailyLatencies.set(dayKey, dailyLatency);
	};
	for (const bucket of usageBucketsInRange(params.rollup, params.startMs, params.endMs)) mergeBucket(bucket);
	if (params.includeUntimestamped) {
		addCostUsageTotals(totals, params.rollup.untimestamped.totals);
		addMessageCounts(messageCounts, params.rollup.untimestamped.messageCounts);
		mergeTools(tools, params.rollup.untimestamped.tools);
		mergeModels(models, params.rollup.untimestamped.models);
	}
	const dailyLatency = Array.from(dailyLatencies, ([date, aggregate]) => {
		const stats = computeLatencyStats(aggregate);
		return stats ? Object.assign({ date }, stats) : null;
	}).filter((entry) => entry !== null).toSorted((a, b) => a.date.localeCompare(b.date));
	const utcQuarterHourMessageCounts = Array.from(quarterMessages.values()).toSorted((a, b) => a.date.localeCompare(b.date) || a.quarterIndex - b.quarterIndex);
	const utcQuarterHourTokenUsage = Array.from(quarterTokens.values()).toSorted((a, b) => a.date.localeCompare(b.date) || a.quarterIndex - b.quarterIndex);
	return {
		sessionId: params.sessionId,
		sessionFile: params.sessionFile,
		firstActivity,
		lastActivity,
		durationMs: firstActivity !== void 0 && lastActivity !== void 0 ? Math.max(0, lastActivity - firstActivity) : void 0,
		activityDates: Array.from(activityDates).toSorted(),
		dailyBreakdown: Array.from(dailyUsage, ([date, usage]) => Object.assign({
			date,
			tokens: usage.totalTokens,
			cost: usage.totalCost
		}, usage)).toSorted((a, b) => a.date.localeCompare(b.date)),
		dailyMessageCounts: Array.from(dailyMessages.values()).toSorted((a, b) => a.date.localeCompare(b.date)),
		utcQuarterHourMessageCounts: utcQuarterHourMessageCounts.length ? utcQuarterHourMessageCounts : void 0,
		utcQuarterHourTokenUsage: utcQuarterHourTokenUsage.length ? utcQuarterHourTokenUsage : void 0,
		dailyLatency: dailyLatency.length ? dailyLatency : void 0,
		dailyModelUsage: dailyModels.size ? Array.from(dailyModels.values()).toSorted((a, b) => a.date.localeCompare(b.date) || b.cost - a.cost) : void 0,
		messageCounts,
		toolUsage: buildToolUsage(tools),
		modelUsage: sortedModelUsage(models),
		latency: computeLatencyStats(allLatencies),
		...totals
	};
}
function addRollupToCostUsageSummary(params) {
	for (const bucket of usageBucketsInRange(params.rollup, params.startMs, params.endMs)) {
		const dayKey = params.formatDay(new Date(bucket.timestampMs));
		const daily = params.daily.get(dayKey) ?? createEmptyCostUsageTotals();
		addCostUsageTotals(daily, bucket.totals);
		params.daily.set(dayKey, daily);
		addCostUsageTotals(params.totals, bucket.totals);
	}
}
//#endregion
export { createSessionUsageRollupData as a, createSessionCostSummaryAccumulator as i, appendSessionUsageRollupContribution as n, UNKNOWN_USAGE_CREATOR_KEY as o, buildSessionCostSummaryFromRollup as r, createUsageAggregateAccumulator as s, addRollupToCostUsageSummary as t };
