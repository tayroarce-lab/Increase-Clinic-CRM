/**
 * Routing.jsx - Configuración centralizada de rutas de la aplicación.
 * Define la estructura de navegación con protección por autenticación y rol:
 *  - Rutas públicas: /, /login, /registro
 *  - Rutas protegidas (admin): /admin
 *  - Rutas protegidas (cliente): /perfil, /citas
 *  - Cualquier otra ruta redirige al inicio
 */

import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ProveedorAutenticacion } from "../context/ContextoAutenticacion";
import RequiereAutenticacion from "../context/RequiereAutenticacion";
import RequiereRol from "../context/RequiereRol";
import BarraNavegacion from "../components/common/BarraNavegacion";
import PiePagina from "../components/common/PiePagina";

// Páginas de la aplicación
import PaginaLogin from "../pages/PaginaLogin";
import PaginaRegistro from "../pages/PaginaRegistro";
import PaginaInicio from "../pages/PaginaInicio";
import PanelAdmin from "../pages/PanelAdmin";
import PerfilCliente from "../pages/PerfilCliente";
import CitasCliente from "../pages/CitasCliente";

export const Routing = () => {
  return (
    <BrowserRouter>
      <ProveedorAutenticacion>
        {/* Barra de navegación visible en todas las páginas */}
        <BarraNavegacion />

        <main className="contenidoPrincipal">
          <Routes>
            {/* Rutas públicas */}
            <Route path="/" element={<PaginaInicio />} />
            <Route path="/login" element={<PaginaLogin />} />
            <Route path="/registro" element={<PaginaRegistro />} />

            {/* Ruta protegida: panel de administración (solo admin) */}
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

            {/* Ruta protegida: perfil del cliente (solo cliente) */}
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

            {/* Ruta protegida: gestión de citas (solo cliente) */}
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

            {/* Ruta comodín: cualquier URL no definida redirige al inicio */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        {/* Pie de página profesional */}
        <PiePagina />
      </ProveedorAutenticacion>
    </BrowserRouter>
  );
};