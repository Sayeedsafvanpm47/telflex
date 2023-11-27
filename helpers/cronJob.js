const cron = require('node-cron')
const orderModel = require('../models/orderModel')
const checkReturnExpiry = async (orders) => {
          const currentDate = new Date();
          const zeroDate = new Date(0); 
          for (const order of orders) {
              for (const item of order.items) {
                  const productName = item.productName;
                  const returnExpiry = new Date(item.returnExpiry);
      
                  if (returnExpiry > currentDate) {
                      console.log(`${productName} has a returnExpiry in the future.`);
                  } else {
                      console.log(`${productName} has a returnExpiry in the past or present.`);
                      try {
                              console.log('order : ' + order._id)
                              console.log('item : ' + item._id)
                              console.log('item before: ' + item.returnExpiry)
                          await orderModel.updateOne(
                              { _id: order._id, 'items._id': item._id },
                              { $set: { 'items.$.returnExpiry': null} }
                          );
                          console.log('item after: ' + item.returnExpiry)
                          console.log(`Return expiry status updated for ${productName}`);
                      } catch (error) {
                          console.error(`Error updating return expiry status for ${productName}:`, error);
                        
                      }
                  }
              }
          }
      };
      
      cron.schedule('* * * * *', async () => {
         
          const orders = await orderModel.find({}).populate('items.productId');
          
          await checkReturnExpiry(orders);
          console.log('Cron job executed!');
      });
      
      
      module.exports = { checkReturnExpiry };
      