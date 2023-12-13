
const zonaJuego = document.getElementById("zonaJuego");
const mensajeElement = document.getElementById("mensaje");
const instruccionesElement = document.getElementById("instrucciones");
let bola;
let estadoJuego = "PAUSA";

class Paleta {

    element;
    y = 0;
    velocidad = 10;
    movimiento;
    alto = 200;
    ancho = 20;

    constructor() {

        this.element = document.createElement("div");
        this.element.classList = "paleta";
        zonaJuego.appendChild(this.element);
        this.resetPosicion();
    }

    subir() {
        if (!this.movimiento) {
            this.movimiento = setInterval(() => {
                this.y -= this.velocidad;
                if (this.y < 0) {
                    this.y = 0;
                    this.stop()
                }
                this.element.style.top = this.y + "px";
            }, 20)
        }
    }

    bajar() {
        if (!this.movimiento) {
            this.movimiento = setInterval(() => {
                this.y += this.velocidad;
                const limite = document.body.clientHeight - this.alto;
                if (this.y > limite) {
                    this.y = limite;
                    this.stop()
                }
                this.element.style.top = this.y + "px";

            }, 20)
        }
    }

    stop() {
        clearInterval(this.movimiento);
        this.movimiento = undefined;
    }
    resetPosicion(){
        this.y = document.body.clientHeight / 2 - this.alto/2;
        this.element.style.top = this.y + "px";
    }

}

class Bola {

    x;
    y;
    ancho = 30; 
    dx = -20;
    dy = 0;
    movimiento;
    
    constructor() { // Aqui arranca el juego

        this.element = document.createElement("div");
        this.element.classList = "bola";
        zonaJuego.appendChild(this.element);
        this.resetPosicion();
        this.mover();
        mensajeElement.classList.toggle("escondido", true);
        instruccionesElement.classList.toggle("escondido", true);
    }

    resetPosicion() {
        this.x = document.body.clientWidth / 2 - this.ancho / 2;
        this.element.style.left = this.x + "px";

        this.y = document.body.clientHeight / 2 - this.ancho / 2;
        this.element.style.top = this.y + "px";
    }

    mover() {
        if (!this.movimiento) {
            this.movimiento = setInterval(() => {

                //movimiento horizontal
                this.x += this.dx;

                //choque con palas
                //pala J1
                if (this.x < 0 + j1.ancho &&
                    this.y + this.ancho / 2 > j1.y &&
                    this.y + this.ancho / 2 < j1.y + j1.alto) {
                        this.dy += this.obtenerVariacionY(j1);
                        this.dx = this.dx * -1;
                }

                //pala j2
                if (this.x + this.ancho> document.body.clientWidth - j2.ancho &&
                    this.y + this.ancho / 2 > j2.y &&
                    this.y + this.ancho / 2 < j2.y + j2.alto) {
                        this.dy += this.obtenerVariacionY(j2); 
                        this.dx = this.dx * -1;
                }


                //meter punto

                if (this.x < 0 || this.x > document.body.clientWidth - this.ancho) {
                    console.log("punto")
                    tablero.sumar(this.x < 100 ? 2 : 1); // condicion para comprobar en que lado de la pantalla mete punto

                }
                this.element.style.left = this.x + "px";

                //movimiento vertical
                this.y += this.dy;
                if (this.y < 0 || this.y > document.body.clientHeight - this.ancho) {
                    this.dy = this.dy * -1;
                }
                this.element.style.top = this.y + "px";
            }, 20)
        }

    }

    eliminar(){
        clearInterval(this.movimiento);
        zonaJuego.removeChild(this.element);
        bola = undefined;
    }

    obtenerVariacionY(j){ // añadir movimiento cuando choca arriba o abajo segun toque la paleta
        const diferencia = ((this.y + this.ancho/2) - (j.y + j.alto/2));
        return diferencia /30 ;
        //console.log(diferencia);

    }

}

class Tablero {

    j1Score = 0;
    j2Score = 0;
    puntuacionMaxima = 2;

    constructor(){
        this.element = document.createElement("p");
        this.element.id = "tablero";
        zonaJuego.appendChild(this.element);
        this.actualizarTexto();
        
    }

    actualizarTexto(){
        this.element.textContent = this.j1Score + " - " + this.j2Score;
    }
    sumar(p){
        if(p === 1) {
            this.j1Score++;
        }else{
            this.j2Score++;
        }
        this.actualizarTexto();
        bola.eliminar();
        j1.resetPosicion();
        j2.resetPosicion();
        mensajeElement.classList.toggle("escondido",false);
        mensajeElement.textContent = 'Presiona "Espacio" para continuar ';
        this.estadoJuego = "PAUSA";
        if(this.j1Score >= this.puntuacionMaxima){
            this.ganar(1);
        }else if(this.j2Score >= this.puntuacionMaxima){
            this.ganar(2);
        }
    }

    ganar(p){
        mensajeElement.textContent = 'Jugador ' + p + ' gana la partida';
        mensajeElement.classList.toggle("titilar", true);
        estadoJuego = "END";
    }

    reset(){
        this.j1Score = 0;
        this.j2Score = 0;
        this.actualizarTexto();
        mensajeElement.classList.toggle("titilar",false);
    }

}

document.addEventListener("keydown", (e) => {
    //console.log(e); // 
    switch (e.key) {
        case "w":
            j1.subir();
            break;
        case "s":
            j1.bajar();
            break;
        case "ArrowUp":
            j2.subir();
            break;
        case "ArrowDown":
            j2.bajar();
            break;
        case " ":
            if(estadoJuego === "END"){
                tablero.reset();
            }
            estadoJuego = "PLAY";
            if(!bola) bola= new Bola();
            break;
    }

});
document.addEventListener("keyup", (e) => {
    //console.log(e);
    switch (e.key) {
        case "w":
        case "s":
            j1.stop();
            break;
        case "ArrowUp":
        case "ArrowDown":
            j2.stop();
            break;
    }

});

const j1 = new Paleta();
const j2 = new Paleta();
const tablero = new Tablero();