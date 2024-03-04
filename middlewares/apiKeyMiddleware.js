require("dotenv").config();

function checkApiKey(req, res, next) {
  const apiKeyHeader = req.headers["x-api-key"];
  if (!apiKeyHeader || apiKeyHeader !== process.env.API_KEY) {
    return res.status(401).json({ message: "Invalid API Key" });
  }
  next();
}

module.exports = checkApiKey;
