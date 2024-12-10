const express = require("express");
const {
  indexRoute,
  renderNewForm,
  renderEditForm,
  showExpense,
  updateExpense,
  createExpense,
  destroyExpense, 
  createImmediate
} = require("../controllers/expense");
const wrapAsync = require("../utils/wrapAsync");
const {isLoggenIn, isOwner,validateExpense, saveRedirect} = require("../middleware"); 
const router = express.Router();

// Index and New route
router
  .route("/")
  .get(wrapAsync(indexRoute))
  .post(isLoggenIn,createExpense);

// New Route
router.get("/new", isLoggenIn,renderNewForm);

// Edit Route
router.get("/:id/edit",isLoggenIn, renderEditForm);

// Show, Update, Delete Route
router
  .route("/:id")
  .get(wrapAsync(showExpense))
  .put(isLoggenIn,isOwner,validateExpense, wrapAsync(updateExpense))
  .delete(isLoggenIn,isOwner,wrapAsync(destroyExpense)); 
  
router.post("/add-expense", isLoggenIn,saveRedirect, createImmediate);

module.exports = router;