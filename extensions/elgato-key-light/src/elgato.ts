import axios from "axios";
import { RemoteService } from "bonjour";
import { waitUntil } from "./utils";

const WARM_TEMPERATURE = 344; // 2900k
const COLD_TEMPERATURE = 143; // 7000k
const TEMPERATURE_STEP = (WARM_TEMPERATURE - COLD_TEMPERATURE) / 20; // 5%

export interface Light {
  ip: string;
  port: number;
  name: string;
}

export class KeyLight implements Light {
  ip: string;
  port: number;
  name: string;

  constructor(service: RemoteService) {
    this.ip = service.referer.address;
    this.port = service.port;
    this.name = service.name;
  }

  async toggle() {
    try {
      const keyLight = await this.getKeyLight();
      const newState = !keyLight.on;
      await this.updateKeyLight({ on: newState });
      return newState;
    } catch (e) {
      throw new Error("Failed toggling Key Light");
    }
  }

  async increaseBrightness() {
    try {
      const keyLight = await this.getKeyLight();
      const newBrightness = Math.min(keyLight.brightness + 5, 100);
      await this.updateKeyLight({ brightness: newBrightness });
      return newBrightness;
    } catch (e) {
      throw new Error("Failed increasing brightness");
    }
  }

  async decreaseBrightness() {
    try {
      const keyLight = await this.getKeyLight();
      const newBrightness = Math.max(keyLight.brightness - 5, 0);
      await this.updateKeyLight({ brightness: newBrightness });
      return newBrightness;
    } catch (e) {
      throw new Error("Failed decreasing brightness");
    }
  }

  async increaseTemperature() {
    try {
      const keyLight = await this.getKeyLight();
      const newTemperature = Math.min(keyLight.temperature + TEMPERATURE_STEP, WARM_TEMPERATURE);
      await this.updateKeyLight({ temperature: newTemperature });
    } catch (e) {
      throw new Error("Failed increasing temperature");
    }
  }

  async decreaseTemperature() {
    try {
      const keyLight = await this.getKeyLight();
      const newTemperature = Math.max(keyLight.temperature - TEMPERATURE_STEP, COLD_TEMPERATURE);
      await this.updateKeyLight({ temperature: newTemperature });
    } catch (e) {
      throw new Error("Failed decreasing temperature");
    }
  }

  private async getKeyLight() {
    const url = `http://${this.ip}:${this.port}/elgato/lights`;
    const response = await axios.get(url);
    return response.data.lights[0];
  }

  private async updateKeyLight(
    options: { brightness?: number; temperature?: number; on?: boolean }
  ) {
    const url = `http://${this.ip}:${this.port}/elgato/lights`;
    await axios.put(url, {
      lights: [
        {
          ...options,
        },
      ],
    });
  }
}
