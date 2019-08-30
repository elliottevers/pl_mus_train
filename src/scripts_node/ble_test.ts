export {};

const noble = require('@abandonware/noble');

var async = require('async');

const includes = require('array-includes');

var ids = [
    '28a78aea2d8e4ba69e67377ca5b236bf'
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
    // if (false) {
        noble.stopScanning();

        console.log('peripheral with ID ' + peripheral.id + ' found');
        var advertisement = peripheral.advertisement;

        var localName = advertisement.localName;
        var txPowerLevel = advertisement.txPowerLevel;
        var manufacturerData = advertisement.manufacturerData;
        var serviceData = advertisement.serviceData;
        var serviceUuids = advertisement.serviceUuids;

        if (localName) {
            console.log('  Local Name        = ' + localName);
        }

        if (txPowerLevel) {
            console.log('  TX Power Level    = ' + txPowerLevel);
        }

        if (manufacturerData) {
            console.log('  Manufacturer Data = ' + manufacturerData.toString('hex'));
        }

        if (serviceData) {
            console.log('  Service Data      = ' + JSON.stringify(serviceData, null, 2));
        }

        if (serviceUuids) {
            console.log('  Service UUIDs     = ' + serviceUuids);
        }

        console.log();

        // explore(peripheral);

        peripheral.connect(error => {
            console.log('Connected to', peripheral.id);

            // specify the services and characteristics to discover
            const serviceUUIDs = 'serviceUUIDs';// [ECHO_SERVICE_UUID];
            const characteristicUUIDs = 'characteristicUUIDs';// [ECHO_CHARACTERISTIC_UUID];

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

function onServicesAndCharacteristicsDiscovered(error, services, characteristics) {
    console.log('Discovered services and characteristics');

    var charLed = characteristics[2];

    charLed.write(new Buffer([0x00, 0x00, 0x00, 0x00]), true, function(error) {
        console.log('wrote?');
    });

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

    // create an interval to send data to the service
    let count = 0;
    setInterval(() => {
        count++;
        const message = new Buffer('hello, ble ' + count, 'utf-8');
        console.log("Sending:  '" + message + "'");
        echoCharacteristic.write(message);
    }, 2500);
}

function explore(peripheral) {
    console.log('services and characteristics:');

    peripheral.on('disconnect', function() {
        process.exit(0);
    });

    peripheral.connect(function(error) {
        peripheral.discoverServices([], function(error, services) {
            var serviceIndex = 0;

            async.whilst(
                function () {
                    return (serviceIndex < services.length);
                },
                function(callback) {
                    var service = services[serviceIndex];
                    var serviceInfo = service.uuid;

                    if (service.name) {
                        serviceInfo += ' (' + service.name + ')';
                    }
                    console.log(serviceInfo);

                    service.discoverCharacteristics([], function(error, characteristics) {
                        var characteristicIndex = 0;

                        async.whilst(
                            function () {
                                return (characteristicIndex < characteristics.length);
                            },
                            function(callback) {
                                var characteristic = characteristics[characteristicIndex];
                                var characteristicInfo = '  ' + characteristic.uuid;

                                if (characteristic.name) {
                                    characteristicInfo += ' (' + characteristic.name + ')';
                                }

                                async.series([
                                    function(callback) {
                                        characteristic.discoverDescriptors(function(error, descriptors) {
                                            async.detect(
                                                descriptors,
                                                function(descriptor, callback) {
                                                    if (descriptor.uuid === '2901') {
                                                        return callback(descriptor);
                                                    } else {
                                                        return callback();
                                                    }
                                                },
                                                function(userDescriptionDescriptor){
                                                    if (userDescriptionDescriptor) {
                                                        userDescriptionDescriptor.readValue(function(error, data) {
                                                            if (data) {
                                                                characteristicInfo += ' (' + data.toString() + ')';
                                                            }
                                                            callback();
                                                        });
                                                    } else {
                                                        callback();
                                                    }
                                                }
                                            );
                                        });
                                    },
                                    function(callback) {
                                        characteristicInfo += '\n    properties  ' + characteristic.properties.join(', ');

                                        if (characteristic.properties.indexOf('read') !== -1) {
                                            characteristic.read(function(error, data) {
                                                if (data) {
                                                    var string = data.toString('ascii');

                                                    characteristicInfo += '\n    value       ' + data.toString('hex') + ' | \'' + string + '\'';
                                                }
                                                callback();
                                            });
                                        } else {
                                            callback();
                                        }
                                    },
                                    function() {
                                        console.log(characteristicInfo);
                                        characteristicIndex++;
                                        callback();
                                    }
                                ]);
                            },
                            function(error) {
                                serviceIndex++;
                                callback();
                            }
                        );
                    });
                },
                function (err) {
                    peripheral.disconnect();
                }
            );
        });
    });
}