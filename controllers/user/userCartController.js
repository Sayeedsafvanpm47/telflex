const userModel = require('../../models/userModel')
const cartModel = require('../../models/cartModel')
const couponModel = require('../../models/couponModel')

module.exports = {
          addToCart : async (req,res)=>{
                    try {
                        const userId = req.session.userId;
                        if(!req.session.userId){
                            req.session.cart = true
                            res.redirect('/user/shop')
                            
                            
                        }else{
                       
                      const { _id, size, price, mrp, quantity, productname } = req.body;

                      
          
                   
                      const existingCart = await cartModel.findOne({ userId: userId });
          
                      if (existingCart) {
                     
                          existingCart.products.push({
                              product_id: _id,
                              productName : productname,
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
                      const coupons = await couponModel.find({})
                     console.log('coupons')
                     console.log(coupons)
                    
    const coupon = [];

    for (const couponFound of coupons) {
        let userRedeemed = false;
     
        
        for (const history of couponFound.redemptionHistory) {
            if (history.userId.toString() === userId) {
                userRedeemed = true;
                break;
            }
        }
      
     const status = couponFound.status === 'active';

    // Add the coupon if the user hasn't redeemed it and it's active
    if (!userRedeemed && status) {
        coupon.push(couponFound);
    }
   
 
    }
    console.log(coupon)
                   console.log(cart)
                      res.render('user/user/shop-cart', { cart:cart,user,coupon });
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
              const { totalamountcheckout,subtotalamountcheckout,appliedCoupon } = req.body;
            
           
             
             
           
      
              const result = await cartModel.updateOne({ userId: userId },{$set:{total:totalamountcheckout,subtotal:subtotalamountcheckout}},{upsert:true});
            console.log('subtotal2')
            
             const cart = await cartModel.findOne({userId : userId})
             console.log(cart.subtotal)
             console.log(cart.total)
              if(cart.subtotal == cart.total)
              {
                console.log('equal')
                var apply = 'null'
                var coupon = ''
              }
              else
              {
                console.log('greater')
                apply = 'true'
                 coupon = appliedCoupon
              }
              await cartModel.updateOne({userId:userId},{$set:{couponApplied:apply,couponCode:coupon},},{upsert:true})

              req.session.checkOut = true
              res.redirect('/user/checkoutpage')
          } catch (error) {
              console.log(error);
              res.status(500).json({ success: false, error: 'Internal Server Error' });
          }
      },
      applyCoupon: async (req, res) => {
        try {
            const userId = req.session.userId
            const  coupon  = req.query.coupon;
            console.log(coupon)
            const couponFound = await couponModel.findOne({ couponCode: coupon });
            
            
           
    
            if (!couponFound) {
                return res.status(404).json({ message: 'Coupon not found' });
            }

            const redemptionHistory = couponFound.redemptionHistory;
        let userRedeemed = false;

        for (const history of redemptionHistory) {
            if (history.userId.toString() === userId) {
                userRedeemed = true;
                break;
            }
        }

        if (userRedeemed) {
            return res.status(404).json({ message: 'Coupon has already been used' });
        }
           
              console.log(couponFound)
              console.log(coupon.discount)
           const discount = couponFound.discount
           
            return res.status(200).json({ discount });
    
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
      
}