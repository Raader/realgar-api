import express from "express";
import paymentService from "./payment";

const app = express();
app.use(express.json());

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
const port = process.env.PORT || 5000;
app.listen(port, () => console.log("server started on on port: " + port));
