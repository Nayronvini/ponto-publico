const modalPoint = document.getElementById('modal-point');
const btnAdd = document.getElementById('point-add');
const btnCancel = document.getElementById('btn-cancel');
const btnCloseModal = document.getElementById('btn-close-modal');
const inputLat = document.getElementById('input-lat');
const inputLng = document.getElementById('input-lng');
const inputName = document.getElementById('input-name');

// URL do Backend
const API_URL = 'http://localhost:3000/api/pontos';

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
const popupContent = `
    <div style="font-family: Roboto, sans-serif;">
        <h3 style="margin: 0; font-size: 16px;">Cajazeiras</h3>
        <p style="margin: 5px 0; color: #666; font-size: 13px;">Cajazeiras, PB, 58900-000</p>
        <a href="#" style="color: #1a73e8; text-decoration: none; font-size: 13px;">Ver mapa ampliado</a>
    </div>
`;

marker.bindPopup(popupContent).openPopup();


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
function prepararEdicao(ponto) {
    idPontoEdicao = ponto.id; // Guarda o ID globalmente
    
    inputName.value = ponto.nome;
    inputLat.value = ponto.latitude;
    inputLng.value = ponto.longitude;
    
    // Se tiver inputs para endereço/descrição, preencha aqui também
    
    openModal(true); // Abre o modal em modo edição
}

// Atualize sua função openModal existente
function openModal(editMode = false) {
    modalPoint.classList.remove('hidden');
    
    if (!editMode) {
        // Se for criar novo, limpa tudo
        idPontoEdicao = null; // IMPORTANTE: Reseta o ID
        inputName.value = '';
        inputLat.value = '';
        inputLng.value = '';
        
        if(tempMarker) {
            map.removeLayer(tempMarker);
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
        // Adicionar outros campos de inputs no HTML, (ESSES SÂO PARA TESTES)
        endereco: "Endereço via Web", 
        descricao: "Criado pelo Front",
        horario_funcionamento: "Comercial",
        telefone: "0000-0000"
    };

    try {
        let response;
        
        if (idPontoEdicao) {
            // --- MODO EDIÇÃO (PUT) ---
            response = await fetch(`${API_URL}/${idPontoEdicao}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, // <--- ADICIONADO AQUI
                body: JSON.stringify(dados)
            });
        } else {
            // --- MODO CRIAÇÃO (POST) ---
            response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, // <--- ADICIONADO AQUI
                body: JSON.stringify(dados)
            });
        }

        if (response.ok) {
            alert("Salvo com sucesso!");
            closeModal();
            carregarPontos(); // Recarrega a lista e o mapa
        } else {
            // Se o token expirou ou é inválido, o backend retorna 401
            if (response.status === 401) {
                alert("Sua sessão expirou. Faça login novamente.");
                window.location.href = "login.html";
            } else {
                const erro = await response.json();
                alert("Erro ao salvar: " + JSON.stringify(erro));
            }
        }

    } catch (error) {
        console.error("Erro na requisição:", error);
        alert("Erro de conexão com o servidor.");
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

function atualizarMarcadores(lista) {
    // remove os marcadores antigos na filtragem
    marcadoresMap.forEach(m => map.removeLayer(m));
    marcadoresMap = [];

    lista.forEach(ponto => {
        const marker = L.marker([ponto.latitude, ponto.longitude], {icon: customIcon})
            .addTo(map)
            .bindPopup(`<b>${ponto.nome}</b><br>${ponto.endereco}`);
        
        marcadoresMap.push(marker);
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

    } catch (error) {
        console.error("Erro ao carregar pontos:", error);
    }
}

// Chame essa função assim que o script carregar
carregarPontos();

async function deletarPonto(id) {
    if (confirm("Tem certeza que deseja excluir este ponto?")) {
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                alert("Ponto excluído!");
                carregarPontos(); // Atualiza a tela
            } else {
                alert("Erro ao excluir.");
            }
        } catch (error) {
            console.error(error);
            alert("Erro de conexão.");
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