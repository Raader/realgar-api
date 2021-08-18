import express from "express";
import authenticationService from "../auth";

const router = express.Router();

router.post("/users", async (req, res, next) => {
  try {
    const user = await authenticationService.register(req.body);
    if (!user) throw new Error("authentication failed");
    if (req.session) req.session.userId = user?.id;
    res.json(user);
  } catch (error) {
    next(error);
  }
});

router.post("/session", async (req, res, next) => {
  try {
    const user = await authenticationService.login(req.body);
    if (!user) throw new Error("authentication failed");
    if (req.session) req.session.userId = user?.id;
    res.json(user);
  } catch (error) {
    next(error);
  }
});

export default router;
