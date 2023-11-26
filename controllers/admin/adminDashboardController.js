const { json } = require("express");
const userModel = require("../../models/userModel");
const orderModel = require('../../models/orderModel')
const productModel = require('../../models/productModel')


module.exports = {

          salesReport : async (req,res)=>{
                    try {
                              let profit
                              let productsRevenue;
                              let reportType
                              let from
                              let to 
                              res.render('admin/admin/salesReport',{productsRevenue,profit,reportType,from,to})
                              
                    } catch (error) {
                              console.log(error)
                    }
          },
          getReport: async (req, res) => {
                    try {
                     
                      const convertDateFormat = (inputDate) => {
                        const parts = inputDate.split('/');
                        const formattedDate = `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
                        return formattedDate;
                      };
                  
                      const { fromDate, toDate } = req.body;
                      const FromDate = convertDateFormat(fromDate);
                      const ToDate = convertDateFormat(toDate);
                  
                      // Check if converted fromDate is greater than converted toDate
                      if (new Date(FromDate) > new Date(ToDate)) {
                        return res.status(400).json({ error: "From date cannot be greater than to date" });
                      }
                  
                      console.log("FromDate:", FromDate);
                      console.log("ToDate:", ToDate);
                  
                      // Process report data if the condition is met
                      const report = await orderModel.aggregate([
                        {
                          $match: {
                            orderDate: {
                              $gte: new Date(FromDate),
                              $lte: new Date(ToDate)
                            }
                          }
                        }
                      ]);
                      const revenue = await orderModel.aggregate([
                        {
                          $match: { orderDate: { $gte: new Date(FromDate), $lte: new Date(ToDate) } }
                        },
                        {
                          $unwind: "$items" 
                        },
                        { $match: { 'items.status': { $nin: ['Cancelled', 'Returned'] } } }
,
                        {
                          $group: {
                            _id: null,
                            totalEarnings: { $sum: { $multiply: ["$items.price", "$items.quantity"] }},
                            totalOrders: { $sum: '$items.quantity' }
                          }
                        }
                      ]);

                      
                      
                    console.log(revenue)
                  req.session.report = report
                  req.session.from = FromDate
                  req.session.to = ToDate  
                  req.session.revenue = revenue                    // Handle the report data as needed
                     
                      res.json(report);
                    } catch (error) {
                      console.log(error);
                      res.status(500).json({ error: "Internal server error" });
                    }
                  }
                  
     

         , getReportResults: async (req, res) => {
          try {
            const from = req.session.from;
            const to = req.session.to;
            const revenue = req.session.revenue
          
            const productsRevenue = await orderModel.aggregate([
              {
                $match: {
                  orderDate: {
                    $gte: new Date(from),
                    $lte: new Date(to)
                  }
                }
              },
              { $unwind: "$items" },
              { $match: { 'items.status': { $nin: ['Cancelled', 'Returned'] } } }
              ,
              {
                $group: {
                  _id: "$items.productId",
                  productName: { $first: "$items.productName" },
                  totalQuantity: { $sum: "$items.quantity" },
                  totalRevenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] }}
                  
                  
                }
              }
            ]);
            let profit = await orderModel.aggregate([
              {
                $match: {
                  orderDate: {
                    $gte: new Date(from),
                    $lte: new Date(to)
                  }
                }
              },
              {
                $unwind: '$items'
              },
              { $match: { 'items.status': { $nin: ['Cancelled', 'Returned'] } } }
,
              {
                $group: {
                  _id: null,
                  totalRevenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } },
                  totalCost: { $sum: { $multiply: ["$items.mrp", "$items.quantity"] } }
                }
              },
              {
                $project: {
                  _id: 0,
                  totalRevenue: 1,
                  totalCost: 1,
                  totalProfit: { $subtract: ["$totalCost", "$totalRevenue"] }
                }
              }
            ]);
            let arr = [];
            arr.push(new Date(to));
            arr.push(new Date(from));
            console.log(arr);
            console.log(arr.length)
            let differenceInTime = arr[0].getTime() - arr[1].getTime();

// Calculate the number of milliseconds in a day
let oneDay = 1000 * 60 * 60 * 24;

// Calculate the difference in days
let differenceInDays = Math.round(differenceInTime / oneDay);

console.log(arr);
console.log("Number of days between dates:", differenceInDays);
let reportType;
if(differenceInDays === 1)
{
  reportType = 'DAILY REPORT'
}
else if(differenceInDays ===7)
{
  reportType = 'WEEKLY REPORT'
}
else if(differenceInDays ===30 || differenceInDays ===31 || differenceInDays === 28 || differenceInDays === 29)
{
  reportType = 'MONTHLY REPORT'
}
else
{
  reportType = 'Yearly Report'
}
            
          console.log(profit)
            console.log(productsRevenue);
       
            res.render('admin/admin/salesReport', { from, to, productsRevenue,revenue,profit,reportType });
      

          } catch (error) {
            console.log(error);
            res.status(500).json({ error: "Internal server error" });
          }
        }
              
                  
                  
          
}