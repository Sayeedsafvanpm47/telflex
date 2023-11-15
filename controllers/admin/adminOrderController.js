const orderModel = require('../../models/orderModel')
const { USER } = require('../../utils/constants/schemaName');
module.exports = {
          orderDetails : async (req,res)=>{
                    try {
                     const orders = await orderModel.find({}).populate({
                              path : 'userId',
                              model : USER,
                    select : 'email'

                              
                     })
                     res.render('admin/admin/pageorders',{orders})  
                    } catch (error) {
                              console.log(error)
                    }
          },
          viewOrderDetails : async (req,res)=>{
                    try {
                    
			const orderId = req.query.orderId
			const orders = await orderModel.findOne({orderId}).populate({
				
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
        
                    // Find the product and update all items' status to 'Cancelled'
                    const product = await orderModel.findOne({ orderId: orderId });
        
                    if (product.adminCancel === 'Cancelled' || product.orderStatus === 'Cancelled') {
                        await orderModel.updateOne(
                            { _id: product._id },
                            { $set: { 'items.$[elem].status': 'Cancelled' } },
                            { arrayFilters: [{ 'elem.status': { $ne: 'Cancelled' } }] }
                        );
                    }
                }
        
                res.redirect('/admin/orderDetails');
            } catch (error) {
                console.log(error);
            }
        }
          }                              