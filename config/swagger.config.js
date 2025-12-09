const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Quiz API",
      version: "1.0.0",
    },
    servers: [
      {
        url: "https://sdn302-asm4-be.onrender.com",
      },
    ],
  },
  apis: ["./routes/*.js"], // đường dẫn đến file route có comment swagger
};

const specs = swaggerJsdoc(options);

module.exports = { swaggerUi, specs };
