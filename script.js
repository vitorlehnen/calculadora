(function(){const container = document.querySelector("#cont-botoes");
/* Inicio criaçao dos botoes */
const valores = ["\u2190", "CE", 'C', '/', '7', '8', '9', '*', '4', '5', '6', '-', '1', '2', '3', '+', '0', ',', '='];
for (let index = 0; index < valores.length; index++) {
    const botao = document.createElement("button");
    botao.innerHTML = valores[index];
    botao.classList.add("botoes");
    if(botao.innerHTML === ',') botao.setAttribute("class", "botao-virgula");
    if(botao.innerHTML === "\u2190") botao.setAttribute("id", "seta");
    if(/(?:CE|C|[^0-9\,])/.test(botao.innerHTML)) botao.classList.add("operadores");
    if(botao.innerHTML === '0') botao.setAttribute("id", "botao-zero");
    if(botao.innerHTML === "=") botao.setAttribute("class", "botao-igual");
    container.appendChild(botao);
}
/* fim criaçao dos botoes */
const expre1 = document.querySelector("#sup");
const expre2 = document.querySelector("#inf");                   
let controlador = false;
let valorInicial = true;
container.addEventListener("click", principal);
function mudaExpre2(val = 0){
    expre2.innerHTML = val;
}
function principal(event){
    let temp = event.target.innerHTML;
    if(valorInicial){
        expre1.innerHTML = '';
        mudaExpre2();
        valorInicial = false;
    }
    let exp1 = expre1.innerHTML;
    let exp2 = expre2.innerHTML;
    if(exp2.length === 16) mudaClasse();
    if(exp2.length === 18 && !["/", "*", "+", "-", "="].includes(temp)){
        expre2.innerHTML = exp2.slice(0, -1);
    }
    if(event.target.innerHTML.length <= 2){
        switch (temp) {
            case "\u2190":
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
                (/[0-9]/.test(temp)) ? adValor(exp2, temp) : adOperacao(exp2, temp);
                break;
        }
    }
}
function adValor(e2, t){
    if(controlador) mudaClasse();
    if(e2 === '0,'){
        expre2.innerHTML += t;
        controlador = false; 
    }else if(e2 === '0' || controlador){
        // expre2.innerHTML = t;
        mudaExpre2(t);
        controlador = false;
    }else{
        expre2.innerHTML += t;
    }
}
function adOperacao(e2, t){  
    if(/^[0-9]+,$/.test(e2)){ // <-- Substitui a virgula em caso de ausência de numero pós virgula
        e2 = e2.replace(/,/, '');
        // expre2.innerHTML = e2;
        mudaExpre2(e2);
    }
    if(!(/[a-z]/.test(e2))){
        controlador = true;
        expre1.innerHTML = `${e2} ${t}`;
    }
}
function resultado(e1, e2){ 
    if(!expre1.innerHTML) return    // <-- Calcula a operação
    let teste = `${e1}${e2}`;
    if(/\-\-/.test(teste)) teste = teste.replace(/(\-)()(\-[0-9]+)()/, "$1$2($3$4)");
    const divisaoPorZero = () => {
        expre1.innerHTML = '';
        controlador = true;
    }
    if(/0\s\/0,?/.test(teste)){
        // expre2.innerHTML = "<small>Resultado indefinido</small>";
        mudaExpre2("<small>Resultado indefinido</small>");
        divisaoPorZero(e1, e2);
    }else if(/^.+?\s\/0,?$/.test(teste)){
        // expre2.innerHTML = "<small>Impossivel dividir</small>";
        mudaExpre2("<small>Impossivel dividir</small>");
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
        // alert(temp);
        // expre2.innerHTML = temp;
        // mudaExpre2(temp);
        expre1.innerHTML = '';
    }
}
function trocaVirgulas(ex1, ex2){   // <-- Troca as virgulas por pontos para realizar as operações
    let temp = `${ex1}${ex2}`.replace(/,/g, '.');
    temp = String(eval(temp));
    temp = temp.replace(/\./g, ',');
    controlador = true;
    // expre2.innerHTML = temp;
    mudaExpre2(temp);
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
        // expre2.innerHTML = "0,";
        mudaExpre2("0,");
        controlador = false;
    }else if(verifRepetVirgulas(e2) < 1){
        expre2.innerHTML += ',';
    }else if(controlador){
        // expre2.innerHTML = "0,";
        mudaExpre2("0,");
    }
}
function botaoSeta(ex2){    // <-- Apaga 1 número por vez da expressão inferior da calculadora
    if(/[a-z]/i.test(ex2) && controlador){
        // expre2.innerHTML = 0;
        mudaExpre2();
        controlador = false;
        return;
    }
    if(ex2.length === 2){
        if(ex2.indexOf("-") !== -1){
            // expre2.innerHTML = 0;
            mudaExpre2();
            return;
        }
    }
    if(ex2.length > 1){
        if(controlador) controlador = false;
        ex2 = ex2.slice(0, ex2.length - 1);
        // expre2.innerHTML = ex2;
        mudaExpre2(ex2);
    }else{
        // expre2.innerHTML = 0;
        mudaExpre2();
    }
}
function botaoCe(){
    mudaClasse();
    // expre2.innerHTML = 0;
    mudaExpre2();
}
function botaoC(){
    mudaClasse();
    // expre2.innerHTML = 0;
    mudaExpre2();
    expre1.innerHTML = '';
}
function mudaClasse(){  // altera o font-size do visor da calculadora
    (mudaClasse.caller === principal || mudaClasse.caller === resultado) ? expre2.classList.add("font-size-small") : expre2.classList.remove("font-size-small");
}}());