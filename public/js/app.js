//Testando se a senha é forte
function checkSenha(){
    var senha =  document.getElementById('senhaTeste').value

    if(senha.length < 8){
         document.getElementById('aviso-senha-fraca').textContent = 'Senha muito fraca!'
         document.getElementById('aviso-senha-fraca').style.cssText = `color: red;`
         document.getElementById('btn-registrar').disabled = true
    }

    if(senha.length > 7){
         document.getElementById('btn-registrar').disabled = false
         document.getElementById('aviso-senha-fraca').textContent = 'Senha boa!'
         document.getElementById('aviso-senha-fraca').style.cssText = `color: green;`
    }
}



//TESTANDO SENHA FORTE NA RECUPERAÇÃO DE SENHA
function checkSenha2(){
     var senha =  document.getElementById('attSenha').value
 
     if(senha.length < 8){
          document.getElementById('aviso-senha-fraca2').textContent = 'Senha muito fraca!'
          document.getElementById('aviso-senha-fraca2').style.cssText = `color: red;`
          document.getElementById('btn-registrar2').disabled = true
     }
 
     if(senha.length > 7){
          document.getElementById('btn-registrar2').disabled = false
          document.getElementById('aviso-senha-fraca2').textContent = 'Senha boa!'
          document.getElementById('aviso-senha-fraca2').style.cssText = `color: green;`
     }
 }




//QUANDO ADD A FOTO O BTN VOLTA A FICAR ATIVO
function fotoAdd(){
      document.getElementById('btn-salvar-img').disabled = false
}
//QUANDO ADD A FOTO O BTN VOLTA A FICAR ATIVO
