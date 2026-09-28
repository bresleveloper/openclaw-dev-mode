import { Q as resolveFeishuToolAccount, Z as resolveAnyEnabledFeishuToolsConfig, gt as authorizeFeishuChatMemberRead, ht as assertFeishuChatReadAllowed, jt as resolveFeishuChatType, q as feishuExternalToolResult, rt as formatFeishuApiError, xt as resolveFeishuChatReadPreliminaryAuthorization } from "./reply-delivery-result-CRIHpSze.mjs";
import { r as createFeishuClient } from "./client-DCwNVFZg.mjs";
import { optionalPositiveIntegerSchema } from "openclaw/plugin-sdk/channel-actions";
import { readPositiveIntegerParam } from "openclaw/plugin-sdk/param-readers";
import { Type } from "typebox";
const FeishuChatSchema = Type.Object({
	action: Type.Enum([
		"members",
		"info",
		"member_info"
	], {
		type: "string",
		description: "Action to run: members | info | member_info"
	}),
	chat_id: Type.Optional(Type.String({ description: "Chat ID (from URL or event payload)" })),
	member_id: Type.Optional(Type.String({ description: "Member ID for member_info lookups" })),
	page_size: optionalPositiveIntegerSchema({
		maximum: 100,
		description: "Page size (1-100, default 50)"
	}),
	page_token: Type.Optional(Type.String({ description: "Pagination token" })),
	member_id_type: Type.Optional(Type.Enum([
		"open_id",
		"user_id",
		"union_id"
	], {
		type: "string",
		description: "Member ID type (default: open_id)"
	}))
});
//#endregion
//#region extensions/feishu/src/chat.ts
function readChatPageSize(params) {
	return readPositiveIntegerParam(params, "page_size", {
		max: 100,
		message: "page_size must be a positive integer between 1 and 100"
	});
}
function buildFeishuDirectChatMembers(authorization) {
	return {
		chat_id: authorization.chatId,
		has_more: false,
		page_token: void 0,
		members: [{
			member_id: authorization.memberId,
			name: void 0,
			tenant_key: void 0,
			member_id_type: authorization.memberIdType
		}]
	};
}
async function getChatInfo(client, chatId) {
	const res = await client.im.chat.get({ path: { chat_id: chatId } });
	if (res.code !== 0) throw new Error(res.msg);
	const chat = res.data;
	return {
		chat_id: chatId,
		name: chat?.name,
		description: chat?.description,
		owner_id: chat?.owner_id,
		tenant_key: chat?.tenant_key,
		user_count: chat?.user_count,
		chat_mode: chat?.chat_mode,
		chat_type: chat?.chat_type,
		join_message_visibility: chat?.join_message_visibility,
		leave_message_visibility: chat?.leave_message_visibility,
		membership_approval: chat?.membership_approval,
		moderation_permission: chat?.moderation_permission,
		avatar: chat?.avatar
	};
}
function authorizeFeishuChatInfo(params) {
	assertFeishuChatReadAllowed({
		cfg: params.cfg,
		account: params.account,
		chatId: params.chatId,
		chatType: resolveFeishuChatType(params.chat),
		ctx: params.ctx
	});
}
async function getAuthorizedFeishuChatInfo(params) {
	const preliminary = resolveFeishuChatReadPreliminaryAuthorization({
		cfg: params.cfg,
		account: params.account,
		chatId: params.chatId,
		ctx: params.ctx
	});
	if (preliminary.decision === "deny") assertFeishuChatReadAllowed({
		cfg: params.cfg,
		account: params.account,
		chatId: preliminary.chatId,
		ctx: params.ctx
	});
	let chat;
	try {
		chat = await getChatInfo(params.client, preliminary.chatId);
	} catch (error) {
		if (preliminary.decision === "needs-metadata") assertFeishuChatReadAllowed({
			cfg: params.cfg,
			account: params.account,
			chatId: preliminary.chatId,
			ctx: params.ctx
		});
		throw error;
	}
	authorizeFeishuChatInfo({
		cfg: params.cfg,
		account: params.account,
		chatId: preliminary.chatId,
		chat,
		ctx: params.ctx
	});
	return chat;
}
async function getChatMembers(client, chatId, pageSize, pageToken, memberIdType) {
	const page_size = pageSize ? Math.max(1, Math.min(100, pageSize)) : 50;
	const res = await client.im.chatMembers.get({
		path: { chat_id: chatId },
		params: {
			page_size,
			page_token: pageToken,
			member_id_type: memberIdType ?? "open_id"
		}
	});
	if (res.code !== 0) throw new Error(res.msg);
	return {
		chat_id: chatId,
		has_more: res.data?.has_more,
		page_token: res.data?.page_token,
		members: res.data?.items?.map((item) => ({
			member_id: item.member_id,
			name: item.name,
			tenant_key: item.tenant_key,
			member_id_type: item.member_id_type
		})) ?? []
	};
}
async function assertFeishuChatMember(client, chatId, memberId, memberIdType = "open_id") {
	let pageToken;
	const seenPageTokens = /* @__PURE__ */ new Set();
	while (true) {
		const members = await getChatMembers(client, chatId, 100, pageToken, memberIdType);
		if (members.members.some((member) => member.member_id === memberId)) return;
		if (!members.has_more || !members.page_token) break;
		if (seenPageTokens.has(members.page_token)) throw new Error(`Feishu chat member pagination repeated token for chat ${chatId}`);
		seenPageTokens.add(members.page_token);
		pageToken = members.page_token;
	}
	throw new Error(`Member ${memberId} is not a member of chat ${chatId}`);
}
async function getFeishuMemberInfo(client, memberId, memberIdType = "open_id") {
	const res = await client.contact.user.get({
		path: { user_id: memberId },
		params: {
			user_id_type: memberIdType,
			department_id_type: "open_department_id"
		}
	});
	if (res.code !== 0) throw new Error(res.msg);
	const user = res.data?.user;
	return {
		member_id: memberId,
		member_id_type: memberIdType,
		open_id: user?.open_id,
		user_id: user?.user_id,
		union_id: user?.union_id,
		name: user?.name,
		en_name: user?.en_name,
		nickname: user?.nickname,
		email: user?.email,
		enterprise_email: user?.enterprise_email,
		mobile: user?.mobile,
		mobile_visible: user?.mobile_visible,
		status: user?.status,
		avatar: user?.avatar,
		department_ids: user?.department_ids,
		department_path: user?.department_path,
		leader_user_id: user?.leader_user_id,
		city: user?.city,
		country: user?.country,
		work_station: user?.work_station,
		join_time: user?.join_time,
		is_tenant_manager: user?.is_tenant_manager,
		employee_no: user?.employee_no,
		employee_type: user?.employee_type,
		description: user?.description,
		job_title: user?.job_title,
		geo: user?.geo
	};
}
function registerFeishuChatTools(api) {
	api.registerTool((toolContext) => {
		const cfg = toolContext.runtimeConfig ?? toolContext.config ?? api.config;
		if (!cfg || !resolveAnyEnabledFeishuToolsConfig(cfg).chat) return null;
		return {
			name: "feishu_chat",
			resultContentSource: "network",
			label: "Feishu Chat",
			description: "Feishu chat operations. Actions: members, info, member_info",
			parameters: FeishuChatSchema,
			async execute(_toolCallId, params) {
				const rawParams = params;
				const p = params;
				try {
					const account = resolveFeishuToolAccount({
						cfg,
						defaultAccountId: toolContext.agentAccountId,
						requiredTool: {
							family: "chat",
							label: "chat"
						}
					});
					const client = createFeishuClient(account);
					switch (p.action) {
						case "members":
							if (!p.chat_id) return feishuExternalToolResult({ error: "chat_id is required for action members" });
							{
								const chat = await getAuthorizedFeishuChatInfo({
									client,
									cfg,
									account,
									chatId: p.chat_id,
									ctx: toolContext
								});
								const authorization = authorizeFeishuChatMemberRead({
									cfg,
									account,
									chatId: p.chat_id,
									chatType: resolveFeishuChatType(chat),
									ctx: toolContext,
									memberIdType: p.member_id_type
								});
								if (authorization.kind === "direct") return feishuExternalToolResult(buildFeishuDirectChatMembers(authorization));
							}
							return feishuExternalToolResult(await getChatMembers(client, p.chat_id, readChatPageSize(rawParams), p.page_token, p.member_id_type));
						case "info":
							if (!p.chat_id) return feishuExternalToolResult({ error: "chat_id is required for action info" });
							{
								const chat = await getAuthorizedFeishuChatInfo({
									client,
									cfg,
									account,
									chatId: p.chat_id,
									ctx: toolContext
								});
								return feishuExternalToolResult(chat);
							}
						case "member_info":
							if (!p.member_id) return feishuExternalToolResult({ error: "member_id is required for action member_info" });
							if (!p.chat_id) return feishuExternalToolResult({ error: "chat_id is required for action member_info" });
							{
								const chat = await getAuthorizedFeishuChatInfo({
									client,
									cfg,
									account,
									chatId: p.chat_id,
									ctx: toolContext
								});
								const authorization = authorizeFeishuChatMemberRead({
									cfg,
									account,
									chatId: p.chat_id,
									chatType: resolveFeishuChatType(chat),
									ctx: toolContext,
									memberId: p.member_id,
									memberIdType: p.member_id_type
								});
								if (authorization.kind === "group") {
									const memberIdType = p.member_id_type ?? "open_id";
									await assertFeishuChatMember(client, p.chat_id, p.member_id, memberIdType);
									return feishuExternalToolResult(await getFeishuMemberInfo(client, p.member_id, memberIdType));
								}
								return feishuExternalToolResult(await getFeishuMemberInfo(client, authorization.memberId, authorization.memberIdType));
							}
						default: return feishuExternalToolResult({ error: `Unknown action: ${String(p.action)}` });
					}
				} catch (err) {
					return feishuExternalToolResult({ error: formatFeishuApiError(err, { includeNestedErrorLogId: true }) });
				}
			}
		};
	}, { name: "feishu_chat" });
}
//#endregion
export { getFeishuMemberInfo as a, getChatMembers as i, buildFeishuDirectChatMembers as n, registerFeishuChatTools as o, getChatInfo as r, assertFeishuChatMember as t };
