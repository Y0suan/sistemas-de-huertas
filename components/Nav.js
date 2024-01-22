import { signOut } from "next-auth/react";
import  Link  from "next/link";
import { useRouter } from "next/router";
import Logo from "./Logo";
import { FaUserFriends } from "react-icons/fa";
import { RiPlantFill } from "react-icons/ri";
import { FaSeedling } from "react-icons/fa";
import { AiFillHome } from "react-icons/ai";
import { GiPlantSeed } from "react-icons/gi";
import { FaUser } from "react-icons/fa";
export default function Nav({show}){
    const inactiveLink = 'hover:pl-4 font-medium hover:bg-blue-100 rounded-xl hover:text-blue-600 flex gap-1 p-2 border-b-2 border-white ease-out duration-300';
    const activeLink = 'flex p-2 gap-1 text-blue-500 font-medium ';
    const inactiveIcon = 'w-6 h-6 ';
    const activeIcon = 'w-6 h- text-blue-500';
    const router = useRouter();
    const {pathname} = router;
    async function logout(){
        await router.push('/');
        await signOut();
    }


    return(
    <aside class={(show?'left-0':'-left-full')+" top-0 text-gray-600 p-4  fixed w-full bg-white min-h-screen md:static md:w-auto transition-all"}>
        <div class="mb-4 mr-4">
            <Logo />
        </div>

        <nav class="flex flex-col gap-2  ">
            <Link href={'/'} class={pathname === '/' ? activeLink : inactiveLink}>
            <AiFillHome class={pathname === '/categories' ? activeIcon : inactiveIcon} />
            Home
            </Link>
            <Link href={'/admins'} class={pathname.includes('/admins') ? activeLink : inactiveLink }>
            <FaUser class={pathname === '/categories' ? activeIcon : inactiveIcon} />
            Admin
            </Link> 
            <Link href={'/products'} class={pathname.includes('/products') ? activeLink : inactiveLink }>
            <FaUserFriends class={pathname === '/products' ? activeIcon : inactiveIcon} />
            Referentes
            </Link>
            {/* 
            <Link href={'/plantines'} class={pathname.includes('/plantines') ? activeLink : inactiveLink }>
            <RiPlantFill  class={pathname === '/plantines' ? activeIcon : inactiveIcon} />
            Plantines
            </Link>
            <Link href={'/semillas'} class={pathname.includes('/semillas') ? activeLink : inactiveLink }>
            <GiPlantSeed lass={pathname === '/semillas' ? activeIcon : inactiveIcon} />
            Semillas
            </Link> */}
            <Link href={'/huertas'} class={pathname.includes('/huertas') ? activeLink : inactiveLink }>
            <FaSeedling lass={pathname === '/huertas' ? activeIcon : inactiveIcon} />
            Huertas
            </Link>

            <button onClick={logout} class={inactiveLink}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" class={inactiveIcon}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
            </svg>
            Cerrar Sesión
            </button>







            
        </nav>
    </aside>
    )
}