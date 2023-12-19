const categoryModel = require("../../models/categoryModel");
const productModel = require("../../models/productModel");
const mongoose = require("mongoose");

module.exports = {
	// controller for creating the categories
	createCategory: async (req, res) => {
		try {
			const category = await categoryModel.find({});

			res.render("admin/admin/category", { category: category });
		} catch (error) {
			console.log(error);
		}
	},
	// controller for saving categories
	submitCategory: async (req, res) => {
		try {
			let errors = [];
			let category;
			const { categoryname, description } = req.body;
			const categories = await categoryModel.find({});
			const categoryNameToCompare = categoryname.toLowerCase().replace(/\s+/g, "");
			const existingCategoryName = categories.find((category) => {
				return category.categoryName.toLowerCase().replace(/\s+/g, "") === categoryNameToCompare;
			});
			if (categoryname === "" || description === "") {
				errors.push("Fill in properly");
			} else if (existingCategoryName) {
				errors.push("existing category");
			}
			if (errors.length > 0) {
				req.session.errorOccured = true;
				req.session.error = errors;
				res.redirect("/admin/createCategory");
			} else {
				const category = await new categoryModel({
					_id: new mongoose.Types.ObjectId(),
					categoryName: categoryname,
					description: description,
					createdOn: Date.now()
				});
				await category.save();
				await res.redirect("/admin/createCategory");
			}
		} catch (error) {
			console.log(error);
		}
	},
	// controller for editing the category
	editCategory: async (req, res) => {
		try {
			let errors = [];
			const categoryId = req.query.categoryId;
			const { categoryname, description } = req.body;
			const categories = await categoryModel.find({});
			const categoryNameToCompare = categoryname.toLowerCase().replace(/\s+/g, "");
			const existingCategoryName = categories.find((category) => {
				return category.categoryName.toLowerCase().replace(/\s+/g, "") === categoryNameToCompare;
			});
			if (categoryname === "" || description === "") {
				errors.push("Fill in properly");
			} else if (existingCategoryName) {
				errors.push("existing category");
			}
			if (errors.length > 0) {
				req.session.errorOccured = true;
				req.session.error = errors;
				res.redirect("/admin/createCategory");
			} else {
				const category = await categoryModel.updateOne(
					{ _id: categoryId },
					{ $set: { categoryName: categoryname, description: description, updatedOn: Date.now() } }
				);
				if (!category) {
					res.send("Category not found");
				} else {
					res.redirect("/admin/createCategory");
				}
			}
		} catch (err) {
			console.log(err);
			res.redirect("/user/error");
		}
	},

	//      controller for viewing the edit category
	viewEditCategory: async (req, res) => {
		const categoryId = req.query.categoryId;
		try {
			const category = await categoryModel.findById(categoryId);
			const show = await categoryModel.find({});
			if (!category) {
				res.send("Category not found");
			} else {
				res.render("admin/admin/editCategory", { category, show });
			}
		} catch (err) {
			console.log(err);
		}
	},
	//         controller for deleting the category
	deleteCategory: async (req, res) => {
		try {
			const categoryId = req.query.categoryId;
			const category = await categoryModel.deleteOne({ _id: categoryId });
			await productModel.deleteMany({ category: categoryId });
			if (!category) {
				res.send("Category not found");
			} else {
				res.redirect("/admin/createCategory");
			}
		} catch (err) {
			console.log(err);
		}
	},
	// controller for listing or unlisting the category
	listToggle: async (req, res) => {
		try {
			const categoryId = req.query.categoryId;
			const category = await categoryModel.findOne({ _id: categoryId });
			category.published = !category.published;

			const products = await productModel.find({ category: categoryId });

			for (const product of products) {
				product.isListed = !product.isListed;
				await product.save();
			}

			await category.save();

			res.redirect("/admin/createCategory");
		} catch (error) {
			console.error(error);
		}
	}
};
