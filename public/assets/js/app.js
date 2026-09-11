"use strict";

const theme = getCookies('theme');
if (theme) {
  document.body.classList.add(theme);
  document.getElementById('dark-checkbox').checked = theme === 'dark';
}

const direction = getCookies('direction');
const locale = getCookies('locale') || 'en';
if (direction) {
  document.body.classList.add(direction);
}
if (locale) {
  document.documentElement.lang = locale;
}

let chatWindow;
let chatInput;
let sendButton;
let ToggleMenuButton;
let allowScrollOnTyping = true;
const keywordMap = {};
const chatFlow = {};
const chatAvatarPath = document
  .getElementById("chat-avatar")
  .getAttribute("src");
let isArabic = locale === "ar";
let currentProjectIndex = 0;
let projectsSequenceData = [];
let sequenceGlobalButtons = [];
let sequenceFinalButtons = [];

/**
 * Initialize projects flow
 */
const initializeProjectsFlow = () => {
  const projectsJson = window.contentJson.projects;
  const projectsType = "projects";
  const projectItems = projectsJson?.items;

  if (!projectItems || projectItems.length === 0) {
    return;
  }

  chatFlow[projectsType] = [
    {
      speaker: "A",
      text: projectsJson.intro?.trim() || "",
      type: "projects-sequence",
      data: projectItems,
      globalButtons: Array.from(
        projectsJson.globalButtons
      ).map((l) => ({
        text: l.label,
        action: l.action,
        styleClass: l.styleClass || "",
      })),
      finalButtons: Array.from(
        projectsJson.finalButtons
      ).map((l) => ({
        text: l.label,
        action: l.action,
        styleClass: l.styleClass || "",
      })),
    },
  ];
  const triggers = projectsJson.triggers
    .split(",")
    .map((s) => s.trim().toLowerCase());
  triggers.forEach((trigger) => {
    keywordMap[trigger] = projectsType;
  });
};

/**
 * Start projects sequence
 * @param {Array} projectsData - Projects data
 * @param {Array} sequenceGlobal - Global buttons for sequence
 * @param {Array} sequenceFinal - Final buttons for sequence
 */
const startProjectsSequence = async (projectsData, sequenceGlobal, sequenceFinal) => {
  projectsSequenceData = projectsData;
  sequenceGlobalButtons = sequenceGlobal;
  sequenceFinalButtons = sequenceFinal;
  currentProjectIndex = 0;
  await displayNextProject();
};

/**
 * Display next project
 */
const displayNextProject = async () => {
  const projectData = projectsSequenceData[currentProjectIndex];
  if (!projectData) {
    return;
  }
  const totalProjects = projectsSequenceData.length;
  const projectTitleText = isArabic
    ? "المشروع " +
    (currentProjectIndex + 1) +
    " من " +
    totalProjects +
    " : **" +
    projectData.title +
    "**"
    : "Project " +
    (currentProjectIndex + 1) +
    " of " +
    totalProjects +
    " : **" +
    projectData.title +
    "**";
  const showNextProjectText = isArabic ? "المشروع التالي" : "Show Next Project";
  const isLastProject = currentProjectIndex === totalProjects - 1;
  const nextProjectButton = isLastProject
    ? []
    : [
      {
        text: showNextProjectText,
        action: "__project_flow" + (currentProjectIndex + 1),
      },
    ];
  const optionsButtons = isLastProject ? sequenceFinalButtons : sequenceGlobalButtons;
  const flowKey = "temp_proj_" + Date.now();
  chatFlow[flowKey] = [
    {
      speaker: "A",
      text: projectTitleText,
      delay: 300,
    },
    {
      speaker: "A",
      isRich: true,
      type: "single-project-card",
      projectData: projectData,
      options: [...nextProjectButton, ...optionsButtons],
      delay: 200,
    },
  ];
  await startConversationFlow(flowKey);
};



let currentServiceIndex = 0;
let servicesSequenceData = [];
let servicesSequenceGlobalButtons = [];
let servicesSequenceFinalButtons = [];

/**
 * Initialize services flow
 */
const initializeServicesFlow = () => {
  const servicesJson = window.contentJson.services;
  const servicesType = "services";
  const serviceItems = servicesJson.items;

  chatFlow[servicesType] = [
    {
      speaker: "A",
      text: servicesJson.intro?.trim() || "",
      type: "services-sequence",
      data: serviceItems,
      globalButtons: Array.from(
        servicesJson.globalButtons
      ).map((l) => ({
        text: l.label,
        action: l.action,
        styleClass: l.styleClass || "",
      })),
      finalButtons: Array.from(
        servicesJson.finalButtons
      ).map((l) => ({
        text: l.label,
        action: l.action,
        styleClass: l.styleClass || "",
      })),
    },
  ];
  const triggers = servicesJson.triggers
    .split(",")
    .map((s) => s.trim().toLowerCase());
  triggers.forEach((trigger) => {
    keywordMap[trigger] = servicesType;
  });
};

/**
 * Start services sequence
 * @param {Array} projectsData - Projects data
 * @param {Array} sequenceGlobal - Global buttons for sequence
 * @param {Array} sequenceFinal - Final buttons for sequence
 */
const startServicesSequence = async (servicesData, sequenceGlobal, sequenceFinal) => {
  servicesSequenceData = servicesData;
  servicesSequenceGlobalButtons = sequenceGlobal;
  servicesSequenceFinalButtons = sequenceFinal;
  currentServiceIndex = 0;
  await displayNextService();
};

/**
 * Display next service
 */
const displayNextService = async () => {
  const serviceData = servicesSequenceData[currentServiceIndex];
  if (!serviceData) {
    return;
  }
  const totalServices = servicesSequenceData.length;
  const serviceTitleText = isArabic
    ? "الخدمة " +
    (currentServiceIndex + 1) +
    " من " +
    totalServices +
    " : **" +
    serviceData.title +
    "**"
    : "Service " +
    (currentServiceIndex + 1) +
    " of " +
    totalServices +
    " : **" +
    serviceData.title +
    "**";
  const showNextServiceText = isArabic ? "الخدمة التالية" : "Show Next Service";
  const isLastService = currentServiceIndex === totalServices - 1;
  const nextServiceButton = isLastService
    ? []
    : [
      {
        text: showNextServiceText,
        action: "__service_flow" + (currentServiceIndex + 1),
      },
    ];
  const optionsButtons = isLastService ? servicesSequenceFinalButtons : servicesSequenceGlobalButtons;
  const flowKey = "temp_service_" + Date.now();
  chatFlow[flowKey] = [
    {
      speaker: "A",
      text: serviceTitleText,
      delay: 300,
    },
    {
      speaker: "A",
      isRich: true,
      type: "single-project-card",
      projectData: serviceData,
      options: [...nextServiceButton, ...optionsButtons],
      delay: 200,
    },
  ];
  await startConversationFlow(flowKey);
};





/**
 * Initialize clients flow
 */
const initializeClientsFlow = () => {
  const clientsJson = window.contentJson.clients;
  const clientsData = clientsJson?.items;
  if (!clientsData) {
    return;
  }
  chatFlow.clients = [
    {
      speaker: "A",
      text: clientsJson.intro?.trim() || "",
      type: "client-logos",
      logos: clientsData,
      options: clientsJson.buttons?.map(
        (optionItem) => ({
          text: optionItem.label ?? optionItem.text ?? "",
          action: optionItem.action,
          link: optionItem.link,
          styleClass: optionItem.styleClass || "",
        }),
      ) || [],
    },
  ];
  const triggers = clientsJson.triggers?.split(",").map((s) => s.trim().toLowerCase()) || [];
  triggers.forEach((trigger) => {
    keywordMap[trigger] = "clients";
  });
};

/**
 * Initialize contact flow
 */
const initializeContactFlow = () => {

  const contactObject = window.contentJson.contact;
  if (!contactObject) {
    return;
  }
  const introText = contactObject.intro?.trim() || "";

  const triggers = contactObject.triggers?.split(",").map((s) => s.trim().toLowerCase()) || [];

  const directContacts = contactObject.directContact;

  const socialLinks = contactObject.socialLinks;

  const optionsList = Array.from(contactObject.options || []).map((option) => ({
    text: option.label ?? option.text ?? "",
    action: option.action,
    link: option.link,
    styleClass: option.styleClass || "",
  })) || [];

  chatFlow.contact = [
    {
      speaker: "A",
      text: introText,
      type: "contact-details",
      direct: directContacts,
      socials: socialLinks,
      options: optionsList,
    },
  ];
  triggers.forEach((trigger) => {
    keywordMap[trigger] = "contact";
  });
};

/**
 * Initialize generic flows
 */
const initializeGenericFlows = () => {
  const genericFlowDivs = document.querySelectorAll(
    ".generic-flow, #flow-msg-success",
  );
  genericFlowDivs.forEach((f) => {
    const flowId =
      f.getAttribute("data-flow-id") ||
      f.id.replacfe("flow-", "");
    const blocks = Array.from(f.children)
      .filter((child) => !child.classList.contains("options"))
      .map((block) => {
        const blockData = {
          tag: block.tagName,
          className: block.className,
        };
        if (block.tagName === "UL") {
          blockData.items = Array.from(block.querySelectorAll("li")).map(
            (li) => li.innerHTML.trim(),
          );
        } else {
          blockData.content = block.innerHTML.trim();
        }
        return blockData;
      });
    const options = Array.from(f.querySelectorAll(".options li")).map(
      (optionItem) => ({
        text: optionItem.innerText.trim(),
        action: optionItem.getAttribute("data-action"),
        link: optionItem.getAttribute("data-link"),
        styleClass: optionItem.getAttribute("data-class") || "",
      }),
    );
    chatFlow[flowId] = [
      {
        speaker: "A",
        type: "flexible-content",
        blocks: blocks,
        options: options,
      },
    ];
    const triggers = f.getAttribute("data-triggers");
    if (triggers) {
      triggers
        .split(",")
        .map((s) => s.trim().toLowerCase())
        .forEach((trigger) => {
          keywordMap[trigger] = flowId;
        });
    }
  });
};

/**
 * Initialize flows
 */
function initializeFlows() {
  initializeClientsFlow();
  initializeContactFlow();
  initializeGenericFlows();
  initializeProjectsFlow();
  initializeServicesFlow();
}

/**
 * Start conversation flow
 * @param {string} flowKey - Flow Key
 */
const startConversationFlow = async (flowKey) => {
  if (!flowKey || flowKey === "__handled") {
    window.isProcessing = false;
    return;
  }
  if (!chatInput) {
    chatInput.disabled = false;
  }
  if (!ToggleMenuButton) {
    ToggleMenuButton = document.getElementById("btn-menu-toggle");
  }
  const contentFlows = chatFlow[flowKey];

  window.typingStatus = true;
  if (!contentFlows) {
    window.isProcessing = false;
    return;
  }
  const mainNav = document.querySelectorAll(".btn-primary-nav");
  const inputNavWrapper = document.getElementById("input-nav-wrapper");
  if (inputNavWrapper) {
    inputNavWrapper.classList.add("disabled");
  }
  mainNav.forEach((m) => m.classList.add("disabled"));
  if (chatInput) {
    chatInput.disabled = true;
  }
  if (sendButton) {
    sendButton.disabled = true;
  }
  if (ToggleMenuButton) {
    ToggleMenuButton.disabled = true;
  }
  for (const contentFlow of contentFlows) {
    let text = contentFlow.text || "";
    await new Promise(async (resolve) => {
      if (contentFlow.speaker === "A") {
        await new Promise(async (resolve) =>
          setTimeout(resolve, contentFlow.delay || 500),
        );
        const newStatus = showTypingIndicator(window.typingStatus);
        await new Promise((resolve) => setTimeout(resolve, 1100));
        await hideTypingIndicator(newStatus);
        const msgElement = createMessageElement(contentFlow, window.typingStatus);
        const msgBubble = msgElement.querySelector(".message-bubble");
        msgBubble.style.opacity = "0";
        msgBubble.style.transition = "all 0.3s ease-out";
        chatWindow.appendChild(msgElement);
        const chatAvatars = msgElement.querySelector("i, .chat-avatar");
        if (chatAvatars) {
          if (chatAvatars.tagName === "IMG") {
            await new Promise((p) => {
              if (chatAvatars.complete) {
                p();
              } else {
                chatAvatars.onload = p;
              }
            });
          } else {
            await new Promise((resolve) => setTimeout(resolve, 30));
          }
        }
        requestAnimationFrame(() => {
          msgBubble.style.opacity = "1";
        });

        if (contentFlow.type === "projects-sequence") {
          if (contentFlow.text) {
            await typeWriterEffect(msgBubble, contentFlow.text);
          }
          await startProjectsSequence(
            contentFlow.data,
            contentFlow.globalButtons,
            contentFlow.finalButtons,
          );
        } else if (contentFlow.type === "services-sequence") {
          if (contentFlow.text) {
            await typeWriterEffect(msgBubble, contentFlow.text);
          }
          await startServicesSequence(
            contentFlow.data,
            contentFlow.globalButtons,
            contentFlow.finalButtons,
          );
          renderOptions(
            contentFlow.options || contentFlow.contextualOptions,
            msgElement,
            false,
          );
        } else if (contentFlow.type === "contact-details") {
          await typeWriterEffect(msgBubble, contentFlow.text);
          await typeContactSocials(msgBubble, contentFlow);
        } else if (contentFlow.type === "flexible-content") {
          msgBubble.classList.add("rich-paragraph");
          for (const flowBlock of contentFlow.blocks) {
            const tagBlock = document.createElement(
              flowBlock.tag.toLowerCase(),
            );
            if (flowBlock.className) {
              tagBlock.className = flowBlock.className;
            }
            msgBubble.appendChild(tagBlock);
            if (flowBlock.tag === "UL") {
              for (const item of flowBlock.items) {
                const listItem = document.createElement("li");
                tagBlock.appendChild(listItem);
                await typeWriterEffect(listItem, item);
                await new Promise((resolve) => setTimeout(resolve, 200));
              }
            } else {
              await typeWriterEffect(tagBlock, flowBlock.content);
            }
            await new Promise((resolve) => setTimeout(resolve, 200));
          }
        } else if (!contentFlow.isRich) {
          await typeWriterEffect(msgBubble, contentFlow.text);
        }
        if (contentFlow.options || contentFlow.contextualOptions) {
          const isRichProjectType =
            (contentFlow.isRich &&
              (contentFlow.project?.type === "client-logos" ||
                contentFlow.project?.type === "single-project-card")) ||
            contentFlow.type === "client-logos" ||
            contentFlow.type === "contact-details";
          if (!isRichProjectType) {
            renderOptions(
              contentFlow.options || contentFlow.contextualOptions,
              msgElement,
              false,
            );
          }
        }
        window.typingStatus = false;
      } else {
        chatWindow.appendChild(createMessageElement(contentFlow));
      }
      scrollToBottom();
      resolve();
    });
  }
  inputNavWrapper.classList.remove("disabled");
  mainNav.forEach((navItem) => navItem.classList.remove("disabled"));
  if (chatInput) {
    chatInput.disabled = false;
    if (window.innerWidth > 1024) {
      chatInput.focus();
    }
  }
  if (ToggleMenuButton) {
    ToggleMenuButton.disabled = false;
  }
  window.isProcessing = false;
};

/**
 * Show typing indicator
 * @param {boolean} status - Status of typing indicator
 */
const showTypingIndicator = (status = false) => {
  const newDiv = document.createElement("div");
  newDiv.classList.add(
    "message-row",
    "ai-message",
    "typing-indicator-row",
    "fade-out-init",
  );
  let avatarHTML = status
    ? '<img src="' +
    chatAvatarPath +
    '" class="chat-avatar" id="active-avatar">'
    : "";
  newDiv.innerHTML =
    "\n        " +
    avatarHTML +
    '\n        <div class="message-bubble typing-indicator">\n            <span></span><span></span><span></span>\n        </div>';
  chatWindow.appendChild(newDiv);
  requestAnimationFrame(() => newDiv.classList.add("visible"));
  scrollToBottom();
  return newDiv;
};

/**
 * Hide typing indicator
 * @param {Element} typingIndicatorDiv - Typing indicator element
 * @returns {Promise<void>} Promise that resolves when typing indicator is hidden
 */
const hideTypingIndicator = (typingIndicatorDiv) => {
  return new Promise((resolve) => {
    if (!typingIndicatorDiv) {
      return resolve();
    }
    const typingIndicator = typingIndicatorDiv.querySelector(".typing-indicator");
    if (typingIndicator) {
      typingIndicator.style.opacity = "0";
      typingIndicator.style.transition = "opacity 0.3s ease";
    }
    setTimeout(() => {
      typingIndicatorDiv.remove();
      resolve();
    }, 300);
  });
};

/**
 * Type contact socials
 * @param {Element} tagBlock - Tag block element
 * @param {Object} contactData - Contact data
 */
const typeContactSocials = async (tagBlock, contactData) => {
  const contactSectionWrapper = document.createElement("div");
  contactSectionWrapper.className = "contact-section-wrapper";
  tagBlock.appendChild(contactSectionWrapper);
  for (const directItem of contactData.direct) {
    const directRow = document.createElement("span");
    directRow.className = "contact-direct-row";
    directRow.innerHTML =
      '<span><i class="' +
      directItem.icon +
      '"></i><span class="label">' +
      directItem.label +
      ' </span></span> <span class="type-target"></span>';
    contactSectionWrapper.appendChild(directRow);
    const typeTarget = directRow.querySelector(".type-target");
    await typeWriterEffect(typeTarget, directItem.value);
    await new Promise((resolve) => setTimeout(resolve, 200));
    scrollToBottom();
  }
  const socialRow = document.createElement("div");
  socialRow.className = "contact-social-row";
  contactSectionWrapper.appendChild(socialRow);
  for (const contactSocial of contactData.socials) {
    const newLink = document.createElement("a");
    newLink.className = "contact-social-icon";
    newLink.href = contactSocial.url;
    newLink.target = "_blank";
    newLink.innerHTML =
      '<i class="' + contactSocial.icon + " " + contactSocial.class + '"></i>';
    socialRow.appendChild(newLink);
    await new Promise((s) => setTimeout(s, 150));
    newLink.classList.add("visible");
    scrollToBottom();
  }
  if (contactData.options) {
    const msgRow = tagBlock.closest(".message-row");
    renderOptions(contactData.options, msgRow, false);
    scrollToBottom();
  }
};

// Toggle send button state
const toggleSendButtonState = () => {
  sendButton.disabled = chatInput.value.trim() === "";
};

/**
 * Process command
 * @param {string} c - Command to process
 * @returns {string} - Command to process
 */
const processCommand = (c) => {
  const commandLower = c.trim().toLowerCase();
  if (commandLower.startsWith("__project_flow")) {
    const projectIndex = parseInt(commandLower.replace("__project_flow", ""));
    if (!isNaN(projectIndex)) {
      currentProjectIndex = projectIndex;
      displayNextProject();
      return "__handled";
    }
  }
  
  if (commandLower.startsWith("__service_flow")) {
    const serviceIndex = parseInt(commandLower.replace("__service_flow", ""));
    if (!isNaN(serviceIndex)) {
      currentServiceIndex = serviceIndex;
      displayNextService();
      return "__handled";
    }
  }

  if (commandLower === "__next_project") {
    currentProjectIndex++;
    displayNextProject();
    return "__handled";
  }

  if (commandLower === "__next_service") {
    currentServiceIndex++;
    displayNextService();
    return "__handled";
  }

  if (keywordMap[commandLower]) {
    return keywordMap[commandLower];
  }
  if (chatFlow[commandLower]) {
    return commandLower;
  }

  let closestMatch = null;
  let closestDistance = 99;
  const maxDistance = 2;
  const keywordKeys = Object.keys(keywordMap);
  for (const keyword of keywordKeys) {
    const distance = levenshtein(commandLower, keyword);
    if (distance <= maxDistance && distance < closestDistance) {
      closestDistance = distance;
      closestMatch = keywordMap[keyword];
    }
    if (commandLower.includes(keyword) && keyword.length > 3) {
      return keywordMap[keyword];
    }
  }
  return closestMatch || "error";
};

/**
 * Generate and process response
 * @param {string} command - Command to process
 * @param {string} userText - User text
 */
const generateAndProcessResponse = async (command, userText = command) => {

  // Send the prompt to server
  sendPromptToApi(command);

  if (command === "open_contact_form") {
    window.openContactModal();
    return;
  }
  if (!command.trim()) {
    return;
  }

  // Update browser URL without reloading the page
  updateBrowserURL(command);

  const contextualOptions = chatWindow.querySelectorAll(".contextual-options");
  if (contextualOptions.length > 0) {
    contextualOptions[contextualOptions.length - 1].remove();
  }
  const processedCommand = processCommand(command);
  chatInput.value = "";
  toggleSendButtonState();
  const userMessage = {
    speaker: "U",
    text: userText,
    delay: 0,
  };
  const userMessageElement = createMessageElement(userMessage);
  chatWindow.appendChild(userMessageElement);
  scrollToBottom();
  await startConversationFlow(processedCommand);
};


/**
 * Send command to API
 * @param {string} command - Command to send
 */
const sendPromptToApi = async (command) => {
  const response = await fetch("/api/v1/send-prompt", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRF-TOKEN": window.csrf_token,
    },
    body: JSON.stringify({ message: command }),
  });

  const data = await response.json();

  if (data.success) {
    return data.data;
  }

  return false;
};


/**
 * Send  locale to API 
 */
const setLocaleToApi = async (locale) => {
  const response = await fetch("/api/v1/set-locale", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRF-TOKEN": window.csrf_token,
    },
    body: JSON.stringify({ locale }),
  });

  const data = await response.json();

  if (data.success) {
    return data.data;
  }

  return false;
};


/**
 * Render options
 * @param {Array<Object>} optionsList - List of options
 * @param {Element} element - Element to render options in
 * @param {boolean} appendToElement - Whether to append to element
 */
const renderOptions = (optionsList, element, appendToElement = false) => {
  if (!optionsList || optionsList.length === 0) {
    return;
  }
  const optionsDiv = document.createElement("div");
  optionsDiv.classList.add("contextual-options");
  optionsList.forEach((optionValue, index) => {
    const actionElement = optionValue.action
      ? document.createElement("button")
      : document.createElement("a");
    actionElement.classList.add("btn", "btn-primary");
    if (optionValue.styleClass) {
      actionElement.classList.add(optionValue.styleClass);
    }
    actionElement.innerHTML =
      '<span class="button-content"><span>' +
      optionValue.text +
      '</span><span aria-hidden="true">' +
      optionValue.text +
      "</span></span>";
    const animationDelay = index * 100;
    actionElement.style.animation = "fadeUpAndIn 0.3s ease-out forwards";
    actionElement.style.animationDelay = animationDelay + "ms";
    if (optionValue.action) {
      actionElement.setAttribute("data-action", optionValue.action);
      actionElement.addEventListener("click", () => {
        generateAndProcessResponse(optionValue.action, optionValue.text);
      });
    } else if (optionValue.link) {
      actionElement.href = optionValue.link;
      actionElement.target = "_blank";
    }
    optionsDiv.appendChild(actionElement);
  });
  try {
    
    if (appendToElement) {
      element.appendChild(optionsDiv);
    } else if (document.body.contains(element)) {
      element.insertAdjacentElement("afterend", optionsDiv);
    } else {
      document.getElementById("chat-window").appendChild(optionsDiv);
    }
  } catch (error) {
    console.error("Error rendering options:", error);
  }
};

/**
 * Typewriter effect
 * @param {Element} element - Element to apply typewriter effect to
 * @param {string} text - Text to type
 */
const typeWriterEffect = (element, text) => {
  return new Promise((resolve) => {
    let scrollInterval;
    const typewriterInstance = new Typewriter(element, {
      delay: 1,
      loop: false,

      cursor: " ",
      autoStart: true,
      stringSplitter: (str) => {
        scrollToBottom();
        const regex =
          /(<[^>]+>|[\u{1F1E6}-\u{1F1FF}]{2}|[\p{Extended_Pictographic}]|.)/gu;
        return str.match(regex) || [];
      },
    });
    const formattedText = text.replace(
      /\*\*(.*?)\*\*/g,
      "<strong>$1</strong>",
    );
    typewriterInstance.typeString(formattedText);
    typewriterInstance
      .callFunction(() => {
        if (scrollInterval) {
          clearInterval(scrollInterval);
        }
        const cursorElement = element.querySelector(".Typewriter__cursor");
        if (cursorElement) {
          cursorElement.style.display = "none";
        }
        typewriterInstance.stop();
        scrollToBottom();
        resolve();
      })
      .start();
    scrollInterval = setInterval(scrollToBottom, 50);
    setTimeout(
      () => {
        if (scrollInterval) {
          clearInterval(scrollInterval);
        }
      },
      text.length * 30 + 1000,
    );
  });
};

/**
 * Create message element
 * @param {Object} messageData - Message data
 * @param {boolean} isFirstMessage - Whether it's the first message
 */
const createMessageElement = (messageData, isFirstMessage = false) => {
  const messageRow = document.createElement("div");
  messageRow.classList.add(
    "message-row",
    messageData.speaker === "A" ? "ai-message" : "user-message",
  );
  if (messageData.speaker === "A" && isFirstMessage) {
    const chatAvatarElement = document.createElement("img");
    chatAvatarElement.src = chatAvatarPath;
    chatAvatarElement.className = "chat-avatar";
    messageRow.appendChild(chatAvatarElement);
  } else if (messageData.speaker === "A") {
    messageRow.classList.add("no-avatar");
  }
  if (messageData.rowClass) {
    messageRow.classList.add(messageData.rowClass);
  }
  const messageBubble = document.createElement("div");
  messageBubble.classList.add("message-bubble");
  if (messageData.isRich && messageData.type === "single-project-card") {
    messageBubble.classList.add("single-project-card", "project-fade-in");
    const projectData = messageData.projectData;
    if (!projectData) {
      return messageRow;
    }
    const projectCard = document.createElement("div");
    projectCard.className = "project-card";
    const mediaWrapperClass ="project-media-wrapper popup-content";
    let mediaIconClass = "";
    if (projectData.mediaType === "gallery" || 
        projectData.mediaType === "image"
    ) {
      mediaIconClass = "fa-solid fa-photo-film";
    } else if (
      projectData.mediaType === "youtube" ||
      projectData.mediaType === "video"
    ) {
      mediaIconClass = "fa-solid fa-play";
    }
    const mediaIconOverlay = mediaIconClass
      ? '<div class="media-icon-overlay"><i class="' +
      mediaIconClass +
      '"></i></div>'
      : "";
    projectCard.innerHTML =
      '\n        <div class="' +
      mediaWrapperClass +
      '">\n            ' +
      mediaIconOverlay +
      '\n            <img src="' +
      projectData.image +
      '" alt="' +
      projectData.title +
      '">\n        </div>\n        <div class="details">\n            <h4>' +
      projectData.title +
      "</h4>\n            <p>" +
      projectData.summary +
      "</p>\n            " +
      (projectData.link
        ? '\n            <a href="' +
        projectData.link +
        '" target="_blank" class="preview-link">\n                ' +
        (isArabic ? "معاينة" : "Preview") +
        ' \n                <i class="fa-solid fa-arrow-up-right-from-square"></i>\n            </a>'
        : "") +
      "\n        </div>\n    ";
    if (projectCard.querySelector(".popup-content")) {
      projectCard.querySelector(".popup-content").onclick = () =>
        openMasterModal(projectData);
    }
    messageBubble.appendChild(projectCard);
  } else if (messageData.type === "client-logos") {
    const clientIntroText = document.createElement("div");
    clientIntroText.className = "client-intro-text";
    messageBubble.appendChild(clientIntroText);
    typeWriterEffect(clientIntroText, messageData.text).then(() => {
      const clientLogosWrapper = document.createElement("div");
      clientLogosWrapper.className = "client-logos-wrapper";
      messageBubble.appendChild(clientLogosWrapper);
      if (messageData.logos && messageData.logos.length > 0) {
        messageData.logos.forEach((logo, index) => {
          const clientLogoItem = document.createElement("div");
          clientLogoItem.className = "client-logo-item animated-logo";
          clientLogoItem.style.animationDelay = index * 100 + "ms";
          clientLogoItem.innerHTML =
            '<img src="' +
            logo.logoUrl +
            '" alt="' +
            logo.name +
            '">';
          clientLogosWrapper.appendChild(clientLogoItem);
        });
        const delay = messageData.logos.length * 100 + 100;
        setTimeout(() => {
          if (messageData.options) {
            renderOptions(messageData.options, messageRow, false);
            scrollToBottom();
          }
        }, delay);
      }
      scrollToBottom();
    });
  } else if (messageData.speaker === "U") {
    messageBubble.innerHTML = messageData.text.replace(
      /\*\*(.*?)\*\*/g,
      "<strong>$1</strong>",
    );
  }
  messageRow.appendChild(messageBubble);
  return messageRow;
};


/**
 * Scroll to bottom
 */
const scrollToBottom = () => {
  if (!allowScrollOnTyping) return;
  window.scrollTo({
    top: document.documentElement.scrollHeight,
    behavior: "smooth",
  });
};

/**
 * Levenshtein distance
 * @param {string} a - First string
 * @param {string} b - Second string
 */
function levenshtein(a, b) {
  if (a.length === 0) {
    return b.length;
  }
  if (b.length === 0) {
    return a.length;
  }
  const data = [];
  for (let i = 0; i <= b.length; i++) {
    data[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    data[0][j] = j;
  }
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        data[i][j] = data[i - 1][j - 1];
      } else {
        data[i][j] = Math.min(
          data[i - 1][j - 1] + 1,
          data[i][j - 1] + 1,
          data[i - 1][j] + 1,
        );
      }
    }
  }
  return data[b.length][a.length];
}


async function toggleBodyLanguage() {
  document.body.classList.toggle('rtl');
  const newLang = document.body.classList.contains('rtl') ? 'ar' : 'en';
  setCookies('direction', document.body.classList.contains('rtl') ? 'rtl' : 'ltr', 365);
  document.documentElement.lang = newLang;
  isArabic = newLang == 'ar' ? 'rtl' : 'ltr';
  setCookies('locale', newLang, 365);
  setLocaleToApi(newLang);
  window.location.reload();
}

/**
 * Generate project message
 * @param {number} index - Project index
 * @param {Object} projectData - Project data
 * @param {number} totalProjects - Total number of projects
 * @param {Array<Object>} projectOptions - Project options
 * @param {Array<Object>} finalProjectOptions - Final project options
 */
const generateProjectMessage = (
  index,
  projectData,
  totalProjects,
  projectOptions,
  finalProjectOptions,
) => {
  const isLastProject = index === totalProjects - 1;
  let projectOptionsToUse = [];
  if (isLastProject) {
    projectOptionsToUse = finalProjectOptions || [];
  } else {
    projectOptionsToUse.push({
      text: "Show Next Project",
      action: "__project_flow" + (index + 1),
    });
    if (projectOptions) {
      projectOptionsToUse.push(...projectOptions);
    }
  }
  return [
    {
      speaker: "A",
      text:
        "Project " +
        (index + 1) +
        " of " +
        totalProjects +
        " : **" +
        projectData.title +
        "**",
      delay: 500,
    },
    {
      speaker: "A",
      isRich: true,
      project: {
        type: "single-project-card",
        data: projectData,
      },
      options: projectOptionsToUse,
    },
  ];
};



/**
 * Initialize DOMContentLoaded event listener
 */
document.addEventListener("DOMContentLoaded", () => {
  chatWindow = document.getElementById("chat-window");
  chatInput = document.getElementById("chat-input");
  sendButton = document.getElementById("send-button");
  const body = document.getElementById("body");
  const primaryNav = document.getElementById("primary-nav");
  const introOptions = [];
  document
    .getElementById("intro-options-target")
    .querySelectorAll(".btn-primary")
    .forEach((e) => {
      const buttonContent = e.querySelector(".button-content");
      if (!buttonContent) {
        return;
      }
      const spanContent = buttonContent.querySelector("span").innerHTML;
      e.innerHTML =
        '\n            <span class="button-content">\n                <span>' +
        spanContent +
        '</span>\n                <span aria-hidden="true">' +
        spanContent +
        "</span>\n            </span>\n        ";
    });
  const checkbox = document.getElementById("dark-checkbox");
  checkbox.addEventListener("change", () => {
    document.body.classList.add("no-transition");
    document.body.classList.toggle("dark");
    document.body.offsetHeight;
    document.body.classList.remove("no-transition");
    setCookies('theme', document.body.classList.contains('dark') ? 'dark' : 'light', 365);
  });
  const setupIntroOptions = () => {
    const introOptionsTarget = document.getElementById("intro-options-target");
    if (!introOptionsTarget) {
      return;
    }
    const buttons = introOptionsTarget.querySelectorAll("button");
    buttons.forEach((button) => {
      button.onclick = () => {
        const action = button.getAttribute("data-action");
        const text = button.querySelector(
          ".button-content span",
        ).innerText;
        generateAndProcessResponse(action, text);
      };
    });
  };
  window.openContactModal = () => {
    const masterModal = document.getElementById("master-modal");
    const modalContentArea = document.getElementById("modal-content-area");
    modalContentArea.innerHTML =
      '\n        <div class="contact-form-wrapper">\n            <h3>' +
      (isArabic
        ? "يسعدني تلقي رسالتك في أي وقت"
        : "Feel free to drop me a message") +
      '</h3>\n            <form class="ajax-contact-form" id="ajax-contact-form">\n                <input autocomplete="off" type="text" name="user_name" \n                    placeholder="' +
      (isArabic ? "الاسم" : "Name") +
      '" required>\n                <input autocomplete="off" type="email" name="user_email" id="form_email" \n                    placeholder="' +
      (isArabic ? "البريد الإلكتروني" : "Email") +
      '" required> \n                <textarea name="user_message" min="10" \n                    placeholder="' +
      (isArabic ? "رسالتك..." : "Message") +
      '" required></textarea>\n                <button type="submit" id="form-submit-btn" class="btn btn-primary">\n                    <span class="button-content">\n                        <span>' +
      (isArabic ? "إرسال الرسالة" : "Send Message") +
      '</span>\n                        <span aria-hidden="true">' +
      (isArabic ? "إرسال الرسالة" : "Send Message") +
      "</span>\n                    </span>\n                </button>\n            </form>\n        </div>\n        ";
    masterModal.classList.add("active", "modal-contact");
    const ajaxContactForm = document.getElementById("ajax-contact-form");
    ajaxContactForm.onsubmit = async function (event) {
      event.preventDefault();
      const formSubmitBtn = document.getElementById("form-submit-btn");
      const userName = this.querySelector('[name="user_name"]').value;
      const userEmail = this.querySelector('[name="user_email"]').value;
      const userMessage = this.querySelector('[name="user_message"]').value;

      if (userMessage.length < 10) {
        return alert(isArabic ? "الرجاء كتابة رسالة من 10 أحرف على الأقل" : "Please write a message of at least 10 characters");
      }

      formSubmitBtn.disabled = true;
      formSubmitBtn.innerText = isArabic ? "جاري الإرسال..." : "Sending...";
      const formData = {};
      formData.name = userName;
      formData.email = userEmail;
      formData.message = userMessage;
      formData.phone = '';
      formData.form_key = 'contact';
      formData.subject = 'Contact form message';

      try {
        const response = await fetch("/api/v1/send-message", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-CSRF-TOKEN": window.csrf_token,
          },
          body: JSON.stringify(formData),
        });

        const jsonRes = await response.json();
        if (jsonRes.status === "success") {
          closeMasterModal();
          setTimeout(() => {
            const usrMsg = 'Hello, <br /> My name is: ' + userName + '<br /> and my email is: ' + userEmail + '<br /> and I want to contact you, and here is my message: <br /> ' + userMessage;
            generateAndProcessResponse("msg_success", usrMsg);
          }, 500);
        } else {
          throw new Error(jsonRes.message);
        }
      } catch (error) {
        formSubmitBtn.innerText = isArabic
          ? "خطأ - حاول مرة أخرى"
          : "Error - Try Again";
        formSubmitBtn.disabled = false;
      }
    };
  };
  window.openMasterModal = (media) => {
    const masterModal = document.getElementById("master-modal");
    const modalContentArea = document.getElementById("modal-content-area");
    window.currentSlideIndex = 0;
    modalContentArea.innerHTML = "";
    if (media.mediaType === "gallery") {
      let galleryHTML = media.gallery
        .map(
          (galleryImage) =>
            '<div class="slider-item"><img alt="" src="' +
            galleryImage +
            '" class="slider-img"></div>',
        )
        .join("");
      modalContentArea.innerHTML =
        '\n                <div class="modal-slider">\n                    <div id="modal-counter" class="modal-counter"></div> \n                    <button class="slider-nav prev-slide" onclick="moveSlide(-1)"><i class="fa-solid fa-chevron-left"></i></button>\n                    <div class="slider-track" id="s-track">' +
        galleryHTML +
        '</div>\n                    <button class="slider-nav next-slide" onclick="moveSlide(1)"><i class="fa-solid fa-chevron-right"></i></button>\n                </div>';
      updateModalCounter(media.gallery.length);
      initializeSlider(media.gallery.length);
    } else if (media.mediaType === "video") {
      modalContentArea.innerHTML =
        '<video src="' +
        media.videoUrl +
        '" controls autoplay style="width:100%"></video>';
    } else if (media.mediaType === "youtube") {
      modalContentArea.innerHTML =
        '\n                <iframe width="100%" height="100%" \n                    src="https://www.youtube-nocookie.com/embed/' +
        media.youtubeId +
        '?autoplay=1&rel=0&enablejsapi=1" \n                    frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" \n                    allowfullscreen>\n                </iframe>';
    } else {
      let galleryHTML = '<div class="slider-item"><img alt="" src="' + media.image +'" class="slider-img"></div>';

      modalContentArea.innerHTML =
        '\n                <div class="modal-slider">\n                    <div id="modal-counter" class="modal-counter"></div> \n                    <button class="slider-nav prev-slide" onclick="moveSlide(-1)"><i class="fa-solid fa-chevron-left"></i></button>\n                    <div class="slider-track" id="s-track">' +
        galleryHTML +
        '</div>\n                    <button class="slider-nav next-slide" onclick="moveSlide(1)"><i class="fa-solid fa-chevron-right"></i></button>\n                </div>';
      updateModalCounter(1);
      initializeSlider(1);
    }
    masterModal.classList.add("active");
  };
  window.currentSlideIndex = 0;
  window.moveSlide = (direction) => {
    const sliderTrack = document.getElementById("s-track");
    if (!sliderTrack) {
      return;
    }
    const sliderItems = sliderTrack.querySelectorAll(".slider-item");
    const totalSlides = sliderItems.length;
    if (totalSlides === 0) {
      return;
    }
    let newSlideIndex = window.currentSlideIndex + direction;
    if (newSlideIndex < 0) {
      newSlideIndex = 0;
    } else if (newSlideIndex >= totalSlides) {
      newSlideIndex = totalSlides - 1;
    }
    window.currentSlideIndex = newSlideIndex;
    const slideOffset = window.currentSlideIndex * 100;
    if (isArabic) {
      sliderTrack.style.transform = "translateX(" + slideOffset + "%)";
    } else {
      sliderTrack.style.transform = "translateX(-" + slideOffset + "%)";
    }
    initializeSlider(totalSlides);
    updateModalCounter(totalSlides);
  };
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      const masterModal = document.getElementById("master-modal");
      if (masterModal.classList.contains("active")) {
        closeMasterModal();
      }
    }
    if (document.querySelector(".modal-slider")) {
      if (event.key === "ArrowLeft") {
        window.moveSlide(-1);
      } else if (event.key === "ArrowRight") {
        window.moveSlide(1);
      }
    }
  });
  function initializeSlider(i) {
    const prevSlideButton = document.querySelector(".prev-slide");
    const nextSlideButton = document.querySelector(".next-slide");
    if (!prevSlideButton || !nextSlideButton) {
      return;
    }
    if (isArabic) {
      prevSlideButton.style.display =
        window.currentSlideIndex === 0 ? "none" : "flex";
      nextSlideButton.style.display =
        window.currentSlideIndex === i - 1 ? "none" : "flex";
    } else {
      prevSlideButton.style.display =
        window.currentSlideIndex === 0 ? "none" : "flex";
      nextSlideButton.style.display =
        window.currentSlideIndex === i - 1 ? "none" : "flex";
    }
  }
  let touchStartX = 0;
  let touchEndX = 0;
  const modalContainer = document.querySelector(".modal-container");
  if (modalContainer) {
    modalContainer.addEventListener(
      "touchstart",
      (event) => {
        touchStartX = event.changedTouches[0].screenX;
      },
      {
        passive: true,
      },
    );
    modalContainer.addEventListener(
      "touchend",
      (event) => {
        touchEndX = event.changedTouches[0].screenX;
        handleSwipe();
      },
      {
        passive: true,
      },
    );
  }
  function handleSwipe() {
    const sliderTrack = document.getElementById("s-track");
    if (!sliderTrack) {
      return;
    }
    const swipeThreshold = 50;
    if (touchEndX < touchStartX - swipeThreshold) {
      if (isArabic) {
        window.moveSlide(-1);
      } else {
        window.moveSlide(1);
      }
    }
    if (touchEndX > touchStartX + swipeThreshold) {
      if (isArabic) {
        window.moveSlide(1);
      } else {
        window.moveSlide(-1);
      }
    }
  }

  let isDragging = false;
  let dragStartX = 0;
  modalContainer.addEventListener("mousedown", (e) => {
    if (!document.getElementById("s-track")) {
      return;
    }
    isDragging = true;
    dragStartX = e.pageX;
    modalContainer.style.cursor = "grabbing";
  });
  const handleDragEnd = (event) => {
    if (!isDragging) {
      return;
    }
    const dragCurrentX = event.pageX;
    const dragDistance = dragCurrentX - dragStartX;
    const dragThreshold = 70;
    if (dragDistance < -dragThreshold) {
      if (isArabic) {
        window.moveSlide(-1);
      } else {
        window.moveSlide(1);
      }
    }
    if (dragDistance > dragThreshold) {
      if (isArabic) {
        window.moveSlide(1);
      } else {
        window.moveSlide(-1);
      }
    }
    isDragging = false;
    modalContainer.style.cursor = "grab";
  };
  modalContainer.addEventListener("mouseup", handleDragEnd);
  modalContainer.addEventListener("mouseleave", handleDragEnd);
  function updateModalCounter(c) {
    const modalCounter = document.getElementById("modal-counter");
    if (!modalCounter) {
      return;
    }
    modalCounter.textContent = window.currentSlideIndex + 1 + " / " + c;
  }
  window.closeMasterModal = () => {
    const masterModal = document.getElementById("master-modal");
    const modalContentArea = document.getElementById("modal-content-area");
    masterModal.classList.remove("active");
    setTimeout(() => {
      modalContentArea.innerHTML = "";
    }, 300);
  };
  document
    .getElementById("master-modal")
    .addEventListener("click", function (event) {
      if (event.target === this) {
        window.closeMasterModal();
      }
    });
  const setupMenuToggle = () => {
    const btnMenuToggle = document.getElementById("btn-menu-toggle");
    const navLinksContainer = primaryNav.querySelector(".nav-links-container");
    const mainButtons = navLinksContainer.querySelectorAll(".btn-primary-nav");
    mainButtons.forEach((b) => {
      b.addEventListener("click", (event) => {
        const dataFlow = b.getAttribute("data-flow");
        const buttonText = b.innerText.trim();
        generateAndProcessResponse(buttonText);
        primaryNav.classList.remove("menu-active");
        document.body.classList.remove("open-menu");
      });

      introOptions.push(b);
    });
    if (btnMenuToggle) {
      btnMenuToggle.onclick = (e) => {
        document.body.classList.toggle("open-menu");
        e.stopPropagation();
        primaryNav.classList.toggle("menu-active");
      };
    }
    document.addEventListener("click", (e) => {
      const isClickInsideNav = primaryNav.contains(e.target);
      const isClickInsideToggle = btnMenuToggle && btnMenuToggle.contains(e.target);
      if (
        primaryNav.classList.contains("menu-active") &&
        !isClickInsideNav &&
        !isClickInsideToggle
      ) {
        primaryNav.classList.remove("menu-active");
        document.body.classList.remove("open-menu");
      }
    });
  };

  // 

  // setupMenuToggle();
  setupIntroOptions();
  chatInput.addEventListener("input", toggleSendButtonState);
  sendButton.addEventListener("click", () => {
    window.isProcessing = true;
    if (!sendButton.disabled) {
      generateAndProcessResponse(chatInput.value);
    }
  });
  chatInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (chatInput.value.trim() !== "") {
        generateAndProcessResponse(chatInput.value);
      }
    }
  });
  toggleSendButtonState();
});


// update browser URL without reloading the page
const updateBrowserURL = (command) => {
  const formattedCommand = encodeURIComponent(command).replace(/%20/g, "-");
  window.history.replaceState(null, "", "/" + formattedCommand);
};


/**
 * Lightbox functionality for service gallery images
 * 
 */

document.addEventListener('click', function (e) {

  const image = e.target.closest('.service-gallery img');

  if (!image) return;

  const images = document.querySelectorAll('.service-gallery img');

  let currentIndex = [...images].indexOf(image);

  const lightbox = document.getElementById('galleryLightbox');
  const lightboxImage = document.getElementById('lightboxImage');
  const closeButton = lightbox.querySelector('.gallery-close');
  const overlay = lightbox.querySelector('.lightbox-overlay');

  lightboxImage.src = image.src;
  lightbox.classList.add('active');

  function next() {
    currentIndex = (currentIndex + 1) % images.length;
    lightboxImage.src = images[currentIndex].src;
  }

  function prev() {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    lightboxImage.src = images[currentIndex].src;
  }

  // Store functions for the buttons
  lightbox.querySelector('.gallery-next').onclick = next;
  lightbox.querySelector('.gallery-prev').onclick = prev;
  closeButton.onclick = function () {
    lightbox.classList.remove('active');
  };
  overlay.onclick = function () {
    lightbox.classList.remove('active');
  };
});


/**
 * Window load event listener
 */
window.addEventListener("load", () => {

  const preloader = document.getElementById("preloader");
  if (preloader) {
    setTimeout(() => {
      preloader.classList.add("preloaded");
    }, 1000);
  }
});



// Set cookies
function setCookies(name, value, days) {
  const expires = days ? `; expires=${new Date(Date.now() + days * 86400000).toUTCString()}` : '';
  document.cookie = `${name}=${value}${expires}; path=/; SameSite=Lax`;
}

// Get cookies
function getCookies(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

// Delete cookies
function deleteCookies(name) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}
