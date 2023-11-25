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
                const _id = req.query._id;
                const { orderStatus,orderId } = req.body;
                console.log(orderStatus);
                



                if (orderStatus === 'Cancelled') {
                    const orderItem = await orderModel.updateOne(
                        { 'items._id': _id },
                        { $set: { 'items.$.status': 'Cancelled' } }
                        
                    );
                    // let allItemsCancelled = true;
                
                    // for (let i = 0; i < orders.length; i++) {
                    //     for (let j = 0; j < orders[i].items.length; j++) {
                    //         if (orders[i].items[j].status !== 'Cancelled') {
                    //             allItemsCancelled = false;
                    //             break;
                    //         }
                    //     }
                    //     if (!allItemsCancelled) {
                    //         break;
                    //     }
                    // }
                    // const orderToUpdate = await orderModel.findOne({_id:orderId});
                    // if (orderToUpdate) {
                    //     if (allItemsCancelled) {
                    //         orderToUpdate.orderStatus = 'Cancelled';
                    //         orderToUpdate.paymentStatus = 'Failed'
                    //     } 
                    //     else {
                    //         orderToUpdate.orderStatus = 'Modified';
                    //     }
                    //     await orderToUpdate.save();
                    // }
                
                 
                
                   
                   

                    const orderTarget = await orderModel.findOne({ 'items._id': _id });
                    const canceledItem = orderTarget.items.find(item => item._id.toString() === _id);
                   
                  const proId = canceledItem.productId
                  console.log(proId)
                  const prosize = canceledItem.size
                  const proquantity = canceledItem.quantity


                  const productFound = await productModel.findOne({ _id: proId });

                  if (productFound) {
                      const sizeToUpdate = productFound.size.find(sizeObj => sizeObj.size === prosize);
                      if (sizeToUpdate) {
                    sizeToUpdate.stock += proquantity;
                    await productFound.save();
                   
                    console.log(`Stock updated for product ${proId}, size ${prosize}`);
                      } else {
                    console.log(`Size ${prosize} not found for product ${proId}`);
                      }
                  } else {
                      console.log(`Product with ID ${proId} not found`);
                  }


                }

                else if (orderStatus === 'Returned') {
                    const orderItem = await orderModel.updateOne(
                        { 'items._id': _id },
                        { $set: { 'items.$.status': 'Returned' } }
                    );
                
                    // let allItemsReturned = true;
                
                    // for (let i = 0; i < orders.length; i++) {
                    //     for (let j = 0; j < orders[i].items.length; j++) {
                    //         if (orders[i].items[j].status !== 'Returned') {
                    //             allItemsReturned = false;
                    //             break;
                    //         }
                    //     }
                    //     if (!allItemsReturned) {
                    //         break;
                    //     }
                    // }
                
                   
                    // const orderToUpdate = await orderModel.findById(orderId);
                    // if (orderToUpdate) {
                    //     if (allItemsReturned) {
                    //         orderToUpdate.orderStatus = 'Returned';
                    //     } else {
                    //         orderToUpdate.orderStatus = 'Modified';
                    //     }
                    //     await orderToUpdate.save();
                    // }

                    const orderTarget = await orderModel.findOne({ 'items._id': _id });
                    const canceledItem = orderTarget.items.find(item => item._id.toString() === _id);
                   
                  const proId = canceledItem.productId
                  console.log(proId)
                  const prosize = canceledItem.size
                  const proquantity = canceledItem.quantity


                  const productFound = await productModel.findOne({ _id: proId });

                  if (productFound) {
                      const sizeToUpdate = productFound.size.find(sizeObj => sizeObj.size === prosize);
                      if (sizeToUpdate) {
                    sizeToUpdate.stock += proquantity;
                    await productFound.save();
                   
                    console.log(`Stock updated for product ${proId}, size ${prosize}`);
                      } else {
                    console.log(`Size ${prosize} not found for product ${proId}`);
                      }
                  } else {
                      console.log(`Product with ID ${proId} not found`);
                  }


                }
                else if (orderStatus === 'Shipped') {
                    const order = await orderModel.findOne({ 'items._id': _id });
                    if (!order) {
                        return res.status(404).send('Order not found');
                    }
                
                    const itemToUpdate = order.items.find(item => item._id.toString() === _id);
                    if (!itemToUpdate) {
                        return res.status(404).send('Item not found in the order');
                    }
                
                    itemToUpdate.status = 'Shipped';
                    await order.save();
                   
                }
                
                else if (orderStatus === 'Delivered') {
                    const order = await orderModel.findOne({ _id: orderId });
                    if (!order) {
                        return res.status(404).send('Order not found');
                    }
                
                    const itemToUpdate = order.items.find(item => item._id.toString() === _id);
                    if (!itemToUpdate) {
                        return res.status(404).send('Item not found in the order');
                    }
                
                    if (itemToUpdate.status === 'Active' || itemToUpdate.status === 'Shipped') {
                        itemToUpdate.status = 'Delivered';
                
                       
                
                        await order.save();
                        
                    } else {
                        return res.status(400).send('Item is not in an active status');
                    }
                }
                
               else
               {
                res.send('error')
               }


               
        
                // if (orderStatus === 'Cancelled') {
                //     const orderItem = await orderModel.updateOne(
                //         { 'items._id': _id },
                //         { $set: { 'items.$.status': 'Cancelled' } }
                //     );
                //     for(let i=0; i<orders.length; i++)
                //     {
                //         for(let j=0; j<orders[i].items.length; j++)
                //         {
                //             if(items[j].status === 'Cancelled')
                //             {
                //                 orderItem.orderStatus = 'Cancelled'
                //             }
                //         }
                //     }
                    // await orderModel.updateOne({ orderId: orderId }, {$set:{ adminCancel: 'Cancelled' }});
        
                 
                    // const product = await orderModel.findOne({ orderId: orderId });
        
                    // if (product.adminCancel === 'Cancelled' || product.orderStatus === 'Cancelled') {
                    //     await orderModel.updateOne(
                    //         { _id: product._id },
                    //         { $set: { 'items.$[elem].status': 'Cancelled'} },
                    //         { arrayFilters: [{ 'elem.status': { $ne: 'Cancelled' } }] }
                    //     );
                       

                    // }
                   

                 
                // }
                // if(orderStatus ==='Delivered')
                // {
                //     const order = await orderModel.findOne({orderId})
                //     if(!order)
                //     {
                //         return res.status(404).send('order not found')
                //     }
                //     order.orderStatus = 'Delivered';
                //     order.paymentStatus = 'Paid'
                //     for (const item of order.items) {
                //         item.status = 'Delivered'
                //     }
                //     order.save()
                // }
      
                // if (orderStatus === 'Cancelled' || orderStatus === 'Returned') {
                //     const order = await orderModel.findOne({ orderId });
                
                //     if (!order) {
                //         return res.status(404).send('Order not found');
                //     }
                
                //     for (const item of order.items) {
                //         const productId = item.productId;
                //         const size = item.size;
                //         let quantity = item.quantity;
                //         console.log(productId)
                //         console.log(quantity)
                
                //         const product = await productModel.findOne({ _id: productId });
                        
                //         if (product) {
                //             const foundSize = product.size.find(prodSize => prodSize.size === size);
                //           console.log('founSize:' + foundSize)
                //             if (foundSize) {
                //                 foundSize.stock += quantity;
                //                 console.log(foundSize.stock)
                //                 await product.save();
                               
                //             } else {
                //                 console.log(`Size ${size} not found for product ${productId}`);
                //             }
                //         } else {
                //             console.log(`Product with ID ${productId} not found`);
                //         }
                //     }
               
                //     await orderModel.updateOne(
                //         { orderId: orderId },
                //         {
                //             orderStatus: orderStatus,
                //             adminCancel: (orderStatus === 'Cancelled') ? 'Cancelled' : order.adminCancel // Preserve adminCancel status if not cancelled
                //         }
                //     );
                // }

                const order = await orderModel.findOne({ _id: orderId });

                if (!order) {
                    return res.status(404).send('Order not found');
                }
                
                const itemStatusCounts = {
                    Cancelled: 0,
                    Returned: 0,
                    Shipped: 0,
                    Delivered: 0,
                    Modified: 0,
                };
                
                for (const item of order.items) {
                    itemStatusCounts[item.status]++;
                }
                
                let newOrderStatus = 'Modified';
                
                if (itemStatusCounts.Cancelled === order.items.length) {
                    newOrderStatus = 'Cancelled';
                } else if (itemStatusCounts.Returned === order.items.length) {
                    newOrderStatus = 'Returned';
                }
                else if (itemStatusCounts.Delivered === order.items.length) {
                    newOrderStatus = 'Delivered';
                }
                else if (itemStatusCounts.Cancelled === order.items.length) {
                    newOrderStatus = 'Cancelled';
                }
                
                order.orderStatus = newOrderStatus;
                await order.save();
                
        
            
        
                res.redirect('/admin/orderDetails');
            } catch (error) {
                console.log(error);
            }
        }
          }                              