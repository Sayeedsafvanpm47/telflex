const orderModel = require('../../models/orderModel');
const productModel = require('../../models/productModel');
const { listeners } = require('../../models/userModel');
const { USER } = require('../../utils/constants/schemaName');
module.exports = {
          orderDetails : async (req,res)=>{
                    try {
                     const orders = await orderModel.find({}).populate({
                              path : 'userId',
                              model : USER,
                    select : 'email'

                              
                     })
                     console.log(orders[0].address.name);
                     res.render('admin/admin/pageorders',{orders})  
                    } catch (error) {
                              console.log(error)
                    }
          },
          viewOrderDetails : async (req,res)=>{
                   
                        try {
                            const orderId = req.query.orderId
                        
                            const orders = await orderModel.find({orderId}).populate({
                                
                                path: 'items.productId',
                            model: 'products',
                            select: 'images productName size productDiscount',
                            })
                            
                        
                            await res.render('admin/admin/order-details',{orders})
                
                        } catch (error) {
                            console.log(error)
                        }
          },
          updateOrderStatus: async (req, res) => {
            try {
                const orderId = req.query.orderId;
                const { orderStatus } = req.body;
                console.log(orderStatus);
               
        
                await orderModel.updateOne({ orderId: orderId }, { orderStatus: orderStatus });
        
                if (orderStatus === 'Cancelled') {
                    await orderModel.updateOne({ orderId: orderId }, { adminCancel: 'Cancelled' });
        
                 
                    const product = await orderModel.findOne({ orderId: orderId });
        
                    if (product.adminCancel === 'Cancelled' || product.orderStatus === 'Cancelled') {
                        await orderModel.updateOne(
                            { _id: product._id },
                            { $set: { 'items.$[elem].status': 'Cancelled','totalAmount' : 0 } },
                            { arrayFilters: [{ 'elem.status': { $ne: 'Cancelled' } }] }
                        );
                       

                    }
                   

                 
                }
      
                if (orderStatus === 'Cancelled' || orderStatus === 'Returned') {
                    const order = await orderModel.findOne({ orderId });
                
                    if (!order) {
                        return res.status(404).send('Order not found');
                    }
                
                    for (const item of order.items) {
                        const productId = item.productId;
                        const size = item.size;
                        let quantity = item.quantity;
                        console.log(productId)
                        console.log(quantity)
                
                        const product = await productModel.findOne({ _id: productId });
                        
                        if (product) {
                            const foundSize = product.size.find(prodSize => prodSize.size === size);
                          console.log('founSize:' + foundSize)
                            if (foundSize) {
                                foundSize.stock += quantity;
                                console.log(foundSize.stock)
                                await product.save();
                                quantity = 0
                            } else {
                                console.log(`Size ${size} not found for product ${productId}`);
                            }
                        } else {
                            console.log(`Product with ID ${productId} not found`);
                        }
                    }
               
                    await orderModel.updateOne(
                        { orderId: orderId },
                        {
                            orderStatus: orderStatus,
                            adminCancel: (orderStatus === 'Cancelled') ? 'Cancelled' : order.adminCancel // Preserve adminCancel status if not cancelled
                        }
                    );
                }
        
            
        
                res.redirect('/admin/orderDetails');
            } catch (error) {
                console.log(error);
            }
        }
          }                              