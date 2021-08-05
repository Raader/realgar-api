import express from "express";
import paymentService from "../payment";

const router = express.Router();

router.post("/payments", async (req, res, next) => {
  try {
    const payment = await paymentService.create(req.body);
    res.json(payment);
  } catch (error) {
    next(error);
  }
});

router.get("/payments", async (req, res, next) => {
  try {
    const payments = await paymentService.read();
    res.json(payments);
  } catch (error) {
    next(error);
  }
});

router.get("/payments/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    const payment = await paymentService.readById(id);
    res.json(payment);
  } catch (error) {
    next(error);
  }
});

router.patch("/payments/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    const payment = await paymentService.updateById(id, req.body);
    res.json(payment);
  } catch (error) {
    next(error);
  }
});

router.delete("/payments/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    const payment = await paymentService.deleteById(id);
    res.json(payment);
  } catch (error) {
    next(error);
  }
});

export default router;
