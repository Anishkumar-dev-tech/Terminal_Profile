var before = document.getElementById("before");
var command = document.getElementById("typer");
var textarea = document.getElementById("texter");
var terminal = document.getElementById("terminal");
var autocompleteBox = document.getElementById("autocomplete");
var terminalWrapper = document.getElementById("history");
var promptLabel = '<span class="prompt-label">anish@portfolio ~ $</span>';

var git = 0;
var pw = false;
let pwd = false;
var commands = [];
var autocompleteItems = [];
var selectedAutoCompleteIndex = -1;

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

setTimeout(function() {
    loopLines(banner, "", 80);
    textarea.focus();
    startSystemTime();
}, 100);

window.addEventListener("keyup", enterKey);
window.addEventListener("keydown", handleAutocomplete);

textarea.value = "";
command.innerHTML = textarea.value;

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

    autocompleteItems = allCommands.filter(cmd => cmd.startsWith(input.toLowerCase()));
    
    if (autocompleteItems.length === 0) {
        hideAutocomplete();
        return;
    }

    autocompleteBox.innerHTML = "";
    autocompleteItems.forEach((item, index) => {
        var div = document.createElement("div");
        div.className = "autocomplete-item";
        div.textContent = item;
        div.onclick = function() {
            textarea.value = item;
            command.innerHTML = item;
            hideAutocomplete();
        };
        autocompleteBox.appendChild(div);
    });
    
    autocompleteBox.classList.remove("hidden");
    selectedAutoCompleteIndex = -1;
}

function hideAutocomplete() {
    autocompleteBox.classList.add("hidden");
    autocompleteBox.innerHTML = "";
    selectedAutoCompleteIndex = -1;
}

function handleAutocomplete(e) {
    if (autocompleteBox.classList.contains("hidden")) {
        return;
    }

    if (e.keyCode === 40) {
        e.preventDefault();
        selectedAutoCompleteIndex = (selectedAutoCompleteIndex + 1) % autocompleteItems.length;
        updateAutoCompleteSelection();
    } else if (e.keyCode === 38) {
        e.preventDefault();
        selectedAutoCompleteIndex = (selectedAutoCompleteIndex - 1 + autocompleteItems.length) % autocompleteItems.length;
        updateAutoCompleteSelection();
    } else if (e.keyCode === 9) {
        e.preventDefault();
        if (selectedAutoCompleteIndex >= 0) {
            textarea.value = autocompleteItems[selectedAutoCompleteIndex];
            command.innerHTML = textarea.value;
            hideAutocomplete();
        }
    }
}

function updateAutoCompleteSelection() {
    var items = document.querySelectorAll(".autocomplete-item");
    items.forEach((item, index) => {
        if (index === selectedAutoCompleteIndex) {
            item.classList.add("selected");
        } else {
            item.classList.remove("selected");
        }
    });
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
    
    if (e.keyCode == 13) {
        hideAutocomplete();
        var trimmedInput = currentInput.trim();
        if (trimmedInput.length === 0) {
            command.innerHTML = "";
            textarea.value = "";
            return;
        }
        var displayCommand = formatCommand(trimmedInput);
        commands.push(trimmedInput);
        git = commands.length;
        addLine(displayCommand, "no-animation", 0);
        commander(trimmedInput.toLowerCase());
        command.innerHTML = "";
        textarea.value = "";
        return;
    }
    
    if (e.keyCode == 38 && git != 0) {
        git -= 1;
        textarea.value = commands[git];
        command.innerHTML = textarea.value;
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
        command.innerHTML = textarea.value;
        hideAutocomplete();
        return;
    }

    if (currentInput.length > 0 && e.keyCode !== 8) {
        showAutocomplete(currentInput);
    } else {
        hideAutocomplete();
    }
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
                terminal.innerHTML = '<a id="before"></a>';
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

        terminalWrapper.scrollTop = terminalWrapper.scrollHeight;
    }, time);
}

function loopLines(name, style, time) {
    name.forEach(function(item, index) {
        addLine(item, style, index * time);
    });
}
