export {}
const max_api = require('max-api');
const noble = require('@abandonware/noble');
const includes = require('array-includes');
const dgram = require('dgram');

max_api.addHandler("start", () => {

    const server = dgram.createSocket('udp4');

    let characteristic_led = '28a78aea2d8e4ba69e67377ca5b236bf';
    let port = 8001;

    server.on('error', (err) => {
        console.log(`server error:\n${err.stack}`);
        server.close();
    });

    server.on('message', (msg, rinfo) => {
        var test = 1;
        console.log(`server got: ${msg} from ${rinfo.address}:${rinfo.port}`);
        var parsed = msg.toString().split(' ');
        send(0x00, 0, parseInt(parsed[1]), parseInt(parsed[2]), parseInt(parsed[3]), parseInt(parsed[4]), parseInt(parsed[0]) - 1)
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
        characteristic_led
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

            console.log();

            peripheral.connect(error => {
                console.log('Connected to', peripheral.id);

                // specify the services and characteristics to discover
                const serviceUUIDs = 'serviceUUIDs';
                const characteristicUUIDs = 'characteristicUUIDs';

                peripheral.discoverSomeServicesAndCharacteristics(
                    serviceUUIDs,
                    characteristicUUIDs,
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

        // TODO: search by key
        charLed = characteristics[2];

        const echoCharacteristic = characteristics[0];

        // data callback receives notifications
        echoCharacteristic.on('data', (data, isNotification) => {
            console.log('Received: "' + data + '"');
        });

        // subscribe to be notified whenever the peripheral update the characteristic
        echoCharacteristic.subscribe(error => {
            if (error) {
                console.error('Error subscribing to echoCharacteristic');
            } else {
                console.log('Subscribed for echoCharacteristic notifications');
            }
        });
    }
});