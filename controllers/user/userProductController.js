const userModel = require('../../models/userModel')
const productModel = require('../../models/productModel')
const categoryModel = require('../../models/categoryModel')

module.exports = {
          productGridView : async (req,res)=>{
                    const products = await productModel.find({})
                    const category = await categoryModel.find({})
                    
        if(req.session.isSort){
                   const products = req.session.sort
                    res.render('user/user/shopgrid',{products,category})
        }else if(req.session.priceSort)
        {
          const products = req.session.price
          {
                    res.render('user/user/shopgrid',{products,category})
          }
        }
        else if(req.session.search)
        {
          const products = req.session.searchProducts
          res.render('user/user/shopgrid',{products,category})
        }
        
        else{
          res.render('user/user/shopgrid',{products,category})
        }
                   
          },
          productGrid : async (req,res)=>{
                    
          },
         
          sortProducts: async (req, res) => {
                    try {
                      const categoryName = req.query.categoryName
                      
                    
                  
                     
                      const products = await productModel.find({ category: categoryName});
                  
                  
                    
                      req.session.isSort = true;
                      req.session.sort = products;
                  
                    
                      res.redirect('/user/shop');
                    } catch (error) {
                      console.error(error);
                      res.status(500).send('Internal Server Error');
                    }
                  },
                  sortPrice: async (req, res) => {
                    const { sortingLogic } = req.body;
                    let sort;
                    if(sortingLogic === 'noprice'){
                              sort = await productModel.find({})
                    }         
                  
                    else if (sortingLogic === 'price1') {
                              let minprice = +0
                              let maxprice = +5000
                      sort = await productModel.find({
                        

                        'size.productPrice': { $gte: minprice, $lte: maxprice }
                      });
                    } else if (sortingLogic === 'price2') {
                              let minprice = +5001
                              let maxprice = +20000
                      sort = await productModel.find({
                              'size.productPrice': { $gte: minprice, $lte: maxprice }
                      });
                    }
                    else if (sortingLogic === 'price3') {
                              let minprice = +20001
                              let maxprice = +40000
                              sort = await productModel.find({
                                        'size.productPrice': { $gte: minprice, $lte: maxprice }
                              });
                            }
                            else if (sortingLogic === 'price4') {
                              let minprice = +40001
                             
                              sort = await productModel.find({
                                'size.productPrice': { $gte: minprice }
                              });
                            }
                    console.log("Sorting Logic: ", sortingLogic);
                    console.log("Products: ", sort);
                    req.session.priceSort = true;
                    req.session.price = sort; 
                    res.redirect('/user/shop');
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
                    res.render('user/user/productdetails',{products,category})

                  },
                  showPrice:async (req,res) =>{
                    console.log("ingatt vannu");
                    let product =await productModel.findById(req.query.id)
                    res.status(200).json({product})
                  }
          
}

