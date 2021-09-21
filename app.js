const express=require('express');
const Bookdata=require('./src/model/bookdata');
const Authordata=require('./src/model/authordata');
const Userdata=require('./src/model/userdata');
const jwt=require('jsonwebtoken');

const cors=require('cors');
var app=new express();
app.use(cors());
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb'}));
// app.use(express.json());
app.get('/books',function(req,res){
    res.header("Access-Control-Allow-Origin",'*')
    res.header("Access-Control-Allow-Methods:GET,POST,PUT,PATCH,DELETE,OPTIONS")
    Bookdata.find()
    .then(function(books){
        res.send(books)
    })
})
app.get('/authors',function(req,res){
    res.header("Access-Control-Allow-Origin",'*')
    res.header("Access-Control-Allow-Methods:GET,POST,PUT,PATCH,DELETE,OPTIONS")
    Authordata.find()
    .then(function(authors){
        res.send(authors)
    })
})
// app.post('/signup/insert', function(req,res){
//     res.header("Access-Control-Allow-Origin","*")
//     res.header("Access-Control-Allow-Methods:GET,POST,PATCH,PUT,DELETE,OPTIONS")
//     console.log(req.body);


// let  email=req.body.user.email;
// let  password=req.body.user.password;


//  Userdata.findOne({email:email,password:password},function(err,user){
//      if(user){
//         return res.status(400).send({message:"Already exist"});
        
//      }
         
//     if(!user){
//         var user={
//             name:req.body.user.name,
//            phonenumber:req.body.user.phonenumber,
//            email:req.body.user.email,
//            password:req.body.user.password,
//            passwordcheck:req.body.user.passwordcheck
//         }
// var user=new Userdata(user);
// user.save();
//     }
// })
// })


app.post('/signup/insert', function(req,res){
    res.header("Access-Control-Allow-Origin","*")
    res.header("Access-Control-Allow-Methods:GET,POST,PATCH,PUT,DELETE,OPTIONS")
    console.log(req.body);


let  email=req.body.user.email;
let  password=req.body.user.password;


 Userdata.findOne({email:email,password:password},function(err,user){
    
         
    if(!user){
        var user={
            name:req.body.user.name,
           phonenumber:req.body.user.phonenumber,
           email:req.body.user.email,
           password:req.body.user.password,
           passwordcheck:req.body.user.passwordcheck
        }
var user=new Userdata(user);
user.save();
return res.status(200).send();
    }
    else{
        return res.status(400).send({message:"Already exist"});
        
     }
})
})


  app.post('/login',(req,res)=>{
      let email=req.body.email;
      let password=req.body.password;
      

      Userdata.findOne({email:email,password:password},function(err,user){
        let payload = {subject:email+password}
          let token = jwt.sign(payload, 'secretKey')
        if(email==="admin@library.com" && password==="Admin@123" ){
            role="admin";
          res.status(200).send({token,role});
        }
        if(user){
           role="user";
          res.status(200).send({token,role})
        }
         
        
        else {
            res.status(400).send();
        }
    })
  })  

function verifyToken(req, res, next) {
    if(!req.headers.authorization) {
      return res.status(401).send('Unauthorized request')
    }
    let token = req.headers.authorization.split(' ')[1]
    if(token === 'null') {
      return res.status(401).send('Unauthorized request')    
    }
    let payload = jwt.verify(token, 'secretKey')
    if(!payload) {
      return res.status(401).send('Unauthorized request')    
    }
    req.userId = payload.subject
    next()
  }

app.post('/insert',verifyToken,function(req,res){
    res.header("Access-Control-Allow-Origin","*")
    res.header("Access-Control-Allow-Methods:GET,POST,PATCH,PUT,DELETE,OPTIONS")
    console.log(req.body);
var book={
    title:req.body.book.title,
    author: req.body.book.author,
    genre: req.body.book.genre,
    language: req.body.book.language,
    info: req.body.book.info,
    // fd:req.body.book.fd
    image: req.body.book.image,
    imgfile:req.body.book.imgfile
    
}
var book=new Bookdata(book);
book.save();
})
app.post('/authors/insert', function(req,res){
    res.header("Access-Control-Allow-Origin","*")
    res.header("Access-Control-Allow-Methods:GET,POST,PATCH,PUT,DELETE,OPTIONS")
    console.log(req.body);
var author={
    author: req.body.author.author,
    genre: req.body.author.genre,
    books: req.body.author.books,
    language: req.body.author.language,
    info: req.body.author.info,
    image: req.body.author.image,
    imgfile:req.body.author.imgfile
    
}
var author=new Authordata(author);
author.save();
})

app.get('/authors/:id',  (req, res) => {
  
    const id = req.params.id;
      Authordata.findOne({"_id":id})
      .then((author)=>{
          res.send(author);
      });
  })

 
  app.delete('/remove/:id',(req,res)=>{
   
    id = req.params.id;
    Bookdata.findByIdAndDelete({"_id":id})
    .then(()=>{
        console.log('success')
        res.send();
    })
  })
  app.delete('/remove/authors/:id',(req,res)=>{
   
    id = req.params.id;
    Authordata.findByIdAndDelete({"_id":id})
    .then(()=>{
        console.log('success')
        res.send();
    })
  })
  app.put('/update',(req,res)=>{
    console.log(req.body)
    id=req.body._id,
    title= req.body.title,
    author = req.body.author,
    genre = req.body.genre,
    language = req.body.language,
    info = req.body.info,
    image= req.body.image,
    imgfile=req.body.imgfile,

   Bookdata.findByIdAndUpdate({"_id":id},
                                {$set:{"title":title,
                                "author":author,
                                "genre":genre,
                                "language":language,
                                "info":info,
                                "image":image,
                                "imgfile":imgfile
                            }})
   .then(function(){
       res.send();
   })
 })

 app.put('/authors/update',(req,res)=>{
    console.log(req.body)
    id=req.body._id,
    author = req.body.author,
    genre = req.body.genre,
    books = req.body.books,
    language = req.body.language,
    info = req.body.info,
    image= req.body.image,
    imgfile=req.body.imgfile,
    
   Authordata.findByIdAndUpdate({"_id":id},
                                {$set:{
                                "author":author,
                                "genre":genre,
                                "books":books,
                                "language":language,
                                "info":info,
                                "image":image,
                                "imgfile":imgfile}})
   .then(function(){
       res.send();
   })
 })



    app.get('/:id',  (req, res) => {
  
        const id = req.params.id;
          Bookdata.findOne({"_id":id})
          .then((book)=>{
              res.send(book);
          });
      })
app.listen(12349,function(){
    console.log("listening to port 77777")
})
