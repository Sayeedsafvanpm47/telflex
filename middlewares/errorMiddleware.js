
function errorCheck (err,req,res,next){
          req.session.errorOccured = true
                    req.session.error = err.message || 'Error occured'
      if (err.isRestCall) {
                    
                    console.log('error occured')
                    
                    res.status(err.status || 500).redirect('/user/error');
                  } else {
                   
                    res.status(err.status || 500).redirect('/user/error');
                  }
}


module.exports = errorCheck