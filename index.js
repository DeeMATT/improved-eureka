const express = require("express");
const app = express();
const templateService = require("./template-service");

const port = process.env.PORT || 5000;

app.use(express.json());

//app imports
import { registerSubdomainForLolaFinance } from "./digitalocean/index";

app.get("/", async (req, res) => {
  return res.json({
    data: "welcome to lola serve",
  });
});

app.post("/lolasubdomain", async (req, res) => {
  const { name } = req.body;

  let result = await registerSubdomainForLolaFinance(name);

  if (result.success) {
    return res.json(result);
  }

  return res.status(500).json(result);
});

app.use(templateService);

app.use((req, res, next) => {
  const err = new Error();
  err.message = "Not found";
  err.name = "notfound";
  err.statusCode = 404;
  next(err);
});

app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    name: err.name,
  });
});

app.listen(port, () => {
  console.log(`Lola Serve Is Running On Port ${port}`);
});
