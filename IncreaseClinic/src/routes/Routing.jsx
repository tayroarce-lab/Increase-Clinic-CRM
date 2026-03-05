import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ProveedorAutenticacion, useAutenticacion } from "../context/ContextoAutenticacion";
import RequiereAutenticacion from "../context/RequiereAutenticacion";
import RequiereRol from "../context/RequiereRol";
import BarraNavegacion from "../components/BarraNavegacion";

// Pages
import PaginaLogin from "../pages/PaginaLogin";
import PaginaRegistro from "../pages/PaginaRegistro";
import PanelAdmin from "../pages/PanelAdmin";
import PerfilCliente from "../pages/PerfilCliente";
import CitasCliente from "../pages/CitasCliente";

function RedireccionInicio() {
  const { usuario } = useAutenticacion();

  if (!usuario) return <Navigate to="/login" replace />;
  if (usuario.rol === "admin") return <Navigate to="/admin" replace />;
  return <Navigate to="/perfil" replace />;
}

export const Routing = () => {
    return (
        <BrowserRouter>
            <ProveedorAutenticacion>
                <BarraNavegacion />
                <main className="contenidoPrincipal">
                    <Routes>
                        <Route path="/" element={<RedireccionInicio />} />
                        <Route path="/login" element={<PaginaLogin />} />
                        <Route path="/registro" element={<PaginaRegistro />} />
                        
                        <Route
                            path="/admin"
                            element={
                                <RequiereAutenticacion>
                                    <RequiereRol rol="admin">
                                        <PanelAdmin />
                                    </RequiereRol>
                                </RequiereAutenticacion>
                            }
                        />
                        
                        <Route
                            path="/perfil"
                            element={
                                <RequiereAutenticacion>
                                    <RequiereRol rol="cliente">
                                        <PerfilCliente />
                                    </RequiereRol>
                                </RequiereAutenticacion>
                            }
                        />
                        
                        <Route
                            path="/citas"
                            element={
                                <RequiereAutenticacion>
                                    <RequiereRol rol="cliente">
                                        <CitasCliente />
                                    </RequiereRol>
                                </RequiereAutenticacion>
                            }
                        />
                        
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </main>
            </ProveedorAutenticacion>
        </BrowserRouter>
    );
};