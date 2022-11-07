import React, { useEffect, useState } from 'react'
import { PureComponent } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import io from 'socket.io-client'

const socket = io.connect("http://localhost:3001");

const redOptions = { color: 'red' }
const data = [
    {
      name: 'Page A',
      uv: 4000,
      pv: 2400,
      amt: 2400,
    },
    {
      name: 'Page B',
      uv: 3000,
      pv: 1398,
      amt: 2210,
    },
    {
      name: 'Page C',
      uv: 2000,
      pv: 980,
      amt: 2290,
    },
    {
      name: 'Page D',
      uv: 2780,
      pv: 3908,
      amt: 2000,
    },
    {
      name: 'Page E',
      uv: 1890,
      pv: 4800,
      amt: 2181,
    },
    {
      name: 'Page F',
      uv: 2390,
      pv: 3800,
      amt: 2500,
    },
    {
      name: 'Page G',
      uv: 3490,
      pv: 4300,
      amt: 2100,
    },
    {
        
        uv: 2000,
        pv: 534
    }
  ];

  

// const [datas, setDatas] = useState([])

function Charts() {

    const [datas,setDatas] = useState([
      ]);


    socket.on("numberofbikes", (numberofbikes, temps) =>{
                console.log(numberofbikes)

                setDatas([...datas,{uv : numberofbikes, name : temps}])
                console.log(datas)
            })

    return (
        <div>
            <div className='flex flex-col justify-center items-start'>

                    <div className='border border-5 rounded-3xl overflow-hidden'>


                        <div className='charts'>
                        <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={datas}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="pv" stroke="#8884d8" activeDot={{ r: 8 }} />
          <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
        </LineChart>
      </ResponsiveContainer>
                        </div>

                    </div>

            </div>
        </div>
    )
}

export default Charts;