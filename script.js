
let main = document.querySelector("main");
console.log(main);

// Chama o servidor com as mensagens do chat UOL
const promessa = axios.get('https://mock-api.driven.com.br/api/v4/uol/messages');
promessa.then(processarResposta);

// Quando a promessa retorna, executa esta função
function processarResposta(resposta) {
	console.dir(resposta); // Esse console.log disparará depois
    const data = resposta.data;
    console.log(data[0].from);
    carregarMensagens(data);
}

function carregarMensagens(objeto){
    for (let i = 0; i < objeto.length; i++) {
        main.innerHTML = main.innerHTML +  `<div class="container ${objeto[i].type}">
                                            <div class="mensagem">
                                                <p>${objeto[i].time}  <strong>${objeto[i].from}</strong>  ${objeto[i].text} </p>
                                            </div>
                                        </div>`     
    }
}