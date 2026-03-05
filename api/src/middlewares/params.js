/**
 * Middleware to parse route params
 * Usage: app.use('/profiles/:id', parseParams({ id: 'int' }))
 */

export function parseParams(schema = {}) {
	return (req, res, next) => {
		try {
		for (const [param, type] of Object.entries(schema)) {
			if (!(param in req.params)) continue;

			let value = req.params[param];

			switch (type) {
			case 'int':
				value = parseInt(value, 10);
				if (isNaN(value)) {
				return res.status(400).json({ error: `Invalid parameter '${param}', must be an integer.` });
				}
				break;

			case 'float':
				value = parseFloat(value);
				if (isNaN(value)) {
				return res.status(400).json({ error: `Invalid parameter '${param}', must be a number.` });
				}
				break;

			case 'boolean':
				value = value === 'true' || value === true;
				break;

			case 'string':
				value = String(value);
				break;

			default:
				break;
			}

			req.params[param] = value;
		}

		next();
		} catch (err) {
		next(err);
		}
	};
}
