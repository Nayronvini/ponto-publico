document.addEventListener('DOMContentLoaded', () => {
        // Elementos da tela
        const elNome = document.getElementById('display-name');
        const elAvatar = document.querySelector('.profile-avatar'); // A bolinha da foto
        const btnMudarNome = document.getElementById('btn-mudar-nome'); // ADICIONEI ID NO HTML
        const btnMudarFoto = document.getElementById('btn-mudar-foto'); // ADICIONEI ID NO HTML
        const inputArquivo = document.getElementById('input-foto-arquivo');

        
        // Carrega dados ao abrir a tela
        carregarDadosTela();

        function carregarDadosTela() {
            const userStr = localStorage.getItem('user');
            if (userStr) {
                const user = JSON.parse(userStr);
                
                // Atualiza Nome
                elNome.textContent = user.nome || "Usuário";
                
                // Atualiza Foto (Se tiver foto, põe foto. Se não, deixa ícone)
                if (user.foto) {
                    elAvatar.innerHTML = `<img src="${user.foto}" style="width:100%; height:100%; object-fit:cover; border-radius:50%;">`;
                } else {
                    elAvatar.innerHTML = `<i class="fa-solid fa-user"></i>`;
                }
            }
        }

        // Função para Atualizar Perfil
        async function atualizarPerfilBackend(novosDados) {
            const token = localStorage.getItem('token');
            if (!token) return alert("Você precisa estar logado.");

            try {
                const response = await fetch('http://localhost:3000/api/auth/perfil', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(novosDados)
                });

                if (response.ok) {
                    const usuarioAtualizado = await response.json();
                    
                    // Atualiza o localStorage com os dados novos
                    // mantendo o que já tinha (token, etc não muda, mas o user sim)
                    localStorage.setItem('user', JSON.stringify(usuarioAtualizado));
                    
                    // Atualiza a tela
                    carregarDadosTela();
                    alert("Perfil atualizado com sucesso!");
                } else {
                    // Tenta ler a resposta de erro do servidor
    const erro = await response.json().catch(() => ({})); 
    
    console.error("Erro detalhado:", response.status, erro);

    // Tratamento específico para imagem muito grande (Erro 413)
    if (response.status === 413) {
        alert("Erro: A imagem é muito pesada para o servidor. Tente uma menor.");
    } 
    // Erro de autenticação (Token expirou)
    else if (response.status === 401) {
        alert("Sessão expirada. Faça login novamente.");
        window.location.href = "login.html";
    }
    // Outros erros (mostra a mensagem que veio do backend)
    else {
        alert("Erro ao atualizar: " + (erro.error || "Erro desconhecido"));
    }
}
                }
            catch (error) {
                console.error(error);
                alert("Erro de conexão.");
            }
        }

        // Mudar Nome
        if (btnMudarNome) {
            btnMudarNome.addEventListener('click', () => {
                const atual = elNome.textContent;
                const novo = prompt("Digite seu novo nome:", atual);
                
                if (novo && novo.trim() !== "") {
                    atualizarPerfilBackend({ nome: novo });
                }
            });
        }

        // Função auxiliar: Converte Arquivo para Base64 (Texto)
        const converterBase64 = (file) => {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => resolve(reader.result);
                reader.onerror = (error) => reject(error);
            });
        };

        // Mudar Foto
        if (btnMudarFoto && inputArquivo) {
            // Quando clicar no botão "Texto", a gente clica no Input escondido
            btnMudarFoto.addEventListener('click', () => {
                inputArquivo.click();
            });

            // Quando o usuário escolher o arquivo no computador/celular
            inputArquivo.addEventListener('change', async (e) => {
                const arquivo = e.target.files[0];
                
                if (arquivo) {
                    // Validação de tamanho (máximo 2MB para não travar o MongoDB gratuito)
                    if (arquivo.size > 2 * 1024 * 1024) {
                        alert("A imagem é muito grande! Escolha uma menor que 2MB.");
                        return;
                    }

                    try {
                        // 1. Transforma a imagem em texto gigante
                        const fotoBase64 = await converterBase64(arquivo);
                        
                        // 2. Manda pro backend salvar
                        await atualizarPerfilBackend({ foto: fotoBase64 });
                        
                    } catch (error) {
                        console.error("Erro ao converter imagem", error);
                        alert("Erro ao processar a imagem.");
                    }
                }
            });
        }

        // Lógica de Logout
        const btnProfile = document.getElementById('btn-logout-profile');
        if(btnProfile) {
            btnProfile.addEventListener('click', () => {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = "login.html";
            });
        }
        // ... (Código anterior de carregar foto e nome) ...

    // ----------------------------------------------------
    // LÓGICA DAS AVALIAÇÕES (CRUD)
    // ----------------------------------------------------
    
    carregarMinhasAvaliacoes();

    async function carregarMinhasAvaliacoes() {
        const container = document.getElementById('lista-minhas-avaliacoes');
        const token = localStorage.getItem('token');
        
        if(!token) return;

        try {
            const response = await fetch('http://localhost:3000/api/avaliacoes/usuario/meus-reviews', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const avaliacoes = await response.json();

            container.innerHTML = '';

            if(avaliacoes.length === 0) {
                container.innerHTML = '<p>Você ainda não avaliou nenhum local.</p>';
                return;
            }

            avaliacoes.forEach(av => {
                // Nome do ponto (se foi populado corretamente)
                const nomePonto = av.pontoId ? av.pontoId.nome : 'Local desconhecido';
                
                // Criação do HTML do card
                const card = document.createElement('div');
                card.className = 'review-card';
                card.innerHTML = `
                    <div class="card-header">
                        <span class="reviewer-name">
                            <i class="fa-solid fa-map-pin"></i> ${nomePonto}
                        </span>
                        <div class="review-meta">
                            <span class="review-date">${new Date(av.createdAt).toLocaleDateString()}</span>
                            <div class="stars">
                                ${gerarEstrelasHTML(av.nota)}
                            </div>
                        </div>
                    </div>
                    
                    <div class="card-body">
                        <p>${av.comentario}</p>
                    </div>

                    <div class="card-footer" style="justify-content: flex-end; gap: 10px;">
                        <button class="btn-text" style="color: blue;" onclick="abrirModalEdicao('${av._id}', '${av.nota}', '${av.comentario.replace(/'/g, "\\'")}')">Editar</button>
                        <button class="btn-text" style="color: red;" onclick="excluirAvaliacao('${av._id}')">Excluir</button>
                    </div>
                `;
                container.appendChild(card);
            });

        } catch (error) {
            console.error(error);
            container.innerHTML = '<p>Erro ao carregar avaliações.</p>';
        }
    }

    // Função auxiliar de estrelas (pode copiar a do services.js ou criar essa simples)
    function gerarEstrelasHTML(nota) {
        let html = '';
        for(let i=1; i<=5; i++) {
            html += `<i class="fa-solid fa-star ${i <= nota ? 'yellow' : 'gray'}"></i>`;
        }
        return html;
    }

    // --- FUNÇÕES DE EDIÇÃO E EXCLUSÃO (Globais para funcionar no onclick) ---

    window.excluirAvaliacao = async (id) => {
        if(!confirm("Tem certeza que deseja apagar essa avaliação?")) return;
        
        const token = localStorage.getItem('token');
        try {
            const res = await fetch(`http://localhost:3000/api/avaliacoes/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if(res.ok) {
                alert("Avaliação removida!");
                // Recarrega a lista
                location.reload(); 
            } else {
                alert("Erro ao remover.");
            }
        } catch (e) {
            console.error(e);
        }
    };

    // Variáveis do Modal
    const modalEdit = document.getElementById('modal-edit-review');
    const inputId = document.getElementById('edit-review-id');
    const inputNota = document.getElementById('edit-nota');
    const inputComentario = document.getElementById('edit-comentario');
    const btnCloseEdit = document.getElementById('btn-close-edit');
    const btnCancelEdit = document.getElementById('btn-cancel-edit');
    const formEdit = document.getElementById('form-edit-review');

    window.abrirModalEdicao = (id, nota, texto) => {
        inputId.value = id;
        inputNota.value = nota;
        inputComentario.value = texto;
        modalEdit.classList.remove('hidden');
    };

    const fecharModal = () => {
        modalEdit.classList.add('hidden');
    };

    if(btnCloseEdit) btnCloseEdit.addEventListener('click', fecharModal);
    if(btnCancelEdit) btnCancelEdit.addEventListener('click', fecharModal);

    // Salvar Edição
    if(formEdit) {
        formEdit.addEventListener('submit', async (e) => {
            e.preventDefault();
            const token = localStorage.getItem('token');
            const id = inputId.value;
            
            const dados = {
                nota: Number(inputNota.value),
                comentario: inputComentario.value
            };

            try {
                const res = await fetch(`http://localhost:3000/api/avaliacoes/${id}`, {
                    method: 'PUT',
                    headers: { 
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}` 
                    },
                    body: JSON.stringify(dados)
                });

                if(res.ok) {
                    alert("Avaliação atualizada!");
                    fecharModal();
                    // Recarrega a lista para mostrar o novo texto
                    location.reload(); 
                    // Ou poderia chamar carregarMinhasAvaliacoes(), mas reload é mais seguro para limpar tudo
                } else {
                    alert("Erro ao atualizar.");
                }
            } catch (err) {
                console.error(err);
            }
        });
    }
    });