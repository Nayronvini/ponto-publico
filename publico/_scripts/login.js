// Elementos das abas
const tabLogin = document.getElementById('tab-login');
const tabRegister = document.getElementById('tab-register');
const formLogin = document.getElementById('form-login');
const formRegister = document.getElementById('form-register');

// Alternar para Login
tabLogin.addEventListener('click', () => {
    tabLogin.classList.add('active');
    tabRegister.classList.remove('active');

    formLogin.classList.add('active');
    formRegister.classList.remove('active');
});

// Alternar para Cadastro
tabRegister.addEventListener('click', () => {
    tabRegister.classList.add('active');
    tabLogin.classList.remove('active');

    formRegister.classList.add('active');
    formLogin.classList.remove('active');
});

// Ver senha (apenas visual, ícone do olho)
const togglePass = document.getElementById('toggle-login-pass');
const inputPass = document.getElementById('login-pass');

if (togglePass) {
    togglePass.addEventListener('click', () => {
        // Alterna o tipo do input
        const type = inputPass.getAttribute('type') === 'password' ? 'text' : 'password';
        inputPass.setAttribute('type', type);

        // Alterna o ícone
        togglePass.classList.toggle('fa-eye');
        togglePass.classList.toggle('fa-eye-slash');
    });
}

// Simulação de envio do Login
formLogin.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const senha = document.getElementById('login-pass').value;

    // Aqui você conectaria com o backend futuramente
    // alert(`Bem-vindo de volta, ${email}! Redirecionando...`);
    // window.location.href = "index.html"; // Vai para o mapa
try {
        const response = await fetch('http://localhost:3000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, senha })
        });

        const data = await response.json();

        if (response.ok) {
            // SALVA O TOKEN NO NAVEGADOR
            localStorage.setItem('token', data.token);
            
            // (Opcional) Salvar dados do usuário para mostrar "Olá, Fulano" depois
            localStorage.setItem('user', JSON.stringify(data.user)); 

            alert("Login realizado com sucesso!");
            window.location.href = "index.html";
        } else {
            alert("Erro: " + (data.error || "Falha no login"));
        }
    } catch (error) {
        console.error(error);
        alert("Erro de conexão com o servidor.");
    }
});

// Simulação de envio do Cadastro
formRegister.addEventListener('submit', async (e) => {
    e.preventDefault();

    // 1. Pegar os dados do HTML
    const nome = document.getElementById('reg-name').value;
    const email = document.getElementById('reg-email').value;
    const senha = document.getElementById('reg-pass').value;
    const confirm = document.getElementById('reg-confirm').value;

    // 2. Validação simples no Front
    if (senha !== confirm) {
        alert("As senhas não coincidem!");
        return;
    }

    try {
        // 3. Enviar para o Backend (AQUI ESTÁ A MÁGICA)
        // Se estiver usando Live Server (sem a pasta public), use 'http://localhost:3000/api/auth/register'
        const response = await fetch('http://localhost:3000/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome, email, senha })
        });

        const data = await response.json();

        if (response.ok) {
            alert("Conta criada com sucesso! Agora faça login.");
            
            // Troca automaticamente para a aba de Login para facilitar
            document.getElementById('tab-login').click(); 
        } else {
            alert("Erro ao cadastrar: " + (data.error || "Tente novamente"));
        }

    } catch (error) {
        console.error("Erro:", error);
        alert("Erro de conexão ao tentar cadastrar.");
    }
});