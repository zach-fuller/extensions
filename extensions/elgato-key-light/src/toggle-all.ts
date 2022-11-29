import { ControlCenter } from "./controlCenter";
import { KeyLight } from "./elgato";
import { run } from "./utils";

const command = async () => {
  const controlCenter = new ControlCenter();
  const lights = await controlCenter.discover()
  console.log(`Lights: ${lights.length}`)
  for (const light of lights) {
    const isOn = await light.toggle();
  }
  return "YEAH"
  // return isOn ? "Key Light turned on" : "Key Light turned off";
};

export default run(command);