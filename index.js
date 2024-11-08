








//schema.js
const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
	name: {type: String},
        email: {type: String},
        mobile: {type: Number},
        description: {type: String},
	blocked: {type: Boolean},
        liked : {type: Boolean},
});

const nodemailer = require('nodemailer');
const transport = nodemailer.createTransport({
	host: 'your host',
	port: 587,
	secure: false,
	auth: { user: 'username', pass: 'passwd',},
});

module.export = mongoose.model("TODO", contactSchema);

//controller.js
const TODO = mongoose.model("TODO", contactSchema);

const createContact = async (req, res) => {
	try{
		const creatingCont = await TODO.create(req.body);
		res.status(201).send(creatingCont);
	}catch(err){res.status(500).send(err.message);};

};
const getAllContact = async (req, res) => {
	try{
                const getAllCont = await TODO.find().sort( {createdAt: -1} );
                res.status(201).send(getAllCont);
        }catch(err){res.status(500).send(err.message);};
};
const getContact = async (req, res) => {
	try{
		if(!mongoose.Types.ObjectId.isValid(req.params)){
			return res.status(400).send("Invalid Id");
		};
		const {id} = req.params;
                const getCont = await  TODO.findById(id);
                return res.status(200).json(getCont);
        }catch(err){res.status(500).send(err.message);};
};
const updateContact = async (req, res) => {
	try{
		if(!mongoose.Types.ObjectId.isValid(req.params)){
                        return res.status(400).send("Invalid Id");
                };
		const {id} = req.params;
                const updateCont=await TODO.findByIdAndUpdate(id, req.body, {new: true});
                if(!updateCont){
			return res.status(404).send("No todo with that Id");
		};
		return res.status(200).json(updateCont);
        }catch(err){res.status(500).send(err.message);};
};
const deleteContact = async (req, res) => {
	try{
                if(!mongoose.Types.ObjectId.isValid(req.params)){
                        return res.status(400).send("Invalid Id");
                };
		const {id} = req.params;
                const delCont=await TODO.findByIdAndDelete(id);
                if(!delCont){
                        return res.status(404).send("No todo with that Id");
                };
                return res.status(200).json(delCont);
        }catch(err){res.status(500).send(err.message);};
};


const liked = async (req,res)=>{
        try{
        const contactLike = await TODO.findByIdAndUpdate(req.params.id, {liked: true}, {new: true});
        res.status(201).send(contactLike);
        }catch(err){
        res.status(500).send(err);
        }
};

const block = async (req,res)=>{
        try{
        const blocking = await TODO.findByIdAndUpdate(req.params.id, {blocked: true}, {new: true});
        res.status(201).send(blocking);
        }catch(err){
        res.status(500).send(err);
        }
};

const sendEmail = async (toEmail, subject, message) => {
  try {
    await transporter.sendMail({
      from: 'your_email_address',
      to: toEmail,
      subject: subject,
      text: message,
    });
    console.log('Email sent successfully');
  } catch (err) {
    console.error('Error sending email:', err);
  }
};

const submitEmailwithDetails = async (req, res)=>{
	try {
    const contactId = req.params.id;
    const { subject, message } = req.body;

    const contact = await TODO.findById(contactId);
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    await sendEmail(contact.email, subject, message);
    res.json({ message: 'Email sent successfully' });
  } catch (err){res.send(err)}; 
};


module.exports = {createContact, getAllContact, getContact, updateContact, deleteContact, liked, block, sendEmail};

//router.js
const {authenticateToken} = require('./auth.js');
const express = require("express");
const router = express.Router();

router.post("/todo", createContact);
router.get("/todo", authenticateToken, getAllContact);
router.get("/todo/:id", authenticateToken, getContact)
router.put("/todo/:id", authenticateToken, updateContact);
router.delete("/todo/:id", authenticateToken, deleteContact);

router.put("/todo/like/:id", authenticateToken, liked);
router.put("/todo/block/:id", authenticateToken, block);
router.post("/todo/email/:id", authenticateToken, submitEmailwithDetails);
module.export = router;






// index.js
const userModel = require('./models/userModel.js');
const userRoutes = require('./routes/userRoutes.js');

const cors = require("cors");
require("dotenv").config();
const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/v1", router);
app.use("/", userRoutes);

mongoose.connect(process.env.MONGO_URI).then( ()=>{
	console.log("Database Connected");
}).catch( (err)=>{ console.log(err); } );

const PORT = 3000;
app.listen(PORT, ()=>{
	console.log(`Serving at http://localhost/${PORT}`);
});


























