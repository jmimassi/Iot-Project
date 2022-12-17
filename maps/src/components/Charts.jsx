import React, { useEffect } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import io from "socket.io-client";
const socket = io("http://localhost:3001/");

function Charts({ datas, setDatas }) {
  useEffect(() => {
    socket.on("numberofbikes", (numberofbikes, temps) => {
      console.log(numberofbikes);

      setDatas([
        ...datas,
        { "Number of bike that fell": numberofbikes, name: temps },
      ]);
      console.log(datas);
    });
  }, [socket, datas, setDatas]);

  return (
    <div>
      <div className="flex flex-col justify-center items-start">
        <div className="border border-5 rounded-3xl overflow-hidden">
          <div className="charts">
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
                <Line
                  type="monotone"
                  dataKey="Number of bike that fell"
                  stroke="#8884d8"
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Charts;
