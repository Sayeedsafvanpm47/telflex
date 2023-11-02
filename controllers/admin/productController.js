const productModel = require("../../models/productModel");


module.exports = {
	addProductsView: async (req, res) => {
		try {
			res.render("admin/admin/addproducts");
		} catch (error) {
			res.send("couldnt fetch");
		}
	},
	addProducts: async (req, res) => {
          try {
              
            const { productname, productprice, productdiscount, productstock, cloth, size, model, feature, description, shortdescription } = req.body;
      
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
                shortdescription) === ""
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
};
