function novoElemento(tagName, className){
    this.elem = document.createElement(tagName)
    elem.className = className
    return elem
}

function barreira(reversa = false){
    this.elemento = novoElemento('div', 'barreira')
    const corpo = novoElemento('div', 'corpo')
    const borda = novoElemento('div', 'borda')
    this.elemento.appendChild(reversa ? corpo : borda)
    this.elemento.appendChild(reversa ? borda : corpo)

    this.setAltura = (altura) => corpo.style.height = `${altura}px`
}

function ParDeBarreiras(altura, abertura, x){
   this.elemento = novoElemento('div','par-de-barreiras')
   this.superior = new barreira(true)
   this.inferior = new barreira(false)

   this.elemento.appendChild(this.superior.elemento)
   this.elemento.appendChild(this.inferior.elemento)

   this.sortearAbertura = () => {
    const alturaSuperior = Math.random() * (altura - abertura)
    const alturaInferior = altura - abertura - alturaSuperior

    this.superior.setAltura(alturaSuperior)
    this.inferior.setAltura(alturaInferior)
   } 
   this.setX = x => this.elemento.style.left = `${x}px`
   this.getX = () => parseInt(this.elemento.style.left.split('px')[0])
   this.getLargura = () => this.elemento.clientWidth

   this.sortearAbertura()
   this.setX(x)
}

function Barreiras(altura, largura, abertura, espaço, notificarPonto){
    this.pares = [
        new ParDeBarreiras(altura, abertura, largura),
        new ParDeBarreiras(altura, abertura, largura + espaço),
        new ParDeBarreiras(altura, abertura, largura + espaço*2),
        new ParDeBarreiras(altura, abertura, largura + espaço*3)
    ]
    const deslocamento = 3
    this.animar = () => {
        this.pares.forEach(par =>{
            par.setX(par.getX() - deslocamento)

            if(par.getX()< -par.getLargura()){
                par.setX(par.getX()+ espaço*this.pares.length)
                par.sortearAbertura()
            }
            const meio = largura/2
            const cruzouMeio = par.getX() + deslocamento >= meio 
            && par.getX() < meio
            if(cruzouMeio) notificarPonto()
        })
    }
}
function Passaro(alturaJogo){
    let voando = false
    this.elemento = novoElemento('img','passaro')
    this.elemento.src = '/dom/imgs/passaro.png/'

    this.getY = () => parseInt(this.elemento.style.bottom.split('px')[0])
    this.setY = y => this.elemento.style.bottom = y + 'px'

    window.onkeydown = e => voando = true
    window.onkeyup = e => voando = false

    this.animar= () => {
        const novoY = this.getY() + (voando ? 8 : -5)
        const alturaMaxima = alturaJogo - this.elemento.clientHeight

        if(novoY<=0){
            this.setY(0)
        } else if(novoY >= alturaMaxima){
            this.setY(alturaMaxima)
        } else {
            this.setY(novoY)
        }
    }
    this.setY(alturaJogo/2)
}
function Progresso (){
    this.elemento = novoElemento('span','progresso')
    this.atualizarPontos = pontos =>{
        this.elemento.innerHTML = pontos
    }
    this.atualizarPontos(0) 
}
function EstaoSobrePostos(elementoA, elementoB){
    const a = elementoA.getBoundingClientRect()
    const b = elementoB.getBoundingClientRect()
    const horizontal = a.left + a.width >= b.left 
    && b.left + b.width >= a.left
    const vertical = a.top + a.height >= b.top 
    && b.top + b.height >= a.top
    return horizontal && vertical
}

function colidiu(passaro, barreiras){
    let colidiu = false
    barreiras.pares.forEach(parDeBarreiras => {
        if (!colidiu){
            const superior = parDeBarreiras.superior.elemento
            const inferior = parDeBarreiras.inferior.elemento
            colidiu = EstaoSobrePostos(passaro.elemento, superior)
            || EstaoSobrePostos(passaro.elemento, inferior)
        }
    })
    return colidiu
}


function Flappybird(){
    let pontos = 0 
    const tela = document.querySelector('.tela')
    const altura = tela.clientHeight
    const largura = tela.clientWidth
    const progresso = new Progresso()
    const barreiras = new Barreiras(altura, largura , 220, 400 ,()=>{
        progresso.atualizarPontos(++pontos)
    })
    const passaro = new Passaro(altura)
    tela.appendChild(passaro.elemento)
    tela.appendChild(progresso.elemento)
    barreiras.pares.forEach(par => 
        tela.appendChild(par.elemento))
        
    this.start = () => {
        const temporizador = setInterval(()=> {
            barreiras.animar()
            passaro.animar()

            if(colidiu(passaro,barreiras)){
                clearInterval(temporizador)
            }
        }, 20)
    }
}
new Flappybird().start()




