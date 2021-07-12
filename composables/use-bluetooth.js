import wx from "wx-bridge";
import { EventEmitter2 } from "eventemitter2";
import { eachSeries } from "async";
import { createNamespacedHelpers } from "vuex-composition-helpers";
import { store } from "@/store";

export const useBluetooth = ({ emits = [] } = {}) => {
  const emitter = new EventEmitter2();
  const { useActions, useState } = createNamespacedHelpers(store, "bluetooth");
  const { available, foundDevices, connectedDeviceIds } = useState([
    "available",
    "foundDevices",
    "connectedDeviceIds",
  ]);
  const {
    setAvailable,
    addFoundDevice,
    deleteFoundDevice,
    setConnectedDeviceIds,
  } = useActions([
    "setAvailable",
    "addFoundDevice",
    "deleteFoundDevice",
    "setConnectedDeviceIds",
  ]);

  const tryOpenAdapter = () => {
    return new Promise((resolve, reject) => {
      wx.openBluetoothAdapter()
        .then((res) => {
          setAvailable({ available: true });
          resolve(res);
        })
        .catch((err) => {
          wx.showToast({ title: "请开启手机蓝牙" });
          setAvailable({ available: false });
          setConnectedDeviceIds({ deviceId: "", connected: false });
          reject(err);
        });
    });
  };

  const closeAdapter = () => {
    return wx.closeBluetoothAdapter();
  };

  const getAllDeviceCharacteristics = async ({ deviceId }) => {
    const ret = {
      notify: {},
      indicate: {},
      read: {},
      write: {},
    };
    const { services } = await wx.getBLEDeviceServices({ deviceId });

    await eachSeries(services, async (service, cb) => {
      const { characteristics } = await wx.getBLEDeviceCharacteristics({
        deviceId,
        serviceId: service.uuid,
      });

      characteristics.forEach((characteristic) => {
        Object.keys(ret).forEach((property) => {
          if (!ret[property].uuid && characteristic.properties[property]) {
            ret[property] = {
              serviceId: service.uuid,
              uuid: characteristic.uuid,
            };
          }
        });
      });

      cb();
    });

    return ret;
  };

  const addListeners = () => {
    if (emits.includes("adapter-state-change")) {
      wx.onBluetoothAdapterStateChange(({ available, discovering }) => {
        setAvailable({ available });

        if (!available) {
          wx.showToast({ title: "请开启手机蓝牙" });
          setConnectedDeviceIds({ deviceId: "", connected: false });
        }

        emitter.emit("adapter-state-change", { available, discovering });
      });
    }

    if (emits.includes("connection-state-change")) {
      wx.onBLEConnectionStateChange(({ deviceId, connected }) => {
        setConnectedDeviceIds({ deviceId, connected });
        emitter.emit("connection-state-change", { deviceId, connected });
      });
    }

    if (emits.includes("device-found")) {
      wx.onBluetoothDeviceFound(({ devices }) => {
        devices
          .filter(({ name, localName }) => name || localName)
          .forEach((device) => {
            addFoundDevice({ device });
          });
        emitter.emit("device-found", { devices });
      });
    }

    if (emits.includes("characteristic-value-change")) {
      wx.onBLECharacteristicValueChange((res) => {
        emitter.emit("characteristic-value-change", res);
      });
    }
  };

  const on = (event, listener) => {
    return emitter.on(event, listener);
  };

  const off = (event, listener) => {
    listener && emitter.off(event, listener);

    switch (event) {
      case "adapter-state-change":
        wx.offBluetoothAdapterStateChange();
        break;
      case "connection-state-change":
        wx.offBLEConnectionStateChange();
        break;
      case "device-found":
        wx.offBluetoothDeviceFound();
        break;
      case "characteristic-value-change":
        wx.offBLECharacteristicValueChange();
        break;
      default:
        break;
    }
  };

  const arrayBufferToHex = (arrayBuffer) => {
    const hexArr = Array.prototype.map.call(
      new Uint8Array(arrayBuffer),
      (bit) => {
        return ("00" + bit.toString(16)).slice(-2) + " ";
      }
    );
    return hexArr.join("").toUpperCase();
  };

  const hexToArrayBuffer = (hex) => {
    const array = hex.split(" ");
    const length = array.length;
    const arrayBuffer = new ArrayBuffer(length + 2);
    const dataView = new DataView(arrayBuffer);

    for (let i = 0; i < length; i++) {
      dataView.setUint8(i, "0x" + array[i]);
    }

    return arrayBuffer;
  };

  return {
    emitter,
    available,
    foundDevices,
    deleteFoundDevice,
    connectedDeviceIds,
    setAvailable,
    addListeners,
    on,
    off,
    tryOpenAdapter,
    getAllDeviceCharacteristics,
    writeCharacteristicValue: wx.writeBLECharacteristicValue,
    setMTU: wx.setBLEMTU,
    readCharacteristicValue: wx.readBLECharacteristicValue,
    notifyCharacteristicValueChange: wx.notifyBLECharacteristicValueChange,
    makeBluetoothPair: wx.makeBluetoothPair,
    getDeviceServices: wx.getBLEDeviceServices,
    getDeviceRSSI: wx.getBLEDeviceRSSI,
    getDeviceCharacteristics: wx.getBLEDeviceCharacteristics,
    createConnection: wx.createBLEConnection,
    closeConnection: wx.closeBLEConnection,
    stopDevicesDiscovery: wx.stopBluetoothDevicesDiscovery,
    startDevicesDiscovery: wx.startBluetoothDevicesDiscovery,
    openAdapter: wx.openBluetoothAdapter,
    getConnectedDevices: wx.getConnectedBluetoothDevices,
    getDevices: wx.getBluetoothDevices,
    getAdapterState: wx.getBluetoothAdapterState,
    closeAdapter,
    arrayBufferToHex,
    hexToArrayBuffer,
  };
};
