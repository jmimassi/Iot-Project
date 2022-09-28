import React from 'react'
import { MapContainer, TileLayer, useMap, Marker, Popup, Circle } from 'react-leaflet'

const redOptions = { color: 'red' }

function Maps() {
    return (
        <div>
            <div className='flex flex-col justify-center items-start'>

                <div className='py-5'>

                    <div className='border border-5 rounded-3xl overflow-hidden'>

                        <MapContainer center={[50.8500366, 4.45399844]} zoom={15} scrollWheelZoom={true}>
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            <Marker position={[50.8500366, 4.45399844]}>
                                <Popup>
                                    ECAM Brussels Engineering <br /> Position of the gateway.
                                </Popup>
                            </Marker>
                            <Circle center={[50.8500366, 4.45399844]} pathOptions={redOptions} radius={1000} />
                        </MapContainer>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Maps