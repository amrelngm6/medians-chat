"use strict";
window.isProcessing = false;
/**
 * scroll-flow.js
 * ──────────────
 * Adds scroll-driven navigation to the Medians Chat template.
 * On each full scroll gesture the next indexed flow triggers,
 * appending a user message + AI reply via the existing
 * generateAndProcessResponse() from app.js.
 *
 * Opt-in: only activates when <main> has data-scroll-flow="true".
 */

(function () {

  /* ── State ─────────────────────────────────────── */
  let scrollFlows = [];        // ordered flow ids
  let currentFlowIndex = 0;    // next flow to trigger
  let isProcessing = false;    // true while a flow animation is running
  let isActive = false;        // scroll-flow mode enabled?
  let introCleared = false;    // has the intro screen been dismissed?
  let scrollAccumulator = 0;   // accumulated scroll delta
  const SCROLL_THRESHOLD = 120; // px of scroll delta before triggering next flow

  /* ── DOM refs (set on init) ────────────────────── */
  let progressBar = null;
  let progressFill = null;
  let progressDots = [];
  let wrapper = null;

  /* ── Initialise ────────────────────────────────── */
  async function init() {
    try {
      // Fetch the menu from api
      const response = await fetch("/api/v1/active-menu");
      const menuJson = await response.json();
      const menu = menuJson.data;
      window.DEFAULT_FLOWS = menu.map(item => item.url.toLowerCase());
      window.FLOW_LABELS = menu.reduce((acc, item) => {
        acc[item.url.toLowerCase()] = item.title;
        return acc;
      }, {});

    } catch (error) {
      console.error("Error initializing scroll-flow:", error);
    }


    wrapper = document.getElementById("chat-wrapper");
    if (!wrapper || wrapper.getAttribute("data-scroll-flow") !== "true") {
      return; // not opted-in
    }

    // Read optional custom flow order from HTML
    const customOrder = wrapper.getAttribute("data-scroll-order");
    scrollFlows = customOrder
      ? customOrder.split(",").map((s) => s.trim())
      : [...window.DEFAULT_FLOWS];


    buildProgressBar();
    attachScrollListeners();

    isActive = true;
    document.body.classList.add("scroll-flow-active");
  }

  /* ── Progress Bar UI ───────────────────────────── */
  function buildProgressBar() {
    progressBar = document.createElement("div");
    progressBar.className = "scroll-flow-progress";
    progressBar.id = "scroll-progress-bar";

    // Track line
    const track = document.createElement("div");
    track.className = "scroll-flow-progress-track";

    // Fill line (grows as user progresses)
    progressFill = document.createElement("div");
    progressFill.className = "scroll-flow-progress-fill";
    track.appendChild(progressFill);

    progressBar.appendChild(track);

    // Dots — one per flow
    scrollFlows.forEach((flowId, i) => {
      const dot = document.createElement("div");
      dot.className = "scroll-flow-progress-dot";
      dot.setAttribute("data-flow", flowId);
      dot.setAttribute("data-index", i);
      dot.setAttribute("title", window.FLOW_LABELS[flowId] || flowId);

      // Position dot evenly along the track
      const pct = scrollFlows.length > 1
        ? (i / (scrollFlows.length - 1)) * 100
        : 50;
      dot.style.left = pct + "%";

      // Label tooltip
      const label = document.createElement("span");
      label.className = "scroll-flow-progress-label";
      label.textContent = window.FLOW_LABELS[flowId] || flowId;
      dot.appendChild(label);

      // Make dot clickable to run the selected flow
      dot.addEventListener("click", (e) => {
        e.stopPropagation();
        triggerFlowAtIndex(i);
      });

      progressBar.appendChild(dot);
      progressDots.push(dot);
    });

    const progressSlot = document.querySelector(".scroll-flow-progress-slot");
    const footer = document.getElementById("chat-footer");

    progressSlot ? progressSlot.appendChild(progressBar) : null;

    // Fade in after a short delay
    requestAnimationFrame(() => {
      setTimeout(() => progressBar.classList.add("visible"), 400);
    });
  }

  function updateProgress() {
    const pct = scrollFlows.length > 1
      ? (currentFlowIndex / (scrollFlows.length - 1)) * 100
      : currentFlowIndex > 0 ? 100 : 0;
    if (progressFill) {
      progressFill.style.width = pct + "%";
    }

    progressDots.forEach((dot, i) => {
      dot.classList.toggle("completed", i < currentFlowIndex);
      dot.classList.toggle("active", i === currentFlowIndex - 1 || (currentFlowIndex === 0 && i === 0));
    });

    // Mark all completed when done, but keep progress bar visible fixed as main menu
    if (currentFlowIndex >= scrollFlows.length) {
      progressDots.forEach((d) => d.classList.add("completed"));
      if (progressFill) progressFill.style.width = "100%";
    }
  }

  /* ── Core: trigger flow by index ───────────────── */
  async function triggerFlowAtIndex(index) {
    if (isProcessing) return;
    if (index < 0 || index >= scrollFlows.length) return;

    clearIntro();

    const command = scrollFlows[index];
    const label = window.FLOW_LABELS[command] || command;

    isProcessing = true;
    currentFlowIndex = index + 1;
    updateProgress();

    try {
      await generateAndProcessResponse(command, label);
    } catch (e) {
      console.warn("[scroll-flow] Error triggering flow:", command, e);
    }

    isProcessing = false;
  }

  /* ── Core: trigger the next flow ───────────────── */
  async function triggerNextFlow() {
    if (isProcessing) return;
    if (currentFlowIndex >= scrollFlows.length) return; // all done

    await triggerFlowAtIndex(currentFlowIndex);
  }

  /* ── Clear intro screen on first scroll / click ── */
  function clearIntro() {
    if (introCleared) return;
    const intro = document.getElementById("intro-screen");
    if (intro && !intro.classList.contains("fade-out")) {
      // intro.classList.add("fade-out");
      // setTimeout(() => intro.remove(), 600);
    }
    introCleared = true;
  }

  /* ── Scroll listeners ──────────────────────────── */

  /** Check if the page is scrolled to the very bottom (with small tolerance) */
  function isAtScrollBottom(checkStatus = true) {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const docHeight = document.documentElement.scrollHeight;
    const check = (scrollTop + windowHeight) >= (docHeight - 5);

    // Check if still typing
    if (checkStatus && window.typingStatus) {
      return false;
    }

    return check;
  }

  function attachScrollListeners() {
    // Wheel (desktop)
    window.addEventListener(
      "wheel",
      (e) => {
        
        // Check if scrolling to up (negative deltaY)
        if (e.deltaY < 0) {
          allowScrollOnTyping = false;
        } else if (isAtScrollBottom(false)) {
          allowScrollOnTyping = true;
        }
        if (!isActive) return;
        if (currentFlowIndex >= scrollFlows.length) return; // done, let page scroll normally
        if (isProcessing) return; // let the page scroll while processing


        // Only trigger when scrolling DOWN and already at the bottom
        if (e.deltaY > 0 && isAtScrollBottom()) {
          // allowScrollOnTyping = true;
          e.preventDefault();
          scrollAccumulator += Math.abs(e.deltaY);

          if (scrollAccumulator >= SCROLL_THRESHOLD) {
            scrollAccumulator = 0;
            triggerNextFlow();
          }
        } else {
          // Reset accumulator when not at bottom (user is browsing content)
          scrollAccumulator = 0;
        }
      },
      { passive: false }
    );

    // Touch (mobile)
    let touchStartY = 0;

    window.addEventListener(
      "touchstart",
      (e) => {
        touchStartY = e.touches[0].clientY;
      },
      { passive: true }
    );

    window.addEventListener(
      "touchmove",
      (e) => {
        if (!isActive) return;
        if (currentFlowIndex >= scrollFlows.length) return;
        if (isProcessing) return;

        const touchY = e.touches[0].clientY;
        const delta = touchStartY - touchY; // positive = swipe up = scroll down

        // Only trigger when swiping down AND already at the bottom
        if (delta > 50 && isAtScrollBottom()) {
          touchStartY = touchY; // reset to avoid rapid re-triggers
          triggerNextFlow();
        }
      },
      { passive: false }
    );

    // Keyboard (down arrow, space, page-down)
    window.addEventListener("keydown", (e) => {
      if (!isActive) return;
      if (currentFlowIndex >= scrollFlows.length) return;
      if (isProcessing) return;

      // Don't hijack if user is typing in the chat input
      if (document.activeElement && document.activeElement.id === "chat-input") return;

      const scrollKeys = ["ArrowDown", "Space", "PageDown", " "];
      if (scrollKeys.includes(e.key) && isAtScrollBottom()) {
        e.preventDefault();
        triggerNextFlow();
      }
    });
  }

  /* ── Boot ───────────────────────────────────────── */
  // Wait for app.js to finish initialising flows (fires on window load)
  window.addEventListener("load", () => {
    // Small delay so app.js's own load handler runs first
    setTimeout(init, 1200);
  });
})();
