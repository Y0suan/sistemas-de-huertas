import Layout from "@/components/Layout";
import { useEffect, useState } from "react";
import axios from "axios";
import { withSwal } from 'react-sweetalert2';

function Semillas({ swal }) {
  const [editedSemilla, setEditedSemilla] = useState(null);
  const [name, setName] = useState('');
  const [parentCategory, setParentCategory] = useState('');
  const [semillas, setSemillas] = useState([]);
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    fetchSemillas();
  }, []);

  function fetchSemillas() {
    axios.get('/api/semillas').then(result => {
      setSemillas(result.data);
    });
  }

  async function saveSemilla(ev) {
    ev.preventDefault();
    const data = {
      name,
      parentCategory,
      properties: properties.map(p => ({
        name: p.name,
        values: p.values.split(','),
      })),
    };
    if (editedSemilla) {
      data._id = editedSemilla._id;
      await axios.put('/api/semillas', data);
      setEditedSemilla(null);
    } else {
      await axios.post('/api/semillas', data);
    }
    setName('');
    setParentCategory('');
    setProperties([]);
    fetchSemillas();
  }

  function editSemilla(semilla) {
    setEditedSemilla(semilla);
    setName(semilla.name);
    setParentCategory(semilla.parent?._id);
    setProperties(
      semilla.properties.map(({ name, values }) => ({
        name,
        values: values.join(','),
      }))
    );
  }

  function deleteSemilla(semilla) {
    swal.fire({
      title: '¿Estás seguro?',
      text: `¿Quieres borrar la semilla ${semilla.name}?`,
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Sí, Eliminar',
      confirmButtonColor: '#d55',
      reverseButtons: true,
    }).then(async result => {
      if (result.isConfirmed) {
        const { _id } = semilla;
        await axios.delete('/api/semillas?_id=' + _id);
        fetchSemillas();
      }
    });
  }

  function addProperty() {
    setProperties(prev => {
      return [...prev, { name: '', values: '' }];
    });
  }

  function handlePropertyNameChange(index, property, newName) {
    setProperties(prev => {
      const properties = [...prev];
      properties[index].name = newName;
      return properties;
    });
  }

  function handlePropertyValueChange(index, property, newValues) {
    setProperties(prev => {
      const properties = [...prev];
      properties[index].values = newValues;
      return properties;
    });
  }

  function removeProperty(indexToRemove) {
    setProperties(prev => {
      return [...prev].filter((p, pIndex) => {
        return pIndex !== indexToRemove;
      });
    });
  }

  return (
    <Layout>
      <h1>Semillas</h1>
      <label>
        {editedSemilla
          ? `Editar Una Semilla: ${editedSemilla.name}`
          : 'Agregar una Semilla'
        }
      </label>
      <form onSubmit={saveSemilla}>
        <div className="flex gap-1">
          <input
            type="text"
            placeholder={'Nombre de la Semilla'}
            onChange={ev => setName(ev.target.value)}
            value={name}
          ></input>
          <select
            onChange={ev => setParentCategory(ev.target.value)}
            value={parentCategory}
          >
            <option value=''>Elige una Categoría</option>
            {semillas.length > 0 && semillas.map(semilla => (
              <option key={semilla._id} value={semilla._id}>{semilla.name}</option>
            ))}
          </select>
        </div>
        <div className="mb-2">
          <label className="block">Información adicional de la Semilla</label>
          <button onClick={addProperty}
            type="button"
            className="btn-default text-sm mb-2">
            Agregar Más Información
          </button>
          {properties.length > 0 && properties.map((property, index) => (
            <div className="flex gap-1 mb-2"
              key={index}
            >
              <input type="text"
                className="mb-0"
                value={property.name}
                onChange={ev => handlePropertyNameChange(index, property, ev.target.value)}
                placeholder="Nombre de la propiedad (ejemplo: DNI)" />
              <input type="text"
                className="mb-0"
                onChange={ev => handlePropertyValueChange(index, property, ev.target.value)}
                value={property.values}
                placeholder="Valores" />

              <button
                onClick={() => removeProperty(index)}
                type="button"
                className="btn-default">
                Eliminar
              </button>
            </div>
          ))}
        </div>
        <div className="flex gap-1">
          {editedSemilla && (
            <button
              type="button"
              className="btn-default"
              onClick={() => {
                setEditedSemilla(null);
                setName('');
                setParentCategory('');
                setProperties([]);
              }}
            >
              Cancelar
            </button>
          )}
          <button
            type='submit'
            className="btn-primary py-1">
            Guardar
          </button>
        </div>
      </form>
      {!editedSemilla && (
        <table className="basic mt-4">
          <thead>
            <tr>
              <td>Nombre de la Semilla</td>
              <td>Categoría</td>
              <td></td>
            </tr>
          </thead>
          <tbody>
            {semillas.length > 0 && semillas.map(semilla => (
              <tr key={semilla._id}>
                <td>{semilla.name}</td>
                <td>{semilla?.parent?.name}</td>
                <td className="flex">
                  <button
                    onClick={() => editSemilla(semilla)}
                    className="btn-default mr-1 shadow-sm flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                    </svg>
                    Editar</button>
                  <button
                    onClick={() => deleteSemilla(semilla)}
                    className="btn-red"
                  >Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

    </Layout>
  );
}

export default withSwal(({ swal }, ref) => (
  <Semillas swal={swal} />
));
