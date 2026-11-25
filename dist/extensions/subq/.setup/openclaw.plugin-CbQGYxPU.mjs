// extensions/subq/openclaw.plugin.json
var description = "SubQ Snap typed decisions (not a conversational model).";
var configSchema = {
	"type": "object",
	"properties": { "apiKey": {
		"type": "object",
		"required": [
			"source",
			"provider",
			"id"
		],
		"properties": {
			"source": {
				"type": "string",
				"enum": [
					"env",
					"store",
					"file",
					"exec"
				]
			},
			"provider": {
				"type": "string",
				"minLength": 1,
				"maxLength": 128
			},
			"id": {
				"type": "string",
				"minLength": 1,
				"maxLength": 1024
			}
		},
		"additionalProperties": false
	} },
	"additionalProperties": false
};
var modelCatalog = {
	"providers": { "subq": { "models": [] } },
	"suppressions": [{
		"provider": "subq",
		"model": "subq-snap-preview",
		"reason": "SubQ retired Snap preview on 2026-11-11.",
		"retirement": {}
	}]
};
export { description as n, modelCatalog as r, configSchema as t };
