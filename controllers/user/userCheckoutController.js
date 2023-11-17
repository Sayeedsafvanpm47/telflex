const userModel = require('../../models/userModel')
const cartModel = require('../../models/cartModel')
const orderModel = require('../../models/orderModel')
const productModel = require('../../models/productModel')
const { USER } = require('../../utils/constants/schemaName');

module.exports = {
          checkOutPage : async (req,res)=>{
                    try {
                              const user = req.session.userId
                              console.log(user);
                              const cart = await cartModel.findOne({userId : user}).populate({
                                        path: 'userId',
                                        model: USER,
                                        select: 'firstname email address', 
                                      }).populate({
                                        path: 'products.product_id',
                                        model: 'products',
                                        select: 'images productName size productDiscount',
                                    })
                                   console.log(cart.total)
                              res.render('user/user/shop-checkout',{cart})
                              
                    } catch (error) {
                              console.log(error);
                    }
          },
          addAddress : async (req,res)=>{

            try {
        
              const userId = req.session.userId
            const {name,phonenumber,pincode,address,city,state,landmark,addresstype,addressmode} = req.body
            await userModel.updateOne({_id : userId},{$push:{address : [{name:name,phone:phonenumber,pincode:pincode,Address:address,city:city,state:state,landmark:landmark,Addresstype:addresstype,addressmode:addressmode}]}})
            res.redirect('/user/checkoutpage')
              
            } catch (error) {
              console.log(error)
            }
            
            
        
          },
        placeOrder: async (req, res) => {
    const userId = req.session.userId;
    const ordered = [];
    let total = 0;

    const { selectedAddressDetails, payment_option } = req.body;


    try {
        const cart = await cartModel.findOne({ userId: userId }).populate({
            path: 'userId',
            model: USER,
            select: 'firstname email address',
        }).populate({
            path: 'products.product_id',
            model: 'products',
            select: 'images productName size productDiscount',
        });
      

        if (cart && cart.products) {
            total = cart.total;

            for (let i = 0; i < cart.products.length; i++) {
                const product = cart.products[i];

                ordered.push({
                    productId: product.product_id,
                    quantity: product.quantity,
                    size: product.size,
                    price: product.price,
                    mrp: product.mrp,
                    
                });


            


            
            }
        } else {
            console.log('Error occurred');
        }
        if (!selectedAddressDetails) {
            return res.status(400).json({ message: 'Address details not selected' });
        }
      
       const address = cart.userId.address[selectedAddressDetails]
  

      
       
       
        const order = new orderModel({
            userId: userId,
            orderId:Date.now(),
            items: ordered,
            paymentMethod: payment_option,
            totalAmount: total,
            address: address,
        });
        if(cart.total<=0){
            res.redirect('/user/checkoutpage')
        }

        await order.save();

for (let i = 0; i < ordered.length; i++) {
    const orderedItem = ordered[i];

 
    const product = await productModel.findById(orderedItem.productId);

    if (product) {
     
        product.size.forEach((sizeObj) => {
            if (sizeObj.size === orderedItem.size) {
                sizeObj.stock -= orderedItem.quantity;
            }
        });

     
        await product.save();
    } else {
        console.log(`Product with ID ${orderedItem.productId} not found`);
    }
}


        cart.products = []
        cart.total = 0
        await cart.save()
        res.status(200).json({ message: 'Order placed successfully' });
    } catch (error) {
        console.error('Error placing order:', error);
        res.status(500).json({ message: 'Error placing order' });
    }
}
}