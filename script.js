
let main = document.querySelector("main");
let nomeUsuario = "";
// console.log(main);

// let insideInput = document.querySelector(".container input");
// console.dir(insideInput);

// Pergunta pro servidor se o nome de usuário já existe
function verificarNome(nomeInserido){
    let divClass = nomeInserido.parentNode;
    let inputClass = divClass.querySelector("input");
    let inputClassValue = inputClass.value;
    nomeUsuario = {name:`${inputClassValue}`}
    const reqNome = axios.post('https://mock-api.driven.com.br/api/v4/uol/participants',nomeUsuario)
    reqNome.then(entrarNaSala);
    reqNome.catch(nomeIndisponivel);
}



function entrarNaSala(){
    let telaDeEntrada = document.querySelector(".tela-de-entrada");
    telaDeEntrada.classList.add('hidden');
    setInterval(verificarStatus,5000);
    carregarServidor();
    setInterval(carregarServidor,3000);

}

function verificarStatus(){
    const reqStatus = axios.post(`https://mock-api.driven.com.br/api/v4/uol/status`, nomeUsuario);
    reqStatus.then(processarStatus)
}


function carregarServidor(){
    const promessa = axios.get('https://mock-api.driven.com.br/api/v4/uol/messages');
    promessa.then(processarResposta);
}


function nomeIndisponivel(){
    document.querySelector(".nome-invalido").classList.remove(hidden);
}


// Quando a promessa retorna, executa esta função
function processarResposta(resposta) {

	// console.dir(resposta); 
    const data = resposta.data;
    carregarMensagens(data);

    const elementoQueQueroQueApareca = document.querySelectorAll(".mensagem");
    elementoQueQueroQueApareca[elementoQueQueroQueApareca.length-1].scrollIntoView();

}

function processarStatus(resposta){
    console.dir(resposta);
}

function carregarMensagens(objeto){
    for (let i = 0; i < objeto.length; i++) {

        main.innerHTML = main.innerHTML +   `<div class="container ${objeto[i].type}">
                                                <div class="mensagem">
                                                    <p>${objeto[i].time}  <strong>${objeto[i].from}</strong>  ${objeto[i].text} </p>
                                                </div>
                                            </div>
        `   
    }  
}