const bannerModel = require('../../models/bannerModel')

module.exports = {
          dealsBanner : async (req,res)=>{

                    const { bannertype1 , title1, phrase1, subtext1,action1,offer1,mrp1,  end1, discount1 } = req.body

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
                                        existingBanner.bannerTitle = [title1],
                                        existingBanner.bannerPhrase = [phrase1],
                                        existingBanner.bannerSubText = [subtext1],
                                        existingBanner.bannerAction = [action1],
                                        existingBanner.bannerOffer = [offer1],
                                        existingBanner.bannerMrp = [mrp1],
                                      
                                        existingBanner.end = expiry,
                                        existingBanner.bannerDiscount = [discount1],
                                        existingBanner.images = processedImages
                                        await existingBanner.save()
                                        req.session.bannerAlert = true
                           
                                        res.redirect('/admin/banner')
                                       
                              }
                              else
                              {
                              const banner = new bannerModel({
                                        bannerType : bannertype1,
                                        bannerTitle : [title1],
                                        bannerPhrase : [phrase1],
                                        bannerSubText : [subtext1],
                                        bannerAction : [action1],
                                        bannerOffer : [offer1],
                                        bannerMrp : [mrp1],
                                   
                                        end : expiry,
                                        bannerDiscount : [discount1],
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
else
{
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
                            }
                             
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
                        const existingBanner = await bannerModel.findOne({bannerType : bannertype4})
if(existingBanner){

    existingBanner.bannerType = bannertype4,
    existingBanner.bannerTitle =  [title4,title42,title43],
    existingBanner.bannerPhrase = [phrase4,phrase42,phrase43],
    existingBanner.bannerSubText = [subtext4,subtext42,subtext43],
     existingBanner.bannerAction = action4,

     existingBanner.images = processedImages

await existingBanner.save()
req.session.bannerAlert = true

res.redirect('/admin/banner')

}else{
                             

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
                            }
                    } catch (error) {
                              console.log(error)
                              
                    }


                    



                  
          },
          festivalBanner : async (req,res)=>{

            const { bannertype5 , title5,phrase5,subtext5, action5} = req.body

            
           
            try {
                const processedImages = req.processedImages || [];
                const existingBanner = await bannerModel.findOne({bannerType : bannertype5})
if(existingBanner){

existingBanner.bannerType = bannertype5,
existingBanner.bannerTitle =  [title5],
existingBanner.bannerPhrase = [phrase5],
existingBanner.bannerSubText = [subtext5],
existingBanner.bannerAction = action5

existingBanner.images = processedImages

await existingBanner.save()
req.session.bannerAlert = true

res.redirect('/admin/banner')

}else{
                     

                      const banner = new bannerModel({
                                bannerType : bannertype5,
                                bannerTitle : [title5],
                                bannerPhrase : [phrase5],
                                bannerSubText : [subtext5],
                                bannerAction : [action5],
                                images : processedImages
                      })
                      await banner.save()
                      req.session.bannerAlert = true
                   
                     res.redirect('/admin/banner')
                    }
            } catch (error) {
                      console.log(error)
                      
            }


            



          
  }
          ,
          aboutBanner : async (req,res)=>{

            const { bannertype6} = req.body

           
            try {
                const processedImages = req.processedImages || [];
                const existingBanner = await bannerModel.findOne({bannerType : bannertype6})
if(existingBanner){

existingBanner.bannerType = bannertype6,


existingBanner.images = processedImages

await existingBanner.save()
req.session.bannerAlert = true

res.redirect('/admin/banner')

}else{
                     

                      const banner = new bannerModel({
                                bannerType : bannertype6,
                              
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
  mainAboutBanner : async (req,res)=>{

        const { bannertype7} = req.body

       
        try {
            const processedImages = req.processedImages || [];
            const existingBanner = await bannerModel.findOne({bannerType : bannertype7})
if(existingBanner){

existingBanner.bannerType = bannertype7,


existingBanner.images = processedImages

await existingBanner.save()
req.session.bannerAlert = true

res.redirect('/admin/banner')

}else{
                 

                  const banner = new bannerModel({
                            bannerType : bannertype7,
                          
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
dealerBanner : async (req,res)=>{

        const { bannertype8} = req.body

       
        try {
            const processedImages = req.processedImages || [];
            const existingBanner = await bannerModel.findOne({bannerType : bannertype8})
if(existingBanner){

existingBanner.bannerType = bannertype8,


existingBanner.images = processedImages

await existingBanner.save()
req.session.bannerAlert = true

res.redirect('/admin/banner')

}else{
                 

                  const banner = new bannerModel({
                            bannerType : bannertype8,
                          
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
contactBanner : async (req,res)=>{

        const { bannertype9} = req.body

       
        try {
            const processedImages = req.processedImages || [];
            const existingBanner = await bannerModel.findOne({bannerType : bannertype9})
if(existingBanner){

existingBanner.bannerType = bannertype9,


existingBanner.images = processedImages

await existingBanner.save()
req.session.bannerAlert = true

res.redirect('/admin/banner')

}else{
                 

                  const banner = new bannerModel({
                            bannerType : bannertype9,
                          
                            images : processedImages
                  })
                  await banner.save()
                  req.session.bannerAlert = true
               
                 res.redirect('/admin/banner')
                }
        } catch (error) {
                  console.log(error)
                  
        }


        



      
}
          ,
          showBanner : async (req,res)=>{
                    try {

                             let errors
                             let success
                              const banners = await bannerModel.findOne({bannerType : 'Main Banner'})
			const subbanner = await bannerModel.findOne({bannerType : 'Sub Banner'})
                              const deal = await bannerModel.findOne({bannerType : 'Deals banner'}) || ''
                              console.log(deal)
                              console.log(deal.length)
                              const offer = await bannerModel.findOne({bannerType:'Offer Banner'}) || ''
                              const sub = await bannerModel.findOne({bannerType : 'Sub Banner'}) || ''
                              const fest = await bannerModel.findOne({bannerType : 'Festival Banner'}) || ''
                              const about = await bannerModel.findOne({bannerType : 'About Banner'}) || ''
                              const mainabout = await bannerModel.findOne({bannerType : 'Main About Banner'}) || ''
                              const dealer = await bannerModel.findOne({bannerType : 'Dealer Banner'}) || ''
                              const contact = await bannerModel.findOne({bannerType : 'Contact Banner'}) || ''
                        

                            if(req.session.bannerError)
                              {
                                        const errors = req.session.errorMessageBanner
                                        console.log(errors)
                                       delete req.session.bannerError 
                              res.render('admin/admin/bannerManage',{banners,subbanner,errors,success,deal,offer,sub,fest,about,mainabout,dealer,contact})
                              }
                              else if(req.session.bannerAlert)
                              {
                                        success = 'Banner Upload Succesfull'
                                        delete req.session.bannerAlert
                                        res.render('admin/admin/bannerManage',{banners,subbanner,errors,success,deal,offer,sub,fest,about,mainabout,dealer,contact}) 
                              }
                              else
                              {
                                        
                                        res.render('admin/admin/bannerManage',{banners,subbanner,errors,success,deal,offer,sub,fest,about,mainabout,dealer,contact}) 
                              }

                    } catch (error) {
                              console.log(error)
                    }
          }
}