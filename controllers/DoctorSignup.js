const {getDB} =require('../dbms');
const bcrypt = require("bcrypt");
const uuid = require('uuid').v4;
const jwt =require('jsonwebtoken');

const ACCESS_TOKEN = 'fbvglafghzdhdirgfasdlfger';
const upload =require('../File_uploads/single')
let document = 'doctor_inf';
const sessions ={}; 

const Doctor ={

        signup:async(req,res)=>{
            try {
                upload(req, res, async function (err) {
                    if (err) {
                        console.error("Error uploading file: " + err);
                        return res.status(400).json({ error: err.message });
                    }
                    const doctor_inf ={
                        Dr_id         : req.body.Dr_id,
                        dr_name       : req.body.Dr_name,
                        Gender        : req.body.Gender,
                        Degree        : req.body.Degree,
                        Yr_of_passing : req.body.Yr_of_passing,
                        Univ_Board    : req.body.Univ_Board,
                        Category      : req.body.Category,
                        Govt_Private  : req.body.Govt_Private,
                        Address       : req.body.Address,
                        Adhaar_No     : req.body.Adhaar_No,
                        Mobile_Num    : req.body.Mobile_Num,
                        Mail_id       : req.body.Mail_id,
                        password      : req.body.password,
                        Approved      : req.body.Approved,
                        Language      : req.body.Language,
                        filename      : req.file.filename
                        };
                    var d =Date.now();
                    console.log(doctor_inf);
                    console.log(d);

                    doctor_inf['password']  = await bcrypt.hashSync(doctor_inf.password,20);
                     
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

                })} catch (error) {
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
                    const result = await collections.findOne({Mail_id:useremail});

                    console.log(result.password);

                    const psw = bcrypt.compareSync(password,result.password)
                    if(!psw){
                        res.status(400).send(`password Don't Match............`);
                     }
                    else{
                        let token_id =  jwt.sign({useremail, password},ACCESS_TOKEN,{expiresIn:'2d'});

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
          avail:async(req,res)=>{
            try{
                let document ='d_avail';
                const time = req.body;
                const db = getDB();
                    const collection = db.collection(document);
                    await collection.insertOne(time);
                   res.status(200).send("Success.....");
            }catch (err){
                res.status(400).send("input Error......");
            } 
          }
}

module.exports = Doctor ;