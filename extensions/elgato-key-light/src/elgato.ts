import axios from "axios";
import Bonjour, { RemoteService } from "bonjour";
import { resolve } from "path";
import { waitUntil } from "./utils";

const WARM_TEMPERATURE = 344; // 2900k
const COLD_TEMPERATURE = 143; // 7000k
const TEMPERATURE_STEP = (WARM_TEMPERATURE - COLD_TEMPERATURE) / 20; // 5%

export class KeyLight {
  public keyLights: RemoteService[];
  
  async discover() {
    console.log("EHEKEHJKEKJ")
    const bonjour = Bonjour();
    const find = bonjour.find({ type: "elg" });
    const result = new Promise<RemoteService[]>((resolve) => {
      find.on("up", (service: RemoteService) => {
        this.keyLights.push(service);
        console.log("UP ZACH")
        if (this.keyLights.length > 1) {
          resolve(this.keyLights);
        }
      });
    })

    return waitUntil(result, { timeoutMessage: "Cannot discover any Key Lights in the network" });

  }

  constructor() {
    this.keyLights = [];
  }

  async toggleAll() {
    console.log(this.keyLights.length)
    for (const service of this.keyLights) {
      await this.toggle(service);
    }
  }

  async toggle(service: RemoteService) {
    try {
      console.log("TOGGLIGN");
      const keyLight = await this.getKeyLight(service);
      console.log(keyLight);
      const newState = !keyLight.on;
      await this.updateKeyLight(service, { on: newState });

      return newState;
    } catch (e) {
      throw new Error("Failed toggling Key Light");
    }
  }

  async increaseBrightness(service: RemoteService) {
    try {
      const keyLight = await this.getKeyLight(service);
      const newBrightness = Math.min(keyLight.brightness + 5, 100);
      await this.updateKeyLight(service, { brightness: newBrightness });
      return newBrightness;
    } catch (e) {
      throw new Error("Failed increasing brightness");
    }
  }

  async decreaseBrightness(service: RemoteService) {
    try {
      const keyLight = await this.getKeyLight(service);
      const newBrightness = Math.max(keyLight.brightness - 5, 0);
      await this.updateKeyLight(service, { brightness: newBrightness });
      return newBrightness;
    } catch (e) {
      throw new Error("Failed decreasing brightness");
    }
  }

  async increaseTemperature(service: RemoteService) {
    try {
      const keyLight = await this.getKeyLight(service);
      const newTemperature = Math.min(keyLight.temperature + TEMPERATURE_STEP, WARM_TEMPERATURE);
      await this.updateKeyLight(service, { temperature: newTemperature });
    } catch (e) {
      throw new Error("Failed increasing temperature");
    }
  }

  async decreaseTemperature(service: RemoteService) {
    try {
      const keyLight = await this.getKeyLight(service);
      const newTemperature = Math.max(keyLight.temperature - TEMPERATURE_STEP, COLD_TEMPERATURE);
      await this.updateKeyLight(service, { temperature: newTemperature });
    } catch (e) {
      throw new Error("Failed decreasing temperature");
    }
  }

  private async getKeyLight(service: RemoteService) {
    const url = `http://${service.referer.address}:${service.port}/elgato/lights`;
    const response = await axios.get(url);
    return response.data.lights[0];
  }

  private async updateKeyLight(
    service: RemoteService,
    options: { brightness?: number; temperature?: number; on?: boolean }
  ) {
    const url = `http://${service.referer.address}:${service.port}/elgato/lights`;
    await axios.put(url, {
      lights: [
        {
          ...options,
        },
      ],
    });
  }
}
