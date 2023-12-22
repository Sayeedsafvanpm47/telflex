const userModel = require("../../models/userModel");
const orderModel = require('../../models/orderModel')
const categoryModel = require('../../models/categoryModel')
const messageModel = require('../../models/messageModel')
const sendreplyByEmail = require("../../utils/sendReplyMail");


module.exports = {
	
	// controller for the charts
	chart : async (req,res)=>{
		try {
			const userData = await userModel.find({});
			const orderData = await orderModel.countDocuments();
			const categories = await categoryModel.countDocuments();
			const totalRevenue = await orderModel.aggregate([
			  {
			    $group: {
			      _id: null,
			      totalAmount: { $sum: '$totalAmount' }
			    }
			  }
			]);
			const totalProductsSold = await orderModel.aggregate([
				{
				    $match: {
				        orderDate: { $gte: new Date('2023-01-01'), $lte: new Date('2023-12-31') }
				    }
				},
				{
				    $unwind: '$items'
				},
				{ $match: { 'items.status': { $nin: ['Cancelled', 'Returned'] } } },

				{
				    $group: {
				        _id: { $month: '$orderDate' },
				        totalProducts: { $sum: '$items.quantity' } 
				    }
				}
			      ]);
			      
			
			const monthlyEarnings = await orderModel.aggregate([
			  {
			    $match: {
			      orderDate: { $gte: new Date('2023-01-01'), $lte: new Date('2023-12-31') }
			    }
			  },
			  {
				$unwind: '$items'
			      },
			      { $match: { 'items.status': { $nin: ['Cancelled', 'Returned'] } } },
			  {
			    $group: {
			      _id: { $month: '$orderDate' },
			      totalEarnings:{ $sum: { $multiply: ["$items.price", "$items.quantity"] }}
			    }
			  }
			]);
			const monthlyOrdersCount = await orderModel.aggregate([
				{
				    $match: {
				        orderDate: { $gte: new Date('2023-01-01'), $lte: new Date('2023-12-31') }
				    }
				},

				{
					$unwind: '$items'
				      },
				      { $match: { 'items.status': { $nin: ['Cancelled', 'Returned'] } } },
				{
				    $group: {
				        _id: { $month: '$orderDate' },
				        totalOrders: { $addToSet: '$items._id' }
				    }
				},
				{
				    $project: {
				        _id: 1,
				        orderCount: { $size: '$totalOrders' }
				    }
				}
			      ]);
	console.log(monthlyOrdersCount)

		      
			console.log(totalRevenue);
			console.log(totalProductsSold);
			console.log(monthlyEarnings);
		      
			const monthlyRevenue = Array.from({ length: 12 }, () => 0);
        const monthlyProductsSold = Array.from({ length: 12 }, () => 0);
        const monthlyOrders = Array.from({ length: 12 }, () => 0);
const categoryOrders = []
        monthlyEarnings.forEach((item) => {
            monthlyRevenue[item._id - 1] = item.totalEarnings;
        });

        totalProductsSold.forEach((item) => {
            monthlyProductsSold[item._id - 1] = item.totalProducts;
        });

        monthlyOrdersCount.forEach((item) => {
            monthlyOrders[item._id - 1] = item.orderCount;
        });
    
        const categorySales = await orderModel.aggregate([
	{
	  $unwind: "$items" 
	},
	      { $match: { 'items.status': { $nin: ['Cancelled', 'Returned'] } } },
	{
	  $lookup: {
	    from: "products",
	    localField: "items.productId",
	    foreignField: "_id",
	    as: "productDetails"
	  }
	},
	{
	  $unwind: "$productDetails"
	},
	{
	  $lookup: {
	    from: "categories",
	    localField: "productDetails.category",
	    foreignField: "_id",
	    as: "categoryDetails"
	  }
	},
	{
	  $unwind: "$categoryDetails"
	},
	{
	  $group: {
	    _id: "$categoryDetails.categoryName",
	    totalProductsSold: { $sum: "$items.quantity" }
	  }
	},
	{
	  $project: {
	    categoryName: "$_id",
	    totalProductsSold: 1,
	    _id: 0
	  }
	}
        ]);
        console.log(categorySales)
      
        

        const chartData = {
            monthlyRevenue,
            monthlyProductsSold,
            monthlyOrders,
	  categorySales
        };
        res.json({ chartData });
		        } catch (error) {
			console.log(error);
			res.status(500).json({ error: 'Internal server error' }); // Handle error response
		        }
	},
	// controller for the dashboard
	adminHome: async (req, res) => {
		try {
			
		  const userData = await userModel.find({});
		  const orderData = await orderModel.countDocuments();
		  
		let currentPage = req.query.page ? parseInt(req.query.page) : 1
		       let numberOfDocs = 10
		    const totalPages = Math.ceil(orderData/numberOfDocs)

		    const orders = await orderModel.find({}).sort({orderDate : -1}).skip((currentPage - 1) * numberOfDocs)
                .limit(numberOfDocs)

		  console.log(orders)
		  const categories = await categoryModel.countDocuments();
		  const totalRevenue = await orderModel.aggregate([ { $unwind: '$items' },    { $match: { 'items.status': { $nin: ['Cancelled', 'Returned'] } } },
		    {
		      $group: {
		        _id: null,
		        totalAmount: { $sum: { $multiply: ["$items.price", "$items.quantity"] } }
		      }
		    }
		  ]);
		  const totalRefund = await orderModel.aggregate([ { $unwind: '$items' },    { $match: { 'items.status': { $in: ['Cancelled', 'Returned'] } } },
		  {
		    $group: {
		      _id: null,
		      totalAmount: { $sum: '$refundAmount' }
		    }
		  }
		]);
		const revenueGenerated = totalRevenue[0].totalAmount - totalRefund[0].totalAmount
		console.log('check this')
		console.log(totalRefund)
		console.log(revenueGenerated)

		  const totalProductsSold = await orderModel.aggregate([
			{ $unwind: '$items' },
			{ $match: { 'items.status': { $nin: ['Cancelled', 'Returned'] } } },
			{
			  $group: {
			    _id: null, 
			    totalProducts: { $sum: '$items.quantity' } 
			  }
			}
		        ]);
		        
		  console.log('totalProducts')
		  console.log(totalProductsSold)
		  const monthlyEarnings = await orderModel.aggregate([
			{
			  $match: {
			    orderDate: { $gte: new Date('2023-01-01'), $lte: new Date('2023-12-31') }
			  }
			},
			{ $unwind: '$items' },
			{
			  $group: {
			    _id: { $month: '$orderDate' },
			    totalEarnings: {
			      $sum: {
			        $cond: [
				{ $in: ['$items.status', ['Cancelled', 'Returned']] },
				0,
				{ $multiply: ['$items.price', '$items.quantity'] }
			        ]
			      }
			    },
			    totalRefunds: {
			      $sum: {
			        $cond: [
				{ $in: ['$items.status', ['Cancelled', 'Returned']] },
				'$refundAmount',
				0
			        ]
			      }
			    }
			  }
			},
			{
			  $project: {
			    _id: 1,
			    totalEarnings: 1,
			    totalRefunds: 1,
			    netEarnings: { $subtract: ['$totalEarnings', '$totalRefunds'] }
			  }
			}
		        ]);
		        console.log(monthlyEarnings)
		        
		        
		

	        
		
	        
		  res.render('admin/admin/home', {
		    totalRevenue,
		    totalProductsSold,
		    monthlyEarnings,
		    orderData,
		    categories,
		    orders,
		    productCount: orderData,
                    totalPages,
                    currentPage,
		revenueGenerated,
		totalRefund
		
		 
		  });
		
		} catch (error) {
		  console.log(error);
		}
	        }

	
	// controller for logout
	,
	logout : async (req,res)=>{
		try {
			
			delete req.session.admin
			res.redirect('/user/shop')
			
			
		} catch (error) {
			console.log(error)
		}
	},
	// controller for editing admin profile
	editProfile : async (req,res)=>{
		try {
			const users = await userModel.findOne({_id:req.session.adminId})
			if(users.isAdmin === true){
			res.render('admin/admin/editProfile',{users})
			}
			else
			{
				res.redirect('/admin/home')
			}
			
		} catch (error) {

			console.log(error)
			
		}
	},
	// controller for customer enquiry viewing
	customerenquiry : async (req,res)=>{
		try {
			let currentPage = req.query.page ? parseInt(req.query.page) : 1; 
			let numberOfDocs = 10
			const totalCount = await messageModel.countDocuments({type:'Contact'})
			const totalPages = Math.ceil(totalCount / numberOfDocs); 
			const message = await messageModel.find({type:'Contact'}).skip((currentPage - 1) * numberOfDocs)
			
		.limit(numberOfDocs);

                            
			res.render('admin/admin/customerenquiry',{message,totalPages,currentPage})
			

		} catch (error) {

			console.log(error)
			
		}
	},
	// controller for dealer enquiry
	dealerenquiry : async (req,res)=>{
		try {
			let currentPage = req.query.page ? parseInt(req.query.page) : 1; 
			let numberOfDocs = 10
			const totalCount = await messageModel.countDocuments({type:'Dealer'})
			const totalPages = Math.ceil(totalCount / numberOfDocs); 
			const message = await messageModel.find({type:'Dealer'}).skip((currentPage - 1) * numberOfDocs)
			
		.limit(numberOfDocs);

                            
			res.render('admin/admin/dealerenquiry',{message,totalPages,currentPage})
			

		} catch (error) {

			console.log(error)
			
		}
	},
	sendReply : async (req,res)=>{
		try {
			const {reply,email,query} = req.query
			console.log(reply)
			console.log(email)
			console.log(query)
			const emailResponse = await sendreplyByEmail(email, reply);
			console.log(emailResponse)
			
			
			if (emailResponse) {
				res.status(200).json({ message: 'Email sent successfully!' });
			await messageModel.updateOne({query : query},{$set:{replystatus:'Replied!',reply : reply}},{upsert:true})
			      } else {
				
				res.status(400).send({error:'Error occurred while sending email'});
			      }


			
		} catch (error) {
			res.status(500).send('Internal server error');
			console.log(error)
			
		}
	}
	
	

	
};
