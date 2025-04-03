import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

const ContactForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();

  const onSubmit = (data) => {
    navigate('/encuesta', { 
      state: { 
        contactData: {
          nombre: data.nombre,
          email: data.email,
          empresa: data.empresa
        }
      } 
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-4 shadow-lg p-5">
      <div className="text-center mb-5">
        <h2 className="display-5 text-dark mb-3">
          <span className="text-gradient-primary">Solicita tu</span>
          <span className="text-gradient-secondary"> Pre-Diagnóstico</span>
        </h2>
        <div className="divider bg-primary mx-auto my-4"></div>
      </div>

      <div className="row g-4">
        <div className="col-md-6">
          <div className="form-floating">
            <input
              {...register("nombre", { required: true })}
              className={`form-control ${errors.nombre ? 'is-invalid' : ''}`}
              placeholder="Nombre completo"
            />
            <label>Nombre completo *</label>
            {errors.nombre && <div className="invalid-feedback">Campo requerido</div>}
          </div>
        </div>

        <div className="col-md-6">
          <div className="form-floating">
            <input
              {...register("empresa", { required: true })}
              className={`form-control ${errors.empresa ? 'is-invalid' : ''}`}
              placeholder="Empresa"
            />
            <label>Empresa *</label>
            {errors.empresa && <div className="invalid-feedback">Campo requerido</div>}
          </div>
        </div>
        
        <div className="col-md-6">
          <div className="form-floating">
            <input
              {...register("telefono", { required: true })}
              className={`form-control ${errors.telefono ? 'is-invalid' : ''}`}
              placeholder="Teléfono"
            />
            <label>Teléfono *</label>
            {errors.telefono && <div className="invalid-feedback">Requerido</div>}
          </div>
        </div>

        <div className="col-12">
          <div className="form-floating">
            <input
              {...register("email", {
                required: true,
                pattern: /^\S+@\S+$/i
              })}
              className={`form-control ${errors.email ? 'is-invalid' : ''}`}
              placeholder="Correo electrónico"
            />
            <label>Correo electrónico *</label>
            {errors.email && <div className="invalid-feedback">Email inválido</div>}
          </div>
        </div>

        <div className="col-12 text-center">
          <button 
            type="submit"
            className="btn btn-primary btn-lg px-5 py-3 rounded-pill shadow-hover"
          >
            Obtener diagnóstico
            <i className="fas fa-arrow-right ms-2"></i>
          </button>
        </div>
      </div>

      <div className="text-center mt-4">
        <p className="small text-muted">
          <i className="text-primary mb-3 me-2">
          Tus datos están protegidos
          </i>
        </p>
      </div>
    </form>
  );
};

export default ContactForm;