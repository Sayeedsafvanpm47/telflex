const productModel = require('../../models/productModel')


module.exports = {
          getproductOffer : async (req,res)=>{
                    try {
                              // const products = await productModel.find({})
                              const products = await productModel.aggregate([{$unwind:'$size'},{$project:{'size.size' : 1,
                    'size.productPrice' :1,
                    'size.stock' : 1,
                    'size._id':1,
                    'size.mrp' : 1,
                    'productName' : 1,
                    'productDiscount' : 1,
                    '_id' : 1,
                    'images' : 1
                    ,
                    'shortDescription' : 1,
                    'size.productDiscount' : 1

                    }}])
                              
                             
                              res.render('admin/admin/productOffers',{products})
                    } catch (error) {
                              console.log(error)
                    }
          },
          productOffer : async (req,res)=>{
                    const {newDiscount,newPrice,_id,variantId} = req.body
                    console.log(newDiscount)
                    console.log(newPrice)
                    console.log(variantId)

                    await productModel.updateOne(
                              {
                                _id: _id,
                                'size._id': variantId 
                              },
                              {
                                $set: {
                                  'size.$.productDiscount': newDiscount, 
                                  'size.$.productPrice': newPrice 
                                }
                              }
                            );
                            
                    
          }
}