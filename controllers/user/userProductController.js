const userModel = require('../../models/userModel')
const productModel = require('../../models/productModel')
const categoryModel = require('../../models/categoryModel')

module.exports = {
          productGridView : async (req, res) => {
            try{
            let currentPage = req.query.page ? parseInt(req.query.page) : 1; 
            let numberOfDocs = 2;
            const category = await categoryModel.find({})
            console.log(category)
            const totalProductsCount = await productModel.countDocuments({isListed:true});
            const totalPages = Math.ceil(totalProductsCount / numberOfDocs); 
      
        
            const relatedProducts = ''; 
        
           

            let searchProducts; 

            if (req.session.search) {
           
        
              searchProducts = req.session.searchProducts
             delete req.session.search
        
            }

           else if(req.session.sort){
              searchProducts = req.session.sortedProducts
              delete req.session.sort
             
           }
           else if(req.session.sortPrice){
            searchProducts = req.session.priceSort
            delete req.session.sortPrice
        
           }
            
            else {
              
              searchProducts = await productModel.find({isListed : true})
                .skip((currentPage - 1) * numberOfDocs)
                .limit(numberOfDocs).populate({path:'category',model:'categories',select:'_id categoryName published'})
            }

         
          

                res.render('user/user/shopgrid', {
                    products: searchProducts,
                    category,
                    relatedProducts,
                    productCount: totalProductsCount,
                    totalPages,
                    currentPage,
               
                });
          
            }
          catch(error){
            console.log(error)
          }
        }
        
      ,
        
         
          sortProducts: async (req, res) => {
                    try {
                    
        
                      const categoryId = req.query.categoryId
                    
                  
               
                   
                 
                 
                  
                     
                      const products = await productModel.find({ 'category': categoryId}).populate({path:'category',model:'categories',select:'_id categoryName published'})
                      console.log('product found : ' + products)
                      
                      
                    

                     
                       req.session.sort = true
                       req.session.sortedProducts = products

                       res.redirect('/user/')
                  
                    
                 
                  
                    
                     
                    } catch (error) {
                      console.error(error);
                      res.status(500).send('Internal Server Error');
                    }
                  },
                  sortPrice: async (req, res) => {

              


                    const { sortingLogic } = req.body;
                  
                  
                 
                    
                  
                    let products;
                    if(sortingLogic === 'noprice'){
                              products = await productModel.find({}).populate({path:'category',model:'categories',select:'_id categoryName published'})
                              console.log('product found : ' + products)
                    }         
                  
                    else if (sortingLogic === 'price1') {
                              let minprice = +0
                              let maxprice = +5000
                      products = await productModel.find({
                        

                        'size.0.productPrice': { $gte: minprice, $lte: maxprice }
                      }).populate({path:'category',model:'categories',select:'_id categoryName published'})
                      console.log('product found : ' + products)
                     
                    } else if (sortingLogic === 'price2') {
                     
                              let minprice = +5001
                              let maxprice = +20000
                      products = await productModel.find({
                              'size.0.productPrice': { $gte: minprice, $lte: maxprice }
                      }).populate({path:'category',model:'categories',select:'_id categoryName published'})
                      console.log('product found : ' + products);
                     
                   
                     
                    }
                    else if (sortingLogic === 'price3') {
                              let minprice = +20001
                              let maxprice = +40000
                              products = await productModel.find({
                                        'size.0.productPrice': { $gte: minprice, $lte: maxprice }
                              }).populate({path:'category',model:'categories',select:'_id categoryName published'})
                              console.log('product found : ' + products);
                            }
                            else if (sortingLogic === 'price4') {
                              let minprice = +40001
                             
                              products = await productModel.find({
                                'size.0.productPrice': { $gte: minprice }
                              }).populate({path:'category',model:'categories',select:'_id categoryName published'})
                              console.log('product found : ' + products);
                            }
                            req.session.sortPrice = true
                            req.session.priceSort = products

               
                    
                    // res.render('user/user/shopgrid',{products,category,relatedProducts})
                    res.redirect('/user/')
                  }
                  ,
                  searchProducts : async (req,res)=>{

                   


                    const searchTerm = req.body.searchTerm
                    const products = await productModel.find({
                              productName: { $regex: searchTerm, $options: "i" } 
                             
                    }).populate({path:'category',model:'categories',select:'_id categoryName published'})
                    console.log('product found : ' + products)
                 
                  
                   
                    req.session.search = true
                    req.session.searchProducts = products
                    res.redirect('/user/')

                  },
                  productdetail : async (req,res)=>{
                    const _id = req.query._id
                    const category = await categoryModel.find({})
                    const products = await productModel.findById(_id)
                    const related = products.category
                   
                    const relatedProducts = await productModel.find({category:related})
                    console.log(relatedProducts)
                    res.render('user/user/productdetails',{products,category,relatedProducts})

                  },
                  showPrice:async (req,res) =>{
                   
                    let product =await productModel.findById(req.query.id)
                    res.status(200).json({product})
                  },
                
                  
                  

          
}

