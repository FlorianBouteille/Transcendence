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
			servers: [
				{
					url: "http://localhost:8080/api",
					description: "Local API server",
				},
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
		apis: ["./src/controllers/*.js"],
	};

	const swaggerSpec = swaggerJsdoc(options);

	app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}
