/**
 * @namespace MAGPIE_CLI
 * @author Matheraptor
 * @version 0.31.1
 * 
 */
const MAGPIE_CLI = {};
MAGPIE_CLI.meta = {
    name: "M.A.G.P.I.E. C.L.I.",
    desc: "",
    version: "0.31.1"
}

// Registration state machine
MAGPIE_CLI.state = {
    mode: "idle", // idle, registering_username, registering_password
    tempData: {
        username: "",
        password: ""
    }
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
// #region - SOCKET
//========================================================================
function initSocket()
{
    MAGPIE_CLI.socket = io();
    MAGPIE_CLI.socket.on("REGISTER_SUCCESS", async (data) => {
        await printLine(`Registration successful. Welcome, ${data.username}!`, "success");
    })
    MAGPIE_CLI.socket.on("REGISTER_ERROR", async (data) => {
        await printLine(`Registration failed: ${data.message}`, "error")
    })
    MAGPIE_CLI.socket.on("connect_error", async () => {
        await printLine("Connection error. Server may be offline.", "error")
    })
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
// #region - ACCOUNT
//========================================================================
/**
 * @name 
 * @desc 
 * 
 */
//------------------------------------------------------------------------
// #region > Hash
//------------------------------------------------------------------------
async function hashPassword(password)
{
    const msgUint8 = new TextEncoder().encode(password);
    const hashBuffer = await crypto.subtle.digest("SHA-256", msgUint8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, "0")).join("")
}
// #endregion
//------------------------------------------------------------------------
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
async function printLine(text, type = "info", delay = 50)
{
    const line = document.createElement("div");
    line.className = `line ${type}`;
    line.innerText = text;
    output.appendChild(line);
    output.scrollTop = output.scrollHeight
    return new Promise(res => setTimeout(res, delay));
    // // simulate typing effect
    // for(let i = 0; i < text.length; i++)
    // {
    //     line.innerText += text[i];
    //     await new Promise(res => setTimeout(res, delay));
    //     // auto-scroll to bottom
    //     output.scrollTop = output.scrollHeight;
    // }
}
function clearTerminal()
{
    output.innerHTML = ""
}
function displayPrompt()
{
    return "USER@MAGPIE:>"
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
    'clear': async () => {
        clearTerminal();
        await printLine(`${displayPrompt()}`, "user", 0);
    },
    'status': async () => {
        await printLine("Connecting to MAGPIE_Server...", "info");
        // @todo CLI socket check
        await printLine("STATUS: ONLINE", "success");
        await printLine("LATENCY: 24ms", "info");
    },
    'register': async () => {
        await printLine("Initializing player registration protocol...", "info");
        MAGPIE_CLI.state.mode = "registering_username";
        await printLine("Please, enter your desired 'username':", "info");
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
window.addEventListener("DOMContentLoaded", () => {
    input.focus();
    input.addEventListener('keydown', async (e) => {
        if(e.key === 'Enter') 
        {
            const rawInput = input.value.trim();
            
            // Registration state handling
            if (MAGPIE_CLI.state.mode === "registering_username") {
                await printLine(`${displayPrompt()} ${rawInput}`, "user", 0);
                MAGPIE_CLI.state.tempData.username = rawInput;
                MAGPIE_CLI.state.mode = "registering_password";
                input.value = "";
                await printLine("Please, enter your desired 'password':", "info");
                return;
            } else if (MAGPIE_CLI.state.mode === "registering_password") {
                await printLine(`${displayPrompt()} ********`, "user", 0); // Hide password
                MAGPIE_CLI.state.tempData.password = rawInput;
                MAGPIE_CLI.state.mode = "idle";
                input.value = "";
                await printLine(`Registration data received for user: ${MAGPIE_CLI.state.tempData.username}.`, "success");
                await printLine("Proceeding to server-side registration (todo)...", "info");
                MAGPIE_CLI.state.tempData = { username: "", password: "" };
                return;
            }

            const cmd = rawInput.toLowerCase();
            // echo the command to the terminal
            await printLine(`${displayPrompt()} ${rawInput}`, "user", 0);
            input.value = "";
            if(cmd === "") return;
            if(commands[cmd])
                await commands[cmd]()
            else
                await printLine(`Command not found: ${cmd}. Type 'help' for a list of commands.`, "error");
        }
    })
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