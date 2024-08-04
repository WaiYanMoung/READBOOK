import express, { query } from "express";
import bodyParser from "body-parser";
import axios from "axios";


const app = express();
const port = 1234;
const _URL = "http://localhost:1500"
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("publics"));


app.get("/", async (req,res)=>{
    const result = await axios.get(_URL);
    console.log(result.data.data);
    res.render("index.ejs",{data : result.data.data})
});
app.get("/new",(req,res)=>{
    res.render("new.ejs",{
        data:{
        notes:[
            {note : ""}
        ]}})
});
app.get("/view", async(req,res)=>{
   const id = req.query.id;
    var params = new URLSearchParams();
    params.append("id",id);
    const request = await axios.post(_URL+"/edit",params);
    console.log(request.data);
    if(request.data.type == "success"){
        if(request.data.message == "Nodata"){
            res.render("view.ejs");
        }else{
            res.render("view.ejs",{data: request.data.data[0]})
        }
    }
});

app.get("/edit", async(req,res)=>{
    const id = req.query.id;
     var params = new URLSearchParams();
     params.append("id",id);
     const request = await axios.post(_URL+"/edit",params);
     console.log(request.data);
     if(request.data.type == "success"){
         if(request.data.message == "Nodata"){
             res.render("new.ejs");
         }else{
             res.render("new.ejs",{data: request.data.data[0]})
         }
     }
 });

 app.post("/save",async (req,res)=>{
    console.log("hello")
    console.log(req.body);
    var reqData = req.body;
    if(req.body.id){
        var id = req.body.id;
        
        var params = new URLSearchParams();
        params.append("id",id);
        params.append("title",reqData.title);
        params.append("isbn",reqData.isbn);
        params.append("rating",reqData.rating);
        params.append("review",reqData.review);
        params.append("note",reqData.note);
       const result = await axios.put(_URL,params);
        console.log(result);
        if(result.data.type == "success"){
            if(result.data.message == "Updated success"){
                res.redirect("/")
            }
        }else{
            res.redirect("/edit?id="+ id);
        }
    }else{
        var params = new URLSearchParams();
        params.append("title",reqData.title);
        params.append("isbn",reqData.isbn);
        params.append("rating",reqData.rating);
        params.append("review",reqData.review);
        params.append("note",reqData.note);
        console.log("INSERT");
        console.log(params);
        const result = await axios.post(_URL,params);
        if(result.data.type == "success"){
            if(result.data.message == "Save success"){
                res.redirect("/");
            }else{
                res.redirect("/new");
            }
        }else{
            res.redirect("/new");
        }
    }
 });

app.listen(port,()=>{
    console.log(`Port is listening on ${port}`);
})