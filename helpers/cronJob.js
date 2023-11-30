const cron = require('node-cron')
const orderModel = require('../models/orderModel')
const couponModel = require('../models/couponModel')
const checkReturnExpiry = async (orders) => {
          const currentDate = new Date();
      
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
      
  
      

      const checkCouponExpiry = async (coupons) => {
        const currentDate = new Date();
      
        for (const singleCoupon of coupons) { // Renamed loop variable to 'singleCoupon'
          const couponCode = singleCoupon.couponCode;
          const couponExpiry = new Date(singleCoupon.expiringAt);
      
          if (couponExpiry > currentDate) {
            console.log(`The coupon ${couponCode} has an expiry in the future`);
          } else {
            console.log(`The coupon ${couponCode} has expiry in the past or present`);
            try {
              await couponModel.updateOne(
                { _id: singleCoupon._id },
                { $set: { expiringAt: null, status: 'expired' } },
                { upsert: true }
              );
              console.log(`${couponCode} coupon expired, expiry status set to null`);
            } catch (error) {
              console.error(`Error updating expiry status for ${couponCode}:`, error);
            }
          }
        }
      };
      
       cron.schedule('* * * * *', async () => {
         
        const orders = await orderModel.find({}).populate('items.productId');
        const coupons = await couponModel.find({})
        await checkReturnExpiry(orders);
        await checkReturnExpiry(coupon)
        console.log('Cron job executed!');
    });
      
      module.exports = { checkReturnExpiry,checkCouponExpiry };
      