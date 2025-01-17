const express = require("express");
const cors = require("cors");
const bodyParser=require("body-parser")
const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));
const welcomeMessage ={
   
  id: 0,
  from: "Bart",
  text: "Welcome to CYF chat system!"

};

//This array is our "data store".
//We will start with one message in the array.
//Note: messages will be lost when Glitch restarts our server.
const messages = [welcomeMessage];
console.log(messages);

app.get("/", function (request, response) {
  response.sendFile(__dirname + "/index.html");
});
app.get("/messages",(request,response)=>{
  response.status(200).json({messages})
})

app.post("/messages",(req,res)=>{
  let massage1=req.body.text
  let name=req.body.from
  let maxId=messages.reduce((acc,cur)=>(cur.id>= acc ? cur.id : acc,0))

 let newId=(maxId.id+1)
 if (!massage1 || !name){
 res.status(400).send("input your name and message")
 
}else{
  let newMassage={
    id: newId
   , from: name
   ,text:massage1,
   timeSent:new Date(),
  }
  messages.push(newMassage)
  res.json(newMassage)
}
})
app.put('/messages/:id',(req,res)=>{
  const updatedIndex=+req.params.id
  const updateBody=req.body
  const findIndex=messages.find(item=>item.id===updatedIndex)
  // if(updatedIndex>=0){
  //   welcomeMessage={id: updatedIndex,...updateBody}
  // }
  // messages[findIndex]=welcomeMessage
  // res.send(welcomeMessage)
  const newmessage={...req.params,...req.body}
  messages.splice(findIndex,1,newmessage)
  res.send(messages)
})
app.get("/messages/:id",(req,res)=>{
   let idFound=Number(req.params.id)
  const findId=messages.find(item=>item.id===idFound)
  if (findId){
    res.status(200).send(findId)
  }else {
    res.status(404).send("item not found")
  } 
})
app.delete("/messages/:id",(req,res)=>{
  let idFound=Number(req.params.id)
  const filtered=messages.filter((item=>item.id !== idFound))
  if (filtered){
  res.status(200).send(filtered)
}else {
  res.status(404).send("item not found")
}
})
app.get("/messages/search",(req,res)=>{
  const filtered=messages.filter(item=>item.text.toLocaleLowerCase().includes(req.query.text.toLocaleLowerCase()))
  res.send(filtered)
})
app.get("/messages/latest",(req,res)=>{
  const filterd=messages.slice(Math.max(messages.length-10),1)
  res.send(filterd)
})

app.listen(process.env.PORT || 9080,(req,res)=>{
  console.log("server is running");
});
