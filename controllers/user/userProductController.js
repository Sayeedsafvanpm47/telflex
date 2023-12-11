const userModel = require('../../models/userModel')
const productModel = require('../../models/productModel')
const categoryModel = require('../../models/categoryModel')
const { USER } = require('../../utils/constants/schemaName');

module.exports = {

  pagination: async (req, res) => {
    try {
      delete req.session.sortbymenu
      let pagination = req.query.pagination;
      console.log(pagination);
      req.session.paginate = true;
      req.session.pagination = pagination;
res.redirect('/user/')
    } catch (error) {
      res.status(500).json({ error: 'An error occurred' });
    }
  },
         productGridView : async (req, res) => {
            try{
            let currentPage = req.query.page ? parseInt(req.query.page) : 1; 
            let numberOfDocs
            if(req.session.paginate)
            {
numberOfDocs = req.session.pagination

            }
            else
            {
             numberOfDocs = 2;
            }
            const category = await categoryModel.find({})
            console.log(category)
            const totalProductsCount = await productModel.countDocuments({isListed:true});
            const totalPages = Math.ceil(totalProductsCount / numberOfDocs); 
      
        
            let nopage
            const relatedProducts = ''; 
        
           

            let searchProducts; 

            if (req.session.search) {
           
        
              searchProducts = req.session.searchProducts
           nopage = true
             delete req.session.search
        
            }

           else if(req.session.sort){
              searchProducts = req.session.sortedProducts
               nopage = true
               delete req.session.sort
             
             
             
           }
           else if(req.session.sortPrice){
            searchProducts = req.session.priceSort
             nopage = true
            delete req.session.sortPrice
        
           }
           else if(req.session.sortbymenu)
           {
            searchProducts = req.session.sortBy
           
           
         
           }
            
            else {
               nopage = false
              searchProducts = await productModel.find({isListed : true})
                .skip((currentPage - 1) * numberOfDocs)
                .limit(numberOfDocs).populate({path:'category',model:'categories',select:'_id categoryName published'})
            }

         
          if(req.session.user){
           

                res.render('user/user/shopgrid', {
                    products: searchProducts,
                    category,
                    relatedProducts,
                    productCount: totalProductsCount,
                    totalPages,
                    currentPage,
                    nopage
               
                });
              }else
              {
               
                res.render('user/user/shopgrid', {
                  products: searchProducts,
                  category,
                  relatedProducts,
                  productCount: totalProductsCount,
                  totalPages,
                  currentPage,
                  nopage
             
              });

              }
              delete req.session.sortBy
              delete req.session.paginate
             
          
            }
          catch(error){
            console.log(error)
          }
        }
        
      ,
      sortBy: async (req, res) => {
        try {
          const sort = req.query.sort;
          console.log(sort);

          let currentPage = req.query.page ? parseInt(req.query.page) : 1; 
          let numberOfDocs = 5
     
           
          
      
          let products;
      
          if (sort === 'low') {
            products = await productModel.find({}).sort({ 'size.0.productPrice': 1 }).skip((currentPage - 1) * numberOfDocs)
            .limit(numberOfDocs).populate({path:'category',model:'categories',select:'_id categoryName published'});
          } else if (sort === 'high') {
            products = await productModel.find({}).sort({ 'size.0.productPrice': -1 }).skip((currentPage - 1) * numberOfDocs)
            .limit(numberOfDocs).populate({path:'category',model:'categories',select:'_id categoryName published'});
          } else if (sort === 'new') {
            products = await productModel.find({}).sort({ 'createdOn': -1 }).skip((currentPage - 1) * numberOfDocs)
            .limit(numberOfDocs).populate({path:'category',model:'categories',select:'_id categoryName published'});
          } else if (sort === 'old') {
            products = await productModel.find({}).sort({ 'createdOn': 1 }).skip((currentPage - 1) * numberOfDocs)
            .limit(numberOfDocs).populate({path:'category',model:'categories',select:'_id categoryName published'});
          } else {
          
            return res.redirect('/user/error');
          }
      
          req.session.sortbymenu = true;
          req.session.sortBy = products;
          return res.redirect('/user/');
        } catch (error) {
          console.log(error);
          // Handle the error appropriately, possibly redirecting to an error page
          return res.redirect('/user/error');
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
                                }).populate({ path: 'category', model: 'categories', select: '_id categoryName published' });
                                console.log('Products found: ', products);
                            
                     
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
                  searchProducts : async (req,res,next)=>{

                   try {
                    
                    const searchTerm = req.body.searchTerm
                    if(searchTerm == ''){
                      res.redirect('/user/')
                    }else
                    {
                    const products = await productModel.find({
                              productName: { $regex: searchTerm, $options: "i" } 
                             
                    }).populate({path:'category',model:'categories',select:'_id categoryName published'})
                    console.log('product found : ' + products)
                 
                 if(products.length > 0){
                   
                    req.session.search = true
                    req.session.searchProducts = products
                    res.redirect('/user/')
                 }else
                 {
                  const error = new Error("Unable to fetch the data");
                        error.status = 400;
                        error.isRestCall = true;
                        throw error;
                  
                 }
                    
                }
                   } catch (error) {
                    console.log(error)
                    next(error)
                   }



                  },
   
      

                  productdetail : async (req,res,next)=>{

                     try {
                      const _id = req.query._id
                      const category = await categoryModel.find({})
                      let errors;
                      let userlogged
                      if(req.session.user == true)
                      {
                        userlogged = true
                      }
                      
                      console.log(_id)

                     let fivestar = 0
                     let fourstar = 0
                     let threestar = 0
                     let twostar = 0
                     let onestar = 0
                      
                      const products = await productModel.findById(_id).populate({path:'category',model:'categories',select:'_id categoryName published'}).populate({path:'rating.userId',model:USER,select:'firstname'})
                      const related = products.category
                      const sum = products.rating.reduce((acc, item) => {
                        if (item.rating === 5) fivestar++;
                        else if (item.rating === 4) fourstar++;
                        else if (item.rating === 3) threestar++;
                        else if (item.rating === 2) twostar++;
                        else onestar++;
                      
                        return acc + item.rating;
                      }, 0);
                      
                      const overallrating = sum / products.rating.length;
                      
                      console.log('Overall rating:', overallrating);
                      console.log('Five Stars:', fivestar);
                      console.log('Four Stars:', fourstar);
                      console.log('Three Stars:', threestar);
                      console.log('Two Stars:', twostar);
                      console.log('One Star:', onestar);
                  
                    
                      
                      
                     


                    //   const lastStock = await cartModel.findOne({userId:req.session.userId}) || 50
                    //  let productStock = lastStock.products.find( stock => stock.product_id.toString() == _id)
                     
                      const relatedProducts = await productModel.find({category:related})
                      console.log(relatedProducts)
                    
                      if(!req.session.addToCartError){
                      if(products){
                     
                      res.render('user/user/productdetails',{products,category,relatedProducts,errors,userlogged,overallrating,fivestar,fourstar,threestar,twostar,onestar})
                      }
                      else
                      {
                       errors = 'Unable to fetch the data!'
                       res.render('user/user/productdetails',{products,category,relatedProducts,errors,userlogged,overallrating,fivestar,fourstar,threestar,twostar,onestar})
                      }
                    }else
                    {
                      const errors = 'Failed To add Item to Cart'
                      
                      delete req.session.addToCartError
                      res.render('user/user/productdetails', { products, category, relatedProducts, errors ,userlogged,overallrating,fivestar,fourstar,threestar,twostar,onestar});
                      

                    }
                     } catch (error) {
                      console.log('error')
next(error)
                      
                     }

                   

                  },
                  showPrice:async (req,res) =>{
                   try {
                    let product =await productModel.findById(req.query.id)
                    res.status(200).json({product})
                    
                   } catch (error) {
                    console.log(error)
                   }
              
                  },
                
                
                  
                  

          
}

