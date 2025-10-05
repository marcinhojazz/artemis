
# 🚀 Projeto Aurora

**Um simulador de habitat espacial 3D para o NASA International Space Apps Challenge 2025.**

O Projeto Aurora é um protótipo de jogo de gerenciamento e estratégia com visão isométrica. Inspirado em clássicos como "The Sims" e "FTL", o desafio do jogador é projetar e gerenciar um habitat espacial autossustentável, garantindo a sobrevivência de uma tripulação durante uma missão de longa duração. O projeto utiliza dados e desafios reais enfrentados pela NASA para criar uma experiência de jogabilidade envolvente e educativa.

[▶️ Link para o Vídeo de Apresentação (Pitch)](https://...)
[🌍 Link para o Deploy (Demo Online)](https://...)

---

## 🛠️ Stack de Tecnologias

Este protótipo foi construído com uma arquitetura de ilhas moderna e performática, combinando o melhor de cada tecnologia para uma finalidade específica:

* **Astro:** Meta-framework responsável por orquestrar a aplicação e renderizar as "ilhas" de UI.
* **React (com React Three Fiber & Drei):** Utilizado exclusivamente para a renderização da cena 3D, gerenciamento de assets e interações no ambiente da nave.
* **Svelte:** Responsável por toda a interface 2D (HUD), painéis de controle e elementos reativos, garantindo máxima performance na exibição de dados.
* **Nano Stores:** Biblioteca de estado agnóstica que atua como a "ponte" de comunicação, permitindo que as ilhas de React e Svelte compartilhem o estado do jogo em tempo real.
* **Three.js:** A biblioteca base para toda a renderização 3D, controlada de forma declarativa pelo React Three Fiber.
* **Tailwind CSS:** Framework de estilização para a criação rápida e responsiva da interface do usuário.

## 📁 Estrutura do Projeto

A organização dos arquivos reflete a separação de responsabilidades da nossa stack tecnológica:

```text
/
├── astro.config.mjs
├── package.json
├── README.md
├── tsconfig.json
├── public/
│   └── favicon.svg
└── src/
    ├── components/
    │   ├── react/
    │   │   └── GameCanvas.tsx      # A janela 3D da nave (renderização e interação)
    │   └── svelte/
    │       └── GameUI.svelte       # O painel de controle do jogador (HUD, menus)
    ├── layouts/
    │   └── MainLayout.astro        # Template base para as páginas
    ├── pages/
    │   └── index.astro             # Ponto de entrada que monta as ilhas de React e Svelte
    └── stores/
        └── store.ts                # O cérebro da simulação (estado global com Nano Stores)
````

## 🚀 Como Rodar o Projeto

Para executar o protótipo localmente, siga estes passos:

1.  **Clone o repositório:**

    ```sh
    git clone [URL_DO_SEU_REPOSITORIO]
    cd [NOME_DA_PASTA]
    ```

2.  **Instale as dependências:**

    ```sh
    npm install
    ```

3.  **Inicie o servidor de desenvolvimento:**

    ```sh
    npm run dev
    ```

    A aplicação estará disponível em `http://localhost:4321`.

## 🧞 Comandos Disponíveis

Todos os comandos devem ser executados a partir da raiz do projeto.

| Comando           | Ação                                               |
| :---------------- | :------------------------------------------------- |
| `npm install`     | Instala as dependências do projeto.                |
| `npm run dev`     | Inicia o servidor de desenvolvimento local.        |
| `npm run build`   | Compila o site para produção na pasta `./dist/`.    |
| `npm run preview` | Pré-visualiza a versão de produção localmente.     |
| `npm run astro ...` | Executa comandos da CLI do Astro.                  |

## 🎮 Como Jogar (Protótipo Atual)

O objetivo atual é construir um habitat funcional e iniciar a simulação de sobrevivência.

1.  **Modo de Planejamento:** O jogo começa pausado. Use o menu "Construir" na parte inferior da tela para selecionar um módulo (Painel Solar, Gerador O₂, Beliche).
2.  **Construção:** Mova o mouse sobre a grade 3D para ver uma pré-visualização. Clique para posicionar o módulo.
3.  **Monitoramento:** Observe como o HUD de Energia e Oxigênio no topo da tela se atualiza instantaneamente a cada módulo construído.
4.  **Iniciar a Missão:** Quando estiver satisfeito com seu layout inicial, clique no botão "▶ INICIAR".
5.  **Gerenciamento:** O tempo começará a passar. Monitore o sono da sua tripulação e o balanço dos recursos. Use o "Controle de Energia" para ligar ou desligar subsistemas e evitar uma crise energética.
