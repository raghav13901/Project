const express = require("express");
const router = express.Router();

const {
  search,
  getData,
  getUser,
  enterData,
  delData,
  changeData
} = require("../controllers/dashboard");

router.route("/getTableName/:query").post(search);
router.route("/getTable").post(getData);
router.route("/getData/:id").get(getUser);
router.route("/enterData").post(enterData);
router.route("/delData").post(delData);
router.route("/changeData/:amount/:id").post(changeData);

module.exports = router;
