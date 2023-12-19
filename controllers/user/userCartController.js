const userModel = require('../../models/userModel')
const cartModel = require('../../models/cartModel')
const couponModel = require('../../models/couponModel')
const productModel = require('../../models/productModel')

module.exports = {
    // controller for add to cart logic
          addToCart : async (req,res)=>{
                    try { 
                        const { _id, size, price, mrp, quantity, productname,stock,laststock,productTarget } = req.body;
                        const userId = req.session.userId;
                        console.log('productTarget' + productTarget)
                        if(!req.session.userId){
                            req.session.cart = true
                            res.redirect('/user/shop')
                            
                            
                        }else{
                       
                     

                            const productFinding = await productModel.findOne({ _id: _id });

                            if (productFinding) {
                                const sizeIndex = productFinding.size.findIndex(size => size._id.toString() === productTarget);
                            
                                if (sizeIndex !== -1) {
                                    productFinding.size[sizeIndex].lastStock = laststock;
                            
                                    await productFinding.save(); 
                            
                                    console.log('lastStock updated');
                                } else {
                                    console.log('Size not found');
                                   
                                }
                            } else {
                                console.log('Product not found');
                              
                            }
                    
                      
                      
          
                  
                      const existingCart = await cartModel.findOne({ userId: userId });
          
                      if (existingCart) {
                        const existingProductIndex = existingCart.products.findIndex(product => product.single_id.toString() == productTarget);
                        if (existingProductIndex !== -1) {
                           
                            if (existingCart.products[existingProductIndex].lastStock !== 0) {
                                existingCart.products[existingProductIndex].quantity += +quantity;
                            } else {

                                req.session.addToCartError = true
                                res.redirect(`/user/productdetail?_id=${_id}`);
                                return;
                            }
                        } else {
                           
                            if (laststock !== 0) {
                                existingCart.products.push({
                                    product_id: _id,
                                    single_id : productTarget,
                                    productName: productname,
                                    quantity: quantity,
                                    price: price,
                                    size: size,
                                    mrp: mrp,
                                    stock: stock,
                                    lastStock: laststock,
                                   
                                });
                            }
                            else {
                                res.redirect('/user/shop');
                                return; 
                            }
                        } 
                        

                                
                           
                        
                        
                        await existingCart.save();
                        
                     } else {
                        
                          const newCart = new cartModel({
                              userId: userId,
                              products: [{
                                  product_id: _id,
                                  single_id : productTarget,
                                  quantity: quantity,
                                  price: price,
                                  size: size,
                                  mrp: mrp,
                                  stock : stock,
                                  lastStock : laststock
                              }],
                            
                          });
                          
          
                          await newCart.save();
                      }
       
                      res.redirect('/user/showCart');
                    

                
                    }
                 } catch (error) {
                              console.log(error)
                    }
          } ,
        //   controller logic for showing cart
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
                //   controller logic for deleting cart
          deleteCart : async (req,res)=>{
                    try {
                           const {productId,singleid,productmainid} = req.query

                           console.log(singleid)
                           console.log(productmainid)
                              if(productId)
                              {
                                        await cartModel.updateOne({ 'products._id': productId }, { $pull: { products: { _id: productId } } });
                                        res.redirect('/user/showCart');
                              }
                              if(singleid && productmainid)
                              {

                                const productfind = await productModel.findOne({_id:productmainid})
                                const lastStock = productfind.size.find(item => item._id.toString() == singleid)
                                if(lastStock)
                                {
                                    lastStock.lastStock = lastStock.stock
                                    await productfind.save()
                                }
                                else
                                {
                                    console.log('couldnt find laststock')
                                }

                              }
                              else
                              {
                                console.log('couldnt find singleid and productmainid')
                              }


                    } catch (error) {
                              console.log(error)
                    }
          },
        //   controller logic for updating cart
          updateCart: async (req, res) => {
            const productId = req.query.productId;
            const { quantity,lastStock,productsingleid,productmainid} = req.body;
            console.log(quantity);
            console.log(productId);
           
            console.log(productsingleid)
            console.log(productmainid)
        
            try {
                const updatequantity = await cartModel.findOne(
                    { 'products._id': productId } 
                );


                
               
                if (updatequantity) {
                    const productToUpdate = updatequantity.products.find(product => product._id == productId);
                    if (productToUpdate) {
                        productToUpdate.quantity = quantity;
                        productToUpdate.lastStock = lastStock
                        if(lastStock <0)
                        {
                            productToUpdate.lastStock = 0
                        }
                        
                        console.log(`Updated Quantity: ${productToUpdate.quantity}`);
                        updatequantity.save();
                    } else {
                        console.log('Product not found in the cart.');
                    }
                }
    

                const products = await productModel.findOne({ _id: productmainid });

if (products) {
    const lastStockUpdate = products.size.find(item => item._id.toString() == productsingleid);
    
    if (lastStockUpdate) {
        lastStockUpdate.lastStock = lastStock;
        if(lastStock <= 0)
        {
            lastStockUpdate.lastStock = 0
        }
        console.log('New last stock updated');
        await products.save(); 
    } else {
        console.log('lastStockUpdate not found');
       
    }
} else {
    console.log('Product not found');
   
}


                res.json({ success: true }); 
            } catch (error) {
                console.error('Error:', error);
                res.status(500).json({ success: false, error: 'Internal Server Error' });
            }
        },
        // controller logic for checkout 
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
    //   controller logic for applying coupon
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
    },

 
      
}