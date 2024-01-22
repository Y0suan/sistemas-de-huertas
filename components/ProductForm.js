import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Spinner from "./Spinner";
import { ReactSortable } from "react-sortablejs";

export default function ProductForm({
  _id,
  referente: assignedReferente,
  dni: existingDni,
  calle: existingCalle,
  km: existingKm,
  barrio: existingBarrio,
  fecha: existingFecha,
  superficie: existingSuperficie,
  entregado: existingEntregado,
  images: existingImages,
  properties: existingProperties,
}) {
  const [referente, setReferente] = useState(assignedReferente || "");
  const [dni, setDni] = useState(existingDni || "");
  const [calle, setCalle] = useState(existingCalle || "");
  const [km, setKm] = useState(existingKm || "");
  const [barrio, setBarrio] = useState(existingBarrio || "");
  const [fecha, setFecha] = useState(existingFecha || "");
  const [superficie, setSuperficie] = useState(existingSuperficie || "");
  const [entregado, setEntregado] = useState(existingEntregado || "");
  const [images, setImages] = useState(existingImages || []);
  const [properties, setProperties] = useState(existingProperties || []);

  const [goToProducts, setGoToProducts] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const router = useRouter();


  useEffect(() => {
    if (goToProducts) {
      // Redirige a la página "product" después de guardar el producto
      router.push("/products");
    }
  }, [goToProducts, router]);


  async function saveProduct(ev) {
    ev.preventDefault();
    const data = {
      referente,
      dni,
      calle,
      km,
      barrio,
      fecha,
      superficie,
      entregado,
      images,
      properties,
    };
    if (_id) {
      setGoToProducts(true);
    }
    try {
      const response = await axios.post("/api/huerta", data);
      console.log("Respuesta del servidor:", response.data);
      // Aquí puedes manejar la respuesta del servidor según tus necesidades
    } catch (error) {
      console.error("Error al guardar el producto:", error);
    }
  }

  async function uploadImages(ev) {
    const files = ev.target?.files;
    if (files?.length > 0) {
      setIsUploading(true);
      const formData = new FormData();

      for (const file of files) {
        formData.append("file", file);
      }

      try {
        const response = await axios.post("/api/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        const links = response.data.links;
        setImages((oldImages) => [...oldImages, ...links]);
      } catch (error) {
        console.error("Error al subir las imágenes:", error);
      }

      setIsUploading(false);
    }
  }

  function updateImagesOrder(images) {
    setImages(images);
  }

  function addProperty() {
    setProperties((prev) => {
      return [...prev, { name: '', values: '' }];
    });
  }

  function handlePropertyNameChange(index, property, value) {
    setProperties((prevProperties) => {
      const updatedProperties = [...prevProperties];
      updatedProperties[index] = { ...updatedProperties[index], name: value };
      return updatedProperties;
    });
  }

  function handlePropertyValueChange(index, property, value) {
    setProperties((prevProperties) => {
      const updatedProperties = [...prevProperties];
      updatedProperties[index] = { ...updatedProperties[index], values: value };
      return updatedProperties;
    });
  }

  function removeProperty(index) {
    setProperties((prevProperties) => {
      const updatedProperties = [...prevProperties];
      updatedProperties.splice(index, 1);
      return updatedProperties;
    });
  }

  return (
    <form onSubmit={saveProduct}>

<div className="flex flex-wrap gap-2 " >

<div className=" w-72 " >
<label>Agrega Un Referente</label>
<input
  type="text"
  value={referente}
  onChange={(ev) => setReferente(ev.target.value)}
/>
</div>

<div className=" w-72 " >
<label>DNI</label>
<input
  type="text"
  value={dni}
  onChange={(ev) => setDni(ev.target.value)}
/>
</div>

<div className=" w-72 " >
<label>Calle</label>
<input
  type="text"
  value={calle}
  onChange={(ev) => setCalle(ev.target.value)}
/>
</div>
<div className=" w-72 " >
<label>Km</label>
<input
  type="text"
  value={km}
  onChange={(ev) => setKm(ev.target.value)}
/>
</div>
<div className=" w-72 " >
<label>Barrio</label>
<input
  type="text"
  value={barrio}
  onChange={(ev) => setBarrio(ev.target.value)}
  />
  </div>

  
  <div className=" w-72 " >

    <label>Fecha</label>
    <input
      type="date"
      value={fecha}
      onChange={(ev) => setFecha(ev.target.value)}
    />
            </div>


<div className=" w-72 " >

<label>Superficie </label>
<input
  type="text"
  value={superficie}
  onChange={(ev) => setSuperficie(ev.target.value)}
/>

</div>
<div className=" w-72 " >

<label>Entregado</label>
<input
type="text"
value={entregado}
onChange={(ev) => setEntregado(ev.target.value)}
/>

</div>

</div>

      <label>Fotos</label>
      <div className="mb-2 flex flex-wrap gap-1">
        <ReactSortable
          list={images}
          className="flex flex-wrap gap-1"
          setList={updateImagesOrder}
        >
          {!!images?.length &&
            images.map((link) => (
              <div
                key={link}
                className="h-24 bg-white shadow-sm rounded-sm border border-gray-200"
              >
                <img
                  src={link}
                  alt="Descripción de la imagen"
                  className="rounded-sm"
                />
              </div>
            ))}
        </ReactSortable>

        {isUploading && (
          <div className="h-24 flex items-center">
            <Spinner />
          </div>
        )}
        <label className="w-24 h-24 cursor-pointer text-blue text-center flex items-center justify-center text-sm gap-1 text-gray-500 rounded-sm bg-white shadow-md border border-gray-200">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
            />
          </svg>
          <div>Subir</div>
          <input type="file" onChange={uploadImages} className="hidden" />
        </label>
      </div>

      <div className="mb-2">
        <label className="block">Informacion adicional del Referente</label>
        <button
          onClick={addProperty}
          type="button"
          className="btn-default text-sm mb-2"
        >
          Agregar Mas Informacion
        </button>
        {properties.length > 0 &&
          properties.map((property, index) => (
            <div
              className="flex gap-1 mb-2"
              key={index} // Cambiado de property._id a index
            >
              <input
                type="text"
                className="mb-0"
                value={property.name}
                onChange={(ev) =>
                  handlePropertyNameChange(index, property, ev.target.value)
                }
                placeholder="nombre de propiedad (ejemplo: DNI)"
              />
              <input
                type="text"
                className="mb-0"
                onChange={(ev) =>
                  handlePropertyValueChange(index, property, ev.target.value)
                }
                value={property.values}
                placeholder="valores"
              />

              <button
                onClick={() => removeProperty(index)}
                type="button"
                className="btn-default"
              >
                Eliminar
              </button>
            </div>
          ))}
      </div>

      <button type="submit" className="btn-primary">
        Guardar
      </button>
    </form>
  );
}


