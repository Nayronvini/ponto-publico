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

// ----------------- Toggle detalhes -----------------
function toggleDetails(element) {
    const item = element.parentElement;
    item.classList.toggle('active');

    // Fechar outros itens
    const allItems = document.querySelectorAll('.service-item');
    allItems.forEach(other => {
        if (other !== item) {
            other.classList.remove('active');
        }
    });
}

// ----------------- Renderizar lista -----------------
function renderizarListaServicos(pontos) {
    container.innerHTML = ''; // limpa lista

    pontos.forEach(ponto => {
        const item = document.createElement('div');
        item.className = 'service-item';

        item.innerHTML = `
            <div class="item-summary" onclick="toggleDetails(this)">
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
                <p>${ponto.descricao || 'Sem descrição.'}</p>
                <p><strong>Horário:</strong> ${ponto.horario_funcionamento || 'Não informado'}</p>
                <p><strong>Telefone:</strong> ${ponto.telefone || 'Não informado'}</p>
            </div>
        `;
        container.appendChild(item);
    });
}

// ----------------- Carregar serviços do backend -----------------
async function carregarLista() {
    try {
        const response = await fetch('http://localhost:3000/api/pontos'); // ajuste conforme sua rota
        todosPontos = await response.json();

        renderizarListaServicos(todosPontos); // exibe todos inicialmente
    } catch (error) {
        console.error('Erro ao carregar serviços:', error);
        container.innerHTML = `<p style="color:red;">Erro ao carregar serviços.</p>`;
    }
}

// ----------------- Filtro de pesquisa -----------------
searchInput.addEventListener('input', () => {
    const texto = searchInput.value.toLowerCase();
    const filtrados = todosPontos.filter(p => p.nome.toLowerCase().includes(texto));
    renderizarListaServicos(filtrados);
});

// ----------------- Inicialização -----------------
document.addEventListener('DOMContentLoaded', carregarLista);

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