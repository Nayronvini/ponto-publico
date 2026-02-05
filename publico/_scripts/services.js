/* ----------------- Lista de Serviços Dinâmica ----------------- */

// Container da lista
const container = document.getElementById('services-list');

// Campo de pesquisa da lista
const searchInput = document.querySelector('.search-bar-large input');

// Array para guardar todos os pontos do backend
let todosPontos = [];

// ----------------- Função para renderizar estrelas -----------------
function renderStars(media) {
    let html = '';
    for (let i = 1; i <= 5; i++) {
        html += `<i class="fa-solid fa-star ${i <= media ? 'yellow' : 'gray'}"></i>`;
    }
    return html;
}

// ----------------- Toggle detalhes (Modificado para carregar reviews) -----------------
async function toggleDetails(element, pontoId) {
    const item = element.parentElement;
    const isActive = item.classList.contains('active');
    
    // Toggle da classe (Abre ou fecha)
    item.classList.toggle('active');

    // Se acabou de abrir (!isActive era falso antes, agora abriu), carrega as avaliações
    if (!isActive && pontoId) {
        await carregarAvaliacoesDoPonto(pontoId);
    }

    // Fecha os outros cards para manter organizado (Opcional)
    const allItems = document.querySelectorAll('.service-item');
    allItems.forEach(other => {
        if (other !== item) {
            other.classList.remove('active');
        }
    });
}

// ----------------- Renderizar lista -----------------
function renderizarListaServicos(pontos) {
    container.innerHTML = ''; 

    if (pontos.length === 0) {
        container.innerHTML = '<p style="padding:20px; text-align:center;">Nenhum serviço encontrado.</p>';
        return;
    }

    pontos.forEach(ponto => {
        const item = document.createElement('div');
        item.className = 'service-item';
        
        // Garante que o ID seja consistente
        const idReal = ponto._id || ponto.id; 
        item.id = `service-${idReal}`; 

        const temLocalizacao = ponto.latitude && ponto.longitude;

        item.innerHTML = `
            <div class="item-summary" onclick="toggleDetails(this, '${idReal}')">
                <div class="col-service">
                    <i class="fa-solid fa-chevron-right arrow-icon"></i>
                    <span>${ponto.nome}</span>
                </div>
                <div class="col-local">${ponto.endereco || 'Não informado'}</div>
                <div class="col-rating stars">
                    ${renderStars(ponto.media_avaliacao || 0)}
                </div>
            </div>
            
            <div class="item-details">
                <div class="details-content">
                    <p><strong>Descrição:</strong> ${ponto.descricao || 'Sem descrição.'}</p>
                    <p><strong>Horário:</strong> ${ponto.horario_funcionamento || 'Não informado'}</p>
                    <p><strong>Telefone:</strong> ${ponto.telefone || 'Não informado'}</p>
                    
                    <div class="actions-row" style="margin-top: 15px; display:flex; gap: 10px;">
                         ${temLocalizacao ? `
                            <button class="btn-ver-mapa" onclick="irParaMapa(${ponto.latitude}, ${ponto.longitude})">
                                <i class="fa-solid fa-map-location-dot"></i> Ver no Mapa
                            </button>
                        ` : ''}

                        <button class="btn-ver-mapa" style="background-color: #0d8632;" onclick="irParaAvaliacao('${idReal}', '${ponto.nome}')">
                            <i class="fa-solid fa-star"></i> AVALIAR
                        </button>
                    </div>

                    <div class="reviews-section" id="reviews-${idReal}" style="margin-top: 20px; border-top: 1px solid #ddd; padding-top: 10px;">
                        <h4 style="font-size: 1rem; margin-bottom: 10px;">Avaliações de usuários</h4>
                        <div class="loading-reviews" style="color:#666; font-size:0.9rem;">Carregando...</div>
                        <div class="reviews-list-content"></div>
                    </div>
                </div>
            </div>
        `;
        container.appendChild(item);
    });
}

// Função auxiliar para ir para a página de avaliar
function irParaAvaliacao(id, nome) {
    const nomeEncoded = encodeURIComponent(nome);
    window.location.href = `avaliar.html?id=${id}&nome=${nomeEncoded}`;
}

// Função que faz o redirecionamento para o mapa
function irParaMapa(lat, lng) {
    window.location.href = `index.html?lat=${lat}&lng=${lng}&zoom=18`;
}

// ----------------- Busca e exibe Avaliações (Com botão Seguir) -----------------
async function carregarAvaliacoesDoPonto(pontoId) {
    const divReviews = document.querySelector(`#reviews-${pontoId} .reviews-list-content`);
    const divLoading = document.querySelector(`#reviews-${pontoId} .loading-reviews`);
    
    if(!divReviews) return;

    // Mostra loading se estiver vazio
    divLoading.style.display = 'block';

    try {
        const response = await fetch(`http://localhost:3000/api/avaliacoes/${pontoId}`);
        const avaliacoes = await response.json();

        divLoading.style.display = 'none';
        divReviews.innerHTML = '';

        if (avaliacoes.length === 0) {
            divReviews.innerHTML = '<p style="font-size: 0.9rem; color: #777;">Ainda não há avaliações. Seja o primeiro!</p>';
            return;
        }

        avaliacoes.forEach(av => {
            const userFoto = av.userId && av.userId.foto ? av.userId.foto : null;
            const userName = av.userId ? av.userId.nome : 'Usuário Anônimo';

            // Lógica do botão Seguir
            const meuUser = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
            const isMe = meuUser && av.userId && meuUser.id === av.userId._id;
            
            const btnSeguirHTML = (!isMe && meuUser && av.userId) 
                ? `<button onclick="seguirUsuario('${av.userId._id}')" class="btn-seguir-sm" title="Seguir usuário" style="border:none; background:none; color:#3A57E8; cursor:pointer; margin-left:5px;"><i class="fa-solid fa-user-plus"></i></button>` 
                : '';

            const htmlReview = `
                <div style="background: white; padding: 15px; border-radius: 8px; margin-bottom: 10px; border: 1px solid #eee; box-shadow: 0 2px 5px rgba(0,0,0,0.05);">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                        <strong style="font-size: 0.95rem; display:flex; align-items:center; gap:8px; color: #333;">
                            ${userFoto ? 
                                `<img src="${userFoto}" style="width:30px; height:30px; border-radius:50%; object-fit:cover;">` : 
                                `<div style="width:30px; height:30px; background:#ddd; border-radius:50%; display:flex; align-items:center; justify-content:center;"><i class="fa-solid fa-user" style="color:#fff; font-size:14px;"></i></div>`
                            } 
                            ${userName}
                            ${btnSeguirHTML}
                        </strong>
                        <div class="stars" style="font-size: 0.8rem;">${renderStars(av.nota)}</div>
                    </div>
                    <p style="font-size: 1rem; color: #555; margin: 0; line-height: 1.4;">${av.comentario}</p>
                    <small style="color: #bbb; font-size: 0.75rem; display:block; margin-top:5px;">${new Date(av.createdAt).toLocaleDateString()}</small>
                </div>
            `;
            divReviews.innerHTML += htmlReview;
        });

    } catch (error) {
        console.error("Erro ao carregar reviews", error);
        divLoading.textContent = "Erro ao carregar.";
    }
}

// ----------------- Função Seguir Usuário -----------------
async function seguirUsuario(targetId) {
    const token = localStorage.getItem('token');
    if (!token) return alert("Faça login para seguir usuários.");

    try {
        const response = await fetch(`http://localhost:3000/api/social/seguir/${targetId}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (response.ok) {
            alert(data.message); 
        } else {
            alert("Erro: " + (data.error || "Erro ao seguir"));
        }
    } catch (error) {
        console.error(error);
        alert("Erro de conexão.");
    }
}

// ----------------- Carregar serviços do backend -----------------
async function carregarLista() {
    try {
        const response = await fetch('http://localhost:3000/api/pontos'); 
        todosPontos = await response.json();

        renderizarListaServicos(todosPontos);
        
        // Verifica a URL logo depois de desenhar a lista
        verificarIdNaURL();

    } catch (error) {
        console.error('Erro ao carregar serviços:', error);
        container.innerHTML = `<p style="color:red;">Erro ao carregar serviços.</p>`;
    }
}

// ----------------- Filtro de pesquisa -----------------
if (searchInput) {
    searchInput.addEventListener('input', () => {
        const texto = searchInput.value.toLowerCase();
        const filtrados = todosPontos.filter(p => p.nome.toLowerCase().includes(texto));
        renderizarListaServicos(filtrados);
    });
}

// ----------------- Inicialização -----------------
document.addEventListener('DOMContentLoaded', () => {
    carregarLista();
    verificarEstadoLogin(); 
});

// Lógica para saber qual botão mostrar (ENTRAR OU SAIR)
function verificarEstadoLogin() {
    const token = localStorage.getItem('token');
    
    const menuLogin = document.getElementById('menu-login');
    const menuLogout = document.getElementById('menu-logout');

    if (token) {
        // --- USUÁRIO LOGADO ---
        if (menuLogin) menuLogin.style.display = 'none';
        if (menuLogout) menuLogout.style.display = 'block';
    } else {
        // --- USUÁRIO VISITANTE ---
        if (menuLogin) menuLogin.style.display = 'block';
        if (menuLogout) menuLogout.style.display = 'none';
    }
}

// Lógica de Logout
const btnLogout = document.getElementById('btn-logout');

if (btnLogout) {
    btnLogout.addEventListener('click', (e) => {
        e.preventDefault(); 
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        alert("Você saiu da conta.");
        window.location.href = "login.html";
    });
}

// --- PROTEÇÃO DO BOTÃO MEU PERFIL ---
const btnMeuPerfil = document.getElementById('btn-meu-perfil');

if (btnMeuPerfil) {
    btnMeuPerfil.addEventListener('click', (e) => {
        const token = localStorage.getItem('token');
        if (!token) {
            e.preventDefault(); 
            if (confirm("Você precisa estar logado para ver seu perfil. Ir para login?")) {
                window.location.href = "login.html";
            }
        }
    });
}

// --- DEEP LINKING (Id vindo do Mapa) ---
function verificarIdNaURL() {
    const params = new URLSearchParams(window.location.search);
    const idUrl = params.get('id');

    if (!idUrl || idUrl === "undefined") return;

    const idAlvo = `service-${idUrl}`;
    
    if (tentarFocar(idAlvo)) return;

    let tentativas = 0;
    const rastreador = setInterval(() => {
        tentativas++;
        if (tentarFocar(idAlvo) || tentativas > 8) {
            clearInterval(rastreador);
        }
    }, 500);
}

function tentarFocar(idElemento) {
    const el = document.getElementById(idElemento);
    if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        // Usamos toggleDetails para abrir, pois 'active' manual não carrega os reviews
        // Mas precisamos pegar o ID que está no atributo do onclick
        const clickAttr = el.querySelector('.item-summary').getAttribute('onclick');
        // Extrai o ID da string: toggleDetails(this, 'xyz') -> xyz
        const match = clickAttr.match(/'([^']+)'/);
        
        if (match && !el.classList.contains('active')) {
            // Simula o clique ou chama a função
            const idDoPonto = match[1];
            toggleDetails(el.querySelector('.item-summary'), idDoPonto);
        }
        
        el.style.transition = "background 0.5s";
        el.style.backgroundColor = "#fffbcc"; 
        setTimeout(() => { el.style.backgroundColor = ""; }, 2000);
        return true;
    }
    return false;
}