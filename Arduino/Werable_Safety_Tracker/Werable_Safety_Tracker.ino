#include <lmic.h>
#include <hal/hal.h>
#include <SPI.h>
// #include <Adafruit_GPS.h>
#include <Wire.h>

#include <math.h>
#include <Adafruit_LIS3DH.h>
#include <Adafruit_Sensor.h>

// Used for software SPI
#define LIS3DH_CLK 13
#define LIS3DH_MISO 12
#define LIS3DH_MOSI 11

// Used for hardware & software SPI
#define LIS3DH_CS 10

Adafruit_LIS3DH lis = Adafruit_LIS3DH();

// Adafruit_GPS GPS(&GPSSerial);

unsigned long acc_timer = millis();

const int AccelerometerTaskDelay = 100;

bool falling = 0;

int tmp_array[2] = {0, 0};

// TTN Configuration
static const u1_t PROGMEM APPEUI[8] = { 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00 };
void os_getArtEui (u1_t* buf) { memcpy_P(buf, APPEUI, 8);}

// This should also be in little endian format, see above.
static const u1_t PROGMEM DEVEUI[8] = { 0x95, 0x63, 0x05, 0xD0, 0x7E, 0xD5, 0xB3, 0x70 };
void os_getDevEui (u1_t* buf) { memcpy_P(buf, DEVEUI, 8);}

// This key should be in big endian format (or, since it is not really a
// number but a block of memory, endianness does not really apply). In
// practice, a key taken from the TTN console can be copied as-is.
static const u1_t PROGMEM APPKEY[16] = { 0x37, 0x2B, 0x74, 0x49, 0x4F, 0x7B, 0x50, 0xC0, 0xD3, 0x33, 0xE4, 0xD3, 0x1D, 0x82, 0x57, 0x7C };
void os_getDevKey (u1_t* buf) {  memcpy_P(buf, APPKEY, 16);}

// payload to send to TTN gateway
static uint8_t payload[16];
static osjob_t sendjob;

// Schedule TX every this many seconds (might become longer due to duty
// cycle limitations).
const unsigned TX_INTERVAL = 7;

// Pin mapping for Adafruit Feather M0 LoRa
const lmic_pinmap lmic_pins = {
    .nss = 8,
    .rxtx = LMIC_UNUSED_PIN,
    .rst = 4,
    .dio = {3, 6, LMIC_UNUSED_PIN},
    .rxtx_rx_active = 0,
    .rssi_cal = 8,              // LBT cal for the Adafruit Feather M0 LoRa, in dB
    .spi_freq = 8000000,
};

struct Payload {
    int coordinates[8];
};

struct Payload generate_random_gps_coordinates() {
  Payload coordinates;
  int x_min = 4440820;  //minimum & maximum latitude & longitude for coordinates in Brussels (int instead of float)
  int x_max = 4465060;
  int y_min = 50841208;
  int y_max = 50858989;
  int x = random(x_min,x_max);  //latitude
  int y = random(y_min,y_max);  //longitude
  String xstring = String(x);
  String ystring = String(y);
  coordinates.coordinates[0] = (ystring.substring(0,2)).toInt();
  coordinates.coordinates[1] = (ystring.substring(2,4)).toInt();
  coordinates.coordinates[2] = (ystring.substring(4,6)).toInt();
  coordinates.coordinates[3] = (ystring.substring(6,8)).toInt();
  coordinates.coordinates[4] = (xstring.substring(0,1)).toInt();
  coordinates.coordinates[5] = (xstring.substring(1,3)).toInt();
  coordinates.coordinates[6] = (xstring.substring(3,5)).toInt();
  coordinates.coordinates[7] = (xstring.substring(5,7)).toInt();
  //send as a list of integers
  return(coordinates);
}

void setup() {
    delay(1000);
    while (! Serial);
    Serial.begin(115200);

    Wire.begin();
    lis.begin(0x19);

    // LMIC init.
    os_init();
    // Reset the MAC state. Session and pending data transfers will be discarded.
    LMIC_reset();
    // Disable link-check mode and ADR, because ADR tends to complicate testing.
    LMIC_setLinkCheckMode(0);
    // Set the data rate to Spreading Factor 7.  This is the fastest supported rate for 125 kHz channels, and it
    // minimizes air time and battery power. Set the transmission power to 14 dBi (25 mW).
    LMIC_setDrTxpow(DR_SF7,14);
    // in the US, with TTN, it saves join time if we start on subband 1 (channels 8-15). This will
    // get overridden after the join by parameters from the network. If working with other
    // networks or in other regions, this will need to be changed.
    //LMIC_selectSubBand(1);

    // Start job (sending automatically starts OTAA too)
    do_send(&sendjob);
}

void loop() {
    // we call the LMIC's runloop processor. This will cause things to happen based on events and time. One
    // of the things that will happen is callbacks for transmission complete or received messages. We also
    // use this loop to queue periodic data transmissions.  You can put other things here in the `loop()` routine,
    // but beware that LoRaWAN timing is pretty tight, so if you do more than a few milliseconds of work, you
    // will want to call `os_runloop_once()` every so often, to keep the radio running.
    os_runloop_once();

    if (millis() - acc_timer > AccelerometerTaskDelay) {
        readAccelerometerData();
    }
}

void onEvent (ev_t ev) {
    switch(ev) {
        case EV_SCAN_TIMEOUT:
            Serial.println(F("EV_SCAN_TIMEOUT"));
            break;
        case EV_BEACON_FOUND:
            Serial.println(F("EV_BEACON_FOUND"));
            break;
        case EV_BEACON_MISSED:
            Serial.println(F("EV_BEACON_MISSED"));
            break;
        case EV_BEACON_TRACKED:
            Serial.println(F("EV_BEACON_TRACKED"));
            break;
        case EV_JOINING:
            Serial.println(F("EV_JOINING"));
            break;
        case EV_JOINED:
            Serial.println(F("EV_JOINED"));
            LMIC_setLinkCheckMode(0);
            break;
        case EV_JOIN_FAILED:
            Serial.println(F("EV_JOIN_FAILED"));
            break;
        case EV_REJOIN_FAILED:
            Serial.println(F("EV_REJOIN_FAILED"));
            break;
        case EV_TXCOMPLETE:            
            Serial.println(F("Payload sent successfully"));
            // Schedule next transmission
            os_setTimedCallback(&sendjob, os_getTime()+sec2osticks(TX_INTERVAL), do_send);
            break;
        case EV_LOST_TSYNC:
            Serial.println(F("EV_LOST_TSYNC"));
            break;
        case EV_RESET:
            Serial.println(F("EV_RESET"));
            break;
        case EV_RXCOMPLETE:
            // data received in ping slot
            Serial.println(F("EV_RXCOMPLETE"));
            break;
        case EV_LINK_DEAD:
            Serial.println(F("EV_LINK_DEAD"));
            break;
        case EV_LINK_ALIVE:
            Serial.println(F("EV_LINK_ALIVE"));
            break;
        case EV_TXSTART:
            Serial.println(F("Starting new transmission"));
            break;
        default:
            Serial.println(F("ERROR: Unknown event"));
            break;
    }
}

void do_send(osjob_t* j){
    // Check if there is not a current TX/RX job running
    if (LMIC.opmode & OP_TXRXPEND) {
        Serial.println(F("OP_TXRXPEND, not sending"));
    } 
    else {
        // prepare upstream data transmission at the next possible time.
        // transmit on port 1 (the first parameter); you can use any value from 1 to 223 (others are reserved).
        // don't request an ack (the last parameter, if not zero, requests an ack from the network).
        // Remember, acks consume a lot of network resources; don't ask for an ack unless you really need it.
        LMIC_setTxData2(1, payload, sizeof(payload)-1, 0);
        falling = 0;
    }
    // Next TX is scheduled after TX_COMPLETE event.
}

void floatToTwoInt (int myArray[], float myValue){
    int firstPart = myValue;
    myArray[0] = firstPart;
    myValue -= firstPart;
    int secondPart = myValue * 10000;
    myArray[1] = secondPart;
}

void readAccelerometerData() {
    acc_timer = millis();
    lis.read();
    sensors_event_t event;
    lis.getEvent(&event);
    double acc = sqrt(pow(event.acceleration.x,2) + pow(event.acceleration.y,2)+ pow(event.acceleration.z,2))-9.81;
    if (acc >= 10) {
      Payload coordinates = generate_random_gps_coordinates();
      payload[0] = coordinates.coordinates[0];
      payload[1] = coordinates.coordinates[1];
      payload[2] = coordinates.coordinates[2];
      payload[3] = coordinates.coordinates[3];
      payload[4] = coordinates.coordinates[4];
      payload[5] = coordinates.coordinates[5];
      payload[6] = coordinates.coordinates[6];
      payload[7] = coordinates.coordinates[7];
    }
    else {
      payload[0] = 0;
      payload[1] = 0;
      payload[2] = 0;
      payload[3] = 0;
      payload[4] = 0;
      payload[5] = 0;
      payload[6] = 0;
      payload[7] = 0;
    }
}