const eventoDelegado = document.querySelector("#cont-botoes");
/* Inicio criaçao HTML */
const valores = ["\u2190", "CE", 'C', '/', '7', '8', '9', '*', '4', '5', '6', '-', '1', '2', '3', '+', '0', ',', '='];
for (let index = 0; index < 19; index++) {
    const botao = document.createElement("button");
    botao.innerHTML = valores[index];
    botao.classList.add("botoes");
    if(botao.innerHTML === ',') botao.setAttribute("class", "botao-virgula");
    if(botao.innerHTML === "\u2190") botao.setAttribute("id", "seta");
    if(/(?:CE|C|[^0-9\,])/.test(botao.innerHTML)) botao.classList.add("operadores");
    if(botao.innerHTML === '0') botao.setAttribute("id", "botao-zero");
    if(botao.innerHTML === "=") botao.setAttribute("class", "botao-igual");
    eventoDelegado.appendChild(botao);
}
/* fim criaçao HTML */
const expre1 = document.querySelector("#sup");
const expre2 = document.querySelector("#inf");                   
const seta = document.querySelector("#seta").innerHTML;                     
let controlador = false;
eventoDelegado.addEventListener("click", delegado);
function delegado(event){
    let temp;
    if(expre1.innerHTML.length == 38 || expre2.innerHTML.length === 39){
        expre1.innerHTML = '';
        expre2.innerHTML = 0;
    }
    let exp1 = expre1.innerHTML;
    let exp2 = expre2.innerHTML;
    if(exp2.length === 16) mudaClasse();
    if(event.target.innerHTML.length <= 2){
        temp = event.target.innerHTML;
        switch (temp) {
            case seta:
                botaoSeta(exp2);
                break;
            case "CE":
                botaoCe();
                break;
            case "C":
                botaoC();
                break;
            case ",":
                verifVirgulas(exp2, temp);
                break;
            case "=":
                resultado(exp1, exp2);
                break;
            default:
                if(/[0-9]/.test(temp)){
                    adValor(exp2, temp);
                }else{
                    adOperacao(exp2, temp);
                }
                break;
        }
    }
}
function adValor(e2, t){
    if(controlador) mudaClasse()
    if(e2 === '0,'){
        expre2.innerHTML += t;
        controlador = false; 
    }else if(e2 === '0' || controlador){
        expre2.innerHTML = t;
        controlador = false;
    }else{
        expre2.innerHTML += t;
    }
}
function adOperacao(e2, t){  
    if(/^[0-9]+,$/.test(e2)){ // <-- Substitui a virgula em caso de ausência de numero pós virgula
        e2 = e2.replace(/,/, '');
        expre2.innerHTML = e2;
    }
    if(!(/[a-z]/.test(e2))){
        controlador = true;
        expre1.innerHTML = `${e2} ${t}`;
    }
}
function resultado(e1, e2){     // <-- Calcula a operação
    let teste = `${e1}${e2}`;
    if(/\-\-/.test(teste)) teste = teste.replace(/(\-)()(\-[0-9]+)()/, "$1$2($3$4)");
    let divisaoPorZero = () => {
        expre1.innerHTML = '';
        controlador = true;
    }
    if(teste === "0 /0"){
        expre2.innerHTML = "<small>Resultado indefinido</small>";
        divisaoPorZero(e1, e2);
    }else if(/^.+?\s\/0$/.test(teste)){
        expre2.innerHTML = "<small>Impossivel dividir</small>";
        divisaoPorZero(e1, e2);
    }else if(teste.indexOf(',') != -1){
        trocaVirgulas(e1, e2);
    }else{
        controlador = true;
        let temp = String(eval(teste));
        if(temp.length >= 16) mudaClasse();
        if(temp.indexOf('.') != -1){
            temp = temp.replace('.', ',');
        }
        temp = temp.slice(0, 19);
        expre2.innerHTML = temp;
        expre1.innerHTML = '';
    }
}
function trocaVirgulas(ex1, ex2){   // <-- Troca as virgulas por pontos para realizar as operações
    let temp = `${ex1}${ex2}`.replace(/,/g, '.');
    temp = String(eval(temp));
    temp = temp.replace(/\./g, ',');
    controlador = true;
    expre2.innerHTML = temp;
    expre1.innerHTML = '';
}
function verifRepetVirgulas(ex2){ // <-- verifica se foi digitado apenas 1 virgula!
    let tot = 0;
    for(let cont = 0; cont < ex2.length; cont++){
        if(ex2.indexOf(',') !== -1) tot++;   
    }
    return tot;
}
function verifVirgulas(e2){
    if(controlador && verifRepetVirgulas(e2) <= 1){
        expre2.innerHTML = "0,";
        controlador = false;
    }else if(verifRepetVirgulas(e2) < 1){
        expre2.innerHTML += ',';
    }else if(controlador){
        expre2.innerHTML = "0,";
    }
}
function botaoSeta(ex2){    // <-- Apaga 1 número por vez da expressão inferior da calculadora
    if(/[a-z]/i.test(ex2) && controlador){
        expre2.innerHTML = 0;
        controlador = false;
        return;
    }
    if(ex2.length > 1){
        if(controlador) controlador = false;
        ex2 = ex2.slice(0, ex2.length - 1);
        expre2.innerHTML = ex2;
    }else{
        expre2.innerHTML = 0;
    }
}
function botaoCe(){
    mudaClasse();
    expre2.innerHTML = 0;
}
function botaoC(){
    mudaClasse();
    expre2.innerHTML = 0;
    expre1.innerHTML = '';
}
function mudaClasse(){  // Altera a font-size das expressões
    if(mudaClasse.caller === delegado || mudaClasse.caller === resultado){
        expre2.classList.add("font-size-small");
    }else{
        expre2.classList.remove("font-size-small");
    }
}