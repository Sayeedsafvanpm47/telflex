const bannerModel = require('../../models/bannerModel')

module.exports = {
          addBanner : async (req,res)=>{

                    const { bannertype , title, phrase, subtext, action, offer, mrp, start, end, discount, images} = req.body

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
                    



                  
          }
}