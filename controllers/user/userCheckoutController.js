const userModel = require('../../models/userModel')
const cartModel = require('../../models/cartModel')
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
          placeOrder : async (req,res)=>{
            const userId = req.session.userId
            const {selectedAddress,creditcard,netbanking,paypal,stripe,cashondelivery} = req.body 

          }
}