const formAdicionar = document.getElementById('form-adicionar');
const listaCarros = document.getElementById('lista-carros');
const btnListar = document.getElementById('btn-listar');
const btnBuscar = document.getElementById('btn-buscar');
const idBuscar = document.getElementById('id-buscar');
const carroEncontrado = document.getElementById('carro-encontrado');

// Adicionar carro
formAdicionar.addEventListener('submit', (e) => {
  e.preventDefault();
  const marca = document.getElementById('marca').value;
  const modelo = document.getElementById('modelo').value;
  const ano = document.getElementById('ano').value;
  const cor = document.getElementById('cor').value;
  const preco = document.getElementById('preco').value;

  fetch('http://localhost:3001/carros', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ marca, modelo, ano, cor, preco })
  })
  .then(res => res.json())
  .then(data => {
    alert('Carro adicionado com sucesso!');
    formAdicionar.reset();
  })
  .catch(error => {
    alert('Erro ao adicionar carro: ' + error);
  });
});

// Listar todos os carros
btnListar.addEventListener('click', () => {
  fetch('http://localhost:3001/carros')
  .then(res => res.json())
  .then(data => {
    listaCarros.innerHTML = '';
    data.forEach(carro => {
      const li = document.createElement('li');
      li.textContent = `ID: ${carro.id} | Marca: ${carro.marca} | Modelo: ${carro.modelo} | Ano: ${carro.ano} | Cor: ${carro.cor} | Preço: €${carro.preco}`;
      listaCarros.appendChild(li);
    });
  })
  .catch(error => {
    alert('Erro ao listar carros: ' + error);
  });
});

// Buscar carro por ID
btnBuscar.addEventListener('click', () => {
  const id = idBuscar.value;
  fetch(`http://localhost:3001/carros/${id}`)
  .then(res => res.json())
  .then(data => {
    if (data.mensagem) {
      carroEncontrado.textContent = data.mensagem;
    } else {
      carroEncontrado.textContent = `ID: ${data.id} | Marca: ${data.marca} | Modelo: ${data.modelo} | Ano: ${data.ano} | Cor: ${data.cor} | Preço: €${data.preco}`;
    }
  })
  .catch(error => {
    carroEncontrado.textContent = 'Erro ao buscar carro';
  });
});
