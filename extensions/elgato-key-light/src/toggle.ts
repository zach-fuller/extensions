import { ControlCenter } from "./controlCenter";
import { KeyLight } from "./elgato";
import { run } from "./utils";

const command = async () => {
  const controlCenter = new ControlCenter();
  const keyLight = await controlCenter.discover().then((lights) => lights[0]);

  const isOn = await keyLight.toggle();
  return isOn ? "Key Light turned on" : "Key Light turned off";
};

export default run(command);
