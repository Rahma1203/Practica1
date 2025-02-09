import React from 'react';

const WebCd = ({ pagina, ver }) => {
  return (
    <div className="web-card">
      <h3>{pagina.titulo}</h3>
      <p><strong>Ciudad:</strong> {pagina.ciudad}</p>
      <p><strong>Titulo:</strong> {pagina.titulo}</p>
      <p><strong>Actividad:</strong> {pagina.actividad}</p>
      <div className="web-actions">
        <button onClick={() => ver(pagina)}>Ver más</button>
      </div>
    </div>
  );
};

export default WebCd;
