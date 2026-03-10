//PATCH
async function patchCitas(cita: any, id: string) {
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
async function deleteCitas(id: string) {
    try {
        const respuesta = await fetch("http://localhost:3001/citas/" + id, {
            method: "DELETE",
        })
        const datosCitas = await respuesta.json();
        return datosCitas;
    } catch (error) {
        console.error("Error al Eliminar el registro", error);
    }
}

async function getCitas() {
    try {
        const respuesta = await fetch("http://localhost:3001/citas")
        const datos = await respuesta.json();
        return datos;
    } catch (error) {
        console.error("Error al obtener las citas", error);
    }
}

async function postCitas(cita: any) {
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
