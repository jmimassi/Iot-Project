import React from 'react'
import { MapContainer, TileLayer, useMap, Marker, Popup, Circle } from 'react-leaflet'

const redOptions = { color: 'red' }

function Terminal() {
    return (
        <div>
            <div className='flex flex-col justify-center items-start'>

                <div className='pb-5'>

                    <div className='border border-5 rounded-3xl overflow-hidden'>


                        <div className='leaflet-container'>
                            <div className='p-2 text-2xl flex justify-center border-b text-white'>
                                Terminal
                            </div>
                            <div className='text-white p-2 text-lg'>
                                The bike fell at 18:02:14
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default Terminal