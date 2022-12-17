import React, { useEffect } from "react";
import { Circle, MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import io from "socket.io-client";

const redOptions = { color: "red" };
const socket = io.connect("http://localhost:3001");

function Maps({ positions, setPositions }) {
  useEffect(() => {
    socket.on("coordonnee", (coord1, coord2) => {
      setPositions([...positions, { x: coord1, y: coord2 }]);
      console.log(positions);
    });
  }, [socket, positions, setPositions]);

  return (
    <div>
      <div className="flex flex-col justify-center items-start">
        <div className="py-5">
          <div className="border border-5 rounded-3xl overflow-hidden">
            <MapContainer
              center={[50.8500366, 4.45399844]}
              zoom={15}
              scrollWheelZoom={true}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {positions.map((item) => {
                return (
                  <div key={item.id}>
                    <Marker position={[item.x, item.y]}>
                      <Popup>
                        ECAM Brussels Engineering <br /> Position of the
                        gateway.
                      </Popup>
                    </Marker>
                  </div>
                );
              })}

              <Circle
                center={[50.8500366, 4.45399844]}
                pathOptions={redOptions}
                radius={1400}
              />
            </MapContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Maps;
