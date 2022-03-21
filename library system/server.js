const express=require('express')
const mongoose=require('mongoose')

const app=express();

app.use(express.json())

const connect=()=>{
    return mongoose.connect("mongodb+srv://pranjal2795:Saridon1@cluster0.e0wvc.mongodb.net/myFirstDatabase?retryWrites=true&w=majority")
}

const userSchema = new mongoose.Schema(
    {
        firstName:{type:String,required:true,minLength:3,maxLength:30},
        lastName:{type:String,required:false,minLength:3,maxLength:30},
        age:{type:Number,required:true,range:{min:{type:Number, min: 1},max:{type:Number, max: 150}}},
        email:{type:String, required:true, unique:true},
        profileImages:{type:String,required:true,range:{min:{type:String, min: 1}}},
        bookId:{type:mongoose.Schema.Types.ObjectId,ref:"book", required:false}
    },
    {
        versionKey:false,
        timestamps:true
    }
)
const User = mongoose.model("user",userSchema);



const bookSchema = new mongoose.Schema(
    {
        likes:{type:Number, required:true, default:0,range:{min:{type:Number, min:0},max:{type:Number, max:1}}},
        coverImage :{type:String, required:true,range:{max:{type:String, max: 1}}},
        content:{type:String, required:true},
        userId:{type:mongoose.Schema.Types.ObjectId,ref:"user", required:true},
        publicationId:{type:mongoose.Schema.Types.ObjectId,ref:"publication", required:true},
        commentId:{type:mongoose.Schema.Types.ObjectId,ref:"comment", required:false}
    },
    {
        versionKey:false,
        timestamps:true
    }
)
const Book = mongoose.model("book",bookSchema);



const publicationSchema = new mongoose.Schema(
    {
        name:{type:String, required:true},
        bookId:{type:mongoose.Schema.Types.ObjectId,ref:"book", required:false}
    },
    {
        versionKey:false,
        timestamps:true
    }
)
const Publication = mongoose.model("publication",publicationSchema);


const commentSchema = new mongoose.Schema(
    {
        body:{type:String, required:true},
        userId:{type:mongoose.Schema.Types.ObjectId,ref:"user", required:true},
        bookId:{type:mongoose.Schema.Types.ObjectId,ref:"book", required:false}
    },
    {
        versionKey:false,
        timestamps:true
    }
)
const Comment = mongoose.model("comment",commentSchema);



// CRUD

app.post("/user",async(req,res)=>{
try {
    const user = await User.create(req.body);
    return res.status(200).send({ user});
} catch (error) {
    return res.status(500).send(error.message);
}
});

app.post("/post",async(req,res)=>{
try {
    const book = await Book.create(req.body);
    return res.status(200).send({ book});
} catch (error) {
    return res.status(500).send(error.message);
}
});

app.post("/comment",async(req,res)=>{
try {
    const comment = await Comment.create(req.body);
    return res.status(200).send({ comment });
} catch (error) {
    return res.status(500).send(error.message);
}
});

app.get("/user:id",async(req,res)=>{
try {
    const user= await User.find(req.params.id).limit(10).lean().exec()
    return res.status(200).send({user: user,login:"login:successful"});
} catch (error) {
    return res.status(500).send("login unsuccessful");
}
});

app.listen(5000, async() => {
try{
    await connect();
}
catch(error) {
    console.log(error.message);
}
console.log("listening on port 5000");
});