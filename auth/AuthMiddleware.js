// authorization functions
// Used the following resource to get started with JWT
// https://medium.com/dev-bits/a-guide-for-adding-jwt-token-based-authentication-to-your-single-page-nodejs-applications-c403f7cf04f4
const jwt = require('jsonwebtoken');
const secret = process.env.REACT_NATIVE_APP_SECRET

let checkToken = (req, res, next) => {
  let token = req.headers['x-access-token'] || req.headers['authorization']; // Express headers are auto converted to lowercase
  if (token.startsWith('Bearer ')) {
    // Remove Bearer from string
    token = token.slice(7, token.length);
  }

  if (token) {
    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        return res.json({
          success: false,
          message: 'Token is not valid'
        });
      } else {
        req.decoded = decoded;
        next();
      }
    });
  } else {
    return res.json({
      success: false,
      message: 'Auth token is not supplied'
    });
  }
};

module.exports = {
  checkToken: checkToken
}



// const isLoggedIn = (req, res, next) => {
//     console.log(req)
//     if(req){
//         next()
//     } else {
//         res.status(401).json({
//             message: 'Unauthorized, Please Login'
//         })
//     }
// }

// module.exports = {
//     isLoggedIn
// }