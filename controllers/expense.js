const Expense = require("../models/expense");
const expressError = require("../utils/expressError");
const {expenseSchema}=require("../schema");

module.exports.indexRoute = async (req, res) => {
  const expenses = await Expense.find();
  res.render("expenses/index.ejs", { expenses });
};

module.exports.renderNewForm = (req, res) => {
  res.render("expenses/new.ejs");
};

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const expense = await Expense.findById(id);

    if (!expense) {
        req.flash("error", "Expense Does Not Exist!");
        return res.redirect("/expenses");
    }

    res.render("expenses/edit.ejs", { expense });  
}

module.exports.showExpense = async (req, res) => {
    const { id } = req.params;
    const expense = await Expense.findById(id).populate("owner");

    if (!expense) {
        return res.redirect("/expenses");
    }

    res.render("expenses/show.ejs", { expense });
};

module.exports.updateExpense = async (req, res) => {
    const { id } = req.params;
    const expense = await Expense.findByIdAndUpdate(id, { ...req.body.expense }, { new: true });
    res.redirect(`/expenses/${expense._id}`);  
};

module.exports.destroyExpense = async (req, res) => {
    const { id } = req.params;
    const expense = await Expense.findById(id);

    if (!expense) {
        throw new expressError(404, "Listing not found");
    }

    await Expense.findByIdAndDelete(id);
    res.redirect("/expenses");
};

module.exports.createExpense = async (req, res, next) => {
    try {
        console.log("Request Body:", req.body); // Log the request body

        // Validate the request body
        const { error } = expenseSchema.validate(req.body);
        if (error) {
            console.log("Validation Error:", error.details); // Log validation errors
            req.flash("error", error.details[0].message);
            return res.redirect("/expenses/new");
        }

        // Convert specific fields to lowercase
        req.body.expense.name = req.body.expense.name.toLowerCase();
        req.body.expense.to = req.body.expense.to.toLowerCase();
        req.body.expense.description = req.body.expense.description.toLowerCase();

        const expense = new Expense(req.body.expense);
        expense.owner = req.user._id; // Assuming you're using req.user for the logged-in user
        await expense.save();
        req.flash("success", "Expense added successfully!");
        res.redirect("/expenses");
    } catch (err) {
        console.error("Error occurred:", err); // Log any unexpected errors
        next(err); // Pass the error to the error handler
    }
};
module.exports.createImmediate = async (req, res) => {
    try {
        const { error } = expenseSchema.validate({ expense: req.body });
        if (error) {
          return res.status(400).send(error.details[0].message); 
        }
    
        // Create a new expense document using the 'name' (saveName)
        const newExpense = new Expense({
          name: req.body.name,  // This will now be the logged-in user's name
          to: req.body.to,
          phoneNumber: req.body.phoneNumber,
          expenses: req.body.expenses,
          description: req.body.description,
          owner: req.user._id,  // Ensure the logged-in user is assigned as the owner
        });
    
        await newExpense.save();
    
        res.redirect("/expenses");
      } catch (err) {
        console.error(err);
        res.status(500).send("Something went wrong while adding the expense.");
      }
};
