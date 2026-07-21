import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import { _ as uniqueStrings } from "./string-normalization-CRyoFBPt.js";
import { c as isRecord } from "./utils-CRO4LGEB.js";
import { b as normalizeClawHubSha256Integrity } from "./clawhub-DxyvW6TD.js";
import { n as MANIFEST_KEY } from "./legacy-names-NIXaj2oi.js";
import { createHash } from "node:crypto";
//#region scripts/lib/official-external-channel-catalog.json
var official_external_channel_catalog_default = { entries: [
	{
		"name": "@wecom/wecom-openclaw-plugin",
		"description": "OpenClaw WeCom channel plugin by the Tencent WeCom team.",
		"source": "external",
		"kind": "channel",
		"openclaw": {
			"plugin": {
				"id": "wecom-openclaw-plugin",
				"label": "WeCom"
			},
			"contracts": { "tools": ["wecom_mcp"] },
			"channel": {
				"id": "wecom",
				"label": "WeCom",
				"selectionLabel": "WeCom（企业微信）",
				"detailLabel": "WeCom",
				"docsPath": "/plugins/community#wecom",
				"docsLabel": "wecom",
				"blurb": "Enterprise messaging and documents, scheduling, task tools.",
				"aliases": [
					"qywx",
					"wework",
					"enterprise-wechat"
				],
				"order": 45
			},
			"channelConfigs": { "wecom": {
				"label": "WeCom",
				"description": "Enterprise WeChat conversation channel.",
				"schema": {
					"type": "object",
					"additionalProperties": true
				}
			} },
			"install": {
				"npmSpec": "@wecom/wecom-openclaw-plugin@2026.5.7",
				"defaultChoice": "npm",
				"expectedIntegrity": "sha512-TCkP9as00WfEhgFWG8YL/rcmaWGIshAki2HQh83nTRccGfVBCoGjrEboTTqq3yDmK9koWTV11zi8u8A4dNtvug=="
			}
		}
	},
	{
		"name": "openclaw-plugin-yuanbao",
		"description": "OpenClaw Yuanbao channel plugin by the Tencent Yuanbao team.",
		"source": "external",
		"kind": "channel",
		"openclaw": {
			"plugin": {
				"id": "openclaw-plugin-yuanbao",
				"label": "Yuanbao"
			},
			"contracts": { "tools": [
				"query_group_info",
				"query_session_members",
				"yuanbao_remind"
			] },
			"channel": {
				"id": "yuanbao",
				"label": "Yuanbao",
				"selectionLabel": "Yuanbao (元宝)",
				"detailLabel": "Yuanbao",
				"docsPath": "/plugins/community#yuanbao",
				"docsLabel": "yuanbao",
				"blurb": "Tencent Yuanbao AI assistant conversation channel.",
				"aliases": [
					"yuanbao",
					"yb",
					"tencent-yuanbao",
					"元宝"
				],
				"order": 85
			},
			"channelConfigs": { "yuanbao": {
				"label": "Yuanbao",
				"description": "Tencent Yuanbao AI assistant channel.",
				"schema": {
					"type": "object",
					"additionalProperties": true
				}
			} },
			"install": {
				"npmSpec": "openclaw-plugin-yuanbao@2.15.0",
				"defaultChoice": "npm",
				"expectedIntegrity": "sha512-3GD+mf3EjTSUTOAREjTHAyp/deXdpgqB+q+xE0b19Qtat4ADhUV1mHDwFkVCRqTCBY5ATFKtKcipoDejqFj/+w=="
			}
		}
	},
	{
		"name": "@tencent-weixin/openclaw-weixin",
		"description": "OpenClaw Weixin channel plugin by the Tencent Weixin team.",
		"source": "external",
		"kind": "channel",
		"openclaw": {
			"plugin": {
				"id": "openclaw-weixin",
				"label": "Weixin"
			},
			"channel": {
				"id": "openclaw-weixin",
				"label": "Weixin",
				"selectionLabel": "Weixin（微信）",
				"detailLabel": "Weixin",
				"docsPath": "/channels/wechat",
				"docsLabel": "weixin",
				"blurb": "Personal WeChat messaging via QR-code login.",
				"aliases": [
					"weixin",
					"wechat",
					"微信"
				],
				"order": 75
			},
			"channelConfigs": { "openclaw-weixin": {
				"label": "Weixin",
				"description": "Personal WeChat conversation channel.",
				"schema": {
					"type": "object",
					"additionalProperties": true
				}
			} },
			"install": {
				"npmSpec": "@tencent-weixin/openclaw-weixin@2.4.6",
				"defaultChoice": "npm",
				"expectedIntegrity": "sha512-qw9k3PLTiMWGNjjsknHgcTManH1w4j+Ji1ArWIaYLKCq3aFRsVwcqnPi127bvOoVMJGW4dbyJ8NECEMgoO+iRw==",
				"minHostVersion": ">=2026.5.12"
			}
		}
	},
	{
		"name": "@zalo-platforms/openclaw-zaloclawbot",
		"description": "OpenClaw Zalo ClawBot channel plugin by the Zalo Platforms team.",
		"source": "external",
		"kind": "channel",
		"openclaw": {
			"plugin": {
				"id": "openclaw-zaloclawbot",
				"label": "Zalo ClawBot"
			},
			"channel": {
				"id": "openclaw-zaloclawbot",
				"label": "Zalo ClawBot",
				"selectionLabel": "Zalo ClawBot (QR)",
				"detailLabel": "Zalo ClawBot",
				"docsPath": "/channels/zaloclawbot",
				"docsLabel": "zaloclawbot",
				"blurb": "Personal Zalo assistant bot via QR-code login — owner-bound, no setup.",
				"aliases": ["zaloclawbot", "zalo-clawbot"],
				"order": 82
			},
			"channelConfigs": { "openclaw-zaloclawbot": {
				"label": "Zalo ClawBot",
				"description": "Personal Zalo assistant — QR-onboarded, owner-bound.",
				"schema": {
					"type": "object",
					"additionalProperties": true
				}
			} },
			"install": {
				"npmSpec": "@zalo-platforms/openclaw-zaloclawbot@0.1.4",
				"defaultChoice": "npm",
				"expectedIntegrity": "sha512-5IxZriHJYACLLGqkCPPsTP9tas62kXEOFqTFAFMdunAM3SPhIJwVFRp0WvoP/m7L2PX85weD0g8LOtxM93VDYg==",
				"minHostVersion": ">=2026.4.10"
			}
		}
	},
	{
		"name": "@openclaw/clickclack",
		"description": "OpenClaw ClickClack channel plugin",
		"source": "official",
		"kind": "channel",
		"openclaw": {
			"channel": {
				"id": "clickclack",
				"label": "ClickClack",
				"selectionLabel": "ClickClack",
				"detailLabel": "ClickClack Bot",
				"docsPath": "/channels/clickclack",
				"docsLabel": "clickclack",
				"blurb": "self-hosted chat via first-class ClickClack bot tokens.",
				"envVars": ["CLICKCLACK_BOT_TOKEN"],
				"systemImage": "bubble.left.and.bubble.right",
				"markdownCapable": true,
				"preferSessionLookupForAnnounceTarget": true,
				"order": 85,
				"commands": {
					"nativeCommandsAutoEnabled": false,
					"nativeSkillsAutoEnabled": false
				}
			},
			"install": {
				"clawhubSpec": "clawhub:@openclaw/clickclack",
				"npmSpec": "@openclaw/clickclack",
				"defaultChoice": "npm",
				"minHostVersion": ">=2026.6.9",
				"allowInvalidConfigRecovery": true
			}
		}
	},
	{
		"name": "@openclaw/discord",
		"description": "OpenClaw Discord channel plugin",
		"source": "official",
		"kind": "channel",
		"openclaw": {
			"channel": {
				"id": "discord",
				"label": "Discord",
				"selectionLabel": "Discord (Bot API)",
				"detailLabel": "Discord Bot",
				"docsPath": "/channels/discord",
				"docsLabel": "discord",
				"blurb": "very well supported right now.",
				"systemImage": "bubble.left.and.bubble.right",
				"markdownCapable": true,
				"preferSessionLookupForAnnounceTarget": true
			},
			"install": {
				"npmSpec": "@openclaw/discord",
				"defaultChoice": "npm",
				"minHostVersion": ">=2026.4.10",
				"allowInvalidConfigRecovery": true
			}
		}
	},
	{
		"name": "@openclaw/feishu",
		"description": "OpenClaw Feishu/Lark channel plugin",
		"source": "official",
		"kind": "channel",
		"openclaw": {
			"channel": {
				"id": "feishu",
				"label": "Feishu",
				"selectionLabel": "Feishu/Lark (飞书)",
				"docsPath": "/channels/feishu",
				"docsLabel": "feishu",
				"blurb": "飞书/Lark enterprise messaging with doc/wiki/drive tools.",
				"aliases": ["lark"],
				"order": 35,
				"quickstartAllowFrom": true
			},
			"install": {
				"npmSpec": "@openclaw/feishu",
				"defaultChoice": "npm",
				"minHostVersion": ">=2026.5.29"
			}
		}
	},
	{
		"name": "@openclaw/googlechat",
		"description": "OpenClaw Google Chat channel plugin",
		"source": "official",
		"kind": "channel",
		"openclaw": {
			"channel": {
				"id": "googlechat",
				"label": "Google Chat",
				"selectionLabel": "Google Chat (Chat API)",
				"detailLabel": "Google Chat",
				"docsPath": "/channels/googlechat",
				"docsLabel": "googlechat",
				"blurb": "Google Workspace Chat app with HTTP webhook.",
				"aliases": ["gchat", "google-chat"],
				"order": 55,
				"systemImage": "message.badge",
				"markdownCapable": true,
				"doctorCapabilities": {
					"dmAllowFromMode": "nestedOnly",
					"groupModel": "route",
					"groupAllowFromFallbackToAllowFrom": false,
					"warnOnEmptyGroupSenderAllowlist": false
				},
				"cliAddOptions": [
					{
						"flags": "--webhook-path <path>",
						"description": "Google Chat webhook path"
					},
					{
						"flags": "--webhook-url <url>",
						"description": "Google Chat webhook URL"
					},
					{
						"flags": "--audience-type <type>",
						"description": "Google Chat audience type (app-url|project-number)"
					},
					{
						"flags": "--audience <value>",
						"description": "Google Chat audience value (app URL or project number)"
					}
				]
			},
			"install": {
				"npmSpec": "@openclaw/googlechat",
				"defaultChoice": "npm",
				"minHostVersion": ">=2026.4.10"
			}
		}
	},
	{
		"name": "@openclaw/irc",
		"description": "OpenClaw IRC channel plugin",
		"source": "official",
		"kind": "channel",
		"openclaw": {
			"channel": {
				"id": "irc",
				"label": "IRC",
				"selectionLabel": "IRC (Server + Nick)",
				"detailLabel": "IRC",
				"docsPath": "/channels/irc",
				"docsLabel": "irc",
				"blurb": "classic IRC networks with DM/channel routing and pairing controls.",
				"aliases": ["internet-relay-chat"],
				"envVars": [
					"IRC_HOST",
					"IRC_PORT",
					"IRC_TLS",
					"IRC_NICK",
					"IRC_USERNAME",
					"IRC_REALNAME",
					"IRC_PASSWORD",
					"IRC_CHANNELS",
					"IRC_NICKSERV_PASSWORD",
					"IRC_NICKSERV_REGISTER_EMAIL"
				],
				"systemImage": "network"
			},
			"install": {
				"clawhubSpec": "clawhub:@openclaw/irc",
				"npmSpec": "@openclaw/irc",
				"defaultChoice": "npm",
				"minHostVersion": ">=2026.6.9",
				"allowInvalidConfigRecovery": true
			}
		}
	},
	{
		"name": "@openclaw/line",
		"description": "OpenClaw LINE channel plugin",
		"source": "official",
		"kind": "channel",
		"openclaw": {
			"channel": {
				"id": "line",
				"label": "LINE",
				"selectionLabel": "LINE (Messaging API)",
				"detailLabel": "LINE Bot",
				"docsPath": "/channels/line",
				"docsLabel": "line",
				"blurb": "LINE Messaging API webhook bot.",
				"systemImage": "message",
				"order": 75,
				"quickstartAllowFrom": true
			},
			"install": {
				"npmSpec": "@openclaw/line",
				"defaultChoice": "npm",
				"minHostVersion": ">=2026.4.10"
			}
		}
	},
	{
		"name": "@openclaw/mattermost",
		"description": "OpenClaw Mattermost channel plugin",
		"source": "official",
		"kind": "channel",
		"openclaw": {
			"channel": {
				"id": "mattermost",
				"label": "Mattermost",
				"selectionLabel": "Mattermost (plugin)",
				"docsPath": "/channels/mattermost",
				"docsLabel": "mattermost",
				"blurb": "self-hosted Slack-style chat; install the plugin to enable.",
				"envVars": ["MATTERMOST_BOT_TOKEN", "MATTERMOST_URL"],
				"order": 65
			},
			"install": {
				"clawhubSpec": "clawhub:@openclaw/mattermost",
				"npmSpec": "@openclaw/mattermost",
				"defaultChoice": "npm",
				"minHostVersion": ">=2026.6.9",
				"allowInvalidConfigRecovery": true
			}
		}
	},
	{
		"name": "@openclaw/matrix",
		"description": "OpenClaw Matrix channel plugin",
		"source": "official",
		"kind": "channel",
		"openclaw": {
			"channel": {
				"id": "matrix",
				"label": "Matrix",
				"selectionLabel": "Matrix (plugin)",
				"docsPath": "/channels/matrix",
				"docsLabel": "matrix",
				"blurb": "open protocol; install the plugin to enable.",
				"order": 70,
				"markdownCapable": true,
				"quickstartAllowFrom": true,
				"doctorCapabilities": {
					"dmAllowFromMode": "nestedOnly",
					"groupModel": "sender",
					"groupAllowFromFallbackToAllowFrom": false,
					"warnOnEmptyGroupSenderAllowlist": true
				},
				"cliAddOptions": [
					{
						"flags": "--homeserver <url>",
						"description": "Matrix homeserver URL"
					},
					{
						"flags": "--user-id <id>",
						"description": "Matrix user ID"
					},
					{
						"flags": "--access-token <token>",
						"description": "Matrix access token"
					},
					{
						"flags": "--device-name <name>",
						"description": "Matrix device name"
					},
					{
						"flags": "--initial-sync-limit <n>",
						"description": "Matrix initial sync limit"
					}
				]
			},
			"install": {
				"clawhubSpec": "clawhub:@openclaw/matrix",
				"npmSpec": "@openclaw/matrix",
				"defaultChoice": "clawhub",
				"minHostVersion": ">=2026.4.10",
				"allowInvalidConfigRecovery": true
			}
		}
	},
	{
		"name": "@openclaw/msteams",
		"description": "OpenClaw Microsoft Teams channel plugin",
		"source": "official",
		"kind": "channel",
		"openclaw": {
			"channel": {
				"id": "msteams",
				"label": "Microsoft Teams",
				"selectionLabel": "Microsoft Teams (Teams SDK)",
				"docsPath": "/channels/msteams",
				"docsLabel": "msteams",
				"blurb": "Teams SDK; enterprise support.",
				"aliases": ["teams"],
				"order": 60
			},
			"install": {
				"npmSpec": "@openclaw/msteams",
				"defaultChoice": "npm",
				"minHostVersion": ">=2026.4.10"
			}
		}
	},
	{
		"name": "@openclaw/nextcloud-talk",
		"description": "OpenClaw Nextcloud Talk channel plugin",
		"source": "official",
		"kind": "channel",
		"openclaw": {
			"channel": {
				"id": "nextcloud-talk",
				"label": "Nextcloud Talk",
				"selectionLabel": "Nextcloud Talk (self-hosted)",
				"docsPath": "/channels/nextcloud-talk",
				"docsLabel": "nextcloud-talk",
				"blurb": "Self-hosted chat via Nextcloud Talk webhook bots.",
				"aliases": ["nc-talk", "nc"],
				"order": 65,
				"quickstartAllowFrom": true
			},
			"install": {
				"npmSpec": "@openclaw/nextcloud-talk",
				"defaultChoice": "npm",
				"minHostVersion": ">=2026.4.10"
			}
		}
	},
	{
		"name": "@openclaw/nostr",
		"description": "OpenClaw Nostr channel plugin for NIP-04 encrypted DMs",
		"source": "official",
		"kind": "channel",
		"openclaw": {
			"channel": {
				"id": "nostr",
				"label": "Nostr",
				"selectionLabel": "Nostr (NIP-04 DMs)",
				"docsPath": "/channels/nostr",
				"docsLabel": "nostr",
				"blurb": "Decentralized protocol; encrypted DMs via NIP-04.",
				"order": 55,
				"quickstartAllowFrom": true
			},
			"install": {
				"npmSpec": "@openclaw/nostr",
				"defaultChoice": "npm",
				"minHostVersion": ">=2026.4.10"
			}
		}
	},
	{
		"name": "@openclaw/qqbot",
		"description": "OpenClaw QQ Bot channel plugin",
		"source": "official",
		"kind": "channel",
		"openclaw": {
			"channel": {
				"id": "qqbot",
				"label": "QQ Bot",
				"selectionLabel": "QQ Bot (Official API)",
				"detailLabel": "QQ Bot",
				"docsPath": "/channels/qqbot",
				"docsLabel": "qqbot",
				"blurb": "connect to QQ via official QQ Bot API with group chat and direct message support.",
				"systemImage": "bubble.left.and.bubble.right"
			},
			"install": {
				"npmSpec": "@openclaw/qqbot",
				"defaultChoice": "npm",
				"minHostVersion": ">=2026.4.10"
			}
		}
	},
	{
		"name": "@openclaw/signal",
		"description": "OpenClaw Signal channel plugin",
		"source": "official",
		"kind": "channel",
		"openclaw": {
			"channel": {
				"id": "signal",
				"label": "Signal",
				"selectionLabel": "Signal (signal-cli)",
				"detailLabel": "Signal REST",
				"docsPath": "/channels/signal",
				"docsLabel": "signal",
				"blurb": "signal-cli linked device with extra setup for the local REST bridge.",
				"systemImage": "antenna.radiowaves.left.and.right",
				"markdownCapable": true,
				"cliAddOptions": [
					{
						"flags": "--signal-number <e164>",
						"description": "Signal account number (E.164)"
					},
					{
						"flags": "--http-host <host>",
						"description": "Signal HTTP daemon host"
					},
					{
						"flags": "--http-port <port>",
						"description": "Signal HTTP daemon port"
					}
				]
			},
			"install": {
				"clawhubSpec": "clawhub:@openclaw/signal",
				"npmSpec": "@openclaw/signal",
				"defaultChoice": "npm",
				"minHostVersion": ">=2026.6.9",
				"allowInvalidConfigRecovery": true
			}
		}
	},
	{
		"name": "@openclaw/slack",
		"description": "OpenClaw Slack channel plugin",
		"source": "official",
		"kind": "channel",
		"openclaw": {
			"channel": {
				"id": "slack",
				"label": "Slack",
				"selectionLabel": "Slack (Socket Mode)",
				"detailLabel": "Slack Bot",
				"docsPath": "/channels/slack",
				"docsLabel": "slack",
				"blurb": "supported (Socket Mode).",
				"systemImage": "number",
				"markdownCapable": true
			},
			"channelConfigs": { "slack": {
				"label": "Slack",
				"description": "Slack channel, DM, command, and app event integration.",
				"schema": {
					"type": "object",
					"additionalProperties": true
				}
			} },
			"install": {
				"npmSpec": "@openclaw/slack",
				"defaultChoice": "npm",
				"minHostVersion": ">=2026.5.12-beta.1",
				"allowInvalidConfigRecovery": true
			}
		}
	},
	{
		"name": "@openclaw/sms",
		"description": "OpenClaw SMS channel plugin for Twilio text messages.",
		"source": "official",
		"kind": "channel",
		"openclaw": {
			"channel": {
				"id": "sms",
				"label": "SMS",
				"selectionLabel": "SMS (Twilio)",
				"detailLabel": "Twilio SMS",
				"docsPath": "/channels/sms",
				"docsLabel": "sms",
				"blurb": "Twilio-backed SMS with inbound webhooks and outbound replies.",
				"envVars": [
					"TWILIO_ACCOUNT_SID",
					"TWILIO_AUTH_TOKEN",
					"TWILIO_PHONE_NUMBER",
					"TWILIO_SMS_FROM",
					"TWILIO_MESSAGING_SERVICE_SID",
					"SMS_PUBLIC_WEBHOOK_URL",
					"SMS_WEBHOOK_PATH",
					"SMS_ALLOWED_USERS"
				],
				"order": 88,
				"quickstartAllowFrom": true
			},
			"install": {
				"clawhubSpec": "clawhub:@openclaw/sms",
				"npmSpec": "@openclaw/sms",
				"defaultChoice": "npm",
				"minHostVersion": ">=2026.6.9",
				"allowInvalidConfigRecovery": true
			}
		}
	},
	{
		"name": "@openclaw/synology-chat",
		"description": "Synology Chat channel plugin for OpenClaw",
		"source": "official",
		"kind": "channel",
		"openclaw": {
			"channel": {
				"id": "synology-chat",
				"label": "Synology Chat",
				"selectionLabel": "Synology Chat (Webhook)",
				"docsPath": "/channels/synology-chat",
				"docsLabel": "synology-chat",
				"blurb": "Connect your Synology NAS Chat to OpenClaw with full agent capabilities.",
				"order": 90
			},
			"install": {
				"npmSpec": "@openclaw/synology-chat",
				"defaultChoice": "npm",
				"minHostVersion": ">=2026.4.10"
			}
		}
	},
	{
		"name": "@openclaw/raft",
		"description": "OpenClaw Raft channel plugin",
		"source": "official",
		"kind": "channel",
		"openclaw": {
			"channel": {
				"id": "raft",
				"label": "Raft",
				"selectionLabel": "Raft (CLI wake bridge)",
				"docsPath": "/channels/raft",
				"docsLabel": "raft",
				"blurb": "Raft CLI wake bridge for human and agent collaboration.",
				"order": 72
			},
			"channelConfigs": { "raft": {
				"label": "Raft",
				"description": "Raft External Agent CLI wake bridge.",
				"schema": {
					"type": "object",
					"additionalProperties": false,
					"properties": {
						"name": { "type": "string" },
						"enabled": { "type": "boolean" },
						"profile": {
							"type": "string",
							"minLength": 1
						},
						"defaultAccount": { "type": "string" },
						"accounts": {
							"type": "object",
							"additionalProperties": {
								"type": "object",
								"additionalProperties": false,
								"properties": {
									"name": { "type": "string" },
									"enabled": { "type": "boolean" },
									"profile": {
										"type": "string",
										"minLength": 1
									}
								}
							}
						}
					}
				}
			} },
			"install": {
				"npmSpec": "@openclaw/raft",
				"defaultChoice": "npm",
				"minHostVersion": ">=2026.6.8"
			}
		}
	},
	{
		"name": "@openclaw/tlon",
		"description": "OpenClaw Tlon/Urbit channel plugin",
		"source": "official",
		"kind": "channel",
		"openclaw": {
			"channel": {
				"id": "tlon",
				"label": "Tlon",
				"selectionLabel": "Tlon (Urbit)",
				"docsPath": "/channels/tlon",
				"docsLabel": "tlon",
				"blurb": "decentralized messaging on Urbit; install the plugin to enable.",
				"order": 90,
				"quickstartAllowFrom": true
			},
			"install": {
				"npmSpec": "@openclaw/tlon",
				"defaultChoice": "npm",
				"minHostVersion": ">=2026.4.10"
			}
		}
	},
	{
		"name": "@openclaw/twitch",
		"description": "OpenClaw Twitch channel plugin",
		"source": "official",
		"kind": "channel",
		"openclaw": {
			"channel": {
				"id": "twitch",
				"label": "Twitch",
				"selectionLabel": "Twitch (Chat)",
				"docsPath": "/channels/twitch",
				"blurb": "Twitch chat integration",
				"aliases": ["twitch-chat"]
			},
			"install": {
				"npmSpec": "@openclaw/twitch",
				"defaultChoice": "npm",
				"minHostVersion": ">=2026.4.10"
			}
		}
	},
	{
		"name": "@openclaw/whatsapp",
		"description": "OpenClaw WhatsApp channel plugin",
		"source": "official",
		"kind": "channel",
		"openclaw": {
			"channel": {
				"id": "whatsapp",
				"label": "WhatsApp",
				"selectionLabel": "WhatsApp (QR link)",
				"detailLabel": "WhatsApp Web",
				"docsPath": "/channels/whatsapp",
				"docsLabel": "whatsapp",
				"blurb": "works with your own number; recommend a separate phone + eSIM.",
				"systemImage": "message"
			},
			"install": {
				"clawhubSpec": "clawhub:@openclaw/whatsapp",
				"npmSpec": "@openclaw/whatsapp",
				"defaultChoice": "clawhub",
				"minHostVersion": ">=2026.4.25"
			}
		}
	},
	{
		"name": "@openclaw/zalo",
		"description": "OpenClaw Zalo channel plugin",
		"source": "official",
		"kind": "channel",
		"openclaw": {
			"channel": {
				"id": "zalo",
				"label": "Zalo",
				"selectionLabel": "Zalo (Bot API)",
				"docsPath": "/channels/zalo",
				"docsLabel": "zalo",
				"blurb": "Vietnam-focused messaging platform with Bot API.",
				"aliases": ["zl"],
				"order": 80,
				"quickstartAllowFrom": true
			},
			"install": {
				"npmSpec": "@openclaw/zalo",
				"defaultChoice": "npm",
				"minHostVersion": ">=2026.4.10"
			}
		}
	},
	{
		"name": "@openclaw/zalouser",
		"description": "OpenClaw Zalo Personal Account plugin via native zca-js integration",
		"source": "official",
		"kind": "channel",
		"openclaw": {
			"channel": {
				"id": "zalouser",
				"label": "Zalo Personal",
				"selectionLabel": "Zalo (Personal Account)",
				"docsPath": "/channels/zalouser",
				"docsLabel": "zalouser",
				"blurb": "Zalo personal account via QR code login.",
				"aliases": ["zlu"],
				"order": 85,
				"quickstartAllowFrom": false
			},
			"install": {
				"npmSpec": "@openclaw/zalouser",
				"defaultChoice": "npm",
				"minHostVersion": ">=2026.4.10"
			}
		}
	}
] };
//#endregion
//#region scripts/lib/official-external-plugin-catalog.json
var official_external_plugin_catalog_default = {
	schemaVersion: 1,
	id: "openclaw-official-external-plugins",
	generatedAt: "2026-06-22T00:00:00.000Z",
	sequence: 1,
	description: "Bundled fallback feed for official external OpenClaw plugins.",
	entries: [
		{
			"name": "@openclaw/acpx",
			"description": "OpenClaw ACP runtime backend",
			"source": "official",
			"kind": "plugin",
			"openclaw": {
				"plugin": {
					"id": "acpx",
					"label": "ACPX Runtime"
				},
				"install": {
					"npmSpec": "@openclaw/acpx",
					"defaultChoice": "npm",
					"minHostVersion": ">=2026.4.25"
				}
			}
		},
		{
			"name": "@openclaw/brave-plugin",
			"description": "OpenClaw Brave plugin",
			"source": "official",
			"kind": "plugin",
			"openclaw": {
				"plugin": {
					"id": "brave",
					"label": "Brave"
				},
				"webSearchProviders": [{
					"id": "brave",
					"label": "Brave Search",
					"hint": "Brave Search web results.",
					"onboardingScopes": ["text-inference"],
					"credentialLabel": "Brave Search API key",
					"envVars": ["BRAVE_API_KEY"],
					"placeholder": "BSA...",
					"signupUrl": "https://api-dashboard.search.brave.com/app/keys",
					"docsUrl": "https://docs.openclaw.ai/tools/brave-search",
					"credentialPath": "plugins.entries.brave.config.webSearch.apiKey",
					"autoDetectOrder": 10
				}],
				"install": {
					"npmSpec": "@openclaw/brave-plugin",
					"defaultChoice": "npm",
					"minHostVersion": ">=2026.4.10",
					"allowInvalidConfigRecovery": true
				}
			}
		},
		{
			"name": "@openclaw/copilot",
			"description": "OpenClaw GitHub Copilot agent runtime plugin",
			"source": "official",
			"kind": "plugin",
			"openclaw": {
				"plugin": {
					"id": "copilot",
					"label": "GitHub Copilot agent runtime"
				},
				"install": {
					"clawhubSpec": "clawhub:@openclaw/copilot",
					"npmSpec": "@openclaw/copilot",
					"defaultChoice": "npm",
					"minHostVersion": ">=2026.5.28"
				}
			}
		},
		{
			"name": "@openclaw/diagnostics-otel",
			"description": "OpenClaw diagnostics OpenTelemetry exporter",
			"source": "official",
			"kind": "plugin",
			"openclaw": {
				"plugin": {
					"id": "diagnostics-otel",
					"label": "Diagnostics OpenTelemetry"
				},
				"install": {
					"clawhubSpec": "clawhub:@openclaw/diagnostics-otel",
					"npmSpec": "@openclaw/diagnostics-otel",
					"defaultChoice": "npm",
					"minHostVersion": ">=2026.4.25"
				}
			}
		},
		{
			"name": "@openclaw/diagnostics-prometheus",
			"description": "OpenClaw diagnostics Prometheus exporter",
			"source": "official",
			"kind": "plugin",
			"openclaw": {
				"plugin": {
					"id": "diagnostics-prometheus",
					"label": "Diagnostics Prometheus"
				},
				"install": {
					"clawhubSpec": "clawhub:@openclaw/diagnostics-prometheus",
					"npmSpec": "@openclaw/diagnostics-prometheus",
					"defaultChoice": "npm",
					"minHostVersion": ">=2026.4.25"
				}
			}
		},
		{
			"name": "@openclaw/diffs",
			"description": "OpenClaw diff viewer plugin",
			"source": "official",
			"kind": "plugin",
			"openclaw": {
				"plugin": {
					"id": "diffs",
					"label": "Diffs"
				},
				"install": {
					"npmSpec": "@openclaw/diffs",
					"defaultChoice": "npm",
					"minHostVersion": ">=2026.4.30"
				}
			}
		},
		{
			"name": "@openclaw/diffs-language-pack",
			"description": "OpenClaw diffs viewer syntax highlighting language pack",
			"source": "official",
			"kind": "plugin",
			"openclaw": {
				"plugin": {
					"id": "diffs-language-pack",
					"label": "Diff Viewer Language Pack"
				},
				"install": {
					"npmSpec": "@openclaw/diffs-language-pack",
					"clawhubSpec": "clawhub:@openclaw/diffs-language-pack",
					"defaultChoice": "npm",
					"minHostVersion": ">=2026.5.27"
				}
			}
		},
		{
			"name": "@openclaw/exa-plugin",
			"description": "OpenClaw Exa plugin.",
			"source": "official",
			"kind": "plugin",
			"openclaw": {
				"plugin": {
					"id": "exa",
					"label": "Exa"
				},
				"contracts": { "webSearchProviders": ["exa"] },
				"webSearchProviders": [{
					"id": "exa",
					"label": "Exa Search",
					"hint": "Neural + keyword search with date filters and content extraction",
					"onboardingScopes": ["text-inference"],
					"credentialLabel": "Exa API key",
					"envVars": ["EXA_API_KEY"],
					"placeholder": "exa-...",
					"signupUrl": "https://exa.ai/",
					"docsUrl": "https://docs.openclaw.ai/tools/web",
					"credentialPath": "plugins.entries.exa.config.webSearch.apiKey",
					"autoDetectOrder": 65
				}],
				"install": {
					"clawhubSpec": "clawhub:@openclaw/exa-plugin",
					"npmSpec": "@openclaw/exa-plugin",
					"defaultChoice": "npm",
					"minHostVersion": ">=2026.6.8"
				}
			}
		},
		{
			"name": "@openclaw/firecrawl-plugin",
			"description": "OpenClaw Firecrawl plugin.",
			"source": "official",
			"kind": "plugin",
			"openclaw": {
				"plugin": {
					"id": "firecrawl",
					"label": "Firecrawl"
				},
				"contracts": {
					"webFetchProviders": ["firecrawl"],
					"webSearchProviders": ["firecrawl"],
					"tools": ["firecrawl_search", "firecrawl_scrape"]
				},
				"webSearchProviders": [{
					"id": "firecrawl",
					"label": "Firecrawl Search",
					"hint": "Structured results with optional result scraping",
					"onboardingScopes": ["text-inference"],
					"credentialLabel": "Firecrawl API key",
					"envVars": ["FIRECRAWL_API_KEY"],
					"placeholder": "fc-...",
					"signupUrl": "https://www.firecrawl.dev/",
					"docsUrl": "https://docs.openclaw.ai/tools/firecrawl",
					"credentialPath": "plugins.entries.firecrawl.config.webSearch.apiKey",
					"autoDetectOrder": 60
				}],
				"install": {
					"clawhubSpec": "clawhub:@openclaw/firecrawl-plugin",
					"npmSpec": "@openclaw/firecrawl-plugin",
					"defaultChoice": "npm",
					"minHostVersion": ">=2026.6.8"
				}
			}
		},
		{
			"name": "@openclaw/google-meet",
			"description": "OpenClaw Google Meet participant plugin",
			"source": "official",
			"kind": "plugin",
			"openclaw": {
				"plugin": {
					"id": "google-meet",
					"label": "Google Meet"
				},
				"install": {
					"npmSpec": "@openclaw/google-meet",
					"defaultChoice": "npm",
					"minHostVersion": ">=2026.4.20"
				}
			}
		},
		{
			"name": "@openclaw/gradium-speech",
			"description": "OpenClaw Gradium speech plugin.",
			"source": "official",
			"kind": "plugin",
			"openclaw": {
				"plugin": {
					"id": "gradium",
					"label": "Gradium"
				},
				"contracts": { "speechProviders": ["gradium"] },
				"install": {
					"clawhubSpec": "clawhub:@openclaw/gradium-speech",
					"npmSpec": "@openclaw/gradium-speech",
					"defaultChoice": "npm",
					"minHostVersion": ">=2026.6.8"
				}
			}
		},
		{
			"name": "@openclaw/inworld-speech",
			"description": "OpenClaw Inworld speech plugin.",
			"source": "official",
			"kind": "plugin",
			"openclaw": {
				"plugin": {
					"id": "inworld",
					"label": "Inworld"
				},
				"contracts": { "speechProviders": ["inworld"] },
				"install": {
					"clawhubSpec": "clawhub:@openclaw/inworld-speech",
					"npmSpec": "@openclaw/inworld-speech",
					"defaultChoice": "npm",
					"minHostVersion": ">=2026.6.8"
				}
			}
		},
		{
			"name": "@openclaw/lobster",
			"description": "Lobster workflow tool plugin (typed pipelines + resumable approvals)",
			"source": "official",
			"kind": "plugin",
			"openclaw": {
				"plugin": {
					"id": "lobster",
					"label": "Lobster"
				},
				"install": {
					"npmSpec": "@openclaw/lobster",
					"defaultChoice": "npm",
					"minHostVersion": ">=2026.4.25"
				}
			}
		},
		{
			"name": "@openclaw/memory-lancedb",
			"description": "OpenClaw LanceDB-backed long-term memory plugin with auto-recall/capture",
			"source": "official",
			"kind": "plugin",
			"openclaw": {
				"plugin": {
					"id": "memory-lancedb",
					"label": "Memory LanceDB"
				},
				"install": {
					"npmSpec": "@openclaw/memory-lancedb",
					"defaultChoice": "npm",
					"minHostVersion": ">=2026.5.31"
				}
			}
		},
		{
			"name": "@openclaw/llama-cpp-provider",
			"description": "OpenClaw llama.cpp embedding provider plugin",
			"source": "official",
			"kind": "plugin",
			"openclaw": {
				"plugin": {
					"id": "llama-cpp",
					"label": "llama.cpp Provider"
				},
				"contracts": { "embeddingProviders": ["local"] },
				"install": {
					"npmSpec": "@openclaw/llama-cpp-provider",
					"defaultChoice": "npm",
					"minHostVersion": ">=2026.6.2"
				}
			}
		},
		{
			"name": "@openclaw/openshell-sandbox",
			"description": "OpenClaw OpenShell sandbox backend",
			"source": "official",
			"kind": "plugin",
			"openclaw": {
				"plugin": {
					"id": "openshell",
					"label": "OpenShell Sandbox"
				},
				"install": {
					"npmSpec": "@openclaw/openshell-sandbox",
					"defaultChoice": "npm",
					"minHostVersion": ">=2026.5.12-beta.1"
				}
			}
		},
		{
			"name": "@openclaw/parallel-plugin",
			"description": "OpenClaw Parallel web search plugin.",
			"source": "official",
			"kind": "plugin",
			"openclaw": {
				"plugin": {
					"id": "parallel",
					"label": "Parallel"
				},
				"contracts": { "webSearchProviders": ["parallel", "parallel-free"] },
				"webSearchProviders": [{
					"id": "parallel",
					"label": "Parallel Search",
					"hint": "LLM-optimized dense excerpts from web sources",
					"onboardingScopes": ["text-inference"],
					"credentialLabel": "Parallel API key",
					"envVars": ["PARALLEL_API_KEY"],
					"placeholder": "par-...",
					"signupUrl": "https://platform.parallel.ai",
					"docsUrl": "https://docs.openclaw.ai/tools/parallel-search",
					"credentialPath": "plugins.entries.parallel.config.webSearch.apiKey",
					"autoDetectOrder": 75
				}, {
					"id": "parallel-free",
					"label": "Parallel Search (Free)",
					"hint": "Free web search via Parallel's hosted Search MCP — no API key required",
					"onboardingScopes": ["text-inference"],
					"requiresCredential": false,
					"envVars": [],
					"placeholder": "(no key needed)",
					"signupUrl": "https://parallel.ai",
					"docsUrl": "https://docs.openclaw.ai/tools/parallel-search",
					"credentialPath": ""
				}],
				"install": {
					"clawhubSpec": "clawhub:@openclaw/parallel-plugin",
					"npmSpec": "@openclaw/parallel-plugin",
					"defaultChoice": "npm",
					"minHostVersion": ">=2026.6.8"
				}
			}
		},
		{
			"name": "@openclaw/perplexity-plugin",
			"description": "OpenClaw Perplexity plugin.",
			"source": "official",
			"kind": "plugin",
			"openclaw": {
				"plugin": {
					"id": "perplexity",
					"label": "Perplexity"
				},
				"contracts": { "webSearchProviders": ["perplexity"] },
				"webSearchProviders": [{
					"id": "perplexity",
					"label": "Perplexity Search",
					"hint": "Requires Perplexity API key or OpenRouter API key · structured results",
					"onboardingScopes": ["text-inference"],
					"credentialLabel": "Perplexity API key",
					"envVars": ["PERPLEXITY_API_KEY", "OPENROUTER_API_KEY"],
					"placeholder": "pplx-...",
					"signupUrl": "https://www.perplexity.ai/settings/api",
					"docsUrl": "https://docs.openclaw.ai/perplexity",
					"credentialPath": "plugins.entries.perplexity.config.webSearch.apiKey",
					"autoDetectOrder": 50
				}],
				"install": {
					"clawhubSpec": "clawhub:@openclaw/perplexity-plugin",
					"npmSpec": "@openclaw/perplexity-plugin",
					"defaultChoice": "npm",
					"minHostVersion": ">=2026.6.8"
				}
			}
		},
		{
			"name": "@openclaw/pixverse-provider",
			"description": "OpenClaw PixVerse video generation provider plugin",
			"source": "official",
			"kind": "plugin",
			"openclaw": {
				"plugin": {
					"id": "pixverse",
					"label": "PixVerse"
				},
				"install": {
					"clawhubSpec": "clawhub:@openclaw/pixverse-provider",
					"npmSpec": "@openclaw/pixverse-provider",
					"defaultChoice": "npm",
					"minHostVersion": ">=2026.5.26"
				}
			}
		},
		{
			"name": "@openclaw/searxng-plugin",
			"description": "OpenClaw SearXNG plugin",
			"source": "official",
			"kind": "plugin",
			"openclaw": {
				"plugin": {
					"id": "searxng",
					"label": "SearXNG"
				},
				"contracts": { "webSearchProviders": ["searxng"] },
				"webSearchProviders": [{
					"id": "searxng",
					"label": "SearXNG Search",
					"hint": "Self-hosted meta-search with no API key required",
					"onboardingScopes": ["text-inference"],
					"requiresCredential": true,
					"credentialLabel": "SearXNG Base URL",
					"envVars": ["SEARXNG_BASE_URL"],
					"placeholder": "http://localhost:8080",
					"signupUrl": "https://docs.searxng.org/",
					"docsUrl": "https://docs.openclaw.ai/tools/searxng-search",
					"credentialPath": "plugins.entries.searxng.config.webSearch.baseUrl",
					"autoDetectOrder": 200
				}],
				"install": {
					"clawhubSpec": "clawhub:@openclaw/searxng-plugin",
					"npmSpec": "@openclaw/searxng-plugin",
					"defaultChoice": "npm",
					"minHostVersion": ">=2026.6.9",
					"allowInvalidConfigRecovery": true
				}
			}
		},
		{
			"name": "@openclaw/tavily-plugin",
			"description": "OpenClaw Tavily plugin",
			"source": "official",
			"kind": "plugin",
			"openclaw": {
				"plugin": {
					"id": "tavily",
					"label": "Tavily"
				},
				"contracts": {
					"webSearchProviders": ["tavily"],
					"tools": ["tavily_search", "tavily_extract"]
				},
				"webSearchProviders": [{
					"id": "tavily",
					"label": "Tavily Search",
					"hint": "Structured results with domain filters and AI answer summaries",
					"onboardingScopes": ["text-inference"],
					"credentialLabel": "Tavily API key",
					"envVars": ["TAVILY_API_KEY"],
					"placeholder": "tvly-...",
					"signupUrl": "https://tavily.com/",
					"docsUrl": "https://docs.openclaw.ai/tools/tavily",
					"credentialPath": "plugins.entries.tavily.config.webSearch.apiKey",
					"autoDetectOrder": 70
				}],
				"install": {
					"clawhubSpec": "clawhub:@openclaw/tavily-plugin",
					"npmSpec": "@openclaw/tavily-plugin",
					"defaultChoice": "npm",
					"minHostVersion": ">=2026.6.9",
					"allowInvalidConfigRecovery": true
				}
			}
		},
		{
			"name": "@openclaw/tokenjuice",
			"description": "OpenClaw tokenjuice exec output compaction plugin",
			"source": "official",
			"kind": "plugin",
			"openclaw": {
				"plugin": {
					"id": "tokenjuice",
					"label": "Tokenjuice"
				},
				"install": {
					"clawhubSpec": "clawhub:@openclaw/tokenjuice",
					"npmSpec": "@openclaw/tokenjuice",
					"defaultChoice": "npm",
					"minHostVersion": ">=2026.5.28"
				}
			}
		},
		{
			"name": "@openclaw/voice-call",
			"description": "OpenClaw voice-call plugin",
			"source": "official",
			"kind": "plugin",
			"openclaw": {
				"plugin": {
					"id": "voice-call",
					"label": "Voice Call"
				},
				"install": {
					"npmSpec": "@openclaw/voice-call",
					"defaultChoice": "npm",
					"minHostVersion": ">=2026.4.10"
				}
			}
		}
	]
};
//#endregion
//#region scripts/lib/official-external-provider-catalog.json
var official_external_provider_catalog_default = { entries: [
	{
		"name": "@openclaw/amazon-bedrock-provider",
		"description": "OpenClaw Amazon Bedrock provider plugin",
		"source": "official",
		"kind": "provider",
		"openclaw": {
			"plugin": {
				"id": "amazon-bedrock",
				"label": "Amazon Bedrock"
			},
			"providers": [{
				"id": "amazon-bedrock",
				"name": "Amazon Bedrock",
				"docs": "/providers/bedrock",
				"categories": ["cloud", "llm"]
			}],
			"install": {
				"npmSpec": "@openclaw/amazon-bedrock-provider",
				"defaultChoice": "npm",
				"minHostVersion": ">=2026.5.12-beta.1"
			}
		}
	},
	{
		"name": "@openclaw/amazon-bedrock-mantle-provider",
		"description": "OpenClaw Amazon Bedrock Mantle provider plugin",
		"source": "official",
		"kind": "provider",
		"openclaw": {
			"plugin": {
				"id": "amazon-bedrock-mantle",
				"label": "Amazon Bedrock Mantle"
			},
			"providers": [{
				"id": "amazon-bedrock-mantle",
				"name": "Amazon Bedrock Mantle",
				"docs": "/providers/bedrock-mantle",
				"categories": ["cloud", "llm"]
			}],
			"install": {
				"npmSpec": "@openclaw/amazon-bedrock-mantle-provider",
				"defaultChoice": "npm",
				"minHostVersion": ">=2026.5.12-beta.1"
			}
		}
	},
	{
		"name": "@openclaw/anthropic-vertex-provider",
		"description": "OpenClaw Anthropic Vertex provider plugin",
		"source": "official",
		"kind": "provider",
		"openclaw": {
			"plugin": {
				"id": "anthropic-vertex",
				"label": "Anthropic Vertex"
			},
			"providers": [{
				"id": "anthropic-vertex",
				"name": "Anthropic Vertex",
				"docs": "/providers/models",
				"categories": ["cloud", "llm"]
			}],
			"install": {
				"npmSpec": "@openclaw/anthropic-vertex-provider",
				"defaultChoice": "npm",
				"minHostVersion": ">=2026.5.12-beta.1"
			}
		}
	},
	{
		"name": "@openclaw/arcee-provider",
		"description": "OpenClaw Arcee provider plugin.",
		"source": "official",
		"kind": "provider",
		"openclaw": {
			"plugin": {
				"id": "arcee",
				"label": "Arcee AI"
			},
			"providers": [{
				"id": "arcee",
				"name": "Arcee AI",
				"docs": "/providers/arcee",
				"categories": ["cloud", "llm"],
				"envVars": ["ARCEEAI_API_KEY"],
				"authChoices": [{
					"method": "arcee-platform",
					"choiceId": "arceeai-api-key",
					"choiceLabel": "Arcee AI API key",
					"choiceHint": "Direct (chat.arcee.ai)",
					"groupId": "arcee",
					"groupLabel": "Arcee AI",
					"groupHint": "Direct API or OpenRouter",
					"optionKey": "arceeaiApiKey",
					"cliFlag": "--arceeai-api-key",
					"cliOption": "--arceeai-api-key <key>",
					"cliDescription": "Arcee AI API key",
					"onboardingScopes": ["text-inference"]
				}, {
					"method": "openrouter",
					"choiceId": "arceeai-openrouter",
					"choiceLabel": "OpenRouter API key",
					"choiceHint": "Via OpenRouter (openrouter.ai)",
					"groupId": "arcee",
					"groupLabel": "Arcee AI",
					"groupHint": "Direct API or OpenRouter",
					"optionKey": "openrouterApiKey",
					"cliFlag": "--openrouter-api-key",
					"cliOption": "--openrouter-api-key <key>",
					"cliDescription": "OpenRouter API key for Arcee AI models",
					"onboardingScopes": ["text-inference"]
				}]
			}],
			"install": {
				"clawhubSpec": "clawhub:@openclaw/arcee-provider",
				"npmSpec": "@openclaw/arcee-provider",
				"defaultChoice": "npm",
				"minHostVersion": ">=2026.6.8"
			}
		}
	},
	{
		"name": "@openclaw/cerebras-provider",
		"description": "OpenClaw Cerebras provider plugin.",
		"source": "official",
		"kind": "provider",
		"openclaw": {
			"plugin": {
				"id": "cerebras",
				"label": "Cerebras"
			},
			"providerEndpoints": [{
				"endpointClass": "cerebras-native",
				"hosts": ["api.cerebras.ai"]
			}],
			"providers": [{
				"id": "cerebras",
				"name": "Cerebras",
				"docs": "/providers/cerebras",
				"categories": ["cloud", "llm"],
				"envVars": ["CEREBRAS_API_KEY"],
				"authChoices": [{
					"method": "api-key",
					"choiceId": "cerebras-api-key",
					"choiceLabel": "Cerebras API key",
					"groupId": "cerebras",
					"groupLabel": "Cerebras",
					"groupHint": "Fast OpenAI-compatible inference",
					"optionKey": "cerebrasApiKey",
					"cliFlag": "--cerebras-api-key",
					"cliOption": "--cerebras-api-key <key>",
					"cliDescription": "Cerebras API key",
					"onboardingScopes": ["text-inference"]
				}]
			}],
			"install": {
				"clawhubSpec": "clawhub:@openclaw/cerebras-provider",
				"npmSpec": "@openclaw/cerebras-provider",
				"defaultChoice": "npm",
				"minHostVersion": ">=2026.6.8"
			}
		}
	},
	{
		"name": "@openclaw/chutes-provider",
		"description": "OpenClaw Chutes.ai provider plugin.",
		"source": "official",
		"kind": "provider",
		"openclaw": {
			"plugin": {
				"id": "chutes",
				"label": "Chutes"
			},
			"providerEndpoints": [{
				"endpointClass": "chutes-native",
				"hosts": ["llm.chutes.ai"]
			}],
			"providers": [{
				"id": "chutes",
				"name": "Chutes",
				"docs": "/providers/chutes",
				"categories": ["cloud", "llm"],
				"envVars": ["CHUTES_API_KEY", "CHUTES_OAUTH_TOKEN"],
				"authChoices": [{
					"method": "oauth",
					"choiceId": "chutes",
					"choiceLabel": "Chutes (OAuth)",
					"choiceHint": "Browser sign-in",
					"groupId": "chutes",
					"groupLabel": "Chutes",
					"groupHint": "OAuth + API key",
					"onboardingScopes": ["text-inference"]
				}, {
					"method": "api-key",
					"choiceId": "chutes-api-key",
					"choiceLabel": "Chutes API key",
					"choiceHint": "Open-source models including Llama, DeepSeek, and more",
					"groupId": "chutes",
					"groupLabel": "Chutes",
					"groupHint": "OAuth + API key",
					"optionKey": "chutesApiKey",
					"cliFlag": "--chutes-api-key",
					"cliOption": "--chutes-api-key <key>",
					"cliDescription": "Chutes API key",
					"onboardingScopes": ["text-inference"]
				}]
			}],
			"install": {
				"clawhubSpec": "clawhub:@openclaw/chutes-provider",
				"npmSpec": "@openclaw/chutes-provider",
				"defaultChoice": "npm",
				"minHostVersion": ">=2026.6.8"
			}
		}
	},
	{
		"name": "@openclaw/cohere-provider",
		"description": "OpenClaw Cohere provider plugin",
		"source": "official",
		"kind": "provider",
		"openclaw": {
			"plugin": {
				"id": "cohere",
				"label": "Cohere"
			},
			"providers": [{
				"id": "cohere",
				"name": "Cohere",
				"docs": "/providers/cohere",
				"categories": ["cloud", "llm"],
				"authChoices": [{
					"method": "api-key",
					"choiceId": "cohere-api-key",
					"choiceLabel": "Cohere API key",
					"groupId": "cohere",
					"groupLabel": "Cohere",
					"groupHint": "OpenAI-compatible inference",
					"optionKey": "cohereApiKey",
					"cliFlag": "--cohere-api-key",
					"cliOption": "--cohere-api-key <key>",
					"cliDescription": "Cohere API key",
					"onboardingScopes": ["text-inference"]
				}]
			}],
			"install": {
				"clawhubSpec": "clawhub:@openclaw/cohere-provider",
				"npmSpec": "@openclaw/cohere-provider",
				"defaultChoice": "npm",
				"minHostVersion": ">=2026.6.8"
			}
		}
	},
	{
		"name": "@openclaw/cloudflare-ai-gateway-provider",
		"description": "OpenClaw Cloudflare AI Gateway provider plugin.",
		"source": "official",
		"kind": "provider",
		"openclaw": {
			"plugin": {
				"id": "cloudflare-ai-gateway",
				"label": "Cloudflare AI Gateway"
			},
			"providers": [{
				"id": "cloudflare-ai-gateway",
				"name": "Cloudflare AI Gateway",
				"docs": "/providers/cloudflare-ai-gateway",
				"categories": ["cloud", "llm"],
				"envVars": ["CLOUDFLARE_AI_GATEWAY_API_KEY"],
				"authChoices": [{
					"method": "api-key",
					"choiceId": "cloudflare-ai-gateway-api-key",
					"choiceLabel": "Cloudflare AI Gateway",
					"choiceHint": "Account ID + Gateway ID + API key",
					"groupId": "cloudflare-ai-gateway",
					"groupLabel": "Cloudflare AI Gateway",
					"groupHint": "Account ID + Gateway ID + API key",
					"optionKey": "cloudflareAiGatewayApiKey",
					"cliFlag": "--cloudflare-ai-gateway-api-key",
					"cliOption": "--cloudflare-ai-gateway-api-key <key>",
					"cliDescription": "Cloudflare AI Gateway API key",
					"onboardingScopes": ["text-inference"]
				}]
			}],
			"install": {
				"clawhubSpec": "clawhub:@openclaw/cloudflare-ai-gateway-provider",
				"npmSpec": "@openclaw/cloudflare-ai-gateway-provider",
				"defaultChoice": "npm",
				"minHostVersion": ">=2026.6.8"
			}
		}
	},
	{
		"name": "@openclaw/codex",
		"description": "OpenClaw Codex harness and model provider plugin",
		"source": "official",
		"kind": "provider",
		"openclaw": {
			"plugin": {
				"id": "codex",
				"label": "Codex"
			},
			"contracts": { "migrationProviders": ["codex"] },
			"providers": [{
				"id": "codex",
				"name": "Codex",
				"docs": "/providers/models",
				"categories": ["cloud", "llm"],
				"authChoices": [{
					"method": "app-server",
					"choiceId": "codex",
					"choiceLabel": "Codex app-server",
					"choiceHint": "Use the Codex app-server runtime and managed model catalog.",
					"assistantPriority": -40,
					"groupId": "codex",
					"groupLabel": "Codex",
					"groupHint": "Codex app-server model provider",
					"onboardingScopes": ["text-inference"]
				}]
			}],
			"install": {
				"npmSpec": "@openclaw/codex",
				"defaultChoice": "npm",
				"minHostVersion": ">=2026.5.1-beta.1"
			}
		}
	},
	{
		"name": "@openclaw/deepinfra-provider",
		"description": "OpenClaw DeepInfra provider plugin.",
		"source": "official",
		"kind": "provider",
		"openclaw": {
			"plugin": {
				"id": "deepinfra",
				"label": "DeepInfra"
			},
			"providerEndpoints": [{
				"endpointClass": "deepinfra-native",
				"hosts": ["api.deepinfra.com"]
			}],
			"providers": [{
				"id": "deepinfra",
				"name": "DeepInfra",
				"docs": "/providers/deepinfra",
				"categories": ["cloud", "llm"],
				"envVars": ["DEEPINFRA_API_KEY"],
				"authChoices": [{
					"method": "api-key",
					"choiceId": "deepinfra-api-key",
					"choiceLabel": "DeepInfra API key",
					"choiceHint": "Unified API for open source models",
					"groupId": "deepinfra",
					"groupLabel": "DeepInfra",
					"groupHint": "Unified API for open source models",
					"optionKey": "deepinfraApiKey",
					"cliFlag": "--deepinfra-api-key",
					"cliOption": "--deepinfra-api-key <key>",
					"cliDescription": "DeepInfra API key",
					"onboardingScopes": ["text-inference"]
				}]
			}],
			"contracts": {
				"mediaUnderstandingProviders": ["deepinfra"],
				"memoryEmbeddingProviders": ["deepinfra"],
				"imageGenerationProviders": ["deepinfra"],
				"speechProviders": ["deepinfra"],
				"videoGenerationProviders": ["deepinfra"]
			},
			"install": {
				"clawhubSpec": "clawhub:@openclaw/deepinfra-provider",
				"npmSpec": "@openclaw/deepinfra-provider",
				"defaultChoice": "npm",
				"minHostVersion": ">=2026.6.8"
			}
		}
	},
	{
		"name": "@openclaw/deepseek-provider",
		"description": "OpenClaw DeepSeek provider plugin.",
		"source": "official",
		"kind": "provider",
		"openclaw": {
			"plugin": {
				"id": "deepseek",
				"label": "DeepSeek"
			},
			"providerEndpoints": [{
				"endpointClass": "deepseek-native",
				"hosts": ["api.deepseek.com"]
			}],
			"providers": [{
				"id": "deepseek",
				"name": "DeepSeek",
				"docs": "/providers/deepseek",
				"categories": ["cloud", "llm"],
				"envVars": ["DEEPSEEK_API_KEY"],
				"authChoices": [{
					"method": "api-key",
					"choiceId": "deepseek-api-key",
					"choiceLabel": "DeepSeek API key",
					"groupId": "deepseek",
					"groupLabel": "DeepSeek",
					"groupHint": "API key",
					"optionKey": "deepseekApiKey",
					"cliFlag": "--deepseek-api-key",
					"cliOption": "--deepseek-api-key <key>",
					"cliDescription": "DeepSeek API key",
					"onboardingScopes": ["text-inference"]
				}]
			}],
			"install": {
				"clawhubSpec": "clawhub:@openclaw/deepseek-provider",
				"npmSpec": "@openclaw/deepseek-provider",
				"defaultChoice": "npm",
				"minHostVersion": ">=2026.6.8"
			}
		}
	},
	{
		"name": "@openclaw/featherless-provider",
		"description": "OpenClaw Featherless AI provider plugin.",
		"source": "official",
		"kind": "provider",
		"openclaw": {
			"plugin": {
				"id": "featherless",
				"label": "Featherless AI"
			},
			"providers": [{
				"id": "featherless",
				"name": "Featherless AI",
				"docs": "/providers/featherless",
				"categories": ["cloud", "llm"],
				"envVars": ["FEATHERLESS_API_KEY"],
				"authChoices": [{
					"method": "api-key",
					"choiceId": "featherless-api-key",
					"choiceLabel": "Featherless AI API key",
					"choiceHint": "OpenAI-compatible access to open models",
					"groupId": "featherless",
					"groupLabel": "Featherless AI",
					"groupHint": "OpenAI-compatible access to open models",
					"optionKey": "featherlessApiKey",
					"cliFlag": "--featherless-api-key",
					"cliOption": "--featherless-api-key <key>",
					"cliDescription": "Featherless AI API key",
					"onboardingScopes": ["text-inference"]
				}]
			}],
			"install": {
				"clawhubSpec": "clawhub:@openclaw/featherless-provider",
				"npmSpec": "@openclaw/featherless-provider",
				"defaultChoice": "npm",
				"minHostVersion": ">=2026.6.11"
			}
		}
	},
	{
		"name": "@openclaw/gmi-provider",
		"description": "OpenClaw GMI Cloud provider plugin",
		"source": "official",
		"kind": "provider",
		"openclaw": {
			"plugin": {
				"id": "gmi",
				"label": "GMI Cloud"
			},
			"providerEndpoints": [{
				"endpointClass": "gmi-native",
				"hosts": ["api.gmi-serving.com"]
			}],
			"providers": [{
				"id": "gmi",
				"aliases": ["gmi-cloud", "gmicloud"],
				"name": "GMI Cloud",
				"docs": "/providers/gmi",
				"categories": ["cloud", "llm"],
				"authChoices": [{
					"method": "api-key",
					"choiceId": "gmi-api-key",
					"choiceLabel": "GMI Cloud API key",
					"choiceHint": "OpenAI-compatible GMI Cloud endpoint.",
					"groupId": "gmi",
					"groupLabel": "GMI Cloud",
					"groupHint": "OpenAI-compatible GMI Cloud endpoint",
					"optionKey": "gmiApiKey",
					"cliFlag": "--gmi-api-key",
					"cliOption": "--gmi-api-key <key>",
					"cliDescription": "GMI Cloud API key",
					"onboardingScopes": ["text-inference"]
				}]
			}],
			"install": {
				"clawhubSpec": "clawhub:@openclaw/gmi-provider",
				"npmSpec": "@openclaw/gmi-provider",
				"defaultChoice": "npm",
				"minHostVersion": ">=2026.6.8"
			}
		}
	},
	{
		"name": "@openclaw/longcat-provider",
		"description": "OpenClaw LongCat provider plugin",
		"source": "official",
		"kind": "provider",
		"openclaw": {
			"plugin": {
				"id": "longcat",
				"label": "LongCat"
			},
			"providers": [{
				"id": "longcat",
				"aliases": ["meituan-longcat"],
				"name": "LongCat",
				"docs": "/providers/longcat",
				"categories": ["cloud", "llm"],
				"envVars": ["LONGCAT_API_KEY"],
				"authChoices": [{
					"method": "api-key",
					"choiceId": "longcat-api-key",
					"choiceLabel": "LongCat API key",
					"groupId": "longcat",
					"groupLabel": "LongCat",
					"groupHint": "OpenAI-compatible LongCat API",
					"optionKey": "longcatApiKey",
					"cliFlag": "--longcat-api-key",
					"cliOption": "--longcat-api-key <key>",
					"cliDescription": "LongCat API key",
					"onboardingScopes": ["text-inference"]
				}]
			}],
			"install": {
				"clawhubSpec": "clawhub:@openclaw/longcat-provider",
				"npmSpec": "@openclaw/longcat-provider",
				"defaultChoice": "npm",
				"minHostVersion": ">=2026.6.8"
			}
		}
	},
	{
		"name": "@openclaw/meta-provider",
		"description": "OpenClaw Meta provider plugin.",
		"source": "official",
		"kind": "provider",
		"openclaw": {
			"plugin": {
				"id": "meta",
				"label": "Meta"
			},
			"providerEndpoints": [{
				"endpointClass": "meta-native",
				"hosts": ["api.meta.ai"]
			}],
			"providers": [{
				"id": "meta",
				"name": "Meta",
				"docs": "/providers/meta",
				"categories": ["cloud", "llm"],
				"envVars": ["MODEL_API_KEY"],
				"authChoices": [{
					"method": "api-key",
					"choiceId": "meta-api-key",
					"choiceLabel": "Meta API key",
					"choiceHint": "Meta (Responses API)",
					"groupId": "meta",
					"groupLabel": "Meta",
					"groupHint": "Meta (Responses API)",
					"optionKey": "metaApiKey",
					"cliFlag": "--meta-api-key",
					"cliOption": "--meta-api-key <key>",
					"cliDescription": "Meta API key",
					"onboardingScopes": ["text-inference"]
				}]
			}],
			"install": {
				"clawhubSpec": "clawhub:@openclaw/meta-provider",
				"npmSpec": "@openclaw/meta-provider",
				"defaultChoice": "npm",
				"minHostVersion": ">=2026.6.11"
			}
		}
	},
	{
		"name": "@openclaw/groq-provider",
		"description": "OpenClaw Groq media-understanding provider.",
		"source": "official",
		"kind": "provider",
		"openclaw": {
			"plugin": {
				"id": "groq",
				"label": "Groq"
			},
			"providerEndpoints": [{
				"endpointClass": "groq-native",
				"hosts": ["api.groq.com"]
			}],
			"providers": [{
				"id": "groq",
				"name": "Groq",
				"docs": "/providers/groq",
				"categories": ["cloud", "llm"],
				"envVars": ["GROQ_API_KEY"],
				"authChoices": [{
					"method": "api-key",
					"choiceId": "groq-api-key",
					"choiceLabel": "Groq API key",
					"groupId": "groq",
					"groupLabel": "Groq",
					"groupHint": "Fast OpenAI-compatible inference",
					"optionKey": "groqApiKey",
					"cliFlag": "--groq-api-key",
					"cliOption": "--groq-api-key <key>",
					"cliDescription": "Groq API key",
					"onboardingScopes": ["text-inference"]
				}]
			}],
			"contracts": { "mediaUnderstandingProviders": ["groq"] },
			"install": {
				"clawhubSpec": "clawhub:@openclaw/groq-provider",
				"npmSpec": "@openclaw/groq-provider",
				"defaultChoice": "npm",
				"minHostVersion": ">=2026.6.8"
			}
		}
	},
	{
		"name": "@openclaw/kilocode-provider",
		"description": "OpenClaw Kilo Gateway provider plugin.",
		"source": "official",
		"kind": "provider",
		"openclaw": {
			"plugin": {
				"id": "kilocode",
				"label": "Kilo Gateway"
			},
			"providers": [{
				"id": "kilocode",
				"name": "Kilo Gateway",
				"docs": "/providers/kilocode",
				"categories": ["cloud", "llm"],
				"envVars": ["KILOCODE_API_KEY"],
				"authChoices": [{
					"method": "api-key",
					"choiceId": "kilocode-api-key",
					"choiceLabel": "Kilo Gateway API key",
					"choiceHint": "API key (OpenRouter-compatible)",
					"groupId": "kilocode",
					"groupLabel": "Kilo Gateway",
					"groupHint": "API key (OpenRouter-compatible)",
					"optionKey": "kilocodeApiKey",
					"cliFlag": "--kilocode-api-key",
					"cliOption": "--kilocode-api-key <key>",
					"cliDescription": "Kilo Gateway API key",
					"onboardingScopes": ["text-inference"]
				}]
			}],
			"install": {
				"clawhubSpec": "clawhub:@openclaw/kilocode-provider",
				"npmSpec": "@openclaw/kilocode-provider",
				"defaultChoice": "npm",
				"minHostVersion": ">=2026.6.8"
			}
		}
	},
	{
		"name": "@openclaw/kimi-provider",
		"description": "OpenClaw Kimi provider plugin.",
		"source": "official",
		"kind": "provider",
		"openclaw": {
			"plugin": {
				"id": "kimi",
				"label": "Kimi Coding"
			},
			"providers": [{
				"id": "kimi",
				"aliases": ["kimi-coding"],
				"name": "Kimi Coding",
				"docs": "/providers/moonshot",
				"categories": ["cloud", "llm"],
				"envVars": ["KIMI_API_KEY", "KIMICODE_API_KEY"],
				"authChoices": [{
					"method": "api-key",
					"choiceId": "kimi-code-api-key",
					"choiceLabel": "Kimi Code API key (subscription)",
					"groupId": "moonshot",
					"groupLabel": "Moonshot AI (Kimi K2.6)",
					"groupHint": "Kimi K2.6",
					"optionKey": "kimiCodeApiKey",
					"cliFlag": "--kimi-code-api-key",
					"cliOption": "--kimi-code-api-key <key>",
					"cliDescription": "Kimi Code API key (subscription)",
					"onboardingScopes": ["text-inference"]
				}]
			}],
			"install": {
				"clawhubSpec": "clawhub:@openclaw/kimi-provider",
				"npmSpec": "@openclaw/kimi-provider",
				"defaultChoice": "npm",
				"minHostVersion": ">=2026.6.8"
			}
		}
	},
	{
		"name": "@openclaw/pixverse-provider",
		"description": "OpenClaw PixVerse video provider plugin",
		"source": "official",
		"kind": "provider",
		"openclaw": {
			"plugin": {
				"id": "pixverse",
				"label": "PixVerse"
			},
			"providers": [{
				"id": "pixverse",
				"name": "PixVerse",
				"docs": "/providers/pixverse",
				"categories": ["cloud", "video"],
				"authChoices": [{
					"method": "api-key",
					"choiceId": "pixverse-api-key",
					"choiceLabel": "PixVerse API key",
					"choiceHint": "Wizard prompts for International or CN endpoint.",
					"groupId": "pixverse",
					"groupLabel": "PixVerse",
					"groupHint": "Video generation",
					"optionKey": "pixverseApiKey",
					"cliFlag": "--pixverse-api-key",
					"cliOption": "--pixverse-api-key <key>",
					"cliDescription": "PixVerse API key",
					"onboardingScopes": ["image-generation"]
				}]
			}],
			"install": {
				"npmSpec": "@openclaw/pixverse-provider",
				"defaultChoice": "npm",
				"minHostVersion": ">=2026.5.26"
			}
		}
	},
	{
		"name": "@openclaw/qianfan-provider",
		"description": "OpenClaw Qianfan provider plugin.",
		"source": "official",
		"kind": "provider",
		"openclaw": {
			"plugin": {
				"id": "qianfan",
				"label": "Qianfan"
			},
			"providers": [{
				"id": "qianfan",
				"name": "Qianfan",
				"docs": "/providers/qianfan",
				"categories": ["cloud", "llm"],
				"envVars": ["QIANFAN_API_KEY"],
				"authChoices": [{
					"method": "api-key",
					"choiceId": "qianfan-api-key",
					"choiceLabel": "Qianfan API key",
					"groupId": "qianfan",
					"groupLabel": "Qianfan",
					"groupHint": "API key",
					"optionKey": "qianfanApiKey",
					"cliFlag": "--qianfan-api-key",
					"cliOption": "--qianfan-api-key <key>",
					"cliDescription": "QIANFAN API key",
					"onboardingScopes": ["text-inference"]
				}]
			}],
			"install": {
				"clawhubSpec": "clawhub:@openclaw/qianfan-provider",
				"npmSpec": "@openclaw/qianfan-provider",
				"defaultChoice": "npm",
				"minHostVersion": ">=2026.6.8"
			}
		}
	},
	{
		"name": "@openclaw/qwen-provider",
		"description": "OpenClaw Qwen Cloud provider plugin.",
		"source": "official",
		"kind": "provider",
		"openclaw": {
			"plugin": {
				"id": "qwen",
				"label": "Qwen Cloud"
			},
			"providerEndpoints": [{
				"endpointClass": "modelstudio-native",
				"baseUrls": [
					"https://coding-intl.dashscope.aliyuncs.com/v1",
					"https://coding.dashscope.aliyuncs.com/v1",
					"https://dashscope.aliyuncs.com/compatible-mode/v1",
					"https://dashscope-intl.aliyuncs.com/compatible-mode/v1"
				]
			}, {
				"endpointClass": "qwen-portal-native",
				"baseUrls": ["https://portal.qwen.ai/v1"]
			}],
			"providers": [{
				"id": "qwen",
				"aliases": [
					"qwencloud",
					"modelstudio",
					"dashscope"
				],
				"name": "Qwen Cloud",
				"docs": "/providers/qwen",
				"categories": ["cloud", "llm"],
				"envVars": [
					"QWEN_API_KEY",
					"MODELSTUDIO_API_KEY",
					"DASHSCOPE_API_KEY"
				],
				"authChoices": [
					{
						"method": "standard-api-key-cn",
						"choiceId": "qwen-standard-api-key-cn",
						"deprecatedChoiceIds": ["modelstudio-standard-api-key-cn"],
						"choiceLabel": "Standard API Key for China (pay-as-you-go)",
						"choiceHint": "Endpoint: dashscope.aliyuncs.com",
						"groupId": "qwen",
						"groupLabel": "Qwen Cloud",
						"groupHint": "Standard / Coding Plan (CN / Global) + multimodal roadmap",
						"optionKey": "modelstudioStandardApiKeyCn",
						"cliFlag": "--modelstudio-standard-api-key-cn",
						"cliOption": "--modelstudio-standard-api-key-cn <key>",
						"cliDescription": "Qwen Cloud standard API key (China)",
						"onboardingScopes": ["text-inference"]
					},
					{
						"method": "standard-api-key",
						"choiceId": "qwen-standard-api-key",
						"deprecatedChoiceIds": ["modelstudio-standard-api-key"],
						"choiceLabel": "Standard API Key for Global/Intl (pay-as-you-go)",
						"choiceHint": "Endpoint: dashscope-intl.aliyuncs.com",
						"groupId": "qwen",
						"groupLabel": "Qwen Cloud",
						"groupHint": "Standard / Coding Plan (CN / Global) + multimodal roadmap",
						"optionKey": "modelstudioStandardApiKey",
						"cliFlag": "--modelstudio-standard-api-key",
						"cliOption": "--modelstudio-standard-api-key <key>",
						"cliDescription": "Qwen Cloud standard API key (Global/Intl)",
						"onboardingScopes": ["text-inference"]
					},
					{
						"method": "api-key-cn",
						"choiceId": "qwen-api-key-cn",
						"deprecatedChoiceIds": ["modelstudio-api-key-cn"],
						"choiceLabel": "Coding Plan API Key for China (subscription)",
						"choiceHint": "Endpoint: coding.dashscope.aliyuncs.com",
						"groupId": "qwen",
						"groupLabel": "Qwen Cloud",
						"groupHint": "Standard / Coding Plan (CN / Global) + multimodal roadmap",
						"optionKey": "modelstudioApiKeyCn",
						"cliFlag": "--modelstudio-api-key-cn",
						"cliOption": "--modelstudio-api-key-cn <key>",
						"cliDescription": "Qwen Cloud Coding Plan API key (China)",
						"onboardingScopes": ["text-inference"]
					},
					{
						"method": "api-key",
						"choiceId": "qwen-api-key",
						"deprecatedChoiceIds": ["modelstudio-api-key"],
						"choiceLabel": "Coding Plan API Key for Global/Intl (subscription)",
						"choiceHint": "Endpoint: coding-intl.dashscope.aliyuncs.com",
						"groupId": "qwen",
						"groupLabel": "Qwen Cloud",
						"groupHint": "Standard / Coding Plan (CN / Global) + multimodal roadmap",
						"optionKey": "modelstudioApiKey",
						"cliFlag": "--modelstudio-api-key",
						"cliOption": "--modelstudio-api-key <key>",
						"cliDescription": "Qwen Cloud Coding Plan API key (Global/Intl)",
						"onboardingScopes": ["text-inference"]
					}
				]
			}, {
				"id": "qwen-oauth",
				"aliases": ["qwen-portal", "qwen-cli"],
				"name": "Qwen Cloud qwen oauth",
				"docs": "/providers/qwen",
				"categories": ["cloud", "llm"],
				"envVars": ["QWEN_API_KEY"],
				"authChoices": [{
					"method": "api-key",
					"choiceId": "qwen-oauth",
					"choiceLabel": "Qwen OAuth",
					"choiceHint": "Portal token for portal.qwen.ai",
					"groupId": "qwen",
					"groupLabel": "Qwen Cloud",
					"groupHint": "Standard / Coding Plan / OAuth",
					"optionKey": "qwenOauthToken",
					"cliFlag": "--qwen-oauth-token",
					"cliOption": "--qwen-oauth-token <token>",
					"cliDescription": "Qwen OAuth token",
					"onboardingScopes": ["text-inference"]
				}]
			}],
			"contracts": {
				"mediaUnderstandingProviders": ["qwen"],
				"videoGenerationProviders": ["qwen"]
			},
			"install": {
				"clawhubSpec": "clawhub:@openclaw/qwen-provider",
				"npmSpec": "@openclaw/qwen-provider",
				"defaultChoice": "npm",
				"minHostVersion": ">=2026.6.8"
			}
		}
	},
	{
		"name": "@openclaw/fireworks-provider",
		"description": "OpenClaw Fireworks provider plugin",
		"source": "official",
		"kind": "provider",
		"openclaw": {
			"plugin": {
				"id": "fireworks",
				"label": "Fireworks"
			},
			"providers": [{
				"id": "fireworks",
				"aliases": ["fireworks-ai"],
				"name": "Fireworks",
				"docs": "/providers/fireworks",
				"categories": ["cloud", "llm"],
				"envVars": ["FIREWORKS_API_KEY"],
				"authChoices": [{
					"method": "api-key",
					"choiceId": "fireworks-api-key",
					"choiceLabel": "Fireworks API key",
					"choiceHint": "API key",
					"groupId": "fireworks",
					"groupLabel": "Fireworks",
					"groupHint": "API key",
					"optionKey": "fireworksApiKey",
					"cliFlag": "--fireworks-api-key",
					"cliOption": "--fireworks-api-key <key>",
					"cliDescription": "Fireworks API key",
					"onboardingScopes": ["text-inference"]
				}]
			}],
			"install": {
				"clawhubSpec": "clawhub:@openclaw/fireworks-provider",
				"npmSpec": "@openclaw/fireworks-provider",
				"defaultChoice": "npm",
				"minHostVersion": ">=2026.6.9"
			}
		}
	},
	{
		"name": "@openclaw/moonshot-provider",
		"description": "OpenClaw Moonshot provider plugin",
		"source": "official",
		"kind": "provider",
		"openclaw": {
			"plugin": {
				"id": "moonshot",
				"label": "Moonshot"
			},
			"providerEndpoints": [{
				"endpointClass": "moonshot-native",
				"baseUrls": ["https://api.moonshot.ai/v1", "https://api.moonshot.cn/v1"]
			}],
			"providers": [{
				"id": "moonshot",
				"aliases": ["moonshotai", "moonshot-ai"],
				"name": "Moonshot",
				"docs": "/providers/moonshot",
				"categories": ["cloud", "llm"],
				"envVars": ["MOONSHOT_API_KEY", "KIMI_API_KEY"],
				"authChoices": [{
					"method": "api-key",
					"choiceId": "moonshot-api-key",
					"choiceLabel": "Moonshot API key (.ai)",
					"choiceHint": "Kimi K2.6 + Kimi",
					"groupId": "moonshot",
					"groupLabel": "Moonshot AI (Kimi K2.6)",
					"groupHint": "Kimi K2.6",
					"optionKey": "moonshotApiKey",
					"cliFlag": "--moonshot-api-key",
					"cliOption": "--moonshot-api-key <key>",
					"cliDescription": "Moonshot API key",
					"onboardingScopes": ["text-inference"]
				}, {
					"method": "api-key-cn",
					"choiceId": "moonshot-api-key-cn",
					"choiceLabel": "Moonshot API key (.cn)",
					"choiceHint": "Kimi K2.6 + Kimi",
					"groupId": "moonshot",
					"groupLabel": "Moonshot AI (Kimi K2.6)",
					"groupHint": "Kimi K2.6",
					"optionKey": "moonshotApiKey",
					"cliFlag": "--moonshot-api-key",
					"cliOption": "--moonshot-api-key <key>",
					"cliDescription": "Moonshot API key",
					"onboardingScopes": ["text-inference"]
				}]
			}],
			"contracts": {
				"mediaUnderstandingProviders": ["moonshot"],
				"webSearchProviders": ["kimi"]
			},
			"webSearchProviders": [{
				"id": "kimi",
				"label": "Kimi (Moonshot)",
				"hint": "Requires Moonshot / Kimi API key · Moonshot web search",
				"onboardingScopes": ["text-inference"],
				"credentialLabel": "Moonshot / Kimi API key",
				"envVars": ["KIMI_API_KEY", "MOONSHOT_API_KEY"],
				"placeholder": "sk-...",
				"signupUrl": "https://platform.moonshot.cn/",
				"docsUrl": "https://docs.openclaw.ai/tools/web",
				"credentialPath": "plugins.entries.moonshot.config.webSearch.apiKey",
				"autoDetectOrder": 40
			}],
			"install": {
				"clawhubSpec": "clawhub:@openclaw/moonshot-provider",
				"npmSpec": "@openclaw/moonshot-provider",
				"defaultChoice": "npm",
				"minHostVersion": ">=2026.6.9"
			}
		}
	},
	{
		"name": "@openclaw/tencent-provider",
		"description": "OpenClaw Tencent Cloud provider plugin (TokenHub + Token Plan)",
		"source": "official",
		"kind": "provider",
		"openclaw": {
			"plugin": {
				"id": "tencent",
				"label": "Tencent Cloud"
			},
			"providers": [{
				"id": "tencent-tokenhub",
				"name": "Tencent TokenHub",
				"docs": "/providers/tencent",
				"categories": ["cloud", "llm"],
				"envVars": ["TOKENHUB_API_KEY"],
				"authChoices": [{
					"method": "api-key",
					"choiceId": "tokenhub-api-key",
					"choiceLabel": "Tencent TokenHub",
					"choiceHint": "Hy via Tencent TokenHub Gateway",
					"groupId": "tencent",
					"groupLabel": "Tencent Cloud",
					"groupHint": "Tencent TokenHub",
					"optionKey": "tokenhubApiKey",
					"cliFlag": "--tokenhub-api-key",
					"cliOption": "--tokenhub-api-key <key>",
					"cliDescription": "Tencent TokenHub API key",
					"onboardingScopes": ["text-inference"]
				}]
			}, {
				"id": "tencent-tokenplan",
				"name": "Tencent TokenPlan",
				"docs": "/providers/tencent",
				"categories": ["cloud", "llm"],
				"envVars": ["TOKENPLAN_API_KEY"],
				"authChoices": [{
					"method": "api-key",
					"choiceId": "tokenplan-api-key",
					"choiceLabel": "Tencent TokenPlan",
					"choiceHint": "Hy via Tencent TokenPlan Gateway",
					"groupId": "tencent",
					"groupLabel": "Tencent Cloud",
					"groupHint": "Tencent TokenPlan",
					"optionKey": "tokenplanApiKey",
					"cliFlag": "--tokenplan-api-key",
					"cliOption": "--tokenplan-api-key <key>",
					"cliDescription": "Tencent TokenPlan API key",
					"onboardingScopes": ["text-inference"]
				}]
			}],
			"install": {
				"clawhubSpec": "clawhub:@openclaw/tencent-provider",
				"npmSpec": "@openclaw/tencent-provider",
				"defaultChoice": "npm",
				"minHostVersion": ">=2026.6.9"
			}
		}
	},
	{
		"name": "@openclaw/venice-provider",
		"description": "OpenClaw Venice provider plugin",
		"source": "official",
		"kind": "provider",
		"openclaw": {
			"plugin": {
				"id": "venice",
				"label": "Venice"
			},
			"providers": [{
				"id": "venice",
				"name": "Venice",
				"docs": "/providers/venice",
				"categories": ["cloud", "llm"],
				"envVars": ["VENICE_API_KEY"],
				"authChoices": [{
					"method": "api-key",
					"choiceId": "venice-api-key",
					"choiceLabel": "Venice AI API key",
					"choiceHint": "Privacy-focused (uncensored models)",
					"groupId": "venice",
					"groupLabel": "Venice AI",
					"groupHint": "Privacy-focused (uncensored models)",
					"optionKey": "veniceApiKey",
					"cliFlag": "--venice-api-key",
					"cliOption": "--venice-api-key <key>",
					"cliDescription": "Venice API key",
					"onboardingScopes": ["text-inference"]
				}]
			}],
			"install": {
				"clawhubSpec": "clawhub:@openclaw/venice-provider",
				"npmSpec": "@openclaw/venice-provider",
				"defaultChoice": "npm",
				"minHostVersion": ">=2026.6.9"
			}
		}
	},
	{
		"name": "@openclaw/vercel-ai-gateway-provider",
		"description": "OpenClaw Vercel AI Gateway provider plugin",
		"source": "official",
		"kind": "provider",
		"openclaw": {
			"plugin": {
				"id": "vercel-ai-gateway",
				"label": "Vercel AI Gateway"
			},
			"providers": [{
				"id": "vercel-ai-gateway",
				"name": "Vercel AI Gateway",
				"docs": "/providers/vercel-ai-gateway",
				"categories": ["cloud", "llm"],
				"envVars": ["AI_GATEWAY_API_KEY"],
				"authChoices": [{
					"method": "api-key",
					"choiceId": "ai-gateway-api-key",
					"choiceLabel": "Vercel AI Gateway API key",
					"choiceHint": "API key",
					"groupId": "ai-gateway",
					"groupLabel": "Vercel AI Gateway",
					"groupHint": "API key",
					"optionKey": "aiGatewayApiKey",
					"cliFlag": "--ai-gateway-api-key",
					"cliOption": "--ai-gateway-api-key <key>",
					"cliDescription": "Vercel AI Gateway API key",
					"onboardingScopes": ["text-inference"]
				}]
			}],
			"install": {
				"clawhubSpec": "clawhub:@openclaw/vercel-ai-gateway-provider",
				"npmSpec": "@openclaw/vercel-ai-gateway-provider",
				"defaultChoice": "npm",
				"minHostVersion": ">=2026.6.9"
			}
		}
	},
	{
		"name": "@openclaw/zai-provider",
		"description": "OpenClaw Z.AI provider plugin",
		"source": "official",
		"kind": "provider",
		"openclaw": {
			"plugin": {
				"id": "zai",
				"label": "Z.AI"
			},
			"providerEndpoints": [{
				"endpointClass": "zai-native",
				"hosts": ["api.z.ai"]
			}],
			"providers": [{
				"id": "zai",
				"aliases": ["z-ai", "z.ai"],
				"name": "Z.AI",
				"docs": "/providers/zai",
				"categories": ["cloud", "llm"],
				"envVars": ["ZAI_API_KEY", "Z_AI_API_KEY"],
				"authChoices": [
					{
						"method": "api-key",
						"choiceId": "zai-api-key",
						"choiceLabel": "Z.AI API key",
						"groupId": "zai",
						"groupLabel": "Z.AI",
						"groupHint": "GLM Coding Plan / Global / CN",
						"optionKey": "zaiApiKey",
						"cliFlag": "--zai-api-key",
						"cliOption": "--zai-api-key <key>",
						"cliDescription": "Z.AI API key",
						"onboardingScopes": ["text-inference"]
					},
					{
						"method": "coding-global",
						"choiceId": "zai-coding-global",
						"choiceLabel": "Coding-Plan-Global",
						"choiceHint": "GLM Coding Plan Global (api.z.ai)",
						"groupId": "zai",
						"groupLabel": "Z.AI",
						"groupHint": "GLM Coding Plan / Global / CN",
						"optionKey": "zaiApiKey",
						"cliFlag": "--zai-api-key",
						"cliOption": "--zai-api-key <key>",
						"cliDescription": "Z.AI API key",
						"onboardingScopes": ["text-inference"]
					},
					{
						"method": "coding-cn",
						"choiceId": "zai-coding-cn",
						"choiceLabel": "Coding-Plan-CN",
						"choiceHint": "GLM Coding Plan CN (open.bigmodel.cn)",
						"groupId": "zai",
						"groupLabel": "Z.AI",
						"groupHint": "GLM Coding Plan / Global / CN",
						"optionKey": "zaiApiKey",
						"cliFlag": "--zai-api-key",
						"cliOption": "--zai-api-key <key>",
						"cliDescription": "Z.AI API key",
						"onboardingScopes": ["text-inference"]
					},
					{
						"method": "global",
						"choiceId": "zai-global",
						"choiceLabel": "Global",
						"choiceHint": "Z.AI Global (api.z.ai)",
						"groupId": "zai",
						"groupLabel": "Z.AI",
						"groupHint": "GLM Coding Plan / Global / CN",
						"optionKey": "zaiApiKey",
						"cliFlag": "--zai-api-key",
						"cliOption": "--zai-api-key <key>",
						"cliDescription": "Z.AI API key",
						"onboardingScopes": ["text-inference"]
					},
					{
						"method": "cn",
						"choiceId": "zai-cn",
						"choiceLabel": "CN",
						"choiceHint": "Z.AI CN (open.bigmodel.cn)",
						"groupId": "zai",
						"groupLabel": "Z.AI",
						"groupHint": "GLM Coding Plan / Global / CN",
						"optionKey": "zaiApiKey",
						"cliFlag": "--zai-api-key",
						"cliOption": "--zai-api-key <key>",
						"cliDescription": "Z.AI API key",
						"onboardingScopes": ["text-inference"]
					}
				]
			}],
			"contracts": { "mediaUnderstandingProviders": ["zai"] },
			"install": {
				"clawhubSpec": "clawhub:@openclaw/zai-provider",
				"npmSpec": "@openclaw/zai-provider",
				"defaultChoice": "npm",
				"minHostVersion": ">=2026.6.9"
			}
		}
	},
	{
		"name": "@openclaw/stepfun-provider",
		"description": "OpenClaw StepFun provider plugin.",
		"source": "official",
		"kind": "provider",
		"openclaw": {
			"plugin": {
				"id": "stepfun",
				"label": "StepFun"
			},
			"providers": [{
				"id": "stepfun",
				"name": "StepFun",
				"docs": "/providers/stepfun",
				"categories": ["cloud", "llm"],
				"envVars": ["STEPFUN_API_KEY"],
				"authChoices": [{
					"method": "standard-api-key-cn",
					"choiceId": "stepfun-standard-api-key-cn",
					"choiceLabel": "StepFun Standard API key (China)",
					"choiceHint": "Endpoint: api.stepfun.com/v1",
					"groupId": "stepfun",
					"groupLabel": "StepFun",
					"groupHint": "Standard / Step Plan (China / Global)",
					"optionKey": "stepfunApiKey",
					"cliFlag": "--stepfun-api-key",
					"cliOption": "--stepfun-api-key <key>",
					"cliDescription": "StepFun API key",
					"onboardingScopes": ["text-inference"]
				}, {
					"method": "standard-api-key-intl",
					"choiceId": "stepfun-standard-api-key-intl",
					"choiceLabel": "StepFun Standard API key (Global/Intl)",
					"choiceHint": "Endpoint: api.stepfun.ai/v1",
					"groupId": "stepfun",
					"groupLabel": "StepFun",
					"groupHint": "Standard / Step Plan (China / Global)",
					"optionKey": "stepfunApiKey",
					"cliFlag": "--stepfun-api-key",
					"cliOption": "--stepfun-api-key <key>",
					"cliDescription": "StepFun API key",
					"onboardingScopes": ["text-inference"]
				}]
			}, {
				"id": "stepfun-plan",
				"name": "StepFun stepfun plan",
				"docs": "/providers/stepfun",
				"categories": ["cloud", "llm"],
				"envVars": ["STEPFUN_API_KEY"],
				"authChoices": [{
					"method": "plan-api-key-cn",
					"choiceId": "stepfun-plan-api-key-cn",
					"choiceLabel": "StepFun Step Plan API key (China)",
					"choiceHint": "Endpoint: api.stepfun.com/step_plan/v1",
					"groupId": "stepfun",
					"groupLabel": "StepFun",
					"groupHint": "Standard / Step Plan (China / Global)",
					"optionKey": "stepfunApiKey",
					"cliFlag": "--stepfun-api-key",
					"cliOption": "--stepfun-api-key <key>",
					"cliDescription": "StepFun API key",
					"onboardingScopes": ["text-inference"]
				}, {
					"method": "plan-api-key-intl",
					"choiceId": "stepfun-plan-api-key-intl",
					"choiceLabel": "StepFun Step Plan API key (Global/Intl)",
					"choiceHint": "Endpoint: api.stepfun.ai/step_plan/v1",
					"groupId": "stepfun",
					"groupLabel": "StepFun",
					"groupHint": "Standard / Step Plan (China / Global)",
					"optionKey": "stepfunApiKey",
					"cliFlag": "--stepfun-api-key",
					"cliOption": "--stepfun-api-key <key>",
					"cliDescription": "StepFun API key",
					"onboardingScopes": ["text-inference"]
				}]
			}],
			"install": {
				"clawhubSpec": "clawhub:@openclaw/stepfun-provider",
				"npmSpec": "@openclaw/stepfun-provider",
				"defaultChoice": "npm",
				"minHostVersion": ">=2026.6.9"
			}
		}
	}
] };
//#endregion
//#region src/plugins/official-external-plugin-catalog.ts
/** Reads official external plugin/channel/provider catalogs into manifest-like metadata. */
var HostedCatalogSnapshotWriteError = class extends Error {
	constructor(originalError) {
		super("hosted catalog snapshot write failed");
		this.name = "HostedCatalogSnapshotWriteError";
		this.originalError = originalError;
	}
};
const OFFICIAL_CATALOG_SOURCES = [
	official_external_channel_catalog_default,
	official_external_provider_catalog_default,
	official_external_plugin_catalog_default
];
const SUPPORTED_OFFICIAL_EXTERNAL_CATALOG_FEED_SCHEMA_VERSIONS = /* @__PURE__ */ new Set([1, 2]);
const DEFAULT_OFFICIAL_EXTERNAL_PLUGIN_CATALOG_FEED_URL = "https://clawhub.ai/v1/feeds/plugins";
const DEFAULT_OFFICIAL_EXTERNAL_PLUGIN_CATALOG_FEED_PROFILE = "clawhub-public";
const DEFAULT_OFFICIAL_EXTERNAL_PLUGIN_CATALOG_CLAWHUB_SOURCE_REF = "public-clawhub";
const DEFAULT_OFFICIAL_EXTERNAL_PLUGIN_CATALOG_NPM_SOURCE_REF = "public-npm";
const DEFAULT_OFFICIAL_EXTERNAL_PLUGIN_CATALOG_PROFILE_CONFIG = {
	feeds: { [DEFAULT_OFFICIAL_EXTERNAL_PLUGIN_CATALOG_FEED_PROFILE]: { url: DEFAULT_OFFICIAL_EXTERNAL_PLUGIN_CATALOG_FEED_URL } },
	sources: {
		[DEFAULT_OFFICIAL_EXTERNAL_PLUGIN_CATALOG_CLAWHUB_SOURCE_REF]: {
			type: "clawhub",
			baseUrl: "https://clawhub.ai"
		},
		[DEFAULT_OFFICIAL_EXTERNAL_PLUGIN_CATALOG_NPM_SOURCE_REF]: {
			type: "npm",
			registry: "https://registry.npmjs.org/"
		}
	}
};
const DEFAULT_HOSTED_OFFICIAL_EXTERNAL_PLUGIN_CATALOG_TIMEOUT_MS = 5e3;
const DEFAULT_HOSTED_OFFICIAL_EXTERNAL_PLUGIN_CATALOG_MAX_BYTES = 1024 * 1024;
const DEFAULT_HOSTED_OFFICIAL_EXTERNAL_PLUGIN_CATALOG_CHUNK_TIMEOUT_MS = 5e3;
const OFFICIAL_EXTERNAL_PLUGIN_CATALOG_FEED_HOSTNAME_ALLOWLIST = ["clawhub.ai"];
function isOfficialExternalPluginCatalogFeed(raw) {
	if (!isRecord(raw)) return false;
	const sequence = raw.sequence;
	const entries = raw.entries;
	return typeof raw.schemaVersion === "number" && SUPPORTED_OFFICIAL_EXTERNAL_CATALOG_FEED_SCHEMA_VERSIONS.has(raw.schemaVersion) && typeof raw.id === "string" && raw.id.trim().length > 0 && typeof raw.generatedAt === "string" && raw.generatedAt.trim().length > 0 && typeof sequence === "number" && Number.isInteger(sequence) && sequence >= 0 && Array.isArray(entries);
}
function parseOfficialExternalPluginCatalogEntries(raw) {
	if (Array.isArray(raw)) return raw.filter((entry) => isRecord(entry));
	if (isOfficialExternalPluginCatalogFeed(raw)) return raw.entries.filter((entry) => isRecord(entry));
	if (!isRecord(raw)) return [];
	if ("schemaVersion" in raw) return [];
	const list = raw.entries ?? raw.packages ?? raw.plugins;
	if (!Array.isArray(list)) return [];
	return list.filter((entry) => isRecord(entry));
}
function normalizeHostedCatalogHeader(value) {
	return normalizeOptionalString(value) || void 0;
}
function sha256Hex(value) {
	return `sha256:${createHash("sha256").update(value).digest("hex")}`;
}
function resolveHostedCatalogFeedUrl(raw) {
	let parsed;
	try {
		parsed = new URL(raw.trim());
	} catch {
		throw new Error("hosted catalog feed URL is invalid");
	}
	if (parsed.protocol !== "https:") throw new Error("hosted catalog feed URL must use HTTPS");
	if (parsed.username || parsed.password) throw new Error("hosted catalog feed URL must not include credentials");
	if (parsed.search || parsed.hash) throw new Error("hosted catalog feed URL must not include query strings or fragments");
	return parsed;
}
function resolveOfficialExternalPluginCatalogProfileConfig(config) {
	return {
		feeds: {
			...DEFAULT_OFFICIAL_EXTERNAL_PLUGIN_CATALOG_PROFILE_CONFIG.feeds,
			...config?.feeds
		},
		sources: {
			...DEFAULT_OFFICIAL_EXTERNAL_PLUGIN_CATALOG_PROFILE_CONFIG.sources,
			...config?.sources
		}
	};
}
function resolveHostedCatalogFeedSource(params) {
	const profileConfig = resolveOfficialExternalPluginCatalogProfileConfig(params.catalogConfig);
	const explicitFeedUrl = normalizeOptionalString(params.feedUrl);
	if (explicitFeedUrl) {
		const url = resolveHostedCatalogFeedUrl(explicitFeedUrl);
		if (!OFFICIAL_EXTERNAL_PLUGIN_CATALOG_FEED_HOSTNAME_ALLOWLIST.includes(url.hostname)) throw new Error("hosted catalog feed URL hostname is not allowed");
		return {
			url,
			hostnameAllowlist: OFFICIAL_EXTERNAL_PLUGIN_CATALOG_FEED_HOSTNAME_ALLOWLIST
		};
	}
	const profileName = normalizeOptionalString(params.feedProfile) ?? "clawhub-public";
	const profile = profileConfig.feeds[profileName];
	if (!profile) throw new Error(`hosted catalog feed profile "${profileName}" is not configured`);
	const url = resolveHostedCatalogFeedUrl(profile.url);
	return {
		url,
		hostnameAllowlist: uniqueStrings([...OFFICIAL_EXTERNAL_PLUGIN_CATALOG_FEED_HOSTNAME_ALLOWLIST, url.hostname])
	};
}
function getOfficialExternalPluginCatalogSourceRefs(config) {
	return new Set(Object.keys(resolveOfficialExternalPluginCatalogProfileConfig(config).sources));
}
function getFeedEntryInstallCandidateRecords(entry) {
	const candidates = (isRecord(entry.install) ? entry.install : void 0)?.candidates;
	if (!Array.isArray(candidates)) return [];
	return candidates.filter((candidate) => isRecord(candidate));
}
function getFeedEntryInstallCandidates(entry) {
	if (normalizeOptionalString(entry.state) !== "available") return [];
	if (normalizeOptionalString(entry.publisher?.trust) !== "official") return [];
	return getFeedEntryInstallCandidateRecords(entry);
}
function shouldRequireManifestInstallSourceRef(params) {
	const feedUrl = normalizeOptionalString(params.feedUrl);
	if (feedUrl) try {
		return resolveHostedCatalogFeedUrl(feedUrl).href !== resolveHostedCatalogFeedUrl(DEFAULT_OFFICIAL_EXTERNAL_PLUGIN_CATALOG_FEED_URL).href;
	} catch {
		return true;
	}
	const profileName = normalizeOptionalString(params.feedProfile) ?? "clawhub-public";
	if (profileName !== "clawhub-public") return true;
	const profileUrl = normalizeOptionalString(resolveOfficialExternalPluginCatalogProfileConfig(params.catalogConfig).feeds[profileName]?.url);
	try {
		return resolveHostedCatalogFeedUrl(profileUrl ?? "https://clawhub.ai/v1/feeds/plugins").href !== resolveHostedCatalogFeedUrl(DEFAULT_OFFICIAL_EXTERNAL_PLUGIN_CATALOG_FEED_URL).href;
	} catch {
		return true;
	}
}
function getManifestInstallSourceRefCandidate(entry) {
	const install = getOfficialExternalPluginCatalogManifest(entry)?.install;
	if (!install) return;
	if (!Boolean(normalizeOptionalString(install.clawhubSpec) || normalizeOptionalString(install.npmSpec) || normalizeOptionalString(install.localPath))) return;
	return {
		sourceRef: normalizeOptionalString(install.sourceRef),
		package: normalizeOptionalString(install.npmSpec) ?? normalizeOptionalString(install.clawhubSpec)
	};
}
function validateOfficialExternalPluginCatalogEntrySourceRefs(entry, params) {
	const configuredSourceRefs = getOfficialExternalPluginCatalogSourceRefs(params?.catalogConfig);
	const errors = [];
	let candidates = getFeedEntryInstallCandidateRecords(entry);
	if (params?.requireManifestInstallSourceRef) {
		const manifestCandidate = getManifestInstallSourceRefCandidate(entry);
		if (manifestCandidate) candidates = [...candidates, manifestCandidate];
		else if (candidates.length === 0) candidates = [{}];
	}
	for (const candidate of candidates) {
		const sourceRef = normalizeOptionalString(candidate.sourceRef);
		if (!sourceRef) errors.push("feed install candidate is missing sourceRef");
		else if (!configuredSourceRefs.has(sourceRef)) errors.push(`feed install candidate references unknown sourceRef "${sourceRef}"`);
	}
	return errors;
}
function filterOfficialExternalPluginCatalogEntriesBySourceRefs(entries, params) {
	return entries.filter((entry) => validateOfficialExternalPluginCatalogEntrySourceRefs(entry, params).length === 0);
}
function parseHostedCatalogContentLength(raw, maxBytes) {
	const normalized = normalizeOptionalString(raw);
	if (!normalized) return;
	if (!/^\d+$/.test(normalized)) throw new Error("hosted catalog feed has invalid content-length");
	const size = Number(normalized);
	if (!Number.isSafeInteger(size) || size > maxBytes) throw new Error(`hosted catalog feed exceeds ${maxBytes} bytes`);
}
function hasStreamingResponseBody(response) {
	return Boolean(response.body && typeof response.body.getReader === "function");
}
async function readHostedCatalogChunkWithTimeout(reader, chunkTimeoutMs) {
	let timeoutId;
	let timedOut = false;
	return await new Promise((resolve, reject) => {
		const clear = () => {
			if (timeoutId !== void 0) {
				clearTimeout(timeoutId);
				timeoutId = void 0;
			}
		};
		timeoutId = setTimeout(() => {
			timedOut = true;
			clear();
			reader.cancel().catch(() => void 0);
			reject(/* @__PURE__ */ new Error(`hosted catalog feed read timed out after ${chunkTimeoutMs}ms`));
		}, chunkTimeoutMs);
		reader.read().then((result) => {
			clear();
			if (!timedOut) resolve(result);
		}, (err) => {
			clear();
			if (!timedOut) reject(err instanceof Error ? err : new Error(String(err)));
		});
	});
}
async function readHostedCatalogResponseText(params) {
	parseHostedCatalogContentLength(params.response.headers.get("content-length"), params.maxBytes);
	if (!hasStreamingResponseBody(params.response)) {
		const text = await params.response.text();
		if (new TextEncoder().encode(text).byteLength > params.maxBytes) throw new Error(`hosted catalog feed exceeds ${params.maxBytes} bytes`);
		return text;
	}
	const reader = params.response.body.getReader();
	const chunks = [];
	let totalBytes = 0;
	try {
		while (true) {
			const chunk = await readHostedCatalogChunkWithTimeout(reader, params.chunkTimeoutMs);
			if (chunk.done) break;
			totalBytes += chunk.value.byteLength;
			if (totalBytes > params.maxBytes) throw new Error(`hosted catalog feed exceeds ${params.maxBytes} bytes`);
			chunks.push(chunk.value);
		}
	} catch (err) {
		await reader.cancel().catch(() => void 0);
		throw err;
	} finally {
		reader.releaseLock();
	}
	const body = new Uint8Array(totalBytes);
	let offset = 0;
	for (const chunk of chunks) {
		body.set(chunk, offset);
		offset += chunk.byteLength;
	}
	return new TextDecoder().decode(body);
}
function bundledOfficialExternalPluginCatalogEntries() {
	return OFFICIAL_CATALOG_SOURCES.flatMap((source) => filterOfficialExternalPluginCatalogEntriesBySourceRefs(parseOfficialExternalPluginCatalogEntries(source)));
}
function dedupeOfficialExternalPluginCatalogEntries(entries) {
	const resolved = /* @__PURE__ */ new Map();
	for (const entry of entries) {
		const key = resolveOfficialExternalPluginCatalogEntryKey(entry);
		if (key && !resolved.has(key)) resolved.set(key, entry);
	}
	return [...resolved.values()];
}
function resolveOfficialExternalPluginCatalogEntryKey(entry) {
	const pluginId = resolveOfficialExternalPluginId(entry);
	if (pluginId) return `${normalizeOptionalString(entry.kind) ?? "plugin"}:${pluginId}`;
	const name = normalizeOptionalString(entry.name);
	if (name) return name;
	const id = normalizeOptionalString(entry.id);
	if (id) return `${normalizeOptionalString(entry.kind) ?? normalizeOptionalString(entry.type) ?? "plugin"}:${id}`;
}
function formatHostedCatalogError(error) {
	return error instanceof Error ? error.message : String(error);
}
function bundledFallbackResult(error, metadata) {
	return {
		source: "bundled-fallback",
		entries: listOfficialExternalPluginCatalogEntries(),
		error: formatHostedCatalogError(error),
		...metadata ? { metadata } : {}
	};
}
function loadHostedCatalogSnapshotResult(params) {
	assertSnapshotMatchesRequestValidators({
		snapshot: params.snapshot,
		ifNoneMatch: params.ifNoneMatch,
		ifModifiedSince: params.ifModifiedSince
	});
	const checksum = sha256Hex(params.snapshot.body);
	if (checksum !== params.snapshot.metadata.checksum) throw new Error("hosted catalog snapshot checksum mismatch");
	if (params.expectedSha256 && params.expectedSha256 !== checksum) throw new Error("hosted catalog snapshot checksum did not match expected checksum");
	const raw = JSON.parse(params.snapshot.body);
	if (!isOfficialExternalPluginCatalogFeed(raw)) throw new Error("hosted catalog snapshot did not match a supported schema version");
	return {
		source: "hosted-snapshot",
		entries: dedupeOfficialExternalPluginCatalogEntries(filterOfficialExternalPluginCatalogEntriesBySourceRefs(parseOfficialExternalPluginCatalogEntries(raw), {
			catalogConfig: params.catalogConfig,
			requireManifestInstallSourceRef: params.requireManifestInstallSourceRef
		})),
		feed: raw,
		metadata: params.snapshot.metadata,
		snapshot: params.snapshot,
		error: formatHostedCatalogError(params.error)
	};
}
function assertSnapshotMatchesRequestValidators(params) {
	if (params.ifNoneMatch && params.snapshot.metadata.etag !== params.ifNoneMatch) throw new Error("hosted catalog snapshot ETag did not match request validator");
	if (!params.ifNoneMatch && params.ifModifiedSince && params.snapshot.metadata.lastModified !== params.ifModifiedSince) throw new Error("hosted catalog snapshot Last-Modified did not match request validator");
}
async function snapshotOrBundledFallbackResult(params) {
	if (params.snapshotStore) try {
		const snapshot = await params.snapshotStore.read(params.url);
		if (snapshot) return loadHostedCatalogSnapshotResult({
			snapshot,
			error: params.error,
			expectedSha256: params.expectedSha256,
			ifNoneMatch: params.ifNoneMatch,
			ifModifiedSince: params.ifModifiedSince,
			catalogConfig: params.catalogConfig,
			requireManifestInstallSourceRef: params.requireManifestInstallSourceRef
		});
	} catch (snapshotErr) {
		return bundledFallbackResult(`${formatHostedCatalogError(params.error)}; snapshot fallback failed: ${formatHostedCatalogError(snapshotErr)}`, params.metadata);
	}
	return bundledFallbackResult(params.error, params.metadata);
}
async function resolveHostedCatalogSnapshotStore(params) {
	if (params.snapshotStore !== void 0) return params.snapshotStore ?? void 0;
	const { createSqliteHostedOfficialExternalPluginCatalogSnapshotStore } = await import("./official-external-plugin-catalog-snapshot-store-I_2wUvop.js");
	return createSqliteHostedOfficialExternalPluginCatalogSnapshotStore({
		...params.env ? { env: params.env } : {},
		...params.stateDir ? { stateDir: params.stateDir } : {},
		...params.stateDatabasePath ? { stateDatabasePath: params.stateDatabasePath } : {}
	});
}
async function loadHostedOfficialExternalPluginCatalogEntries(params) {
	let source;
	try {
		source = resolveHostedCatalogFeedSource({
			feedUrl: params?.feedUrl,
			feedProfile: params?.feedProfile,
			catalogConfig: params?.catalogConfig
		});
	} catch (err) {
		return bundledFallbackResult(err);
	}
	const { url } = source;
	const snapshotStore = await resolveHostedCatalogSnapshotStore({
		snapshotStore: params?.snapshotStore,
		env: params?.env,
		stateDir: params?.stateDir,
		stateDatabasePath: params?.stateDatabasePath
	});
	const expectedSha256 = normalizeOptionalString(params?.expectedSha256);
	const requireManifestInstallSourceRef = shouldRequireManifestInstallSourceRef({
		feedUrl: params?.feedUrl,
		feedProfile: params?.feedProfile,
		catalogConfig: params?.catalogConfig
	});
	if (params?.offline === true) return await snapshotOrBundledFallbackResult({
		error: "hosted catalog feed offline mode",
		snapshotStore,
		url: url.href,
		expectedSha256,
		catalogConfig: params?.catalogConfig,
		requireManifestInstallSourceRef
	});
	const headers = new Headers();
	const ifNoneMatch = normalizeOptionalString(params?.ifNoneMatch);
	const ifModifiedSince = normalizeOptionalString(params?.ifModifiedSince);
	if (ifNoneMatch) headers.set("if-none-match", ifNoneMatch);
	if (ifModifiedSince) headers.set("if-modified-since", ifModifiedSince);
	const metadataBase = (response) => {
		const etag = normalizeHostedCatalogHeader(response.headers.get("etag"));
		const lastModified = normalizeHostedCatalogHeader(response.headers.get("last-modified"));
		return {
			url: url.href,
			status: response.status,
			...etag ? { etag } : {},
			...lastModified ? { lastModified } : {}
		};
	};
	let response;
	let release;
	try {
		const { fetchWithSsrFGuard } = await import("./fetch-guard-BY-wcrsJ.js");
		const guarded = await fetchWithSsrFGuard({
			url: url.href,
			fetchImpl: params?.fetchImpl,
			init: {
				method: "GET",
				headers
			},
			requireHttps: true,
			maxRedirects: 2,
			timeoutMs: params?.timeoutMs ?? DEFAULT_HOSTED_OFFICIAL_EXTERNAL_PLUGIN_CATALOG_TIMEOUT_MS,
			policy: { hostnameAllowlist: source.hostnameAllowlist },
			auditContext: "official-external-plugin-catalog-feed"
		});
		response = guarded.response;
		release = guarded.release;
		const base = metadataBase(response);
		if (response.status === 304) return await snapshotOrBundledFallbackResult({
			error: "hosted catalog feed returned HTTP 304",
			snapshotStore,
			url: url.href,
			metadata: base,
			expectedSha256,
			ifNoneMatch,
			ifModifiedSince,
			catalogConfig: params?.catalogConfig,
			requireManifestInstallSourceRef
		});
		if (!response.ok) return await snapshotOrBundledFallbackResult({
			error: `hosted catalog feed returned HTTP ${response.status}`,
			snapshotStore,
			url: url.href,
			metadata: base,
			expectedSha256,
			ifNoneMatch,
			ifModifiedSince,
			catalogConfig: params?.catalogConfig,
			requireManifestInstallSourceRef
		});
		const body = await readHostedCatalogResponseText({
			response,
			maxBytes: params?.maxBytes ?? DEFAULT_HOSTED_OFFICIAL_EXTERNAL_PLUGIN_CATALOG_MAX_BYTES,
			chunkTimeoutMs: params?.chunkTimeoutMs ?? DEFAULT_HOSTED_OFFICIAL_EXTERNAL_PLUGIN_CATALOG_CHUNK_TIMEOUT_MS
		});
		const checksum = sha256Hex(body);
		const metadata = {
			...base,
			checksum
		};
		if (expectedSha256 && expectedSha256 !== checksum) return await snapshotOrBundledFallbackResult({
			error: `hosted catalog feed checksum mismatch: expected ${expectedSha256}`,
			snapshotStore,
			url: url.href,
			metadata,
			expectedSha256,
			ifNoneMatch,
			ifModifiedSince,
			catalogConfig: params?.catalogConfig,
			requireManifestInstallSourceRef
		});
		const raw = JSON.parse(body);
		if (!isOfficialExternalPluginCatalogFeed(raw)) return await snapshotOrBundledFallbackResult({
			error: "hosted catalog feed did not match a supported schema version",
			snapshotStore,
			url: url.href,
			metadata,
			expectedSha256,
			ifNoneMatch,
			ifModifiedSince,
			catalogConfig: params?.catalogConfig,
			requireManifestInstallSourceRef
		});
		const entries = filterOfficialExternalPluginCatalogEntriesBySourceRefs(parseOfficialExternalPluginCatalogEntries(raw), {
			catalogConfig: params?.catalogConfig,
			requireManifestInstallSourceRef
		});
		await snapshotStore?.write({
			body,
			metadata,
			savedAt: (params?.now?.() ?? /* @__PURE__ */ new Date()).toISOString()
		}).catch((err) => {
			if (params?.requireSnapshotWrite) throw new HostedCatalogSnapshotWriteError(err);
		});
		return {
			source: "hosted",
			entries: dedupeOfficialExternalPluginCatalogEntries(entries),
			feed: raw,
			metadata
		};
	} catch (err) {
		if (err instanceof HostedCatalogSnapshotWriteError) throw err.originalError;
		return await snapshotOrBundledFallbackResult({
			error: err,
			snapshotStore,
			url: url.href,
			expectedSha256,
			ifNoneMatch,
			ifModifiedSince,
			catalogConfig: params?.catalogConfig,
			requireManifestInstallSourceRef
		});
	} finally {
		if (response?.bodyUsed !== true) await response?.body?.cancel().catch(() => void 0);
		await release?.().catch(() => void 0);
	}
}
function normalizeDefaultChoice(value) {
	return value === "clawhub" || value === "npm" || value === "local" ? value : void 0;
}
function formatFeedInstallCandidateSpec(candidate) {
	const packageName = normalizeOptionalString(candidate.package);
	if (!packageName) return;
	const version = normalizeOptionalString(candidate.version);
	if (!version || packageName.endsWith(`@${version}`)) return packageName;
	return `${packageName}@${version}`;
}
function getFeedEntryCandidateSourceType(candidate, config) {
	const sourceRef = normalizeOptionalString(candidate.sourceRef);
	if (!sourceRef) return;
	return resolveOfficialExternalPluginCatalogProfileConfig(config).sources[sourceRef]?.type;
}
function getPreferredFeedEntryInstallCandidate(params) {
	const candidates = getFeedEntryInstallCandidates(params.entry).filter((candidate) => Boolean(normalizeOptionalString(candidate.package)));
	return candidates.find((candidate) => normalizeOptionalString(candidate.sourceRef) === "public-clawhub") ?? candidates.find((candidate) => normalizeOptionalString(candidate.sourceRef) === "public-npm") ?? candidates.find((candidate) => Boolean(getFeedEntryCandidateSourceType(candidate, params.catalogConfig)));
}
function resolveFeedEntryInstallCandidate(params) {
	const candidate = getPreferredFeedEntryInstallCandidate(params);
	if (!candidate) return null;
	const spec = formatFeedInstallCandidateSpec(candidate);
	if (!spec) return null;
	const sourceType = getFeedEntryCandidateSourceType(candidate, params.catalogConfig);
	if (sourceType === "clawhub") {
		const expectedIntegrity = normalizeClawHubSha256ExpectedIntegrity(candidate.integrity);
		return {
			clawhubSpec: `clawhub:${spec}`,
			defaultChoice: "clawhub",
			...expectedIntegrity ? { expectedIntegrity } : {}
		};
	}
	if (sourceType === "npm") {
		const expectedIntegrity = normalizeNpmExpectedIntegrity(candidate.integrity);
		return {
			npmSpec: spec,
			defaultChoice: "npm",
			...expectedIntegrity ? { expectedIntegrity } : {}
		};
	}
	return null;
}
function normalizeClawHubSha256ExpectedIntegrity(value) {
	const integrity = normalizeOptionalString(value);
	return integrity ? normalizeClawHubSha256Integrity(integrity) ?? void 0 : void 0;
}
function normalizeNpmExpectedIntegrity(value) {
	const integrity = normalizeOptionalString(value);
	if (!integrity || !/^[a-z0-9]+-[A-Za-z0-9+/=]+$/i.test(integrity)) return;
	return integrity;
}
/** Returns manifest metadata from an official external catalog entry when present. */
function getOfficialExternalPluginCatalogManifest(entry) {
	const manifest = entry[MANIFEST_KEY];
	return isRecord(manifest) ? manifest : void 0;
}
function resolveOfficialExternalPluginId(entry) {
	const manifest = getOfficialExternalPluginCatalogManifest(entry);
	return normalizeOptionalString(manifest?.plugin?.id) ?? normalizeOptionalString(manifest?.channel?.id) ?? normalizeOptionalString(manifest?.providers?.[0]?.id) ?? normalizeOptionalString(entry.id);
}
function resolveOfficialExternalPluginLookupIds(entry) {
	const manifest = getOfficialExternalPluginCatalogManifest(entry);
	const lookupIds = [normalizeOptionalString(manifest?.plugin?.id), normalizeOptionalString(manifest?.channel?.id)];
	for (const provider of manifest?.providers ?? []) {
		lookupIds.push(normalizeOptionalString(provider.id));
		for (const alias of provider.aliases ?? []) lookupIds.push(normalizeOptionalString(alias));
	}
	return uniqueStrings(lookupIds.filter((value) => Boolean(value)));
}
function resolveOfficialExternalPluginLabel(entry) {
	const manifest = getOfficialExternalPluginCatalogManifest(entry);
	return normalizeOptionalString(manifest?.plugin?.label) ?? normalizeOptionalString(manifest?.channel?.label) ?? normalizeOptionalString(manifest?.providers?.[0]?.name) ?? normalizeOptionalString(entry.title) ?? normalizeOptionalString(entry.name) ?? resolveOfficialExternalPluginId(entry) ?? "plugin";
}
function resolveOfficialExternalPluginInstall(entry, params) {
	const install = getOfficialExternalPluginCatalogManifest(entry)?.install;
	const clawhubSpec = normalizeOptionalString(install?.clawhubSpec);
	const manifestNpmSpec = normalizeOptionalString(install?.npmSpec);
	const localPath = normalizeOptionalString(install?.localPath);
	const candidateInstall = resolveFeedEntryInstallCandidate({
		entry,
		catalogConfig: params?.catalogConfig
	});
	if (candidateInstall) return {
		...candidateInstall,
		...install?.minHostVersion ? { minHostVersion: install.minHostVersion } : {},
		...install?.expectedIntegrity && !candidateInstall.expectedIntegrity ? { expectedIntegrity: install.expectedIntegrity } : {},
		...install?.allowInvalidConfigRecovery === true ? { allowInvalidConfigRecovery: true } : {}
	};
	const hasFeedInstallCandidates = getFeedEntryInstallCandidateRecords(entry).length > 0;
	const npmSpec = manifestNpmSpec ?? (hasFeedInstallCandidates ? void 0 : normalizeOptionalString(entry.name));
	const defaultChoice = normalizeDefaultChoice(install?.defaultChoice) ?? (npmSpec ? "npm" : clawhubSpec ? "clawhub" : localPath ? "local" : void 0);
	if (!clawhubSpec && !npmSpec && !localPath) return null;
	return {
		...clawhubSpec ? { clawhubSpec } : {},
		...npmSpec ? { npmSpec } : {},
		...localPath ? { localPath } : {},
		...defaultChoice ? { defaultChoice } : {},
		...install?.minHostVersion ? { minHostVersion: install.minHostVersion } : {},
		...install?.expectedIntegrity ? { expectedIntegrity: install.expectedIntegrity } : {},
		...install?.allowInvalidConfigRecovery === true ? { allowInvalidConfigRecovery: true } : {}
	};
}
function resolveOfficialExternalPluginCatalogProfileConfigFromConfig(config) {
	return config?.marketplaces;
}
async function loadConfiguredHostedOfficialExternalPluginCatalogEntries(config, params) {
	return await loadHostedOfficialExternalPluginCatalogEntries({
		...params,
		catalogConfig: resolveOfficialExternalPluginCatalogProfileConfigFromConfig(config)
	});
}
function listOfficialExternalPluginCatalogEntries() {
	return dedupeOfficialExternalPluginCatalogEntries(bundledOfficialExternalPluginCatalogEntries());
}
/** Resolves official external plugin owners for configured capability provider ids. */
function resolveOfficialExternalProviderContractPluginIds(params) {
	const configuredProviderIds = new Set([...params.providerIds].map((providerId) => normalizeOptionalString(providerId)?.toLowerCase()).filter((providerId) => Boolean(providerId)));
	if (configuredProviderIds.size === 0) return [];
	const pluginIds = /* @__PURE__ */ new Set();
	for (const entry of listOfficialExternalPluginCatalogEntries()) {
		const pluginId = resolveOfficialExternalPluginId(entry);
		const providerIds = getOfficialExternalPluginCatalogManifest(entry)?.contracts?.[params.contract];
		if (pluginId && providerIds?.some((providerId) => {
			const normalized = normalizeOptionalString(providerId)?.toLowerCase();
			return normalized ? configuredProviderIds.has(normalized) : false;
		})) pluginIds.add(pluginId);
	}
	return [...pluginIds].toSorted((left, right) => left.localeCompare(right));
}
/** Resolves official web provider owners from matching documented environment credentials. */
function resolveOfficialExternalWebProviderContractPluginIdsForEnv(params) {
	const pluginIds = /* @__PURE__ */ new Set();
	for (const entry of listOfficialExternalPluginCatalogEntries()) {
		const pluginId = resolveOfficialExternalPluginId(entry);
		const manifest = getOfficialExternalPluginCatalogManifest(entry);
		const contractProviderIds = new Set((manifest?.contracts?.[params.contract] ?? []).map((providerId) => normalizeOptionalString(providerId)?.toLowerCase()).filter((providerId) => Boolean(providerId)));
		if (pluginId && contractProviderIds.size > 0 && manifest?.webSearchProviders?.some((provider) => {
			const providerId = normalizeOptionalString(provider.id)?.toLowerCase();
			return providerId !== void 0 && contractProviderIds.has(providerId) && provider.envVars?.some((envVar) => Boolean(params.env[envVar]?.trim()));
		})) pluginIds.add(pluginId);
	}
	return [...pluginIds].toSorted((left, right) => left.localeCompare(right));
}
/** Resolves official external plugin owners for configured model provider ids. */
function resolveOfficialExternalProviderPluginIds(params) {
	const configuredProviderIds = new Set([...params.providerIds].map((providerId) => normalizeOptionalString(providerId)?.toLowerCase()).filter((providerId) => Boolean(providerId)));
	if (configuredProviderIds.size === 0) return [];
	const pluginIds = /* @__PURE__ */ new Set();
	for (const entry of listOfficialExternalProviderCatalogEntries()) {
		const pluginId = resolveOfficialExternalPluginId(entry);
		const providers = getOfficialExternalPluginCatalogManifest(entry)?.providers;
		if (pluginId && providers?.some((provider) => [provider.id, ...provider.aliases ?? []].some((providerId) => {
			const normalized = normalizeOptionalString(providerId)?.toLowerCase();
			return normalized ? configuredProviderIds.has(normalized) : false;
		}))) pluginIds.add(pluginId);
	}
	return [...pluginIds].toSorted((left, right) => left.localeCompare(right));
}
/** Resolves official external provider owners with configured environment credentials. */
function resolveOfficialExternalProviderPluginIdsForEnv(env) {
	const pluginIds = /* @__PURE__ */ new Set();
	for (const entry of listOfficialExternalProviderCatalogEntries()) {
		const pluginId = resolveOfficialExternalPluginId(entry);
		const providers = getOfficialExternalPluginCatalogManifest(entry)?.providers;
		if (pluginId && providers?.some((provider) => provider.envVars?.some((envVar) => Boolean(env[envVar]?.trim())))) pluginIds.add(pluginId);
	}
	return [...pluginIds].toSorted((left, right) => left.localeCompare(right));
}
function listOfficialExternalChannelCatalogEntries() {
	return listOfficialExternalPluginCatalogEntries().filter((entry) => Boolean(getOfficialExternalPluginCatalogManifest(entry)?.channel));
}
function listOfficialExternalChannelEnvVars() {
	return listOfficialExternalChannelCatalogEntries().flatMap((entry) => {
		const channel = getOfficialExternalPluginCatalogManifest(entry)?.channel;
		const channelId = normalizeOptionalString(channel?.id)?.toLowerCase();
		const envVars = uniqueStrings((channel?.envVars ?? []).map((envVar) => normalizeOptionalString(envVar)).filter((envVar) => Boolean(envVar)));
		return channelId && envVars.length > 0 ? [{
			channelId,
			envVars
		}] : [];
	});
}
function listOfficialExternalProviderCatalogEntries() {
	return listOfficialExternalPluginCatalogEntries().filter((entry) => (getOfficialExternalPluginCatalogManifest(entry)?.providers?.length ?? 0) > 0);
}
function getOfficialExternalPluginCatalogEntry(pluginId) {
	const normalized = pluginId.trim();
	if (!normalized) return;
	return listOfficialExternalPluginCatalogEntries().find((entry) => resolveOfficialExternalPluginLookupIds(entry).includes(normalized));
}
function getOfficialExternalPluginCatalogEntryForPackage(packageName) {
	const normalized = packageName?.trim();
	if (!normalized) return;
	return listOfficialExternalPluginCatalogEntries().find((entry) => normalizeOptionalString(entry.name) === normalized);
}
//#endregion
export { resolveOfficialExternalProviderPluginIdsForEnv as C, official_external_provider_catalog_default as E, resolveOfficialExternalProviderPluginIds as S, validateOfficialExternalPluginCatalogEntrySourceRefs as T, resolveOfficialExternalPluginCatalogProfileConfigFromConfig as _, filterOfficialExternalPluginCatalogEntriesBySourceRefs as a, resolveOfficialExternalPluginLabel as b, getOfficialExternalPluginCatalogManifest as c, listOfficialExternalChannelEnvVars as d, listOfficialExternalPluginCatalogEntries as f, parseOfficialExternalPluginCatalogEntries as g, loadHostedOfficialExternalPluginCatalogEntries as h, DEFAULT_OFFICIAL_EXTERNAL_PLUGIN_CATALOG_NPM_SOURCE_REF as i, isOfficialExternalPluginCatalogFeed as l, loadConfiguredHostedOfficialExternalPluginCatalogEntries as m, DEFAULT_OFFICIAL_EXTERNAL_PLUGIN_CATALOG_FEED_PROFILE as n, getOfficialExternalPluginCatalogEntry as o, listOfficialExternalProviderCatalogEntries as p, DEFAULT_OFFICIAL_EXTERNAL_PLUGIN_CATALOG_FEED_URL as r, getOfficialExternalPluginCatalogEntryForPackage as s, DEFAULT_OFFICIAL_EXTERNAL_PLUGIN_CATALOG_CLAWHUB_SOURCE_REF as t, listOfficialExternalChannelCatalogEntries as u, resolveOfficialExternalPluginId as v, resolveOfficialExternalWebProviderContractPluginIdsForEnv as w, resolveOfficialExternalProviderContractPluginIds as x, resolveOfficialExternalPluginInstall as y };
