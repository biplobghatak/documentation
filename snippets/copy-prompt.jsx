export const CopyPrompt = ({ app = "any" }) => {
  const [copied, setCopied] = useState(false);

  const URL_ = "https://mcp.spyro.app/mcp";

  const rules = [
    "RULES",
    "- Never ask me to paste an API key into this chat, and never write a key into a file that could be committed. If I want key based access I will create a key myself in Spyro AI (Settings, MCP, Create MCP key) and put it in an environment variable named SPYRO_AI_MCP_KEY.",
    "- Never put a credential in the server URL or in a query string. Spyro AI only accepts credentials in the Authorization: Bearer header or the X-API-Key header.",
    "- Keep every existing setting and every existing MCP server. Make a backup copy of any config file before you change it, and only change the Spyro AI entry.",
    "- Do not call any manage tool (manageCalendar, manageArticle and the rest) or anything else that changes my Spyro AI data or spends credits. Setup and testing must only use free read tools.",
  ].join("\n");

  const facts = [
    "FACTS ABOUT THE SERVER",
    "- Product: Spyro AI (SEO and AI visibility platform). Server name to use in config: spyro-ai",
    "- URL: " + URL_,
    "- Transport: streamable HTTP (remote server, POST only, stateless). Not SSE and not stdio.",
    "- Sign in: OAuth 2.1 with PKCE. I sign in myself in my browser, choose which workspaces the app may use, choose Read or Read and take actions, and set a daily credit limit. Prefer Read.",
    "- Key option: Authorization: Bearer sk_mcp_... or X-API-Key: sk_mcp_... (one workspace per key).",
    "- Requirements: I must be an admin of the Spyro AI workspace, the plan must include MCP (every plan except AppSumo License Tier 1) and the subscription must be active.",
    "- Reading my own Spyro AI data is free. Tools that search the web, read pages or run a model cost 10 credits per call. The manage tools make changes; every change waits for me to confirm it in Spyro AI (in the chat, or through a spyro.app/mcp/confirm link, after which the same call is repeated for the result).",
  ].join("\n");

  const verify = [
    "VERIFY IT WORKS",
    "1. Confirm the server shows as connected and lists tools (for example getWorkspaceSnapshot, getAuditIssues, getRankSummary, getAiVisibility, getSiteAudit, researchWeb).",
    "2. Call getWorkspaceSnapshot (free) and summarise my workspace in 3 lines.",
    "3. Call getAuditIssues with severity critical and limit 5, and show the top issue.",
    "4. If more than one workspace is connected, call listWorkspaces first and ask me which workspace to use, then pass its id as the workspace argument on later calls.",
  ].join("\n");

  const fix = [
    "IF SOMETHING FAILS",
    "- 401 Missing credential or Invalid or expired access token: sign in again. For a key, check the header name, the Bearer prefix and that the key was not revoked.",
    "- 403 MCP is not included in your plan, or subscription is not active: tell me, this is a Spyro AI account matter and cannot be fixed in config.",
    "- Cannot connect: check the URL is exactly " + URL_ + " with no trailing characters, that the transport is HTTP (streamable), and restart the app after editing config files.",
    "- Out of credits or rate limited: stop and tell me. Do not retry in a loop.",
  ].join("\n");

  const report = [
    "WHEN YOU ARE DONE, REPORT",
    "1. What you changed (file path and the exact entry you added).",
    "2. What I still have to do myself (for example the browser sign in).",
    "3. The result of the verification calls.",
    "4. Anything that failed and what you tried.",
  ].join("\n");

  const wrap = (goal, steps) =>
    [
      "ROLE",
      "You are my setup assistant. " + goal,
      "",
      facts,
      "",
      "STEPS",
      steps.join("\n"),
      "",
      verify,
      "",
      rules,
      "",
      fix,
      "",
      report,
    ].join("\n");

  const prompts = {
    any: wrap(
      "Connect the Spyro AI MCP server to the AI app or agent you are running in, and learn how to use it.",
      [
        "1. Work out which app you are running in (for example Claude Code, Codex, Cursor, VS Code with Copilot, Gemini CLI, Antigravity, Windsurf, claude.ai, ChatGPT or Gemini). If you are not sure, ask me.",
        "2. If you can run commands and your app supports agent skills, install the Spyro AI skill: npx -y skills add https://spyro.app/docs --skill spyro-ai. If you cannot install it, read https://spyro.app/docs/.well-known/agent-skills/spyro-ai/SKILL.md and follow it.",
        "3. Check whether spyro-ai is already connected. If it is, skip to the verification.",
        "4. Add the server with browser sign in, using your app's own method:\n- Claude Code: claude mcp add --transport http spyro-ai " + URL_ + ", then tell me to run /mcp and sign in.\n- Codex: codex mcp add spyro-ai --url " + URL_ + ", then tell me to run codex mcp login spyro-ai.\n- Cursor: under \"mcpServers\" in .cursor/mcp.json or ~/.cursor/mcp.json add \"spyro-ai\": { \"url\": \"" + URL_ + "\" }, then tell me to restart Cursor and sign in from its MCP settings.\n- VS Code: under \"servers\" (not \"mcpServers\") in .vscode/mcp.json add \"spyro-ai\": { \"type\": \"http\", \"url\": \"" + URL_ + "\" }, then tell me to click Start and sign in.\n- Gemini CLI: under \"mcpServers\" in ~/.gemini/settings.json add \"spyro-ai\": { \"httpUrl\": \"" + URL_ + "\" }, then tell me to run /mcp auth spyro-ai.\n- Antigravity (app or IDE): under \"mcpServers\" in ~/.gemini/config/mcp_config.json add \"spyro-ai\": { \"serverUrl\": \"" + URL_ + "\" }, then tell me to click Authenticate next to spyro-ai in MCP Servers, sign in, and paste the code Antigravity shows into Enter authorization code.\n- Windsurf: under \"mcpServers\" in ~/.config/devin/mcp_config.json add \"spyro-ai\": { \"serverUrl\": \"" + URL_ + "\" }.\n- An app that only runs local servers: use the command npx -y mcp-remote " + URL_ + ".\n- Anything else: follow https://spyro.app/docs/product/mcp-connect",
        "5. Ask me before you write to a project file shared with my team or to a global config file.",
        "6. If you are a chat app that cannot change its own settings (claude.ai, Claude Desktop, ChatGPT, Gemini), guide me one step at a time instead: give one step, wait for me to confirm, then give the next. The steps for each app are at https://spyro.app/docs/product/mcp-connect",
        "7. Tell me to sign in in my browser, tick the workspaces the app may use, choose Read your data and click Allow.",
      ],
    ),
    "claude-code": wrap(
      "Connect the Spyro AI MCP server to Claude Code on this machine.",
      [
        "1. Run: claude mcp list. If spyro-ai already exists, run claude mcp get spyro-ai and check its URL instead of adding it again.",
        "2. Add it with browser sign in (recommended): claude mcp add --transport http spyro-ai " + URL_,
        "3. Choose the scope with --scope: local (default, just me in this project), project (writes .mcp.json shared with my team) or user (all my projects). Ask me which one I want before you pick project or user.",
        "4. If I want key based access (CI, headless machine): export SPYRO_AI_MCP_KEY first, then run: claude mcp add --transport http spyro-ai " + URL_ + " --header \"Authorization: Bearer $SPYRO_AI_MCP_KEY\". For a shared .mcp.json use \"headers\": { \"Authorization\": \"Bearer ${SPYRO_AI_MCP_KEY}\" } so no key is committed.",
        "5. Tell me to start Claude Code, run /mcp, choose spyro-ai and sign in in my browser (browser sign in only).",
        "6. Run claude mcp list and confirm spyro-ai is connected.",
      ],
    ),
    codex: wrap(
      "Connect the Spyro AI MCP server to OpenAI Codex on this machine.",
      [
        "1. Open ~/.codex/config.toml (create it if missing). Keep all existing tables. Codex uses snake case: the table is mcp_servers, not mcpServers.",
        "2. Add this table if spyro-ai is not there yet:\n[mcp_servers.spyro-ai]\nurl = \"" + URL_ + "\"\nOr run: codex mcp add spyro-ai --url " + URL_,
        "3. For browser sign in, tell me to run: codex mcp login spyro-ai",
        "4. For key based access: bearer_token_env_var holds the NAME of an environment variable, not the key. Add bearer_token_env_var = \"SPYRO_AI_MCP_KEY\" to the table, and tell me to export SPYRO_AI_MCP_KEY in the same shell that starts Codex. If the variable is missing at start, the server fails to connect.",
        "5. Optional: a project can use .codex/config.toml, but only in a trusted project. Ask me before adding it there.",
        "6. Run: codex mcp list and confirm spyro-ai is listed.",
      ],
    ),
    cursor: wrap(
      "Connect the Spyro AI MCP server to Cursor.",
      [
        "1. Decide the file: .cursor/mcp.json in this project, or ~/.cursor/mcp.json for all projects. Ask me which one. Create it if missing and keep every existing server.",
        "2. Under \"mcpServers\" add:\n\"spyro-ai\": { \"url\": \"" + URL_ + "\" }",
        "3. For key based access use env interpolation so no key is in the file:\n\"spyro-ai\": { \"url\": \"" + URL_ + "\", \"headers\": { \"Authorization\": \"Bearer ${env:SPYRO_AI_MCP_KEY}\" } }\nand tell me to set SPYRO_AI_MCP_KEY in my environment.",
        "4. Tell me to restart Cursor, because the MCP panel reads the file on launch.",
        "5. Tell me to open Cursor MCP settings, find spyro-ai and sign in when asked (Cursor uses one fixed OAuth callback that Spyro AI already allows, so no OAuth client is needed).",
        "6. Remind me that if mcp.json is committed it must use the ${env:...} form.",
      ],
    ),
    vscode: wrap(
      "Connect the Spyro AI MCP server to Visual Studio Code (GitHub Copilot agent mode).",
      [
        "1. Open .vscode/mcp.json in this project (create it if missing), or use the command palette: MCP: Add Server, then HTTP. Keep every existing server.",
        "2. The top level key is \"servers\" (not \"mcpServers\", that is the format of other editors). Add:\n\"spyro-ai\": { \"type\": \"http\", \"url\": \"" + URL_ + "\" }",
        "3. For key based access add an inputs entry so VS Code prompts for the key and stores it securely:\n\"inputs\": [ { \"type\": \"promptString\", \"id\": \"spyro-ai-key\", \"description\": \"Spyro AI MCP key\", \"password\": true } ]\nand \"headers\": { \"Authorization\": \"Bearer ${input:spyro-ai-key}\" } on the server.",
        "4. Tell me to click Start above the server in the file (or run MCP: List Servers) and sign in when VS Code asks.",
        "5. Tell me to open Copilot Chat, switch to Agent mode and check that the spyro-ai tools are ticked in the tools picker. Suggest unticking the nine manage tools (manageCalendar, manageArticle, managePublishing, managePrompts, manageKeywords, manageSiteAudit, manageInternalLinks, manageCompetitors, manageSettings) to stay read only.",
        "6. Suggest adding .vscode/mcp.json to .gitignore if it holds anything sensitive.",
      ],
    ),
    antigravity: wrap(
      "Connect the Spyro AI MCP server to Google Antigravity (the desktop app or the IDE).",
      [
        "1. Decide the file: ~/.gemini/config/mcp_config.json for all projects, or .agents/mcp_config.json in this project only. Ask me which one. Create it if missing and keep every existing server.",
        "2. Under \"mcpServers\" add (serverUrl selects streamable HTTP; httpUrl is not supported):\n\"spyro-ai\": { \"serverUrl\": \"" + URL_ + "\" }",
        "3. Optional, to stay read only, add \"disabledTools\": [\"manageCalendar\", \"manageArticle\", \"managePublishing\", \"managePrompts\", \"manageKeywords\", \"manageSiteAudit\", \"manageInternalLinks\", \"manageCompetitors\", \"manageSettings\"] to the same entry.",
        "4. Tell me to open MCP Servers (app: Customizations, then Installed; IDE: the ... menu of the agent panel, then MCP Servers, Manage MCP Servers), click Authenticate next to spyro-ai and sign in in my browser, then paste the authorization code the browser shows into Enter authorization code and click Submit.",
        "5. Only if sign in is impossible, add a key header \"headers\": { \"Authorization\": \"Bearer <key>\" } in the global file, never in a project file that is committed, because the key is stored as plain text.",
        "6. Tell me to check that spyro-ai shows a green status dot and its tools.",
      ],
    ),
    "gemini-cli": wrap(
      "Connect the Spyro AI MCP server to Gemini CLI.",
      [
        "1. Open ~/.gemini/settings.json (or .gemini/settings.json for this project only). Create it if missing and keep every existing setting.",
        "2. Under \"mcpServers\" add (httpUrl selects the streamable HTTP transport, plain url would mean the older SSE transport):\n\"spyro-ai\": { \"httpUrl\": \"" + URL_ + "\" }\nOr run: gemini mcp add --transport http spyro-ai " + URL_,
        "3. Optional, to stay read only, add \"excludeTools\": [\"manageCalendar\", \"manageArticle\", \"managePublishing\", \"managePrompts\", \"manageKeywords\", \"manageSiteAudit\", \"manageInternalLinks\", \"manageCompetitors\", \"manageSettings\"] to the same entry.",
        "4. For key based access add \"headers\": { \"Authorization\": \"Bearer $SPYRO_AI_MCP_KEY\" } and tell me to export SPYRO_AI_MCP_KEY. If my version does not expand the variable, tell me and do not hardcode the key.",
        "5. Tell me to start Gemini CLI and run /mcp auth spyro-ai, then sign in in my browser.",
        "6. Tell me to run /mcp to confirm spyro-ai and its tools are loaded.",
      ],
    ),
    claude: wrap(
      "You cannot edit my Claude settings yourself, so guide me through connecting the Spyro AI MCP server to Claude (claude.ai and Claude Desktop) one step at a time. Give one step, wait for me to confirm, then give the next.",
      [
        "1. Tell me to open Customize, then Connectors, click + Add, then Add custom connector.",
        "2. Tell me to name it Spyro AI, paste " + URL_ + " as the server URL, and leave the advanced OAuth client fields empty (Claude registers itself).",
        "3. Tell me to click Add, then Connect, sign in to Spyro AI, tick the workspaces Claude may use, choose Read your data, and click Allow.",
        "4. If I am on a Team or Enterprise plan, explain that an owner first adds it in Organization settings, Connectors, Add, Custom, Web, and that members then click Connect themselves.",
        "5. Tell me to enable the Spyro AI connector in a new chat from the tools or connectors menu.",
      ],
    ),
    chatgpt: wrap(
      "You cannot edit my ChatGPT settings yourself, so guide me through connecting the Spyro AI MCP server to ChatGPT one step at a time. Give one step, wait for me to confirm, then give the next.",
      [
        "1. Tell me to open chatgpt.com/plugins, click the plus button and choose Add custom MCP server. Menu names change, so if I do not see it, tell me to look in Settings for Connectors or Apps and a developer mode switch.",
        "2. Tell me to name it Spyro AI, paste " + URL_ + " under Connection and choose OAuth.",
        "3. Tell me to read the risk notice, click I understand and want to continue, then Create as a plugin, install the plugin from my plugins list and sign in to Spyro AI, tick the workspaces, choose Read your data and click Allow.",
        "4. Explain that on Business, Enterprise and Education workspaces a ChatGPT admin may need to allow custom MCP servers first, and that availability depends on my plan.",
        "5. Tell me to start a new chat, enable Spyro AI from the tools menu and run the verification.",
      ],
    ),
    gemini: wrap(
      "You cannot edit my Gemini settings yourself, so guide me through connecting the Spyro AI MCP server to Gemini one step at a time. Give one step, wait for me to confirm, then give the next. First ask whether I use the Gemini app (Developer Mode) or Gemini Enterprise.",
      [
        "GEMINI APP: 1. Tell me to open gemini.google.com/devmode, click + Create new, and paste " + URL_ + " as the MCP Server URL, leaving client settings empty. 2. Tell me to accept the confirmation, click Connect, name the app Spyro AI and sign in, tick the workspaces, choose Read your data and click Allow.",
        "GEMINI ENTERPRISE (admins only): 1. Tell me to create an OAuth client in Spyro AI under Settings, MCP, OAuth clients, Create OAuth client, with redirect URI https://vertexaisearch.cloud.google.com/oauth-redirect, and copy the client ID and secret (the secret is shown once). 2. Tell me to open the Google Cloud console, then Gemini Enterprise, Apps, my app, Connected data stores, New data store, search for Custom MCP Server and click Add MCP server. 3. Tell me to choose OAuth 2.0 and enter: Server URL " + URL_ + ", Authorization URL https://spyro.app/mcp/authorize, Token URL https://mcp.spyro.app/oauth/token, Scopes spyro.read, plus my client ID and secret, and to turn on Enable PKCE Support (Spyro AI requires PKCE). 4. Tell me to finish the steps, sign in and turn the connector on. If the Custom MCP Server option is missing, explain that a Google Cloud organization policy may block it.",
      ],
    ),
  };

  const prompt = prompts[app] || "";

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(prompt);
    } catch (e) {
      const area = document.createElement("textarea");
      area.value = prompt;
      area.setAttribute("readonly", "");
      area.style.position = "fixed";
      area.style.opacity = "0";
      document.body.appendChild(area);
      area.select();
      document.execCommand("copy");
      document.body.removeChild(area);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="not-prose mb-6">
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm text-zinc-500 dark:text-zinc-400">
          Let your AI agent configure this for you
        </span>
        <button
          type="button"
          onClick={copy}
          aria-label="Copy configuration prompt"
          className="shrink-0 rounded-lg px-3 py-1.5 text-sm font-medium text-white"
          style={{ backgroundColor: "#ec5a00" }}
        >
          {copied ? "Copied" : "Copy prompt"}
        </button>
      </div>
      <details className="mt-2 rounded-xl border border-zinc-200 dark:border-white/10">
        <summary className="cursor-pointer px-4 py-2 text-sm text-zinc-600 dark:text-zinc-300">
          Preview the prompt
        </summary>
        <pre
          className="m-0 max-h-96 overflow-auto whitespace-pre-wrap break-words border-t border-zinc-200 px-4 py-3 text-xs leading-relaxed text-zinc-700 dark:border-white/10 dark:text-zinc-300"
          style={{ fontFamily: "inherit" }}
        >
          {prompt}
        </pre>
      </details>
      <span className="sr-only" role="status" aria-live="polite">
        {copied ? "Prompt copied to clipboard" : ""}
      </span>
    </div>
  );
};
