//#region extensions/workboard/src/card-redaction.ts
function redactClaimToken(card) {
	const claim = card.metadata?.claim;
	if (!claim) return card;
	return {
		...card,
		metadata: {
			...card.metadata,
			claim: {
				...claim,
				token: "[redacted]"
			}
		}
	};
}
function redactDispatchResult(result) {
	return {
		...result,
		promoted: result.promoted.map(redactClaimToken),
		reclaimed: result.reclaimed.map(redactClaimToken),
		blocked: result.blocked.map(redactClaimToken),
		orchestrated: result.orchestrated.map(redactClaimToken)
	};
}
//#endregion
export { redactDispatchResult as n, redactClaimToken as t };
