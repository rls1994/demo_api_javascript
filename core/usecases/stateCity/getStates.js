//import model
const model = require("../../models/stateCity");

//get states 
module.exports = async () => {
  return await model.find().select("name").exec()
}