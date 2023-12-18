const orderModel = require('../../models/orderModel');
const productModel = require('../../models/productModel');
const userModel = require('../../models/userModel')

const { USER } = require('../../utils/constants/schemaName');
module.exports = {
          orderDetails : async (req,res)=>{
                    try {
                        let currentPage = req.query.page ? parseInt(req.query.page) : 1
                        let numberOfDocs = 8
                        let totalOrderCount = await orderModel.countDocuments()
                        const totalPages = Math.ceil(totalOrderCount/numberOfDocs)
                    if(req.session.search)
                    {
                       
                        const searchTerm = req.session.searchTerm
                        const searchRegex = new RegExp(searchTerm, 'i');

const orders = await orderModel
  .find({ 'address.name': searchRegex }) 
  .populate({
    path: 'userId',
    model: USER,
    select: 'email'
  })
  .sort({ 'orderDate': -1 })
  .skip((currentPage - 1) * numberOfDocs)
  .limit(numberOfDocs);
  delete req.session.search
  res.render('admin/admin/pageorders',{orders,totalOrderCount,totalPages,currentPage})  

 

                    }else{

                        
                     const orders = await orderModel.find({}).populate({
                              path : 'userId',
                              model : USER,
                    select : 'email'

                              
                     }).sort({'orderDate':-1}).skip((currentPage - 1) * numberOfDocs)
                     .limit(numberOfDocs)
                     console.log(orders[0].address.name);

                    
                     res.render('admin/admin/pageorders',{orders,totalOrderCount,totalPages,currentPage})  
                    }
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
                
             const refund = await orderModel.findOne({_id:orderId})


                if (orderStatus === 'Cancelled') {
                    const orderItem = await orderModel.updateOne(
                        { 'items._id': _id },
                        { $set: { 'items.$.status': 'Cancelled'} }
                        
                    );
                   

                    

               
                
                 
                
                   
                   

                    const orderTarget = await orderModel.findOne({ 'items._id': _id });
                    const canceledItem = orderTarget.items.find(item => item._id.toString() === _id);
                   
                  const proId = canceledItem.productId
                  let refundamount = canceledItem.price
                  console.log(proId)
                  const prosize = canceledItem.size
                  const proquantity = canceledItem.quantity


                  const productFound = await productModel.findOne({ _id: proId });

                  if (productFound) {
                      const sizeToUpdate = productFound.size.find(sizeObj => sizeObj.size === prosize);
                      if (sizeToUpdate) {
                    sizeToUpdate.stock += proquantity;
                    const orderDate = await orderModel.updateOne(
                        { _id: orderId },
                        { $set: { modifiedAt: new Date().toISOString() } }
                      );
                      if(refund.paymentStatus === 'Paid'){
                   
                      if(refund.couponApplied === true)
                      {
                        
                         refundamount = refund.totalAmount;

  refund.items.forEach((item) => {
    if (item.status !== 'Cancelled') {
      item.status = 'Cancelled';
      item.paymentStatus = 'Refunded'
     
    }
  });

  refund.orderStatus = 'Cancelled';
  await refund.save();
                       

                      }
                      const userId = refund.userId
                      await orderModel.updateOne(
                        { _id: orderId },
                        {
                           
                            $inc: { 'refundAmount': refundamount }
                        }
                    )
                    await userModel.updateOne({_id:userId},{$inc:{'wallet':refundamount}},{new:true})
                      }
                      console.log(`Refund Price: ${refundamount}`);
                      console.log(`Payment Status: ${refund.paymentStatus}`);
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
                    const refund = await orderModel.findOne({_id:orderId})
                  
                    const orderItem = await orderModel.updateOne(
                        { 'items._id': _id },
                        { $set: { 'items.$.status': 'Returned' } }
                    );
                
              

                    const orderTarget = await orderModel.findOne({ 'items._id': _id });
                    const canceledItem = orderTarget.items.find(item => item._id.toString() === _id);
                   
                  const proId = canceledItem.productId
                  console.log(proId)
                  const prosize = canceledItem.size
                  const proquantity = canceledItem.quantity

                  if(canceledItem.status === 'Returned')
                  {
                    refundPrice = canceledItem.price
                    console.log(refundPrice)
                    
                      if(refund.couponApplied === true)
                      {
                        
                         refundPrice = refund.totalAmount;

  refund.items.forEach((item) => {
    if (item.status !== 'Cancelled') {
      item.status = 'Cancelled';
      item.paymentStatus = 'Refunded'
     
    }
  });

  refund.orderStatus = 'Cancelled';
  await refund.save();
                       

                      }
                      const userId = refund.userId
                    await orderModel.updateOne({_id:orderId},{$inc:{'refundAmount':refundPrice}},{new:true})
                    await userModel.updateOne({_id:userId},{$inc:{'wallet':refundPrice}},{new:true})
                  }


                  const productFound = await productModel.findOne({ _id: proId });

                  if (productFound) {
                      const sizeToUpdate = productFound.size.find(sizeObj => sizeObj.size === prosize);
                      if (sizeToUpdate) {
                    sizeToUpdate.stock += proquantity;
                    const orderDate = await orderModel.updateOne(
                        { _id: orderId },
                        { $set: { modifiedAt: new Date().toISOString() } }
                      );
                      
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
        },
        orderSearchResults : async (req,res)=>{
            req.session.search = true
            req.session.searchTerm = req.body.searchTerm
            res.redirect('/admin/orderDetails')
        }
          }                              