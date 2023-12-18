const productModel = require('../../models/productModel')
const categoryModel = require('../../models/categoryModel')
const couponModel = require('../../models/couponModel')
const refferalModel = require('../../models/refferalModel')
const {checkCouponExpiry} = require('../../helpers/cronJob')
const { USER } = require('../../utils/constants/schemaName');


module.exports = {
          getproductOffer : async (req,res)=>{
                    try {
                      let currentPage = req.query.page ? parseInt(req.query.page) : 1; 
                      let numberOfDocs = 10
                      const totalproducts = await productModel.aggregate([
                        { $unwind: '$size' },
                        { $project: { 'size.size': 1 } },
                        { $count: 'total' } 
                      ]);
                      const totalProductsCount = totalproducts[0].total
                      console.log('this is total products count')
                      console.log(totalproducts)
                      console.log(totalProductsCount)
                      
                      const totalPages = Math.ceil(totalProductsCount / numberOfDocs); 
                      let skipCount = (currentPage - 1) * numberOfDocs
                                
                              // const products = await productModel.find({})
                              const products = await productModel.aggregate([{$unwind:'$size'},{$project:{'size.size' : 1,
                    'size.productPrice' :1,
                    'size.stock' : 1,
                    'size._id':1,
                    'size.mrp' : 1,
                    'productName' : 1,
                    'productDiscount' : 1,
                    '_id' : 1,
                    'images' : 1
                    ,
                    'shortDescription' : 1,
                    'size.productDiscount' : 1

                    }}, { $skip: skipCount },
                    { $limit: numberOfDocs },])
                  
                             
                              res.render('admin/admin/productOffers',{products,productCount: totalProductsCount,
                                totalPages,
                                currentPage})
                    } catch (error) {
                              console.log(error)
                    }
          },
          productOffer : async (req,res)=>{
            try {
              
              const {newDiscount,newPrice,_id,variantId} = req.body
              console.log(newDiscount)
              console.log(newPrice)
              console.log(variantId)
              let updateProduct 
              const productDiscountCheck = await productModel.findOne({_id:_id})
              console.log(productDiscountCheck)
              const verifyDisc = productDiscountCheck.size.find(item => parseInt(item.productDiscount) < parseInt(newDiscount))
              console.log(verifyDisc)

             if(verifyDisc)
              {
                updateProduct = true
                verifyDisc.productDiscount = newDiscount
                verifyDisc.productPrice = newPrice
                await productDiscountCheck.save()
                res.status(200).send({ message: 'Product details updated successfully.' });
              }
              else
              {
                console.log('verify disc not found')
                res.status(400).send({ error : 'The entered discount is less than the existing discount!'});
              }
            } catch (error) {
              console.log(error)
            }
                   
                    
                         
                    

                           
                    
          },
          getCategoryOffer : async (req,res)=>{
                    try {
                              const category = await categoryModel.find({})
                              res.render('admin/admin/categoryOffers',{category})
                    } catch (error) {
                              console.log(error)
                    }
          },
          offerCategory : async (req, res) => {
                    try {
                              const { _id, discount } = req.body;
                              console.log(_id);
                              console.log(discount);
                           let updateDiscount
    const products = await productModel.find({ category: _id });
    const productsTarget = await productModel.findOne({ category: _id });
    let checkData = productsTarget.size.find(item => parseInt(item.productDiscount) < parseInt(discount))
    if (checkData) {
      // Loop through products and update only if the product discount is less than the provided discount
      for (let i = 0; i < products.length; i++) {
        const product = products[i];
        const updatedSize = product.size.map((item) => {
          if (parseInt(item.productDiscount) < parseInt(discount)) {
            return {
              ...item,
              productDiscount: discount,
              productPrice: item.mrp - (item.mrp * (discount / 100))
            };
          }
          return item; 
        });
    
        product.size = updatedSize;
        await product.save();
      }
    
 
      await categoryModel.updateOne(
        { _id: _id },
        { $set: { discount: discount, offerDate: Date.now() } },
        { upsert: true }
      );
    
      res.status(200).json({ message: 'Category offer applied to relevant products.' });
    } else {
      res.status(400).json({ message: 'No products found with a lower discount.' });
    }
    

  
                            } catch (error) {
                              console.log(error);
                              res.status(500).json({ error: 'Internal Server Error' });
                            }
                            
                  },
                  getCouponOffer : async (req,res)=>{
                    try {
                      const coupon = await couponModel.find({}) || ''
                      await checkCouponExpiry(coupon)

                      res.render('admin/admin/couponOffers',{coupon})
                    } catch (error) {
                      console.log(error)
                    }
                  },
                  saveCoupon : async (req,res)=>{
                    try {
                      const {code,disc,issued,expiry,minimum}  = req.body
                      const couponCode = code.replace(/\W/g, '').toUpperCase();
                      const issuedParts = issued.split('/');
                      const issuedDate = new Date(
                          parseInt(issuedParts[2]),
                          parseInt(issuedParts[1]) - 1,
                          parseInt(issuedParts[0])
                      )
                      console.log(typeof disc)
                      console.log(typeof minimum)
                     
                    
              
                     
                      const expiryParts = expiry.split('/');
                      const expiryDate = new Date(
                          parseInt(expiryParts[2]),
                          parseInt(expiryParts[1]) - 1,
                          parseInt(expiryParts[0])
                      )
              
                      console.log(issuedDate);
                      console.log(expiryDate);
              
                      const currentDate = new Date()
                  
                      console.log(code)
                      console.log(couponCode)
                      console.log(disc)
                      console.log(issued)
                      console.log(expiry)
                     
                      console.log(minimum)
                    
              
            
                      console.log(issuedDate)
                      console.log(expiryDate)
                      
                      const newDisc = isNaN(parseFloat(disc)) ? disc : parseFloat(disc);
                   
                      const newMinimum = isNaN(parseFloat(minimum)) ? minimum : parseFloat(minimum);
              
                      if (isNaN(issuedDate) || isNaN(expiryDate) || issuedDate >= expiryDate || issuedDate < currentDate) {
                          return res.status(400).json({ error: 'Invalid date range. Please select valid dates.' });
                      }
                      else if(isNaN(newDisc) || isNaN(newMinimum) ||code === '' || disc === ''  || minimum === ''){
                        return res.status(400).json({ error: 'Fill in all data properly and ensure numeric values for discount, usage, and minimum'  });
                      }
                     else if(code.length > 12){
                        return res.status(400).json({ error: 'make the code a bit shorter!' });
                      }
                     
                      else
                      {
                       
                        
                        const couponData = {
                            couponCode: couponCode,
                            discount: newDisc,
                            issuedAt: issuedDate,
                            expiringAt: expiryDate,
                         
                            minimumPurchase: newMinimum
                        };
                        

                        const coupon = await  couponModel.create(couponData)

                      }
                    


                      res.status(200).json({ message: 'Data received' });




                    } catch (error) {
                      console.log(error)
                    }
                  },
                  updateCoupon: async (req, res) => {
                    try {
                      const { id, couponname, minimum, discount, dateupdate } = req.body;
                      console.log(id)
                      console.log(couponname)
                     
                      console.log(minimum)
                      console.log(discount)
                      console.log(dateupdate)
                  
                      const existingCoupon = await couponModel.findOne({ _id: id });
                      const couponCode = couponname.replace(/\W/g, '').toUpperCase();
                      if (!existingCoupon) {
                        return res.status(404).json({ message: 'Coupon not found' });
                      }
                  
                      const checkDate = new Date(dateupdate);
                      const currentDate = new Date()
                  
                      if (checkDate < currentDate) {
                        console.log('date part is not okay')
                        return res.status(400).json({ message: 'The updated date is before the expiration date. Please select a valid date.' });
                      } else if (couponname === '' || isNaN(minimum) || isNaN(discount)) {
                        console.log('something is missing here')
                        return res.status(400).json({ message: 'Fill in details properly' });
                      }
                      else if(couponCode.length > 12)
                      {
                        console.log('coupon length')
                        return res.status(400).json({ message: 'make the code a bit shorter!' });
                      }
                  const updateDate = Date.now()
                      const updatedCoupon = await couponModel.updateOne(
                        { _id: id },
                        {
                          $set: {
                            couponCode: couponCode,
                          
                            minimumPurchase: minimum,
                            discount: discount,
                            expiringAt: dateupdate,
                            updatedAt: updateDate
                          }
                        },
                        { upsert: true }
                      );
                  
                      console.log(updatedCoupon);
                  
                      return res.status(200).json({ message: 'Coupon updated successfully' });
                     
                    } catch (error) {
                      console.error(error);
                      return res.status(500).json({ error: 'Internal server error' });
                    }
                  },
                  couponStatus: async (req, res) => {
  try {
    const id = req.query.id;
    console.log(id);
const couponStatus = await couponModel.findOne({_id:id})
    let updateStatus;
    if (couponStatus.status === 'active') {
      updateStatus = 'disabled';
  
    } else if(couponStatus.status === 'disabled') {
      updateStatus = 'active';
    }

    const coupon = await couponModel.updateOne({ _id: id }, { $set: { status: updateStatus } }, { upsert: true });

    return res.status(200).json({ message: 'Coupon status updated successfully', updatedCoupon: coupon });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
},
showRefferals : async (req,res)=>{

  try {
    const refferals = await refferalModel.find({}).populate({ path: 'reffererId', model: USER, select: 'firstname' })
    console.log(refferals)


    res.render('admin/admin/refferalOffers',{refferals})
    
  } catch (error) {
console.log(error)
    res.redirect('/user/error')
    
  }

}

                  
                  
                  
                   
                
              
                  
                  
}