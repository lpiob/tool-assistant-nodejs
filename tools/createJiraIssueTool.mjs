import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";
import { exec } from 'child_process';

// https://confluence.atlassian.com/jirakb/how-to-create-issues-using-direct-html-links-in-jira-server-159474.html
const base_create_issue_url = "https://jira.unity.pl/secure/CreateIssueDetails!init.jspa?pid=11706&issuetype=11602"

export const createJiraIssueTool = new DynamicStructuredTool({
  name: "createJiraIssue",
  description: "create a single Jira issue",
  schema: z.object({
    summary: z.string().min(3).max(255).describe("short issue summary"),
    description: z.string().describe("full issue description")
  }),
  func: async({ summary, description }) => {
    console.log("createJiraIssueTool invoked for ", summary);
    const summary_encoded = encodeURIComponent(summary);
    const description_encoded = encodeURIComponent(description);
    const command = `gio open "${base_create_issue_url}&summary=${summary_encoded}&description=${description_encoded}"`;
    await exec(command);
    return "Issue was created. User is seeing confirmation in another window.";
  },
});

// Manual test function
const testTool = async () => {
  const result = await createJiraIssueTool.func({summary: "Issue summary", description: "Lorem ipsum"});
  console.log("Test result: ", result);
};

// Check if this file is being run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  testTool();
}
