import { a as parseSlackTarget, c as slackTargetsMatch } from "./target-parsing-DEsPjngB.mjs";
//#region extensions/slack/src/targets.ts
function matchesResolvedUserTarget(target, currentMessagingTarget) {
	const resolvedId = target.trim();
	if (!/^[UW][A-Z0-9]+$/i.test(resolvedId)) return false;
	const currentTarget = parseSlackTarget(currentMessagingTarget);
	return currentTarget?.kind === "user" && currentTarget.id.toLowerCase() === resolvedId.toLowerCase();
}
function slackContextTargetsMatch(target, context) {
	return Boolean(context.currentMessagingTarget && (slackTargetsMatch(target, context.currentMessagingTarget) || matchesResolvedUserTarget(target, context.currentMessagingTarget)) || context.currentChannelId && slackTargetsMatch(target, context.currentChannelId));
}
//#endregion
export { slackContextTargetsMatch as t };
