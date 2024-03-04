const express = require("express");
// Require Mongoose connection setup
require("./config/mongooseConnection");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger_output.json");

const userRoutes = require("./routes/userRoutes");
// const policyRoutes = require("./routes/policyRoutes");
// const claimRoutes = require("./routes/claimRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();
const port = 4000;

app.use(cors());
app.use(express.json());

app.use("/", userRoutes);
// app.use("/policies", policyRoutes);
// app.use("/claims", claimRoutes);
app.use("/", adminRoutes);

// Set up Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
