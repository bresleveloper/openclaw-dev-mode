// extensions/whatsapp/src/command-policy.ts
const whatsappCommandPolicy = {
	enforceOwnerForCommands: true,
	preferSenderE164ForCommands: true,
	skipWhenConfigEmpty: true
};
export { whatsappCommandPolicy as t };
