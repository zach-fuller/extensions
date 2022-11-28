import axios from "axios";
import Bonjour, { RemoteService } from "bonjour";
import { resolve } from "path";
import { waitUntil } from "./utils";

class ControlCenter {
    public keyLights: RemoteService[];  
    async discover() {
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
}