export interface Cita {
  id?: string;
  nombrePaciente: string;
  fecha: string;
  hora: string;
  motivo: string;
  estado: "pendiente" | "confirmada" | "cancelada";
  idUsuario?: string;
}

//PATCH
async function patchCitas(cita: Partial<Cita>, id: string): Promise<Cita | undefined> {
    try {
        const respuesta = await fetch("http://localhost:3001/citas/" + id, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(cita)
        })
        const datosCitas = await respuesta.json();
        return datosCitas;
    } catch (error) {
        console.error("Error al actualizar los cambios", error);
    }
}

//DELETE
async function deleteCitas(id: string): Promise<void> {
    try {
        await fetch("http://localhost:3001/citas/" + id, {
            method: "DELETE",
        })
    } catch (error) {
        console.error("Error al Eliminar el registro", error);
    }
}

async function getCitas(): Promise<Cita[]> {
    try {
        const respuesta = await fetch("http://localhost:3001/citas")
        const datos = await respuesta.json();
        return datos;
    } catch (error) {
        console.error("Error al obtener las citas", error);
        return [];
    }
}

async function postCitas(cita: Cita): Promise<Cita | undefined> {
    try {
        const respuesta = await fetch("http://localhost:3001/citas", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(cita)
        })
        const datos = await respuesta.json();
        return datos;
    } catch (error) {
        console.error("Error al registrar la cita", error);
    }
}

export default { patchCitas, deleteCitas, getCitas, postCitas }
