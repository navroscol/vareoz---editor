import type { RequestHandler } from "express";
import type { DemoResponse } from "../../shared/api";

export const handleDemo: RequestHandler = (_req, res) => {
  const r: DemoResponse = { message: "Hello from server" };
  res.json(r);
};
