const API_BASE = 'http://localhost:3000';

document.addEventListener('DOMContentLoaded', () => {
    loadDinos();
    
    const form = document.getElementById('dino-form');
    const cancelBtn = document.getElementById('cancel-btn');
    const searchBtn = document.getElementById('search-btn');
    
    form.addEventListener('submit', handleFormSubmit);
    cancelBtn.addEventListener('click', cancelEdit);
    searchBtn.addEventListener('click', searchDino);
});

async function loadDinos() {
    try {
        const response = await fetch(`${API_BASE}/dinos`);
        const dinos = await response.json();
        displayDinos(dinos);
    } catch (error) {
        console.error('Erro ao carregar dinos:', error);
    }
}

function displayDinos(dinos) {
    const container = document.getElementById('dinos-list');
    container.innerHTML = '';
    
    dinos.forEach(dino => {
        const card = createDinoCard(dino);
        container.appendChild(card);
    });
}

function createDinoCard(dino) {
    const card = document.createElement('div');
    card.className = 'dino-card';
    
    card.innerHTML = `
        <h3>${dino.nome}</h3>
        <p><strong>ID:</strong> ${dino.id_dino}</p>
        <p><strong>Altura:</strong> ${dino.altura}m</p>
        <p><strong>Comprimento:</strong> ${dino.comprimento}m</p>
        <p><strong>Peso:</strong> ${dino.peso}kg</p>
        <p><strong>Velocidade:</strong> ${dino.velocidade}</p>
        <p><strong>Agilidade:</strong> ${dino.agilidade}</p>
        <p><strong>Longevidade:</strong> ${dino.longevidade} anos</p>
        <p><strong>Número Mágico:</strong> ${dino.numero_magico}</p>
        <div class="actions">
            <button class="edit-btn" onclick="editDino(${dino.id_dino})">Editar</button>
            <button class="delete-btn" onclick="deleteDino(${dino.id_dino})">Deletar</button>
        </div>
    `;
    
    return card;
}

function handleFormSubmit(event) {
    event.preventDefault();
    
    const id = document.getElementById('dino-id').value;
    const nome = document.getElementById('nome').value;
    const altura = parseFloat(document.getElementById('altura').value);
    const comprimento = parseFloat(document.getElementById('comprimento').value);
    const peso = parseFloat(document.getElementById('peso').value);
    const velocidade = parseInt(document.getElementById('velocidade').value);
    const agilidade = parseInt(document.getElementById('agilidade').value);
    const longevidade = parseInt(document.getElementById('longevidade').value);
    const numero_magico = parseInt(document.getElementById('numero_magico').value);
    const imagem = ''; // Ignorando imagem por enquanto
    
    const dinoData = { nome, altura, comprimento, peso, velocidade, agilidade, longevidade, numero_magico, imagem };
    
    if (id) {
        updateDino(id, dinoData);
    } else {
        addDino(dinoData);
    }
}

async function addDino(dinoData) {
    try {
        const response = await fetch(`${API_BASE}/dinos`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dinoData)
        });
        
        if (response.ok) {
            loadDinos();
            resetForm();
        } else {
            console.error('Erro ao adicionar dino');
        }
    } catch (error) {
        console.error('Erro ao adicionar dino:', error);
    }
}

async function updateDino(id, dinoData) {
    try {
        const response = await fetch(`${API_BASE}/dinos/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dinoData)
        });
        
        if (response.ok) {
            loadDinos();
            resetForm();
        } else {
            console.error('Erro ao atualizar dino');
        }
    } catch (error) {
        console.error('Erro ao atualizar dino:', error);
    }
}

function editDino(id) {
    fetch(`${API_BASE}/dinos/${id}`)
        .then(response => response.json())
        .then(dino => {
            document.getElementById('dino-id').value = dino.id_dino;
            document.getElementById('nome').value = dino.nome;
            document.getElementById('altura').value = dino.altura;
            document.getElementById('comprimento').value = dino.comprimento;
            document.getElementById('peso').value = dino.peso;
            document.getElementById('velocidade').value = dino.velocidade;
            document.getElementById('agilidade').value = dino.agilidade;
            document.getElementById('longevidade').value = dino.longevidade;
            document.getElementById('numero_magico').value = dino.numero_magico;
            
            document.getElementById('submit-btn').textContent = 'Atualizar Dino';
            document.getElementById('cancel-btn').style.display = 'inline-block';
        })
        .catch(error => console.error('Erro ao buscar dino para edição:', error));
}

function cancelEdit() {
    resetForm();
}

function resetForm() {
    document.getElementById('dino-form').reset();
    document.getElementById('dino-id').value = '';
    document.getElementById('submit-btn').textContent = 'Adicionar Dino';
    document.getElementById('cancel-btn').style.display = 'none';
}

async function deleteDino(id) {
    if (confirm('Tem certeza que deseja deletar este dino?')) {
        try {
            const response = await fetch(`${API_BASE}/dinos/${id}`, {
                method: 'DELETE'
            });
            
            if (response.ok) {
                loadDinos();
            } else {
                console.error('Erro ao deletar dino');
            }
        } catch (error) {
            console.error('Erro ao deletar dino:', error);
        }
    }
}

async function searchDino() {
    const id = document.getElementById('search-id').value;
    if (!id) return;
    
    try {
        const response = await fetch(`${API_BASE}/dinos/${id}`);
        const resultDiv = document.getElementById('search-result');
        
        if (response.ok) {
            const dino = await response.json();
            resultDiv.innerHTML = `
                <div class="dino-card">
                    <h3>${dino.nome}</h3>
                    <p><strong>ID:</strong> ${dino.id_dino}</p>
                    <p><strong>Altura:</strong> ${dino.altura}m</p>
                    <p><strong>Comprimento:</strong> ${dino.comprimento}m</p>
                    <p><strong>Peso:</strong> ${dino.peso}kg</p>
                    <p><strong>Velocidade:</strong> ${dino.velocidade}</p>
                    <p><strong>Agilidade:</strong> ${dino.agilidade}</p>
                    <p><strong>Longevidade:</strong> ${dino.longevidade} anos</p>
                    <p><strong>Número Mágico:</strong> ${dino.numero_magico}</p>
                </div>
            `;
        } else {
            resultDiv.innerHTML = '<p>Dino não encontrado</p>';
        }
    } catch (error) {
        console.error('Erro ao buscar dino:', error);
        document.getElementById('search-result').innerHTML = '<p>Erro ao buscar dino</p>';
    }
}