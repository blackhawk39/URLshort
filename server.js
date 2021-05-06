const express = require('express')
const app = express()
const mongoose=require('mongoose')
const shortid = require('shortid')
const ShortUrl =require('./models/url')
const murl = 'mongodb+srv://srbh:mangoatlas@cluster0.yotf1.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
const baseUrl= "https://poxyurl.herokuapp.com/"
const connectionParams={
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true 
}
mongoose.connect(process.env.MONGODB_URI||murl,connectionParams)
    .then( () => {
        console.log('Connected to database ')
    })
    .catch( () => {
        console.error(`Error connecting to the database.`);
})
app.set('view engine', 'ejs')
app.use(express.urlencoded({extended:false}))
app.get('/', async(req,res) =>{
    const shorturls= await ShortUrl.find()
    res.render('index', { shorturls:shorturls})
})
app.post('/shortUrls', async (req,res)=> {
    const uid= shortid.generate();
    const surl= baseUrl+uid;
    await ShortUrl.create({full: req.body.fullurl, short: surl })
    res.redirect('/')
})
app.get('/:shorturl', async(req,res) => {
    const shorturl= await ShortUrl.findOne({ short: baseUrl+req.params.shorturl})
     if( shorturl==null ) return res.sendStatus(404)
    shorturl.clicks++
    shorturl.save()
    res.redirect(shorturl.full)
})
app.listen(process.env.PORT || 4000)
