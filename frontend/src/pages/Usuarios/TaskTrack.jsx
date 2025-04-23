import React from "react";
import { format, differenceInDays } from "date-fns";
import "bootstrap/dist/css/bootstrap.min.css";
import '@fortawesome/fontawesome-free/css/all.min.css';
import { CheckCircle, Clock, XCircle } from 'react-feather';


// Funciones auxiliares
const normalizarFecha = (fecha) => {
  if (typeof fecha === "string") {
    const [year, month, day] = fecha.split("T")[0].split("-");
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  }
  const f = new Date(fecha);
  return new Date(f.getFullYear(), f.getMonth(), f.getDate());
};

const getFechaEntregaEsperada = (clasificacion) => {
  const fecha = new Date();
  let day = 15;
  if (clasificacion === 'HHH') day = 10;
  else if (clasificacion === 'HH') day = 12;
  fecha.setDate(day);
  return normalizarFecha(fecha);
};

const calcularEstatus = (fechaPlaneada, fechaReal) => {
    const fPlaneada = normalizarFecha(fechaPlaneada);
    const fReal = normalizarFecha(fechaReal);
    const diferencia = differenceInDays(fReal, fPlaneada);
  
    if (diferencia <= 0) {
      return {
        
        icon: <CheckCircle color="#28a745" className="me-2" />
      };
    }
  
    if (diferencia <= 3) {
      return {
        
        icon: <Clock color="#ffc107" className="me-2" />
      };
    }
  
    return {
      
      icon: <XCircle color="#dc3545" className="me-2" />
    };
  };
  

// Tareas
const tareas = [
  { id: '1', descripcion: "Entrega de declaraciones", modulo: "Contadores" },
  { id: '2', descripcion: "Revisión de auditoría", modulo: "Supervisores" },
  { id: '3', descripcion: "Informe mensual", modulo: "Entregables" }
];

// Empresas
const empresas = [
  {
    id: 'emp1',
    nombre: 'Empresa Ejemplo S.A de C.V',
    rfc: 'EJE210506ABC',
    industria: 'Consultoría Financiera',
    clasificacion: 'H',
    fechaReal: "2025-04-17",
    tareas: ['1', '2']
  },
  {
    id: 'emp2',
    nombre: 'Grupo Fiscal MX',
    rfc: 'GFM220310XYZ',
    industria: 'Servicios Contables',
    clasificacion: 'HH',
    fechaReal: "2025-04-01",
    tareas: ['3']
  },
  {
    id: 'emp3',
    nombre: 'Despto S.A de C.V',
    rfc: 'DEV220310UYT',
    industria: 'Desarrollo',
    clasificacion: 'HHH',
    fechaReal: "2025-04-12",
    tareas: ['1', '3', '2']
  },
  {
    id: 'emp4',
    nombre: 'Carnes S.A de C.V',
    rfc: 'EPO218786ABC',
    industria: 'Ganaderia',
    clasificacion: 'HH',
    fechaReal: "2025-04-25",
    tareas: ['1', '2','3']
  },
  {
    id: 'emp5',
    nombre: 'Culvivos Hndz',
    rfc: 'CRT8741UJM',
    industria: '',
    clasificacion: 'H',
    fechaReal: "2025-04-19",
    tareas: ['3']
  },
  {
    id: 'emp6',
    nombre: 'Jorge Mendoza',
    rfc: 'JOM8920147A',
    industria: 'Farmaceutica',
    clasificacion: 'HHH',
    fechaReal: "2025-04-09",
    tareas: ['2','3']
  },
];

export default function HezaPlanner() {
  return (
    <div className="container py-5">
        <h1 className="display-7 text-center mb-4">
            <span className="text-gradient-primary">Seguimiento </span>
            <span className="text-gradient-secondary ">por Empresa</span>
        </h1>
       <div className="row">
        {empresas.map((empresa) => {
          const fechaPlaneada = getFechaEntregaEsperada(empresa.clasificacion);
          const tareasRelacionadas = tareas.filter((t) => empresa.tareas.includes(t.id));

          return (
            <div key={empresa.id} className="col-md-6 mb-4 display-7 text-dark ">
              <div className="card h-95 shadow-sm ">
                <div className="card-header bg-lightcard-header bg-primary ">
                  <h5 className="mb-0 text-white">{empresa.nombre}</h5>
                  <small className="text-white">{empresa.industria}</small>
                </div>
                <div className="card-body p-0 no-gap-footer">
                  <table className="table table-bordered mb-0 ">
                    <thead className="table-TT">
                      <tr>
                        <th>Módulo</th>
                        <th>Descripción</th>
                        <th>Fecha Planeada</th>
                        <th>Fecha Real</th>
                        <th>Estatus</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tareasRelacionadas.map((tarea, index) => {
                        const estatus = calcularEstatus(fechaPlaneada, empresa.fechaReal);
                        return (
                          <tr key={index} className="row-TT">
                            <td className=" bg-primary-soft ">{tarea.modulo}</td>
                            <td>{tarea.descripcion}</td>
                            <td>{format(fechaPlaneada, "yyyy-MM-dd")}</td>
                            <td>{format(normalizarFecha(empresa.fechaReal), "yyyy-MM-dd")}</td>
                            <td className="text-center fw-bold">
                                {estatus.icon}
                                <span className="text-primary">{estatus.label}</span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <div className="card-footer text-end text-white footer-TT">
                  RFC : {empresa.rfc}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
