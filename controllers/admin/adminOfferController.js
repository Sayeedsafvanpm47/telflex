const productModel = require('../../models/productModel')
const categoryModel = require('../../models/categoryModel')


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
                         
                    
    res.status(200).send({ message: 'Product details updated successfully.' });
                    
          },
          getCategoryOffer : async (req,res)=>{
                    try {
                              const category = await categoryModel.find({})
                              res.render('admin/admin/categoryOffers',{category})
                    } catch (error) {
                              
                    }
          },
          offerCategory : async (req, res) => {
                    try {
                              const { _id, discount } = req.body;
                              console.log(_id);
                              console.log(discount);
                            
                              // Fetch products that match the category
    const products = await productModel.find({ category: _id });

    // Update each product individually
    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      const updatedSize = product.size.map((item) => {
        // Update productDiscount for each item in size array
        return {
          ...item,
          productDiscount: discount,
          productPrice: item.mrp - (item.mrp * (discount / 100))
        };
      });

      // Update the size array in the product
      product.size = updatedSize;

      // Save the updated product
      await product.save();
    }
                              res.status(200).json({ message: 'Data received' });
                            } catch (error) {
                              console.log(error);
                              res.status(500).json({ error: 'Internal Server Error' });
                            }
                            
                  }
                  
}