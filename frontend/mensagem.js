async function consultaMensagens(){
   const mensagens = await fetch('http://localhost:3333/mensagens') 
    .then(resposta =>{ 
        return resposta.json() 
    })
    .catch(error => {  
        alert ('Erro ao consultar')
    })
   let linhasTabela ='' 
   mensagens.forEach(mensagem => { 
    linhasTabela += `<tr> <td> ${mensagem.titulo} </td> <td> ${mensagem.conteudo} </td> <td> ${mensagem.publicado} </td> <td> ${mensagem.qtdeLikes} </td> <td> <div onclick="remover('${mensagem.id}')"> <i class="bi bi-trash"></i> </div> </td> <td> <div onclick="editar('${mensagem.id}','${mensagem.titulo}','${mensagem.conteudo}','${mensagem.publicado}','${mensagem.qtdeLikes}')" <i class="bi bi-pencil"></i> </div> </td> </tr>` //tr = linha  td= célula //produto é cada PRODUTO
   })   
   document.getElementById("linhasTabela").innerHTML = linhasTabela
}
function editar(id, titulo, conteudo, publicado, qtdeLikes){
    document.getElementById("titulo").value = titulo
    document.getElementById("conteudo").value = conteudo
    document.getElementById("publicado").checked = publicado
    document.getElementById("qtdeLikes").value = qtdeLikes
    document.getElementById("id").value = id
}

async function remover(id){
    const confirma = confirm ('Deseja realmente remover o produto')
    if (!confirma){
        return 
    }
    
    await fetch (`http://localhost:3333/mensagem/id/${id}`, {
        method: 'DELETE'
    })
    .then(resposta => {
        alert ('Remoção com sucesso')
    })
    .catch(erro => {
        alert('Problema na remoção')
    })
    consultaMensagens()
}

async function cadastrarMensagem(){
    const titulo = document.getElementById("titulo").value
    const conteudo = document.getElementById("conteudo").value
    const publicado = Boolean (document.getElementById("publicado").checked)
    const qtdeLikes = Number (document.getElementById("qtdeLikes").value)
    const id = document.getElementById("id").value
    console.log (publicado)
    let metodo
    let url
    if (id){ 
        metodo = 'PUT'
        url = `http://localhost:3333/mensagem/id/${id}`
        document.getElementById("id").value = '' 
    }
    else{
        metodo = 'POST'
        url = `http://localhost:3333/mensagem`
    }
    const mensagem = {titulo, conteudo, publicado, qtdeLikes}
        const novoMensagem = await fetch(url, {
        method: metodo,
        body: JSON.stringify(mensagem),
        headers: {
            'Content-Type': 'application/json;charset="UTF-8"'
        }
    })
    .then(resposta =>{
        alert ('Operação foi realizada com sucesso')
    })
    .catch(error => {
        alert ("Erro durante a tentativa")
    })    
    consultaMensagens()
}