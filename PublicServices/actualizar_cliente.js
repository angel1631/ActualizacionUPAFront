import { GModal } from "../../Core/components/GModal";
import { useState } from "react";
import { GCard } from "../../Core/components/GCard";
import { GForm } from "../../Core/components/GForm";

export async function server_props(context){
    try{
        
        return {resumen: {}};
    }catch(error){
        console.log("Error SSR: ",error);
        return { props: { } }
    }
}

export default function actualizar_cliente(){
    let schema_personal = {
        title: 'Actualizacion de asociado',
        fields:[
            {id: 'cif', required: 'si', description:'Numero de asociado', type:'number'},
            {id: 'nombre', required: 'si', description: 'Nombre completo', type:'text'},
            {id: 'dpi', required: 'si', description: 'Numero de dpi', type:'dpi'},
            {id: 'direccion', required: 'si', description: 'Direccion de domicilio', type:'text'},
            {id: 'celular', required: 'si', description: 'Numero de celular', type:'text', 
                validations:{"regex_change": "[^0-9]", "regex_blur":"^[0-9]{8}$", "fail_msg": 'Telefono no valido, solo sé permite numeros de 8 digitos'}
            },
            {id: 'telefono', required: 'no', description: 'Numero de telefono domiciliar', type:'text',
                validations:{"regex_change": "[^0-9]", "regex_blur":"^[0-9]{8}$", "fail_msg": 'Telefono no valido, solo sé permite numeros de 8 digitos'}
            },
            {id: 'email', required: 'si', description: 'Correo electronico', type:'email'},
        ]
    }
    let schema_laboral = {
        title: 'Ingreso Laboral', 
        fields: [
            {id: 'empresa', required: 'si', description: 'Nombre de la empresa donde labora', type:'text'},
            {id: 'puesto', required: 'si', description: 'Puesto que ocupa en la empresa', type:'text'},
            {id: 'direccion_empresa', required: 'si', description: 'Direccion de la empresa', type: 'text'},
            {id: 'telefono_empresa', required: 'si',  description: 'Telefono de la empresa', type: 'text',
                validations:{"regex_change": "^[0-9]", "regex_blur":"^[0-9]{8}$", "fail_msg": 'Telefono no valido, solo sé permite numeros de 8 digitos'}
            },
            {id: 'ingreso_empresa', required: 'si', description: 'Total de ingresos mensuales', type: 'money'}
        ] 
    }
    let schema_negocio = {
        title: 'Ingreso Negocio', 
        fields: [
            {id: 'negocio', required: 'si', description: 'Nombre del negocio', type:'text'},
            {id: 'objeto', required: 'si', description: 'A que se dedica el negocio', type:'text'},
            {id: 'direccion_negocio', required: 'si', description: 'Direccion del negocio', type: 'text'},
            {id: 'telefono_negocio', required: 'si',  description: 'Telefono del negocio', type: 'text', 
                validations:{"regex_change": "^[0-9]", "regex_blur":"^[0-9]{8}$", "fail_msg": 'Telefono no valido, solo sé permite numeros de 8 digitos'}
            },
            {id: 'ingreso_negocio', required: 'si', description: 'Total de ingresos mensuales', type: 'money'}
        ] 
    }
    let schema_otros = {
        title: 'Ingreso Negocio', 
        fields: [
            {id: 'ingreso_remesas', required: 'no', description: 'Ingreso mensual por remesas familiares', type:'money'},
            {id: 'ingreso_jubilacion', required: 'no', description: 'Ingreso mensual por jubilación o pensión', type:'money'},
            {id: 'ingreso_servicios', required: 'no', description: 'Ingreso mensual por servicios profesionales', type: 'money'},
            {id: 'ingreso_alquiler', required: 'no',  description: 'Ingreso mensual por alquiler o rentas', type: 'money'},
            
        ] 
    }
    let values_personal = useState({});
    let values_laboral = useState({});
    let values_negocio = useState({});
    let values_otros = useState({});
    
    let show_laboral = useState(false);
    let show_negocio = useState(false);
    let show_otros = useState(false);
    let show_next = useState(false);
    let guardar_personal = ()=>{
        let div_datos_financieros = document.getElementById("datos_financieros");
        div_datos_financieros.focus();
        div_datos_financieros.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    let guardar_laboral = ()=>{

    }
    let guardar_negocio = ()=>{

    }
    let guardar_otros = ()=>{

    }
    return (
        <>
        <GCard title="Datos Personales">
            <GForm scheme={schema_personal} values={values_personal} cols={1} txt_send='Siguiente' onSubmit={guardar_personal} />
        </GCard>
        <GCard title="Datos Financieros" className="datos_financieros" id="datos_financieros" tabindex={0}>
            <p>Que tipo de ingresos posee:</p>
            <div className="button_container">
                <div className="income_button" onClick={()=>{show_laboral[1](true)}}><icon className="material-icons-outlined icon">business</icon><label>Salario</label></div>
                <div className="income_button" onClick={()=>{show_negocio[1](true)}}><icon className="material-icons-outlined icon">store</icon><label>Negocio propio</label></div>
                <div className="income_button" onClick={()=>{show_otros[1](true)}}><icon className="material-icons-outlined icon">paid</icon><label>Otros</label></div>
            </div>

            {
                show_laboral[0] &&
                <GModal show={show_laboral} title={`Ingreso asalariado`}>
                    <GForm scheme={schema_laboral} values={values_laboral} cols={1} txt_send='Guardar' onSubmit={guardar_laboral}/>
                </GModal >
            }
            {
                show_negocio[0] &&
                <GModal show={show_negocio} title={`Ingreso por negocio`}>
                    <GForm scheme={schema_negocio} values={values_negocio} cols={1} txt_send='Guardar' onSubmit={guardar_negocio}/>
                </GModal>
            }
            {
                show_otros[0] &&
                <GModal show={show_otros} title={`Otros ingresos`}>
                    <GForm scheme={schema_otros} values={values_otros} cols={1} txt_send='Guardar' onSubmit={guardar_otros}/>
                </GModal>
            }
            <div>
                <div className="button button_guardar_actualizacion">Guardar actualizacion</div>
            </div>
        </GCard>
        </>
    )
}