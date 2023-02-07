const express = require('express')
const router = express.Router()

const multer = require('multer')
const path = require('path')

const PortfolioControllers = require('../controllers/Portfolio')



const storage = multer.diskStorage({
    destination: function(req, file, cb){
          cb(null, "public/imgUsers/")
    },
    filename: function(req, file, cb){
        cb(null, file.originalname + Date.now() + path.extname(file.originalname))
    }
})
const upload = multer({storage})



router.get('/', PortfolioControllers.start)
router.get('/registrar', PortfolioControllers.registrar)
router.post('/registrar', PortfolioControllers.registrarUser)
router.get('/logout', PortfolioControllers.logout)
router.post('/login', PortfolioControllers.login)
router.get('/recuperarSenha', PortfolioControllers.recuperarSenha)
router.post('/registrarNovaSenha', PortfolioControllers.registrarNovaSenha)
router.get('/concluirRecuperacaoDeSenha/:id', PortfolioControllers.atualizarSenha)
router.post('/senhaAtualizada', PortfolioControllers.senhaAtualizada)
router.get('/dashboard', PortfolioControllers.dashboard)
router.post('/uploadImg',upload.single('imgName'), PortfolioControllers.addFoto)
router.get('/:id', PortfolioControllers.MyPort)

module.exports = router