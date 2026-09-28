import { F as normalizeLowercaseStringOrEmpty, P as isRecord, R as normalizeOptionalString } from "./utils-C25eiuh1.mjs";
import { l as uniqueStrings } from "./string-normalization-CNyvKrgf.mjs";
import { r as isOpenClawCorrectionSemver } from "./semver-aYpwYdrQ.mjs";
import { a as getFeedEntryInstallCandidateRecords, f as resolveOfficialExternalPluginCatalogEntryKey, o as getOfficialExternalPluginCatalogManifest, p as resolveOfficialExternalPluginCatalogProfileConfig, s as hasKnownCatalogSourceRef, t as DEFAULT_OFFICIAL_EXTERNAL_PLUGIN_CATALOG_PROFILE_CONFIG } from "./official-external-plugin-catalog-source-D_PnrId8.mjs";
import { parse, prerelease, valid } from "semver";
//#endregion
//#region src/plugins/official-external-plugin-bundled-catalogs.ts
const BUNDLED_OFFICIAL_EXTERNAL_PLUGIN_CATALOG_ENTRIES = [
	{ entries: [
		{
			"name": "@openclaw/buzz",
			"version": "2026.9.6",
			"description": "Connect OpenClaw agents to Buzz rooms",
			"source": "official",
			"kind": "channel",
			"openclaw": {
				"channelConfigs": { "buzz": {
					"label": "Buzz",
					"description": "Connect OpenClaw agents to Buzz team rooms."
				} },
				"channel": {
					"id": "buzz",
					"configuredState": { "env": { "allOf": ["BUZZ_RELAY_URL", "BUZZ_PRIVATE_KEY"] } },
					"label": "Buzz",
					"selectionLabel": "Buzz",
					"docsPath": "/channels/buzz",
					"docsLabel": "buzz",
					"blurb": "Connect OpenClaw agents to Buzz team rooms.",
					"markdownCapable": true,
					"order": 56,
					"setup": { "fields": [
						{
							"key": "relayUrl",
							"kind": "string",
							"cli": {
								"flags": "--relay-url <url>",
								"description": "Buzz relay WebSocket URL"
							}
						},
						{
							"key": "privateKey",
							"kind": "string",
							"sensitive": true,
							"cli": {
								"flags": "--private-key <key>",
								"description": "Buzz bot Nostr private key"
							}
						},
						{
							"key": "useEnv",
							"kind": "boolean",
							"cli": {
								"flags": "--use-env",
								"description": "Use BUZZ_PRIVATE_KEY with the supplied relay URL"
							},
							"envVars": ["BUZZ_PRIVATE_KEY"]
						}
					] }
				},
				"install": {
					"clawhubSpec": "clawhub:@openclaw/buzz",
					"npmSpec": "@openclaw/buzz",
					"defaultChoice": "npm",
					"minHostVersion": ">=2026.7.2"
				}
			}
		},
		{
			"name": "@openclaw/clickclack",
			"version": "2026.9.6",
			"description": "OpenClaw ClickClack channel plugin",
			"source": "official",
			"kind": "channel",
			"openclaw": {
				"contracts": { "tools": ["discussion"] },
				"channelConfigs": { "clickclack": {
					"label": "ClickClack",
					"description": "ClickClack channel accounts and group activation policy."
				} },
				"channel": {
					"id": "clickclack",
					"configuredState": { "env": { "anyOf": ["CLICKCLACK_BOT_TOKEN"] } },
					"label": "ClickClack",
					"selectionLabel": "ClickClack",
					"detailLabel": "ClickClack Bot",
					"docsPath": "/channels/clickclack",
					"docsLabel": "clickclack",
					"blurb": "self-hosted chat via first-class ClickClack bot tokens.",
					"systemImage": "bubble.left.and.bubble.right",
					"markdownCapable": true,
					"preferSessionLookupForAnnounceTarget": true,
					"order": 85,
					"commands": {
						"nativeCommandsAutoEnabled": false,
						"nativeSkillsAutoEnabled": false
					},
					"setup": { "fields": [
						{
							"key": "code",
							"kind": "string",
							"sensitive": true,
							"cli": {
								"flags": "--code <code>",
								"description": "ClickClack one-time setup code or setup URL"
							}
						},
						{
							"key": "token",
							"kind": "string",
							"sensitive": true,
							"cli": {
								"flags": "--token <token>",
								"description": "ClickClack bot token"
							}
						},
						{
							"key": "tokenFile",
							"kind": "string",
							"sensitive": true,
							"cli": {
								"flags": "--token-file <path>",
								"description": "ClickClack bot token file"
							}
						},
						{
							"key": "baseUrl",
							"kind": "string",
							"cli": {
								"flags": "--base-url <url>",
								"description": "ClickClack API base URL"
							}
						},
						{
							"key": "workspace",
							"kind": "string",
							"cli": {
								"flags": "--workspace <workspace>",
								"description": "ClickClack workspace id, slug, or name"
							}
						},
						{
							"key": "defaultTo",
							"kind": "string",
							"cli": {
								"flags": "--default-to <target>",
								"description": "Default ClickClack target"
							}
						},
						{
							"key": "allowFrom",
							"kind": "string-list",
							"cli": {
								"flags": "--allow-from <ids>",
								"description": "Allowed ClickClack senders"
							}
						},
						{
							"key": "agentActivity",
							"kind": "boolean",
							"cli": {
								"flags": "--agent-activity",
								"description": "Enable ClickClack agent activity"
							}
						},
						{
							"key": "useEnv",
							"kind": "boolean",
							"cli": {
								"flags": "--use-env",
								"description": "Use CLICKCLACK_BOT_TOKEN"
							},
							"envVars": ["CLICKCLACK_BOT_TOKEN"]
						}
					] }
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
			"version": "2026.9.6",
			"description": "OpenClaw Discord channel plugin for channels, DMs, commands, and app events.",
			"source": "official",
			"kind": "channel",
			"openclaw": {
				"contracts": { "transcriptSourceProviders": ["discord-voice"] },
				"channel": {
					"id": "discord",
					"configuredState": { "env": { "anyOf": ["DISCORD_BOT_TOKEN"] } },
					"approvalFlags": ["native"],
					"label": "Discord",
					"selectionLabel": "Discord (Bot API)",
					"detailLabel": "Discord Bot",
					"docsPath": "/channels/discord",
					"docsLabel": "discord",
					"blurb": "very well supported right now.",
					"systemImage": "bubble.left.and.bubble.right",
					"markdownCapable": true,
					"preferSessionLookupForAnnounceTarget": true,
					"setup": { "fields": [{
						"key": "token",
						"kind": "string",
						"sensitive": true,
						"cli": {
							"flags": "--token <token>",
							"description": "Discord bot token"
						}
					}, {
						"key": "useEnv",
						"kind": "boolean",
						"cli": {
							"flags": "--use-env",
							"description": "Use DISCORD_BOT_TOKEN"
						},
						"envVars": ["DISCORD_BOT_TOKEN"]
					}] },
					"commands": {
						"nativeCommandsAutoEnabled": true,
						"nativeSkillsAutoEnabled": true
					},
					"doctorCapabilities": {
						"dmAllowFromMode": "topOnly",
						"groupModel": "route",
						"groupAllowFromFallbackToAllowFrom": false,
						"warnOnEmptyGroupSenderAllowlist": false
					}
				},
				"install": {
					"clawhubSpec": "clawhub:@openclaw/discord",
					"npmSpec": "@openclaw/discord",
					"defaultChoice": "npm",
					"minHostVersion": ">=2026.5.26",
					"allowInvalidConfigRecovery": true
				}
			}
		},
		{
			"name": "@openclaw/feishu",
			"version": "2026.9.6",
			"description": "OpenClaw Feishu/Lark channel plugin for chats and workplace tools (community maintained by @m1heng).",
			"source": "official",
			"kind": "channel",
			"openclaw": {
				"contracts": { "tools": [
					"feishu_app_scopes",
					"feishu_bitable_create_app",
					"feishu_bitable_create_field",
					"feishu_bitable_create_record",
					"feishu_bitable_get_meta",
					"feishu_bitable_get_record",
					"feishu_bitable_list_fields",
					"feishu_bitable_list_records",
					"feishu_bitable_update_record",
					"feishu_chat",
					"feishu_doc",
					"feishu_drive",
					"feishu_perm",
					"feishu_wiki"
				] },
				"channel": {
					"id": "feishu",
					"configuredState": {
						"env": { "anyOf": [
							"FEISHU_APP_ID",
							"FEISHU_APP_SECRET",
							"FEISHU_VERIFICATION_TOKEN",
							"FEISHU_ENCRYPT_KEY"
						] },
						"specifier": "./configured-state",
						"exportName": "hasConfiguredFeishuChannelState"
					},
					"label": "Feishu",
					"selectionLabel": "Feishu/Lark (飞书)",
					"docsPath": "/channels/feishu",
					"docsLabel": "feishu",
					"blurb": "飞书/Lark enterprise messaging with doc/wiki/drive tools.",
					"aliases": ["lark"],
					"order": 35,
					"quickstartAllowFrom": true,
					"setup": { "fields": [] }
				},
				"install": {
					"clawhubSpec": "clawhub:@openclaw/feishu",
					"npmSpec": "@openclaw/feishu",
					"defaultChoice": "npm",
					"minHostVersion": ">=2026.5.29"
				}
			}
		},
		{
			"name": "@openclaw/googlechat",
			"version": "2026.9.6",
			"description": "OpenClaw Google Chat channel plugin for spaces and direct messages.",
			"source": "official",
			"kind": "channel",
			"openclaw": {
				"channel": {
					"id": "googlechat",
					"configuredState": { "env": { "anyOf": ["GOOGLE_CHAT_SERVICE_ACCOUNT", "GOOGLE_CHAT_SERVICE_ACCOUNT_FILE"] } },
					"approvalFlags": ["native"],
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
						"dmAllowFromMode": "topOnly",
						"groupModel": "route",
						"groupAllowFromFallbackToAllowFrom": false,
						"warnOnEmptyGroupSenderAllowlist": false
					},
					"setup": { "fields": [
						{
							"key": "token",
							"kind": "string",
							"sensitive": true,
							"cli": {
								"flags": "--token <json>",
								"description": "Google Chat service account JSON"
							}
						},
						{
							"key": "tokenFile",
							"kind": "string",
							"sensitive": true,
							"cli": {
								"flags": "--token-file <path>",
								"description": "Google Chat service account file"
							}
						},
						{
							"key": "audienceType",
							"kind": "choice",
							"choices": ["app-url", "project-number"],
							"cli": {
								"flags": "--audience-type <type>",
								"description": "Google Chat audience type"
							}
						},
						{
							"key": "audience",
							"kind": "string",
							"cli": {
								"flags": "--audience <value>",
								"description": "Google Chat audience value"
							}
						},
						{
							"key": "webhookPath",
							"kind": "string",
							"cli": {
								"flags": "--webhook-path <path>",
								"description": "Google Chat webhook path"
							}
						},
						{
							"key": "webhookUrl",
							"kind": "string",
							"cli": {
								"flags": "--webhook-url <url>",
								"description": "Google Chat webhook URL"
							}
						},
						{
							"key": "useEnv",
							"kind": "boolean",
							"cli": {
								"flags": "--use-env",
								"description": "Use Google Chat environment credentials"
							},
							"envVars": ["GOOGLE_CHAT_SERVICE_ACCOUNT", "GOOGLE_CHAT_SERVICE_ACCOUNT_FILE"],
							"envVarMode": "any"
						}
					] }
				},
				"install": {
					"clawhubSpec": "clawhub:@openclaw/googlechat",
					"npmSpec": "@openclaw/googlechat",
					"defaultChoice": "npm",
					"minHostVersion": ">=2026.4.10"
				}
			}
		},
		{
			"name": "@openclaw/imessage",
			"version": "2026.9.6",
			"description": "OpenClaw iMessage channel plugin using imsg on a signed-in Mac",
			"source": "official",
			"kind": "channel",
			"openclaw": {
				"channel": {
					"id": "imessage",
					"approvalFlags": ["native"],
					"label": "iMessage",
					"selectionLabel": "iMessage (imsg)",
					"detailLabel": "iMessage",
					"docsPath": "/channels/imessage",
					"docsLabel": "imessage",
					"blurb": "Local iMessage/SMS through the imsg bridge, including private API message actions when enabled.",
					"aliases": ["imsg"],
					"systemImage": "message.fill",
					"setup": { "fields": [
						{
							"key": "cliPath",
							"kind": "string",
							"cli": {
								"flags": "--cli-path <path>",
								"description": "iMessage CLI path"
							}
						},
						{
							"key": "dbPath",
							"kind": "string",
							"cli": {
								"flags": "--db-path <path>",
								"description": "iMessage database path"
							}
						},
						{
							"key": "service",
							"kind": "choice",
							"choices": [
								"imessage",
								"sms",
								"auto"
							],
							"cli": {
								"flags": "--service <service>",
								"description": "iMessage service"
							}
						},
						{
							"key": "region",
							"kind": "string",
							"cli": {
								"flags": "--region <region>",
								"description": "SMS region"
							}
						}
					] }
				},
				"install": {
					"clawhubSpec": "clawhub:@openclaw/imessage",
					"npmSpec": "@openclaw/imessage",
					"defaultChoice": "npm",
					"minHostVersion": ">=2026.7.2",
					"allowInvalidConfigRecovery": true
				}
			}
		},
		{
			"name": "@openclaw/irc",
			"version": "2026.9.6",
			"description": "OpenClaw IRC channel plugin",
			"source": "official",
			"kind": "channel",
			"openclaw": {
				"channel": {
					"id": "irc",
					"configuredState": { "env": { "allOf": ["IRC_HOST", "IRC_NICK"] } },
					"label": "IRC",
					"selectionLabel": "IRC (Server + Nick)",
					"detailLabel": "IRC",
					"docsPath": "/channels/irc",
					"docsLabel": "irc",
					"blurb": "classic IRC networks with DM/channel routing and pairing controls.",
					"aliases": ["internet-relay-chat"],
					"systemImage": "network",
					"setup": { "fields": [
						{
							"key": "host",
							"kind": "string",
							"cli": {
								"flags": "--host <host>",
								"description": "IRC server host"
							}
						},
						{
							"key": "port",
							"kind": "string",
							"cli": {
								"flags": "--port <port>",
								"description": "IRC server port"
							}
						},
						{
							"key": "tls",
							"kind": "boolean",
							"cli": {
								"flags": "--tls",
								"description": "Use TLS for IRC"
							}
						},
						{
							"key": "nick",
							"kind": "string",
							"cli": {
								"flags": "--nick <nick>",
								"description": "IRC nickname"
							}
						},
						{
							"key": "username",
							"kind": "string",
							"cli": {
								"flags": "--username <name>",
								"description": "IRC username"
							}
						},
						{
							"key": "realname",
							"kind": "string",
							"cli": {
								"flags": "--realname <name>",
								"description": "IRC real name"
							}
						},
						{
							"key": "channels",
							"kind": "string-list",
							"cli": {
								"flags": "--channels <names>",
								"description": "IRC channels"
							}
						},
						{
							"key": "password",
							"kind": "string",
							"sensitive": true,
							"cli": {
								"flags": "--password <password>",
								"description": "IRC server password"
							}
						},
						{
							"key": "useEnv",
							"kind": "boolean",
							"cli": {
								"flags": "--use-env",
								"description": "Use IRC environment configuration"
							},
							"envVars": ["IRC_HOST", "IRC_NICK"]
						}
					] }
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
			"version": "2026.9.6",
			"description": "OpenClaw LINE channel plugin for LINE Bot API chats.",
			"source": "official",
			"kind": "channel",
			"openclaw": {
				"channel": {
					"id": "line",
					"configuredState": { "env": { "allOf": ["LINE_CHANNEL_ACCESS_TOKEN", "LINE_CHANNEL_SECRET"] } },
					"label": "LINE",
					"selectionLabel": "LINE (Messaging API)",
					"detailLabel": "LINE Bot",
					"docsPath": "/channels/line",
					"docsLabel": "line",
					"blurb": "LINE Messaging API webhook bot.",
					"systemImage": "message",
					"order": 75,
					"quickstartAllowFrom": true,
					"doctorCapabilities": {
						"dmAllowFromMode": "topOnly",
						"groupModel": "sender",
						"groupAllowFromFallbackToAllowFrom": false,
						"warnOnEmptyGroupSenderAllowlist": true
					},
					"setup": { "fields": [
						{
							"key": "channelAccessToken",
							"kind": "string",
							"sensitive": true,
							"cli": {
								"flags": "--channel-access-token <token>",
								"description": "LINE channel access token"
							}
						},
						{
							"key": "token",
							"kind": "string",
							"sensitive": true,
							"cli": {
								"flags": "--token <token>",
								"description": "LINE channel access token (alias)"
							}
						},
						{
							"key": "channelSecret",
							"kind": "string",
							"sensitive": true,
							"cli": {
								"flags": "--channel-secret <secret>",
								"description": "LINE channel secret"
							}
						},
						{
							"key": "tokenFile",
							"kind": "string",
							"sensitive": true,
							"cli": {
								"flags": "--token-file <path>",
								"description": "LINE access token file"
							}
						},
						{
							"key": "secretFile",
							"kind": "string",
							"sensitive": true,
							"cli": {
								"flags": "--secret-file <path>",
								"description": "LINE channel secret file"
							}
						},
						{
							"key": "useEnv",
							"kind": "boolean",
							"cli": {
								"flags": "--use-env",
								"description": "Use LINE environment credentials"
							},
							"envVars": ["LINE_CHANNEL_ACCESS_TOKEN", "LINE_CHANNEL_SECRET"]
						}
					] }
				},
				"install": {
					"clawhubSpec": "clawhub:@openclaw/line",
					"npmSpec": "@openclaw/line",
					"defaultChoice": "npm",
					"minHostVersion": ">=2026.4.10"
				}
			}
		},
		{
			"name": "@openclaw/matrix",
			"version": "2026.9.6",
			"description": "OpenClaw Matrix channel plugin for rooms and direct messages.",
			"source": "official",
			"kind": "channel",
			"openclaw": {
				"channel": {
					"id": "matrix",
					"configuredState": { "env": { "anyOf": [
						"MATRIX_HOMESERVER",
						"MATRIX_USER_ID",
						"MATRIX_ACCESS_TOKEN",
						"MATRIX_PASSWORD",
						"MATRIX_DEVICE_ID",
						"MATRIX_DEVICE_NAME",
						"MATRIX_OPS_HOMESERVER",
						"MATRIX_OPS_ACCESS_TOKEN",
						"MATRIX_OPS_DEVICE_ID",
						"MATRIX_OPS_DEVICE_NAME"
					] } },
					"approvalFlags": ["native"],
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
					"setup": { "fields": [
						{
							"key": "homeserver",
							"kind": "string",
							"cli": {
								"flags": "--homeserver <url>",
								"description": "Matrix homeserver URL"
							}
						},
						{
							"key": "userId",
							"kind": "string",
							"cli": {
								"flags": "--user-id <id>",
								"description": "Matrix user id"
							}
						},
						{
							"key": "accessToken",
							"kind": "string",
							"sensitive": true,
							"cli": {
								"flags": "--access-token <token>",
								"description": "Matrix access token"
							}
						},
						{
							"key": "password",
							"kind": "string",
							"sensitive": true,
							"cli": {
								"flags": "--password <password>",
								"description": "Matrix password"
							}
						},
						{
							"key": "deviceName",
							"kind": "string",
							"cli": {
								"flags": "--device-name <name>",
								"description": "Matrix device name"
							}
						},
						{
							"key": "avatarUrl",
							"kind": "string",
							"cli": {
								"flags": "--avatar-url <url>",
								"description": "Matrix avatar URL"
							}
						},
						{
							"key": "initialSyncLimit",
							"kind": "integer",
							"cli": {
								"flags": "--initial-sync-limit <n>",
								"description": "Matrix initial sync room limit"
							}
						},
						{
							"key": "proxy",
							"kind": "string",
							"cli": {
								"flags": "--proxy <url>",
								"description": "Matrix proxy URL"
							}
						},
						{
							"key": "dangerouslyAllowPrivateNetwork",
							"kind": "boolean",
							"cli": {
								"flags": "--dangerously-allow-private-network",
								"description": "Allow private-network Matrix homeservers"
							}
						},
						{
							"key": "useEnv",
							"kind": "boolean",
							"cli": {
								"flags": "--use-env",
								"description": "Use Matrix environment credentials"
							}
						}
					] },
					"persistedAuthState": {
						"specifier": "./auth-presence",
						"exportName": "hasAnyMatrixAuth",
						"backingStore": "plugin-state"
					}
				},
				"install": {
					"clawhubSpec": "clawhub:@openclaw/matrix",
					"npmSpec": "@openclaw/matrix",
					"defaultChoice": "npm",
					"minHostVersion": ">=2026.4.10",
					"allowInvalidConfigRecovery": true
				}
			}
		},
		{
			"name": "@openclaw/mattermost",
			"version": "2026.9.6",
			"description": "OpenClaw Mattermost channel plugin",
			"source": "official",
			"kind": "channel",
			"openclaw": {
				"channel": {
					"id": "mattermost",
					"configuredState": { "env": { "allOf": ["MATTERMOST_BOT_TOKEN", "MATTERMOST_URL"] } },
					"label": "Mattermost",
					"selectionLabel": "Mattermost (plugin)",
					"docsPath": "/channels/mattermost",
					"docsLabel": "mattermost",
					"blurb": "self-hosted Slack-style chat; install the plugin to enable.",
					"order": 65,
					"setup": { "fields": [
						{
							"key": "token",
							"kind": "string",
							"sensitive": true,
							"cli": {
								"flags": "--token <token>",
								"description": "Mattermost bot token"
							}
						},
						{
							"key": "botToken",
							"kind": "string",
							"sensitive": true,
							"cli": {
								"flags": "--bot-token <token>",
								"description": "Mattermost bot token"
							}
						},
						{
							"key": "httpUrl",
							"kind": "string",
							"cli": {
								"flags": "--http-url <url>",
								"description": "Mattermost server URL"
							}
						},
						{
							"key": "useEnv",
							"kind": "boolean",
							"cli": {
								"flags": "--use-env",
								"description": "Use Mattermost environment credentials"
							},
							"envVars": ["MATTERMOST_BOT_TOKEN", "MATTERMOST_URL"]
						}
					] }
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
			"name": "@openclaw/msteams",
			"version": "2026.9.6",
			"description": "OpenClaw Microsoft Teams channel plugin for bot conversations.",
			"source": "official",
			"kind": "channel",
			"openclaw": {
				"channel": {
					"id": "msteams",
					"configuredState": {
						"env": { "anyOf": [
							"MSTEAMS_APP_ID",
							"MSTEAMS_APP_PASSWORD",
							"MSTEAMS_TENANT_ID"
						] },
						"specifier": "./configured-state",
						"exportName": "hasConfiguredMSTeamsChannelState"
					},
					"label": "Microsoft Teams",
					"selectionLabel": "Microsoft Teams (Teams SDK)",
					"docsPath": "/channels/msteams",
					"docsLabel": "msteams",
					"blurb": "Teams SDK; enterprise support.",
					"aliases": ["teams"],
					"order": 60,
					"doctorCapabilities": {
						"dmAllowFromMode": "topOnly",
						"groupModel": "hybrid",
						"groupAllowFromFallbackToAllowFrom": true,
						"warnOnEmptyGroupSenderAllowlist": true
					},
					"setup": { "fields": [] }
				},
				"install": {
					"clawhubSpec": "clawhub:@openclaw/msteams",
					"npmSpec": "@openclaw/msteams",
					"defaultChoice": "npm",
					"minHostVersion": ">=2026.4.10"
				}
			}
		},
		{
			"name": "@openclaw/nextcloud-talk",
			"version": "2026.9.6",
			"description": "OpenClaw Nextcloud Talk channel plugin for conversations.",
			"source": "official",
			"kind": "channel",
			"openclaw": {
				"channel": {
					"id": "nextcloud-talk",
					"configuredState": {
						"env": { "anyOf": ["NEXTCLOUD_TALK_BOT_SECRET", "NEXTCLOUD_TALK_API_PASSWORD"] },
						"specifier": "./configured-state",
						"exportName": "hasConfiguredNextcloudTalkChannelState"
					},
					"label": "Nextcloud Talk",
					"selectionLabel": "Nextcloud Talk (self-hosted)",
					"docsPath": "/channels/nextcloud-talk",
					"docsLabel": "nextcloud-talk",
					"blurb": "Self-hosted chat via Nextcloud Talk webhook bots.",
					"aliases": ["nc-talk", "nc"],
					"order": 65,
					"quickstartAllowFrom": true,
					"setup": { "fields": [
						{
							"key": "baseUrl",
							"kind": "string",
							"cli": {
								"flags": "--base-url <url>",
								"description": "Nextcloud base URL"
							}
						},
						{
							"key": "url",
							"kind": "string",
							"cli": {
								"flags": "--url <url>",
								"description": "Legacy Nextcloud base URL alias"
							}
						},
						{
							"key": "secret",
							"kind": "string",
							"sensitive": true,
							"cli": {
								"flags": "--secret <secret>",
								"description": "Nextcloud Talk bot secret"
							}
						},
						{
							"key": "token",
							"kind": "string",
							"sensitive": true,
							"cli": {
								"flags": "--token <secret>",
								"description": "Legacy Nextcloud bot secret alias"
							}
						},
						{
							"key": "password",
							"kind": "string",
							"sensitive": true,
							"cli": {
								"flags": "--password <secret>",
								"description": "Legacy Nextcloud bot secret alias"
							}
						},
						{
							"key": "secretFile",
							"kind": "string",
							"sensitive": true,
							"cli": {
								"flags": "--secret-file <path>",
								"description": "Nextcloud Talk bot secret file"
							}
						},
						{
							"key": "tokenFile",
							"kind": "string",
							"sensitive": true,
							"cli": {
								"flags": "--token-file <path>",
								"description": "Legacy Nextcloud bot secret file alias"
							}
						},
						{
							"key": "useEnv",
							"kind": "boolean",
							"cli": {
								"flags": "--use-env",
								"description": "Use Nextcloud Talk environment credentials"
							},
							"envVars": ["NEXTCLOUD_TALK_BOT_SECRET"]
						}
					] }
				},
				"install": {
					"clawhubSpec": "clawhub:@openclaw/nextcloud-talk",
					"npmSpec": "@openclaw/nextcloud-talk",
					"defaultChoice": "npm",
					"minHostVersion": ">=2026.4.10"
				}
			}
		},
		{
			"name": "@openclaw/nostr",
			"version": "2026.9.6",
			"description": "OpenClaw Nostr channel plugin for NIP-04 encrypted direct messages.",
			"source": "official",
			"kind": "channel",
			"openclaw": {
				"channel": {
					"id": "nostr",
					"configuredState": { "env": { "anyOf": ["NOSTR_PRIVATE_KEY"] } },
					"label": "Nostr",
					"selectionLabel": "Nostr (NIP-04 DMs)",
					"docsPath": "/channels/nostr",
					"docsLabel": "nostr",
					"blurb": "Decentralized protocol; encrypted DMs via NIP-04.",
					"order": 55,
					"quickstartAllowFrom": true,
					"setup": { "fields": [
						{
							"key": "privateKey",
							"kind": "string",
							"sensitive": true,
							"cli": {
								"flags": "--private-key <key>",
								"description": "Nostr private key"
							}
						},
						{
							"key": "relayUrls",
							"kind": "string",
							"cli": {
								"flags": "--relay-urls <urls>",
								"description": "Nostr relay URLs"
							}
						},
						{
							"key": "useEnv",
							"kind": "boolean",
							"cli": {
								"flags": "--use-env",
								"description": "Use NOSTR_PRIVATE_KEY"
							},
							"envVars": ["NOSTR_PRIVATE_KEY"]
						}
					] }
				},
				"install": {
					"clawhubSpec": "clawhub:@openclaw/nostr",
					"npmSpec": "@openclaw/nostr",
					"defaultChoice": "npm",
					"minHostVersion": ">=2026.4.10"
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
					"npmSpec": "@tencent-weixin/openclaw-weixin@2.4.8",
					"defaultChoice": "npm",
					"expectedIntegrity": "sha512-hhO9prUQwzfSpIL6XGWazRsxNs89K+Mis3iQW6a8eum4AIDxOUiTFMg4nlNVD/au0SjAx5CcJjo3KYWZqGpgQA==",
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
			"name": "@tencent-connect/openclaw-qqbot",
			"description": "OpenClaw QQ Bot channel plugin by the Tencent Connect team.",
			"source": "external",
			"kind": "channel",
			"openclaw": {
				"plugin": {
					"id": "openclaw-qqbot",
					"label": "QQ Bot"
				},
				"setupFeatures": { "configPromotion": "preserve-root" },
				"legacyNpmPackageNames": ["@openclaw/qqbot"],
				"contracts": { "tools": ["qqbot_platform_api", "qqbot_remind"] },
				"channel": {
					"id": "qqbot",
					"label": "QQ Bot",
					"selectionLabel": "QQ Bot (Official API)",
					"detailLabel": "QQ Bot",
					"docsPath": "/channels/qqbot",
					"docsLabel": "qqbot",
					"blurb": "connect to QQ via official QQ Bot API with group chat and direct message support.",
					"envVars": ["QQBOT_APP_ID", "QQBOT_CLIENT_SECRET"],
					"approvalFlags": ["native"],
					"doctorCapabilities": { "openDmRequiresAllowFromWildcard": false },
					"systemImage": "bubble.left.and.bubble.right"
				},
				"channelSecrets": { "fields": [{
					"field": "clientSecret",
					"activationField": "appId",
					"activationEnv": "QQBOT_APP_ID"
				}] },
				"channelHostConfig": {
					"docsSource": "official",
					"compatibilityMigration": "qqbot.tencent-2.0-compatibility",
					"schemaAllOf": [{
						"not": { "required": ["defaultAccount"] },
						"properties": {
							"allowFrom": {
								"type": "array",
								"minItems": 1,
								"items": { "allOf": [{ "not": { "const": "*" } }, { "anyOf": [{ "const": "openclaw:approval-disabled" }, {
									"type": "string",
									"pattern": "^[^a-z]*$"
								}] }] }
							},
							"accounts": {
								"type": "object",
								"not": { "required": ["default"] },
								"additionalProperties": {
									"type": "object",
									"properties": { "allowFrom": {
										"type": "array",
										"minItems": 1,
										"items": { "allOf": [{ "not": { "const": "*" } }, { "anyOf": [{ "const": "openclaw:approval-disabled" }, {
											"type": "string",
											"pattern": "^[^a-z]*$"
										}] }] }
									} },
									"required": ["allowFrom"]
								}
							}
						},
						"required": ["allowFrom"]
					}]
				},
				"channelConfigs": { "qqbot": {
					"label": "QQ Bot",
					"description": "QQ Bot API conversation channel.",
					"preferOver": ["qqbot"],
					"schema": {
						"type": "object",
						"additionalProperties": true,
						"properties": {
							"appId": { "type": "string" },
							"clientSecret": { "type": "string" }
						}
					}
				} },
				"install": {
					"npmSpec": "@tencent-connect/openclaw-qqbot@2.0.3",
					"defaultChoice": "npm",
					"expectedIntegrity": "sha512-yngu/2cPeZjJfIfHWCXWB2/6KlDHrb9vpOUjKLdQxePLSp6wCn3CFOALcBIVq/9o6jlYz9WTU9idW6nfX1xpFA=="
				}
			}
		},
		{
			"name": "@openclaw/raft",
			"version": "2026.9.6",
			"description": "OpenClaw Raft channel plugin for Raft CLI wake bridges.",
			"source": "official",
			"kind": "channel",
			"openclaw": {
				"channelConfigs": { "raft": {
					"label": "Raft",
					"description": "Raft External Agent CLI wake bridge."
				} },
				"channel": {
					"id": "raft",
					"configuredState": { "env": { "anyOf": ["RAFT_PROFILE"] } },
					"label": "Raft",
					"selectionLabel": "Raft (CLI wake bridge)",
					"docsPath": "/channels/raft",
					"docsLabel": "raft",
					"blurb": "Raft CLI wake bridge for human and agent collaboration.",
					"order": 72,
					"setup": { "fields": [{
						"key": "profile",
						"kind": "string",
						"cli": {
							"flags": "--profile <profile>",
							"description": "Raft CLI profile"
						}
					}] }
				},
				"install": {
					"clawhubSpec": "clawhub:@openclaw/raft",
					"npmSpec": "@openclaw/raft",
					"defaultChoice": "npm",
					"minHostVersion": ">=2026.6.8"
				}
			}
		},
		{
			"name": "@openclaw/signal",
			"version": "2026.9.6",
			"description": "OpenClaw Signal channel plugin",
			"source": "official",
			"kind": "channel",
			"openclaw": {
				"channel": {
					"id": "signal",
					"approvalFlags": ["native"],
					"label": "Signal",
					"selectionLabel": "Signal (signal-cli)",
					"detailLabel": "Signal REST",
					"docsPath": "/channels/signal",
					"docsLabel": "signal",
					"blurb": "signal-cli linked device with additional setup for the local REST bridge.",
					"systemImage": "antenna.radiowaves.left.and.right",
					"markdownCapable": true,
					"setup": { "fields": [
						{
							"key": "signalNumber",
							"kind": "string",
							"cli": {
								"flags": "--signal-number <e164>",
								"description": "Signal account number (E.164)"
							}
						},
						{
							"key": "signalTransport",
							"kind": "choice",
							"choices": ["external-native", "container"],
							"cli": {
								"flags": "--signal-transport <kind>",
								"description": "Signal HTTP transport (external-native or container)"
							}
						},
						{
							"key": "cliPath",
							"kind": "string",
							"cli": {
								"flags": "--cli-path <path>",
								"description": "signal-cli executable path"
							}
						},
						{
							"key": "httpUrl",
							"kind": "string",
							"cli": {
								"flags": "--http-url <url>",
								"description": "Signal HTTP service URL"
							}
						},
						{
							"key": "httpHost",
							"kind": "string",
							"cli": {
								"flags": "--http-host <host>",
								"description": "Signal HTTP daemon host"
							}
						},
						{
							"key": "httpPort",
							"kind": "string",
							"cli": {
								"flags": "--http-port <port>",
								"description": "Signal HTTP daemon port"
							}
						}
					] }
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
			"version": "2026.9.6",
			"description": "OpenClaw Slack channel plugin for channels, DMs, commands, and app events.",
			"source": "official",
			"kind": "channel",
			"openclaw": {
				"channelConfigs": { "slack": {
					"label": "Slack",
					"description": "Slack channel, DM, command, and app event integration."
				} },
				"channel": {
					"id": "slack",
					"configuredState": {
						"env": { "anyOf": [
							"SLACK_BOT_TOKEN",
							"SLACK_APP_TOKEN",
							"SLACK_USER_TOKEN"
						] },
						"specifier": "./configured-state",
						"exportName": "hasConfiguredSlackChannelState"
					},
					"approvalFlags": ["native"],
					"label": "Slack",
					"selectionLabel": "Slack (Socket Mode)",
					"detailLabel": "Slack Bot",
					"docsPath": "/channels/slack",
					"docsLabel": "slack",
					"blurb": "supported (Socket Mode).",
					"systemImage": "number",
					"markdownCapable": true,
					"doctorCapabilities": {
						"dmAllowFromMode": "topOnly",
						"groupModel": "route",
						"groupAllowFromFallbackToAllowFrom": false,
						"warnOnEmptyGroupSenderAllowlist": false
					},
					"commands": {
						"nativeCommandsAutoEnabled": false,
						"nativeSkillsAutoEnabled": false
					},
					"setup": { "fields": [
						{
							"key": "botToken",
							"kind": "string",
							"sensitive": true,
							"cli": {
								"flags": "--bot-token <token>",
								"description": "Slack bot token"
							}
						},
						{
							"key": "appToken",
							"kind": "string",
							"sensitive": true,
							"cli": {
								"flags": "--app-token <token>",
								"description": "Slack app token"
							}
						},
						{
							"key": "userToken",
							"kind": "string",
							"sensitive": true,
							"cli": {
								"flags": "--user-token <token>",
								"description": "Slack user token"
							}
						},
						{
							"key": "signingSecret",
							"kind": "string",
							"sensitive": true,
							"cli": {
								"flags": "--signing-secret <secret>",
								"description": "Slack signing secret"
							}
						},
						{
							"key": "identity",
							"kind": "choice",
							"choices": ["bot", "user"],
							"cli": {
								"flags": "--identity <kind>",
								"description": "Slack identity"
							}
						},
						{
							"key": "mode",
							"kind": "choice",
							"choices": ["socket", "http"],
							"cli": {
								"flags": "--mode <mode>",
								"description": "Slack connection mode"
							}
						},
						{
							"key": "useEnv",
							"kind": "boolean",
							"cli": {
								"flags": "--use-env",
								"description": "Use Slack environment credentials"
							},
							"envVars": ["SLACK_BOT_TOKEN"]
						}
					] }
				},
				"install": {
					"clawhubSpec": "clawhub:@openclaw/slack",
					"npmSpec": "@openclaw/slack",
					"defaultChoice": "npm",
					"minHostVersion": ">=2026.5.28",
					"allowInvalidConfigRecovery": true
				}
			}
		},
		{
			"name": "@openclaw/sms",
			"version": "2026.9.6",
			"description": "OpenClaw SMS/MMS channel plugin for Twilio messages.",
			"source": "official",
			"kind": "channel",
			"openclaw": {
				"channel": {
					"id": "sms",
					"configuredState": {
						"env": { "anyOf": [
							"TWILIO_ACCOUNT_SID",
							"TWILIO_AUTH_TOKEN",
							"TWILIO_PHONE_NUMBER",
							"TWILIO_SMS_FROM",
							"TWILIO_MESSAGING_SERVICE_SID"
						] },
						"specifier": "./configured-state",
						"exportName": "hasConfiguredSmsChannelState"
					},
					"label": "SMS",
					"selectionLabel": "SMS (Twilio)",
					"detailLabel": "Twilio SMS/MMS",
					"docsPath": "/channels/sms",
					"docsLabel": "sms",
					"blurb": "Twilio-backed SMS/MMS with inbound webhooks and outbound replies.",
					"order": 88,
					"quickstartAllowFrom": true,
					"setup": { "fields": [
						{
							"key": "accountSid",
							"kind": "string",
							"sensitive": true,
							"cli": {
								"flags": "--account-sid <sid>",
								"description": "Twilio account SID"
							}
						},
						{
							"key": "authToken",
							"kind": "string",
							"sensitive": true,
							"cli": {
								"flags": "--auth-token <token>",
								"description": "Twilio auth token"
							}
						},
						{
							"key": "fromNumber",
							"kind": "string",
							"cli": {
								"flags": "--from-number <e164>",
								"description": "Twilio sender phone number"
							}
						},
						{
							"key": "messagingServiceSid",
							"kind": "string",
							"cli": {
								"flags": "--messaging-service-sid <sid>",
								"description": "Twilio Messaging Service SID"
							}
						},
						{
							"key": "defaultTo",
							"kind": "string",
							"cli": {
								"flags": "--default-to <e164>",
								"description": "Default SMS recipient"
							}
						},
						{
							"key": "webhookPath",
							"kind": "string",
							"cli": {
								"flags": "--webhook-path <path>",
								"description": "SMS webhook path"
							}
						},
						{
							"key": "publicWebhookUrl",
							"kind": "string",
							"cli": {
								"flags": "--public-webhook-url <url>",
								"description": "Public SMS webhook URL"
							}
						},
						{
							"key": "dmPolicy",
							"kind": "choice",
							"choices": [
								"pairing",
								"allowlist",
								"open",
								"disabled"
							],
							"cli": {
								"flags": "--dm-policy <policy>",
								"description": "SMS DM policy"
							}
						},
						{
							"key": "allowFrom",
							"kind": "string-list",
							"cli": {
								"flags": "--allow-from <numbers>",
								"description": "Allowed SMS senders"
							}
						}
					] }
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
			"version": "2026.9.6",
			"description": "Synology Chat channel plugin for OpenClaw channels and direct messages.",
			"source": "official",
			"kind": "channel",
			"openclaw": {
				"channel": {
					"id": "synology-chat",
					"configuredState": { "env": { "allOf": ["SYNOLOGY_CHAT_TOKEN", "SYNOLOGY_CHAT_INCOMING_URL"] } },
					"label": "Synology Chat",
					"selectionLabel": "Synology Chat (Webhook)",
					"docsPath": "/channels/synology-chat",
					"docsLabel": "synology-chat",
					"blurb": "Connect your Synology NAS Chat to OpenClaw with full agent capabilities.",
					"order": 90,
					"setup": { "fields": [
						{
							"key": "token",
							"kind": "string",
							"sensitive": true,
							"cli": {
								"flags": "--token <token>",
								"description": "Synology Chat token"
							}
						},
						{
							"key": "url",
							"kind": "string",
							"sensitive": true,
							"cli": {
								"flags": "--url <url>",
								"description": "Synology Chat webhook URL"
							}
						},
						{
							"key": "webhookUrl",
							"kind": "string",
							"sensitive": true,
							"cli": {
								"flags": "--webhook-url <url>",
								"description": "Public HTTPS Synology Chat callback URL used for attachments"
							}
						},
						{
							"key": "webhookPath",
							"kind": "string",
							"cli": {
								"flags": "--webhook-path <path>",
								"description": "Synology Chat webhook path"
							}
						},
						{
							"key": "useEnv",
							"kind": "boolean",
							"cli": {
								"flags": "--use-env",
								"description": "Use Synology Chat environment credentials"
							},
							"envVars": ["SYNOLOGY_CHAT_TOKEN"]
						}
					] }
				},
				"install": {
					"clawhubSpec": "clawhub:@openclaw/synology-chat",
					"npmSpec": "@openclaw/synology-chat",
					"defaultChoice": "npm",
					"minHostVersion": ">=2026.4.10"
				}
			}
		},
		{
			"name": "@openclaw/tlon",
			"version": "2026.9.6",
			"description": "OpenClaw Tlon/Urbit channel plugin for chat workflows.",
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
					"quickstartAllowFrom": true,
					"setup": { "fields": [
						{
							"key": "ship",
							"kind": "string",
							"cli": {
								"flags": "--ship <ship>",
								"description": "Tlon ship"
							}
						},
						{
							"key": "url",
							"kind": "string",
							"cli": {
								"flags": "--url <url>",
								"description": "Tlon URL"
							}
						},
						{
							"key": "code",
							"kind": "string",
							"sensitive": true,
							"cli": {
								"flags": "--code <code>",
								"description": "Tlon login code"
							}
						},
						{
							"key": "dangerouslyAllowPrivateNetwork",
							"kind": "boolean",
							"cli": {
								"flags": "--dangerously-allow-private-network",
								"description": "Allow private-network Tlon URLs"
							}
						},
						{
							"key": "groupChannels",
							"kind": "string-list",
							"cli": {
								"flags": "--group-channels <list>",
								"description": "Tlon group channels"
							}
						},
						{
							"key": "dmAllowlist",
							"kind": "string-list",
							"cli": {
								"flags": "--dm-allowlist <list>",
								"description": "Tlon DM allowlist"
							}
						},
						{
							"key": "autoDiscoverChannels",
							"kind": "boolean",
							"cli": {
								"flags": "--auto-discover-channels",
								"negatedFlags": "--no-auto-discover-channels",
								"description": "Auto-discover Tlon group channels"
							}
						},
						{
							"key": "ownerShip",
							"kind": "string",
							"cli": {
								"flags": "--owner-ship <ship>",
								"description": "Tlon owner ship"
							}
						}
					] }
				},
				"install": {
					"clawhubSpec": "clawhub:@openclaw/tlon",
					"npmSpec": "@openclaw/tlon",
					"defaultChoice": "npm",
					"minHostVersion": ">=2026.4.10"
				}
			}
		},
		{
			"name": "@openclaw/twitch",
			"version": "2026.9.6",
			"description": "OpenClaw Twitch channel plugin for chat and moderation workflows.",
			"source": "official",
			"kind": "channel",
			"openclaw": {
				"channel": {
					"id": "twitch",
					"configuredState": { "env": { "anyOf": ["OPENCLAW_TWITCH_ACCESS_TOKEN"] } },
					"label": "Twitch",
					"selectionLabel": "Twitch (Chat)",
					"docsPath": "/channels/twitch",
					"blurb": "Twitch chat integration",
					"aliases": ["twitch-chat"],
					"setup": { "fields": [] }
				},
				"install": {
					"clawhubSpec": "clawhub:@openclaw/twitch",
					"npmSpec": "@openclaw/twitch",
					"defaultChoice": "npm",
					"minHostVersion": ">=2026.4.10"
				}
			}
		},
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
					"docsPath": "/channels/wecom",
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
					"npmSpec": "@wecom/wecom-openclaw-plugin@2026.7.2",
					"defaultChoice": "npm",
					"expectedIntegrity": "sha512-7kqdBIOF3SgDDoBoFtO6jxnxofbYSgbKdxZDNabD0y0jg2xKcVqlXZOOJ9+XQho/QOtIFrnRH2IRnPukFEYwJg=="
				}
			}
		},
		{
			"name": "@openclaw/whatsapp",
			"version": "2026.9.6",
			"description": "OpenClaw WhatsApp channel plugin for WhatsApp Web chats.",
			"source": "official",
			"kind": "channel",
			"openclaw": {
				"contracts": { "tools": ["whatsapp_call", "whatsapp_login"] },
				"channel": {
					"id": "whatsapp",
					"approvalFlags": ["native"],
					"label": "WhatsApp",
					"selectionLabel": "WhatsApp (QR link)",
					"detailLabel": "WhatsApp Web",
					"docsPath": "/channels/whatsapp",
					"docsLabel": "whatsapp",
					"blurb": "works with your own number; recommend a separate phone + eSIM.",
					"systemImage": "message",
					"persistedAuthState": {
						"specifier": "./auth-presence",
						"exportName": "hasAnyWhatsAppAuth"
					},
					"setup": { "fields": [{
						"key": "authDir",
						"kind": "string",
						"cli": {
							"flags": "--auth-dir <path>",
							"description": "WhatsApp auth directory override"
						}
					}] }
				},
				"install": {
					"clawhubSpec": "clawhub:@openclaw/whatsapp",
					"npmSpec": "@openclaw/whatsapp",
					"defaultChoice": "npm",
					"minHostVersion": ">=2026.4.25"
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
					"docsPath": "/channels/yuanbao",
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
					"npmSpec": "openclaw-plugin-yuanbao@2.18.2",
					"defaultChoice": "npm",
					"expectedIntegrity": "sha512-cL85zWLePhi/GWRsXL8ogS4tejNuCE/J0V/OYhDFJzElF2TmndVCUAXaJdssgv/ULJ9sBaic88wAzRllIgZIwA=="
				}
			}
		},
		{
			"name": "@openclaw/zalo",
			"version": "2026.9.6",
			"description": "OpenClaw Zalo channel plugin for bot and webhook chats.",
			"source": "official",
			"kind": "channel",
			"openclaw": {
				"channel": {
					"id": "zalo",
					"configuredState": { "env": { "anyOf": ["ZALO_BOT_TOKEN"] } },
					"label": "Zalo",
					"selectionLabel": "Zalo (Bot API)",
					"docsPath": "/channels/zalo",
					"docsLabel": "zalo",
					"blurb": "Vietnam-focused messaging platform with Bot API.",
					"aliases": ["zl"],
					"order": 80,
					"quickstartAllowFrom": true,
					"setup": { "fields": [
						{
							"key": "token",
							"kind": "string",
							"sensitive": true,
							"cli": {
								"flags": "--token <token>",
								"description": "Zalo bot token"
							}
						},
						{
							"key": "tokenFile",
							"kind": "string",
							"sensitive": true,
							"cli": {
								"flags": "--token-file <path>",
								"description": "Zalo bot token file"
							}
						},
						{
							"key": "useEnv",
							"kind": "boolean",
							"cli": {
								"flags": "--use-env",
								"description": "Use ZALO_BOT_TOKEN"
							},
							"envVars": ["ZALO_BOT_TOKEN"]
						}
					] }
				},
				"install": {
					"clawhubSpec": "clawhub:@openclaw/zalo",
					"npmSpec": "@openclaw/zalo",
					"defaultChoice": "npm",
					"minHostVersion": ">=2026.4.10"
				}
			}
		},
		{
			"name": "@openclaw/zalouser",
			"version": "2026.9.6",
			"description": "OpenClaw Zalo Personal Account plugin via native zca-js integration.",
			"source": "official",
			"kind": "channel",
			"openclaw": {
				"contracts": { "tools": ["zalouser"] },
				"channel": {
					"id": "zalouser",
					"configuredState": { "env": { "anyOf": ["ZALOUSER_PROFILE", "ZCA_PROFILE"] } },
					"label": "Zalo Personal",
					"selectionLabel": "Zalo (Personal Account)",
					"docsPath": "/channels/zalouser",
					"docsLabel": "zalouser",
					"blurb": "Zalo personal account via QR code login.",
					"aliases": ["zlu"],
					"order": 85,
					"quickstartAllowFrom": false,
					"doctorCapabilities": {
						"dmAllowFromMode": "topOnly",
						"groupModel": "hybrid",
						"groupAllowFromFallbackToAllowFrom": false,
						"warnOnEmptyGroupSenderAllowlist": false
					},
					"setup": { "fields": [] }
				},
				"install": {
					"clawhubSpec": "clawhub:@openclaw/zalouser",
					"npmSpec": "@openclaw/zalouser",
					"defaultChoice": "npm",
					"minHostVersion": ">=2026.4.10"
				}
			}
		}
	] },
	{ entries: [
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
					"clawhubSpec": "clawhub:@openclaw/amazon-bedrock-provider",
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
					"clawhubSpec": "clawhub:@openclaw/amazon-bedrock-mantle-provider",
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
					"clawhubSpec": "clawhub:@openclaw/anthropic-vertex-provider",
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
			"name": "@openclaw/baseten-provider",
			"description": "OpenClaw Baseten provider plugin.",
			"source": "official",
			"kind": "provider",
			"openclaw": {
				"plugin": {
					"id": "baseten",
					"label": "Baseten"
				},
				"providers": [{
					"id": "baseten",
					"name": "Baseten",
					"docs": "/providers/baseten",
					"categories": ["cloud", "llm"],
					"envVars": ["BASETEN_API_KEY"],
					"authChoices": [{
						"method": "api-key",
						"choiceId": "baseten-api-key",
						"choiceLabel": "Baseten API key",
						"groupId": "baseten",
						"groupLabel": "Baseten",
						"groupHint": "Hosted Model APIs, including Inkling",
						"optionKey": "basetenApiKey",
						"cliFlag": "--baseten-api-key",
						"cliOption": "--baseten-api-key <key>",
						"cliDescription": "Baseten API key",
						"onboardingScopes": ["text-inference"]
					}]
				}],
				"install": {
					"clawhubSpec": "clawhub:@openclaw/baseten-provider",
					"npmSpec": "@openclaw/baseten-provider",
					"defaultChoice": "npm",
					"minHostVersion": ">=2026.7.2"
				}
			}
		},
		{
			"name": "@openclaw/byteplus-provider",
			"description": "OpenClaw BytePlus provider plugin.",
			"source": "official",
			"kind": "provider",
			"openclaw": {
				"plugin": {
					"id": "byteplus",
					"label": "BytePlus"
				},
				"providers": [{
					"id": "byteplus",
					"aliases": ["byteplus-plan"],
					"name": "BytePlus",
					"docs": "/concepts/model-providers#byteplus-international",
					"categories": ["cloud", "llm"],
					"envVars": ["BYTEPLUS_API_KEY"],
					"authChoices": [{
						"method": "api-key",
						"choiceId": "byteplus-api-key",
						"choiceLabel": "BytePlus API key",
						"groupId": "byteplus",
						"groupLabel": "BytePlus",
						"groupHint": "API key",
						"optionKey": "byteplusApiKey",
						"cliFlag": "--byteplus-api-key",
						"cliOption": "--byteplus-api-key <key>",
						"cliDescription": "BytePlus API key",
						"onboardingScopes": ["text-inference"]
					}]
				}],
				"contracts": { "videoGenerationProviders": ["byteplus"] },
				"install": {
					"clawhubSpec": "clawhub:@openclaw/byteplus-provider",
					"npmSpec": "@openclaw/byteplus-provider",
					"defaultChoice": "npm",
					"minHostVersion": ">=2026.7.2"
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
			"name": "@openclaw/comfy-provider",
			"description": "OpenClaw ComfyUI provider plugin.",
			"source": "official",
			"kind": "provider",
			"openclaw": {
				"plugin": {
					"id": "comfy",
					"label": "ComfyUI"
				},
				"providers": [{
					"id": "comfy",
					"name": "ComfyUI",
					"docs": "/providers/comfy",
					"categories": [
						"local",
						"cloud",
						"media"
					],
					"envVars": ["COMFY_API_KEY", "COMFY_CLOUD_API_KEY"],
					"authChoices": [{
						"method": "cloud-api-key",
						"choiceId": "comfy-cloud-api-key",
						"choiceLabel": "Comfy Cloud API key",
						"choiceHint": "Required for cloud workflows",
						"groupId": "comfy",
						"groupLabel": "ComfyUI",
						"groupHint": "Local or cloud workflows",
						"optionKey": "comfyApiKey",
						"cliFlag": "--comfy-api-key",
						"cliOption": "--comfy-api-key <key>",
						"cliDescription": "Comfy Cloud API key",
						"onboardingScopes": ["image-generation"]
					}]
				}],
				"contracts": {
					"imageGenerationProviders": ["comfy"],
					"musicGenerationProviders": ["comfy"],
					"videoGenerationProviders": ["comfy"]
				},
				"install": {
					"clawhubSpec": "clawhub:@openclaw/comfy-provider",
					"npmSpec": "@openclaw/comfy-provider",
					"defaultChoice": "npm",
					"minHostVersion": ">=2026.7.2"
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
					"embeddingProviders": ["deepinfra"],
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
			"name": "@openclaw/mistral-provider",
			"description": "OpenClaw Mistral provider plugin",
			"source": "official",
			"kind": "provider",
			"openclaw": {
				"plugin": {
					"id": "mistral",
					"label": "Mistral"
				},
				"providerEndpoints": [{
					"endpointClass": "mistral-public",
					"hosts": ["api.mistral.ai"]
				}],
				"providers": [{
					"id": "mistral",
					"name": "Mistral",
					"docs": "/providers/mistral",
					"categories": ["cloud", "llm"],
					"envVars": ["MISTRAL_API_KEY"],
					"authChoices": [{
						"method": "api-key",
						"choiceId": "mistral-api-key",
						"choiceLabel": "Mistral API key",
						"groupId": "mistral",
						"groupLabel": "Mistral AI",
						"groupHint": "API key",
						"optionKey": "mistralApiKey",
						"cliFlag": "--mistral-api-key",
						"cliOption": "--mistral-api-key <key>",
						"cliDescription": "Mistral API key",
						"onboardingScopes": ["text-inference"]
					}]
				}],
				"contracts": {
					"embeddingProviders": ["mistral"],
					"mediaUnderstandingProviders": ["mistral"],
					"realtimeTranscriptionProviders": ["mistral"]
				},
				"install": {
					"clawhubSpec": "clawhub:@openclaw/mistral-provider",
					"npmSpec": "@openclaw/mistral-provider",
					"defaultChoice": "npm",
					"minHostVersion": ">=2026.7.2"
				}
			}
		},
		{
			"name": "@openclaw/novita-provider",
			"description": "OpenClaw NovitaAI provider plugin",
			"source": "official",
			"kind": "provider",
			"openclaw": {
				"plugin": {
					"id": "novita",
					"label": "NovitaAI"
				},
				"providerEndpoints": [{
					"endpointClass": "novita-native",
					"hosts": ["api.novita.ai"]
				}],
				"providers": [{
					"id": "novita",
					"aliases": ["novita-ai", "novitaai"],
					"name": "NovitaAI",
					"docs": "/providers/novita",
					"categories": ["cloud", "llm"],
					"envVars": ["NOVITA_API_KEY"],
					"authChoices": [{
						"method": "api-key",
						"choiceId": "novita-api-key",
						"choiceLabel": "NovitaAI API key",
						"choiceHint": "OpenAI-compatible NovitaAI endpoint",
						"groupId": "novita",
						"groupLabel": "NovitaAI",
						"groupHint": "OpenAI-compatible NovitaAI endpoint",
						"optionKey": "novitaApiKey",
						"cliFlag": "--novita-api-key",
						"cliOption": "--novita-api-key <key>",
						"cliDescription": "NovitaAI API key",
						"onboardingScopes": ["text-inference"]
					}]
				}],
				"install": {
					"clawhubSpec": "clawhub:@openclaw/novita-provider",
					"npmSpec": "@openclaw/novita-provider",
					"defaultChoice": "npm",
					"minHostVersion": ">=2026.7.2"
				}
			}
		},
		{
			"name": "@openclaw/opencode-provider",
			"description": "OpenClaw OpenCode Zen provider plugin",
			"source": "official",
			"kind": "provider",
			"openclaw": {
				"plugin": {
					"id": "opencode",
					"label": "OpenCode Zen"
				},
				"providerEndpoints": [{
					"endpointClass": "opencode-native",
					"baseUrls": ["https://opencode.ai/zen", "https://opencode.ai/zen/v1"]
				}],
				"providers": [{
					"id": "opencode",
					"name": "OpenCode Zen",
					"docs": "/providers/opencode",
					"categories": ["cloud", "llm"],
					"envVars": ["OPENCODE_API_KEY", "OPENCODE_ZEN_API_KEY"],
					"authChoices": [{
						"method": "api-key",
						"choiceId": "opencode-zen",
						"choiceLabel": "OpenCode Zen catalog",
						"groupId": "opencode",
						"groupLabel": "OpenCode",
						"groupHint": "Shared API key for Zen + Go catalogs",
						"optionKey": "opencodeZenApiKey",
						"cliFlag": "--opencode-zen-api-key",
						"cliOption": "--opencode-zen-api-key <key>",
						"cliDescription": "OpenCode API key (Zen catalog)",
						"onboardingScopes": ["text-inference"]
					}]
				}],
				"contracts": { "mediaUnderstandingProviders": ["opencode"] },
				"install": {
					"clawhubSpec": "clawhub:@openclaw/opencode-provider",
					"npmSpec": "@openclaw/opencode-provider",
					"defaultChoice": "npm",
					"minHostVersion": ">=2026.7.2"
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
			"name": "@openclaw/opencode-go-provider",
			"description": "OpenClaw OpenCode Go provider plugin",
			"source": "official",
			"kind": "provider",
			"openclaw": {
				"plugin": {
					"id": "opencode-go",
					"label": "OpenCode Go"
				},
				"providerEndpoints": [{
					"endpointClass": "opencode-go-native",
					"baseUrls": ["https://opencode.ai/zen/go", "https://opencode.ai/zen/go/v1"]
				}],
				"providers": [{
					"id": "opencode-go",
					"name": "OpenCode Go",
					"docs": "/providers/opencode-go",
					"categories": ["cloud", "llm"],
					"envVars": ["OPENCODE_API_KEY", "OPENCODE_ZEN_API_KEY"],
					"authChoices": [{
						"method": "api-key",
						"choiceId": "opencode-go",
						"choiceLabel": "OpenCode Go catalog",
						"groupId": "opencode",
						"groupLabel": "OpenCode",
						"groupHint": "Shared API key for Zen + Go catalogs",
						"optionKey": "opencodeGoApiKey",
						"cliFlag": "--opencode-go-api-key",
						"cliOption": "--opencode-go-api-key <key>",
						"cliDescription": "OpenCode API key (Go catalog)",
						"onboardingScopes": ["text-inference"]
					}]
				}],
				"contracts": { "mediaUnderstandingProviders": ["opencode-go"] },
				"install": {
					"clawhubSpec": "clawhub:@openclaw/opencode-go-provider",
					"npmSpec": "@openclaw/opencode-go-provider",
					"defaultChoice": "npm",
					"minHostVersion": ">=2026.7.2"
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
					"clawhubSpec": "clawhub:@openclaw/pixverse-provider",
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
						"https://dashscope-intl.aliyuncs.com/compatible-mode/v1",
						"https://token-plan.ap-southeast-1.maas.aliyuncs.com/compatible-mode/v1",
						"https://token-plan.cn-beijing.maas.aliyuncs.com/compatible-mode/v1"
					]
				}],
				"providers": [
					{
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
					},
					{
						"id": "qwen-token-plan",
						"name": "Qwen Token Plan",
						"docs": "/providers/qwen",
						"categories": ["cloud", "llm"],
						"envVars": ["QWEN_TOKEN_PLAN_API_KEY"],
						"authChoices": [{
							"method": "api-key",
							"choiceId": "qwen-token-plan",
							"choiceLabel": "Qwen Token Plan (Global/Intl)",
							"choiceHint": "Endpoint: token-plan.ap-southeast-1.maas.aliyuncs.com",
							"groupId": "qwen",
							"groupLabel": "Qwen Cloud",
							"groupHint": "Standard / Coding Plan / Token Plan",
							"optionKey": "qwenTokenPlanApiKey",
							"cliFlag": "--qwen-token-plan-api-key",
							"cliOption": "--qwen-token-plan-api-key <key>",
							"cliDescription": "Qwen Token Plan API key (Global/Intl)",
							"onboardingScopes": ["text-inference"]
						}, {
							"method": "api-key-cn",
							"choiceId": "qwen-token-plan-cn",
							"choiceLabel": "Qwen Token Plan (China)",
							"choiceHint": "Endpoint: token-plan.cn-beijing.maas.aliyuncs.com",
							"groupId": "qwen",
							"groupLabel": "Qwen Cloud",
							"groupHint": "Standard / Coding Plan / Token Plan",
							"optionKey": "qwenTokenPlanApiKeyCn",
							"cliFlag": "--qwen-token-plan-api-key-cn",
							"cliOption": "--qwen-token-plan-api-key-cn <key>",
							"cliDescription": "Qwen Token Plan API key (China)",
							"onboardingScopes": ["text-inference"]
						}]
					},
					{
						"id": "bailian-token-plan",
						"name": "Alibaba Token Plan (legacy custom config)",
						"docs": "/providers/qwen",
						"categories": ["cloud", "llm"]
					}
				],
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
			"name": "@openclaw/radius-provider",
			"description": "OpenClaw Radius model gateway provider plugin.",
			"source": "official",
			"kind": "provider",
			"openclaw": {
				"plugin": {
					"id": "radius",
					"label": "Radius"
				},
				"providers": [{
					"id": "radius",
					"name": "Radius",
					"docs": "/providers/radius",
					"categories": ["cloud", "llm"],
					"envVars": ["RADIUS_API_KEY"],
					"authChoices": [{
						"method": "oauth",
						"choiceId": "radius",
						"choiceLabel": "Radius (browser sign-in)",
						"groupId": "radius",
						"groupLabel": "Radius",
						"groupHint": "Browser sign-in or API key",
						"onboardingScopes": ["text-inference"]
					}, {
						"method": "api-key",
						"choiceId": "radius-api-key",
						"choiceLabel": "Radius API key",
						"groupId": "radius",
						"groupLabel": "Radius",
						"groupHint": "Browser sign-in or API key",
						"optionKey": "radiusApiKey",
						"cliFlag": "--radius-api-key",
						"cliOption": "--radius-api-key <key>",
						"cliDescription": "Radius organization API key",
						"onboardingScopes": ["text-inference"]
					}]
				}],
				"install": {
					"clawhubSpec": "clawhub:@openclaw/radius-provider",
					"npmSpec": "@openclaw/radius-provider",
					"defaultChoice": "npm",
					"minHostVersion": ">=2026.9.4"
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
			"name": "@openclaw/vydra-provider",
			"description": "OpenClaw Vydra media provider plugin.",
			"source": "official",
			"kind": "provider",
			"openclaw": {
				"plugin": {
					"id": "vydra",
					"label": "Vydra"
				},
				"providers": [{
					"id": "vydra",
					"name": "Vydra",
					"docs": "/providers/vydra",
					"categories": ["cloud", "media"],
					"envVars": ["VYDRA_API_KEY"],
					"authChoices": [{
						"method": "api-key",
						"choiceId": "vydra-api-key",
						"choiceLabel": "Vydra API key",
						"groupId": "vydra",
						"groupLabel": "Vydra",
						"groupHint": "Image, video, and speech",
						"optionKey": "vydraApiKey",
						"cliFlag": "--vydra-api-key",
						"cliOption": "--vydra-api-key <key>",
						"cliDescription": "Vydra API key",
						"onboardingScopes": ["image-generation"]
					}]
				}],
				"contracts": {
					"speechProviders": ["vydra"],
					"imageGenerationProviders": ["vydra"],
					"videoGenerationProviders": ["vydra"]
				},
				"install": {
					"clawhubSpec": "clawhub:@openclaw/vydra-provider",
					"npmSpec": "@openclaw/vydra-provider",
					"defaultChoice": "npm",
					"minHostVersion": ">=2026.7.2"
				}
			}
		},
		{
			"name": "@openclaw/xiaomi-provider",
			"description": "OpenClaw Xiaomi provider plugin.",
			"source": "official",
			"kind": "provider",
			"openclaw": {
				"plugin": {
					"id": "xiaomi",
					"label": "Xiaomi"
				},
				"providerEndpoints": [{
					"endpointClass": "xiaomi-native",
					"hosts": [
						"api.xiaomimimo.com",
						"token-plan-ams.xiaomimimo.com",
						"token-plan-cn.xiaomimimo.com",
						"token-plan-sgp.xiaomimimo.com"
					]
				}],
				"providers": [{
					"id": "xiaomi",
					"name": "Xiaomi",
					"docs": "/providers/xiaomi",
					"categories": ["cloud", "llm"],
					"envVars": ["XIAOMI_API_KEY"],
					"authChoices": [{
						"method": "api-key",
						"choiceId": "xiaomi-api-key",
						"choiceLabel": "Xiaomi API key (Pay-as-you-go)",
						"choiceHint": "Endpoint: api.xiaomimimo.com/v1",
						"groupId": "xiaomi",
						"groupLabel": "Xiaomi",
						"groupHint": "Pay-as-you-go / Token Plan",
						"optionKey": "xiaomiApiKey",
						"cliFlag": "--xiaomi-api-key",
						"cliOption": "--xiaomi-api-key <key>",
						"cliDescription": "Xiaomi MiMo pay-as-you-go API key",
						"onboardingScopes": ["text-inference"]
					}]
				}, {
					"id": "xiaomi-token-plan",
					"name": "Xiaomi Token Plan",
					"docs": "/providers/xiaomi",
					"categories": ["cloud", "llm"],
					"envVars": ["XIAOMI_TOKEN_PLAN_API_KEY"],
					"authChoices": [
						{
							"method": "token-plan-ams",
							"choiceId": "xiaomi-token-plan-ams",
							"choiceLabel": "Xiaomi Token Plan (Europe)",
							"choiceHint": "Endpoint preset: token-plan-ams.xiaomimimo.com/v1",
							"groupId": "xiaomi",
							"groupLabel": "Xiaomi",
							"groupHint": "Pay-as-you-go / Token Plan",
							"optionKey": "xiaomiTokenPlanApiKey",
							"cliFlag": "--xiaomi-token-plan-api-key",
							"cliOption": "--xiaomi-token-plan-api-key <key>",
							"cliDescription": "Xiaomi MiMo Token Plan API key",
							"onboardingScopes": ["text-inference"]
						},
						{
							"method": "token-plan-cn",
							"choiceId": "xiaomi-token-plan-cn",
							"choiceLabel": "Xiaomi Token Plan (China)",
							"choiceHint": "Endpoint preset: token-plan-cn.xiaomimimo.com/v1",
							"groupId": "xiaomi",
							"groupLabel": "Xiaomi",
							"groupHint": "Pay-as-you-go / Token Plan",
							"optionKey": "xiaomiTokenPlanApiKey",
							"cliFlag": "--xiaomi-token-plan-api-key",
							"cliOption": "--xiaomi-token-plan-api-key <key>",
							"cliDescription": "Xiaomi MiMo Token Plan API key",
							"onboardingScopes": ["text-inference"]
						},
						{
							"method": "token-plan-sgp",
							"choiceId": "xiaomi-token-plan-sgp",
							"choiceLabel": "Xiaomi Token Plan (Singapore)",
							"choiceHint": "Endpoint preset: token-plan-sgp.xiaomimimo.com/v1",
							"groupId": "xiaomi",
							"groupLabel": "Xiaomi",
							"groupHint": "Pay-as-you-go / Token Plan",
							"optionKey": "xiaomiTokenPlanApiKey",
							"cliFlag": "--xiaomi-token-plan-api-key",
							"cliOption": "--xiaomi-token-plan-api-key <key>",
							"cliDescription": "Xiaomi MiMo Token Plan API key",
							"onboardingScopes": ["text-inference"]
						}
					]
				}],
				"contracts": {
					"speechProviders": ["xiaomi"],
					"usageProviders": ["xiaomi", "xiaomi-token-plan"]
				},
				"install": {
					"clawhubSpec": "clawhub:@openclaw/xiaomi-provider",
					"npmSpec": "@openclaw/xiaomi-provider",
					"defaultChoice": "npm",
					"minHostVersion": ">=2026.7.2"
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
					"hosts": ["api.z.ai", "open.bigmodel.cn"]
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
			"name": "@openclaw/synthetic-provider",
			"description": "OpenClaw Synthetic provider plugin.",
			"source": "official",
			"kind": "provider",
			"openclaw": {
				"plugin": {
					"id": "synthetic",
					"label": "Synthetic"
				},
				"providers": [{
					"id": "synthetic",
					"name": "Synthetic",
					"docs": "/providers/synthetic",
					"categories": ["cloud", "llm"],
					"envVars": ["SYNTHETIC_API_KEY"],
					"authChoices": [{
						"method": "api-key",
						"choiceId": "synthetic-api-key",
						"choiceLabel": "Synthetic API key",
						"groupId": "synthetic",
						"groupLabel": "Synthetic",
						"groupHint": "Anthropic-compatible (multi-model)",
						"optionKey": "syntheticApiKey",
						"cliFlag": "--synthetic-api-key",
						"cliOption": "--synthetic-api-key <key>",
						"cliDescription": "Synthetic API key",
						"onboardingScopes": ["text-inference"]
					}]
				}],
				"install": {
					"clawhubSpec": "clawhub:@openclaw/synthetic-provider",
					"npmSpec": "@openclaw/synthetic-provider",
					"defaultChoice": "npm",
					"minHostVersion": ">=2026.7.2"
				}
			}
		},
		{
			"name": "@openclaw/voyage-provider",
			"description": "OpenClaw Voyage embedding provider plugin.",
			"source": "official",
			"kind": "provider",
			"openclaw": {
				"plugin": {
					"id": "voyage",
					"label": "Voyage"
				},
				"providers": [{
					"id": "voyage",
					"name": "Voyage",
					"docs": "/reference/memory-config",
					"categories": ["cloud"],
					"envVars": ["VOYAGE_API_KEY"]
				}],
				"contracts": { "embeddingProviders": ["voyage"] },
				"install": {
					"clawhubSpec": "clawhub:@openclaw/voyage-provider",
					"npmSpec": "@openclaw/voyage-provider",
					"defaultChoice": "npm",
					"minHostVersion": ">=2026.7.2"
				}
			}
		},
		{
			"name": "@openclaw/volcengine-provider",
			"description": "OpenClaw Volcengine provider plugin.",
			"source": "official",
			"kind": "provider",
			"openclaw": {
				"plugin": {
					"id": "volcengine",
					"label": "Volcengine"
				},
				"providers": [{
					"id": "volcengine",
					"aliases": ["volcengine-plan"],
					"name": "Volcengine",
					"docs": "/providers/volcengine",
					"categories": ["cloud", "llm"],
					"envVars": ["VOLCANO_ENGINE_API_KEY"],
					"authChoices": [{
						"method": "api-key",
						"choiceId": "volcengine-api-key",
						"choiceLabel": "Volcano Engine API key",
						"groupId": "volcengine",
						"groupLabel": "Volcano Engine",
						"groupHint": "API key",
						"optionKey": "volcengineApiKey",
						"cliFlag": "--volcengine-api-key",
						"cliOption": "--volcengine-api-key <key>",
						"cliDescription": "Volcano Engine API key",
						"onboardingScopes": ["text-inference"]
					}]
				}, {
					"id": "volcengine-plan",
					"name": "Volcengine Plan",
					"docs": "/providers/volcengine",
					"categories": ["cloud", "llm"],
					"envVars": ["VOLCANO_ENGINE_API_KEY"]
				}],
				"contracts": { "speechProviders": ["volcengine"] },
				"install": {
					"clawhubSpec": "clawhub:@openclaw/volcengine-provider",
					"npmSpec": "@openclaw/volcengine-provider",
					"defaultChoice": "npm",
					"minHostVersion": ">=2026.7.2"
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
	] },
	{
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
						"clawhubSpec": "clawhub:@openclaw/acpx",
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
						"clawhubSpec": "clawhub:@openclaw/brave-plugin",
						"npmSpec": "@openclaw/brave-plugin",
						"defaultChoice": "npm",
						"minHostVersion": ">=2026.4.10",
						"allowInvalidConfigRecovery": true
					}
				}
			},
			{
				"name": "@openclaw/codex",
				"description": "OpenClaw Codex app-server harness and native session catalog",
				"source": "official",
				"kind": "plugin",
				"openclaw": {
					"plugin": {
						"id": "codex",
						"label": "Codex"
					},
					"contracts": { "migrationProviders": ["codex"] },
					"install": {
						"clawhubSpec": "clawhub:@openclaw/codex",
						"npmSpec": "@openclaw/codex",
						"defaultChoice": "npm",
						"minHostVersion": ">=2026.5.1-beta.1"
					},
					"setup": { "nativeSessionCatalog": {
						"label": "Codex",
						"legacyDefaultEnabled": true,
						"description": "Existing native Codex conversations on this Gateway and eligible paired nodes.",
						"nodeCommands": [
							"codex.appServer.threads.list.v1",
							"codex.appServer.thread.turns.list.v1",
							"codex.sessionCatalog.transcript.read.v1",
							"codex.terminal.resume.v1",
							"codex.cli.sessions.list"
						]
					} }
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
					"catalog": {
						"featured": true,
						"order": 40
					},
					"install": {
						"clawhubSpec": "clawhub:@openclaw/diffs",
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
				"name": "@openclaw/duckduckgo-plugin",
				"description": "OpenClaw DuckDuckGo plugin.",
				"source": "official",
				"kind": "plugin",
				"openclaw": {
					"plugin": {
						"id": "duckduckgo",
						"label": "DuckDuckGo"
					},
					"contracts": { "webSearchProviders": ["duckduckgo"] },
					"webSearchProviders": [{
						"id": "duckduckgo",
						"label": "DuckDuckGo Search (experimental)",
						"hint": "Free web search fallback with no API key required",
						"onboardingScopes": ["text-inference"],
						"requiresCredential": false,
						"envVars": [],
						"placeholder": "(no key needed)",
						"signupUrl": "https://duckduckgo.com/",
						"docsUrl": "https://docs.openclaw.ai/tools/duckduckgo-search",
						"credentialPath": "",
						"autoDetectOrder": 100
					}],
					"install": {
						"clawhubSpec": "clawhub:@openclaw/duckduckgo-plugin",
						"npmSpec": "@openclaw/duckduckgo-plugin",
						"defaultChoice": "npm",
						"minHostVersion": ">=2026.7.2"
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
				"name": "@openclaw/facetime",
				"description": "Experimental OpenClaw FaceTime realtime voice carrier",
				"source": "official",
				"kind": "plugin",
				"openclaw": {
					"plugin": {
						"id": "facetime",
						"label": "FaceTime"
					},
					"contracts": { "tools": ["facetime_call"] },
					"install": {
						"clawhubSpec": "clawhub:@openclaw/facetime",
						"npmSpec": "@openclaw/facetime",
						"defaultChoice": "npm",
						"minHostVersion": ">=2026.9.4",
						"allowInvalidConfigRecovery": true
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
						"webSearchProviders": ["firecrawl", "firecrawl-free"],
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
					}, {
						"id": "firecrawl-free",
						"label": "Firecrawl Search (Free)",
						"hint": "Free web search via Firecrawl's hosted starter tier — no API key required",
						"onboardingScopes": ["text-inference"],
						"requiresCredential": false,
						"envVars": [],
						"placeholder": "(no key needed)",
						"signupUrl": "https://www.firecrawl.dev/",
						"docsUrl": "https://docs.openclaw.ai/tools/firecrawl",
						"credentialPath": ""
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
				"name": "@openclaw/fish-audio-speech",
				"description": "OpenClaw Fish Audio speech plugin.",
				"source": "official",
				"kind": "plugin",
				"openclaw": {
					"legacyPluginIds": ["fish-audio"],
					"plugin": {
						"id": "fish-audio-speech",
						"label": "Fish Audio Speech"
					},
					"install": {
						"clawhubSpec": "clawhub:@openclaw/fish-audio-speech",
						"npmSpec": "@openclaw/fish-audio-speech",
						"defaultChoice": "npm",
						"minHostVersion": ">=2026.7.2"
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
						"clawhubSpec": "clawhub:@openclaw/google-meet",
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
					"catalog": {
						"featured": true,
						"order": 50
					},
					"install": {
						"clawhubSpec": "clawhub:@openclaw/lobster",
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
					"catalog": {
						"featured": true,
						"order": 70
					},
					"install": {
						"clawhubSpec": "clawhub:@openclaw/memory-lancedb",
						"npmSpec": "@openclaw/memory-lancedb",
						"defaultChoice": "npm",
						"minHostVersion": ">=2026.5.31"
					}
				}
			},
			{
				"name": "@openclaw/llama-cpp-provider",
				"description": "OpenClaw managed llama.cpp server provider plugin",
				"source": "official",
				"kind": "plugin",
				"openclaw": {
					"plugin": {
						"id": "llama-cpp",
						"label": "llama.cpp Provider"
					},
					"contracts": { "embeddingProviders": ["local"] },
					"install": {
						"clawhubSpec": "clawhub:@openclaw/llama-cpp-provider",
						"npmSpec": "@openclaw/llama-cpp-provider",
						"defaultChoice": "npm",
						"minHostVersion": ">=2026.6.2"
					}
				}
			},
			{
				"name": "@openclaw/mxc-sandbox",
				"description": "OpenClaw MXC sandbox execution plugin for MXC-capable hosts",
				"source": "official",
				"kind": "plugin",
				"openclaw": {
					"plugin": {
						"id": "mxc",
						"label": "MXC Sandbox Execution"
					},
					"install": {
						"clawhubSpec": "clawhub:@openclaw/mxc-sandbox",
						"npmSpec": "@openclaw/mxc-sandbox",
						"defaultChoice": "npm",
						"minHostVersion": ">=2026.6.11"
					}
				}
			},
			{
				"name": "@openclaw/onnx",
				"description": "Local ONNX decision models for OpenClaw",
				"source": "official",
				"kind": "plugin",
				"openclaw": {
					"plugin": {
						"id": "onnx",
						"label": "ONNX"
					},
					"install": {
						"clawhubSpec": "clawhub:@openclaw/onnx",
						"npmSpec": "@openclaw/onnx",
						"defaultChoice": "npm",
						"minHostVersion": ">=2026.9.6"
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
						"clawhubSpec": "clawhub:@openclaw/openshell-sandbox",
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
				"name": "@openclaw/team-reports",
				"description": "OpenClaw team activity reports plugin (GitHub org + Discord activity with model summaries)",
				"source": "official",
				"kind": "plugin",
				"openclaw": {
					"plugin": {
						"id": "team-reports",
						"label": "Team Reports"
					},
					"install": {
						"clawhubSpec": "clawhub:@openclaw/team-reports",
						"npmSpec": "@openclaw/team-reports",
						"defaultChoice": "npm",
						"minHostVersion": ">=2026.9.2"
					}
				}
			},
			{
				"name": "@openclaw/teams-meetings",
				"description": "OpenClaw Microsoft Teams browser meeting participant plugin.",
				"source": "official",
				"kind": "plugin",
				"openclaw": {
					"plugin": {
						"id": "teams-meetings",
						"label": "Microsoft Teams meetings"
					},
					"contracts": {
						"tools": ["teams_meetings"],
						"transcriptSourceProviders": ["teams"]
					},
					"install": {
						"clawhubSpec": "clawhub:@openclaw/teams-meetings",
						"npmSpec": "@openclaw/teams-meetings",
						"defaultChoice": "npm",
						"minHostVersion": ">=2026.7.2"
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
					"catalog": {
						"featured": true,
						"order": 60
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
				"name": "@openclaw/typesafe",
				"description": "OpenClaw TypeSafe typed decisions and optional evaluation tool",
				"source": "official",
				"kind": "plugin",
				"openclaw": {
					"plugin": {
						"id": "typesafe",
						"label": "TypeSafe AI"
					},
					"install": {
						"clawhubSpec": "clawhub:@openclaw/typesafe",
						"npmSpec": "@openclaw/typesafe",
						"defaultChoice": "npm",
						"minHostVersion": ">=2026.9.6"
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
						"clawhubSpec": "clawhub:@openclaw/voice-call",
						"npmSpec": "@openclaw/voice-call",
						"defaultChoice": "npm",
						"minHostVersion": ">=2026.4.10"
					}
				}
			},
			{
				"name": "@openclaw/zoom-meetings",
				"description": "OpenClaw Zoom browser meeting participant plugin.",
				"source": "official",
				"kind": "plugin",
				"openclaw": {
					"plugin": {
						"id": "zoom-meetings",
						"label": "Zoom meetings"
					},
					"contracts": {
						"tools": ["zoom_meetings"],
						"transcriptSourceProviders": ["zoom"]
					},
					"install": {
						"clawhubSpec": "clawhub:@openclaw/zoom-meetings",
						"npmSpec": "@openclaw/zoom-meetings",
						"defaultChoice": "npm",
						"minHostVersion": ">=2026.7.2"
					}
				}
			}
		]
	}
].flatMap((source) => source.entries.filter((entry) => isRecord(entry)));
//#endregion
//#region src/infra/npm-registry-spec.ts
const OPENCLAW_RELEASE_PREFIX_RE = /^\d{4}\./;
const DIST_TAG_RE = /^[A-Za-z0-9][A-Za-z0-9._-]*$/;
function parseRegistryNpmSpecInternal(rawSpec) {
	const spec = rawSpec.trim();
	if (!spec) return {
		ok: false,
		error: "missing npm spec"
	};
	if (/\s/.test(spec)) return {
		ok: false,
		error: "unsupported npm spec: whitespace is not allowed"
	};
	if (spec.includes("://")) return {
		ok: false,
		error: "unsupported npm spec: URLs are not allowed"
	};
	if (spec.includes("#")) return {
		ok: false,
		error: "unsupported npm spec: git refs are not allowed"
	};
	if (spec.includes(":")) return {
		ok: false,
		error: "unsupported npm spec: protocol specs are not allowed"
	};
	const at = spec.lastIndexOf("@");
	const hasSelector = at > 0;
	const name = hasSelector ? spec.slice(0, at) : spec;
	const selector = hasSelector ? spec.slice(at + 1) : "";
	if (!(name.startsWith("@") ? /^@[a-z0-9][a-z0-9-._~]*\/[a-z0-9][a-z0-9-._~]*$/.test(name) : /^[a-z0-9][a-z0-9-._~]*$/.test(name))) return {
		ok: false,
		error: "unsupported npm spec: expected <name> or <name>@<version> from the npm registry"
	};
	if (!hasSelector) return {
		ok: true,
		parsed: {
			name,
			raw: spec,
			selectorKind: "none",
			selectorIsPrerelease: false
		}
	};
	if (!selector) return {
		ok: false,
		error: "unsupported npm spec: missing version/tag after @"
	};
	if (/[\\/]/.test(selector)) return {
		ok: false,
		error: "unsupported npm spec: invalid version/tag"
	};
	const exactVersion = valid(selector);
	if (exactVersion) return {
		ok: true,
		parsed: {
			name,
			raw: spec,
			selector,
			selectorKind: "exact-version",
			selectorIsPrerelease: prerelease(exactVersion) !== null && !isOpenClawStableCorrectionVersion(selector)
		}
	};
	if (!DIST_TAG_RE.test(selector)) return {
		ok: false,
		error: "unsupported npm spec: use an exact version or dist-tag (ranges are not allowed)"
	};
	return {
		ok: true,
		parsed: {
			name,
			raw: spec,
			selector,
			selectorKind: "tag",
			selectorIsPrerelease: false
		}
	};
}
/** Parses a registry-only npm package spec into package name and optional selector metadata. */
function parseRegistryNpmSpec(rawSpec) {
	const parsed = parseRegistryNpmSpecInternal(rawSpec);
	return parsed.ok ? parsed.parsed : null;
}
/** Parses OpenClaw's monthly patch stable/alpha/beta/correction version format. */
function parseOpenClawReleaseVersion(value) {
	const trimmed = value.trim();
	const parsed = OPENCLAW_RELEASE_PREFIX_RE.test(trimmed) ? parse(trimmed) : null;
	if (!parsed || parsed.build.length > 0) return null;
	if (parsed.minor < 1 || parsed.minor > 12 || parsed.patch < 1) return null;
	const [label, sequence] = parsed.prerelease;
	const isStable = parsed.prerelease.length === 0;
	const isCorrection = isOpenClawCorrectionSemver(parsed) && typeof label === "number" && label > 0;
	const isAlpha = parsed.prerelease.length === 2 && label === "alpha" && typeof sequence === "number" && sequence > 0;
	const isBeta = parsed.prerelease.length === 2 && label === "beta" && typeof sequence === "number" && sequence > 0;
	if (!isStable && !isCorrection && !isAlpha && !isBeta) return null;
	return parsed;
}
/** Returns whether a version is an OpenClaw monthly patch stable correction release. */
function isOpenClawStableCorrectionVersion(value) {
	const parsed = parseOpenClawReleaseVersion(value);
	return parsed !== null && isOpenClawCorrectionSemver(parsed);
}
/** Returns whether an exact semver value is a prerelease, excluding stable correction releases. */
function isPrereleaseSemverVersion(value) {
	const trimmed = value.trim();
	return prerelease(trimmed) !== null && !isOpenClawStableCorrectionVersion(trimmed);
}
/**
* Enforces explicit opt-in before an npm spec may resolve to a prerelease.
* Bare specs and `latest` stay on stable releases unless the resolved version
* is an OpenClaw stable correction.
*/
function isPrereleaseResolutionAllowed(params) {
	if (!params.resolvedVersion || !isPrereleaseSemverVersion(params.resolvedVersion)) return true;
	if (params.spec.selectorKind === "none") return false;
	if (params.spec.selectorKind === "exact-version") return params.spec.selectorIsPrerelease;
	return normalizeLowercaseStringOrEmpty(params.spec.selector) !== "latest";
}
//#endregion
//#region src/plugins/plugin-install-default-choice.ts
function normalizePluginInstallDefaultChoice(value) {
	return value === "clawhub" || value === "npm" || value === "local" ? value : void 0;
}
//#endregion
//#region src/infra/clawhub-integrity.ts
/** Normalizes ClawHub SHA-256 metadata into Subresource Integrity format. */
function normalizeClawHubSha256Integrity(value) {
	const trimmed = value.trim();
	if (!trimmed) return null;
	const prefixedBase64 = /^sha256-([A-Za-z0-9+/]+={0,1})$/.exec(trimmed);
	if (prefixedBase64?.[1]) {
		try {
			const decoded = Buffer.from(prefixedBase64[1], "base64");
			if (decoded.length === 32) return `sha256-${decoded.toString("base64")}`;
		} catch {
			return null;
		}
		return null;
	}
	const prefixedHex = /^sha256:([A-Fa-f0-9]{64})$/.exec(trimmed);
	if (prefixedHex?.[1]) return `sha256-${Buffer.from(prefixedHex[1], "hex").toString("base64")}`;
	if (/^[A-Fa-f0-9]{64}$/.test(trimmed)) return `sha256-${Buffer.from(trimmed, "hex").toString("base64")}`;
	return null;
}
//#endregion
//#region src/plugins/official-external-plugin-catalog.ts
/** Reads official external plugin/channel/provider catalogs into manifest-like metadata. */
function getFeedEntryInstallCandidates(entry) {
	if (normalizeOptionalString(entry.state) !== "available") return [];
	if (normalizeOptionalString(entry.publisher?.trust) !== "official") return [];
	return getFeedEntryInstallCandidateRecords(entry);
}
const BUNDLED_CATALOG_SOURCE_REFS = new Set(Object.keys(DEFAULT_OFFICIAL_EXTERNAL_PLUGIN_CATALOG_PROFILE_CONFIG.sources ?? {}));
function* bundledOfficialExternalPluginCatalogEntries() {
	const seen = /* @__PURE__ */ new Set();
	for (const entry of BUNDLED_OFFICIAL_EXTERNAL_PLUGIN_CATALOG_ENTRIES) {
		const candidates = (isRecord(entry.install) ? entry.install : void 0)?.candidates;
		if (Array.isArray(candidates) && candidates.some((candidate) => {
			if (!isRecord(candidate)) return false;
			return !hasKnownCatalogSourceRef(candidate, BUNDLED_CATALOG_SOURCE_REFS);
		})) continue;
		const key = resolveOfficialExternalPluginCatalogEntryKey(entry);
		if (key && !seen.has(key)) {
			seen.add(key);
			yield entry;
		}
	}
}
function findBundledOfficialExternalPluginCatalogEntry(matches) {
	for (const entry of bundledOfficialExternalPluginCatalogEntries()) if (matches(entry)) return entry;
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
function resolveFeedEntryInstallSources(params) {
	const candidates = getFeedEntryInstallCandidates(params.entry);
	return ["npm", "clawhub"].flatMap((source) => {
		const candidate = candidates.find((entry) => getFeedEntryCandidateSourceType(entry, params.catalogConfig) === source && Boolean(normalizeOptionalString(entry.package)));
		const spec = candidate && formatFeedInstallCandidateSpec(candidate);
		if (!candidate || !spec) return [];
		const expectedIntegrity = source === "npm" ? normalizeNpmExpectedIntegrity(candidate.integrity) : normalizeClawHubSha256ExpectedIntegrity(candidate.integrity);
		return [{
			source,
			spec: source === "clawhub" ? `clawhub:${spec}` : spec,
			...expectedIntegrity ? { expectedIntegrity } : {}
		}];
	});
}
function resolveFeedEntryInstallCandidate(params) {
	const source = resolveFeedEntryInstallSources(params)[0];
	return source ? {
		...source.source === "npm" ? { npmSpec: source.spec } : { clawhubSpec: source.spec },
		defaultChoice: source.source,
		...source.expectedIntegrity ? { expectedIntegrity: source.expectedIntegrity } : {}
	} : null;
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
/** Returns legacy plugin ids used only for trusted update migrations. */
function resolveOfficialExternalPluginLegacyIds(entry) {
	return uniqueStrings((getOfficialExternalPluginCatalogManifest(entry)?.legacyPluginIds ?? []).map((pluginId) => normalizeOptionalString(pluginId)).filter((pluginId) => Boolean(pluginId)));
}
function resolveOfficialExternalPluginInstall(entry, params) {
	const state = normalizeOptionalString(entry.state);
	const publisherTrust = normalizeOptionalString(entry.publisher?.trust);
	if ((state || publisherTrust) && (state !== "available" || publisherTrust !== "official")) return null;
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
		...install?.allowInvalidConfigRecovery === true ? { allowInvalidConfigRecovery: true } : {}
	};
	const hasFeedInstallCandidates = getFeedEntryInstallCandidateRecords(entry).length > 0;
	const npmSpec = manifestNpmSpec ?? (hasFeedInstallCandidates || clawhubSpec ? void 0 : normalizeOptionalString(entry.name));
	const defaultChoice = normalizePluginInstallDefaultChoice(install?.defaultChoice) ?? (npmSpec ? "npm" : clawhubSpec ? "clawhub" : localPath ? "local" : void 0);
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
function listOfficialExternalPluginCatalogEntries() {
	return [...bundledOfficialExternalPluginCatalogEntries()];
}
function getOfficialExternalPluginCatalogEntryForPackage(packageName) {
	const normalized = packageName?.trim();
	if (!normalized) return;
	return findBundledOfficialExternalPluginCatalogEntry((entry) => normalizeOptionalString(entry.name) === normalized);
}
//#endregion
export { isPrereleaseResolutionAllowed as a, resolveOfficialExternalPluginLegacyIds as i, listOfficialExternalPluginCatalogEntries as n, parseRegistryNpmSpec as o, resolveOfficialExternalPluginInstall as r, BUNDLED_OFFICIAL_EXTERNAL_PLUGIN_CATALOG_ENTRIES as s, getOfficialExternalPluginCatalogEntryForPackage as t };
