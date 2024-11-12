const mongoose = require("mongoose");

const PurchaseSchema = new mongoose.Schema({
  User: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  purchaseDate: {
    type: Date,
    required: true,
  },
  milk: {
    milkId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Milk",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
  },
  curd: {
    curdId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Curd", 

    },
    quantity: {
      type: Number,
    },
  },
  totalPriceOfPurchase: {
    type: Number,
    required: true,
  },
});

const Purchase = mongoose.model("Purchase", PurchaseSchema);

module.exports = Purchase;
