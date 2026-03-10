export interface Paciente {
  id?: string;
  nombre: string;
  edad: number;
  telefono: string;
  correo: string;
  diagnostico: string;
  fechaRegistro?: string;
}

//PATCH
async function patchPacientes(paciente: Partial<Paciente>, id: string): Promise<Paciente | undefined> {
    try {
        const respuesta = await fetch("http://localhost:3001/pacientes/" + id, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(paciente)
        })
        const datosPacientes = await respuesta.json();
        return datosPacientes;
    } catch (error) {
        console.error("Error al actualizar los cambios", error);
    }
}

//DELETE    
async function deletePacientes(id: string): Promise<void> {
    try {
        await fetch("http://localhost:3001/pacientes/" + id, {
            method: "DELETE",
        })
    } catch (error) {
        console.error("Error al Eliminar el registro", error);
    }
}

async function getPacientes(): Promise<Paciente[]> {
    try {
        const respuesta = await fetch("http://localhost:3001/pacientes")
        const datos = await respuesta.json();
        return datos;
    } catch (error) {
        console.error("Error al obtener los pacientes", error);
        return [];
    }
}

async function postPacientes(paciente: Paciente): Promise<Paciente | undefined> {
    try {
        const respuesta = await fetch("http://localhost:3001/pacientes", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(paciente)
        })
        const datos = await respuesta.json();
        return datos;
    } catch (error) {
        console.error("Error al registrar el paciente", error);
    }
}

export default { patchPacientes, deletePacientes, getPacientes, postPacientes }
