const userModel = require("../../models/userModel");
module.exports = {
	viewCustomers: async (req, res) => {
		const { email } = req.body;
		const user = await userModel.find({});
		res.render("admin/admin/sellercard", { user });
	},
	editCustomers: async (req, res) => {
		try {
			const { email } = req.query;
			const user = await userModel.findOne({ email });

			if (!user) {
				return res.status(404).send("User not found");
			}

			res.render("admin/admin/editCustomer", { user });
		} catch (error) {
			console.error("Error:", error);
			res.status(500).send("Internal Server Error");
		}
	},
	updateUser: async (req, res) => {
		const { email } = req.body;

		try {
			const { firstname, lastname, phonenumber } = req.body;

			if (!firstname || !lastname || !phonenumber) {
				return res.send("Fields cannot be empty");
			}

			const user = await userModel.findOne({ email });

			if (!user) {
				return res.status(404).send("User not found");
			}

			user.firstname = firstname;
			user.lastname = lastname;
			user.phonenumber = phonenumber;

			await user.save();

			return res.redirect("/admin/viewCustomers");
		} catch (error) {
			console.error("Error:", error);
			return res.status(500).send("Internal Server Error");
		}
	},
	blockUser: async (req, res) => {
		try {
			const { email } = req.query;
			const user = await userModel.findOne({ email });

			if (!user) {
				return res.status(404).send("User not found");
			}

			user.isBlocked = !user.isBlocked;
			await user.save();

			res.redirect("/admin/viewCustomers");
		} catch (error) {
			console.error("Error:", error);
			res.status(500).send("Internal Server Error");
		}
	},
	searchUser: async (req, res) => {
		try {
			const { searchTerm } = req.body;
			const user = await userModel.find({
				$or: [{ firstname: { $regex: searchTerm, $options: "i" } }, { email: { $regex: searchTerm, $options: "i" } }]
			});
			req.session.searchResults = user;
			res.redirect("/admin/searchView");
		} catch (error) {
			console.error("Error:", error);
			res.status(500).send("Internal Server Error");
		}
	},
	searchView: async (req, res) => {
		try {
			const user = req.session.searchResults || [];
			res.render("admin/admin/sellercard", { user });
		} catch (err) {
			console.log(err);
		}
	},
	sortUser: async (req, res) => {
		const { sortingLogic } = req.body;
		let user;
		if (sortingLogic === "alphaplus") {
			user = await userModel.find({}).sort({ firstname: 1 }).exec();
		} else if (sortingLogic === "alphaminus") {
			user = await userModel.find({}).sort({ firstname: -1 }).exec();
		}
		if (sortingLogic === "admin") {
			user = await userModel.find({ isAdmin: "true" }).exec();
		}
		if (sortingLogic === "blocked") {
			user = await userModel.find({ isBlocked: "true" }).exec();
		}
		req.session.isSort = user;
		res.redirect("/admin/sortUserView");
	},
	sortUserView: async (req, res) => {
		const user = req.session.isSort || [];
		res.render("admin/admin/sellercard", { user });
	}
};
