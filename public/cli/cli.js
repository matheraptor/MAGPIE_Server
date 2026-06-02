/**
 * @namespace MAGPIE_CLI
 * @author Matheraptor
 * @version 0.31.0
 * 
 */
const MAGPIE_CLI = {};
MAGPIE_CLI.meta = {
    name: "M.A.G.P.I.E. C.L.I.",
    desc: "",
    version: "0.31.0"
}

const output = document.getElementById('terminal-output');
const input = document.getElementById('cli-input');
/**
 * @name 
 * @desc 
 * 
 */
//========================================================================
// #region - KEY
//========================================================================
MAGPIE_CLI.UI = {};
MAGPIE_CLI.UI.SEPARATOR = "--------------------------------------------------"
/**
 * 
 * @desc back to {@link }
 *
 */
//========================================================================
// #endregion - 
//========================================================================
/**
 * @name 
 * @desc 
 * 
 */
//========================================================================
// #region - TUI
//========================================================================
async function printLine(text, type = "info", delay = 20)
{
    const line = document.createElement("div");
    line.className = `line ${type}`;
    output.appendChild(line);
    // simulate typing effect
    for(let i = 0; i < text.length; i++)
    {
        line.innerText += text[i];
        await new Promise(res => setTimeout(res, delay));
        // auto-scroll to bottom
        output.scrollTop = output.scrollHeight;
    }
}
function clearTerminal()
{
    output.innerHTML = ""
}
/**
 * 
 * @desc back to {@link }
 *
 */
//========================================================================
// #endregion - 
//========================================================================
/**
 * @name 
 * @desc 
 * 
 */
//========================================================================
// #region - CMD
//========================================================================
const commands = {
    'help': async () => {
        await printLine("Available Commands:", "info");
        await printLine("  - help       : Display this menu", "info");
        await printLine("  - clear      : clears the terminal screen", "info");
        await printLine("  - register   : begin player registration process", "info");
        await printLine("  - status     : check server connection status", "info");
        await printLine("  - exit       : return to main landing page", "info");
    },
    'clear': () => {
        clearTerminal();
    },
    'status': async () => {
        await printLine("Connecting to MAGPIE_Server...", "info");
        // @todo CLI socket check
        await printLine("STATUS: ONLINE", "success");
        await printLine("LATENCY: 24ms", "info");
    },
    'register': async () => {
        await printLine("Initializing player registration protocol...", "info");
        await printLine("Please, enter your desired 'username':", "info");
        // @todo CLI registration flow
    },
    'exit': () => {
        window.location.href = "/";
    }
}

/**
 * 
 * @desc back to {@link }
 *
 */
//========================================================================
// #endregion - 
//========================================================================
/**
 * @name 
 * @desc 
 * 
 */
//========================================================================
// #region - Events
//========================================================================
input.addEventListener('keydown', async (e) => {
    if(e.key === 'Enter') 
    {
        const rawInput = input.value.trim();
        const cmd = rawInput.toLowerCase();
        // echo the command to the terminal
        await printLine(`USER@MAGPIE:> ${rawInput}`, "user");
        input.value = "";
        if(cmd === "") return;
        if(commands[comd])
            await commands[cmd]()
        else
            await printLine(`Command not found: ${cmd}. Type 'help' for a list of commands.`, "error");
    }
})
/**
 * 
 * @desc back to {@link }
 *
 */
//========================================================================
// #endregion - 
//========================================================================
/**
 * @name 
 * @desc 
 * 
 */
//========================================================================
// #region - BOOT
//========================================================================
async function boot() 
{
    await printLine(`M.A.G.P.I.E. OS v${MAGPIE_CLI.meta.version}`);
    await printLine("Loading kernel modules...", "info", 30);
    await printLine("Establishing secure link to MAGPIE_Server...", "info", 30);
    await printLine("Link established. Welcome, 'user'.", "success", 50);
    await printLine(MAGPIE_CLI.UI.SEPARATOR, "info", 10);
    await printLine("Type 'help' to see available commands.", "info", 20);
    await printLine(MAGPIE_CLI.UI.SEPARATOR, "info", 10);
}
boot();
/**
 * 
 * @desc back to {@link }
 *
 */
//========================================================================
// #endregion - 
//========================================================================