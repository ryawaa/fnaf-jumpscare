console.log("FNAF jumpscare extension loaded");
let jumpscare = false;
let jumpscareQueued = false;
function randomDelay() {
    // Delay for up to 5 seconds
    return Math.floor(Math.random() * 10000);
}

function randomCheckDelay() {
    // Delay for up to 5 seconds
    return Math.floor(Math.random() * 5000);
}

async function isTabFocused(callback) {
    // Send a message to the background script to check if the tab is focused
    await chrome.runtime.sendMessage({ action: "checkFocus" }, (response) => {
        callback(response.isFocused);
    });
}

async function overlayJumpscare() {
    // Initial check if the tab is focused
    // Ensure user interaction
    let hasInteracted = false;
    
    function markInteracted() {
        hasInteracted = true;
        document.removeEventListener("click", markInteracted);
        document.removeEventListener("keydown", markInteracted);
    }

    // Add event listeners for user interaction
    document.addEventListener("click", markInteracted);
    document.addEventListener("keydown", markInteracted);

    while (!jumpscareQueued) {
        let delay = randomDelay();
        console.log(`[FNAF] Jumpscare opportunity after ${delay / 1000}s`);
        await new Promise((r) => setTimeout(r, delay));
        if (Math.random() < 0.03) {
            console.log("[FNAF] Freddy wants to jumpscare!");
            jumpscareQueued = true;
    }
     else {
        console.log("[FNAF] Freddy does not want to jumpscare right now.");
     }
}

    while (!jumpscare) {
        let delay = randomCheckDelay();
        console.log(`[FNAF] Jumpscare queued. Waiting for next opportunity!`);
        await new Promise((r) => setTimeout(r, delay));
        await isTabFocused((tabFocused) => {
            if (!tabFocused) {
                console.log("[FNAF] Freddy is waiting for user to focus tab/window.");
            } else if (!hasInteracted) {
                console.log(
                    "[FNAF] Freddy is waiting for the next user interaction."
                );
            } else {
                if (!jumpscare) {
                    console.log("[FNAF] Opportunity found.");
                    jumpscare = true;
                    if (Math.random() < 0.5) {
                        console.log("[FNAF] Freddy backed out and left this tab alone!");
                    } else {
                        console.log("[FNAF] Freddy is preparing to jumpscare!");
                        executeJumpscare();
                    }
                } else {
                    console.log(
                        "[FNAF] Freddy is deciding!"
                    );
                }
            }
        });
    }
}

function executeJumpscare() {
    const fullscreenOverlay = document.createElement("div");
    fullscreenOverlay.style.position = "fixed";
    fullscreenOverlay.style.top = "0";
    fullscreenOverlay.style.left = "0";
    fullscreenOverlay.style.width = "100vw";
    fullscreenOverlay.style.height = "100vh";
    fullscreenOverlay.style.zIndex = "9999"; // Ensure it's on top

    const jumpscareGif = document.createElement("img");
    jumpscareGif.src = chrome.runtime.getURL("assets/fredbear.gif");
    jumpscareGif.style.width = "100%";
    jumpscareGif.style.height = "100%";
    jumpscareGif.style.objectFit = "cover"; // Ensure image covers area

    const jumpscareAudio = document.createElement("audio");
    jumpscareAudio.src = chrome.runtime.getURL("assets/audio.mp3");
    jumpscareAudio.setAttribute("autoplay", "true"); // Start playing immediately

    const fullscreenStatic = document.createElement("img");
    fullscreenStatic.src = chrome.runtime.getURL("assets/static.gif");
    fullscreenStatic.style.width = "100%";
    fullscreenStatic.style.height = "100%";
    fullscreenStatic.style.objectFit = "cover"; // Ensure image covers area

    // Append gif to overlay
    fullscreenOverlay.appendChild(jumpscareGif);

    // Append audio to overlay
    fullscreenOverlay.appendChild(jumpscareAudio);

    // Append overlay to document body
    document.body.appendChild(fullscreenOverlay);

    // Handle jumpscare audio and gif
    jumpscareGif.addEventListener("load", () => {
        jumpscareAudio.play();
        // Jumpscare gif is 1.5 seconds long
        setTimeout(() => {
            // Remove Freddy gif
            fullscreenOverlay.removeChild(jumpscareGif);
            fullscreenOverlay.appendChild(fullscreenStatic);
        }, 1500); // Assuming the gif lasts 1.5 seconds
    });
}

// Execute the jumpscare function
overlayJumpscare();
