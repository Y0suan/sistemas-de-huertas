import Link from 'next/link';
import React from 'react';

const MediumCard = ({ produc }) => {
  // Función para obtener una versión truncada de la descripción
  const truncateDescription = (description, maxWords) => {
    const words = description.split(' ');
    if (words.length > maxWords) {
      return words.slice(0, maxWords).join(' ') + '...';
    }
    return description;
  };

  const truncatedDescription = truncateDescription(produc.description, 20);

  const url = '/product/' + produc._id ;

  return (
    <div className='contMediumCard'>
      <div className='imagen'>
        <img src={produc.images[0]} alt="Product" />
      </div>
      <div className='text'>
        <p>{produc.fecha}</p>
        <h3 className='tituloMediano'>{produc.title}</h3>
        <p>{truncatedDescription}</p>
        <Link href={url} className='btnSecondary'>Leer Mas</Link>
      </div>
    </div>
  );
};

export default MediumCard;