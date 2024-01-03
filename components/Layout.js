import Nav from "@/components/Nav";
import { useSession, signIn, signOut } from "next-auth/react"
import { useState } from "react";
import Logo from "./Logo";

//icons
import { AiOutlineGoogle } from 'react-icons/ai';




export default function Layout({children}) {
  const [showNav,setShowNav] = useState(false);
  const { data:session } = useSession();
  if (!session){
  return (
    <div class='bg-white w-screen h-screen flex items-center justify-center '>
      <div class=" bg-white p-5 rounded-lg text-center w-max flex flex-col items-start">
        <h1 class=" text-black text-3xl font-bold " >Inicia Sección</h1>
        <button onClick={()=>signIn('google')} class="bg-gray-600 text-white p-2 px-3 rounded-lg flex items-center"><AiOutlineGoogle class="m-1"/>Iniciar sesión con Google</button>
      </div>
    </div>
  );
}

return (
<div class="bg-bgGray bg-gray-500 min-h-screen ">
<div class="block md:hidden flex items-center p-4">
  <button onClick={() => setShowNav(true) } >
   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" class="w-6 h-6">
   <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
   </svg>
  </button>
  <div class="flex grow justify-center mr-6">
   <Logo/>
  </div>
</div>
<div class=" flex ">
    <Nav show={showNav} ></Nav>
    <div class='flex-grow p-4 bg-white' >
    <div class=" flex-grow min-h-full p-4 rounded-xl bg-white" >
        {children}
    </div>
    </div>
  </div>
</div>
);
}
