//PATCH
async function patchPacientes(paciente,id){
    try {
        const respuesta = await fetch("http://localhost:3001/pacientes/"+id,{
            method:"PATCH",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify(paciente)
        })
        const datosPacientes= await respuesta.json();
        return datosPacientes;
    } catch (error) {
        console.error("Error al actualizar los cambios", error);
    }
}

//DELETE    
async function deletePacientes(id){
    try {
        const respuesta = await fetch("http://localhost:3001/pacientes/"+id,{
            method:"DELETE",
        })
        const datosPacientes= await respuesta.json();
        return datosPacientes;
    } catch (error) {
        console.error("Error al Eliminar el registro", error);
    }
}

async function getPacientes() {
    try {
        const respuesta = await fetch("http://localhost:3001/pacientes")
        const datos = await respuesta.json();
        return datos;
    } catch (error) {
        console.error("Error al obtener los pacientes", error);
    }
}

async function postPacientes(paciente) {
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
