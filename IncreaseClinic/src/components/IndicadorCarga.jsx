function IndicadorCarga({ mensaje = "Cargando..." }) {
  return (
    <div id="indicadorCarga" className="indicadorCarga">
      <div className="indicadorCarga__spinner"></div>
      <p className="indicadorCarga__mensaje">{mensaje}</p>
    </div>
  );
}

export default IndicadorCarga;
