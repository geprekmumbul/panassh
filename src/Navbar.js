/* eslint-disable jsx-a11y/img-redundant-alt */
import {useState } from 'react';
import Logo from './img/fire_logo.png';
import Profile from './img/profile.jpeg'
import { GH_CONT, LINKEDIN_CONT, EMAIL_CONT } from './constants';

export default function Navbar(){
    const [menuShown, setMenuShown] = useState(false);

    return(
        <nav className="absolute z-20 bg-gradient-to-b from-slate-950/100 via-slate-950/70 to-slate-950/0 w-full">
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                <div className="flex items-center space-x-3 rtl:space-x-reverse">
                    <img src={Logo} className="h-8" alt="Web logo" />
                    <span className="inline-block font-bebas self-center text-2xl whitespace-nowrap align-baseline mt-2 text-white">Is It Getting Hot?</span>
                </div>
                <div className="flex flex-row items-center gap-5 md:w-auto text-white font-light" id="navbar-default">
                    <i className='hidden md:block'>A simple reminder for humanity</i>
                    <div onMouseEnter={() => setMenuShown(true)} onMouseLeave={() => setMenuShown(false)} >
                        <div type="button" onHover className="flex text-sm bg-gray-800 rounded-full md:me-0 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600" id="user-menu-button">
                            <span className="sr-only">Open user menu</span>
                            <img className="w-8 h-8 rounded-full object-cover" src={Profile} alt="creator photo" />
                            
                            {menuShown && (
                            <div className='z-50 xl:right-[4.5%] right-0 top-10 absolute py-5 '>
                            <div className="text-base list-none rounded-lg shadow bg-slate-800" id="user-dropdown">
                                <div className="px-4 py-3">
                                    <span className="block text-sm text-white">BlackOps Team</span>
                                    <span className="block text-sm  truncate text-gray-400">System Information Student</span>
                                </div>
                                <ul className="py-2" aria-labelledby="user-menu-button">
                                    <li>
                                        <a href={EMAIL_CONT} className="block px-4 py-2 text-sm hover:bg-gray-600 text-gray-200 dark:hover:text-white">Email</a>
                                    </li>
                                    <li>
                                        <a href={LINKEDIN_CONT} className="block px-4 py-2 text-sm hover:bg-gray-600 text-gray-200 dark:hover:text-white">LinkedIn</a>
                                    </li>
                                    <li>
                                        <a href={GH_CONT} className="block px-4 py-2 text-sm hover:bg-gray-600 dark:text-gray-200hover:text-white">GitHub</a>
                                    </li>
                                </ul>
                            </div>
                            </div>
                        )} 
                        </div>
                        
                    </div>
                </div>
            </div>
        </nav>
    );
}
