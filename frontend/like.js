async function consultaMensagens(){
    let mensagens = await fetch('http://localhost:3333/mensagens')
        .then(resp => {
            return resp.json()
        })
        .catch( error => {
            alert('Erro ao buscar mensagens')
        })
    let saida = '' 
    mensagens.forEach(mensagem => {
        saida += `<option value="${mensagem.id}"> ${mensagem.titulo} </option>`
    })
    document.getElementById("idSelecionado").innerHTML = saida
}

async function like(){
    
    const id = document.getElementById("idSelecionado").value
    const qtdeLikes = Number (document.getElementById("qtdeLikes").value)
    const corpo = {id, qtdeLikes}
    const mensagemUp = await fetch('http://localhost:3333/mensagem/like', {
            method: 'PATCH',
            body: JSON.stringify(corpo), 
            headers: {
                "Content-Type": "application/json;charset=UTF-8"
            }
        })
        .then (resp => {
            return resp.json()
        })
    alert(`Like realizada com sucesso. A nova quantidade é ${mensagemUp.qtdeLikes}`)
}