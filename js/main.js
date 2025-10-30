var before = document.getElementById("before");
var command = document.getElementById("typer");
var textarea = document.getElementById("texter");
var terminal = document.getElementById("terminal");
var autocompleteBox = document.getElementById("autocomplete");
var terminalWrapper = document.getElementById("history");
var inputLine = document.getElementById("input-line");
var promptLabel = document.getElementById("input-line") ? document.getElementById("input-line").querySelector(".prompt-label").outerHTML : '<span class="prompt-label">anish@portfolio ~ $</span>';

var git = 0;
var pw = false;
let pwd = false;
var commands = [];

function scrollHistoryToBottom(smooth) {
    if (!terminalWrapper) {
        return;
    }
    if (smooth) {
        terminalWrapper.scrollTo({ top: terminalWrapper.scrollHeight, behavior: "smooth" });
    } else {
        terminalWrapper.scrollTop = terminalWrapper.scrollHeight;
    }
}

function scrollToPrompt(smooth) {
    if (!inputLine || typeof inputLine.scrollIntoView !== "function") {
        return;
    }
    var behavior = smooth ? "smooth" : "auto";
    try {
        inputLine.scrollIntoView({ behavior: behavior, block: "end" });
    } catch (err) {
        inputLine.scrollIntoView(smooth);
    }
}
var autocompleteItems = [];
var selectedAutoCompleteIndex = -1;
var activeSuggestion = "";

var allCommands = [
    "help", "intro", "whoami", "skills", "experience", 
    "education", "projects", "social", "history", "email", 
    "clear", "banner", "linkedin", "github", "sysinfo"
];

function sanitizeCommand(text) {
    return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function formatCommand(input) {
    return promptLabel + ' <span class="command-input">' + sanitizeCommand(input) + "</span>";
}

function isMobileDevice() {
    return /android|iphone|ipad|ipod|windows phone|mobile/i.test(navigator.userAgent || "");
}

function renderCommand(input) {
    var value = input != null ? input : "";
    var sanitizedInput = sanitizeCommand(value);
    var suggestionMarkup = "";
    if (value && activeSuggestion && activeSuggestion.startsWith(value.toLowerCase())) {
        var remainder = activeSuggestion.slice(value.length);
        if (remainder.length > 0) {
            suggestionMarkup = '<span class="ghost-complete">' + sanitizeCommand(remainder) + "</span>";
        }
    }
    command.innerHTML = sanitizedInput + suggestionMarkup;
    scrollHistoryToBottom(false);
    scrollToPrompt(false);
}

function setActiveSuggestion(suggestion) {
    activeSuggestion = suggestion || "";
    renderCommand(textarea.value);
}

function applySuggestion(appendSpace) {
    if (!activeSuggestion) {
        return false;
    }
    var currentValue = textarea.value;
    if (!activeSuggestion.startsWith(currentValue.toLowerCase())) {
        return false;
    }
    var completion = activeSuggestion;
    if (appendSpace) {
        completion += " ";
    }
    textarea.value = completion;
    renderCommand(textarea.value);
    hideAutocomplete();
    return true;
}

setTimeout(function() {
    loopLines(banner, "", 80);
    textarea.focus();
    startSystemTime();
}, 100);

window.addEventListener("keyup", enterKey);
window.addEventListener("keydown", handleAutocomplete);

textarea.value = "";
renderCommand(textarea.value);

function startSystemTime() {
    function updateTime() {
        var now = new Date();
        var hours = String(now.getHours()).padStart(2, '0');
        var minutes = String(now.getMinutes()).padStart(2, '0');
        var seconds = String(now.getSeconds()).padStart(2, '0');
        document.getElementById("time-display").textContent = hours + ":" + minutes + ":" + seconds;
    }
    updateTime();
    setInterval(updateTime, 1000);
}

function showAutocomplete(input) {
    if (!input) {
        hideAutocomplete();
        return;
    }

    var lower = input.toLowerCase();
    var match = allCommands.find(cmd => cmd.startsWith(lower));

    if (match) {
        autocompleteItems = [match];
        selectedAutoCompleteIndex = 0;
        setActiveSuggestion(match);
        autocompleteBox.classList.add("hidden");
        autocompleteBox.innerHTML = "";
    } else {
        hideAutocomplete();
    }
}

function hideAutocomplete() {
    setActiveSuggestion("");
    autocompleteBox.classList.add("hidden");
    autocompleteBox.innerHTML = "";
    autocompleteItems = [];
    selectedAutoCompleteIndex = -1;
}

function handleAutocomplete(e) {
    var key = e.keyCode || e.which;

    if (key === 9) {
        e.preventDefault();
        if (!applySuggestion(false)) {
            showAutocomplete(textarea.value);
        }
    } else if (key === 32) {
        if (activeSuggestion && applySuggestion(true)) {
            e.preventDefault();
        }
    }
}

function enterKey(e) {
    var currentInput = textarea.value;
    
    if (e.keyCode == 181) {
        document.location.reload(true);
    }
    
    if (e.keyCode == 9) {
        e.preventDefault();
        showAutocomplete(currentInput);
        return;
    }
    
    if (e.keyCode == 32 && activeSuggestion) {
        if (applySuggestion(true)) {
            return;
        }
    }
    
    if (e.keyCode == 13) {
        hideAutocomplete();
        var trimmedInput = currentInput.trim();
        if (trimmedInput.length === 0) {
            textarea.value = "";
            renderCommand(textarea.value);
            return;
        }
        var displayCommand = formatCommand(trimmedInput);
        commands.push(trimmedInput);
        git = commands.length;
        addLine(displayCommand, "no-animation", 0);
        commander(trimmedInput.toLowerCase());
        textarea.value = "";
        renderCommand(textarea.value);
        return;
    }
    
    if (e.keyCode == 38 && git != 0) {
        git -= 1;
        textarea.value = commands[git];
        renderCommand(textarea.value);
        hideAutocomplete();
        return;
    }
    
    if (e.keyCode == 40 && git != commands.length) {
        git += 1;
        if (commands[git] === undefined) {
            textarea.value = "";
        } else {
            textarea.value = commands[git];
        }
        renderCommand(textarea.value);
        hideAutocomplete();
        return;
    }

    if (currentInput.length > 0) {
        showAutocomplete(currentInput);
    } else {
        hideAutocomplete();
    }

    setActiveSuggestion(activeSuggestion);
}

function commander(cmd) {
    switch (cmd.toLowerCase()) {
        case "help":
            loopLines(help, "color2 margin", 80);
            break;
        case "intro":
            loopLines(intro, "color2 margin", 80);
            break;
        case "whoami":
            loopLines(whoami, "color2 margin", 80);
            break;
        case "skills":
            loopLines(skills, "color2 margin", 80);
            break;
        case "experience":
            loopLines(experience, "color2 margin", 80);
            break;
        case "education":
            loopLines(education, "color2 margin", 80);
            break;
        case "social":
            loopLines(social, "color2 margin", 80);
            break;
        case "projects":
            loopLines(projects, "color2 margin", 80);
            break;
        case "history":
            addLine("<br>", "", 0);
            loopLines(commands, "color2", 80);
            addLine("<br>", "command", 80 * commands.length + 50);
            break;
        case "email":
            addLine('Opening mailto:<a href="' + email + '">anishkumarak8686@gmail.com</a>...', "color2", 80);
            newTab(email);
            break;
        case "clear":
            setTimeout(function() {
                if (terminalWrapper) {
                    terminalWrapper.innerHTML = '<a id="before"></a>';
                } else {
                    terminal.innerHTML = '<a id="before"></a>';
                }
                before = document.getElementById("before");
            }, 1);
            break;
        case "banner":
            loopLines(banner, "", 80);
            break;
        case "linkedin":
            addLine("Opening LinkedIn...", "color2", 0);
            newTab(linkedin);
            break;
        case "github":
            addLine("Opening GitHub...", "color2", 0);
            newTab(github);
            break;
        case "sysinfo":
            loopLines(sysinfo, "color2 margin", 80);
            break;
        default:
            addLine("<span class=\"inherit\">Command not found. For a list of commands, type <span class=\"command\">'help'</span>.</span>", "error", 100);
            break;
    }
}

function newTab(link) {
    setTimeout(function() {
        window.open(link, "_blank");
    }, 500);
}

function addLine(text, style, time) {
    var t = "";
    for (let i = 0; i < text.length; i++) {
        if (text.charAt(i) == " " && text.charAt(i + 1) == " ") {
            t += "&nbsp;&nbsp;";
            i++;
        } else {
            t += text.charAt(i);
        }
    }
    setTimeout(function() {
        var next = document.createElement("p");
        next.innerHTML = t;
        next.className = style;

        before.parentNode.insertBefore(next, before);

        scrollHistoryToBottom(true);
        scrollToPrompt(true);
    }, time);
}

function loopLines(name, style, time) {
    name.forEach(function(item, index) {
        addLine(item, style, index * time);
    });
}
