import * as readline from 'node:readline/promises';
import chalk from 'chalk';
import { AIMessage, HumanMessage, FunctionMessage, ToolMessage } from "@langchain/core/messages";
import { ChatPromptTemplate, MessagesPlaceholder } from "@langchain/core/prompts";
import { ChatOpenAI } from "@langchain/openai";
import { createOpenAIFunctionsAgent } from "langchain/agents";
import { AgentExecutor } from "langchain/agents";
import { ChatMessageHistory } from "langchain/stores/message/in_memory";
import { RunnableWithMessageHistory } from "@langchain/core/runnables";
import { TavilySearchResults } from "@langchain/community/tools/tavily_search";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: "You> ",
});

// TOOLS
const searchTool = new TavilySearchResults();
import { multiplyTool } from './tools/multiplyTool.mjs';
import { sendEmailTool } from './tools/sendEmailTool.mjs';
import { tracerouteTool } from './tools/tracerouteTool.mjs';
import { nmapTool } from './tools/nmapTool.mjs';
import { createJiraIssueTool } from './tools/createJiraIssueTool.mjs';
import { getWeekSchedule } from './tools/getWeekSchedule.mjs';
const tools = [searchTool, multiplyTool, sendEmailTool, tracerouteTool, nmapTool, createJiraIssueTool, getWeekSchedule];
//

const prompt = ChatPromptTemplate.fromMessages([
  ["system", "You are very powerful assistant, but don't know current events"],
  new MessagesPlaceholder("chat_history"),
  ["human", "{input}"],
  new MessagesPlaceholder("agent_scratchpad"),
]);

const llm = new ChatOpenAI({
  model: "gpt-4o",
  temperature: 0,
});

const agent = await createOpenAIFunctionsAgent({
  llm,
  tools,
  prompt,
});

const agentExecutor = new AgentExecutor({
  agent,
  tools,
});

const messageHistory = new ChatMessageHistory();

const agentWithChatHistory = new RunnableWithMessageHistory({
  runnable: agentExecutor,
  getMessageHistory: (_sessionId) => messageHistory,
  inputMessagesKey: "input",
  historyMessagesKey: "chat_history",
});

console.log("Start the conversation:");

while (true) {
  const user_input = await rl.question("");
  console.log(chalk.white.bold('You: '), chalk.green(user_input));
  const result = await agentWithChatHistory.invoke({
    input: user_input,
  }, { configurable: { sessionId: "foo" }});
  console.log(chalk.white.bold('LLM: '), chalk.cyan(result.output));
}

rl.close();

