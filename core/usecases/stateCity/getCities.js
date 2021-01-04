//import model
const model = require("../../models/stateCity");

//get cities 
module.exports = async (stateId) => {
  return await model.findOne({_id:stateId}).select("cities").exec()
}