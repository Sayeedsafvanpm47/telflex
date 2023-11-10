const userModel = require('../../models/userModel')
const cartModel = require('../../models/cartModel')

module.exports = {
          addToCart : async (req,res)=>{
                    try {
                       
                              const {_id,productname,category,size,price,mrp,discount,quantity} = req.body
                           
                              const cart = await new cartModel({
                                        userId : req.session.userId,
                                        products : [{
                                         product_id : _id,
                                         quantity : quantity,
                                         price : price,
                                         size : size,
                                         mrp : mrp
                                        }]

                              })
                              await cart.save();
                             res.redirect('/user/showCart')
                              // console.log(size)
                              // console.log(price);
                              // console.log(mrp);
                              // console.log(stock);

                              // console.log(productname)
                              // console.log(product.product_id)


                    } catch (error) {
                              console.log(error)
                    }
          } ,
          showCart: async (req, res) => {
                    try {
                      const userId = req.session.userId;
                      const user = await userModel.find({userId : userId})
                      const cart = await cartModel.find({ userId: userId }).populate('products.product_id');
                   console.log(cart)
                      res.render('user/user/shop-cart', { cart:cart,user });
                    } catch (error) {
                      console.log(error);
                      res.status(500).send('Internal Server Error');
                    }
                  },
          deleteCart : async (req,res)=>{
                    try {
                              productId = req.query.productId
                              console.log(productId)
                              if(productId)
                              {
                                        await cartModel.updateOne({ 'products._id': productId }, { $pull: { products: { _id: productId } } });
                                        res.redirect('/user/showCart');
                              }
                              

                    } catch (error) {
                              console.log(error)
                    }
          }
                  
}