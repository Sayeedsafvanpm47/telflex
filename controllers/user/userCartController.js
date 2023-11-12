const userModel = require('../../models/userModel')
const cartModel = require('../../models/cartModel')

module.exports = {
          addToCart : async (req,res)=>{
                    try {
                       
                      const { _id, productname, category, size, price, mrp, discount, quantity } = req.body;

                      const userId = req.session.userId;
          
                   
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
            const user = req.session.userId
            const { quantity,total } = req.body;
            console.log(quantity);
            console.log(productId);
            console.log(total)
        
            try {
                const updatequantity = await cartModel.findOne(
                    { 'products._id': productId } 
                );
               updatequantity.products[0].quantity = quantity
           
                updatequantity.total = total
      
               updatequantity.save()
        
                res.json({ success: true }); 
            } catch (error) {
                console.error('Error:', error);
                res.status(500).json({ success: false, error: 'Internal Server Error' });
            }
        }
          
}