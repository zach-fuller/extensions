import Bonjour, { RemoteService } from "bonjour";
import { KeyLight } from "./elgato";
import { waitUntil } from "./utils";
import { getPreferenceValues } from "@raycast/api";

export class ControlCenter {
    public keyLights: KeyLight[];  

    constructor(keyLights: KeyLight[] = []) {
        this.keyLights = keyLights;
    }

    async discover(all: boolean) {
        const bonjour = Bonjour();
        const find = bonjour.find({ type: "elg" });
        const { lightCount } = getPreferenceValues();
        const count: number = +lightCount;
        this.keyLights = []
        const result = new Promise<KeyLight[]>((resolve) => {
          find.on("up", (service: RemoteService) => {
            const light = new KeyLight(service);
            console.log(`${count}, ${this.keyLights.length}`)
            this.keyLights.push(light);
            if (!all) {
              resolve(this.keyLights);
            }
            if (this.keyLights.length == count) {
              resolve(this.keyLights);
            }
          });
        })
    
        return waitUntil(result, { timeout: 3000, timeoutMessage: "Cannot discover any Key Lights in the network" });
    
      }
}