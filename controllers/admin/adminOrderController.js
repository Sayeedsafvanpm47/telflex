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
			const orders = await orderModel.find({orderId}).populate({
				
				path: 'items.productId',
            model: 'products',
            select: 'images productName size productDiscount',
			})
			
			await res.render('user/user/order-details',{orders})
                              
                    } catch (error) {
                            console.log(error)  
                    }
          },
          updateOrderStatus: async (req, res) => {
                    try {
                        const { orderId, orderStatus } = req.body;
                console.log(req.body)
                        // Update the order status based on orderId
                        await orderModel.updateOne({ _id: orderId }, { orderStatus: orderStatus });
                
                        res.status(200).json({ message: 'Order status updated successfully' });
                    } catch (error) {
                        res.status(500).json({ message: 'Error updating order status', error });
                    }
                }
          }                              