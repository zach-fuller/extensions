import axios from "axios";
import Bonjour, { RemoteService } from "bonjour";
import { KeyLight } from "./elgato";
import { getPreferenceValues } from "@raycast/api";
import { LocalStorage } from "@raycast/api";

const WARM_TEMPERATURE = 344; // 2900k
const COLD_TEMPERATURE = 143; // 7000k
const TEMPERATURE_STEP = (WARM_TEMPERATURE - COLD_TEMPERATURE) / 20; // 5%

interface Preferences {
  lightCount: string;
}

export class ControlCenter {
  private lights: KeyLight[];

  async discover() {
    const bonjour = Bonjour();
    const preferences = getPreferenceValues<Preferences>();
    const count = preferences.lightCount;

    if (this.lights.count == count) {
      return this.lights;
    }

    const find = new Promise<KeyLight[]>((resolve) => {
      bonjour.find({ type: "elg" }, (service) => {
        const keyLight = new KeyLight(service);
        this.lights.push(keyLight);
        const storedLights = await LocalStorage.getItem<string[]>("stored-lights");
        storedLights.push(service.name);
        console.log(storedLights)
        awati LocalStorage.setItem("stored-lights", storedLights)

        console.log("Discovered Keylight" + keyLight.name);
        if (this.lights.length == parseInt(count)) {
          console.log("Toggling");
          bonjour.destroy();
          resolve(this.lights);
        } else {
          console.log("Not enough lights");
        }
      });
    });

    return await find;
  }

  async toggle() {
    for await (const light of this.lights) {
      await light.toggle();
    }

    const preferences = getPreferenceValues<Preferences>();
    return preferences.lightCount;
  }

  constructor(lights: KeyLight[] = []) {
    this.lights = lights;
  }
}
