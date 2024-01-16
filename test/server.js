import express from 'express'
const app = express();
app.get("/", async (req,res) => {
    try{
        throw new Error("Async Error")

    }catch(err){
        // res.send(err)
    }
    res.send("fuck")
});

app.get("/a", (req,res) => {
    throw new Error("Non async")
    res.send("fuck")
});

app.listen(3000, () => {
    console.log("Serevr started")
})