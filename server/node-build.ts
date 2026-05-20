import path from "node:path";
import express from "express";
import { createServer } from "./index";

const app = createServer();
const port = process.env.PORT || 3000;
app.use(express.static(path.join(import.meta.dirname, "../spa")));
app.get("*", (_req, res) => res.sendFile(path.join(import.meta.dirname, "../spa/index.html")));
app.listen(port, () => console.log("Server on :" + port));
