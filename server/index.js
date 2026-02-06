const express = require("express");
const app = express();
const port = 3000;

app.get("/", (req, res) => res.send("NCP API Server Running"));

app.listen(port, () => console.log(`NCP Server listening on port ${port}`));
