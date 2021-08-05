import express from "express";
import paymentService from "../payment";

const router = express.Router();

router.use((req, res, next) => {
  const userId = req.session?.userId;
  if (!userId) return res.status(401).end();
  next();
});

router.post("/user/payments", async (req, res, next) => {
  const userId = req.session?.userId;
  try {
    const payment = await paymentService.create({ ...req.body, userId });
    res.json(payment);
  } catch (error) {
    next(error);
  }
});

router.get("/user/payments", async (req, res, next) => {
  const userId = req.session?.userId;
  try {
    const payments = await paymentService.read({ userId });
    res.json(payments);
  } catch (error) {
    next(error);
  }
});

router.get("/user/payments/:id", async (req, res, next) => {
  const userId = req.session?.userId;
  const { id } = req.params;
  try {
    const payment = await paymentService.readOne({ id, userId });
    res.json(payment);
  } catch (error) {
    next(error);
  }
});

router.patch("/user/payments/:id", async (req, res, next) => {
  const userId = req.session?.userId;
  const { id } = req.params;
  try {
    const payment = await paymentService.updateOne({ id, userId }, req.body);
    res.json(payment);
  } catch (error) {
    next(error);
  }
});

router.delete("/user/payments/:id", async (req, res, next) => {
  const userId = req.session?.userId;
  const { id } = req.params;
  try {
    const payment = await paymentService.deleteOne({ id, userId });
    res.json(payment);
  } catch (error) {
    next(error);
  }
});

export default router;
