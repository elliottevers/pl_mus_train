export {}
const max_api = require('max-api');
const noble = require('@abandonware/noble');
const dgram = require('dgram');
const includes = require('array-includes');

let port = 8001;

let command_set = 0x00;
let command_clear = 0x04;

let uuid_peripheral = '28a78aea2d8e4ba69e67377ca5b236bf';
let uuid_characteristic_led = '6e400002b5a3f393e0a9e50e24dcca9e';

max_api.addHandler("start", () => {

    const server = dgram.createSocket('udp4');

    server.on('error', (err) => {
        console.log(`server error:\n${err.stack}`);
        server.close();
    });

    // TODO: split multiple commands into array
    server.on('message', (msg, rinfo) => {
        if (msg.toString().trim() == 'clear') {
            send(command_clear, 0, 0, 0, 0, 0, 0);
            return
        }

        let parsed = msg.toString().split(' ');

        if (parsed.length == 10) {
            // TODO: where are these messages coming from?
            return
        }

        let part = String(parsed[10]);

        if (part == 'vocal') {
            send(command_clear, 0, 0, 0, 0, 0, 0);

        } else {
            send(command_set, 0, parseInt(parsed[6]), parseInt(parsed[7]), parseInt(parsed[8]), parseInt(parsed[9]), parseInt(parsed[5]) - 1);
            send(command_set, 0, parseInt(parsed[1]), parseInt(parsed[2]), parseInt(parsed[3]), parseInt(parsed[4]), parseInt(parsed[0]) - 1);
        }
    });

    server.on('listening', () => {
        const address = server.address();
        console.log(`server listening ${address.address}:${address.port}`);
    });

    server.bind(port);

    function send(cmd, fade: number, string: number, R: number, B: number, G: number, fret: number) {
        let d_1 = ((cmd << 4) | (fade & 0x0f));
        let d_2 = ((string << 4) | ((R & 0xf)));
        let d_3 = ((G & 0xF) << 4 | ((B & 0xf)));
        let d_4 = (1 << (fret + 1));

        charLed.write(new Buffer([d_1, d_2, d_3, d_4]), true, function(error) {
            console.log('wrote to fretboard');
        });
    }

    var ids = [
        uuid_peripheral
    ];

    noble.on('stateChange', function(state) {
        if (state === 'poweredOn') {
            noble.startScanning();
        } else {
            noble.stopScanning();
        }
    });

    noble.on('discover', function(peripheral) {
        if (includes(ids, peripheral.id) || includes(ids, peripheral.address)) {

            noble.stopScanning();

            console.log('peripheral with ID ' + peripheral.id + ' found');

            var advertisement = peripheral.advertisement;

            var localName = advertisement.localName;

            if (localName) {
                console.log('Local Name = ' + localName);
            }

            peripheral.connect(error => {
                console.log('Connected to', peripheral.id);

                peripheral.discoverSomeServicesAndCharacteristics(
                    [],
                    [uuid_characteristic_led],
                    onServicesAndCharacteristicsDiscovered
                );
            });

        } else {
            console.log(peripheral.id)
        }
    });

    var charLed = null;

    function onServicesAndCharacteristicsDiscovered(error, services, characteristics) {
        console.log('Discovered services and characteristics');

        charLed = characteristics[0];
    }
});