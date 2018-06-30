import createSagaMonitor from "../../../src/store/createSagaMonitor";
const sagaMonitor = createSagaMonitor();
window["__SAGA_MONITOR_EXTENSION__"] = sagaMonitor;