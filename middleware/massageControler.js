const massageModel = require('../models/massageModel');
const Types = require('mongoose').Types
module.exports.addMassage = async(req,res,next)=>{

        try{
            const {from,to,message} = req.body;

            fromNew = new Types.ObjectId(from);
            toNew = new Types.ObjectId(to);

            const data = await massageModel.create({

                message : {text:message},
                users : [fromNew,toNew],
                sender : fromNew,
                flag : "send"

            });

            console.log("Added Massage : "+data);

            if(data){
                return res.json({
                    msg : "Massage Added",
                    massage_id : data._id,
                    date:data.createdAt

                })
            }else{
                return res.json({
                    msg : "Faild to add "
                })
            }


        }catch(ex){
            next(ex);
            
        }
};

module.exports.getAllMessage = async (req,res,next)=>{

    try{

        console.log( req.body);
        const {from,to} = req.body;

        fromNew = new Types.ObjectId(from);
        toNew = new Types.ObjectId(to);

        const massages = await massageModel.find({

            users:{
                $all :[fromNew,toNew],
            },


        }).sort({updatedAt:1});


        

        const projectedMassages = massages.map((msg)=>{

                return{
                    fromSelf : msg.sender.toString() === from,
                    message : msg.message.text,
                    massageID : msg._id,
                    date : msg.createdAt
                };

        });

        
        res. json({
            flag : "Sucsess",
            massages : projectedMassages
            
        })


    }catch(err){
        next(err);
    }

};


module.exports.updateAllSendMassageToSeen = async (req,res,next)=>{

    try{

        console.log( req.body);
        const {from,to} = req.body;

        fromNew = new Types.ObjectId(from);
        toNew = new Types.ObjectId(to);

        

        const filter = { 
            users:{
                $all :[fromNew,toNew],
            },
            flag: 'send' 
        };

        // Update operation
        const update = { $set: { flag: 'seen' } };

        const massages = await massageModel.updateMany(filter, update, function(err, result) {
            if (err) {
              console.log('Error updating documents:', err);

              res. json({
                flag : "Fail"                
               })

              return;
            }


            res. json({
                flag : "Sucsess"                
            })
        
            console.log('Documents updated:', result.modifiedCount);
    
          });

          
        


    }catch(err){
        next(err);
    }

};


module.exports.getLastMassage = async (req,res,next)=>{

    try{

        console.log( req.body);
        const {from,to} = req.body;

        fromNew = new Types.ObjectId(from);
        toNew = new Types.ObjectId(to);

        /* const massages = await massageModel.find({

            users:{
                $all :[fromNew,toNew],
            },


        }).sort({updatedAt:1}); */


         const massages = await massageModel.find({
            users:{
                $all :[fromNew,toNew],
            },
            flag : "send",

        }).sort({_id: -1});


        const projectedMassages = massages.map((msg)=>{

                return{
                    fromSelf : msg.sender.toString() === from,
                    message : msg.message.text,
                    flag : msg.flag,
                    date : msg.createdAt
                };

        });
        
        
        res. json({
            flag : "Sucsess",
            massages : projectedMassages,
            unread_massages_size : projectedMassages.length
        })


    }catch(err){
        next(err);
    }

};


module.exports.getRealLastMassage = async (req,res,next)=>{

    try{

        console.log( req.body);
        const {from,to} = req.body;

        fromNew = new Types.ObjectId(from);
        toNew = new Types.ObjectId(to);

        const massages = await massageModel.findOne({

            users:{
                $all :[fromNew,toNew],
            },


        }).sort({updatedAt:-1});


        console.log(massages);

        res. json({
            flag : "Sucsess",
            message : massages.message.text,
            _id : massages._id,
            flag : massages.flag,
            date : massages.createdAt,
            fromSelf : massages.sender.toString() === from,

        })

        /* const projectedMassages = massages.map((msg)=>{

                return{
                    fromSelf : msg.sender.toString() === from,
                    message : msg.message.text,
                    flag : msg.flag,
                    date : msg.createdAt
                };

        });
        
        
        res. json({
            flag : "Sucsess",
            massages : projectedMassages,
            unread_massages_size : projectedMassages.length
        })
 */

    }catch(err){
        next(err);
    }

};
