// Lógica simples para preencher o nome e fazer logout
document.addEventListener('DOMContentLoaded', () => {
    // 1. Preencher Nome
    const userStr = localStorage.getItem('user');
        if (userStr) {
            const user = JSON.parse(userStr);
            document.getElementById('display-name').textContent = user.nome || "Usuário";
                
            // Atualiza também nos cards de exemplo
            document.querySelectorAll('.reviewer-name').forEach(el => {
                    el.innerHTML = `<i class="fa-solid fa-circle-user"></i> ${user.nome}`;
            });
    }

    // 2. Função de Logout
    function logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        alert("Você saiu da conta.");
        window.location.href = "login.html";
    }

    // Atrela a função aos botões
        const btnProfile = document.getElementById('btn-logout-profile');
        const btnNav = document.getElementById('btn-logout-nav');
            
        if(btnProfile) btnProfile.addEventListener('click', logout);
        if(btnNav) btnNav.addEventListener('click', (e) => { e.preventDefault(); logout(); });
});