//#region src/channels/plugins/directory-adapters.ts
const nullChannelDirectorySelf = async () => null;
const emptyChannelDirectoryList = async () => [];
/** Build a channel directory adapter with a null self resolver by default. */
function createChannelDirectoryAdapter(params = {}) {
	return {
		...params,
		self: params.self ?? nullChannelDirectorySelf
	};
}
function createEmptyChannelDirectoryAdapter() {
	return createChannelDirectoryAdapter({
		listPeers: emptyChannelDirectoryList,
		listGroups: emptyChannelDirectoryList
	});
}
//#endregion
export { nullChannelDirectorySelf as i, createEmptyChannelDirectoryAdapter as n, emptyChannelDirectoryList as r, createChannelDirectoryAdapter as t };
