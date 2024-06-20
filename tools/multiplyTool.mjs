import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";

export const multiplyTool = new DynamicStructuredTool({
  name: "multiply",
  description: "multiply two numbers together",
  schema: z.object({
    a: z.number().describe("the first number to multiply"),
    b: z.number().describe("the second number to multiply"),
  }),
  func: async ({ a, b }) => {
    console.log("Multiply tool invoked for ", a, b);
    return (a * b).toString();
  },
});

