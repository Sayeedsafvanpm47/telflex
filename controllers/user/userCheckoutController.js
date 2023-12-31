const userModel = require('../../models/userModel')
const cartModel = require('../../models/cartModel')
const orderModel = require('../../models/orderModel')
const productModel = require('../../models/productModel')
const { USER } = require('../../utils/constants/schemaName');
const couponModel = require('../../models/couponModel')

require('dotenv').config()
const Razorpay = require('razorpay');
const { v4 :uuidv4 } = require('uuid');

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_ID,
    key_secret: process.env.RAZORPAY_KEY
});

module.exports = {
          checkOutPage : async (req,res)=>{
                    try {
                        if(req.session.checkOut){
                            delete req.session.checkOut

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
                                }
                                else
                                {
                                    res.redirect('/user/showCart')
                                }
                              
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
    const currentDate = new Date();
    // const returnExpiry = new Date(currentDate.getTime() + (2 * 60 * 1000));
      
       const returnExpiry = new Date(currentDate.getTime() + (15 * 24 * 60 * 60 * 1000))
    console.log((returnExpiry.toISOString()))

    const { selectedAddressDetails, payment_option } = req.body;
console.log(payment_option)

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
        console.log(cart)
        console.log(cart.couponApplied)
        console.log(cart.couponCode)
        let couponName
       let applied
       if(cart.couponApplied === 'true')
       {
        console.log('true')
        
         couponName = cart.couponCode
         applied = true
         await couponModel.updateOne(
            { couponCode: couponName },
            { $push: { redemptionHistory: {userId:userId,redeemedAt:new Date()} } }
          );
          console.log(couponName)
          
       }
       else
       {
        console.log('false')
        couponName = null
        applied = false
       }

      

        if (cart && cart.products) {
            total = cart.total;

            for (let i = 0; i < cart.products.length; i++) {
                const product = cart.products[i];

                ordered.push({
                    productId: product.product_id,
                    productName : product.productName,
                    quantity: product.quantity,
                    size: product.size,
                    price: product.price,
                    mrp: product.mrp,
                    returnExpiry : (returnExpiry).toISOString()
                    
                });


            


            
            }
            console.log(ordered)
        } else {
            console.log('Error occurred');
        }
        if (!selectedAddressDetails) {
            return res.status(400).json({ message: 'Address details not selected' });
        }
      
       const address = cart.userId.address[selectedAddressDetails]

       let paymentMethod;
        if (payment_option === 'Razorpay') {
           paymentMethod = 'Razorpay';
           console.log('selected ADdress ' + selectedAddressDetails)
           if (!selectedAddressDetails) {
            return res.status(400).json({ error: 'Address details not selected' });
        }

           const razorpayOrder = await razorpay.orders.create({
            amount: total * 100, 
            currency: 'INR',
            receipt: uuidv4(), 
            payment_capture: 1
        });

      
   
        

        return res.status(200).json({ order: razorpayOrder });
       }  
       
   
      
        const order = new orderModel({
            userId: userId,
            orderId:Date.now(),
            items: ordered,
            paymentMethod: payment_option,
            totalAmount: total,
            address: address,
            orderDate : new Date(),
            couponName : couponName,
            couponApplied : applied

            
            
        });
        if(payment_option ==='razorpay'){
            order.paymentStatus = 'Paid'
        }
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
        cart.couponApplied = 'false'
        
        await cart.save()
        res.status(200).json({ message: 'Order placed successfully' });

    } catch (error) {
        console.error('Error placing order:', error);
        res.status(500).json({ message: 'Error placing order' });
    }
},




}