const bannerModel = require('../../models/bannerModel')

module.exports = {
          dealsBanner : async (req,res)=>{

                    const { bannertype1 , title1,title12,phrase12, phrase1, subtext1,subtext12, action1,action12, offer1, offer12,mrp1, mrp12, end1, discount1 , discount12} = req.body

                    console.log(bannertype1)
                    console.log(title1)
                    console.log(phrase1)
                    console.log(subtext1)
                    console.log(action1)
                    console.log(offer1)
                    console.log(mrp1)
                    
                    console.log(end1)
                    console.log(discount1)
                    const expiry = new Date(end1)
                    console.log(expiry)
                    try {

                              const processedImages = req.processedImages || [];
                              const existingBanner = await bannerModel.findOne({ bannerType: bannertype1 });
                              if(existingBanner)
                              {
                                        existingBanner.bannerType = bannertype1,
                                        existingBanner.bannerTitle = [title1,title12],
                                        existingBanner.bannerPhrase = [phrase1,phrase12],
                                        existingBanner.bannerSubText = [subtext1,subtext12],
                                        existingBanner.bannerAction = [action1,action12],
                                        existingBanner.bannerOffer = [offer1,offer12],
                                        existingBanner.bannerMrp = [mrp1,mrp12],
                                      
                                        existingBanner.end = expiry,
                                        existingBanner.bannerDiscount = [discount1,discount12],
                                        existingBanner.images = processedImages
                                        await existingBanner.save()
                                        req.session.bannerAlert = true
                           
                                        res.redirect('/admin/banner')
                                       
                              }
                              const banner = new bannerModel({
                                        bannerType : bannertype1,
                                        bannerTitle : [title1,title12],
                                        bannerPhrase : [phrase1,phrase12],
                                        bannerSubText : [subtext1,subtext12],
                                        bannerAction : [action1,action12],
                                        bannerOffer : [offer1,offer12],
                                        bannerMrp : [mrp1,mrp12],
                                   
                                        end : expiry,
                                        bannerDiscount : [discount1,discount12],
                                        images : processedImages
                              })
                              
                              await banner.save()
                              req.session.bannerAlert = true
                           
                                        res.redirect('/admin/banner')
                    } catch (error) {
                              console.log(error)
                              
                    }


                    



                  
          },
          mainBanner : async (req,res)=>{

                    const { bannertype2 , title2, title22 , title23,phrase2, phrase22,phrase23,subtext22,subtext23,subtext2, action22,action23,action2} = req.body

                    console.log(bannertype2)
                    console.log(title2)
                    console.log(phrase2)
                    console.log(subtext2)
                    console.log(action2)
                   
                    try {

                              const processedImages = req.processedImages || [];
                              const existingBanner = await bannerModel.findOne({ bannerType: bannertype2 });

                              if (existingBanner) {
                                      
                                        
                                          existingBanner.bannerTitle = [title2, title22, title23];
                                          existingBanner.bannerPhrase = [phrase2, phrase22, phrase23];
                                          existingBanner.bannerSubText = [subtext2, subtext22, subtext23];
                                          existingBanner.bannerAction = [action2, action22, action23];
                                          existingBanner.images = processedImages;
                                    
                                          await existingBanner.save();
                                          req.session.bannerAlert = true
                           
                                          res.redirect('/admin/banner')
                                       
                                      } 
else{

                              const banner = new bannerModel({
                                        bannerType : bannertype2,
                                        bannerTitle : [title2,title22,title23],
                                        bannerPhrase : [phrase2,phrase22,phrase23],
                                        bannerSubText : [subtext2,subtext22,subtext23],
                                        bannerAction : [action2,action22,action23],
                                        images : processedImages
                              })
                              await banner.save()
                              req.session.bannerAlert = true
                           
                              res.redirect('/admin/banner')
                    }
                    } catch (error) {
                              console.log(error)
                              
                    }


                    



                  
          },
          subBanner : async (req,res)=>{

                    const { bannertype3 , title3, phrase3, subtext3, action3} = req.body

                   
                    try {

                              const processedImages = req.processedImages || [];
                              const existingBanner = await bannerModel.findOne({ bannerType: bannertype3 });
                              if(existingBanner)
                              {
                                       
                                                  existingBanner.bannerType = bannertype3,
                                                 existingBanner.bannerTitle =  title3,
                                                 existingBanner.bannerPhrase = phrase3,
                                                 existingBanner.bannerSubText = subtext3,
                                                  existingBanner.bannerAction = action3,
                                        
                                                  existingBanner.images = processedImages
                                      
                                        await existingBanner.save()
                                        req.session.bannerAlert = true
                           
                                        res.redirect('/admin/banner')
                              }

                              const banner = new bannerModel({
                                        bannerType : bannertype3,
                                        bannerTitle : title3,
                                        bannerPhrase : phrase3,
                                        bannerSubText : subtext3,
                                        bannerAction : action3,
                              
                                        images : processedImages
                              })
                              await banner.save()
                              req.session.bannerAlert = true
                           
                              res.redirect('/admin/banner')
                             
                    } catch (error) {
                              console.log(error)
                              
                    }


                    



                  
          },
          offerBanner : async (req,res)=>{

                    const { bannertype4 , title4,title42,title43, phrase4,phrase42,phrase43, subtext4,subtext42,subtext43, action4,} = req.body

                    console.log(bannertype4)
                    console.log(title4)
                    console.log(phrase4)
                    console.log(subtext4)
                    console.log(action4)
                   
                    try {

                              const processedImages = req.processedImages || [];

                              const banner = new bannerModel({
                                        bannerType : bannertype4,
                                        bannerTitle : [title4,title42,title43],
                                        bannerPhrase : [phrase4,phrase42,phrase43],
                                        bannerSubText : [subtext4,subtext42,subtext43],
                                        bannerAction : [action4],
                                        images : processedImages
                              })
                              await banner.save()
                              req.session.bannerAlert = true
                           
                             res.redirect('/admin/banner')
                    } catch (error) {
                              console.log(error)
                              
                    }


                    



                  
          },
          showBanner : async (req,res)=>{
                    try {

                             let errors
                             let success
                              const banners = await bannerModel.findOne({bannerType : 'Main Banner'})
			const subbanner = await bannerModel.findOne({bannerType : 'Sub Banner'})
                              const deal = await bannerModel.findOne({bannerType : 'Deals banner'})
                              console.log(deal)
                              console.log(deal.length)
                              const offer = await bannerModel.findOne({bannerType:'Offer Banner'})
                              if(req.session.bannerError)
                              {
                                        const errors = req.session.errorMessageBanner
                                        console.log(errors)
                                       delete req.session.bannerError 
                              res.render('admin/admin/bannerManage',{banners,subbanner,errors,success,deal,offer})
                              }
                              else if(req.session.bannerAlert)
                              {
                                        success = 'Banner Upload Succesfull'
                                        res.render('admin/admin/bannerManage',{banners,subbanner,errors,success,deal,offer}) 
                              }
                              else
                              {
                                        
                                        res.render('admin/admin/bannerManage',{banners,subbanner,errors,success,deal,offer}) 
                              }

                    } catch (error) {
                              
                    }
          }
}