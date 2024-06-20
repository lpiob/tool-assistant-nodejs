import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";
import { exec } from 'child_process';

export const sendEmailTool = new DynamicStructuredTool({
  name: "sendEmail",
  description: "send an email immediately",
  schema: z.object({
    recipient: z.string().email().describe("e-mail recipient address"),
    subject: z.string().min(3).max(255).describe("e-mail subject"),
    body: z.string().describe("e-mail content in plain text")
  }),
  func: async({ recipient, subject, body }) => {
    console.log("emailTool invoked for ", recipient, subject, body);
    const subject_encoded = encodeURIComponent(subject);
    const body_encoded = encodeURIComponent(body);
    const command = `gio open "mailto:lbiegaj@unity.pl?subject=${subject_encoded}&body=${body_encoded}"`;
    await exec(command);
    return "Email was prepared. User is seeing a confirmation dialog with final content in a separate window.";
  },
});

