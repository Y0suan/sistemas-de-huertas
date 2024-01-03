import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Spinner from "./Spinner";
import { ReactSortable } from "react-sortablejs";
import Image from "next/image";


export default function ProductForm({
  _id,
  title: existingTitle,
  description: existingDescription,
  whatsapp: existingWhatsapp,
  hubicacion: existingHubicacion,
  fecha: existingFecha,
  // facebook: existingFacebook,
  // instagram: existingInstagram,
  images: existingImages,
  category: assignedCategory,
}) {
  const [title, setTitle] = useState(existingTitle || '');
  const [description, setDescription] = useState(existingDescription || '');
  const [category, setCategory] = useState(assignedCategory || ''); // Asegúrate de que assignedCategory sea un ObjectId válido en lugar de una cadena vacía.


    const [productProperties,setProductProperties] = useState({});
    const [whatsapp,setWhatsapp] = useState(existingWhatsapp || '');
    const [fecha,setFecha] = useState(existingFecha || '');

    
    const [hubicacion,setHubicacion] = useState(existingHubicacion || '');
    // const [facebook,setFacebook] = useState(existingFacebook || '');
    // const [instagram,setInstagram] = useState(existingInstagram || '');
    
    const [images,setImages] = useState(existingImages || []);
    const [goToProducts,setGoToProducts] = useState(false);
    const [isUploading,setIsUploading] = useState(false);
    const [categories,setCategories] = useState([]);
    const router = useRouter();
    useEffect(()=>{
        axios.get('/api/categories').then(result =>{
            setCategories(result.data);
        })
    }, []);
    async function saveProduct(ev){
        ev.preventDefault();
        const data = {
            title,description,whatsapp,images,category,hubicacion,fecha,
            properties:productProperties
        };
        if(_id){
            //update
            await axios.put('/api/products',{...data,_id});
        }else{
            //create
            await axios.post('/api/products', data);
        }
        setGoToProducts(true);
    }
    if (goToProducts){
        router.push('/products');
    }

    async function uploadImages(ev) {
      const files = ev.target?.files;
      if (files?.length > 0) {
        setIsUploading(true);
        const formData = new FormData();
    
        for (const file of files) {
          formData.append('file', file);
        }
    
        try {
          const response = await axios.post('/api/upload', formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });
    
          const links = response.data.links;
          setImages((oldImages) => [...oldImages, ...links]);
        } catch (error) {
          console.error('Error uploading images:', error);
        }
    
        setIsUploading(false);
      }
    }
    

    function updateIMagesOrder (images){
        setImages(images);
    }
    function setProductProp(propName,value){
        setProductProperties(prev => {
            const newProductProps = {...prev};
            newProductProps[propName] = value;
            return newProductProps;
        });
    }

    const propertiesToFill = [];
    if (categories.length > 0 && category) {
      let catInfo = categories.find(({ _id }) => _id === category);
      if (catInfo) {
        propertiesToFill.push(...catInfo.properties);
        while (catInfo?.parent?.id) {
          const parentCat = categories.find(({ _id }) => _id === catInfo?.parent._id);
          if (parentCat) {
            propertiesToFill.push(...parentCat.properties);
            catInfo = parentCat;
          } else {
            break;
          }
        }
      }
    }
    
    
    return(
            <form onSubmit={saveProduct}>
            
            <label>Nombre de la Publicacion</label>
            <input 
              type='text' 
              placeholder="nombre de la Publicacion"
              value={title}
              onChange={ev => setTitle(ev.target.value)}
            />
            <label>Categoria</label>
            <select 
                value={category} 
                onChange={ev => setCategory(ev.target.value)}
            >
                <option value=''>Elige una categoría</option> {/* Agrega esta opción con un valor vacío */}
                {categories.length > 0 && categories.map(c => (
                    <option value={c._id} key={c._id}>{c.name}</option>
                ))}
            </select>
            {propertiesToFill && propertiesToFill.length > 0 && propertiesToFill.map(p => (
            <div key={p._id} className="flex gap-1">
            <div>{p.name}</div>
            <select
              value={productProperties[p.name]}
              onChange={ev => setProductProp(p.name, ev.target.value)}
            >
              {p.values && p.values.map(v => (
                <option key={v} value={v}>{v}</option>
              ))}
            </select>
          </div>
        ))}


            <label>
                Fotos
            </label>
            <div className= "mb-2 flex flex-wrap gap-1">
                <ReactSortable
                list={images}
                className="flex flex-wrap gap-1"
                setList={updateIMagesOrder}
                >
                {!!images?.length && images.map(link => (
                  <div key={link} className="h-24 bg-white shadow-sm rounded-sm border border-gray-200">
                    <img src={link} alt="Descripción de la imagen" className="rounded-sm" />
                  </div>
                ))}

                </ReactSortable>
                {isUploading && (
                    <div className="h-24 flex items-center">
                        <Spinner/>
                    </div>
                )}
                <label className= " w-24 h-24 cursor-pointer text-blue text-center flex items-center justify-center text-sm gap-1 text-gray-500 rounded-sm bg-white shadow-md border border-gray-200 ">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                </svg>
                <div>
                Subir
                </div>
                <input type="file" onChange={uploadImages} className="hidden"/>
                </label>
            </div>
            <label>Descripcion</label>
            <textarea 
              placeholder="descripcion"
              value={description}
              onChange={ev => setDescription(ev.target.value)}
            />

            <label>Hubicacion</label>
            <input 
            type="text" 
            placeholder="Hubicacion" 
            value={hubicacion}
            onChange={ev => setHubicacion(ev.target.value)}
            />

           <label>Fecha</label>
            <input 
            type="date" 
            placeholder="Fecha" 
            value={fecha}
            onChange={ev => setFecha(ev.target.value)}
            />


            <label>Whatsapp</label>
            <input 
              type="number" 
              placeholder="Whatsapp" 
              value={whatsapp}
              onChange={ev => setWhatsapp(ev.target.value)}
              />
{/* 
              <label>Facebook</label>
              <input 
              type="text" 
              placeholder="Facebook" 
              value={facebook}
              onChange={ev => setFacebook(ev.target.value)}
              />
          
              <label>Instagram</label>
              <input 
              type="text" 
              placeholder="Instagram" 
              value={instagram}
              onChange={ev => setInstagram(ev.target.value)}
              /> */}

            <button 
              type="submit" 
              className="btn-primary">Guardar</button>
              </form>
    )
}