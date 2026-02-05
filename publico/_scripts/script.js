const modalPoint = document.getElementById('modal-point');
const btnAdd = document.getElementById('point-add');
const btnCancel = document.getElementById('btn-cancel');
const btnCloseModal = document.getElementById('btn-close-modal');
const inputLat = document.getElementById('input-lat');
const inputLng = document.getElementById('input-lng');
const inputName = document.getElementById('input-name');


// URL do Backend
const API_URL = 'http://localhost:3000/api/pontos';

const blueIcon = L.icon({
    iconUrl: '_imagens/logo.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const greenIcon = L.icon({
    iconUrl: '_imagens/logo.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

// Variavel para saber se estam criando ou editando
let idPontoEdicao = null;

// Array para guardar os marcadores do mapa e poder limpar depois
let marcadoresMap = [];

// Array usado para o filtro de pesquisa
let todosPontos = [];

// Coordenadas Atuais (Caso a geolocalização falhe)
let lat = -6.8892;
let lng = -38.5594;

// Inicializa o mapa
const map = L.map('map').setView([lat, lng], 14);

// Tenta Obter a Geolocalização
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
        (pos) => {
            lat = pos.coords.latitude;
            lng = pos.coords.longitude;

            // Move o mapa para a Localização Real
            map.setView([lat, lng], 15);

            // Atualiza o Marcador inicial
            marker.setLatLng([lat, lng]);

            // Popup "Você Está Aqui"
            marker.bindPopup(`<b>Você está aqui!</b>`).openPopup();
        },
        (err) => {
            console.warn("Geolocalização negada ou com erro:", err);
            // mantém Cajazeiras
        }
    );
} else {
    console.warn("Geolocalização não suportada pelo navegador.");
}

// Adiciona a camada de mapa OpenStreetMap (Mano Gugu)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Ícone simples para parecer com o Gugu Maps (o pino coloquei sendo a nossa logo, claro)
const customIcon = L.icon({
    iconUrl: '_imagens/logo.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    // Uma sombrinha para ficar no estilo
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    shadowSize: [41, 41]
});

// Adiciona o pino nas coodernadas indicadas, podemos adicionar vários
let marker = L.marker([lat, lng], {icon: customIcon}).addTo(map);

// Cria o popup que você vê no ponto (aquele que aparece em cima do pino no mapa)
// Obviamente as informações vão variar comforme o local, mas aí já é backend

const btnOptions = document.getElementById('btn-options');
const optionsMenu = document.getElementById('options-menu');

// Evento de clique no botão de opções
btnOptions.addEventListener('click', (event) => {
    event.stopPropagation();
    
    optionsMenu.classList.toggle('show');
    
    if (optionsMenu.classList.contains('show')) {
        btnOptions.style.backgroundColor = '#e0e0e0';
    } else {
        btnOptions.style.backgroundColor = '#f3f3f3';
    }
});

// Evento para fechar o menu se clicar em qualquer outro lugar da tela
document.addEventListener('click', (event) => {
    if (!optionsMenu.contains(event.target) && !btnOptions.contains(event.target)) {
        optionsMenu.classList.remove('show');
        btnOptions.style.backgroundColor = '#f3f3f3'; // Volta a cor original
    }
});



// Variável para guardar um marcador temporário de seleção
let tempMarker = null;

// Função para abrir o modal
// Função auxiliar para quando clicar no botão de editar da lista
// Função chamada ao clicar em "Editar" no popup
function prepararEdicao(ponto) {
    console.log("Editando ponto:", ponto); // Debug para ver se o dado chegou

    // 1. Salva o ID na variável global para sabermos que é uma EDIÇÃO
    idPontoEdicao = ponto._id || ponto.id;

    // 2. Preenche os campos básicos (usando as variáveis globais ou getElementById)
    if (typeof inputName !== 'undefined') inputName.value = ponto.nome;
    if (typeof inputLat !== 'undefined') inputLat.value = ponto.latitude;
    if (typeof inputLng !== 'undefined') inputLng.value = ponto.longitude;

    // 3. Preenche a Descrição (Campo novo)
    const inputDesc = document.getElementById('input-desc');
    if (inputDesc) {
        inputDesc.value = ponto.descricao || ''; // Se não tiver descrição, deixa vazio
    }

    // 4. Muda o título do modal para saber que estamos editando
    const tituloModal = document.querySelector('#modal-point h2');
    if (tituloModal) tituloModal.textContent = "Editar Ponto";

    // 5. Abre o modal em modo de edição
    openModal(true);
}

// Atualiza sua função openModal existente
function openModal(editMode = false) {
    const modalPoint = document.getElementById('modal-point');
    const inputDesc = document.getElementById('input-desc');
    const tituloModal = document.querySelector('#modal-point h2');

    if (modalPoint) {
        modalPoint.classList.remove('hidden');
        
        // Se NÃO for modo de edição (ou seja, é um Novo Ponto), limpa tudo
        if (!editMode) {
            idPontoEdicao = null; // Reseta o ID global
            
            if (typeof inputName !== 'undefined') inputName.value = '';
            if (typeof inputLat !== 'undefined') inputLat.value = '';
            if (typeof inputLng !== 'undefined') inputLng.value = '';
            if (inputDesc) inputDesc.value = ''; // Limpa a descrição
            
            if (tituloModal) tituloModal.textContent = "Novo Ponto";
        }
    }
}

// Função para fechar o modal
function closeModal() {
    modalPoint.classList.add('hidden');
    if (tempMarker) {
        map.removeLayer(tempMarker);
        tempMarker = null;
    }
}

// Evento: Botão Adicionar (+)
btnAdd.addEventListener('click', () => {
    openModal(false);
});

// Evento: Botões Editar
const editButtons = document.querySelectorAll('#point-edit');
editButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.stopPropagation(); 
        
        openModal(true);
        inputName.value = "Local Editável (Exemplo)";
    });
});

// Eventos de Fechamento
btnCancel.addEventListener('click', closeModal);
btnCloseModal.addEventListener('click', closeModal);

/* --- Seleção no Mapa --- */

// Quando clica no mapa
map.on('click', function(e) {
    // Verifica se o modal está visível (aberto)
    if (!modalPoint.classList.contains('hidden')) {
        
        const lat = e.latlng.lat.toFixed(5);
        const lng = e.latlng.lng.toFixed(5);

        // Preenche os inputs
        inputLat.value = lat;
        inputLng.value = lng;

        // Adiciona um marcador visual onde o usuário clicou (Feedback visual)
        if (tempMarker) {
            tempMarker.setLatLng(e.latlng);
        } else {
            tempMarker = L.marker(e.latlng, {
                opacity: 0.7
            }).addTo(map);
        }
    }
});

// Envio do formulário
document.getElementById('form-point').addEventListener('submit', async (e) => {
    e.preventDefault();

    // Recupera o token do localStorage
    const token = localStorage.getItem('token');

    const descValue = document.getElementById('input-desc').value;

    // Verificação de segurança no front

    if (!token) {
        alert("Você precisa estar logado para realizar esta ação!");
        window.location.href = "login.html"; // Redireciona para login
        return;
    }

    const dados = {
        nome: inputName.value,
        latitude: parseFloat(inputLat.value),
        longitude: parseFloat(inputLng.value),
        descricao: descValue,
        // Adicionar outros campos de inputs no HTML, (ESSES SÂO PARA TESTES)
        endereco: "Endereço via Web", 
        horario_funcionamento: "Comercial",
        telefone: "0000-0000"
    };

    const method = idPontoEdicao ? 'PUT' : 'POST';
    const url = idPontoEdicao ? `${API_URL}/${idPontoEdicao}` : API_URL;

    try {
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(dados)
        });

        if (response.ok) {
            alert(`Ponto ${idPontoEdicao ? 'editado' : 'salvo'} com sucesso!`);
            closeModal();
            carregarPontos(); // Atualiza o mapa
        } else {
            alert("Erro ao salvar ponto.");
        }
    } catch (error) {
        console.error("Erro:", error);
        alert("Erro de conexão.");
    }
});

    closeModal();
    // Aqui para baixo é a lógica para enviar ao Back-end ou criar o ponto definitivo no mapa

/* --- Logica do Back-end --- */
function renderizarListaFiltrada(lista) {
    const listaUl = document.querySelector('#options-menu ul');

    // limpa a lista atual
    listaUl.innerHTML = '';

    lista.forEach(ponto => {
        const li = document.createElement('li');
        li.className = 'menu-item';
        li.innerHTML = `
            <span class="point-text">
                <strong>${ponto.nome}</strong> <br> 
                <small>${ponto.latitude}, ${ponto.longitude}</small>
            </span>
            <div class="action-buttons">
                <button class="btn-icon view-btn"><i class="fa-solid fa-eye"></i></button>
                <button class="btn-icon edit-btn"><i class="fa-solid fa-pen"></i></button>
                <button class="btn-icon delete-btn"><i class="fa-solid fa-trash"></i></button>
            </div>
        `;

        // botão ver
        li.querySelector('.view-btn').addEventListener('click', () => {
            map.setView([ponto.latitude, ponto.longitude], 16);
        });

        // botão editar
        li.querySelector('.edit-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            prepararEdicao(ponto);
        });

        // botão excluir
        li.querySelector('.delete-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            deletarPonto(ponto.id);
        });

        listaUl.appendChild(li);
    });
}

const campoPesquisa = document.getElementById("search");

campoPesquisa.addEventListener("input", () => {
    const texto = campoPesquisa.value.toLowerCase();

    const filtrados = todosPontos.filter(p =>
        p.nome.toLowerCase().includes(texto)
    );

    // Atualiza lista
    renderizarListaFiltrada(filtrados);

    // Atualiza mapa
    atualizarMarcadores(filtrados);
});

function atualizarMarcadores(pontos) {
    // Limpa marcadores antigos
    marcadoresMap.forEach(m => map.removeLayer(m));
    marcadoresMap = [];

    pontos.forEach(ponto => {
        if (ponto.latitude && ponto.longitude) {
            
            // --- CORREÇÃO AQUI: Garante o ID (seja _id ou id) ---
            const idReal = ponto._id || ponto.id;

            if (!idReal) {
                console.error("ERRO: Ponto sem ID encontrado:", ponto);
                return; // Pula este ponto se não tiver ID
            }
            // ----------------------------------------------------

            // Define ícone (se for seu, senão padrão)
            const userLogado = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
            const isOwner = userLogado && userLogado.id === ponto.usuario_id; 
            const iconToUse = isOwner ? greenIcon : blueIcon; 

            const marker = L.marker([ponto.latitude, ponto.longitude], { icon: iconToUse });

            // Conteúdo do Popup usando o 'idReal' que criamos
            const conteudoPopup = `
                <div style="text-align:center; min-width: 150px;">
                    <h3 style="margin:0; font-size:16px;">${ponto.nome}</h3>
                    <p style="margin:5px 0; font-size:13px; color:#555;">${ponto.descricao || 'Sem descrição'}</p>
                    
                    <a href="services.html?id=${idReal}" class="link-popup" style="display:inline-block; margin-bottom:10px;">
                        Ver detalhes <i class="fa-solid fa-arrow-up-right-from-square"></i>
                    </a>
                    
                    <div style="border-top: 1px solid #eee; padding-top: 8px;">
                        <button onclick="prepararEdicaoPeloId('${idReal}')" 
                                style="cursor:pointer; background:none; border:none; color:#007bff; text-decoration:underline;">
                            Editar
                        </button>
                        <button onclick="deletarPonto('${idReal}')" 
                                style="cursor:pointer; background:none; border:none; color:red; margin-left:10px;">
                            Excluir
                        </button>
                    </div>
                </div>
            `;

            marker.bindPopup(conteudoPopup);
            marker.addTo(map);
            marcadoresMap.push(marker);
        }
    });
}

async function carregarPontos() {
    try {
        const response = await fetch(API_URL);
        todosPontos = await response.json();
        const pontos = todosPontos;

        // Limpar lista lateral antiga (para n ficar gerando duplicas)
        const listaUl = document.querySelector('#options-menu ul');
        listaUl.innerHTML = '';

        // Limpar marcadores antigos do mapa (para n ficar gerando duplicas)
        marcadoresMap.forEach(m => map.removeLayer(m));
        marcadoresMap = [];

        renderizarListaFiltrada(todosPontos);
        atualizarMarcadores(todosPontos);

        verificarParametrosURL(); // <--- tentativa para funcionar integração lista mapa

    } catch (error) {
        console.error("Erro ao carregar pontos:", error);
    }
}

// Chame essa função assim que o script carregar
carregarPontos();

async function deletarPonto(id) {
    if (confirm("Tem certeza que deseja excluir este ponto?")) {
        
        // 1. Pega o token salvo no navegador
        const token = localStorage.getItem('token');

        // Se não tiver token, nem tenta enviar
        if (!token) {
            alert("Você precisa estar logado para excluir pontos.");
            return;
        }

        try {
            // 2. Adiciona o cabeçalho Authorization
            const response = await fetch(`http://localhost:3000/api/pontos/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}` // <--- O PULO DO GATO ESTÁ AQUI
                }
            });

            if (response.ok) {
                alert("Ponto excluído com sucesso!");
                carregarPontos(); // Atualiza a lista e o mapa
            } else {
                // Tratamento de erros comuns
                if (response.status === 401 || response.status === 403) {
                    alert("Erro: Você não tem permissão para excluir (Sessão inválida).");
                } else {
                    alert("Erro ao excluir. O servidor respondeu com erro.");
                }
            }
        } catch (error) {
            console.error(error);
            alert("Erro de conexão com o servidor.");
        }
    }
}

// Lógica para saber qual botão mostrar (ENTRAR OU SAIR)
function verificarEstadoLogin() {
    const token = localStorage.getItem('token');
    
    // Pegamos os elementos do HTML pelos IDs que criamos agora
    const menuLogin = document.getElementById('menu-login');
    const menuLogout = document.getElementById('menu-logout');

    if (token) {
        // --- USUÁRIO LOGADO ---
        // Esconde o botão de entrar
        if (menuLogin) menuLogin.style.display = 'none';
        // Mostra o botão de sair
        if (menuLogout) menuLogout.style.display = 'block';
    } else {
        // --- USUÁRIO VISITANTE ---
        // Mostra o botão de entrar
        if (menuLogin) menuLogin.style.display = 'block';
        // Esconde o botão de sair
        if (menuLogout) menuLogout.style.display = 'none';
        
    }
}

// Executa a função assim que o script carrega
verificarEstadoLogin();

// Lógica de Logout
const btnLogout = document.getElementById('btn-logout');

if (btnLogout) {
    btnLogout.addEventListener('click', (e) => {
        e.preventDefault(); // Evita que o link coloque # na URL

        // Remove o Token e os dados do usuário do armazenamento
        localStorage.removeItem('token');
        localStorage.removeItem('user');

        // Avisa o usuário
        alert("Você saiu da conta.");

        // Redireciona para a tela de login
        window.location.href = "login.html";
    });
}

// --- PROTEÇÃO DO BOTÃO MEU PERFIL ---
const btnMeuPerfil = document.getElementById('btn-meu-perfil');

if (btnMeuPerfil) {
    btnMeuPerfil.addEventListener('click', (e) => {
        const token = localStorage.getItem('token');

        // Se não está logado
        if (!token) {
            e.preventDefault(); // Impede de ir para profile.html
            
            // Opção A: Apenas redireciona para o login
            // window.location.href = "login.html";

            // Aviso de que não esta lagado
            if (confirm("Você precisa estar logado para ver seu perfil. Ir para login?")) {
                window.location.href = "login.html";
            }
        }
        // Se tiver token, o código não faz nada e o link funciona normalmente (vai para profile.html)
    });
}

// --- LÓGICA DE URL ---
// Verifica se a URL tem ?lat=...&lng=...
function verificarParametrosURL() {
    const params = new URLSearchParams(window.location.search);
    const latParam = params.get('lat');
    const lngParam = params.get('lng');
    const zoomParam = params.get('zoom') || 16;

    if (latParam && lngParam) {
        // Espera um pouco para garantir que o mapa carregou
        setTimeout(() => {
            // Voa para o local
            map.flyTo([latParam, lngParam], zoomParam, {
                animate: true,
                duration: 1.5
            });

            // Procura nos marcadores que já carregamos
            const markerEncontrado = marcadoresMap.find(m => {
                const mLat = m.getLatLng().lat.toFixed(5);
                const mLng = m.getLatLng().lng.toFixed(5);
                // Compara com uma pequena margem de erro ou arredondamento
                return Math.abs(mLat - parseFloat(latParam).toFixed(5)) < 0.0001 &&
                       Math.abs(mLng - parseFloat(lngParam).toFixed(5)) < 0.0001;
            });

            if (markerEncontrado) {
                markerEncontrado.openPopup();
            }
        }, 500); // Delay de meio segundo
    }
}

// --- FUNÇÃO AUXILIAR PARA O POPUP (Versão Corrigida) ---
function prepararEdicaoPeloId(idClicado) {
    console.log("Tentando editar ID:", idClicado);

    // Busca flexível: Verifica se o ID bate com _id OU com id
    const pontoEncontrado = todosPontos.find(p => {
        const idPonto = p._id || p.id;
        return idPonto === idClicado;
    });
    
    if (pontoEncontrado) {
        prepararEdicao(pontoEncontrado);
    } else {
        console.error("Erro: ID não encontrado na lista em memória.");
        // Debug para ajudar a ver o que tem na lista
        console.log("IDs disponíveis na memória:", todosPontos.map(p => p._id || p.id));
    }
}