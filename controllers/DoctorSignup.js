const {getDB} =require('../dbms');
const bcrypt = require("bcrypt");
const uuid = require('uuid').v4;
const jwt =require('jsonwebtoken');


let document = 'doctor_inf';
const sessions ={}; 

const Doctor ={

        signup:async(req,res)=>{
            try {
                    const doctor_inf = req.body;

                    doctor_inf['password']  = await bcrypt.hashSync(doctor_inf['password'],20);
                     
                     console.log(doctor_inf['password']);

                    const db = getDB();
                    const collection = db.collection(document);
                    await collection.createIndex({
                        Dr_id:1,
                        Mail_id: 1
                    }, {
                        unique: true
                    })
                   await collection.insertOne(doctor_inf);
                   res.status(200).send("Success.....");

                } catch (error) {
                    console.error('Error creating user:', error);
                    if (error.code === 11000) {
                    // Duplicate key violation error
                    res.status(409).json({
                        error: 'Duplicate key error'
                    });
                    } else {
                    res.status(500).json({
                        error: 'Internal Server Error'
                    });
                }
            }
        },
        getUsers: async (req,res) => {
            try {
                    const db = getDB();
                    const collection = db.collection(document);
                    const result = await collection.find().toArray();
                    res.status(200).json({
                        "result":"Success",
                        "Success":result
                    });

                    } catch (error) {
                        console.error('Error fetching users:', error);
                        throw error;
                    }
        },

        loginuser: async (req,res)=>{
            try {
    
                    const  useremail = req.body.useremail;
                    const  password  = req.body.password;
                    const sessionId =uuid();
            
                if(useremail!=''&& useremail!= null){
                    const collections = getDB().collection(document);
                    const result = await collections.findOne({email:useremail});

                    console.log(result.password);

                    const psw = bcrypt.compareSync(password,result.password)
                    if(!psw){
                        res.status(400).send(`password Don't Match............`);
                     }
                    else{
                        const token_id =  jwt.sign(useremail,password,process.env.ACCESS_TOKEN);

                                sessions[sessionId] = {useremail,userId : 1};

                                res.set('Set-Cookie',`session=${sessionId}`);
                                res.status(200).json({
                                'Result' :'Success...',
                                'token' : token_id
                                });  
                        } 
                }
                else{
                        console.log("Undefined.....")
                        res.send("Undefined.......////")}
 
            }catch (err){
                        res.status(400).send("Invalid....");
                    }  
          },
          avile:async(req,res)=>{
            try{
                let document ='d_avail';
                const time = req.body;
                const db = getDB();
                    const collection = db.collection(document);
                    await collection.insertOne(time);
                   res.status(200).send("Success.....");
            }catch (err){
                res.status(400).send("Invalid....");
            } 
          }
}

module.exports = Doctor ;