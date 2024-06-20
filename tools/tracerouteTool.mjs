import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";
import { exec } from 'child_process';
import { promisify } from 'util';

const execPromise = promisify(exec);

export const tracerouteTool = new DynamicStructuredTool({
  name: "traceroute",
  description: "perform and return traceroute to internet host",
  schema: z.object({
    host: z.string().ip({ version: "v4"}).describe("target IPv4 host address")
  }),
  func: async({ host }) => {
    console.log("tracerouteTool invoked for ", host);
    const command = `traceroute -A -N 64 -n ${host}`;
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
const testTracerouteTool = async () => {
  const result = await tracerouteTool.func({host: "wp.pl"});
  console.log("Test result: ", result);
};

// Check if this file is being run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  testTracerouteTool();
}
