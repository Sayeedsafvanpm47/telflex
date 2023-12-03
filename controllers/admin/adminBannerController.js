const bannerModel = require('../../models/bannerModel')

module.exports = {
          addBanner : async (req,res)=>{

                    const { bannertype , title, phrase, subtext, action, offer, mrp, start, end, discount} = req.body

                    console.log(bannertype)
                    console.log(title)
                    console.log(phrase)
                    console.log(subtext)
                    console.log(action)
                    console.log(offer)
                    console.log(mrp)
                    console.log(start)
                    console.log(end)
                    console.log(discount)
                    try {

                              const processedImages = req.processedImages || [];

                              const banner = new bannerModel({
                                        bannertype : bannertype,
                                        bannerTitle : title,
                                        bannerPhrase : phrase,
                                        bannerSubText : subtext,
                                        bannerAction : action,
                                        bannerOffer : offer,
                                        bannerMrp : mrp,
                                        start : start,
                                        end : end,
                                        bannerDiscount : discount,
                                        images : processedImages
                              })
                              await banner.save()
                              res.send('success')
                    } catch (error) {
                              console.log(error)
                              
                    }


                    



                  
          },
          showBanner : async (req,res)=>{
                    try {

                              const banner = await bannerModel.find({})
                              res.render('admin/admin/bannerManage')

                    } catch (error) {
                              
                    }
          }
}