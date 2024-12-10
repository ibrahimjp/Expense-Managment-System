const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const expenseSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  to: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String,
    required: true
  },
  expenses: {
    type: Number,
    required: true,
    min: 0
  },
  description: {
    type: String,
    required: true
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "UserExpense",
  }
});

module.exports = mongoose.model("Expense", expenseSchema);