import { List } from "@raycast/api";
import { ControlCenter } from "./controlCenter";
import { usePromise } from "@raycast/utils";
import { KeyLight } from "./elgato";

function ViewLights(): JSX.Element {

  const { data } = usePromise(
    async () => {
      const controlCenter = new ControlCenter()
      const lights = await controlCenter.discover(true)
      return lights
    }
  );

  return (
    <List>
      {data?.map((light: KeyLight) => {
        return (
          <List.Item
            title={light.name}
            subtitle={light.ip}
          />
        );
      })}
    </List>
  );
}

export default function Command() {
  return (
    <ViewLights />
  )
}