const Expense = require("./models/expense");
const { expenseSchema } = require("./schema");
const ExpressError = require("./utils/expressError");

module.exports.isLoggenIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "To move further you have to log in");
        return res.redirect("/login");
    }
    next();
};

module.exports.saveRedirect = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
        res.locals.saveName=req.session.user;
        delete req.session.redirectUrl; // Clear the redirect URL after saving it
    }
    next();
};

module.exports.isOwner = async (req, res, next) => {
    const { id } = req.params;

    try {
        const expense = await Expense.findById(id);

        if (!expense) {
            req.flash("error", "Expense not found");
            return res.redirect("/expenses");
        }

        if (!expense.owner || !expense.owner.equals(req.user._id)) {
            req.flash("error", "You do not have permission to do that");
            return res.redirect(`/expenses/${id}`);
        }

        next();
    } catch (err) {
        next(err);
    }
};

module.exports.validateExpense = (req, res, next) => {
    const { error } = expenseSchema.validate(req.body.expense); 
    if (error) {
        const errmess = error.details.map((el) => el.message).join(",");
        return res.status(400).send(errmess); // Send error response
    }
    next();
};