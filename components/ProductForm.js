import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Spinner from "./Spinner";
import { ReactSortable } from "react-sortablejs";

export default function ProductForm({
  _id,
  referente: assignedReferente,
  fecha: existingFecha,
  ubicacion: existingUbicacion,
  ancho: existingAncho,
  largo: existingLargo,
  plantines: existingPlantines,
  plantinesCantidad: existingPlantinesCantidad,
  semillas: existingSemillas,
  semillasCantidad: existingSemillasCantidad,
  herramientas: existingHerramientas,
  images: existingImages,
}) {
  const [referente, setReferente] = useState(assignedReferente || "");
  const [fecha, setFecha] = useState(existingFecha || "");
  const [ubicacion, setUbicacion] = useState(existingUbicacion || "");
  const [ancho, setAncho] = useState(existingAncho || "");
  const [largo, setLargo] = useState(existingLargo || "");
  const [plantines, setPlantines] = useState(existingPlantines || "");
  const [plantinesCantidad, setPlantinesCantidad] = useState(
    existingPlantinesCantidad || ""
  );
  const [semillas, setSemillas] = useState(existingSemillas || "");
  const [semillasCantidad, setSemillasCantidad] = useState(
    existingSemillasCantidad || ""
  );
  const [herramientas, setHerramientas] = useState(existingHerramientas || "");
  const [images, setImages] = useState(existingImages || []);

  const [goToProducts, setGoToProducts] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    axios.get("/api/referentes").then((result) => {
      setReferente(result.data);
    });
  }, []);

  useEffect(() => {
    axios.get("/api/semillas").then((result) => {
      setSemillas(result.data);
    });
  }, []);

  useEffect(() => {
    axios.get("/api/plantines").then((result) => {
      setPlantines(result.data);
    });
  }, []);

  async function saveProduct(ev) {
    ev.preventDefault();
    const data = {
      referente,
      fecha,
      ubicacion,
      ancho,
      largo,
      plantines,
      plantinesCantidad,
      semillas,
      semillasCantidad,
      herramientas,
      images,
    };
    if (_id) {
      // actualizar
      await axios.put("/api/huerta", { ...data, _id });
    } else {
      // crear
      await axios.post("/api/huerta", data);
    }
    setGoToProducts(true);
  }

  if (goToProducts) {
    router.push("/products");
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

  return (
    <form onSubmit={saveProduct}>
      <div className="flexCont">
      <div>
  <label>Elige un Referente</label>
  <select
    value={referente}
    onChange={(ev) => setReferente(ev.target.value)}
  >
    <option value="">Elige un Referente</option>
    {Array.isArray(referente) && referente.length > 0
      ? referente.map((c) => (
          <option value={c._id} key={c._id}>
            {c.name}
          </option>
        ))
      : null}
  </select>
</div>
        <div>
          <label>Fecha</label>
          <input
            type="date"
            value={fecha}
            onChange={(ev) => setFecha(ev.target.value)}
          />
        </div>
      </div>

      <label>Ubicacion</label>
      <input
        type="text"
        value={ubicacion}
        onChange={(ev) => setUbicacion(ev.target.value)}
      />
      <h3>Dimensiones:</h3>
      <div className="flexCont">
        <div>
          <label>Ancho</label>
          <input
            type="number"
            value={ancho}
            onChange={(ev) => setAncho(ev.target.value)}
          />
        </div>
        <div>
          <label>Largo</label>
          <input
            type="number"
            value={largo}
            onChange={(ev) => setLargo(ev.target.value)}
          />
        </div>
      </div>

      <h3>Insumos entregados:</h3>
      <div className="flexCont">
        <div>
          <label>Elige Plantines</label>
          <select
            value={plantines}
            onChange={(ev) => setPlantines(ev.target.value)}
          >
            <option value="">Elige unos Plantines</option>
            {Array.isArray(plantines) &&
              plantines.length > 0 &&
              plantines.map((p) => (
                <option value={p._id} key={p._id}>
                  {p.name}
                </option>
              ))}
          </select>
        </div>
        <div>
          <label>Cantidad</label>
          <input
            type="number"
            value={plantinesCantidad}
            onChange={(ev) => setPlantinesCantidad(ev.target.value)}
          />
        </div>
      </div>
      <div className="flexCont">
      <div>
  <label>Elige Semillas</label>
  <select
    value={semillas}
    onChange={(ev) => setSemillas(ev.target.value)}
  >
    <option value="">Elige unas Semillas</option>
    {Array.isArray(semillas) && semillas.length > 0
      ? semillas.map((s) => (
          <option value={s._id} key={s._id}>
            {s.name}
          </option>
        ))
      : null}
  </select>
</div>
        <div>
          <label>Cantidad</label>
          <input
            type="number"
            value={semillasCantidad}
            onChange={(ev) => setSemillasCantidad(ev.target.value)}
          />
        </div>
      </div>
      <label>Herramientas</label>
      <input
        type="text"
        value={herramientas}
        onChange={(ev) => setHerramientas(ev.target.value)}
      />

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
        <label className="w-24 h-24 cursor-pointer text-blue text-center flex items-center justify-center text-sm gap-1 text-gray-500 rounded-sm bg-white shadow-md border border-gray-200 ">
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

      <button type="submit" className="btn-primary">
        Guardar
      </button>
    </form>
  );
}
