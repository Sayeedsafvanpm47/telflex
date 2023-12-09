const wishlistModel = require('../../models/wishlist')
const cartModel = require('../../models/cartModel')




module.exports = {
          addToWish: async (req, res) => {
                    try {
                        const userId = req.session.userId;
                        const { productId, size, price, mrp, quantity, disc, stock,id } = req.body;
                
                        const existingWishlist = await wishlistModel.findOne({ userId: userId });
                
                        if (existingWishlist) {
                            let productExist = false;
                
                            for (const item of existingWishlist.products) {
                                if (item.product_id == id) {
                                    productExist = true;
                                  
                                    item.quantity += +quantity;
                                    break;
                                }
                            }
                
                            if (!productExist) {
                                existingWishlist.products.push({
                                    product_id: id,
                                    stock: stock,
                                    quantity: quantity,
                                    price: price,
                                    size: size,
                                    disc: disc,
                                    mrp: mrp,
                                    proid : productId
                                });
                            }
                
                            await existingWishlist.save();
                        } else {
                            const newWishList = new wishlistModel({
                                userId: userId,
                                products: [{
                                    product_id: id,
                                    stock: stock,
                                    quantity: quantity,
                                    price: price,
                                    size: size,
                                    disc: disc,
                                    mrp: mrp,
                                    proid : productId
                                }]
                            });
                
                            await newWishList.save();
                        }
                res.status(200).json({message : 'success'})
                       
                    } catch (error) {
                        console.log(error);
                        // Handle the error
                        res.status(500).send('Internal Server Error');
                    }
                }
,                
showWishList : async (req,res)=>{
          try {
                  
                    if(req.session.userId)
                    {
                              const userId = req.session.userId
                              const wishlist = await wishlistModel.findOne({userId:userId}).populate(
                                        'products.product_id'

                              )
                           
                              res.render('user/user/shop-wishlist',{wishlist})
                    }
                    
          } catch (error) {
                    console.log(error)
          }
},
deleteWish : async (req,res)=>{
          try {
                    const { id } = req.query; 
                  
                    await wishlistModel.updateOne(
                        { userId: req.session.userId }, 
                        { $pull: { products: { proid : id } } }
                    );
            
                    res.redirect('/user/showwishlist')
                } catch (error) {
                    console.error(error);
                    res.status(500).json({ error: 'Internal Server Error' });
                }
          
},
addFromWish : async (req,res)=>{
    try{
        let productFound = false
    const userId = req.session.userId
    const { id } = req.query
    console.log(id)
    const list = await wishlistModel.findOne({userId:userId})
    console.log(list)
    console.log(list.products)
    const cart = []
    for (const product of list.products) {
        if (product.proid.toString() === id) { 
            productFound = true;
            cart.push(product); 
            break;
        }
    }

    if(productFound)
    {

        const cartFound = await cartModel.findOne({ userId: userId });

        
        cartFound.products = cartFound.products.concat(cart);

        await cartFound.save();
        res.redirect('/user/showCart');

    }
    else
    {
        res.redirect('/user/showwishlist')
    }
}catch (error)
{
    console.log(error)
}

},


}