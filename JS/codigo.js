const sectionAtaque = document.getElementById("selecciona-ataque")
const sectionReiniciar = document.getElementById("reiniciar")
const botonMascotaJugador=document.getElementById("boton-seleccion")

const botonReiniciar=document.getElementById("boton-reiniciar")

const spanVidasJugador=document.getElementById("vidas-jugador")
const spanVidasEnemigo=document.getElementById("vidas-enemigo")

const posicionMensaje = document.getElementById("resultado-combate")

const posicionAtaqueJugador = document.getElementById("ataque-jugador")
const posicionAtaqueEnemigo = document.getElementById("ataque-enemigo")

const mascotaJugador=document.getElementById("mascota-jugador")
const sectionMascota = document.getElementById("selecciona-mascota")

const mascotaEnemigo=document.getElementById("mascota-enemigo")

const contenedorTarjetas=document.getElementById("contenedor-tarjetas")
const seccionBotones=document.getElementById("seccion-botones")

const sectionVerMapa=document.getElementById("ver-mapa")
const Mapa=document.getElementById("mapa")

let jugadorId=null
let enemigoId=null

let lienzo=Mapa.getContext("2d")

let mokepones=[]
let mokeponesEnemigos=[]
let ataqueJugador=[]
let ataqueEnemigo=[]
let opcionDeMokepones
let nombreMascotaJugador
let nombreMascotaEnemigo
let mensajeGanador
let ataqueMokepon
let ataqueMokeponEnemigo

let botones=[]
let inputHipodoge
let inputCapipepo
let inputRatigueya

let indexAtaqueJugador
let indexAtaqueEnemigo

let ataqueFuego
let ataqueTierra
let ataqueAgua

let victoriasJugador=0
let victoriasEnemigo=0

let intervalo

let mascotaJugadorObjeto
let mapaJuego=new Image()
mapaJuego.src="../Mokepones/mokemap.png"

let alturaABuscar
let anchoDelMapa = window.innerWidth-20
const anchoMaximoDelMapa=600

if (anchoDelMapa>anchoMaximoDelMapa)
{
    anchoDelMapa=anchoMaximoDelMapa-30
}

alturaABuscar= anchoDelMapa*600/800

Mapa.width=anchoDelMapa
Mapa.height=alturaABuscar

class Mokepon
{
    constructor(nombre,imagen,vida,fotoMapa,id=null)
    {
        this.id=id
        this.nombre=nombre
        this.imagen=imagen
        this.vida=vida
        this.ataques=[]
        this.ancho=40
        this.alto=40
        this.x=aleatorio(0,Mapa.width-this.ancho)
        this.y=aleatorio(0,Mapa.height-this.alto)
        this.mapaFoto=new Image()
        this.mapaFoto.src=fotoMapa
        this.velocidadX=0
        this.velocidadY=0
    }

    pintarMokepon()
    {
        lienzo.drawImage(
            this.mapaFoto,
            this.x,
            this.y,
            this.ancho,
            this.alto
            ) 
    }
}

let hipodoge = new Mokepon('Hipodoge','../Mokepones/hipodoge.png',5,'../Mokepones/hipodoge-cabeza.png')
let capipepo = new Mokepon('Capipepo','../Mokepones/capipepo.png',5,'../Mokepones/capipepo-cabeza.png')
let ratigueya = new Mokepon('Ratigueya','../Mokepones/ratigueya.png',5,'../Mokepones/ratigueya-cabeza.png')

const HIPODOGE_ATAQUES=[
    {nombre:'💧',id:'boton-agua'},
    {nombre:'💧',id:'boton-agua'},
    {nombre:'💧',id:'boton-agua'},
    {nombre:'🔥',id:'boton-fuego'},
    {nombre:'🌱',id:'boton-tierra'}
]
hipodoge.ataques.push(...HIPODOGE_ATAQUES)

const CAPIPEPO_ATAQUES=[
    {nombre:'🌱',id:'boton-tierra'},
    {nombre:'🌱',id:'boton-tierra'},
    {nombre:'🌱',id:'boton-tierra'},
    {nombre:'💧',id:'boton-agua'},
    {nombre:'🔥',id:'boton-fuego'}
]
capipepo.ataques.push(...CAPIPEPO_ATAQUES)

const RATIGUEYA_ATAQUES=[
    {nombre:'🔥',id:'boton-fuego'},
    {nombre:'🔥',id:'boton-fuego'},
   {nombre:'🔥',id:'boton-fuego'},
   {nombre:'💧',id:'boton-agua'},
   {nombre:'🌱',id:'boton-tierra'}
]

ratigueya.ataques.push(...RATIGUEYA_ATAQUES)

mokepones.push(hipodoge,capipepo,ratigueya)

function IniciarJuego()
{
    sectionAtaque.style.display="none"
    sectionReiniciar.style.display="none"
    sectionVerMapa.style.display="none"

    mokepones.forEach((mokepon)=>{
        opcionDeMokepones=`<input type="radio" name="mascotas" id=${mokepon.nombre}>
        <label class="tarjeta-mascota" for=${mokepon.nombre}>
            <p>${mokepon.nombre}</p>
            <img src="${mokepon.imagen}" alt=${mokepon.nombre}>
        </label>`
        contenedorTarjetas.innerHTML+=opcionDeMokepones

        inputHipodoge=document.getElementById("Hipodoge")
        inputCapipepo=document.getElementById("Capipepo")
        inputRatigueya=document.getElementById("Ratigueya")
    })
    botonMascotaJugador.addEventListener("click",SeleccionarMascota)
  
    botonReiniciar.addEventListener("click",ReiniciarJuego)

    UnirseAlJuego()
}

function UnirseAlJuego()
{
    fetch("http://localhost:8080/unirse")
        .then(function(res){
            if (res.ok) {
                res.text()
                    .then(function(respuesta)
                    {
                        console.log(respuesta)
                        jugadorId=respuesta
                    })      
            }
        })
}

function AtaqueDeEnemigo()
{
    let numeroAtaque=aleatorio(0,ataqueMokeponEnemigo.length-1)
    if(numeroAtaque==0||numeroAtaque==1)
    {
        ataqueEnemigo.push("FUEGO")
    }else if(numeroAtaque==2||numeroAtaque==3)
    {
        ataqueEnemigo.push("AGUA")
    }else
    {
        ataqueEnemigo.push("TIERRA")
    }
    console.log(ataqueEnemigo)
    IniciaCombate()
   
}
function IniciaCombate()
{
    if(ataqueJugador.length>=5)
    {
        Combate()
    }
}
function UltimoIndex(index)
{
    indexAtaqueEnemigo=ataqueJugador[index]
    indexAtaqueJugador=ataqueEnemigo[index]
}
function Combate()
{
    clearInterval(intervalo)

    for (let i = 0; i < ataqueJugador.length; i++) {
        if(ataqueJugador[i]==ataqueEnemigo[i])
        {
            
            mensajeGanador="EMPATE"
        } else if((ataqueJugador[i]=="AGUA" && ataqueEnemigo[i]=="FUEGO")||
                (ataqueJugador[i]=="FUEGO" && ataqueEnemigo[i]=="TIERRA")||
                (ataqueJugador[i]=="TIERRA" && ataqueEnemigo[i]=="AGUA"))
        {
            mensajeGanador="GANASTE"
            victoriasJugador++
        }else
        {
            mensajeGanador="PERDISTE"
            victoriasEnemigo++
        }
        UltimoIndex(i)
    }
   
    CrearMensaje()
    revisionVidas()
    spanVidasJugador.innerHTML=victoriasJugador
    spanVidasEnemigo.innerHTML=victoriasEnemigo
}
function revisionVidas()
{
    if(victoriasEnemigo==victoriasJugador)
    {
        CrearMensajeFinal("Es un empate")
    }else if(victoriasJugador<victoriasEnemigo)
    {
        CrearMensajeFinal("PERDISTE 😎, POR NUB!!")
    }else {
        CrearMensajeFinal("Ganaste 😎, que pro!!")
    }
}
function CrearMensajeFinal(mensaje)
{    
    sectionReiniciar.style.display="flex"
    posicionMensaje.innerHTML=mensaje

}
function CrearMensaje()
{
    posicionMensaje.innerHTML=mensajeGanador
    posicionAtaqueJugador.innerHTML=indexAtaqueJugador
    posicionAtaqueEnemigo.innerHTML=indexAtaqueEnemigo   
}
function SeleccionarMascota(){  
   
    sectionMascota.style.display="none"
    sectionVerMapa.style.display="flex"
    intervalo=setInterval(PintarCanvas,50)
    window.addEventListener("keydown",PresionoTecla)
    window.addEventListener("keyup",detenerMovimiento)
    if(inputHipodoge.checked)
    {
        mascotaJugador.innerHTML=inputHipodoge.id
        nombreMascotaJugador=inputHipodoge.id
        mascotaJugadorObjeto=obtenerMascota(nombreMascotaJugador)
    }else  if(inputCapipepo.checked)
    {
        mascotaJugador.innerHTML=inputCapipepo.id
        nombreMascotaJugador=inputCapipepo.id
        mascotaJugadorObjeto=obtenerMascota(nombreMascotaJugador)
    }else  if(inputRatigueya.checked)
    {
        mascotaJugador.innerHTML=inputRatigueya.id
        nombreMascotaJugador=inputRatigueya.id
        mascotaJugadorObjeto=obtenerMascota(nombreMascotaJugador)
    }else
    {
        alert("Elige una mascota")
    }

    seleccionarMokepon(nombreMascotaJugador)
    extraerAtaques(nombreMascotaJugador)
    secuenciaAtaque()
}

function seleccionarMokepon(nombreMascotaJugador)
{
    fetch(`http://localhost:8080/mokepon/${jugadorId}`, {
        method: "post",
        headers:{
            "Content-Type":"application/json"
        },
        body: JSON.stringify({
            mokepon: nombreMascotaJugador
        })
    })
}

function extraerAtaques(nombreMascota)
{
    let ataques
    mokepones.forEach((mokepon)=>{
        if(nombreMascota==mokepon.nombre)
        {
            ataques=mokepon.ataques
        }
    })
    mostrarAtaques(ataques)
}

function mostrarAtaques(ataquesMokepon)
{
    ataquesMokepon.forEach((ataque)=>{
        ataqueMokepon=`<button id=${ataque.id} class="boton-ataque BAtaque">${ataque.nombre}</button>`
        seccionBotones.innerHTML+=ataqueMokepon     
    })
    ataqueFuego=document.getElementById("boton-fuego")
    ataqueTierra=document.getElementById("boton-tierra")
    ataqueAgua=document.getElementById("boton-agua")
    botones = document.querySelectorAll('.BAtaque')
}
function secuenciaAtaque()
{
    botones.forEach((boton)=>{
        boton.addEventListener("click",(e) => {
           
        if(e.target.textContent==='🔥')
        {
            ataqueJugador.push('FUEGO')
            console.log(ataqueJugador)
            boton.style.background='#112f58'
            boton.disabled=true
        }else if(e.target.textContent==='💧')
        {
            ataqueJugador.push('AGUA')
            console.log(ataqueJugador)
            boton.style.background='#112f58'
            boton.disabled=true
        }else if(e.target.textContent==='🌱')
        {
            ataqueJugador.push('TIERRA')
            console.log(ataqueJugador)
            boton.style.background='#112f58'
            boton.disabled=true
        }
        if(ataqueJugador.length == 5)
        {
            enviarAtaques()
        }
        })
    })
}

function enviarAtaques(){
    fetch(`http://localhost:8080/mokepon/${jugadorId}/ataques`,{
        method: "post",
        headers:{
            "Content-Type":"application/json"
        },
        body: JSON.stringify({
            ataques: ataqueJugador
        })
    })

    intervalo = setInterval(obtenerAtaques,50)
}

function obtenerAtaques(){
    fetch(`http://localhost:8080/mokepon/${enemigoId}/ataques`)
    .then(function (res){
        if(res.ok){
            res.json()
            .then(function ({ataques}){
                if(ataques.length==5){
                    ataqueEnemigo=ataques
                    Combate()
                }
            })
        }
    })
    
}
function SeleccionarMascotaEnemigo(enemigo)
{
    mascotaEnemigo.innerHTML=enemigo.nombre
    ataqueMokeponEnemigo = enemigo.ataques
    console.log(nombreMascotaJugador,mascotaJugadorObjeto)
}

function ReiniciarJuego()
{
    location.reload()
}
function aleatorio(min,max)
{
    return Math.floor((Math.random()*(max-min+1))+min)
}
window.addEventListener("load",IniciarJuego)

function PintarCanvas()
{
    mascotaJugadorObjeto.y+=mascotaJugadorObjeto.velocidadY
    mascotaJugadorObjeto.x+=mascotaJugadorObjeto.velocidadX
    lienzo.clearRect(0,0,Mapa.width,Mapa.height)
    lienzo.drawImage(
        mapaJuego,
        0,
        0,
        Mapa.width,
        Mapa.height
    )
    mascotaJugadorObjeto.pintarMokepon()

    enviarPosicion(mascotaJugadorObjeto.x,mascotaJugadorObjeto.y)
        
    mokeponesEnemigos.forEach((mokepon)=>{
        mokepon.pintarMokepon()
        revisarColision(mokepon)
    })
}
function enviarPosicion(x,y)
{
    fetch(`http://localhost:8080/mokepon/${jugadorId}/posicion`,{
        method:"post",
        headers:{
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            x,
            y
        })
    })
    .then(function(res){
        if(res.ok){
            res.json()
            .then(function({enemigos}){
                console.log(enemigos)
                
                mokeponesEnemigos=enemigos.map((enemigo) =>{
                    let mokeponEnemigo=null
                    const mokeponNombre = enemigo.mokepon.nombre||""
                    if(mokeponNombre=='Hipodoge')
                    {
                        mokeponEnemigo = new Mokepon('Hipodoge','../Mokepones/hipodoge.png',5,"../Mokepones/hipodoge-cabeza.png",enemigo.id)
                    } else if(mokeponNombre=='Ratigueya')
                    {
                        mokeponEnemigo = new Mokepon('Ratigueya','../Mokepones/ratigueya.png',5,"../Mokepones/ratigueya-cabeza.png",enemigo.id)
                    } else if(mokeponNombre=='Capipepo')
                    {
                        mokeponEnemigo = new Mokepon('Capipepo','../Mokepones/capipepo.png',5,"../Mokepones/capipepo-cabeza.png",enemigo.id)
                    }
                    mokeponEnemigo.x = enemigo.x
                    mokeponEnemigo.y = enemigo.y  
                    
                    return mokeponEnemigo
                })
            })
        }
    })
}
function moverDerecha()
{
    mascotaJugadorObjeto.velocidadX=5
}
function moverIzquierda()
{
    mascotaJugadorObjeto.velocidadX=-5
}
function moverAbajo()
{
    mascotaJugadorObjeto.velocidadY=5
}
function moverArriba()
{
    mascotaJugadorObjeto.velocidadY=-5
}
function detenerMovimiento()
{
    mascotaJugadorObjeto.velocidadY=0
    mascotaJugadorObjeto.velocidadX=0
}
function PresionoTecla(event)
{
    switch(event.key)
    {
        case "ArrowUp":
            moverArriba() 
        break
        case "ArrowDown":moverAbajo()
         break
        case "ArrowLeft":moverIzquierda()
         break
        case "ArrowRight":moverDerecha()
        break
    }
}

function obtenerMascota(nombreMascotaJugador)
{
    let nombreMascotaarreglo=nombreMascotaJugador
    for( i=0 ; i<mokepones.length ; i++ )
    {
        if(mokepones[i].nombre == nombreMascotaarreglo)
        {
            return mokepones[i]
        }
    }
}

function revisarColision(enemigo)
{
    const arribaJugador = mascotaJugadorObjeto.y
    const abajoJugador = mascotaJugadorObjeto.y+mascotaJugadorObjeto.alto
    const izquierdaJugador = mascotaJugadorObjeto.x
    const derechaJugador = mascotaJugadorObjeto.x+ mascotaJugadorObjeto.ancho

    const arribaEnemigo = enemigo.y
    const abajoEnemigo = enemigo.y+enemigo.alto
    const izquierdaEnemigo = enemigo.x
    const derechaEnemigo = enemigo.x+ enemigo.ancho

    if(
        arribaJugador>abajoEnemigo ||
        abajoJugador<arribaEnemigo ||
        derechaJugador<izquierdaEnemigo ||
        izquierdaJugador>derechaEnemigo
    ) return
    sectionVerMapa.style.display="none"
    sectionAtaque.style.display="flex"
    enemigoId=enemigo.id
    detenerMovimiento()
    clearInterval(intervalo)
    SeleccionarMascotaEnemigo(enemigo)
}
