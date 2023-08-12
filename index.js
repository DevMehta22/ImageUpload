const express = require('express')
const multer = require('multer')
const ejs = require('ejs')
const path = require('path')

//Set Storage Engine
const storage = multer.diskStorage({
    destination:'./public/uploads/',
    filename: function(req,file,cb) {
     cb(null,file.fieldname+'-'+Date.now()+
     path.extname(file.originalname))   
    }
})

//init upload
const upload = multer({
    storage:storage,
    limits:{fileSize:1000000000},
    fileFilter:function(req,file,cb){
        checkFileType(file,cb)
    }
}).single('Image');

//check file type
checkFileType=(file,cb)=>{
    //Allowed extentions
    const filetypes=/jpeg|jpg|png|gif/
    //check extention
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    //check mimetype
    const mimetype = filetypes.test(file.mimetype)
    
    if(mimetype && extname){
        return cb(null,true)
    }else{
        return cb('Error:Files only of type jpg/jpeg/png/gif are allowed!')
    }
}

//init app
const app = express()
//EJS
app.set('view engine','ejs')
//public folder
app.use(express.static('./public'))

app.get('/',(req,res)=>res.render('app'))

app.post('/upload',(req,res)=>{
   upload(req,res,(err)=>{
    if(err){
        res.render('app',{
            msg:err
        })
    }else{
        if(req.file==undefined){
            res.render('app',{
                msg:'Error:No File selected'
            })
        }else{
            res.render('app',{
                msg:'File uploaded successfully!',
                file:`uploads/${req.file.filename}`
            })
        }
    }
   })
});

const port = 3000;
app.listen(port,()=>{
    console.log(`server is running on port ${port}`)
})