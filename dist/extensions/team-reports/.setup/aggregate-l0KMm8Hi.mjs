import { i as periodDayKeys } from "./limits-iMrGeJ-3.mjs";
import { createHash } from "node:crypto";
//#region extensions/team-reports/src/roster.ts
function isBotLogin(login) {
	return /(?:\[bot\]|bot)$/i.test(login) || /^(?:copilot|codex)$/i.test(login);
}
function primaryLogin(person) {
	const login = person.github[0];
	if (!login) throw new Error("A report identity requires at least one GitHub login");
	return login.toLowerCase();
}
function buildRoster(people, githubPeople = []) {
	const byLogin = /* @__PURE__ */ new Map();
	const byDiscordId = /* @__PURE__ */ new Map();
	const all = [];
	for (const [entries, configured] of [[people, true], [githubPeople, false]]) for (const entry of entries) {
		const github = [...new Set(entry.github.map((login) => login.trim().toLowerCase()))];
		if (!github.length || github.some((login) => !login)) throw new Error("A report identity requires nonempty GitHub logins");
		const overlaps = new Set(github.map((login) => byLogin.get(login)).filter((person) => person !== void 0));
		if (overlaps.size) {
			if (configured || overlaps.size > 1) throw new Error(`Conflicting report identity: ${github.join(", ")}`);
			continue;
		}
		if (github.every(isBotLogin)) continue;
		const person = {
			...entry,
			github,
			...entry.access ? { access: [...entry.access] } : {},
			...entry.areas ? { areas: [...entry.areas] } : {}
		};
		all.push(person);
		for (const login of github) byLogin.set(login, person);
		if (person.discordUserId) {
			if (byDiscordId.has(person.discordUserId)) throw new Error(`Conflicting Discord identity for ${primaryLogin(person)}`);
			byDiscordId.set(person.discordUserId, person);
		}
	}
	return {
		members: all.filter((person) => person.status !== "archived").toSorted((a, b) => primaryLogin(a).localeCompare(primaryLogin(b))),
		byLogin,
		byDiscordId
	};
}
//#endregion
//#region extensions/team-reports/src/text.ts
const segmenter = new Intl.Segmenter(void 0, { granularity: "grapheme" });
function truncateGraphemes(text, max) {
	const graphemes = [];
	for (const { segment } of segmenter.segment(text)) {
		if (graphemes.length === max) return `${graphemes.slice(0, -1).join("")}…`;
		graphemes.push(segment);
	}
	return text;
}
//#endregion
//#region extensions/team-reports/src/aggregate.ts
const COUNT_FIELDS = [
	"total",
	"commits",
	"prsOpened",
	"prsMerged",
	"prsClosed",
	"issuesOpened",
	"issuesClosed",
	"issueComments",
	"reviewComments",
	"securityAdvisories"
];
const KIND_COUNTS = {
	commit: "commits",
	pr_opened: "prsOpened",
	pr_merged: "prsMerged",
	pr_closed: "prsClosed",
	issue_opened: "issuesOpened",
	issue_closed: "issuesClosed",
	issue_comment: "issueComments",
	review_comment: "reviewComments",
	security_advisory: "securityAdvisories"
};
function emptyGithub() {
	return {
		total: 0,
		commits: 0,
		prsOpened: 0,
		prsMerged: 0,
		prsClosed: 0,
		issuesOpened: 0,
		issuesClosed: 0,
		issueComments: 0,
		reviewComments: 0,
		securityAdvisories: 0,
		repos: {}
	};
}
function increment(counts, key, value = 1) {
	Object.defineProperty(counts, key, {
		value: (Object.hasOwn(counts, key) ? counts[key] ?? 0 : 0) + value,
		enumerable: true,
		configurable: true,
		writable: true
	});
}
function sumMap(target, source) {
	for (const [key, value] of Object.entries(source)) increment(target, key, value);
}
function sumGithub(target, source) {
	for (const field of COUNT_FIELDS) target[field] += source[field];
	sumMap(target.repos, source.repos);
}
function countItem(counts, item) {
	counts.total++;
	counts[KIND_COUNTS[item.kind]]++;
	increment(counts.repos, item.repo);
}
function emptyMember(person) {
	return {
		login: primaryLogin(person),
		display: person.display || primaryLogin(person),
		affiliation: person.affiliation,
		roleGroup: person.roleGroup,
		roleLabel: person.roleLabel,
		access: [...person.access ?? []],
		areas: [...person.areas ?? []],
		aliases: person.github.slice(1),
		github: {
			...emptyGithub(),
			items: []
		},
		discord: {
			total: 0,
			channels: {},
			excerpts: []
		}
	};
}
function otherBucket(others, login) {
	let bucket = others.get(login);
	if (!bucket) {
		bucket = {
			login,
			github: emptyGithub()
		};
		others.set(login, bucket);
	}
	return bucket;
}
function emptyReport(period, nowMs, orgs, sources) {
	return {
		version: 1,
		period: { ...period },
		generatedAtMs: nowMs,
		status: nowMs < period.untilMs ? "partial" : "closed",
		orgs: [...new Set(orgs)].toSorted(),
		memberCount: 0,
		activeMembers: 0,
		totals: {
			github: emptyGithub(),
			discord: {
				messages: 0,
				channels: {}
			}
		},
		members: [],
		otherActors: [],
		unmatchedDiscord: [],
		sources: structuredClone(sources)
	};
}
function itemKey(item) {
	return JSON.stringify([
		item.kind,
		item.repo,
		item.url || [item.atMs, item.title]
	]);
}
function newestFirst(a, b) {
	return b.atMs - a.atMs || itemKey(a).localeCompare(itemKey(b)) || a.actor.localeCompare(b.actor);
}
function evidenceItem(item) {
	const { body: _body, ...evidence } = item;
	return structuredClone(evidence);
}
function finishReport(report) {
	report.members = report.members.toSorted((a, b) => b.github.total + b.discord.total - (a.github.total + a.discord.total) || a.login.localeCompare(b.login));
	report.memberCount = report.members.length;
	report.activeMembers = report.members.filter((member) => member.github.total + member.discord.total > 0).length;
	for (const member of report.members) if (member.github.total + member.discord.total === 0) member.summary = {
		text: "No visible GitHub or Discord activity in this report window.",
		confidence: "low",
		source: "fallback"
	};
	report.otherActors = report.otherActors.toSorted((a, b) => b.github.total - a.github.total || a.login.localeCompare(b.login));
	report.unmatchedDiscord = report.unmatchedDiscord.toSorted((a, b) => b.messages - a.messages || a.authorId.localeCompare(b.authorId));
	return boundReportDocument(report);
}
function aggregateDay(options) {
	const { period, nowMs, roster, discordConfig } = options;
	if (period.period !== "day") throw new Error("Source activity must be aggregated into a UTC day report");
	const report = emptyReport(period, nowMs, options.orgs, {
		github: options.githubStatus,
		...options.discordStatus ? { discord: options.discordStatus } : {}
	});
	const members = new Map(roster.members.map((person) => [primaryLogin(person), emptyMember(person)]));
	const others = /* @__PURE__ */ new Map();
	const commentBodies = /* @__PURE__ */ new Set();
	const credits = /* @__PURE__ */ new Set();
	const patterns = (options.ignoreCommentPatterns ?? []).map((pattern) => new RegExp(pattern.source, pattern.flags.replace(/[gy]/g, "")));
	for (const item of Array.isArray(options.items) ? options.items.toSorted(newestFirst) : options.items) {
		if (item.atMs < period.sinceMs || item.atMs >= Math.min(period.untilMs, nowMs)) continue;
		const actor = item.actor.trim().toLowerCase();
		const comment = item.kind === "issue_comment" || item.kind === "review_comment";
		const body = item.body;
		if (comment && body !== void 0) {
			const key = JSON.stringify([
				actor,
				item.kind,
				createHash("sha256").update(body, "utf16le").digest("hex")
			]);
			if (commentBodies.has(key) || patterns.some((pattern) => pattern.test(body))) continue;
			commentBodies.add(key);
		}
		const people = /* @__PURE__ */ new Set();
		if (actor && !isBotLogin(actor)) {
			const person = roster.byLogin.get(actor);
			people.add(person ? primaryLogin(person) : actor);
		}
		if (item.kind === "commit") for (const value of item.coauthors ?? []) {
			const login = value.trim().toLowerCase().match(/(?:\d+\+)?([a-z\d-]+)@users\.noreply\.github\.com(?:>|$)/i)?.[1] ?? value.trim().toLowerCase();
			const person = roster.byLogin.get(login);
			if (person && !isBotLogin(login)) people.add(primaryLogin(person));
		}
		for (const login of people) {
			const key = JSON.stringify([login, itemKey(item)]);
			if (credits.has(key)) continue;
			credits.add(key);
			const member = members.get(login);
			countItem(member?.github ?? otherBucket(others, login).github, item);
			countItem(report.totals.github, item);
			if (member) {
				if (member.github.items.length < 200) member.github.items.push(evidenceItem(item));
				else report.truncated = true;
			}
		}
	}
	const channels = new Map(discordConfig?.channels.map((channel) => [channel.id, channel]));
	const unmatched = /* @__PURE__ */ new Map();
	for (const message of Array.isArray(options.messages) ? options.messages.toSorted((a, b) => b.atMs - a.atMs || a.channelId.localeCompare(b.channelId) || a.authorId.localeCompare(b.authorId)) : options.messages) {
		const channel = channels.get(message.parentChannelId);
		if (!channel || message.authorIsBot || !message.content.trim() || message.atMs < period.sinceMs || message.atMs >= Math.min(period.untilMs, nowMs)) continue;
		const separator = message.channelName.indexOf("/");
		const channelName = message.channelId === message.parentChannelId || separator < 0 ? message.channelName : message.channelName.slice(0, separator);
		const person = roster.byDiscordId.get(message.authorId);
		const member = person ? members.get(primaryLogin(person)) : void 0;
		report.totals.discord.messages++;
		increment(report.totals.discord.channels, channelName);
		if (!member) {
			unmatched.set(message.authorId, (unmatched.get(message.authorId) ?? 0) + 1);
			continue;
		}
		member.discord.total++;
		increment(member.discord.channels, channelName);
		if (channel.excerpts) {
			const collapsed = message.content.replace(/\s+/g, " ").trim();
			member.discord.excerpts.push({
				channel: message.channelName,
				atMs: message.atMs,
				excerpt: truncateGraphemes(collapsed, discordConfig?.excerptMaxChars ?? 260)
			});
			if (member.discord.excerpts.length > 8) {
				report.truncated = true;
				member.discord.excerpts = member.discord.excerpts.toSorted((a, b) => b.atMs - a.atMs || a.channel.localeCompare(b.channel) || a.excerpt.localeCompare(b.excerpt)).slice(0, 8);
			}
		}
	}
	report.members = [...members.values()];
	report.otherActors = [...others.values()];
	report.unmatchedDiscord = [...unmatched].map(([authorId, messages]) => ({
		authorId,
		messages
	}));
	return finishReport(report);
}
function mergeStatus(statuses) {
	const result = {
		ok: statuses.every((source) => source.ok),
		warnings: [...new Set(statuses.flatMap((source) => source.warnings))],
		stats: { daysAggregated: statuses.length }
	};
	if (statuses.some((source) => source.stale)) result.stale = true;
	return result;
}
function aggregateDays(options) {
	const { period, nowMs, roster } = options;
	if (period.period === "day") throw new Error("Stored days can only be aggregated into a week or month");
	const input = options.days;
	const readDays = typeof input === "function" ? input : () => input.toSorted((a, b) => a.period.sinceMs - b.period.sinceMs);
	const byDay = /* @__PURE__ */ new Map();
	for (const day of readDays()) if (day.period.period === "day" && day.period.sinceMs >= period.sinceMs && day.period.untilMs <= period.untilMs && day.period.sinceMs < nowMs) {
		const previous = byDay.get(day.period.key);
		if (!previous || previous.generatedAtMs < day.generatedAtMs) {
			const { period: dayPeriod, generatedAtMs, orgs, sources, truncated } = day;
			byDay.set(dayPeriod.key, {
				period: dayPeriod,
				generatedAtMs,
				orgs,
				sources,
				truncated
			});
		}
	}
	const days = [...byDay.values()].toSorted((a, b) => a.period.sinceMs - b.period.sinceMs);
	if (new Set(days.map((day) => day.orgs.map((org) => org.toLowerCase()).toSorted().join(","))).size > 1) throw new Error("Cannot aggregate day reports from different GitHub organization scopes");
	const github = mergeStatus(days.map((day) => day.sources.github));
	const missing = periodDayKeys(period, nowMs).filter((key) => !byDay.has(key));
	if (missing.length) {
		github.warnings.push(`Missing day reports: ${missing.join(", ")}`);
		github.stale = true;
	}
	const discordStatuses = days.flatMap((day) => day.sources.discord ? [day.sources.discord] : []);
	const report = emptyReport(period, nowMs, options.orgs ?? days[0]?.orgs ?? [], {
		github,
		...discordStatuses.length ? { discord: mergeStatus(discordStatuses) } : {}
	});
	const currentRoster = nowMs < period.untilMs ? roster : void 0;
	const members = new Map((currentRoster?.members ?? []).map((person) => [primaryLogin(person), emptyMember(person)]));
	const others = /* @__PURE__ */ new Map();
	const unmatched = /* @__PURE__ */ new Map();
	const included = /* @__PURE__ */ new Set();
	for (const day of readDays()) {
		if (included.has(day.period.key) || byDay.get(day.period.key)?.generatedAtMs !== day.generatedAtMs) continue;
		included.add(day.period.key);
		sumGithub(report.totals.github, day.totals.github);
		report.totals.discord.messages += day.totals.discord.messages;
		sumMap(report.totals.discord.channels, day.totals.discord.channels);
		for (const source of day.members) {
			const identity = currentRoster?.byLogin.get(source.login);
			if (identity?.status === "archived") {
				sumGithub(otherBucket(others, primaryLogin(identity)).github, source.github);
				if (identity.discordUserId && source.discord.total) unmatched.set(identity.discordUserId, (unmatched.get(identity.discordUserId) ?? 0) + source.discord.total);
				continue;
			}
			const login = identity ? primaryLogin(identity) : source.login;
			let member = members.get(login);
			if (!member) {
				member = {
					...structuredClone(source),
					login,
					github: {
						...emptyGithub(),
						items: []
					},
					discord: {
						total: 0,
						channels: {},
						excerpts: []
					},
					summary: void 0
				};
				members.set(login, member);
			}
			sumGithub(member.github, source.github);
			member.github.items.push(...source.github.items.map(evidenceItem));
			member.discord.total += source.discord.total;
			sumMap(member.discord.channels, source.discord.channels);
			member.discord.excerpts.push(...structuredClone(source.discord.excerpts));
			boundMemberEvidence(report, member);
		}
		for (const actor of day.otherActors) sumGithub(otherBucket(others, actor.login).github, actor.github);
		for (const entry of day.unmatchedDiscord) unmatched.set(entry.authorId, (unmatched.get(entry.authorId) ?? 0) + entry.messages);
	}
	if (days.some((day) => day.truncated)) report.truncated = true;
	report.members = [...members.values()];
	report.otherActors = [...others.values()];
	report.unmatchedDiscord = [...unmatched].map(([authorId, messages]) => ({
		authorId,
		messages
	}));
	return finishReport(report);
}
function boundMemberEvidence(report, member) {
	if (member.github.items.length > 200 || member.discord.excerpts.length > 8) report.truncated = true;
	member.github.items = member.github.items.map(evidenceItem).toSorted(newestFirst).slice(0, 200);
	member.discord.excerpts = member.discord.excerpts.toSorted((a, b) => b.atMs - a.atMs || a.channel.localeCompare(b.channel) || a.excerpt.localeCompare(b.excerpt)).slice(0, 8);
}
function boundReportDocument(input) {
	const report = structuredClone(input);
	for (const member of report.members) boundMemberEvidence(report, member);
	if (Buffer.byteLength(JSON.stringify(report)) <= 2097152) return report;
	report.truncated = true;
	let size = Buffer.byteLength(JSON.stringify(report));
	const evidence = report.members.flatMap((member) => [...member.github.items.map((item) => ({
		atMs: item.atMs,
		list: member.github.items
	})), ...member.discord.excerpts.map((excerpt) => ({
		atMs: excerpt.atMs,
		list: member.discord.excerpts
	}))]).toSorted((a, b) => a.atMs - b.atMs);
	for (const entry of evidence) {
		if (size <= 2097152) break;
		const removed = entry.list.pop();
		if (removed) size -= Buffer.byteLength(JSON.stringify(removed)) + (entry.list.length ? 1 : 0);
	}
	if (Buffer.byteLength(JSON.stringify(report)) > 2097152) throw new Error("Team report metadata exceeds the 2 MiB limit after removing all item evidence; reduce the configured roster or organization scope");
	return report;
}
//#endregion
export { truncateGraphemes as a, itemKey as i, aggregateDays as n, buildRoster as o, boundReportDocument as r, aggregateDay as t };
