const swaggerAutogen = require("swagger-autogen")();

const doc = {
  info: {
    title: "Claims Management System API",
    description:
      "API for managing insurance claims, policies, and user/admin accounts within the Claims Management System.",
  },
  host: "cmsbackendnew.onrender.com",
  schemes: ["https"],
  basePath: "/",
};

const outputFile = "./swagger_output.json";
const endpointsFiles = ["./routes/userRoutes.js", "./routes/adminRoutes.js"];

// Generate swagger.json file
swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  require("./server"); // Your server file
});
