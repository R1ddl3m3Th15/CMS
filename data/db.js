const users = [];
const claims = [];

const policies = [
  {
    serialNo: 1,
    provider: "TVS Insurance",
    category: "Medical Insurance",
    coverageAmount: 500000,
    premium: 5000,
    tenure: 1,
  },
  {
    serialNo: 2,
    provider: "Care Insurance",
    category: "Medical Insurance",
    coverageAmount: 1000000,
    premium: 8000,
    tenure: 1,
  },
  {
    serialNo: 3,
    provider: "Syska Insurance",
    category: "Medical Insurance",
    coverageAmount: 400000,
    premium: 2000,
    tenure: 1,
  },
  {
    serialNo: 4,
    provider: "Reliance Insurance",
    category: "Medical Insurance",
    coverageAmount: 800000,
    premium: 7000,
    tenure: 1,
  },
  {
    serialNo: 5,
    provider: "SBI Life Insurance",
    category: "Medical Insurance",
    coverageAmount: 1000000,
    premium: 1000,
    tenure: 1,
  },
  {
    serialNo: 6,
    provider: "Explore Insurance",
    category: "Medical Insurance",
    coverageAmount: 600000,
    premium: 6000,
    tenure: 1,
  },
];

module.exports = {
  users,
  policies,
  claims,
};
