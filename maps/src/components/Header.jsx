import React from 'react';
// import Image from 'next/Image'
import { StarIcon } from '@heroicons/react/24/outline';
import { BeakerIcon, ChevronDownIcon, GlobalIcon, HomeIcon, MagnifyingGlassIcon, SearchIcon, SparklesIcon, VideoCameraIcon } from '@heroicons/react/24/solid';
import GitHubIcon from '@mui/icons-material/GitHub';


function Header() {
    return (

        // On fait en class général que ce soit flex pour etre sur que toutes les autres div seront bien 

        <div className=" sticky top-0 z-50 flex bg-white px-4 py-2 shadow-sm">
            <div className=' flex page-content'>

            <div className='flex flex-1 justify-start items-center gap-2'>
                <MagnifyingGlassIcon className="h-15 w-10" />
                What happened to your bike ?
            </div>

            <div className='flex flex-1 justify-start items-center px-3 py-1 text-xl font-extrabold'>
                GPS Tracker
            </div>

            {/* Si c'est assez grand on affiche toutes les icons */}
            <div className='flex justify-start items-center gap-2 cursor-pointer'>

            <a href="https://github.com/jmimassi/IoT-Project">
                <div className='flex gap-2'>
                    <GitHubIcon className="h-15 w-10" />
                    Check our project on Github !
                </div>

            </a>
            </div>
            </div>
            {/* Si c'est petit on affiche que la petite icon qui permet d'agrandir */}


        </div>
    )
}

export default Header