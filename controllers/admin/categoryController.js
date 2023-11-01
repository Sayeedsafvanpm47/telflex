const categoryModel = require("../../models/categoryModel");

module.exports = {
	createCategory: async (req, res) => {
		const category = await categoryModel.find({});
		 res.render("admin/createCategory", { category });
	},
	submitCategory: async (req, res) => {
		const { categoryname, description } = req.body;
		if (categoryname === "" || description === "") {
			res.send("fill properly");
		} else {
			const category = await new categoryModel({
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
		const categoryId = req.query.categoryId
	  const { categoryname, description } = req.body;
	  if (categoryname === '' || description === '') {
	    res.send('Fields shouldn\'t be empty');
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
		  if (!category) {
		    res.send('Category not found');
		  } else {
		    res.render('admin/editCategory', { category });
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
	        
	    
	
	    
};
