import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

export function setupSwagger(app) {
	const options = {
		definition: {
			openapi: "3.0.0",
			info: {
				title: "Game API",
				version: "1.0.0",
				description: "API for Fall Guys-like game",
			},
			servers: [{
					url: "http://localhost:8080/api",
				},],
			components: {
				securitySchemes: {
					BearerAuth: {               // JWT auth for protected routes
						type: "http",
						scheme: "bearer",
						bearerFormat: "JWT",
					},
					BasicAuth: {                // Basic auth for login testing
						type: "http",
						scheme: "basic",
					},
				},
			},
			security: [{ BearerAuth: [] }],
		},
		apis: ["./src/controllers/*.js"], // Reads JSDoc from your controllers
	};

	const swaggerSpec = swaggerJsdoc(options);

	// Serve Swagger UI at /api/docs
	app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}
