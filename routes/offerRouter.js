const router = require("express").Router()  
const offerCtrl = require("../controllers/offerCtrl")
const auth = require("../middelware/auth")
const authAdmin = require("../middelware/authAdmin")


router.route('/offer')
    .get(offerCtrl.getOffers)
    .post(auth , authAdmin ,offerCtrl.createOffers)

router.route('/offer/:id') 
    .delete(auth , authAdmin , offerCtrl.deleteOffer)
    .put(auth , authAdmin , offerCtrl.updateOffer)





module.exports = router