import { ControlCenter } from "./controlCenter";
import { run } from "./utils";

const command = async () => {
  const controlCenter = new ControlCenter();
  const lights = await controlCenter.discover();
  console.log(lights.length);
  const lightCount = await controlCenter.toggle();
  return `Toggled ${lightCount} lights`;
};

export default run(command);
