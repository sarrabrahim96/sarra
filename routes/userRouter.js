const router = require("express").Router()
const userCtrl = require ('../controllers/userCtrl')
const auth = require('../middelware/auth')

router.post('/register',userCtrl.register)
router.post('/login', userCtrl.login)
router.get('/logout',userCtrl.logout)
router.get('/refresh_token',userCtrl.refreshToken)
router.get('/infor', auth , userCtrl.getUser)
router.get('/users' , userCtrl.getAllUseres)  
router.put('/updateUser/:id' ,  userCtrl.UpdateUser)




module.exports = router