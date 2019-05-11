require('dotenv').config() ;
const express = require('express')
const mongoose = require('mongoose')
const users = require('./routes/api/users')
const vgs_users =require('./routes/api/vgsUsers')
const votes = require('./routes/api/votes')
const lookups = require('./routes/api/Lookups/lookupsData')
const cors = require('cors')

mongoose.connect(process.env.MONGO, {dbName:"test",useNewUrlParser:true})


const app = express()
app.use(cors({  
    //origin:"http://localhost:3000"
}))

app.use(express.json())

app.get('/', (req, res) => {
    res.send(`<h1>¡AWG!</h1>
    <a href="/api/AWGs">AWGs</a>
    <a href="/api/Nebny">Nebny</a>
    <a href="/api/MUN">MUN</a>
    <a href="/api/VGS">VGS</a>
    <a href="/api/TIQ">TIQ</a>
    <a href="/api/awgs">About Clubs</a>
    <a href="/api/profile">edit or view your profile</a>
    <a href="/api/eventforms">view all eventforms</a>    
    <a href="/api/Events">Events</a>
    <a href="/api/faq">FAQ</a>` );
})

// Direct routes to appropriate files 
app.use('/api/profile', users)
app.use('/api/VGS', vgs_users);
app.use('/api/raise_vote', votes)
app.use('/api/lookups', lookups)


// Handling 404
app.use((req, res) => {
    res.status(404).send({err: 'We can not find what you are looking for'});
})

 const PORT= process.env.PORT || 8000 ;

 if(process.env.NODE_ENV !== 'test'){
    const server = app.listen(PORT, () => console.log(`${PORT} is live and running...`))
    module.exports = server
}
/* const port= process.env.PORT || 8000 ;
 const server =app.listen(port, () => console.log(`${port} is live and running...`))
 //app.listen(port, ()=> console.log(`${PORT} is live and running`))
 module.exports=server*/
