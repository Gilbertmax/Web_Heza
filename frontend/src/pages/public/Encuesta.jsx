import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';

const Encuesta = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentYear = new Date().getFullYear();
  const [showSuccess, setShowSuccess] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: location.state?.contactData || {}
  });

  const onSubmit = (data) => {
    console.log('Datos enviados:', data);
    setShowSuccess(true);
    setTimeout(() => navigate('/'), 3000);
  };

  const SeccionEncuesta = ({ titulo, children }) => (
    <div className="bg-white rounded-4 shadow-sm p-5 mb-5">
      <h3 className="text-gradient-primary mb-4 fw-bold">{titulo}</h3>
      {children}
    </div>
  );

  return (
    <div className="container py-5" style={{ maxWidth: '800px' }}>
      <div className="text-center mb-6">
        <h1 className="display-4 text-dark mb-3">
          <span className="text-gradient-primary">Evaluación de</span>
          <span className="text-gradient-secondary"> Riesgo Fiscal</span>
        </h1>
        <p className="lead text-muted">Análisis completo para tu empresa</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-light rounded-4 p-4">
        <SeccionEncuesta titulo="Información básica">
          <div className="mb-4">
            <input
              {...register("nombre", { required: true })}
              className={`form-control form-control-lg ${errors.nombre ? 'is-invalid' : ''}`}
              placeholder="Nombre completo*"
            />
            {errors.nombre && <div className="invalid-feedback">Campo requerido</div>}
          </div>

          <div className="mb-4">
            <input
              {...register("email", {
                required: true,
                pattern: /^\S+@\S+$/i
              })}
              className={`form-control form-control-lg ${errors.email ? 'is-invalid' : ''}`}
              placeholder="Correo electrónico*"
            />
            {errors.email && <div className="invalid-feedback">Email inválido</div>}
          </div>

          <div>
            <input
              {...register("empresa", { required: true })}
              className={`form-control form-control-lg ${errors.empresa ? 'is-invalid' : ''}`}
              placeholder="Nombre de empresa*"
            />
            {errors.empresa && <div className="invalid-feedback">Campo requerido</div>}
          </div>
        </SeccionEncuesta>

        <SeccionEncuesta titulo="Datos empresariales">
          <div className="mb-4">
            <select
              {...register("trabajadores", { required: true })}
              className="form-control form-control-lg"
            >
              <option value="">Número de trabajadores*</option>
              <option value="1-50">1 a 50</option>
              <option value="51-250">51 a 250</option>
              <option value="250-500">250 a 500</option>
            </select>
          </div>

          <div className="mb-4">
            <select
              {...register("ventas", { required: true })}
              className="form-control form-control-lg"
            >
              <option value="">Ventas en {currentYear - 1}*</option>
              <option value="0-30M">0 - 30 millones</option>
              <option value="30-70M">30 - 70 millones</option>
              <option value="70M+">Más de 70 millones</option>
            </select>
          </div>

          <div>
            <textarea
              {...register("actividad")}
              className="form-control form-control-lg"
              placeholder="Actividad principal de la empresa"
              rows="3"
            />
          </div>
        </SeccionEncuesta>

        <SeccionEncuesta titulo="Prácticas fiscales">
          <div className="mb-4">
            <label className="form-label">
              ¿Utiliza la contabilidad para la toma de decisiones?*
              <select
                {...register("uso_contabilidad", { required: true })}
                className="form-control form-control-lg mt-2"
              >
                <option value="">Seleccione una opción</option>
                {[...Array(11).keys()].map(n => (
                  <option key={n} value={n}>{n} - {n === 0 ? 'Sin duda no' : n === 10 ? 'Definitivamente sí' : ''}</option>
                ))}
              </select>
            </label>
          </div>

          <div className="row g-4">
            {[
              'manual_cumplimiento',
              'verificacion_mensual',
              'revision_declaraciones',
              'consistencia_sat',
              'carta_responsiva'
            ].map((field, index) => (
              <div key={field} className="col-md-6">
                <label className="form-label">
                  {[
                    "¿Cuenta con manual de cumplimiento fiscal?*",
                    "¿Verifica obligaciones fiscales mensualmente?*",
                    "¿Revisa cifras enviadas al SAT?*",
                    "¿La información coincide con los registros del SAT?*",
                    "¿Tiene carta responsiva para firmas electrónicas?*"
                  ][index]}
                  <select
                    {...register(field, { required: true })}
                    className="form-control form-control-lg mt-2"
                  >
                    <option value="">Seleccione...</option>
                    <option value="si">Sí</option>
                    <option value="no">No</option>
                  </select>
                </label>
              </div>
            ))}
          </div>
        </SeccionEncuesta>

        <div className="text-center mt-5">
          <button
            type="submit"
            className="btn btn-primary btn-lg px-5 py-3 rounded-pill shadow-hover"
          >
            Enviar evaluación
            <i className="fas fa-arrow-right ms-2"></i>
          </button>
        </div>
      </form>

      {showSuccess && (
        <div className="success-overlay bg-dark bg-opacity-75">
          <div className="bg-white rounded-4 p-5 text-center m-4">
            <h3 className="text-success mb-3">
              <i className="fas fa-check-circle me-2"></i>
              ¡Evaluación enviada con éxito!
            </h3>
            <p className="text-muted">
              Uno de nuestros asesores se pondrá en contacto contigo en breve.
            </p>
            <Link to="/" className="btn btn-outline-primary">
              Volver al inicio
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Encuesta;