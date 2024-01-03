import Layout from "@/components/Layout";
import {useEffect, useState} from "react";
import axios from "axios";
import {withSwal} from "react-sweetalert2";
import Spinner from "@/components/Spinner";
import {prettyDate} from "@/lib/date";

function AdminsPage({swal}) {
  const [email,setEmail] = useState('');
  const [adminEmails,setAdminEmails] = useState([]);
  const [isLoading,setIsLoading] = useState(false);
  function addAdmin(ev){
    ev.preventDefault();
    axios.post('/api/admins', {email}).then(res => {
      console.log(res.data);
      swal.fire({
        title: '¡Administrador creado!',
        icon: 'éxito',
      });
      setEmail('');
      loadAdmins();
    }).catch(err => {
      swal.fire({
        title: 'Error!',
        text: err.response.data.message,
        icon: 'error',
      });
    });
  }
  function deleteAdmin(_id, email) {
    swal.fire({
      title: 'Estas seguro',
      text: `¿Quieres eliminar al administrador? ${email}?`,
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonText: '¡Sí, eliminar!',
      confirmButtonColor: '#d55',
      reverseButtons: true,
    }).then(async result => {
      if (result.isConfirmed) {
        axios.delete('/api/admins?_id='+_id).then(() => {
          swal.fire({
            title: 'Administrador eliminado!',
            icon: 'éxito',
          });
          loadAdmins();
        });
      }
    });
  }
  function loadAdmins() {
    setIsLoading(true);
    axios.get('/api/admins').then(res => {
      setAdminEmails(res.data);
      setIsLoading(false);
    });
  }
  useEffect(() => {
    loadAdmins();
  }, []);
  return (
    <Layout>
      <h1>Admins</h1>
      <h2>Agregar nuevo administrador</h2>
      <form onSubmit={addAdmin}>
        <div className="flex gap-2">
          <input
            type="text"
            className="mb-0  rounded-md"
            value={email}
            onChange={ev => setEmail(ev.target.value)}
            placeholder="google email"/>
          <button
            type="submit"
            className="btn-primary">
            Agregar administrador
          </button>
        </div>
      </form>

      <h2 class='mt-4' >Administradores existentes</h2>
      <table class="basic">
        <thead>
          <tr>
            <th class="text-left p-2 ">Correo electrónico del administrador</th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {isLoading && (
            <tr>
              <td colSpan={2}>
                <div className="py-4">
                  <Spinner fullWidth={true} />
                </div>
              </td>
            </tr>
          )}
          {adminEmails.length > 0 && adminEmails.map(adminEmail => (
            <tr key={adminEmail.email}>
              <td>{adminEmail.email}</td>
              <td>
                {adminEmail.createdAt && prettyDate(adminEmail.createdAt)}
              </td>
              <td>
                <button
                  onClick={() => deleteAdmin(adminEmail._id, adminEmail.email)} className="btn-red rounded-md">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                       <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                   </svg>
                  </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Layout>
  );
}

export default withSwal(({swal}) => (
  <AdminsPage swal={swal} />
));