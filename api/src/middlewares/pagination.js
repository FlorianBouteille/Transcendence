
// Format pagination filters
export function pagination(req, res, next) {
	let { limit = 50, page = 1 } = req.query;

	limit = Number(limit);
	page = Number(page);

	if (!Number.isInteger(limit) || limit <= 0) {
		return res.status(400).json({
			error: "Invalid 'limit', must be a positive integer"
		});
	}

	if (!Number.isInteger(page) || page <= 0) {
		return res.status(400).json({
			error: "Invalid 'page', must be a positive integer"
		});
	}

	// Normalize query params
	req.query.limit = limit;
	req.query.page = page;

	next();
}
