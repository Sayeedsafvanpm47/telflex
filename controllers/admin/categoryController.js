const categoryModel = require("../../models/categoryModel");
const productModel = require('../../models/productModel')
const mongoose = require('mongoose')

module.exports = {
	createCategory: async (req, res) => {
		let errors = req.session.error
		const category = await categoryModel.find({});
		if(req.session.errorOccured)
		{
			
			delete req.session.errorOccured
		 res.render("admin/admin/category", { category:category,errors });
		}
		else
		{
			res.render("admin/admin/category", { category:category,errors });
		}
	},
	submitCategory: async (req, res) => {
		let errors = []
		let category
		const { categoryname, description } = req.body;
		const categories = await categoryModel.find({})
		const categoryNameToCompare = categoryname.toLowerCase().replace(/\s+/g, '');
		const existingCategoryName = categories.find(category => {
			return category.categoryName.toLowerCase().replace(/\s+/g, '') === categoryNameToCompare;
		      });
		if (categoryname === "" || description === "") {
			errors.push('Fill in properly')
		}
		else if(existingCategoryName){
			errors.push('existing category')
		}
		if (errors.length > 0) {
			req.session.errorOccured = true
			req.session.error = errors
			res.redirect('/admin/createCategory')
		}
		
		else {
			const category = await new categoryModel({
				_id : new mongoose.Types.ObjectId(),
				categoryName: categoryname,
				description: description,
				createdOn: Date.now()
			});
			await category.save();
			await res.redirect("/admin/createCategory");
		}
	},
	// editCategory function
editCategory: async (req, res) => {
	try {
		let errors = []
		const categoryId = req.query.categoryId
	  const { categoryname, description } = req.body;
	  const categories = await categoryModel.find({})
	  const categoryNameToCompare = categoryname.toLowerCase().replace(/\s+/g, '');
		const existingCategoryName = categories.find(category => {
			return category.categoryName.toLowerCase().replace(/\s+/g, '') === categoryNameToCompare;
		      });
	  if (categoryname === "" || description === "") {
		errors.push('Fill in properly')
	}
	else if(existingCategoryName){
		errors.push('existing category')
	}
	if (errors.length > 0) {
		req.session.errorOccured = true
		req.session.error = errors
		res.redirect('/admin/createCategory')
	} else {
	    const category = await categoryModel.updateOne({ _id: categoryId },{$set : {categoryName : categoryname,description : description, updatedOn : Date.now()}});
	    if (!category) {
	      res.send('Category not found');
	    } else {
	      res.redirect('/admin/createCategory');
	    }
	  }
	} catch (err) {
	  console.log(err);
	  res.send('Error occurred');
	}
        },
        
	        
	        viewEditCategory: async (req, res) => {
		const categoryId = req.query.categoryId; 
		try {
		  const category = await categoryModel.findById(categoryId);
		  const show = await categoryModel.find({})
		  if (!category) {
		    res.send('Category not found');
		  } else {
		    res.render('admin/admin/editCategory', { category,show });
		  }
		} catch (err) {
		  console.log(err);
		  res.send('Error occurred');
		}
	        },
	        deleteCategory: async (req, res) => {
		try {
		  const categoryId = req.query.categoryId;
		  const category = await categoryModel.deleteOne({_id:categoryId});
		  if (!category) {
		 
		    res.send('Category not found');
		  } else {
		    res.redirect('/admin/createCategory');
		  }
		} catch (err) {
		  console.log(err);
		  res.send('Error occurred');
		}
	        }
	        ,
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
	      
		    res.redirect('/admin/createCategory');
		} catch (error) {
		    console.error(error);
		    res.status(500).send('Internal Server Error');
		}
	      }
	      
	    
	
	    
};
