const productModel = require("../../models/productModel");
const categoryModel = require('../../models/categoryModel')

module.exports = {
	addProductsView: async (req, res) => {
		try {
      const categories = await categoryModel.find({})
			res.render("admin/admin/addproducts",{categories});
		} catch (error) {
			res.send("couldnt fetch");
		}
	},
	addProducts: async (req, res) => {
          try {
              
            const { productname, productprice, productdiscount, productstock, cloth, size, model, feature, description, shortdescription, category } = req.body;
             
            if (
              (productname ||
                productprice ||
                productdiscount ||
                productstock ||
                cloth ||
                size ||
                model ||
                feature ||
                description ||
                shortdescription || category) === ""
            ) {
              res.send("fields should not be empty");
            }
      
            const products = await new productModel({ 
              productName: productname,
              productPrice: productprice,
              productDiscount: productdiscount,
              stock: productstock,
              cloth: cloth,
              model: model,
              category : category,
              size: size,
              description: description,
              shortDescription: shortdescription,
              createdOn: Date.now(),
              images : req.files.map(file=>file.path)
             
            });
      
           await products.save()
            res.redirect('/admin/addproducts');
          } catch (error) {
            // Handle error properly
          }
        },
        editProductsView : async (req,res)=>{
          try{
          const categories = await categoryModel.find({})
          res.render("admin/admin/editproducts",{categories});
        } catch (error) {
          res.send("couldnt fetch");
        }
      },
      viewProducts: async (req, res) => {
        try {
            const categories = await categoryModel.find({});
    
            // Get the selected category from the query parameter
            const selectedCategory = req.query.category;
    
            let products;
    
            if (selectedCategory) {
                // If a category is selected, filter products by category
                products = await productModel.find({ category: selectedCategory });
            } else {
                // If no category is selected, fetch all products
                products = await productModel.find({});
            }
    
           await res.render('admin/admin/viewProducts', { products, categories, selectedCategory });
        } catch (error) {
            console.error(error);
            res.send('Error');
        }
    }
    
};
