import React, { useState, useEffect } from 'react';
import { getAllWebPages, getWebPagesByCityActividad } from '../services/PublicUser';
import WebCd from './CommerceCard';

const WebPageList = () => {
    const [webPages, setWebPages] = useState([]);
    const [filtros, setFiltros] = useState({ ciudad: '', actividad: '' });
    const [paginaSeleccionada, setPaginaSeleccionada] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [ordenarPorPuntuacion, setOrdenarPorPuntuacion] = useState(false); // Estado para controlar el orden

    useEffect(() => {
        const fetchWebPages = async () => {
            setLoading(true);
            setError(null);
            try {
                let data;
                if (filtros.ciudad || filtros.actividad) {
                    data = await getWebPagesByCityActividad(filtros.ciudad, filtros.actividad);
                } else {
                    data = await getAllWebPages();
                }

                setWebPages(data.length > 0 ? data : []);
            } catch (error) {
                setError('No se encontraron resultados.');
                setWebPages([]);
            } finally {
                setLoading(false);
            }
        };

        fetchWebPages();
    }, [filtros]);

    // Función para ordenar las páginas por puntuación
    const ordenarPaginaporPuntuacion = () => {
        setOrdenarPorPuntuacion(prev => !prev); // Cambiar entre ascendente y descendente
        setWebPages(prevWebPages => {
            const ordenadas = [...prevWebPages].sort((a, b) => {
                const puntuacionA = a.puntuacion || 0; // Valor predeterminado 0 si no tiene puntuación
                const puntuacionB = b.puntuacion || 0;
                return ordenarPorPuntuacion ? puntuacionB - puntuacionA : puntuacionA - puntuacionB; // Ascendente o descendente
            });
            return ordenadas;
        });
    };

    const handleFiltroCambio = (e) => {
        const { name, value } = e.target;
        setFiltros(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleVerMas = (pagina) => {
        setPaginaSeleccionada(pagina);
    };

    if (loading) return <div>Cargando...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="web-page-list-container">
            <div className="filtros">
                <select
                    name="ciudad"
                    value={filtros.ciudad}
                    onChange={handleFiltroCambio}
                    className="p-2 border rounded"
                >
                    <option value="">Todas las ciudades</option>
                    <option value="Soria">Soria</option>
                    <option value="Lugo">Lugo</option>
                </select>

                <select
                    name="actividad"
                    value={filtros.actividad}
                    onChange={handleFiltroCambio}
                    className="p-2 border rounded"
                >
                    <option value="">Todas las actividades</option>
                    <option value="Restaurante">Restaurante</option>
                    <option value="Tienda de ropa">Tienda de ropa</option>
                    <option value="Hotel">Hotel</option>
                </select>

                {/* Botón para ordenar por puntuación */}
                <button 
                    onClick={ordenarPaginaporPuntuacion} 
                    className="ml-2 p-2 border rounded bg-blue-500 text-white"
                >
                    {ordenarPorPuntuacion ? 'Ordenar por puntuación (Ascendente)' : 'Ordenar por puntuación (Descendente)'}
                </button>
            </div>

            <div className="web-page-list">
                {webPages.length > 0 ? (
                    webPages.map((pagina) => (
                        <div key={pagina._id}>
                            <WebCd pagina={pagina} ver={handleVerMas} />
                            {paginaSeleccionada && paginaSeleccionada._id === pagina._id && (
                                <div className="detalles-pagina">
                                    <h2>{paginaSeleccionada.titulo}</h2>
                                    <p><strong>Ciudad:</strong> {paginaSeleccionada.ciudad}</p>
                                    <p><strong>Actividad:</strong> {paginaSeleccionada.actividad}</p>
                                    <p><strong>Descripción:</strong> {paginaSeleccionada.resumen}</p>
                                    <p><strong>Textos:</strong> {paginaSeleccionada.textos}</p>
                                    
                                    {/* Renderizar imágenes en lugar de URL */}
                                    {paginaSeleccionada.imagenes && paginaSeleccionada.imagenes.length > 0 ? (
                                        <div>
                                            <p><strong>Imágenes:</strong></p>
                                            {paginaSeleccionada.imagenes.map((imgUrl, index) => (
                                                <img key={index} src={imgUrl} alt={`Imagen ${index + 1}`} style={{ width: '100%', maxWidth: '400px', margin: '10px 0' }} />
                                            ))}
                                        </div>
                                    ) : (
                                        <p><strong>Imágenes:</strong> No disponibles.</p>
                                    )}

                                    {paginaSeleccionada.resenas && Array.isArray(paginaSeleccionada.resenas.resenas) && paginaSeleccionada.resenas.resenas.length > 0 ? (
                                        <div>
                                            <p><strong>Reseñas:</strong></p>
                                            <ul>
                                                {paginaSeleccionada.resenas.resenas.map((resena, index) => (
                                                    <li key={index}>
                                                        <p><strong>Comentario:</strong> {resena.comentario}</p>
                                                        <p><strong>Puntuación:</strong> {resena.puntuacion} / 5</p>
                                                    </li>
                                                ))}
                                            </ul>
                                            <p><strong>Puntuación media:</strong>
                                                {paginaSeleccionada.resenas.resenas.reduce((acc, current) =>  acc + parseFloat(current.puntuacion), 0) / paginaSeleccionada.resenas.resenas.length} / 5
                                            </p>
                                        </div>
                                    ) : (
                                        <p><strong>Reseñas:</strong> No hay reseñas disponibles.</p>
                                    )}

                                    <p><strong>Puntuación general:</strong> {paginaSeleccionada.puntuacion || "No disponible"}</p>

                                    <button onClick={() => setPaginaSeleccionada(null)}>Cerrar</button>
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <p>No se encontraron páginas que coincidan con los filtros.</p>
                )}
            </div>
        </div>
    );
};

export default WebPageList;

