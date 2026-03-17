import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

export function setupSwagger(app) {
	const options = {
		definition: {
			openapi: "3.0.0",
			info: {
				title: "Game API",
				version: "1.0.0",
				description: "**Notice:** To test protected endpoints, please login via /login first. The JWT cookie will be automatically stored in your browser session."
			},
			tags: [{
				name: "🔐 Authentication",
				description: "Login/logout endpoints. Must authenticate to test protected routes."
			}],
			servers: [
				{ url: "https://localhost:8443/api" }
			],
			components: {
				securitySchemes: {
					BearerAuth: {
						type: "http",
						scheme: "bearer",
						bearerFormat: "JWT",
					},
				},
			},
			security: [{ BearerAuth: [] }],
		},
		apis: ["./src/controllers/*.js"], // Reads JSDoc from your controllers
	};

	const swaggerSpec = swaggerJsdoc(options);

	// Serve Swagger UI at /api/docs
	app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, { swaggerOptions: { withCredentials: true } }));

};

