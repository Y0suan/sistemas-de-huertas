import React from 'react'

const MIniCard = ({product}) => {
  return (
    <div className=' w-fit shadow h-fit p-4 flex '>
        <div className=' hiden w-40 ' >
            <img src={product.images[0]} ></img>
        </div>
        <div className='flex gap-1' >
        <h4>Referente:</h4>    
        <h4>{product.referente}</h4>
        </div>
    </div>
  )
}

export default MIniCard