import swaggerJsdoc from "swagger-jsdoc"

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Library Management System API",
      version: "1.0.0",
      description: "API documentation for the Library Management System",
      contact: {
        name: "API Support",
        email: "support@example.com",
      },
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        User: {
          type: "object",
          properties: {
            userID: { type: "string" },
            username: { type: "string" },
            password: { type: "string" },
            role: { type: "string", enum: ["admin", "user"] }
          },
        },
        Book: {
          type: "object",
          properties: {
            bookID: { type: "string" },
            title: { type: "string" },
            author: { type: "string" },
            isbn: { type: "string" },
            description: { type: "string" }
          },
        },
        BorrowRecord: {
          type: "object",
          properties: {
            id: { type: "string" },
            userId: { type: "string" },
            bookId: { type: "string" },
            borrowDate: { type: "string", format: "date-time" },
            returnDate: { type: "string", format: "date-time", nullable: true },
            isReturned: { type: "boolean" },
          },
        },
        Success: {
          type: "object",
          properties: {
            status: { type: "string" },
            message: { type: "string" },
          },
        },
        Error: {
          type: "object",
          properties: {
            message: { type: "string" },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./src/routes/*.ts"], // Path to the API routes files
}

export const specs = swaggerJsdoc(options)
