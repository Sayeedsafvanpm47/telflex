const userModel = require('../../models/userModel')
const cartModel = require('../../models/cartModel')

module.exports = {
          addToCart : async (req,res)=>{
                    try {
                        const userId = req.session.userId;
                        if(!req.session.userId){
                            req.session.cart = true
                            res.redirect('/user/shop')
                            
                            
                        }else{
                       
                      const { _id, size, price, mrp, quantity } = req.body;

                      
          
                   
                      const existingCart = await cartModel.findOne({ userId: userId });
          
                      if (existingCart) {
                     
                          existingCart.products.push({
                              product_id: _id,
                              quantity: quantity,
                              price: price,
                              size: size,
                              mrp: mrp
                          });
          
                          await existingCart.save();
                      } else {
                        
                          const newCart = new cartModel({
                              userId: userId,
                              products: [{
                                  product_id: _id,
                                  quantity: quantity,
                                  price: price,
                                  size: size,
                                  mrp: mrp
                              }]
                          });
          
                          await newCart.save();
                      }
          
                      res.redirect('/user/showCart');
                    }


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
                           
                              if(productId)
                              {
                                        await cartModel.updateOne({ 'products._id': productId }, { $pull: { products: { _id: productId } } });
                                        res.redirect('/user/showCart');
                              }

                    } catch (error) {
                              console.log(error)
                    }
          },
          updateCart: async (req, res) => {
            const productId = req.query.productId;
            const { quantity } = req.body;
            console.log(quantity);
            console.log(productId);
        
            try {
                const updatequantity = await cartModel.findOne(
                    { 'products._id': productId } 
                );
                if (updatequantity) {
                    const productToUpdate = updatequantity.products.find(product => product._id == productId);
                    if (productToUpdate) {
                        productToUpdate.quantity = quantity;
                        console.log(`Updated Quantity: ${productToUpdate.quantity}`);
                        updatequantity.save();
                    } else {
                        console.log('Product not found in the cart.');
                    }
                }
        
                res.json({ success: true }); 
            } catch (error) {
                console.error('Error:', error);
                res.status(500).json({ success: false, error: 'Internal Server Error' });
            }
        },
        
        checkOut: async (req, res) => {
          try {
              const userId = req.query.userId;
              const { totalamountcheckout } = req.body;
              
      
              const result = await cartModel.findOne({ userId: userId });
              result.total = totalamountcheckout;
              result.save();

              
              res.redirect('/user/checkoutpage')
          } catch (error) {
              console.log(error);
              res.status(500).json({ success: false, error: 'Internal Server Error' });
          }
      }
      
}