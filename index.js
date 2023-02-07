const express = require('express')
const exphbs = require('express-handlebars')

const portfolioRoutes = require('./routes/portfolio')
const Portfolio = require('./models/dbPortfolio') 

const { Cookie } = require('express-session')
const session = require('express-session')
const FileStore = require('session-file-store')(session)

const multer = require('multer')
const path = require('path')

const flash = require('express-flash')

const app = express()

app.use(
    express.urlencoded({
         extended: true
    })
)
app.use(express.json())

app.use(flash())


app.engine('handlebars', exphbs.engine())
app.set('view engine', 'handlebars')
app.use(express.static('public')) 



app.use(
    session({
          name: 'session',
          secret: 'nosso_secret',
          resave: false,
          saveUninitialized: false,
          store: new FileStore({
              logFn: function() {}, 
              path: require('path').join(require('os').tmpdir(), 'session'),
          }),
          cookie: {
               secure:false,
               maxAge: 86400000 ,
               expires: new Date(Date.now()+86400000),
               httpOnly: true
          }
    })
)

app.use((req, res, next)=>{
        if(req.session.userid){
             res.locals.session = req.session
        }

        next()
})


app.use('/', portfolioRoutes) 


Portfolio.sync().then(()=>{
    app.listen(process.env.PORT || 3000)
}).catch((err) => console.log(err))
//{force:true}