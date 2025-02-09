const mongoose=require('mongoose');

const KatygorieModel=mongoose.Schema({
    nazwa_katygori:{
        type:String,
        required:true,
    },
},{collection: 'Katygorie'})

module.exports = mongoose.model("Katygorie",KatygorieModel);