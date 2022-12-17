/**
 * Transform the payload of the Lorawan transmission into 2 coordinates that can be used in the frontend because Lorawan transmission can't send a huge float number.
 * The return value is 2 coordinates (x and y)
 * @param {Array} [gpsarduino] - it's the payload sent by the Lorawan transmission
 */

function decode(gpsarduino) {
  xcoord = gpsarduino.slice(0, 4);
  ycoord = gpsarduino.slice(4, 8);

  console.log(
    "valeur reçu par TTN pour les 8 premières valeurs: ",
    xcoord,
    ycoord
  );

  let stringx = "";
  for (var i = 0; i < xcoord.slice(0, 4).length; i++) {
    xcoord[i] = xcoord[i].toString();
    if (xcoord[i].length != 2) {
      xcoord[i] = "0" + xcoord[i];
    }
    stringx += xcoord[i];
  }

  let stringy = "";
  for (var i = 0; i < ycoord.slice(0, 4).length; i++) {
    // console.log(ycoord[i]);
    ycoord[i] = ycoord[i].toString();
    if (ycoord[i].length != 2) {
      ycoord[i] = "0" + ycoord[i];
    }
    stringy += ycoord[i];
  }

  xcoord = parseInt(stringx) / 1000000;
  ycoord = parseInt(stringy) / 1000000;

  console.log("valeur parsé pour le frontend : ", xcoord, ycoord);

  return [xcoord, ycoord];
}

module.exports = { decode };
