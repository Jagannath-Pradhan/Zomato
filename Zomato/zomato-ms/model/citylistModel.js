var mongoose = require("mongoose");

const cityListSchema = mongoose.Schema([{
    location_id: String,
    name: String,
    city: String
}])

const cityList = mongoose.model("cityList", cityListSchema);

module.exports = cityList;