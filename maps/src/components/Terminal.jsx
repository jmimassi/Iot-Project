import React, { useEffect, useRef } from 'react';
import io from 'socket.io-client';

const socket = io.connect("http://localhost:3001");

const redOptions = { color: 'red' }



function Terminal({coordone, coordtwo, groupcoord, setCoordone, setCoordtwo, setGroupcoord}) {


    const bottomRef = useRef(null);



    useEffect(() => {

        socket.on("coordonnee", (coord1, coord2) => {
            let minutes = new Date().getMinutes()
            let hours = new Date().getHours()
            let seconds = new Date().getSeconds()
            setCoordone(coord1)
            setCoordtwo(coord2)
            let coord = "The bike fell at " + hours + " : " + minutes + " : " + seconds + " at the position " + coord1 + ", " + coord2
            setGroupcoord([...groupcoord, coord])
            console.log(coordone, coordtwo, groupcoord)
        })
    }, [socket, coordone, coordtwo, groupcoord])

    // 👇️ scroll to bottom every time messages change
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });


    return (
        <div>
            <div className='flex flex-col justify-center items-start '>

                <div className='py-5'>

                    <div className='border border-5 rounded-3xl overflow-hidden'>


                        <div className='terminal-container'>
                            <div className='p-2 text-2xl flex justify-center border-b text-white'>
                                Terminal
                            </div>
                            <div className='subterminal-container' >

                                <div className='text-white pb-16 pt-3 pl-3 text-lg space-y-2'>

                                    {groupcoord.map((item) => {
                                        return (
                                            <div key={item.id}>{item}</div>
                                        )
                                    })}



                                </ div >
                                <div ref={bottomRef} />
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default Terminal