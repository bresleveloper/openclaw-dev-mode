//#region extensions/slack/src/channel-meta.ts
const SLACK_CHANNEL_META = {
	id: "slack",
	label: "Slack",
	selectionLabel: "Slack",
	docsPath: "/channels/slack",
	docsLabel: "slack",
	blurb: "supports bot + app tokens, channels, threads, and interactive replies.",
	systemImage: "number.square",
	markdownCapable: true
};
const DEFAULT_SLACK_SUGGESTED_PROMPTS = [
	{
		title: "What can you do?",
		message: "What can you help me with?"
	},
	{
		title: "Summarize this channel",
		message: "Summarize the recent activity in this channel."
	},
	{
		title: "Draft a reply",
		message: "Help me draft a reply."
	}
];
//#endregion
export { SLACK_CHANNEL_META as n, DEFAULT_SLACK_SUGGESTED_PROMPTS as t };
