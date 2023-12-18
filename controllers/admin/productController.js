const productModel = require("../../models/productModel");
const categoryModel = require("../../models/categoryModel");
const imageController = require('../../controllers/imageController')
const cartModel = require('../../models/cartModel')
const { USER } = require('../../utils/constants/schemaName');




module.exports = {
	addProductsView: async (req, res) => {
		try {
			const categories = await categoryModel.find({});
			res.render("admin/admin/addproducts", { categories });

		} catch (error) {
			res.status(404).send('erorr');
		}
	},
	addProducts: async (req, res, next) => {
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
					lastStock : req.body[`stock_${i}`],
					productid : Date.now()
          ,mrp : req.body[`mrp_${i}`],
	productDiscount : req.body[`prodisc_${i}`]
				});
			}
			// console.log('uploaded' + req.uploads)
			console.log('processed' + req.processImages)
			const { productname, productdiscount,  model, featured,features, description, shortdescription, category ,tags} =
				req.body;

			if (
				(!productname || !sizes ||
				
					!productdiscount ||
		
					!featured ||
					!model ||
					!features ||
					!description ||
					!shortdescription ||
					!category || !tags ||req.files.length === 0)
			) {
				errors.push('fields must be properly filled')
				res.render("admin/admin/addproducts", { errors , categories});
			}


else{
			const products = await new productModel({
				productName: productname,
				productDiscount: productdiscount,
				

				
				model: model,
				category: category,
				tags : tags,
				featured : featured,
				features : features,

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
			
				// productdiscount,
				featured,
	tags,
				features,
		
				model,
				mrp,
				description,
				shortdescription,
				category
			} = req.body;

if(!productname || !features || !featured || !tags || !model ||  !description || !shortdescription || !category)
{
	
	res.redirect('/admin/editProductsView?_id='+_id+'&errors=true')
	
	
	

}else {
	const processedImages = req.processedImages || [];
			let result = await productModel.findById(_id);
			console.log(result);
			if (req.files.length !== 0) {
				
				for (let i = 0; i < req.files.length; i++) {
					const imageUrl = processedImages[i]; 
					result.images.push(imageUrl); 
				        }
				      
    

			}
    
    
			result.productName = productname;
			// (result.productDiscount = productdiscount),
				(result.features = features),
				(result.featured = featured),
				(result.tags = tags),
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
        const productDiscount = parseFloat(req.body['productDiscount' + i])
            if (!isNaN(price) && !isNaN(stock)) {
                result.size[i].size = size;
                result.size[i].productPrice = price;
                result.size[i].stock = stock;
	      result.size[i].lastStock = stock
                result.size[i].mrp = mrp
	      result.size[i].productDiscount = productDiscount
            } else {
                console.log('Error: Invalid price or stock value');
            }
        }
        
        }
        
				
		await result.save();

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
		  let currentPage = req.query.page ? parseInt(req.query.page) : 1; 
		  let numberOfDocs = 8
		  const totalProductsCount = await productModel.countDocuments();
		  const totalPages = Math.ceil(totalProductsCount / numberOfDocs); 
		  let search = false
		  let nopage

		  
		  



		  let products;
	        if(!req.session.searchAdmin){
		  if (selectedCategory) {
		    products = await productModel.find({ category: selectedCategory })
		     nopage = false
		  } else {
		    products = await productModel.find({}).skip((currentPage - 1) * numberOfDocs)
		    .limit(numberOfDocs);
		    nopage = true
		
		
		
		
		  }
		}
		else
		{
res.redirect('/admin/searchProductsView')
		}
	        
		  // Render your view with the filtered products.
		  res.render("admin/admin/viewProducts", { products, categories, selectedCategory,productCount: totalProductsCount,
			totalPages,
			currentPage,search,nopage });
		} catch (error) {
		  console.error(error);
		  res.send("Error");
		}
	        },
	        
	searchProducts: async (req, res) => {
		try {
			let currentPage = req.query.page ? parseInt(req.query.page) : 1; 
			let numberOfDocs = 2
			const { searchTerm } = req.body;
			req.session.searchTerm = searchTerm
			
			
			res.redirect(`/admin/searchProductsView`);

		} catch (error) {
			console.error("Error:", error);
			res.status(500).send("Internal Server Error");
		}
	},
	searchProductsView: async (req, res) => {
		try {
			const searchTerm = req.session.searchTerm
			
			let currentPage = req.query.page ? parseInt(req.query.page) : 1; 
			let numberOfDocs = 2
			const totalProductsCount = await productModel.countDocuments({ productName: { $regex: searchTerm, $options: "i" } })
			const totalPages = Math.ceil(totalProductsCount / numberOfDocs); 
			const categories = await categoryModel.find({});
			let nopage = true
			
			const products = await productModel.find({ productName: { $regex: searchTerm, $options: "i" } }).skip((currentPage - 1) * numberOfDocs)
			.limit(numberOfDocs);
			
			req.session.searchAdmin = false
			let search = true

			res.render("admin/admin/viewproducts", { products, categories,productCount: totalProductsCount,
				totalPages,
				currentPage,search,nopage });
				
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
  },
  reviews: async(req,res)=>{
	try {
		let currentPage = req.query.page ? parseInt(req.query.page) : 1; 
		let numberOfDocs = 10
		const totalProductsCount = await productModel.countDocuments({rated:true})
		const totalPages = Math.ceil(totalProductsCount / numberOfDocs); 
		const reviews = await productModel.find({}).populate({path:'rating.userId',model:USER,select:'firstname'}).skip((currentPage - 1) * numberOfDocs)
		.limit(numberOfDocs)
		console.log(reviews)

		res.render('admin/admin/page-reviews',{reviews,totalPages,currentPage,})
		
	} catch (error) {
		console.log(error)
	}
},
reviewVisibility : async (req,res)=>{
	try {
		const {reviewId,productId} = req.query
		console.log(reviewId)
		console.log(productId)

		
		const reviewVisibility = await productModel.findOne({_id:productId})
		const changeReviewStatus = reviewVisibility.rating.find(review => review._id.toString() == reviewId)
		
		if(changeReviewStatus)
		{
			changeReviewStatus.hidden = !changeReviewStatus.hidden;
			await reviewVisibility.save()

		}
		else
		{
			console.log('could not update')
		}
		
	} catch (error) {
		console.log(error)
	}
}
};
