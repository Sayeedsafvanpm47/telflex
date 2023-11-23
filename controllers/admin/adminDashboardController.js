const { json } = require("express");
const userModel = require("../../models/userModel");
const orderModel = require('../../models/orderModel')


module.exports = {

          salesReport : async (req,res)=>{
                    try {
                              let report
                              res.render('admin/admin/salesReport',{report})
                              
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
                  req.session.report = report
                      // Handle the report data as needed
                      console.log(report);
                      res.json(report);
                    } catch (error) {
                      console.log(error);
                      res.status(500).json({ error: "Internal server error" });
                    }
                  }
                  ,
                  getReportResults : async (req,res)=>{
         try {
          const report = req.session.report
          console.log(report)
          res.render('admin/admin/salesReport',{report})
          console.log(report)
         } catch (error) {
          console.log(error)
         }
                  }
                  
                  
          
}