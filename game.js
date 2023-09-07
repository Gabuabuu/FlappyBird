const sprites = new Image();
sprites.src = './src/images/sprites.png';

let frames = 0;
const canvas = document.querySelector('canvas');
const contexto = canvas.getContext('2d');

//[Background]
const planoDeFundo = {
    spriteX: 390,
    spriteY: 0,
    largura: 275,
    altura: 204,
    x: 0,
    y: canvas.height - 204,
    desenha() {
        contexto.fillStyle = '#70c5ce'
        contexto.fillRect(0, 0, canvas.width, canvas.height)
        contexto.drawImage(
            sprites,
            planoDeFundo.spriteX, planoDeFundo.spriteY,
            planoDeFundo.largura, planoDeFundo.altura,
            planoDeFundo.x, planoDeFundo.y,
            planoDeFundo.largura, planoDeFundo.altura
        )

        contexto.drawImage(
            sprites,
            planoDeFundo.spriteX, planoDeFundo.spriteY,
            planoDeFundo.largura, planoDeFundo.altura,
            (planoDeFundo.x + planoDeFundo.largura), planoDeFundo.y,
            planoDeFundo.largura, planoDeFundo.altura
        )
    }
}

// [Chao]
function criaChao() {
    const chao = {
        spriteX: 0,
        spriteY: 610,
        largura: 224,
        altura: 112,
        x: 0,
        y: canvas.height - 112, //Altura total da tela menos altura(posicao) da sprite
        atualiza() {
            const movimentoChao = 1;

            chao.x = chao.x - movimentoChao
            const repeteChao = chao.largura / 2
            const movimentacao = chao.x - movimentoChao;

            chao.x = movimentacao % repeteChao
        },
        desenha() {
            contexto.drawImage(
                sprites,
                chao.spriteX, chao.spriteY,
                chao.largura, chao.altura,
                chao.x, chao.y,
                chao.largura, chao.altura
            )

            contexto.drawImage(
                sprites,
                chao.spriteX, chao.spriteY,
                chao.largura, chao.altura,
                (chao.x + chao.largura), chao.y,
                chao.largura, chao.altura
            )
        }
    }
    return chao

}


function fazColisao(flappyBird, chao) {
    const flappyBirdY = flappyBird.y + flappyBird.altura;
    const chaoY = chao.y;

    if (flappyBirdY >= chaoY) {
        return true
    }
    return false
}

function criaFlappyBird() {
    const flappyBird = {
        spriteX: 0,
        spriteY: 0,
        largura: 33,
        altura: 24,
        x: 10, //Posição horizontal
        y: 50, //Posição vertical
        pulo: 4.6,
        pula() {
            flappyBird.velocidade = - flappyBird.pulo
        },
        gravidade: 0.25,
        velocidade: 0,
        atualiza() {
            if (fazColisao(flappyBird, globais.chao)) {
                console.log('fez Colisao')


                mudaTela(Telas.INICIO);
                return;
            }

            flappyBird.velocidade = flappyBird.velocidade + flappyBird.gravidade;
            flappyBird.y = flappyBird.y + flappyBird.velocidade;
        },
        movimentos: [
            { spriteX: 0, spriteY: 0, }, // asa para cima
            { spriteX: 0, spriteY: 26, }, // asa no meio
            { spriteX: 0, spriteY: 52, }, // asa para baixo
            { spriteX: 0, spriteY: 26, }, // asa no meio

        ],
        frameAtual: 0,
        atualizaFrameAtual() {
            const intervaloFrames = 10;
            const passouIntervalo = frames % intervaloFrames === 0

            console.log('passou')
            if(passouIntervalo) {
                const baseDoIncremento = 1;
                const incremento = baseDoIncremento + flappyBird.frameAtual;
                const baseRepeticao = flappyBird.movimentos.length;
                flappyBird.frameAtual = incremento % baseRepeticao
            }

        },
        desenha() {
            flappyBird.atualizaFrameAtual()
            const {spriteX, spriteY} = flappyBird.movimentos[flappyBird.frameAtual]
            contexto.drawImage(
                sprites,
                spriteX, spriteY, //Sprite x, y
                flappyBird.largura, flappyBird.altura, //Tamanho recorte na sprite
                flappyBird.x, flappyBird.y,
                flappyBird.largura, flappyBird.altura
            );
        }
    }
    return flappyBird
}



//[MemsagemGetReady]
const mensagemGetReady = {
    sX: 134,
    sY: 0,
    w: 174,
    h: 152,
    x: (canvas.width / 2) - 174 / 2,
    y: 50,
    desenha() {
        contexto.drawImage(
            sprites,
            mensagemGetReady.sX, mensagemGetReady.sY,
            mensagemGetReady.w, mensagemGetReady.h,
            mensagemGetReady.x, mensagemGetReady.y,
            mensagemGetReady.w, mensagemGetReady.h
        )
    }
}

//[Telas]

const globais = {};
let telaAtiva = {};
function mudaTela(novaTela) {
    telaAtiva = novaTela;

    if (telaAtiva.inicializa) {
        telaAtiva.inicializa()
    }

}
const Telas = {
    INICIO: {
        inicializa() {
            globais.flappyBird = criaFlappyBird()
            globais.chao = criaChao()
        },
        desenha() {
            planoDeFundo.desenha() //3
            globais.chao.desenha() //2
            globais.flappyBird.desenha() //1
            mensagemGetReady.desenha()
        },
        click() {
            mudaTela(Telas.JOGO)
        },
        atualiza() {
            globais.chao.atualiza()
        }
    }
}

Telas.JOGO = {
    desenha() {
        planoDeFundo.desenha() //3
        globais.chao.desenha() //2
        globais.flappyBird.desenha() //1
    },
    click() {
        globais.flappyBird.pula()
        console.log('CLICANDO NA TELA')

    },
    atualiza() {
        globais.flappyBird.atualiza()
    }
}


function loop() {
    telaAtiva.desenha()
    telaAtiva.atualiza()

    frames = frames + 1
    requestAnimationFrame(loop)
};

window.addEventListener('click', function () {
    if (telaAtiva.click) {
        telaAtiva.click()

    };
})

mudaTela(Telas.INICIO)
loop()

