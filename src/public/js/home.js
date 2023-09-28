const transferenciasDiv = document.getElementById('transferencias');

const data = await getData();
renderizarTransferencias(data);

async function getData() {
  try {
    const response = await fetch('/api/operacion/movimientos-usuario');
    const { data, error } = await response.json();
    if (error) {
      alert(error);
      return [];
    }
    console.log(data);
    return data;
  } catch (error) {
    console.log(error);
    return [];
  }
}

function renderizarTransferencias(data) {
  let transferencias = `
  <div class='row align-items-center transferencias'>
    <div class='col'>
      Referencia
    </div>
    <div class='col'>
      Tipo
    </div>
    <div class='col'>
      Fecha
    </div>
    <div class='col'>
      Monto
    </div>
    <div class='col'>
      Destinatario
    </div>
  </div>
  `;

  data.forEach((transferencia) => {
    const { id_movimiento, tipo, monto, fecha, nombre_receptor } = transferencia;
    transferencias += `
    <div class='row align-items-center transferencias'>
      <div class='col'>
        ${id_movimiento}
      </div>
      <div class='col' ${
        tipo === 'transferencia recibida' ? "style='color:green;'" : ''
      }'>
        ${tipo}
      </div>
      <div class='col'>
        ${new Date(fecha).toLocaleDateString()}
      </div>    
      <div class='col'>
        ${monto}
      </div>
      <div class='col'>
        ${nombre_receptor}
      </div>
    </div>
    `;
  });

  transferenciasDiv.innerHTML = transferencias;
}
