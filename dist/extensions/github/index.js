import { t as definePluginEntry } from "../../plugin-entry-BOulgRcx.mjs";
import { n as GITHUB_ITEM_PATH_PATTERN, t as GITHUB_COMMIT_PATH_PATTERN } from "../../targets-B79WC-j3.mjs";
//#region extensions/github/index.ts
var github_default = definePluginEntry({
	id: "github",
	name: "GitHub",
	description: "Public GitHub link previews and document reader",
	register(api) {
		for (const reader of [{
			id: "github",
			pathPattern: GITHUB_ITEM_PATH_PATTERN,
			previewMethod: "github.preview"
		}, {
			id: "github-commit",
			pathPattern: GITHUB_COMMIT_PATH_PATTERN
		}]) api.session.controls.registerControlUiDescriptor({
			surface: "link-reader",
			id: reader.id,
			label: "GitHub",
			icon: "github",
			linkReader: {
				hosts: ["github.com"],
				pathPattern: reader.pathPattern,
				detailMethod: "github.detail",
				imageMethod: "github.image",
				...reader.previewMethod ? { previewMethod: reader.previewMethod } : {}
			},
			requiredScopes: ["operator.read"]
		});
		for (const method of [
			"github.preview",
			"github.detail",
			"github.image"
		]) api.registerGatewayMethod(method, async (options) => {
			const { githubHandlers } = await import("../../handlers-DF-cgmIS.mjs");
			await githubHandlers[method](options);
		}, {
			scope: "operator.read",
			profileAccess: "independent"
		});
	}
});
//#endregion
export { github_default as default };
