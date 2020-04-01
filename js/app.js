class Movel {
    constructor(autor, categoria, tipo) {
        this.autor = autor
        this.categoria = categoria
        this.tipo = tipo
    }
    
    validarDados() {
        let contador = 0

        for (let i in this) {
            if (this[i] == undefined || this[i] == null || this[i] == '') {
                contador++
            }
        }

        if (contador === 0) {
            return true
        } else {
            return false
        }
    }
}

class BD {
    constructor() {
        let id = localStorage.getItem('id')

        if (id === null) {
            localStorage.setItem('id', 0)
        }
    }
    
    getProximoId() {
        let proximoId = localStorage.getItem('id')

        return parseInt(proximoId) + 1
    }

    gravar(movel) {
        let id = this.getProximoId()

        localStorage.setItem(id, JSON.stringify(movel))

        localStorage.setItem('id', id)
    }

    recuperarTodosRegistros() {
        let moveis = Array()

        let id = localStorage.getItem('id')

        for (let i = 1; i <= id; i++) {
            let movel = JSON.parse(localStorage.getItem(i))

            if (movel === null) {
                continue
            }

            movel.id = i
            moveis.push(movel)
        }

        return moveis
    }

    pesquisar(movel) {
        let moveisFiltrados = Array()

        moveisFiltrados = this.recuperarTodosRegistros()

        //autor
        if (movel.autor != '') {
            moveisFiltrados = moveisFiltrados.filter(m => m.autor == movel.autor)
        }

        //categoria
        if (movel.categoria != '') {
            moveisFiltrados = moveisFiltrados.filter(m => m.categoria == movel.categoria)
        }

        //tipo
        if (movel.tipo != '') {
            moveisFiltrados = moveisFiltrados.filter(m => m.tipo == movel.tipo)
        }

        return moveisFiltrados
    }

    remover(id) {
        localStorage.removeItem(id)
    }
}

let bd = new BD

function cadastrarMovel() {
    let autor = document.getElementById('autor')
    let categoria = document.getElementById('categoria')
    let tipo = document.getElementById('tipo')

    let movel = new Movel(autor.value, categoria.value, tipo.value)

    if (movel.validarDados()) {
        bd.gravar(movel)

        document.getElementById('modalTitulo').innerHTML = 'Móvel inserido com sucesso!'
        document.getElementById('modalTituloDiv').className = 'modal-header text-success'
        document.getElementById('modalConteudo').innerHTML = 'O móvel foi inserido com sucesso.'
        document.getElementById('modalBtn').innerHTML = 'Voltar'
        document.getElementById('modalBtn').className = 'btn btn-success'

        $('#modalCadastraMovel').modal('show')

        autor.value = ''
        categoria.value = ''
        tipo.value = ''
    } else {
        document.getElementById('modalTitulo').innerHTML = 'Erro ao inserir móvel!'
        document.getElementById('modalTituloDiv').className = 'modal-header text-danger'
        document.getElementById('modalConteudo').innerHTML = 'Houveram erros ao inserir o móvel, tente novamente.'
        document.getElementById('modalBtn').innerHTML = 'Voltar'
        document.getElementById('modalBtn').className = 'btn btn-danger'

        $('#modalCadastraMovel').modal('show')

        autor.value = ''
        categoria.value = ''
        tipo.value = ''
    }
}

function carregaListaMoveis(moveis = Array(), filtro = false) {
    if (moveis.length == 0 && filtro == false) {
        moveis = bd.recuperarTodosRegistros()
    }

    let listaMoveis = document.getElementById('listaMoveis')

    listaMoveis.innerHTML = ''

    moveis.forEach(function(m) {
        let linha = listaMoveis.insertRow(0)

        linha.insertCell(0).innerHTML = m.autor
        
        switch (m.categoria) {
            case '1': m.categoria = 'Sustentável'
                break
            case '2': m.categoria = 'Moderno'
                break
            case '3': m.categoria = 'Rústico'
                break
            case '4': m.categoria = 'Antigo'
                break
            case '5': m.categoria = 'Gótico'
                break
        }

        linha.insertCell(1).innerHTML = m.categoria

        switch (m.tipo) {
            case '1': m.tipo = 'Sofá'
                break
            case '2': m.tipo = 'Mesa'
                break
            case '3': m.tipo = 'Estante'
                break
            case '4': m.tipo = 'Luminária'
                break
            case '5': m.tipo = 'Cama'
                break
            case '6': m.tipo = 'Armário'
                break
        }

        linha.insertCell(2).innerHTML = m.tipo

        let btn = document.createElement('button')

        btn.className = 'btn btn-danger'
        btn.innerHTML = '<i class="fas fa-times"></i>'
        btn.id = `idMovel${m.id}`

        btn.onclick = function() {
            let id = this.id.replace('idMovel', '')

            bd.remover(id)

            window.location.reload()
        }

        linha.insertCell(3).append(btn)
    })
}

function pesquisarMovel() {
    let autor = document.getElementById('autor')
    let categoria = document.getElementById('categoria')
    let tipo = document.getElementById('tipo')

    let movel = new Movel(autor.value, categoria.value, tipo.value)

    let moveis = bd.pesquisar(movel)

    carregaListaMoveis(moveis, true)
}