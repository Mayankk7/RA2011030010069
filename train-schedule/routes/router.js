const router = require("express").Router();
const {getTrains, Register, GetToken} = require("../controller/controller");


router.get('/trains',getTrains);
router.post('/register',Register);
router.post('/auth',GetToken);
module.exports = router;