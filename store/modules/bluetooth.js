import helpers from "jt-helpers";

const state = {
  available: false,
  foundDevices: [],
  connectedDeviceIds: [],
};

const types = helpers.keyMirror({
  SetAvailable: null,
  AddFoundDevice: null,
  DeleteFoundDevice: null,
  SetConnectedDeviceIds: null,
});

const mutations = {
  [types.SetAvailable](state, { available }) {
    state.available = available;
  },
  [types.AddFoundDevice](state, { device }) {
    if (
      !state.foundDevices
        .map(({ deviceId }) => deviceId)
        .includes(device.deviceId)
    ) {
      state.foundDevices.push(device);
    }
  },
  [types.DeleteFoundDevice](state, { deviceId }) {
    const index = state.foundDevices
      .map(({ deviceId }) => deviceId)
      .indexOf(deviceId);

    if (index !== -1) {
      state.foundDevices.splice(index, 1);
    }
  },
  [types.SetConnectedDeviceIds](state, { deviceId, connected }) {
    if (connected) {
      if (!state.connectedDeviceIds.includes(deviceId)) {
        state.connectedDeviceIds.push(deviceId);
      }
    } else {
      const index = state.connectedDeviceIds.indexOf(deviceId);

      if (index !== -1) {
        state.connectedDeviceIds.splice(index, 1);
      }
    }
  },
};

const actions = {
  setAvailable({ commit }, { available }) {
    commit(types.SetAvailable, { available });
  },
  addFoundDevice({ commit }, { device }) {
    commit(types.AddFoundDevice, { device });
  },
  deleteFoundDevice({ commit }, { deviceId }) {
    commit(types.DeleteFoundDevice, { deviceId });
  },
  setConnectedDeviceIds({ commit }, { deviceId, connected }) {
    commit(types.SetConnectedDeviceIds, { deviceId, connected });
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
