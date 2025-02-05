const mongoose=require('mongoose');

const uzytkownicyModel= new mongoose.Schema({
    imie:{
        type:String,
        required: true,
      },
    nazwisko:{
        type:String,
        required: true,
      },
    email:{
        type:String,
        required: true,   
      },
    haslo:{
        type:String,
        required: true,   
    },
    admin:{
        type:Boolean,
        default: false,
    },
    data_utworzenia:{
        type:Date,
        default:Date.now,
    },
},{collection: 'Uzytkownicy'})

module.exports =mongoose.model("Uzytkownicy",uzytkownicyModel);