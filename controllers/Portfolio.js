require('dotenv').config()

const Portfolio = require('../models/dbPortfolio')
const Info = require('../models/infoUsers')

const fs = require('fs')


const nodemailer = require('nodemailer')



module.exports = class PostsControllers {
         
        //Quando acessa a barra verifica se está logado, se estiver leva pra dash se não leva pra login
        static async start(req,res){

          //Verificar se está logado
          if(req.session.userid){   
               const id = req.session.userid

               const  checkUser = await Portfolio.findOne({raw:true, where: {id:id}})

               res.render('dashboard', {checkUser})
          } else{
               res.render('login')
          }

        }
        //Quando acessa a barra verifica se está logado, se estiver leva pra dash se não leva pra login




        //REGISTRAR
        static registrar(req,res){
             res.render('registrar')
        }


        static async registrarUser(req,res){
              const {nome, userName, email, senha, confirm} = req.body
              
              //Verificando se as senhas são diferentes
              if(senha != confirm){
                   req.flash('checkRegister', 'As senhas são diferentes!')
                   res.redirect('/registrar')

                   return
              }


              //Verificando se o userName contém espaços
              if (userName.indexOf(" ") !== -1){
                   req.flash('checkRegister', 'Seu User não pode conter espcaços!')
                   res.redirect('/registrar')

                   return
              } 
              
          
              const checkUser = await Portfolio.findOne({where: {userName: userName} })
              const checkEmail = await Portfolio.findOne({where: {email: email} })

              //verificando se tem o user já cadastado
              if(checkUser){
                   req.flash('checkRegister', 'Nome de Usuário indisponível!')
                   res.redirect('/registrar')

                   return
              }
               
              //Verificando se tem e-mail já cadastrado
              if(checkEmail){
                   req.flash('checkRegister', 'Email já está cadastrado no sistema!')
                   res.redirect('/registrar')

                   return
              }
              
              //Criando o User
              const createdUser = await Portfolio.create({nome, userName, email, senha}) 
               
              //Criando a tabela info
              const infoUser = {
                 UserId: createdUser.id,
                 trabalho: null,
                 cidade: null,
                 instagram: null,
                 linkedin: null,
                 whatsapp: null,
                 bio: null,
                 email: null,
                 link: null
              }

              await Info.create(infoUser)

              
              
              //Criando a sessão para manter o user logado
              req.session.userid = createdUser.id
              req.session.save(()=>{
                    res.redirect('/')
              })
        }
        //REGISTRAR




        //DESLOGAR
        static logout(req,res){
            req.session.destroy()
            res.redirect('/')
        }
        //DESLOGAR




        //LOGAR
        static async login(req,res){
              const {userName, senha} = req.body

              const checkUser = await Portfolio.findOne({raw:true, where: {userName: userName}})
              const checkSenha = await Portfolio.findOne({raw:true, where: {senha: senha}})

              if(checkUser == null){
                  req.flash('checkLogin', 'Usuário não encontrado!')
                  res.redirect('/')
                  return
              }

              if(!checkSenha){
                 req.flash('checkLogin', 'Senha incorreta!')
                 res.redirect('/')
                 return
              }


              if(checkUser.userName == userName && checkSenha.senha == senha){
                      
                    //Criando a sessão para manter o user logado
                    req.session.userid = checkUser.id
                    req.session.save(()=>{
                         res.redirect('/dashboard')
                    })
              }

        }
        //LOGAR




        //DASHBOARD
        static async dashboard(req,res){
                const user = req.session.userid

                if(user){
                     const checkUser = await Portfolio.findOne({include: Info, where:{id: user}})
                     res.render('dashboard', {checkUser: checkUser.get({plain: true})})
                } else{
                     res.redirect('/')
                }
        }
        //DASHBOARD




        //VIEW RECUPERAR SENHA ONDE O USER DIGITA O EMAIL
        static recuperarSenha(req,res){
               res.render('recuperarSenha')
        }
        //VIEW RECUPERAR SENHA ONDE O USER DIGITA O EMAIL



        //ROTA EM QUE O EMAIL É ENVIADO E DISPARA O AVISO PARA VERIFICAR O EMAIL
        static async registrarNovaSenha(req,res){
               const email = req.body.email

               const user = await Portfolio.findOne({raw:true, where: {email: email}})

               if(!user){
                    req.flash('checkNovaSenhaFail', 'Email não está cadastrado no sistema!')
                    res.redirect('/recuperarSenha')
                    return
               }


               //Enviar o E-mail
               const transporter = nodemailer.createTransport({
                    host: 'smtp.hostinger.com',
                    port: 587,
                    secure: false,
                    auth: {user: process.env.USER, pass: process.env.PASS} 
               })
          

               transporter.sendMail({
                    from: process.env.USER,
                    to: email,
                    subject: 'Recuperação de senha',
                    html: `
                         <div style="text-align: center; padding:20px">
                              <h3>Atualize sua senha clicando no botão abaixo:</h3>

                              <a style="padding: 5px; background-color: green; text-decoration: none; color:white;" href="http://localhost:3000/concluirRecuperacaoDeSenha/${email}">Recuperar senha</a>
                         </div>
                          `
               }).then((info)=>{console.log('Email Enviado')}).catch(err => console.log('Não enviado!', err))


               req.flash('checkNovaSenhaOk', 'Verifique seu E-mail para atualizar a senha!')
               res.redirect('/recuperarSenha')
               return
               
        }
        //ROTA EM QUE O EMAIL É ENVIADO E DISPARA O AVISO PARA VERIFICAR O EMAIL



        //VIEW ONDE O USER COLOCA SUA NOVA SENHA
        static async atualizarSenha(req,res){
              const email = req.params.id

              res.render('atualizarNovaSenha', {email})
        }
        //VIEW ONDE O USER COLOCA SUA NOVA SENHA




        //FINALIZAR A ATUALIZAÇÃO DE SENHA
        static async senhaAtualizada(req, res){
               const {email, password, confirm} = req.body

               if(password != confirm){
                    req.flash('novaSenha', 'As senhas não são iguais!')
                    res.render('atualizarNovaSenha', {email})
                    return
               }

               await Portfolio.update({senha: password}, {where:{email: email}}) 

               req.flash('senhaAtt', 'Sua nova senha foi atualizada!')
               res.redirect('/')
               return
        }
        //FINALIZAR A ATUALIZAÇÃO DE SENHA



        //ADICIONAR FOTO
        static async addFoto(req,res){
               const imgName = req.file.filename;
               const id = req.body.id
               const imgDeletar = req.body.imgName

               await Portfolio.update({imgName: imgName}, {where:{id: id}})

               if(imgDeletar){
                    fs.unlink(`public/imgUsers/${imgDeletar}`, (err) => {
                         if (err) {
                           console.error(err);
                           return;
                         }
                         
                         console.log(`Imagem ${imgDeletar} deletada com sucesso.`);
                    });
               }


               res.redirect('/')
        }
        //ADICIONAR FOTO




        //-------------------MY PORT--------------------
        static async MyPort(req,res){
             var user = req.params.id

             try{

                    const checkUserFull = await Portfolio.findOne({include: Info, where: {userName: user}})

                    const userData = checkUserFull.get({plain: true})

                    const userInfo = userData.infos[0]
          
                    res.render('myPort', {userData, userInfo})
            
          } catch(err){
                  console.log(err)
             }
        }
        //-------------------MY PORT--------------------




        //-----------ATUALIZAR INFO USER---------------
        static async attInfoUser(req,res){
               const {UserId, trabalho, cidade, instagram, linkedin, whatsapp, bio, email, link} = req.body

               await Info.update({trabalho, cidade, instagram, linkedin, whatsapp, bio, email, link}, {where:{UserId: UserId}})

               req.flash('InfoAtt', 'Suas informações foram atualizadas!')
               res.redirect('/')
               return
        }
        //-----------ATUALIZAR INFO USER---------------
          
}