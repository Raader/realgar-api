import express from "express";
import githubService from "../oauth/github";

const router = express.Router();

router.get("/oauth/github", async (req, res, next) => {
  res.send(githubService.authorizeURL);
});

router.post("/oauth/github", async (req, res, next) => {
  const { code } = req.query;
  try {
    if (typeof code !== "string") throw new Error("query params invalid");
    const user = await githubService.authenticate(code);
    if (!user) throw new Error("authentication failed");
    if (req.session) req.session.userId = user.id;
    res.json(user);
  } catch (error) {
    next(error);
  }
});

export default router;
