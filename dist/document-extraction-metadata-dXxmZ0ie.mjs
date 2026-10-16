//#region src/media/document-extraction-metadata.ts
function renderDocumentTruncationNotice(metadata, explicitSelectionLimit) {
	const reasons = [];
	if (explicitSelectionLimit !== void 0) reasons.push(`requested page selection limited to ${explicitSelectionLimit} pages`);
	if (metadata?.pages?.truncated) reasons.push(metadata.pages.selection === "automatic" ? `${metadata.pages.processed.length} of ${metadata.pages.total} pages processed` : `some requested pages omitted; ${metadata.pages.processed.length} pages processed`);
	if (metadata?.textTruncated) reasons.push("text truncated");
	if (metadata?.imagesTruncated) reasons.push("image rendering truncated");
	return reasons.length > 0 ? `[Partial document: ${reasons.join("; ")}.]` : void 0;
}
//#endregion
export { renderDocumentTruncationNotice as t };
