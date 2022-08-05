var { expressjwt: jwt } = require('express-jwt');
const api= process.env.API_URL;
function authJwt() {
    const secret = process.env.secret;
    return jwt({
      secret,
      algorithms: ['HS256'],
    }).unless({
      path: [
        { url: /\/public\/uploads(.*)/, methods: ['GET', 'OPTIONS'] },
        { url: /\/api\/v1\/itemdetails(.*)/, methods: ['GET', 'OPTIONS'] },
        { url: /\/api\/v1\/categories(.*)/, methods: ['GET', 'OPTIONS'] },
        { url: /\/api\/v1\/itemquality(.*)/, methods: ['GET', 'OPTIONS'] },
        { url: /\/api\/v1\/units(.*)/, methods: ['GET', 'OPTIONS'] },
        { url: /\/api\/v1\/vehicles(.*)/, methods: ['GET', 'OPTIONS'] },
        { url: /\/api\/v1\/users\/getbynum(.*)/, methods: ['GET', 'OPTIONS'] },
        { url: /\/api\/v1\/users\/getbyemail(.*)/, methods: ['GET', 'OPTIONS'] },
        `${api}/users/login`,
        `${api}/users/register`,
        `${api}/orders`,
        `${api}/orderitems`,
        /\/otpsms*/,
      ],
    });
}
async function isRevoked(req, payload, done){
    if(!payload.isAdmin){
        done(null, true)
    }
    done();
}
module.exports = authJwt;