function toggleDetails(element) {
    // Sobe para o elemento pai (.service-item)
    const item = element.parentElement;

    // Toggle da classe 'active'
    item.classList.toggle('active');

    const allItems = document.querySelectorAll('.service-item');
    allItems.forEach(otherItem => {
        if (otherItem !== item) {
            otherItem.classList.remove('active');
        }
    });
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