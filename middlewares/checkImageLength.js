const checkMainBanner = (req, res, next) => {
         let errors = []
         
          if (!req.files || req.files.length === 0) {
                    errors.push('Please upload the images!')
                  }
                
                 
                  if (req.files.length > 3) { 
                    errors.push('you can only upload 3 images')
                  
                  }
                  if (req.files.length < 3) { 
                    errors.push('you have to upload 3 images')
                  }
                  if(errors.length>0)
                  {
                    req.session.bannerError = true
                   req.session.errorMessageBanner = errors
                  return res.redirect('/admin/banner')
                  }

          next();
        };

        const checkDealsBanner = (req, res, next) => {
          let errors = []
         
          if (!req.files || req.files.length === 0) {
                    errors.push('Please upload the images!')
                  }
                
                 
                  if (req.files.length > 2) { 
                    errors.push('you can only upload 2 images')
                  
                  }
                  if (req.files.length < 2) { 
                    errors.push('you have to upload 2 images')
                  }
                  if(errors.length>0)
                  {
                    req.session.bannerError = true
                   req.session.errorMessageBanner = errors
                  return res.redirect('/admin/banner')
                  }

          next();
        };
        
        const checkSubBanner = (req, res, next) => {
          let errors = []
         
          if (!req.files || req.files.length === 0) {
                    errors.push('Please upload the images!')
                  }
                
                 
                  if (req.files.length > 1) { 
                    errors.push('you can only upload 1 image')
                  
                  }
                  if (req.files.length < 1) { 
                    errors.push('you have to upload 1 image')
                  }
                  if(errors.length>0)
                  {
                    req.session.bannerError = true
                   req.session.errorMessageBanner = errors
                  return res.redirect('/admin/banner')
                  }

          next();
        };
        

        const checkOfferBanner = (req, res, next) => {
          let errors = []
         
          if (!req.files || req.files.length === 0) {
                    errors.push('Please upload the images!')
                  }
                
                 
                  if (req.files.length > 3) { 
                    errors.push('you can only upload 3 images')
                  
                  }
                  if (req.files.length < 3) { 
                    errors.push('you have to upload 3 images')
                  }
                  if(errors.length>0)
                  {
                    req.session.bannerError = true
                   req.session.errorMessageBanner = errors
                  return res.redirect('/admin/banner')
                  }

          next();
        };
        

        module.exports = {checkMainBanner,checkDealsBanner,checkSubBanner,checkOfferBanner}