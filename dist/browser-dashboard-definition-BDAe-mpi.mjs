import { ni as NEVER } from "./json-schema-processors-C6KO_BFy.mjs";
import { Fn as object, Jn as string, Nt as array, Pn as number, qn as strictObject, sr as unknown } from "./schemas-BOYIvvln.mjs";
import { M as parseAgentSessionKey } from "./session-key-C09ow4h0.mjs";
import "./routing-CEr1aXk1.mjs";
import { Q as getBrowserStateRuntime } from "./session-tab-store-D3MRWtH0.mjs";
//#region extensions/browser/src/browser-dashboard-definition.ts
const BROWSER_DASHBOARD_WIDGET_KIND = "browser:dashboard";
const dashboardUrl = string().min(1).max(4096).transform((value, ctx) => {
	const url = URL.parse(value);
	if (!url || !["http:", "https:"].includes(url.protocol) || url.username || url.password || url.href.length > 4096) {
		ctx.addIssue({
			code: "custom",
			message: "Browser dashboard URL must be HTTP(S), without embedded credentials, and at most 4096 characters"
		});
		return NEVER;
	}
	return url.href;
});
const browserDashboardPropsSchema = strictObject({
	url: dashboardUrl,
	profile: string().trim().min(1).max(128).optional()
});
const boardSnapshotSchema = object({
	sessionKey: string().min(1),
	widgets: array(object({
		name: string(),
		instanceId: string().optional(),
		revision: number().int().positive(),
		contentKind: string(),
		pluginKind: string().optional(),
		props: unknown().optional(),
		title: string().optional()
	}))
});
/** Resolve the current board instance; a saved browser target is never authority. */
async function readBrowserDashboardDefinition(request, defaultProfile = "openclaw") {
	const runtime = getBrowserStateRuntime();
	if (!runtime.gateway) throw new Error("Browser dashboards require an active Gateway");
	const snapshot = boardSnapshotSchema.parse(await runtime.gateway.request("board.get", {
		sessionKey: request.sessionKey,
		...request.agentId ? { agentId: request.agentId } : {}
	}));
	if (getBrowserStateRuntime() !== runtime) throw new Error("Browser dashboard runtime changed");
	const agentId = parseAgentSessionKey(snapshot.sessionKey)?.agentId;
	if (!agentId) throw new Error("Board did not return a canonical agent-scoped session identity");
	const widget = snapshot.widgets.find((entry) => entry.name === request.name);
	if (!widget || widget.contentKind !== "plugin" || widget.pluginKind !== BROWSER_DASHBOARD_WIDGET_KIND || !widget.instanceId || request.instanceId && request.instanceId !== widget.instanceId) return;
	const parsedProps = browserDashboardPropsSchema.safeParse(widget.props);
	if (!parsedProps.success) return;
	const props = parsedProps.data;
	return {
		sessionKey: snapshot.sessionKey,
		agentId,
		name: widget.name,
		instanceId: widget.instanceId,
		revision: widget.revision,
		...widget.title ? { title: widget.title } : {},
		url: props.url,
		profile: props.profile ?? defaultProfile
	};
}
function sameBrowserDashboardDefinition(left, right) {
	return Boolean(right && left.sessionKey === right.sessionKey && left.agentId === right.agentId && left.instanceId === right.instanceId && left.name === right.name && left.url === right.url && left.profile === right.profile);
}
//#endregion
export { sameBrowserDashboardDefinition as n, readBrowserDashboardDefinition as t };
