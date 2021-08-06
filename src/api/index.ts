import express from "express";
import cors from "cors";
import cookieSession from "cookie-session";
import oauthRoutes from "./oauth.routes";
import paymentRoutes from "./payment.routes";

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
app.use(paymentRoutes);
app.use(oauthRoutes);

app.delete("/session", async (req, res, next) => {
  req.session = null;
  res.send("OK");
});

export default app;