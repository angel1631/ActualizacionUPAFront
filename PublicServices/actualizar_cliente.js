import { GModal } from "../../Core/components/GModal";
import { useState } from "react";
import { GCard } from "../../Core/components/GCard";
import { GForm } from "../../Core/components/GForm";
import { validate_form } from "../../Core/scripts/form";
import { errorAlert, successAlert } from "../../Core/scripts/alerts";
import { GList } from "../../Core/components/GList";
import { communication } from "../../Core/scripts/communication";

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
            {id: 'cif', required: 'si', description:'Número de asociado', type:'number'},
            {id: 'nombre', required: 'si', description: 'Nombre completo', type:'text'},
            {id: 'dpi', required: 'si', description: 'Número de dpi', type:'dpi'},
            {id: 'direccion', required: 'si', description: 'Dirección de domicilio', type:'text'},
            {id: 'celular', required: 'si', description: 'Número de celular', type:'text', 
                validations:{"regex_change": "[^0-9]", "regex_blur":"^[0-9]{8}$", "fail_msg": 'Telefono no valido, solo sé permite numeros de 8 digitos'}
            },
            {id: 'telefono', required: 'no', description: 'Número de teléfono domiciliar', type:'text',
                validations:{"regex_change": "[^0-9]", "regex_blur":"^[0-9]{8}$", "fail_msg": 'Telefono no valido, solo sé permite numeros de 8 digitos'}
            },
            {id: 'email', required: 'si', description: 'Correo electrónico', type:'email'},
            {id: 'front_dpi_file', required: 'si', description: 'Imagen frontal del DPI', type: 'file'},
            {id: 'reverse_dpi_file', required: 'si', description: 'Imagen reverso del DPI', type: 'file'}

        ]
    }
    let schema_laboral = {
        title: 'Ingreso Laboral', 
        fields: [
            {id: 'name', required: 'si', description: 'Nombre de la empresa donde labora', type:'text'},
            {id: 'position', required: 'si', description: 'Puesto que ocupa en la empresa', type:'text'},
            {id: 'address', required: 'si', description: 'Dirección de la empresa', type: 'text'},
            {id: 'phone', required: 'si',  description: 'Teléfono de la empresa', type: 'text',
                validations:{"regex_change": "[^0-9]", "regex_blur":"^[0-9]{8}$", "fail_msg": 'Telefono no valido, solo sé permite numeros de 8 digitos'}
            },
            {id: 'amount', required: 'si', description: 'Total de ingresos mensuales', type: 'money'}
        ] 
    }
    let schema_negocio = {
        title: 'Ingreso Negocio', 
        fields: [
            {id: 'name', required: 'si', description: 'Nombre del negocio', type:'text'},
            {id: 'object', required: 'si', description: 'Objeto del negocio', type:'text'},
            {id: 'address', required: 'si', description: 'Dirección del negocio', type: 'text'},
            {id: 'phone', required: 'si',  description: 'Teléfono del negocio', type: 'text', 
                validations:{"regex_change": "[^0-9]", "regex_blur":"^[0-9]{8}$", "fail_msg": 'Telefono no valido, solo sé permite numeros de 8 digitos'}
            },
            {id: 'amount', required: 'si', description: 'Total de ingresos mensuales', type: 'money'}
        ] 
    }
    let schema_otros = {
        title: 'Otros tipos de ingreso', 
        fields: [
            {id: 'remesa', required: 'no', description: 'Ingreso mensual por remesas familiares', type:'money'},
            {id: 'jubilacion', required: 'no', description: 'Ingreso mensual por jubilación o pensión', type:'money'},
            {id: 'servicios', required: 'no', description: 'Ingreso mensual por servicios profesionales', type: 'money'},
            {id: 'renta', required: 'no',  description: 'Ingreso mensual por alquiler o rentas', type: 'money'},
            
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
        try{
            console.log("++++++++laboral", values_laboral[0])
            validate_form(values_laboral[0], schema_laboral.fields);
            show_laboral[1](false);
        }catch(err){
            errorAlert(err);
        }
    }
    let guardar_negocio = ()=>{
        try{
            validate_form(values_negocio[0], schema_negocio.fields);
            show_negocio[1](false);
        }catch(err){
            errorAlert(err);
        }
    }
    let guardar_otros = ()=>{
        try{
            validate_form(values_otros[0], schema_otros.fields);
            show_otros[1](false);
        }catch(err){
            errorAlert(err);
        }
    }
    let guardar_actualizacion = ()=>{
        try{
            if(!values_personal) throw `Se debe de llenar el formulario con los datos personales`
            if(!values_negocio[0] && !values_laboral[0] && !values_otros[0]) throw `Necesita agregar por lo menos una fuente de ingresos`;
            let data = {personal: values_personal[0], laboral: values_laboral[0], negocio: values_negocio[0], otros: values_otros[0]}    
            communication({url:"/api/ActualizacionUPA/Services/create_folder_customer", data});
            successAlert("Todo Ok");
        }catch(err){
            errorAlert(err);
        }
        
    }
    return (
        <>
        <GCard title="Datos Personales">
            <GForm scheme={schema_personal} values={values_personal} cols={1} txt_send='Siguiente' onSubmit={guardar_personal} />
        </GCard>
        <GCard title="Datos Financieros" className="datos_financieros" id="datos_financieros" tabindex={0}>
            <p>Que tipo de ingresos posee:</p>
            <div className="income_button_container">
                <div className="income_button" onClick={()=>{show_laboral[1](true)}}><icon className="material-icons-outlined icon">business</icon><label>Salario</label></div>
                <div className="income_button" onClick={()=>{show_negocio[1](true)}}><icon className="material-icons-outlined icon">store</icon><label>Negocio propio</label></div>
                <div className="income_button" onClick={()=>{show_otros[1](true)}}><icon className="material-icons-outlined icon">paid</icon><label>Otros</label></div>
            </div>
            <div id="ingresos_reportados">
                {
                    values_laboral[0].name &&
                    <div id="ingreso_laboral">
                        <h2>Ingreso por Salario</h2>
                        <div className="laboral_data">
                            <GList data={[values_laboral[0]]} fields_display={[
                                {col: 'name', show: 'Nombre empresa'},
                                {col: 'position', show: 'Puesto'},
                                {col: 'address', show: 'Direccion'},
                                {col: 'phone', show: 'Telefono'},
                                {col: 'amount', show: 'Monto'}]}/>
                        </div> 
                    </div>
                }
                {
                    values_negocio[0].name &&
                    <div id="ingreso_negocio">
                        <h2>Ingresos por negocios</h2>
                        <div className="laboral_data">
                            <GList data={[values_negocio[0]]} fields_display={[
                                {col:'name', show: "Nombre negocio"},
                                {col: 'object', show: 'Objeto'}, 
                                {col: 'address', show: 'Direccion'},
                                {col: 'phone', show: 'Telefono'},
                                {col: 'amount', show: 'Monto'}]}/>
                        </div> 
                    </div>
                }
                {
                    values_otros[0].name &&
                    <div id="ingreso_otro">
                        <h2>Otros Ingresos</h2>
                        <div className="laboral_data">
                            <GList data={[values_otros[0]]} fields_display={[
                                {col: 'remesa', show: 'Remesas'},
                                {col: 'jubilacion', show: 'Jubiliacion'},
                                {col: 'renta', show: 'Rentas y alquileres'},
                                {col: 'servicios', show: "Servicios"}]}/>
                        </div> 
                    </div>
                }
            </div>
            {
                show_laboral[0] &&
                <GModal show={show_laboral} title={`Ingreso asalariado`}>
                    <GForm scheme={schema_laboral} values={values_laboral} values_base={values_laboral[0]} cols={1} txt_send='Guardar' onSubmit={guardar_laboral}/>
                </GModal >
            }
            {
                show_negocio[0] &&
                <GModal show={show_negocio} title={`Ingreso por negocio`}>
                    <GForm scheme={schema_negocio} values={values_negocio} values_base={values_negocio[0]} cols={1} txt_send='Guardar' onSubmit={guardar_negocio}/>
                </GModal>
            }
            {
                show_otros[0] &&
                <GModal show={show_otros} title={`Otros ingresos`}>
                    <GForm scheme={schema_otros} values={values_otros} values_base={values_otros[0]} cols={1} txt_send='Guardar' onSubmit={guardar_otros}/>
                </GModal>
            }
            <div>
                <div className="button button_guardar_actualizacion" onClick={guardar_actualizacion}>Guardar actualizacion</div>
            </div>
        </GCard>
        </>
    )
}