const {
    addMassage,
    getAllMessage,
    getLastMassage,
    updateAllSendMassageToSeen,
    getRealLastMassage
} = require('../middleware/massageControler');

const router = require('express').Router();

router.post("/AddMassage",addMassage);
router.post("/getAllMassages",getAllMessage);
router.post("/getLastMassage",getLastMassage);
router.post("/updateAllSendMassageToSeen",updateAllSendMassageToSeen);
router.post("/getRealLastMassage",getRealLastMassage);

module.exports = router;
