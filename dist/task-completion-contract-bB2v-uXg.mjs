import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
//#region src/tasks/task-completion-contract.ts
const PROGRESS_ACTION = String.raw`(?:analyz(?:e|ing)|apply|check(?:ing)?|confirm(?:ing)?|continue|debug(?:ging)?|figur(?:e|ing)\s+out|find(?:ing)?\s+out|follow(?:ing)?\s+up|get(?:ting)?|inspect(?:ing)?|investigat(?:e|ing)|look(?:ing)?(?:\s+into)?|map(?:ping)?|open(?:ing)?|read(?:ing)?|report(?:ing)?(?:\s+back)?|review(?:ing)?|run(?:ning)?|see(?:ing)?|start(?:ing)?|test(?:ing)?|trace|trac(?:e|ing)|try(?:ing)?|update|verify(?:ing)?|work(?:ing)?)`;
const PROGRESS_ONLY_PATTERN = new RegExp(String.raw`^(?:i(?:'|\u2019)ll|i will|i(?:'|\u2019)m|i am|i(?:'|\u2019)m going to|i am going to|let me|i need to)\s+(?:now\s+)?${PROGRESS_ACTION}`, "i");
const BARE_PROGRESS_ONLY_PATTERN = /^(?:analyz(?:e|ing)|check(?:ing)?|debug(?:ging)?|inspect(?:ing)?|investigat(?:e|ing)|look(?:ing)?\s+into|map(?:ping)?|read(?:ing)?|report(?:ing)?\s+back|review(?:ing)?|run(?:ning)?|test(?:ing)?|trac(?:e|ing)|verify(?:ing)?|work(?:ing)?\s+on)\b/i;
const FOLLOW_UP_PLANNING_PREFIX_PATTERN = /^(?:after(?:wards|\s+that)?|from\s+there|next|once\s+(?:done|that(?:'|\u2019)?s\s+done|that\s+is\s+done)|then)[,.\s]+/i;
const PLANNING_TIME_PREFIX_PATTERN = /^(?:(?:today|tomorrow|tonight|later|soon|eventually)(?:\s+(?:morning|afternoon|evening|night))?|(?:next|this)\s+(?:week|month|year|morning|afternoon|evening|weekend)|(?:in|within)\s+(?:a|an|\d+)\s+(?:moments?|minutes?|hours?|days?|weeks?)|at\s+(?:noon|midnight|\d{1,2}(?::\d{2})?(?:\s*[ap]\.?m\.?)?)|on\s+(?:monday|tuesday|wednesday|thursday|friday|saturday|sunday)(?:\s+(?:morning|afternoon|evening|night))?)(?:,\s+|\s+(?=(?:i|we)\b))/i;
const CONTEXT_PREPOSITION = String.raw`(?:in|on|at|by|during|within|following|upon|for)`;
const CONTEXT_START_PATTERN = new RegExp(String.raw`^${CONTEXT_PREPOSITION}\b`, "i");
const LEADING_CONTEXT_PATTERN = new RegExp(String.raw`^(?:${CONTEXT_PREPOSITION}\b.*?(?:,\s*|:\s+|\s+(?=(?:i|we)\b)))+`, "i");
const COMPLETION_RESULT_CLAUSE_PATTERN = /^(?:(?:(?:i|we)(?:\s+(?:have\s+)?|(?:'|\u2019)ve\s+)|(?:i(?:\s+am|(?:'|\u2019)m)|we(?:\s+are|(?:'|\u2019)re))\s+))?(?:done|completed|finished|fixed|patched|resolved|deployed|landed|merged|implemented|confirmed)\b|(?:^|,\s*|\band\s+)(?:(?:(?:i|we)(?:\s+(?:have\s+)?|(?:'|\u2019)ve\s+)|(?:i(?:\s+am|(?:'|\u2019)m)|we(?:\s+are|(?:'|\u2019)re))\s+)(?:done|completed|finished|fixed|patched|resolved|deployed|landed|merged|implemented|confirmed)\b|(?:,\s*|\band\s+|^)(?<testSubject>(?:(?:all|the)\s+)?(?:\d+\s+)?(?:(?!(?:and|but|or|so|then|why|whether|if|unless|when|once|after|will|would|could|should|might|may)\b)[\w-]+\s+){0,3}(?:tests?|build|lint|checks?|syntax))\s+(?<testAuxiliary>(?:have|has)\s+)?(?:passed|succeeded|green)\b)/gi;
const CONDITIONAL_PROGRESS_PATTERN = /\b(?:whether|if|unless|once|when|after|as\s+soon\s+as)\b/i;
const CONDITION_CLAUSE_PREFIX = String.raw`(?:^|[,;:]\s*|\b(?:and|but|or|so|then)\s+)(?:(?:and|but|or|so|then)\s+)*`;
const FRONTED_CONDITIONAL_PATTERN = new RegExp(String.raw`${CONDITION_CLAUSE_PREFIX}(?:if|unless)\b`, "i");
const FRONTED_TEMPORAL_PATTERN = new RegExp(String.raw`${CONDITION_CLAUSE_PREFIX}(when|once|after|as\s+soon\s+as)\b([^,]*)`, "gi");
const FIRST_PERSON_PLAN_PATTERN = /^(?:let\s+me|(?:i|we)(?:'|\u2019)ll|(?:i(?:\s+am|(?:'|\u2019)m)|we(?:\s+are|(?:'|\u2019)re))\s+going\s+to|(?:i|we)\s+(?:will|would|could|should|might|may|plan\s+to|hope\s+to|need\s+to))\b/i;
const ONGOING_NARRATION_PATTERN = /^(?:i(?:\s+am|(?:'|\u2019)m)|we(?:\s+are|(?:'|\u2019)re))\s+(?:(?:[a-z]+ly|now)\s+)*[a-z]+ing\b/i;
const EXPLICIT_RESULT_SUBJECT_PATTERN = /^(?:i|we|you|he|she|it|they)$|^(?:the|a|an|all|both|each|every|some|any|no|my|our|your|his|her|its|their|this|that|these|those|\d+)\b|^[\w-]+(?:'|\u2019)s\s/i;
const BARE_VERIFICATION_SUBJECT_PATTERN = /^(?:(?:unit|integration|regression|smoke|e2e|end-to-end)\s+)?(?:tests?|build|lint|checks?|syntax)$/i;
const NOMINAL_ACTION_WORD_PATTERN = new RegExp(String.raw`^${PROGRESS_ACTION}$`, "i");
const NOMINAL_HEAD_PATTERN = /(?:s|er|or|ist|ion|ment|ance|ence|ity|ness|ship|hood|ee)$|^(?:team|group|suite|window|cache|gateway|pipeline|build|lint|check|test|syntax)$/i;
const NOMINAL_MODIFIER_PATTERN = /(?:ed|ly|al|ive|ous|ful|less)$/i;
const NOMINAL_COMPOUND_HEAD_PATTERN = /^(?:teams?|groups?|suites?|windows?|caches?|gateways?|pipelines?)$/i;
const RESULT_TAIL_PATTERN = /^(?:[.!?,;:]|$|(?:and|but|so|because|after|when|once|if|unless|with|without|on|in|at|for|during|already|just|[a-z]+ly)\b)/i;
const CLOSED_RESULT_TAIL_PATTERN = /^(?:(?:[a-z]+ly|already|just)(?:\s+(?:[a-z]+ly|already|just)){0,2})?[.!?]*$/i;
function hasAmbiguousNominalSubject(subject, tail, finite) {
	const words = subject.replace(/^(?:the|a|an|all|both|each|every|some|any|no|my|our|your|his|her|its|their|this|that|these|those|\d+)\s+/i, "").split(/\s+/);
	if (words.length < 2) return false;
	let nounSeen = false;
	for (const [index, rawWord] of words.entries()) {
		const word = rawWord.replace(/(?:'|\u2019)s$/i, "");
		const action = [
			word,
			word.replace(/s$/i, ""),
			word.replace(/ies$/i, "y")
		].some((form) => NOMINAL_ACTION_WORD_PATTERN.test(form));
		const compoundTest = /^test$/i.test(word) && /^suite$/i.test(words[index + 1] ?? "");
		const finalVerification = index === words.length - 1 && BARE_VERIFICATION_SUBJECT_PATTERN.test(word) && (finite || RESULT_TAIL_PATTERN.test(tail));
		const independentCompoundHead = index === words.length - 1 && NOMINAL_COMPOUND_HEAD_PATTERN.test(word) && (finite || CLOSED_RESULT_TAIL_PATTERN.test(tail));
		const ambiguousInflection = nounSeen && /s$/i.test(word) && !independentCompoundHead;
		if ((index > 0 && action && !compoundTest || ambiguousInflection) && !finalVerification) return true;
		if (NOMINAL_HEAD_PATTERN.test(word)) nounSeen = true;
		else if (nounSeen && !NOMINAL_MODIFIER_PATTERN.test(word)) return true;
	}
	return !nounSeen;
}
const COMPLETION_HEADING_PATTERN = /^(?:(?:result|results|report|summary|outcome|conclusion|findings?|verification|status)\s*:\s*)+/i;
const RESULT_SUBJECT_WORD = String.raw`(?!(?:if|unless|when|once|whether|before|after|while|and|or|that|which|will|would|could|should|might|may|can|must|have|has|had|did|am|is|are|was|were|not|never|to)\b|\w+(?:'|\u2019)(?:t|ll|m|re|ve|d)\b|(?:he|she|it|that|there)(?:'|\u2019)s\b)[\w'-]+`;
const RESULT_SUBJECT = String.raw`(?:(?:i|we|you|he|she|it|they)\b|(?!(?:i|we|you|he|she|it|they)\b)(?:${RESULT_SUBJECT_WORD}\s+){0,6}?(?!(?:the|a|an|all|both|my|our|your|his|her|its|their|already|just)\b|[\w'-]+ly\b)${RESULT_SUBJECT_WORD})`;
const PAST_RESULT_VERB = String.raw`(?:(?:(?:re|un|over|under|mis|out|fore|with)-?)?(?:${"arose|awoke|bore|beat|became|began|bent|bet|bit|bled|blew|broke|brought|built|burnt|burst|bought|caught|chose|came|cost|crept|cut|dealt|dug|did|drew|drank|drove|ate|fell|fed|felt|fought|found|fled|flew|forbade|forgot|forgave|froze|got|gave|went|grew|hung|heard|hid|hit|held|hurt|kept|knew|laid|led|leant|leapt|learnt|left|lent|let|lay|lit|lost|made|meant|met|paid|put|quit|read|rode|rang|rose|ran|said|saw|sought|sold|sent|set|shook|shone|shot|showed|shrank|shut|sang|sank|sat|slept|slid|smelt|spoke|spelt|spent|spilt|spun|split|spread|sprang|stood|stole|stuck|stung|stank|struck|swore|swept|swam|swung|took|taught|tore|told|thought|threw|understood|upset|woke|wore|wept|won|wound|wrote"})|(?!(?:need|feed|bleed|breed|heed|seed|weed|speed|succeed|exceed|proceed)\b)[a-z]+ed)`;
const PERFECT_RESULT_VERB = String.raw`(?:(?:re|un|over|under|mis|out|fore|with)-?)?(?:arisen|awoken|borne|beaten|become|begun|bitten|blown|broken|chosen|drunk|driven|eaten|fallen|flown|forbidden|forgotten|forgiven|frozen|gotten|given|gone|grown|hidden|known|lain|ridden|rung|risen|run|seen|shaken|shown|shrunk|sung|sunk|spoken|sprung|stolen|stunk|stricken|sworn|swum|taken|torn|thrown|woken|worn|written)`;
const RESULT_ADVERBS = String.raw`(?:(?:[a-z]+ly|already|just)\s+){0,3}`;
const COMPLETION_STATE_CLAUSE_PATTERN = new RegExp(String.raw`(?:^|,\s*|\band\s+)(?<subject>${RESULT_SUBJECT})\s+${RESULT_ADVERBS}(?:(?<perfectAuxiliary>(?:has|have)\s+)?${RESULT_ADVERBS}(?:${PAST_RESULT_VERB}|done)|(?<stateAuxiliary>is|are|was|were|has\s+been|have\s+been)\s+${RESULT_ADVERBS}(?:done|complete|completed|finished|fixed|resolved))\b`, "gi");
const PERFECT_RESULT_CLAUSE_PATTERN = new RegExp(String.raw`(?:^|,\s*|\band\s+)(?:(?<perfectSubject>${RESULT_SUBJECT})\s+${RESULT_ADVERBS}(?:has|have)|(?:i|we)(?:'|\u2019)ve)\s+${RESULT_ADVERBS}(?:${PAST_RESULT_VERB}|${PERFECT_RESULT_VERB}|done)\b`, "gi");
const COORDINATED_RESULT_CLAUSE_PATTERN = new RegExp(String.raw`(?:,\s*|\band\s+)${RESULT_ADVERBS}(?:${PAST_RESULT_VERB}|done|complete)\b`, "gi");
const UNFINISHED_RESULT_PATTERN = new RegExp(String.raw`^(?:${RESULT_SUBJECT}\s+)?${RESULT_ADVERBS}(?:did\s+(?:not|never)\b|(?:(?:had|has|have|was|were|did)\s+)?${RESULT_ADVERBS}(?:(?:attempt(?:ed)?|try|tried)\b|(?:plan(?:ned)?|hope(?:d)?|intend(?:ed)?|expect(?:ed)?|want(?:ed)?|need(?:ed)?|aim(?:ed)?|supposed)\s+to\b|(?:start(?:ed|s)?|begins?|began|begun|continu(?:e|ed|es)|proceed(?:ed|s)?|keep|keeps|kept)\s+(?:to\b|[a-z]+ing\b)))`, "i");
const ONGOING_RESULT_CLAUSE_PATTERN = new RegExp(String.raw`^(?:${RESULT_SUBJECT}\s+(?:am|is|are|was|were)|i(?:'|\u2019)m|(?:we|you|they)(?:'|\u2019)re|(?:he|she|it|that|there)(?:'|\u2019)s|${RESULT_SUBJECT}(?:'|\u2019)s)\s+${RESULT_ADVERBS}[a-z]+ing\b`, "i");
const PAST_TEMPORAL_EVENT_PATTERN = new RegExp(String.raw`^(?<subject>${RESULT_SUBJECT})\s+(?:(?:just|already|recently|finally)\s+)?(?:(?<auxiliary>was|were|had|did)|${PAST_RESULT_VERB})\b`, "i");
const PRESENT_TEMPORAL_EVENT_PATTERN = new RegExp(String.raw`^${RESULT_SUBJECT}\s+(?:(?:will|would|could|should|might|may|can|must|is|are|has|have|do|does)\b|(?:pass|succeed|fail|finish|complete|open|close|start|stop|end|arrive|recover|resolve|deploy|land|merge|return|restart|reboot|fire|crash|begin|break|go|come|respond|become|reach|settle|receive|expire|resume|appear|disappear|connect|disconnect|stabilize|install|publish|approve|accept|reject|clear|turn)(?:s|es)?\b)`, "i");
const FUTURE_COMPLETION_PATTERN = new RegExp(String.raw`^${RESULT_SUBJECT}\s+(?:(?:will|would|could|should|might|may|can|must)\b|(?:is|are)\s+going\s+to\b)`, "i");
const PENDING_COMPLETION_PATTERN = new RegExp(String.raw`^(?:${RESULT_SUBJECT}\s+(?:(?:is|are|remains?)\s+)?)?(?:still\s+)?(?:pending|in\s+progress|not\s+yet)[.!?]?$`, "i");
function hasDeferredTemporalResult(prefix, resultClause) {
	return [...prefix.matchAll(FRONTED_TEMPORAL_PATTERN), ...resultClause.matchAll(/\b(when|once|after|as\s+soon\s+as)\b([^,]*)/gi)].some(([, marker = "", event = ""]) => {
		const temporal = event.trim();
		const pastEvent = PAST_TEMPORAL_EVENT_PATTERN.exec(temporal);
		return !(pastEvent !== null && !hasAmbiguousNominalSubject(pastEvent.groups?.subject ?? "", temporal.slice(pastEvent[0].length).trimStart(), Boolean(pastEvent.groups?.auxiliary))) && (marker.toLowerCase() !== "after" || pastEvent !== null || PRESENT_TEMPORAL_EVENT_PATTERN.test(temporal));
	});
}
function normalizeCompletionText(value) {
	return value?.replace(/\s+/g, " ").trim() ?? "";
}
function normalizeCompletionFailureReason(value) {
	const normalized = normalizeCompletionText(value);
	if (!normalized) return "";
	return normalized.length <= 160 ? normalized : `${truncateUtf16Safe(normalized, 159)}...`;
}
function isProgressOnlyCompletionText(value) {
	let progressSeen = false;
	return value.split(/(?:[.!?;]|\s[-\u2013\u2014])\s+/).every((sentence) => {
		const parts = sentence.replace(PLANNING_TIME_PREFIX_PATTERN, "").replace(FOLLOW_UP_PLANNING_PREFIX_PATTERN, "").replace(COMPLETION_HEADING_PATTERN, "").trim().split(/:\s+/);
		const clauses = [];
		for (const part of parts) {
			const body = part.trim();
			if (!body || parts.length > 1 && `${body}:`.replace(COMPLETION_HEADING_PATTERN, "") === "") continue;
			const previous = clauses.at(-1);
			if (previous && (CONDITIONAL_PROGRESS_PATTERN.test(previous) || /^before\b/i.test(previous) || CONTEXT_START_PATTERN.test(previous))) clauses[clauses.length - 1] = `${previous}: ${body}`;
			else clauses.push(body);
		}
		return clauses.every((clause) => {
			const body = clause.replace(COMPLETION_HEADING_PATTERN, "").trim();
			const narration = body.replace(/^(?:if|unless|when|once|after|before|as\s+soon\s+as)\b.*?(?:,\s*|:\s+)/i, "").replace(LEADING_CONTEXT_PATTERN, "").replace(PLANNING_TIME_PREFIX_PATTERN, "");
			const narrativeProgress = PROGRESS_ONLY_PATTERN.test(narration) || BARE_PROGRESS_ONLY_PATTERN.test(narration) || ONGOING_NARRATION_PATTERN.test(narration) || FIRST_PERSON_PLAN_PATTERN.test(narration);
			const resultOffset = narrativeProgress ? body.search(/,|\band\s+/i) : 0;
			const resultText = resultOffset < 0 ? "" : body.slice(resultOffset);
			const results = [
				COMPLETION_RESULT_CLAUSE_PATTERN,
				COMPLETION_STATE_CLAUSE_PATTERN,
				PERFECT_RESULT_CLAUSE_PATTERN,
				COORDINATED_RESULT_CLAUSE_PATTERN
			].flatMap((pattern) => [...resultText.matchAll(pattern)].map((result) => {
				const subject = result.groups?.subject ?? result.groups?.testSubject ?? result.groups?.perfectSubject;
				const finite = result.groups?.perfectAuxiliary ?? result.groups?.stateAuxiliary ?? result.groups?.testAuxiliary ?? result.groups?.perfectSubject;
				const verificationTail = resultText.slice(result.index + result[0].length).trimStart();
				const independentVerification = subject !== void 0 && BARE_VERIFICATION_SUBJECT_PATTERN.test(subject) && (finite || result.groups?.testSubject && RESULT_TAIL_PATTERN.test(verificationTail));
				return {
					result,
					elidedSubject: pattern === COORDINATED_RESULT_CLAUSE_PATTERN,
					ambiguousNominalSubject: subject !== void 0 && hasAmbiguousNominalSubject(subject, verificationTail, Boolean(finite)),
					ambiguousSubject: subject !== void 0 && !EXPLICIT_RESULT_SUBJECT_PATTERN.test(subject) && !independentVerification && !(finite && /^[\w'-]+$/.test(subject))
				};
			}));
			const completedResult = results.some(({ result, elidedSubject, ambiguousSubject, ambiguousNominalSubject }) => {
				const resultIndex = resultOffset + result.index;
				const prefix = body.slice(0, resultIndex);
				const remainder = body.slice(resultIndex).replace(/^(?:,|and)\s*/i, "");
				const resultClause = remainder.split(/,(?!\s*(?:if|unless|whether|once|when|after|as\s+soon\s+as)\b)|\s+(?:and|but|so|because|to)\s+/i)[0] ?? "";
				const subjectClause = prefix.split(/(?:,|\b(?:and|but|so)\b)\s*(?=(?:i|we|you|he|she|it|they)\b)/i).at(-1)?.trim().replace(LEADING_CONTEXT_PATTERN, "");
				return !(FIRST_PERSON_PLAN_PATTERN.test(remainder) || ONGOING_RESULT_CLAUSE_PATTERN.test(result[0].replace(/^(?:,|and)\s*/i, "")) || (elidedSubject || ambiguousSubject || ambiguousNominalSubject) && (FIRST_PERSON_PLAN_PATTERN.test(subjectClause ?? "") || PROGRESS_ONLY_PATTERN.test(subjectClause ?? "") || BARE_PROGRESS_ONLY_PATTERN.test(subjectClause ?? "") || ONGOING_NARRATION_PATTERN.test(subjectClause ?? "")) || UNFINISHED_RESULT_PATTERN.test(remainder) || /\b(?:whether|if|unless)\b/i.test(resultClause) || FRONTED_CONDITIONAL_PATTERN.test(prefix) || /^and\b/i.test(result[0]) && !/,\s*$/.test(prefix) && CONDITIONAL_PROGRESS_PATTERN.test(prefix) || hasDeferredTemporalResult(prefix, resultClause));
			});
			const conditionalResult = results.length > 0 && !completedResult;
			const progress = narrativeProgress || PENDING_COMPLETION_PATTERN.test(body) || progressSeen && FUTURE_COMPLETION_PATTERN.test(narration) || progressSeen && (/^(?:if|unless|whether)\b/i.test(body) || hasDeferredTemporalResult(body, "")) || progressSeen && conditionalResult;
			progressSeen ||= progress;
			return progress && !completedResult;
		});
	});
}
function resolveRequiredCompletionTerminalResult(resultText) {
	const normalized = normalizeCompletionText(resultText);
	if (!normalized) return {
		terminalOutcome: "blocked",
		terminalSummary: "Required completion did not produce a final deliverable."
	};
	if (isProgressOnlyCompletionText(normalized)) return {
		terminalOutcome: "blocked",
		terminalSummary: "Required completion ended with progress-only text, not a final deliverable."
	};
	return {};
}
function resolveRequiredCompletionDeliveryFailureTerminalResult(reason) {
	const normalizedReason = normalizeCompletionFailureReason(reason);
	return {
		terminalOutcome: "blocked",
		terminalSummary: normalizedReason ? `Required completion delivery failed before reaching the requester: ${normalizedReason}.` : "Required completion delivery failed before reaching the requester."
	};
}
//#endregion
export { resolveRequiredCompletionTerminalResult as n, resolveRequiredCompletionDeliveryFailureTerminalResult as t };
