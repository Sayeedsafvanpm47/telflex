const productModel = require("../../models/productModel");
const categoryModel = require("../../models/categoryModel");


module.exports = {
	addProductsView: async (req, res) => {
		try {
			const categories = await categoryModel.find({});
			res.render("admin/admin/addproducts", { categories });

		} catch (error) {
			res.status(404).send('erorr');
		}
	},
	addProducts: async (req, res) => {
		const errors = []
		const categories = await categoryModel.find({});
		try {
			const sizes = [];
			const processedImages = req.processedImages || [];
			
			for (let i = 0; req.body[`size_${i}`] && req.body[`productprice_${i}`] && req.body[`stock_${i}`]; i++) {
				sizes.push({
					size: req.body[`size_${i}`],
					productPrice: req.body[`productprice_${i}`],
					stock: req.body[`stock_${i}`],
					productid : Date.now()
          ,mrp : req.body[`mrp_${i}`]
				});
			}
			// console.log('uploaded' + req.uploads)
			console.log('processed' + req.processImages)
			const { productname, productdiscount,  model, features, description, shortdescription, category } =
				req.body;

			if (
				(!productname || !category || !sizes ||
				
					!productdiscount ||
		
					
					!model ||
					!features ||
					!description ||
					!shortdescription ||
					!category ||req.files.length === 0)
			) {
				errors.push('fields must be properly filled')
				res.render("admin/admin/addproducts", { errors , categories});
			}


else{
			const products = await new productModel({
				productName: productname,
				productDiscount: productdiscount,
				isFeatured : features,

				
				model: model,
				category: category,

				description: description,
				shortDescription: shortdescription,
				createdOn: Date.now(),
				images: processedImages,
				size: sizes,
       
			})

			await products.save();
			res.redirect("/admin/addproducts");
		}
		} catch (error) {
			console.log(error);
			errors.push('some error occured')
				res.render("admin/admin/addproducts", { errors,categories });
		}
	},
	editProductsView: async (req, res) => {
		try {
			
			const _id = req.query._id;
const errors = req.query.errors
			const categories = await categoryModel.find({});

			const products = await productModel.findById(_id);
		
			res.render("admin/admin/editproducts", { categories, products, _id ,errors});
		
		} catch (error) {
			req.session.isProduct = _id;
			console.log(_id);
			res.status(404).send('error')
			
		}
	},
	editProducts: async (req, res) => {
		try {
			const _id = req.query._id;
			const {
				productname,
			
				productdiscount,
	
				features,
		
				model,
				mrp,
				description,
				shortdescription,
				category
			} = req.body;

if(!productname || !productdiscount || !features || !model ||  !description || !shortdescription || !category)
{
	
	res.redirect('/admin/editProductsView?_id='+_id+'&errors=true')
	
	
	

}else {
			let result = await productModel.findById(_id);
			console.log(result);
			if (req.files.length !== 0) {
				
        for (let i = 0; i<req.files.length;i++) { 
          result.images[result.images.length] = req.files[i].path
        }
    

			}
    
    
			result.productName = productname;
			(result.productDiscount = productdiscount),
				(result.isFeatured = features),
				(result.model = model),
				(result.category = category),
				(result.description = description),
				(result.shortDescription = shortdescription),
        (result.mrp = mrp)

        for (let i = 0; i < result.size.length; i++) {
        
       
          for (let i = 0; i < result.size.length; i++) {
            const size = req.body['productsize' + i];
            const price = parseFloat(req.body['productprice' + i]);
            const stock = parseFloat(req.body['productstock' + i]);
            const mrp = parseFloat(req.body['productmrp' + i])
        
            if (!isNaN(price) && !isNaN(stock)) {
                result.size[i].size = size;
                result.size[i].productPrice = price;
                result.size[i].stock = stock;
                result.size[i].mrp = mrp
            } else {
                console.log('Error: Invalid price or stock value');
            }
        }
        
        }
        
				
		await	result.save();

			if (!result) {
				return res.status(404).send("Product not found");
			}

			res.redirect("/admin/viewProducts");
		}
		} catch (error) {
			console.error(error);
			res.status(500).send("Error updating product");
		}
	},
  toggleList: async (req, res) => {
    try {
      const _id = req.query._id;
      const product = await productModel.findById(_id);
  
      if (product) {
     
        product.isListed = !product.isListed;
  
     
        await product.save();
  
        res.redirect('/admin/viewProducts');
      } else {
        res.send('Product not found');
      }
    } catch (error) {
      console.error(error);
      res.status(500).send('An error occurred');
    }
  }
  
,
	deleteImage: async (req, res) => {
		try {
			const { _id, imagePath } = req.query;

			const product = await productModel.findOneAndUpdate(
				{ _id: _id },
				{ $pull: { images: imagePath } }, 
				{ new: true }
			);

			if (!product) {
				return res.status(404).send("Product not found");
			}

			res.redirect("/admin/editProductsView?_id=" + _id);
		} catch (err) {
			console.error(err);
			res.status(500).send("Error deleting image");
		}
	},
	viewProducts: async (req, res) => {
		try {
		  const categories = await categoryModel.find({});
		  const selectedCategory = req.query.category;
		  let products;
	        
		  if (selectedCategory) {
		    products = await productModel.find({ category: selectedCategory });
		  } else {
		    products = await productModel.find({});
		
		
		
		
		  }
	        
		  // Render your view with the filtered products.
		  res.render("admin/admin/viewProducts", { products, categories, selectedCategory });
		} catch (error) {
		  console.error(error);
		  res.send("Error");
		}
	        },
	        
	searchProducts: async (req, res) => {
		try {
			const { searchTerm } = req.body;
			const products = await productModel.find({ productName: { $regex: searchTerm, $options: "i" } });
			req.session.searchResults = products;
			res.redirect("/admin/searchProductsView");
		} catch (error) {
			console.error("Error:", error);
			res.status(500).send("Internal Server Error");
		}
	},
	searchProductsView: async (req, res) => {
		try {
			const categories = await categoryModel.find({});
			const products = req.session.searchResults || [];
			res.render("admin/admin/viewproducts", { products, categories });
		} catch (err) {
			console.log(err);
		}
	},deleteProducts : async (req,res)=>{
    const _id = req.query._id
    const product = await productModel.findById(_id)
    if(product)
    {
       await productModel.findByIdAndDelete(_id)
    }else{
      res.send('product not found')
    }
    res.redirect('/admin/viewProducts')
  }
};
