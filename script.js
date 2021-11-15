

let nomeUsuario = "";
let to = 'Todos';    
let type = 'message';
let arrayParticipantesAntigos = [];
// console.log(main);

// let insideInput = document.querySelector(".container input");
// console.dir(insideInput);

// Pergunta pro servidor se o nome de usuário já existe
function verificarNome(nomeInserido){
    let divClass = nomeInserido.parentNode;
    let inputClass = divClass.querySelector("input");
    let inputClassValue = inputClass.value;
    nomeUsuario = {name:`${inputClassValue}`}
    const reqNome = axios.post('https://mock-api.driven.com.br/api/v4/uol/participants',nomeUsuario);
    // const reqParticipantes = axios.get('https://mock-api.driven.com.br/api/v4/uol/participants');
    reqNome.then(entrarNaSala);
    reqNome.catch(nomeIndisponivel);
}

function nomeIndisponivel(){
    document.querySelector(".nome-invalido").classList.remove("hidden");
}


function entrarNaSala(){
    let telaDeEntrada = document.querySelector(".tela-de-entrada");
    telaDeEntrada.classList.add('hidden');


    carregarServidor();
    atualizarStatus();
    atualizarServidor();
}

function atualizarStatus(){
    setInterval(verificarStatus,5000)
}

function atualizarServidor(){
    setInterval(carregarServidor,3000)
}

function verificarStatus(){
    const reqStatus = axios.post(`https://mock-api.driven.com.br/api/v4/uol/status`, nomeUsuario);
    reqStatus.then(processarStatus);
    reqStatus.catch(saiDaSala);
}

function processarStatus(respostaVerificarStatus){
    const data = respostaVerificarStatus.data;
    if(data === "OK"){
        return
    }
}

function saiDaSala(saida){
    console.log(nomeUsuario);
    console.dir(saida);
    window.location.reload();
}

function carregarServidor(){
    const promessa = axios.get('https://mock-api.driven.com.br/api/v4/uol/messages');
    const promessa2 = axios.get(`https://mock-api.driven.com.br/api/v4/uol/participants`);
    promessa.then(processarResposta);
    promessa2.then(atualizarParticipantes);
}


function atualizarParticipantes(resposta){

    let usuarios = document.querySelector(".usuarios");
    let usuariosQueEntraram = [];
    let usuariosQueSairam = [];
    let i,j = 0;
    // if(usuarios.innerHTML === ""){
    if (arrayParticipantesAntigos.length === 0){
        arrayParticipantesAntigos = resposta.data;
        for(i=0; i<arrayParticipantesAntigos.length;i++){
            if(arrayParticipantesAntigos[i].name.length < 16){
                
                usuarios.innerHTML = usuarios.innerHTML + `<div class="container" data-identifier="participant" >
                <ion-icon onclick = "iconeTo(this)" name="person-circle"></ion-icon>
                <p onclick = "iconeTo(this)">${arrayParticipantesAntigos[i].name}</p>
                <ion-icon class="check hidden" name="checkmark-outline"></ion-icon>
                </div>`
            }
            else{
                usuarios.innerHTML = usuarios.innerHTML + `<div class="container" data-identifier="participant" >
                <ion-icon onclick = "iconeTo(this)" name="person-circle"></ion-icon>
                <p class="grande" onclick = "iconeTo(this)">${arrayParticipantesAntigos[i].name}</p>
                <ion-icon class="check hidden" name="checkmark-outline"></ion-icon>
                </div>`
            }
        }
        
    }
    else{

        let arrayParticipantesNovos = resposta.data;

        for (i = 0; i < arrayParticipantesNovos.length; i++) {
            for (j = 0; j < arrayParticipantesAntigos.length; j++) {
                if(arrayParticipantesNovos[i].name === arrayParticipantesAntigos[j].name){
                    break
                }
                
            }
            if(j === arrayParticipantesAntigos.length){
                usuariosQueEntraram.push(arrayParticipantesNovos[i]);   
            }
        }

        for (i = 0; i < arrayParticipantesAntigos.length; i++) {
            for (j = 0; j < arrayParticipantesNovos.length; j++) {
                if(arrayParticipantesAntigos[i].name === arrayParticipantesNovos[j].name){
                    break
                }
                
            }
            if(j === arrayParticipantesNovos.length){
                usuariosQueSairam.push(arrayParticipantesAntigos[i]);     
            }
            
        }        

        if(usuariosQueSairam.length !== 0){
            let usuarioAntigo = usuarios.querySelectorAll(".container p");
            console.log(usuarioAntigo);
            for (i = 0; i < usuariosQueSairam.length; i++) {
                for(j = 0; j< usuarioAntigo.length; j++){
                    if(usuarioAntigo[j].innerHTML === usuariosQueSairam[i].name){
                        usuarioAntigo[j].parentNode.remove();
                    }
                }
                
            }
        }
        if(usuariosQueEntraram.length !== 0){
            for (i = 0; i < usuariosQueEntraram.length; i++){
                if(usuariosQueEntraram[i].name.length < 16){
                    
                    usuarios.innerHTML = usuarios.innerHTML + `<div class="container" data-identifier="participant">
                    <ion-icon onclick = "iconeTo(this)" name="person-circle"></ion-icon>
                    <p onclick = "iconeTo(this)">${usuariosQueEntraram[i].name}</p>
                    <ion-icon class="check hidden" name="checkmark-outline"></ion-icon>
                    </div>`
                }
                else{
                    usuarios.innerHTML = usuarios.innerHTML + `<div class="container" data-identifier="participant">
                    <ion-icon onclick = "iconeTo(this)" name="person-circle"></ion-icon>
                    <p class="grande" onclick = "iconeTo(this)">${usuariosQueEntraram[i].name}</p>
                    <ion-icon class="check hidden" name="checkmark-outline"></ion-icon>
                    </div>`
                }
            }
        }
        arrayParticipantesAntigos = "";
        arrayParticipantesAntigos = arrayParticipantesNovos;
    }
}



// Quando a promessa retorna, executa esta função
function processarResposta(respostaCarregarServidor) {

	// console.dir(resposta); 
    const data = respostaCarregarServidor.data;
    carregarMensagens(data);

    const elementoQueQueroQueApareca = document.querySelectorAll(".mensagem");
    elementoQueQueroQueApareca[elementoQueQueroQueApareca.length-1].scrollIntoView();

}



function carregarMensagens(objeto){
    let main = document.querySelector("main");
    let i = 0;

    if(main.innerHTML === ""){
        

        for (i = 0; i < objeto.length; i++) {
            if(objeto[i].type === "private_message" && (objeto[i].from !== nomeUsuario.name || objeto[i].to !== nomeUsuario.name)){
                continue
            }
            else{
                if(objeto[i].type === "message"){
                    main.innerHTML = main.innerHTML +   `<div class="container ${objeto[i].type}" data-identifier="message">
                                                            <div class="mensagem">
                                                                    <p><span>(${objeto[i].time})</span>  <strong>${objeto[i].from}</strong> para <strong>${objeto[i].to}</strong>: ${objeto[i].text}</p>
                                                            </div>
                                                        </div>`
                }
                else if(objeto[i].type === "private_message"){

                    main.innerHTML = main.innerHTML +   `<div class="container ${objeto[i].type}" data-identifier="message">
                                                            <div class="mensagem">
                                                                <p><span>(${objeto[i].time})</span>  <strong>${objeto[i].from}</strong> reservadamente para <strong>${objeto[i].to}</strong>: ${objeto[i].text} </p>
                                                            </div>
                                                        </div>
                                                        `   
                }
                else{
                    main.innerHTML = main.innerHTML +   `<div class="container ${objeto[i].type}" data-identifier="message">
                                                            <div class="mensagem">
                                                                <p><span>(${objeto[i].time})</span>  <strong>${objeto[i].from}</strong>  ${objeto[i].text} </p>
                                                            </div>
                                                        </div>
                                                        `   
                }
            }
        }
    }
    else if(main.innerHTML !== ""){

        main.innerHTML = "";

        for (i = 0; i < objeto.length; i++) {
            if(objeto[i].type === "private_message" && (objeto[i].from !== nomeUsuario.name || objeto[i].to !== nomeUsuario.name)){
                continue
            }
            else{
                if(objeto[i].type === "message"){
                    main.innerHTML = main.innerHTML +   `<div class="container ${objeto[i].type}" data-identifier="message">
                                                            <div class="mensagem">
                                                                <p><span>(${objeto[i].time})</span>  <strong>${objeto[i].from}</strong> para <strong>${objeto[i].to}</strong>: ${objeto[i].text}</p>
                                                            </div>
                                                        </div>`
                }
                else if(objeto[i].type === "private_message"){

                    main.innerHTML = main.innerHTML +   `<div class="container ${objeto[i].type}" data-identifier="message">
                                                            <div class="mensagem">
                                                                <p><span>(${objeto[i].time})</span>  <strong>${objeto[i].from}</strong> reservadamente para <strong>${objeto[i].to}</strong>: ${objeto[i].text} </p>
                                                            </div>
                                                        </div>
                                                        `   
                }
                else{
                    main.innerHTML = main.innerHTML +   `<div class="container ${objeto[i].type}" data-identifier="message">
                                                            <div class="mensagem">
                                                                <p><span>(${objeto[i].time})</span>  <strong>${objeto[i].from}</strong>  ${objeto[i].text} </p>
                                                            </div>
                                                        </div>
                                                        `   
                }
            }
        }   
    }
}

function requisitarMensagem(){
    
    
    const from = nomeUsuario.name;
    let text = document.querySelector("footer .container input").value;

    msg = {from, to, text, type};

    const reqMsg = axios.post(`https://mock-api.driven.com.br/api/v4/uol/messages`,msg);
    document.querySelector("footer .container input").value = "";

    reqMsg.then(carregarServidor);
    reqMsg.catch(reloadPagina);
   
}

function reloadPagina(){
    window.location.reload();
}

function opcoes(){
    let opcoes = document.querySelector(".opcoes");
    let sidebar = document.querySelector(".sidebar")
    opcoes.classList.toggle("hidden");
    sidebar.classList.toggle("hidden");
}

function iconeTo(click){
   let container = click.parentNode;
   check = container.querySelector("ion-icon.check")
   usuarios = document.querySelectorAll(".usuarios .container")
   checkTodos = document.querySelector(".container.todos ion-icon.check")
   checkEscondido = document.querySelectorAll(".usuarios .hidden");
   checkUsuarios = document.querySelectorAll(".usuarios .container ion-icon.check");
   checkTypePublico = document.querySelector(".container.type.public ion-icon.check")
   checkTypePrivado = document.querySelector(".container.type.private ion-icon.check")

   to = container.innerText;

    if(click.parentNode === checkTodos.parentNode && checkTypePrivado.classList.contains("hidden") === false){
        checkTypePublico.classList.remove("hidden");
        checkTypePrivado.classList.add("hidden");
        
    }

   if(checkTodos.classList.contains("hidden") === false){
       checkTodos.classList.add("hidden")
       check.classList.toggle("hidden")
       return
    }
    else{
        
    }

   for (let i = 0; i < checkUsuarios.length; i++) {
       if(checkUsuarios[i].classList.contains("hidden") === false){
           checkUsuarios[i].classList.add("hidden");
           check.classList.toggle("hidden");
           return
       }
       else{

       }
   }

   if(usuarios.length === checkEscondido.length){
       check.classList.remove("hidden")
   }


}

function iconeType(click){
    let container = click.parentNode;
    type  = container.innerText;
    check = container.querySelector("ion-icon.check")
    checkTodos = document.querySelector(".container.todos ion-icon.check");
    checkTypePublico = document.querySelector(".container.type.public ion-icon.check")
    checkTypePrivado = document.querySelector(".container.type.private ion-icon.check")

    if(type === "Reservadamente"){
        type = "private_message";
    }
    else{
        type = "message";
    }
    
    if (checkTypePublico.classList.contains("hidden") === false){
        checkTypePublico.classList.add("hidden");
        check.classList.toggle("hidden");
        return
    }
    else{
        checkTypePrivado.classList.add("hidden");
        check.classList.toggle("hidden");
        return
    }
}

const inputMensagem = document.querySelector("footer .container input");
inputMensagem.addEventListener("keyup", MandarMensagemComEnter);
const inputNome = document.querySelector(".tela-de-entrada .container input");
inputNome.addEventListener("keyup", MandarNomeComEnter);
botao = inputNome.parentNode.querySelector("button");

function MandarMensagemComEnter(event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        requisitarMensagem()
    }
}

function MandarNomeComEnter(event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        verificarNome(botao)
    }
}
// function mensagensAntigas(listaDeMensagens){
//     for(i = 0; i<listaDeMensagensAntigas.length; i++){
//         if(listaDeMensagens === listaDeMensagensAntigas[i]){
//             return true
//         }
//     }
// }
