import express from "express";
import cors from "cors";
import cookieSession from "cookie-session";
import paymentService from "../payment";
import githubService from "../oauth/github";

//middlewares
const app = express();
app.use(cors());
app.use(express.json());
app.use(
  cookieSession({
    name: "session",
    keys: process.env.SESSION_SECRETS?.split(" "),
    maxAge: Number(process.env.SESSION_MAX_AGE),
  })
);

//routes
app.post("/payments", async (req, res, next) => {
  try {
    const payment = await paymentService.create(req.body);
    res.json(payment);
  } catch (error) {
    next(error);
  }
});

app.get("/payments", async (req, res, next) => {
  try {
    const payments = await paymentService.read();
    res.json(payments);
  } catch (error) {
    next(error);
  }
});

app.get("/payments/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    const payment = await paymentService.readById(id);
    res.json(payment);
  } catch (error) {
    next(error);
  }
});

app.patch("/payments/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    const payment = await paymentService.updateById(id, req.body);
    res.json(payment);
  } catch (error) {
    next(error);
  }
});

app.delete("/payments/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    const payment = await paymentService.deleteById(id);
    res.json(payment);
  } catch (error) {
    next(error);
  }
});

app.get("/oauth/github", async (req, res, next) => {
  res.send(githubService.authorizeURL);
});

app.post("/oauth/github", async (req, res, next) => {
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

app.delete("/session", async (req, res, next) => {
  req.session = null;
  res.send("OK");
});

export default app;
