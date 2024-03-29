import express from "express";
import paymentService from "../payment";

const router = express.Router();

function authorize(req: any, res: any, next: any) {
  const userId = req.session?.userId;
  if (!userId) return res.status(401).end();
  next();
}

router.post("/user/payments", authorize, async (req, res, next) => {
  const userId = req.session?.userId;
  try {
    const payment = await paymentService.create({ ...req.body, userId });
    res.json(payment);
  } catch (error) {
    next(error);
  }
});

router.get("/user/payments", authorize, async (req, res, next) => {
  const userId = req.session?.userId;
  try {
    const payments = await paymentService.read(
      { userId },
      Number(req.query?.skip),
      Number(req.query?.limit)
    );
    res.json(payments);
  } catch (error) {
    next(error);
  }
});

router.get("/user/payments/:id", authorize, async (req, res, next) => {
  const userId = req.session?.userId;
  const { id } = req.params;
  try {
    const payment = await paymentService.readOne({ id, userId });
    res.json(payment);
  } catch (error) {
    next(error);
  }
});

router.patch("/user/payments/:id", authorize, async (req, res, next) => {
  const userId = req.session?.userId;
  const { id } = req.params;
  try {
    const payment = await paymentService.updateOne({ id, userId }, req.body);
    res.json(payment);
  } catch (error) {
    next(error);
  }
});

router.delete("/user/payments/:id", authorize, async (req, res, next) => {
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
