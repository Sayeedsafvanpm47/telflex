const userModel = require("../../models/userModel");
module.exports = {
	// controller for viewing the customers
	viewCustomers: async (req, res) => {
		try {
			let currentPage = req.query.page ? parseInt(req.query.page) : 1;
			let numberOfDocs = 10;
			let search = false;

			const userCount = await userModel.countDocuments();
			const totalPages = Math.ceil(userCount / numberOfDocs);
			const { email } = req.body;
			const user = await userModel
				.find({})
				.skip((currentPage - 1) * numberOfDocs)
				.limit(numberOfDocs);
			res.render("admin/admin/sellercard", { user, userCount, totalPages, currentPage, search });
		} catch (error) {
			console.log(error);
		}
	},
// controller for blocking the customer
	blockUser: async (req, res) => {
		try {
			const { email } = req.query;
			const user = await userModel.findOne({ email });

			if (!user) {
				return res.status(404).send("User not found");
			}

			user.isBlocked = !user.isBlocked;
			await user.save();

			res.status(200).send({message:`User status updated successfully`});
		} catch (error) {
			console.error("Error:", error);
			res.status(500);
		}
	},
	// controller for searching the customer
	searchUser: async (req, res) => {
		try {
			const { searchTerm } = req.body;
			req.session.searchTerm = searchTerm;

			res.redirect("/admin/searchView");
		} catch (error) {
			console.error("Error:", error);
			res.status(500);
		}
	},
	// controller for viewing the search results
	searchView: async (req, res) => {
		try {
			let currentPage = req.query.page ? parseInt(req.query.page) : 1;
			let numberOfDocs = 10;

			const userCount = await userModel
				.find({
					$or: [
						{ firstname: { $regex: req.session.searchTerm, $options: "i" } },
						{ email: { $regex: req.session.searchTerm, $options: "i" } }
					]
				})
				.countDocuments();
			const totalPages = Math.ceil(userCount / numberOfDocs);
			const user = await userModel
				.find({
					$or: [
						{ firstname: { $regex: req.session.searchTerm, $options: "i" } },
						{ email: { $regex: req.session.searchTerm, $options: "i" } }
					]
				})
				.skip((currentPage - 1) * numberOfDocs)
				.limit(numberOfDocs);

			let search = true;

			res.render("admin/admin/sellercard", { user, userCount, totalPages, currentPage, search });
		} catch (err) {
			console.log(err);
		}
	},
	// controller for sorting the user
	sortUser: async (req, res) => {
		try {

			const { sortingLogic } = req.body;
		req.session.sortingLogic = sortingLogic;

		res.redirect("/admin/sortUserView");
			
		} catch (error) {
			console.log(error)
		}
		
	},
	// controller for viewing the sorted results
	sortUserView: async (req, res) => {
		try {

			let sortingLogic = req.session.sortingLogic;
		let currentPage = req.query.page ? parseInt(req.query.page) : 1;
		let numberOfDocs = 10;
		let user;
		let search;
		let userCount;
		if (sortingLogic === "alphaplus") {
			userCount = await userModel.find({}).sort({ firstname: 1 }).countDocuments();
			user = await userModel
				.find({})
				.sort({ firstname: 1 })
				.skip((currentPage - 1) * numberOfDocs)
				.limit(numberOfDocs);
		} else if (sortingLogic === "alphaminus") {
			userCount = await userModel.find({}).sort({ firstname: -1 }).countDocuments();
			user = await userModel
				.find({})
				.sort({ firstname: -1 })
				.skip((currentPage - 1) * numberOfDocs)
				.limit(numberOfDocs);
		}
		if (sortingLogic === "admin") {
			userCount = await userModel.find({ isAdmin: "true" }).countDocuments();
			user = await userModel
				.find({ isAdmin: "true" })
				.skip((currentPage - 1) * numberOfDocs)
				.limit(numberOfDocs);
		}
		if (sortingLogic === "blocked") {
			userCount = await userModel.find({ isBlocked: "true" }).countDocuments();
			user = await userModel
				.find({ isBlocked: "true" })
				.skip((currentPage - 1) * numberOfDocs)
				.limit(numberOfDocs);
		}
		const totalPages = Math.ceil(userCount / numberOfDocs);

		res.render("admin/admin/sellercard", { user, userCount, totalPages, currentPage, search });
			
		} catch (error) {
			console.log(error)
		}
		
	}
};
