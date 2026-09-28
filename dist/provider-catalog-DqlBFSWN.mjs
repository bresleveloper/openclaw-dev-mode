import { n as buildManifestModelProviderConfig } from "./provider-catalog-DaDnKUnq.mjs";
import "./provider-model-metadata-GUXZiNxy.mjs";
//#region extensions/google/openclaw.plugin.json
var modelCatalog = {
	"discovery": { "google": "runtime" },
	"providers": { "google": {
		"api": "google-generative-ai",
		"baseUrl": "https://generativelanguage.googleapis.com/v1beta",
		"models": [
			{
				"id": "gemini-2.5-pro",
				"name": "Gemini 2.5 Pro",
				"reasoning": true,
				"input": ["text", "image"],
				"cost": {
					"input": 0,
					"output": 0,
					"cacheRead": 0,
					"cacheWrite": 0
				},
				"contextWindow": 1048576,
				"maxTokens": 65536
			},
			{
				"id": "gemini-2.5-flash",
				"name": "Gemini 2.5 Flash",
				"reasoning": true,
				"input": ["text", "image"],
				"cost": {
					"input": 0,
					"output": 0,
					"cacheRead": 0,
					"cacheWrite": 0
				},
				"contextWindow": 1048576,
				"maxTokens": 65536
			},
			{
				"id": "gemini-2.5-flash-lite",
				"name": "Gemini 2.5 Flash-Lite",
				"reasoning": true,
				"input": ["text", "image"],
				"cost": {
					"input": 0,
					"output": 0,
					"cacheRead": 0,
					"cacheWrite": 0
				},
				"contextWindow": 1048576,
				"maxTokens": 65536
			},
			{
				"id": "gemini-3.5-flash",
				"name": "Gemini 3.5 Flash",
				"reasoning": true,
				"input": ["text", "image"],
				"cost": {
					"input": 0,
					"output": 0,
					"cacheRead": 0,
					"cacheWrite": 0
				},
				"contextWindow": 1048576,
				"maxTokens": 65536,
				"compat": { "codeMode": "preferred" }
			},
			{
				"id": "gemini-3.6-flash",
				"name": "Gemini 3.6 Flash",
				"reasoning": true,
				"input": ["text", "image"],
				"cost": {
					"input": 0,
					"output": 0,
					"cacheRead": 0,
					"cacheWrite": 0
				},
				"contextWindow": 1048576,
				"maxTokens": 65536,
				"compat": { "codeMode": "preferred" }
			},
			{
				"id": "gemini-3.7-flash",
				"name": "Gemini 3.7 Flash",
				"reasoning": true,
				"input": ["text", "image"],
				"cost": {
					"input": 0,
					"output": 0,
					"cacheRead": 0,
					"cacheWrite": 0
				},
				"contextWindow": 1048576,
				"maxTokens": 65536,
				"thinkingLevelMap": { "minimal": null },
				"compat": { "codeMode": "preferred" }
			},
			{
				"id": "gemini-3.5-flash-lite",
				"name": "Gemini 3.5 Flash-Lite",
				"reasoning": true,
				"input": ["text", "image"],
				"cost": {
					"input": 0,
					"output": 0,
					"cacheRead": 0,
					"cacheWrite": 0
				},
				"contextWindow": 1048576,
				"maxTokens": 65536,
				"compat": { "codeMode": "preferred" }
			},
			{
				"id": "gemini-3.1-pro-preview",
				"name": "Gemini 3.1 Pro Preview",
				"reasoning": true,
				"input": ["text", "image"],
				"cost": {
					"input": 0,
					"output": 0,
					"cacheRead": 0,
					"cacheWrite": 0
				},
				"contextWindow": 1048576,
				"maxTokens": 65536,
				"compat": { "codeMode": "preferred" }
			},
			{
				"id": "gemini-3.1-flash-lite",
				"name": "Gemini 3.1 Flash Lite",
				"reasoning": true,
				"input": ["text", "image"],
				"cost": {
					"input": 0,
					"output": 0,
					"cacheRead": 0,
					"cacheWrite": 0
				},
				"contextWindow": 1048576,
				"maxTokens": 65536,
				"compat": { "codeMode": "preferred" }
			},
			{
				"id": "gemini-3-flash-preview",
				"name": "Gemini 3 Flash Preview",
				"reasoning": true,
				"input": ["text", "image"],
				"cost": {
					"input": 0,
					"output": 0,
					"cacheRead": 0,
					"cacheWrite": 0
				},
				"contextWindow": 1048576,
				"maxTokens": 65536,
				"compat": { "codeMode": "preferred" }
			}
		]
	} },
	"suppressions": [
		{
			"provider": "google",
			"model": "gemini-1.5-flash",
			"reason": "Google shut down Gemini 1.5 Flash on 2025-09-29. Use google/gemini-2.5-flash."
		},
		{
			"provider": "google",
			"model": "gemini-1.5-flash-8b",
			"reason": "Google shut down Gemini 1.5 Flash-8B on 2025-09-29. Use google/gemini-2.5-flash-lite."
		},
		{
			"provider": "google",
			"model": "gemini-1.5-pro",
			"reason": "Google shut down Gemini 1.5 Pro on 2025-09-29. Use google/gemini-3.1-pro-preview."
		},
		{
			"provider": "google",
			"model": "gemini-2.0-flash",
			"reason": "Google shut down Gemini 2.0 Flash on 2026-06-01. Use google/gemini-2.5-flash."
		},
		{
			"provider": "google",
			"model": "gemini-2.0-flash-001",
			"reason": "Google shut down Gemini 2.0 Flash on 2026-06-01. Use google/gemini-2.5-flash."
		},
		{
			"provider": "google",
			"model": "gemini-2.0-flash-exp",
			"reason": "Google shut down this Gemini 2.0 experimental model. Use google/gemini-2.5-flash."
		},
		{
			"provider": "google",
			"model": "gemini-2.0-flash-exp-image-generation",
			"reason": "Google shut down this Gemini 2.0 image preview. Use google/gemini-2.5-flash-image."
		},
		{
			"provider": "google",
			"model": "gemini-2.0-flash-live-001",
			"reason": "Google shut down this Gemini Live model on 2025-12-09. Use google/gemini-3.1-flash-live-preview."
		},
		{
			"provider": "google",
			"model": "gemini-2.0-flash-lite",
			"reason": "Google shut down Gemini 2.0 Flash-Lite on 2026-06-01. Use google/gemini-2.5-flash-lite."
		},
		{
			"provider": "google",
			"model": "gemini-2.0-flash-lite-001",
			"reason": "Google shut down Gemini 2.0 Flash-Lite on 2026-06-01. Use google/gemini-2.5-flash-lite."
		},
		{
			"provider": "google",
			"model": "gemini-2.0-flash-lite-preview",
			"reason": "Google shut down this Gemini 2.0 Flash-Lite preview on 2025-12-09. Use google/gemini-2.5-flash-lite."
		},
		{
			"provider": "google",
			"model": "gemini-2.0-flash-lite-preview-02-05",
			"reason": "Google shut down this Gemini 2.0 Flash-Lite preview on 2025-12-09. Use google/gemini-2.5-flash-lite."
		},
		{
			"provider": "google",
			"model": "gemini-2.0-flash-preview-image-generation",
			"reason": "Google shut down this Gemini 2.0 image preview. Use google/gemini-2.5-flash-image."
		},
		{
			"provider": "google",
			"model": "gemini-2.0-flash-thinking-exp",
			"reason": "Google shut down this Gemini 2.0 thinking experiment. Use google/gemini-2.5-flash."
		},
		{
			"provider": "google",
			"model": "gemini-2.0-flash-thinking-exp-01-21",
			"reason": "Google shut down this Gemini 2.0 thinking experiment. Use google/gemini-2.5-flash."
		},
		{
			"provider": "google",
			"model": "gemini-2.0-flash-thinking-exp-1219",
			"reason": "Google shut down this Gemini 2.0 thinking experiment. Use google/gemini-2.5-flash."
		},
		{
			"provider": "google",
			"model": "gemini-2.0-pro-exp",
			"reason": "Google shut down this Gemini 2.0 Pro experiment. Use google/gemini-3.1-pro-preview."
		},
		{
			"provider": "google",
			"model": "gemini-2.0-pro-exp-02-05",
			"reason": "Google shut down this Gemini 2.0 Pro experiment. Use google/gemini-3.1-pro-preview."
		},
		{
			"provider": "google",
			"model": "gemini-2.5-flash-exp-native-audio-thinking-dialog",
			"reason": "Google shut down this Gemini native-audio preview. Use google/gemini-3.1-flash-live-preview."
		},
		{
			"provider": "google",
			"model": "gemini-2.5-flash-image-preview",
			"reason": "Google shut down this Gemini image preview on 2026-01-15. Use google/gemini-2.5-flash-image."
		},
		{
			"provider": "google",
			"model": "gemini-2.5-flash-lite-preview-06-17",
			"reason": "Google shut down this Gemini 2.5 Flash-Lite preview on 2025-11-18. Use google/gemini-2.5-flash-lite."
		},
		{
			"provider": "google",
			"model": "gemini-2.5-flash-lite-preview-09-25",
			"reason": "Google shut down this Gemini 2.5 Flash-Lite preview on 2026-03-31. Use google/gemini-3.1-flash-lite."
		},
		{
			"provider": "google",
			"model": "gemini-2.5-flash-lite-preview-09-2025",
			"reason": "Google shut down this Gemini 2.5 Flash-Lite preview on 2026-03-31. Use google/gemini-3.1-flash-lite."
		},
		{
			"provider": "google",
			"model": "gemini-2.5-flash-preview-04-17",
			"reason": "Google shut down this Gemini 2.5 Flash preview on 2025-07-15. Use google/gemini-2.5-flash."
		},
		{
			"provider": "google",
			"model": "gemini-2.5-flash-preview-05-20",
			"reason": "Google shut down this Gemini 2.5 Flash preview on 2025-11-18. Use google/gemini-2.5-flash."
		},
		{
			"provider": "google",
			"model": "gemini-2.5-flash-preview-09-25",
			"reason": "Google shut down this Gemini 2.5 Flash preview on 2026-02-17. Use google/gemini-3-flash-preview."
		},
		{
			"provider": "google",
			"model": "gemini-2.5-flash-preview-09-2025",
			"reason": "Google shut down this Gemini 2.5 Flash preview on 2026-02-17. Use google/gemini-3-flash-preview."
		},
		{
			"provider": "google",
			"model": "gemini-2.5-flash-preview-native-audio-dialog",
			"reason": "Google shut down this Gemini native-audio preview. Use google/gemini-3.1-flash-live-preview."
		},
		{
			"provider": "google",
			"model": "gemini-2.5-pro-exp-03-25",
			"reason": "Google shut down this Gemini 2.5 Pro experiment. Use google/gemini-3.1-pro-preview."
		},
		{
			"provider": "google",
			"model": "gemini-2.5-pro-preview-03-25",
			"reason": "Google shut down this Gemini 2.5 Pro preview on 2025-12-02. Use google/gemini-3.1-pro-preview."
		},
		{
			"provider": "google",
			"model": "gemini-2.5-pro-preview-05-06",
			"reason": "Google shut down this Gemini 2.5 Pro preview on 2025-12-02. Use google/gemini-3.1-pro-preview."
		},
		{
			"provider": "google",
			"model": "gemini-2.5-pro-preview-06-05",
			"reason": "Google shut down this Gemini 2.5 Pro preview on 2025-12-02. Use google/gemini-3.1-pro-preview."
		},
		{
			"provider": "google",
			"model": "gemini-3-pro-preview",
			"reason": "Google shut down Gemini 3 Pro Preview on 2026-03-09. Use google/gemini-3.1-pro-preview."
		},
		{
			"provider": "google",
			"model": "gemini-3.1-pro-preview-customtools",
			"reason": "This is not a public Google Gemini chat model ID. Use google/gemini-3.1-pro-preview."
		},
		{
			"provider": "google",
			"model": "gemini-live-2.5-flash",
			"reason": "This is not a current public Gemini chat model ID. Use google/gemini-3.1-flash-live-preview for Live API."
		},
		{
			"provider": "google",
			"model": "gemini-live-2.5-flash-preview",
			"reason": "Google shut down this Gemini Live model on 2025-12-09. Use google/gemini-3.1-flash-live-preview."
		},
		{
			"provider": "google",
			"model": "gemini-live-2.5-flash-preview-native-audio",
			"reason": "Google shut down this Gemini Live preview. Use google/gemini-3.1-flash-live-preview."
		},
		{
			"provider": "google-gemini-cli",
			"model": "gemini-1.5-flash",
			"reason": "Google shut down Gemini 1.5 Flash on 2025-09-29. Use google-gemini-cli/gemini-2.5-flash."
		},
		{
			"provider": "google-gemini-cli",
			"model": "gemini-1.5-flash-8b",
			"reason": "Google shut down Gemini 1.5 Flash-8B on 2025-09-29. Use google-gemini-cli/gemini-2.5-flash-lite."
		},
		{
			"provider": "google-gemini-cli",
			"model": "gemini-1.5-pro",
			"reason": "Google shut down Gemini 1.5 Pro on 2025-09-29. Use google-gemini-cli/gemini-3.1-pro-preview."
		},
		{
			"provider": "google-gemini-cli",
			"model": "gemini-2.0-flash",
			"reason": "Google shut down Gemini 2.0 Flash on 2026-06-01. Use google-gemini-cli/gemini-2.5-flash."
		},
		{
			"provider": "google-gemini-cli",
			"model": "gemini-2.0-flash-001",
			"reason": "Google shut down Gemini 2.0 Flash on 2026-06-01. Use google-gemini-cli/gemini-2.5-flash."
		},
		{
			"provider": "google-gemini-cli",
			"model": "gemini-2.0-flash-exp",
			"reason": "Google shut down this Gemini 2.0 experimental model. Use google-gemini-cli/gemini-2.5-flash."
		},
		{
			"provider": "google-gemini-cli",
			"model": "gemini-2.0-flash-exp-image-generation",
			"reason": "Google shut down this Gemini 2.0 image preview. Use google-gemini-cli/gemini-2.5-flash-image."
		},
		{
			"provider": "google-gemini-cli",
			"model": "gemini-2.0-flash-live-001",
			"reason": "Google shut down this Gemini Live model on 2025-12-09. Use google-gemini-cli/gemini-3.1-flash-live-preview."
		},
		{
			"provider": "google-gemini-cli",
			"model": "gemini-2.0-flash-lite",
			"reason": "Google shut down Gemini 2.0 Flash-Lite on 2026-06-01. Use google-gemini-cli/gemini-2.5-flash-lite."
		},
		{
			"provider": "google-gemini-cli",
			"model": "gemini-2.0-flash-lite-001",
			"reason": "Google shut down Gemini 2.0 Flash-Lite on 2026-06-01. Use google-gemini-cli/gemini-2.5-flash-lite."
		},
		{
			"provider": "google-gemini-cli",
			"model": "gemini-2.0-flash-lite-preview",
			"reason": "Google shut down this Gemini 2.0 Flash-Lite preview on 2025-12-09. Use google-gemini-cli/gemini-2.5-flash-lite."
		},
		{
			"provider": "google-gemini-cli",
			"model": "gemini-2.0-flash-lite-preview-02-05",
			"reason": "Google shut down this Gemini 2.0 Flash-Lite preview on 2025-12-09. Use google-gemini-cli/gemini-2.5-flash-lite."
		},
		{
			"provider": "google-gemini-cli",
			"model": "gemini-2.0-flash-preview-image-generation",
			"reason": "Google shut down this Gemini 2.0 image preview. Use google-gemini-cli/gemini-2.5-flash-image."
		},
		{
			"provider": "google-gemini-cli",
			"model": "gemini-2.0-flash-thinking-exp",
			"reason": "Google shut down this Gemini 2.0 thinking experiment. Use google-gemini-cli/gemini-2.5-flash."
		},
		{
			"provider": "google-gemini-cli",
			"model": "gemini-2.0-flash-thinking-exp-01-21",
			"reason": "Google shut down this Gemini 2.0 thinking experiment. Use google-gemini-cli/gemini-2.5-flash."
		},
		{
			"provider": "google-gemini-cli",
			"model": "gemini-2.0-flash-thinking-exp-1219",
			"reason": "Google shut down this Gemini 2.0 thinking experiment. Use google-gemini-cli/gemini-2.5-flash."
		},
		{
			"provider": "google-gemini-cli",
			"model": "gemini-2.0-pro-exp",
			"reason": "Google shut down this Gemini 2.0 Pro experiment. Use google-gemini-cli/gemini-3.1-pro-preview."
		},
		{
			"provider": "google-gemini-cli",
			"model": "gemini-2.0-pro-exp-02-05",
			"reason": "Google shut down this Gemini 2.0 Pro experiment. Use google-gemini-cli/gemini-3.1-pro-preview."
		},
		{
			"provider": "google-gemini-cli",
			"model": "gemini-2.5-flash-exp-native-audio-thinking-dialog",
			"reason": "Google shut down this Gemini native-audio preview. Use google-gemini-cli/gemini-3.1-flash-live-preview."
		},
		{
			"provider": "google-gemini-cli",
			"model": "gemini-2.5-flash-image-preview",
			"reason": "Google shut down this Gemini image preview on 2026-01-15. Use google-gemini-cli/gemini-2.5-flash-image."
		},
		{
			"provider": "google-gemini-cli",
			"model": "gemini-2.5-flash-lite-preview-06-17",
			"reason": "Google shut down this Gemini 2.5 Flash-Lite preview on 2025-11-18. Use google-gemini-cli/gemini-2.5-flash-lite."
		},
		{
			"provider": "google-gemini-cli",
			"model": "gemini-2.5-flash-lite-preview-09-25",
			"reason": "Google shut down this Gemini 2.5 Flash-Lite preview on 2026-03-31. Use google-gemini-cli/gemini-3.1-flash-lite."
		},
		{
			"provider": "google-gemini-cli",
			"model": "gemini-2.5-flash-lite-preview-09-2025",
			"reason": "Google shut down this Gemini 2.5 Flash-Lite preview on 2026-03-31. Use google-gemini-cli/gemini-3.1-flash-lite."
		},
		{
			"provider": "google-gemini-cli",
			"model": "gemini-2.5-flash-preview-04-17",
			"reason": "Google shut down this Gemini 2.5 Flash preview on 2025-07-15. Use google-gemini-cli/gemini-2.5-flash."
		},
		{
			"provider": "google-gemini-cli",
			"model": "gemini-2.5-flash-preview-05-20",
			"reason": "Google shut down this Gemini 2.5 Flash preview on 2025-11-18. Use google-gemini-cli/gemini-2.5-flash."
		},
		{
			"provider": "google-gemini-cli",
			"model": "gemini-2.5-flash-preview-09-25",
			"reason": "Google shut down this Gemini 2.5 Flash preview on 2026-02-17. Use google-gemini-cli/gemini-3-flash-preview."
		},
		{
			"provider": "google-gemini-cli",
			"model": "gemini-2.5-flash-preview-09-2025",
			"reason": "Google shut down this Gemini 2.5 Flash preview on 2026-02-17. Use google-gemini-cli/gemini-3-flash-preview."
		},
		{
			"provider": "google-gemini-cli",
			"model": "gemini-2.5-flash-preview-native-audio-dialog",
			"reason": "Google shut down this Gemini native-audio preview. Use google-gemini-cli/gemini-3.1-flash-live-preview."
		},
		{
			"provider": "google-gemini-cli",
			"model": "gemini-2.5-pro-exp-03-25",
			"reason": "Google shut down this Gemini 2.5 Pro experiment. Use google-gemini-cli/gemini-3.1-pro-preview."
		},
		{
			"provider": "google-gemini-cli",
			"model": "gemini-2.5-pro-preview-03-25",
			"reason": "Google shut down this Gemini 2.5 Pro preview on 2025-12-02. Use google-gemini-cli/gemini-3.1-pro-preview."
		},
		{
			"provider": "google-gemini-cli",
			"model": "gemini-2.5-pro-preview-05-06",
			"reason": "Google shut down this Gemini 2.5 Pro preview on 2025-12-02. Use google-gemini-cli/gemini-3.1-pro-preview."
		},
		{
			"provider": "google-gemini-cli",
			"model": "gemini-2.5-pro-preview-06-05",
			"reason": "Google shut down this Gemini 2.5 Pro preview on 2025-12-02. Use google-gemini-cli/gemini-3.1-pro-preview."
		},
		{
			"provider": "google-gemini-cli",
			"model": "gemini-3-pro-preview",
			"reason": "Google shut down Gemini 3 Pro Preview on 2026-03-09. Use google-gemini-cli/gemini-3.1-pro-preview."
		},
		{
			"provider": "google-gemini-cli",
			"model": "gemini-3.1-pro-preview-customtools",
			"reason": "This is not a public Google Gemini chat model ID. Use google-gemini-cli/gemini-3.1-pro-preview."
		},
		{
			"provider": "google-gemini-cli",
			"model": "gemini-live-2.5-flash",
			"reason": "This is not a current public Gemini chat model ID. Use google-gemini-cli/gemini-3.1-flash-live-preview for Live API."
		},
		{
			"provider": "google-gemini-cli",
			"model": "gemini-live-2.5-flash-preview",
			"reason": "Google shut down this Gemini Live model on 2025-12-09. Use google-gemini-cli/gemini-3.1-flash-live-preview."
		},
		{
			"provider": "google-gemini-cli",
			"model": "gemini-live-2.5-flash-preview-native-audio",
			"reason": "Google shut down this Gemini Live preview. Use google-gemini-cli/gemini-3.1-flash-live-preview."
		},
		{
			"provider": "google-vertex",
			"model": "gemini-1.5-flash",
			"reason": "Google retired Gemini 1.5 Flash. Use google-vertex/gemini-2.5-flash."
		},
		{
			"provider": "google-vertex",
			"model": "gemini-1.5-flash-8b",
			"reason": "Google retired Gemini 1.5 Flash-8B. Use google-vertex/gemini-2.5-flash-lite."
		},
		{
			"provider": "google-vertex",
			"model": "gemini-1.5-pro",
			"reason": "Google retired Gemini 1.5 Pro. Use google-vertex/gemini-3.1-pro-preview."
		},
		{
			"provider": "google-vertex",
			"model": "gemini-2.0-flash",
			"reason": "Google shut down Gemini 2.0 Flash on 2026-06-01. Use google-vertex/gemini-2.5-flash."
		},
		{
			"provider": "google-vertex",
			"model": "gemini-2.0-flash-001",
			"reason": "Google shut down Gemini 2.0 Flash on 2026-06-01. Use google-vertex/gemini-2.5-flash."
		},
		{
			"provider": "google-vertex",
			"model": "gemini-2.0-flash-exp",
			"reason": "Google shut down this Gemini 2.0 experimental model. Use google-vertex/gemini-2.5-flash."
		},
		{
			"provider": "google-vertex",
			"model": "gemini-2.0-flash-exp-image-generation",
			"reason": "Google shut down this Gemini 2.0 image preview. Use google-vertex/gemini-2.5-flash-image."
		},
		{
			"provider": "google-vertex",
			"model": "gemini-2.0-flash-live-001",
			"reason": "Google shut down this Gemini Live model on 2025-12-09. Use google-vertex/gemini-3.1-flash-live-preview."
		},
		{
			"provider": "google-vertex",
			"model": "gemini-2.0-flash-lite",
			"reason": "Google shut down Gemini 2.0 Flash-Lite on 2026-06-01. Use google-vertex/gemini-2.5-flash-lite."
		},
		{
			"provider": "google-vertex",
			"model": "gemini-2.0-flash-lite-001",
			"reason": "Google shut down Gemini 2.0 Flash-Lite on 2026-06-01. Use google-vertex/gemini-2.5-flash-lite."
		},
		{
			"provider": "google-vertex",
			"model": "gemini-2.0-flash-lite-preview",
			"reason": "Google shut down this Gemini 2.0 Flash-Lite preview on 2025-12-09. Use google-vertex/gemini-2.5-flash-lite."
		},
		{
			"provider": "google-vertex",
			"model": "gemini-2.0-flash-lite-preview-02-05",
			"reason": "Google shut down this Gemini 2.0 Flash-Lite preview on 2025-12-09. Use google-vertex/gemini-2.5-flash-lite."
		},
		{
			"provider": "google-vertex",
			"model": "gemini-2.0-flash-preview-image-generation",
			"reason": "Google shut down this Gemini 2.0 image preview. Use google-vertex/gemini-2.5-flash-image."
		},
		{
			"provider": "google-vertex",
			"model": "gemini-2.0-flash-thinking-exp",
			"reason": "Google shut down this Gemini 2.0 thinking experiment. Use google-vertex/gemini-2.5-flash."
		},
		{
			"provider": "google-vertex",
			"model": "gemini-2.0-flash-thinking-exp-01-21",
			"reason": "Google shut down this Gemini 2.0 thinking experiment. Use google-vertex/gemini-2.5-flash."
		},
		{
			"provider": "google-vertex",
			"model": "gemini-2.0-flash-thinking-exp-1219",
			"reason": "Google shut down this Gemini 2.0 thinking experiment. Use google-vertex/gemini-2.5-flash."
		},
		{
			"provider": "google-vertex",
			"model": "gemini-2.0-pro-exp",
			"reason": "Google shut down this Gemini 2.0 Pro experiment. Use google-vertex/gemini-3.1-pro-preview."
		},
		{
			"provider": "google-vertex",
			"model": "gemini-2.0-pro-exp-02-05",
			"reason": "Google shut down this Gemini 2.0 Pro experiment. Use google-vertex/gemini-3.1-pro-preview."
		},
		{
			"provider": "google-vertex",
			"model": "gemini-2.5-flash-exp-native-audio-thinking-dialog",
			"reason": "Google shut down this Gemini native-audio preview. Use google-vertex/gemini-3.1-flash-live-preview."
		},
		{
			"provider": "google-vertex",
			"model": "gemini-2.5-flash-image-preview",
			"reason": "Google shut down this Gemini image preview on 2026-01-15. Use google-vertex/gemini-2.5-flash-image."
		},
		{
			"provider": "google-vertex",
			"model": "gemini-2.5-flash-lite-preview-06-17",
			"reason": "Google shut down this Gemini 2.5 Flash-Lite preview on 2025-11-18. Use google-vertex/gemini-2.5-flash-lite."
		},
		{
			"provider": "google-vertex",
			"model": "gemini-2.5-flash-lite-preview-09-25",
			"reason": "Google shut down this Gemini 2.5 Flash-Lite preview on 2026-03-31. Use google-vertex/gemini-3.1-flash-lite."
		},
		{
			"provider": "google-vertex",
			"model": "gemini-2.5-flash-lite-preview-09-2025",
			"reason": "Google shut down this Gemini 2.5 Flash-Lite preview on 2026-03-31. Use google-vertex/gemini-3.1-flash-lite."
		},
		{
			"provider": "google-vertex",
			"model": "gemini-2.5-flash-preview-04-17",
			"reason": "Google shut down this Gemini 2.5 Flash preview on 2025-07-15. Use google-vertex/gemini-2.5-flash."
		},
		{
			"provider": "google-vertex",
			"model": "gemini-2.5-flash-preview-05-20",
			"reason": "Google shut down this Gemini 2.5 Flash preview on 2025-11-18. Use google-vertex/gemini-2.5-flash."
		},
		{
			"provider": "google-vertex",
			"model": "gemini-2.5-flash-preview-09-25",
			"reason": "Google shut down this Gemini 2.5 Flash preview on 2026-02-17. Use google-vertex/gemini-3-flash-preview."
		},
		{
			"provider": "google-vertex",
			"model": "gemini-2.5-flash-preview-09-2025",
			"reason": "Google shut down this Gemini 2.5 Flash preview on 2026-02-17. Use google-vertex/gemini-3-flash-preview."
		},
		{
			"provider": "google-vertex",
			"model": "gemini-2.5-flash-preview-native-audio-dialog",
			"reason": "Google shut down this Gemini native-audio preview. Use google-vertex/gemini-3.1-flash-live-preview."
		},
		{
			"provider": "google-vertex",
			"model": "gemini-2.5-pro-exp-03-25",
			"reason": "Google shut down this Gemini 2.5 Pro experiment. Use google-vertex/gemini-3.1-pro-preview."
		},
		{
			"provider": "google-vertex",
			"model": "gemini-2.5-pro-preview-03-25",
			"reason": "Google shut down this Gemini 2.5 Pro preview on 2025-12-02. Use google-vertex/gemini-3.1-pro-preview."
		},
		{
			"provider": "google-vertex",
			"model": "gemini-2.5-pro-preview-05-06",
			"reason": "Google shut down this Gemini 2.5 Pro preview on 2025-12-02. Use google-vertex/gemini-3.1-pro-preview."
		},
		{
			"provider": "google-vertex",
			"model": "gemini-2.5-pro-preview-06-05",
			"reason": "Google shut down this Gemini 2.5 Pro preview on 2025-12-02. Use google-vertex/gemini-3.1-pro-preview."
		},
		{
			"provider": "google-vertex",
			"model": "gemini-3-pro-preview",
			"reason": "Google shut down Gemini 3 Pro Preview on 2026-03-09. Use google-vertex/gemini-3.1-pro-preview."
		},
		{
			"provider": "google-vertex",
			"model": "gemini-3.1-pro-preview-customtools",
			"reason": "This is not a public Google Gemini chat model ID. Use google-vertex/gemini-3.1-pro-preview."
		},
		{
			"provider": "google-vertex",
			"model": "gemini-live-2.5-flash",
			"reason": "This is not a current public Gemini chat model ID. Use google-vertex/gemini-3.1-flash-live-preview for Live API."
		},
		{
			"provider": "google-vertex",
			"model": "gemini-live-2.5-flash-preview",
			"reason": "Google shut down this Gemini Live model on 2025-12-09. Use google-vertex/gemini-3.1-flash-live-preview."
		},
		{
			"provider": "google-vertex",
			"model": "gemini-live-2.5-flash-preview-native-audio",
			"reason": "Google shut down this Gemini Live preview. Use google-vertex/gemini-3.1-flash-live-preview."
		}
	]
};
//#endregion
//#region extensions/google/provider-catalog.ts
const GOOGLE_VERTEX_BASE_URL = "https://{location}-aiplatform.googleapis.com";
const GOOGLE_GEMINI_MANIFEST_PROVIDER = buildManifestModelProviderConfig({
	providerId: "google",
	catalog: modelCatalog.providers.google
});
const GOOGLE_GEMINI_TEXT_MODELS = GOOGLE_GEMINI_MANIFEST_PROVIDER.models;
const GOOGLE_GEMINI_TEXT_MODEL_BY_ID = new Map(GOOGLE_GEMINI_TEXT_MODELS.map((model) => [model.id, model]));
const GOOGLE_GEMINI_TEXT_MODEL_IDS = new Set(GOOGLE_GEMINI_TEXT_MODEL_BY_ID.keys());
function requireGoogleManifestCost() {
	const cost = GOOGLE_GEMINI_TEXT_MODELS[0]?.cost;
	if (!cost) throw new Error("Google manifest model catalog must declare a cost for its first model");
	return cost;
}
const GOOGLE_GEMINI_COST = requireGoogleManifestCost();
function buildGoogleStaticCatalogProvider() {
	return {
		...GOOGLE_GEMINI_MANIFEST_PROVIDER,
		models: GOOGLE_GEMINI_TEXT_MODELS.map((model) => ({
			...model,
			input: [...model.input, "video"]
		}))
	};
}
function buildGoogleVertexStaticCatalogProvider() {
	return {
		baseUrl: GOOGLE_VERTEX_BASE_URL,
		api: "google-vertex",
		models: GOOGLE_GEMINI_TEXT_MODELS
	};
}
//#endregion
export { buildGoogleStaticCatalogProvider as a, GOOGLE_GEMINI_TEXT_MODEL_IDS as i, GOOGLE_GEMINI_MANIFEST_PROVIDER as n, buildGoogleVertexStaticCatalogProvider as o, GOOGLE_GEMINI_TEXT_MODEL_BY_ID as r, GOOGLE_GEMINI_COST as t };
