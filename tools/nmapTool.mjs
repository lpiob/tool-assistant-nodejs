import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";
import { exec } from 'child_process';
import { promisify } from 'util';

const execPromise = promisify(exec);

export const nmapTool = new DynamicStructuredTool({
  name: "nmap",
  description: "perform port scanning using nmap",
  schema: z.object({
    host: z.string().describe("target IP or DNS host address")
  }),
  func: async({ host }) => {
    console.log("nmapTool invoked for ", host);
    const command = `nmap -P0 ${host}`;
    try {
      const { stdout, stderr } = await execPromise(command);
      if (stderr) {
        return stderr;
      }
      return stdout;
    } catch (error) {
      return `Error: ${error.message}`;
    }    
  },
});

// Manual test function
const testNmapTool = async () => {
  const result = await nmapTool.func({host: "localhost"});
  console.log("Test result: ", result);
};

// Check if this file is being run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  testNmapTool();
}
