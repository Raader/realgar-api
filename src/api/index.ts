import express from "express";
import cors from "cors";
import cookieSession from "cookie-session";
import oauthRoutes from "./oauth.routes";
import paymentRoutes from "./payment.routes";
import userService from "../user";

const app = express();

app.set("trust proxy", 1);
//middlewares
const clientURL = process.env.CLIENT_URL;
const origin = [];
if (clientURL) origin.push(clientURL);
app.use(cors({ credentials: true, origin, exposedHeaders: ["set-cookie"] }));
app.use(express.json());
app.use(
  cookieSession({
    name: "session",
    keys: process.env.SESSION_SECRETS?.split(" "),
    maxAge: Number(process.env.SESSION_MAX_AGE),
    domain: process.env.CLIENT_DOMAIN,
    secureProxy: !!process.env.COOKIE_SECURE,
  })
);

//routes
app.use(paymentRoutes);
app.use(oauthRoutes);

app.get("/user", async (req, res, next) => {
  const userId = req.session?.userId;
  try {
    const user = await userService.readUserById(userId);
    if (!user) return res.status(401).end();
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
