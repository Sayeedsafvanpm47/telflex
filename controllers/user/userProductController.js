const userModel = require('../../models/userModel')
const productModel = require('../../models/productModel')
const categoryModel = require('../../models/categoryModel')

module.exports = {
          productGridView : async (req,res)=>{
                    const products = await productModel.find({})
                    const category = await categoryModel.find({})
                  
                    
                    const relatedProducts = ''


   
       if(req.session.search)
        {
          const products = req.session.searchProducts
         
          res.render('user/user/shopgrid',{products,category,relatedProducts})
        }
        
        else{
          res.render('user/user/shopgrid',{products,category,relatedProducts})
        }
                   
          },
        
         
          sortProducts: async (req, res) => {
                    try {
                      const categoryName = req.query.categoryName
                      const category = await categoryModel.find({})
                  
               
                   
                 
                 
                  
                     
                      const products = await productModel.find({ category: categoryName});
                      
                      
                      
                      
                    

                     
                  
                       res.render('user/user/shopgrid',{products,category})
                  
                    
                 
                  
                    
                     
                    } catch (error) {
                      console.error(error);
                      res.status(500).send('Internal Server Error');
                    }
                  },
                  sortPrice: async (req, res) => {
                    const { sortingLogic } = req.body;
                  
                    const category = await categoryModel.find({})
                 
                    
                    const relatedProducts = ''
                    let products;
                    if(sortingLogic === 'noprice'){
                              products = await productModel.find({})
                    }         
                  
                    else if (sortingLogic === 'price1') {
                              let minprice = +0
                              let maxprice = +5000
                      products = await productModel.find({
                        

                        'size.productPrice': { $gte: minprice, $lte: maxprice }
                      });
                     
                    } else if (sortingLogic === 'price2') {
                     
                              let minprice = +5001
                              let maxprice = +20000
                      products = await productModel.find({
                              'size.productPrice': { $gte: minprice, $lte: maxprice }
                      });
                     
                   
                     
                    }
                    else if (sortingLogic === 'price3') {
                              let minprice = +20001
                              let maxprice = +40000
                              products = await productModel.find({
                                        'size.productPrice': { $gte: minprice, $lte: maxprice }
                              });
                            }
                            else if (sortingLogic === 'price4') {
                              let minprice = +40001
                             
                              products = await productModel.find({
                                'size.productPrice': { $gte: minprice }
                              });
                            }
                console.log(products)
                    
                    res.render('user/user/shopgrid',{products,category,relatedProducts})
                  }
                  ,
                  searchProducts : async (req,res)=>{
                    const searchTerm = req.body.searchTerm
                    const products = await productModel.find({
                              productName: { $regex: searchTerm, $options: "i" } 
                             
                    });
                 
                  
                   
                    req.session.search = true
                    req.session.searchProducts = products
                    res.redirect('/user/shop')

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

