Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const require_runtime = require("./.setup/runtime-gZTAuFux.cjs");
let openclaw_plugin_sdk_channel_outbound = require("openclaw/plugin-sdk/channel-outbound");
let openclaw_plugin_sdk_channel_pairing = require("openclaw/plugin-sdk/channel-pairing");
let openclaw_plugin_sdk_channel_policy = require("openclaw/plugin-sdk/channel-policy");
let openclaw_plugin_sdk_allow_from = require("openclaw/plugin-sdk/allow-from");
let openclaw_plugin_sdk_account_id = require("openclaw/plugin-sdk/account-id");
let openclaw_plugin_sdk_channel_status = require("openclaw/plugin-sdk/channel-status");
let openclaw_plugin_sdk_channel_targets = require("openclaw/plugin-sdk/channel-targets");
let openclaw_plugin_sdk_dangerous_name_runtime = require("openclaw/plugin-sdk/dangerous-name-runtime");
let openclaw_plugin_sdk_runtime_group_policy = require("openclaw/plugin-sdk/runtime-group-policy");
let openclaw_plugin_sdk_file_lock = require("openclaw/plugin-sdk/file-lock");
let openclaw_plugin_sdk_media_runtime = require("openclaw/plugin-sdk/media-runtime");
let openclaw_plugin_sdk_account_helpers = require("openclaw/plugin-sdk/account-helpers");
let openclaw_plugin_sdk_outbound_media = require("openclaw/plugin-sdk/outbound-media");
let openclaw_plugin_sdk_reply_payload = require("openclaw/plugin-sdk/reply-payload");
let openclaw_plugin_sdk_ssrf_runtime = require("openclaw/plugin-sdk/ssrf-runtime");
let openclaw_plugin_sdk_string_normalization_runtime = require("openclaw/plugin-sdk/string-normalization-runtime");
let openclaw_plugin_sdk_text_chunking = require("openclaw/plugin-sdk/text-chunking");
let openclaw_plugin_sdk_webhook_ingress = require("openclaw/plugin-sdk/webhook-ingress");
Object.defineProperty(exports, "DEFAULT_ACCOUNT_ID", {
	enumerable: true,
	get: function() {
		return openclaw_plugin_sdk_account_id.DEFAULT_ACCOUNT_ID;
	}
});
Object.defineProperty(exports, "DEFAULT_WEBHOOK_MAX_BODY_BYTES", {
	enumerable: true,
	get: function() {
		return openclaw_plugin_sdk_webhook_ingress.DEFAULT_WEBHOOK_MAX_BODY_BYTES;
	}
});
Object.defineProperty(exports, "PAIRING_APPROVED_MESSAGE", {
	enumerable: true,
	get: function() {
		return openclaw_plugin_sdk_channel_status.PAIRING_APPROVED_MESSAGE;
	}
});
Object.defineProperty(exports, "buildChannelKeyCandidates", {
	enumerable: true,
	get: function() {
		return openclaw_plugin_sdk_channel_targets.buildChannelKeyCandidates;
	}
});
Object.defineProperty(exports, "buildMediaPayload", {
	enumerable: true,
	get: function() {
		return openclaw_plugin_sdk_reply_payload.buildMediaPayload;
	}
});
Object.defineProperty(exports, "buildProbeChannelStatusSummary", {
	enumerable: true,
	get: function() {
		return openclaw_plugin_sdk_channel_status.buildProbeChannelStatusSummary;
	}
});
Object.defineProperty(exports, "chunkTextForOutbound", {
	enumerable: true,
	get: function() {
		return openclaw_plugin_sdk_text_chunking.chunkTextForOutbound;
	}
});
Object.defineProperty(exports, "createChannelMessageReplyPipeline", {
	enumerable: true,
	get: function() {
		return openclaw_plugin_sdk_channel_outbound.createChannelMessageReplyPipeline;
	}
});
Object.defineProperty(exports, "createChannelPairingController", {
	enumerable: true,
	get: function() {
		return openclaw_plugin_sdk_channel_pairing.createChannelPairingController;
	}
});
Object.defineProperty(exports, "createDefaultChannelRuntimeState", {
	enumerable: true,
	get: function() {
		return openclaw_plugin_sdk_channel_status.createDefaultChannelRuntimeState;
	}
});
Object.defineProperty(exports, "detectMime", {
	enumerable: true,
	get: function() {
		return openclaw_plugin_sdk_media_runtime.detectMime;
	}
});
Object.defineProperty(exports, "extensionForMime", {
	enumerable: true,
	get: function() {
		return openclaw_plugin_sdk_media_runtime.extensionForMime;
	}
});
Object.defineProperty(exports, "extractOriginalFilename", {
	enumerable: true,
	get: function() {
		return openclaw_plugin_sdk_media_runtime.extractOriginalFilename;
	}
});
Object.defineProperty(exports, "fetchWithSsrFGuard", {
	enumerable: true,
	get: function() {
		return openclaw_plugin_sdk_ssrf_runtime.fetchWithSsrFGuard;
	}
});
Object.defineProperty(exports, "getFileExtension", {
	enumerable: true,
	get: function() {
		return openclaw_plugin_sdk_media_runtime.getFileExtension;
	}
});
Object.defineProperty(exports, "isDangerousNameMatchingEnabled", {
	enumerable: true,
	get: function() {
		return openclaw_plugin_sdk_dangerous_name_runtime.isDangerousNameMatchingEnabled;
	}
});
Object.defineProperty(exports, "keepHttpServerTaskAlive", {
	enumerable: true,
	get: function() {
		return openclaw_plugin_sdk_channel_outbound.keepHttpServerTaskAlive;
	}
});
Object.defineProperty(exports, "loadOutboundMediaFromUrl", {
	enumerable: true,
	get: function() {
		return openclaw_plugin_sdk_outbound_media.loadOutboundMediaFromUrl;
	}
});
Object.defineProperty(exports, "logTypingFailure", {
	enumerable: true,
	get: function() {
		return openclaw_plugin_sdk_channel_outbound.logTypingFailure;
	}
});
Object.defineProperty(exports, "mergeAllowlist", {
	enumerable: true,
	get: function() {
		return openclaw_plugin_sdk_allow_from.mergeAllowlist;
	}
});
Object.defineProperty(exports, "normalizeChannelSlug", {
	enumerable: true,
	get: function() {
		return openclaw_plugin_sdk_channel_targets.normalizeChannelSlug;
	}
});
Object.defineProperty(exports, "normalizeStringEntries", {
	enumerable: true,
	get: function() {
		return openclaw_plugin_sdk_string_normalization_runtime.normalizeStringEntries;
	}
});
Object.defineProperty(exports, "resolveAllowlistMatchSimple", {
	enumerable: true,
	get: function() {
		return openclaw_plugin_sdk_allow_from.resolveAllowlistMatchSimple;
	}
});
Object.defineProperty(exports, "resolveChannelEntryMatchWithFallback", {
	enumerable: true,
	get: function() {
		return openclaw_plugin_sdk_channel_targets.resolveChannelEntryMatchWithFallback;
	}
});
Object.defineProperty(exports, "resolveChannelMediaMaxBytes", {
	enumerable: true,
	get: function() {
		return openclaw_plugin_sdk_account_helpers.resolveChannelMediaMaxBytes;
	}
});
Object.defineProperty(exports, "resolveDefaultGroupPolicy", {
	enumerable: true,
	get: function() {
		return openclaw_plugin_sdk_runtime_group_policy.resolveDefaultGroupPolicy;
	}
});
Object.defineProperty(exports, "resolveNestedAllowlistDecision", {
	enumerable: true,
	get: function() {
		return openclaw_plugin_sdk_channel_targets.resolveNestedAllowlistDecision;
	}
});
Object.defineProperty(exports, "resolveToolsBySender", {
	enumerable: true,
	get: function() {
		return openclaw_plugin_sdk_channel_policy.resolveToolsBySender;
	}
});
exports.setMSTeamsRuntime = require_runtime.setMSTeamsRuntime;
Object.defineProperty(exports, "summarizeMapping", {
	enumerable: true,
	get: function() {
		return openclaw_plugin_sdk_allow_from.summarizeMapping;
	}
});
Object.defineProperty(exports, "withFileLock", {
	enumerable: true,
	get: function() {
		return openclaw_plugin_sdk_file_lock.withFileLock;
	}
});
