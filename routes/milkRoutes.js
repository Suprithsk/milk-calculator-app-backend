const { Router } = require("express");
const router = Router();

const {  addMilk,addCurd,getMilk,getCurd,purchaseMilkOrCurd,getMilkPurchaseAmountToday,getAllMissedDates,getMissedDatesOfThatMonth,getPriceOfThatMonth } = require("../controllers/milkController");

router.post("/addMilk", addMilk);
router.post("/addCurd", addCurd);
router.get("/getMilk", getMilk);
router.get("/getCurd", getCurd);
router.post("/purchaseMilkOrCurd", purchaseMilkOrCurd);
router.get("/getMilkPurchaseAmountToday", getMilkPurchaseAmountToday);
router.get("/getAllMissedDates", getAllMissedDates);
router.get("/getMissedDatesOfThatMonth/:year/:month", getMissedDatesOfThatMonth);
router.get("/getPriceOfThatMonth/:year/:month", getPriceOfThatMonth);

 
module.exports = router;
