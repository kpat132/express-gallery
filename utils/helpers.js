module.exports = {
  isAuthenticated: isAuthenticated 
}


function isAuthenticated (req, res, next) {
  if(req.isAuthenticated()) { next();}
  else { res.redirect('/gallery'); }
}