const express = require("express");
const bodyParser = require("body-parser");
const userRoutes = require("./routes/userRoutes");
const policyRoutes = require("./routes/policyRoutes");
const claimRoutes = require("./routes/claimRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();
const port = 4000;

app.use(bodyParser.json());

app.use("/user", userRoutes);
// app.use("/policies", policyRoutes);
app.use("/claims", claimRoutes);
app.use("/admin", adminRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
