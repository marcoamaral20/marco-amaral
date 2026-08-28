import { buildWhatsAppUrl, DIRECT_WHATSAPP_MESSAGE } from "../config/contact";

type BranchKey = "existing" | "emerging" | "problem";
type FirstChoice = BranchKey | "direct";

const branchLabels: Record<FirstChoice, string> = {
  existing: "Já tenho algo",
  emerging: "Estou começando algo",
  problem: "Tem algo que preciso resolver",
  direct: "Prefiro explicar direto",
};

const contactMessageLeads: Record<BranchKey, string> = {
  existing: "Já tenho algo",
  emerging: "Estou começando algo",
  problem: "Tenho algo que preciso resolver",
};

const moveFocus = (element: HTMLElement | null) => {
  element?.focus({ preventScroll: true });
};

const initializeContact = (root: HTMLElement) => {
  const firstPanel = root.querySelector<HTMLElement>("[data-decision-one]");
  const secondPanels = Array.from(
    root.querySelectorAll<HTMLElement>("[data-decision-two]"),
  );
  const readyPanel = root.querySelector<HTMLElement>("[data-contact-ready]");
  const context = root.querySelector<HTMLElement>("[data-contact-context]");
  const destination = root.querySelector<HTMLAnchorElement>(
    "[data-contact-destination]",
  );
  const restartControls = Array.from(
    root.querySelectorAll<HTMLButtonElement>("[data-contact-restart]"),
  );

  if (!firstPanel || !readyPanel || !context || !destination) return;

  let firstChoice: FirstChoice | null = null;
  let secondChoice: string | null = null;
  root.dataset.contactGeometryState = "start";

  const hideSecondPanels = () => {
    secondPanels.forEach((panel) => {
      panel.hidden = true;
    });
  };

  const updateContext = () => {
    context.textContent = firstChoice
      ? secondChoice
        ? `${branchLabels[firstChoice]} → ${secondChoice}`
        : branchLabels[firstChoice]
      : "";
  };

  const showStart = () => {
    root.dataset.contactGeometryState = "start";
    firstChoice = null;
    secondChoice = null;
    firstPanel.hidden = false;
    hideSecondPanels();
    readyPanel.hidden = true;
    restartControls.forEach((control) => {
      control.hidden = true;
    });
    root
      .querySelectorAll<HTMLButtonElement>("[aria-pressed]")
      .forEach((button) => {
        button.setAttribute("aria-pressed", "false");
      });
    updateContext();
    moveFocus(firstPanel.querySelector<HTMLElement>("h3"));
  };

  const showSecondDecision = (branch: BranchKey) => {
    root.dataset.contactGeometryState = branch;
    firstChoice = branch;
    secondChoice = null;
    firstPanel.hidden = true;
    readyPanel.hidden = true;
    hideSecondPanels();
    restartControls.forEach((control) => {
      control.hidden = false;
    });

    const panel = root.querySelector<HTMLElement>(
      `[data-decision-two="${branch}"]`,
    );
    if (!panel) return;
    panel.hidden = false;
    updateContext();
    moveFocus(panel.querySelector<HTMLElement>("h3"));
  };

  const showReady = () => {
    root.dataset.contactGeometryState = firstChoice ?? "direct";
    firstPanel.hidden = true;
    hideSecondPanels();
    readyPanel.hidden = false;
    restartControls.forEach((control) => {
      control.hidden = false;
    });
    updateContext();
    const message =
      firstChoice === "direct"
        ? DIRECT_WHATSAPP_MESSAGE
        : `Olá, Marco. ${firstChoice ? contactMessageLeads[firstChoice] : "Tenho um projeto"} e ${secondChoice?.toLocaleLowerCase("pt-BR") ?? "gostaria de explicar melhor"}. Gostaria de conversar sobre o projeto.`;
    destination.href = buildWhatsAppUrl(message);
    moveFocus(readyPanel.querySelector<HTMLElement>("h3"));
  };

  root.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;

    const firstButton = target.closest<HTMLButtonElement>(
      "[data-first-choice]",
    );
    if (firstButton) {
      const choice = firstButton.dataset.firstChoice as FirstChoice;
      firstChoice = choice;
      secondChoice = null;
      firstButton.setAttribute("aria-pressed", "true");
      if (choice === "direct") {
        showReady();
      } else {
        showSecondDecision(choice);
      }
      return;
    }

    const secondButton = target.closest<HTMLButtonElement>(
      "[data-second-choice]",
    );
    if (secondButton) {
      secondChoice = secondButton.dataset.secondChoice ?? null;
      showReady();
      return;
    }

    if (target.closest("[data-contact-back]")) {
      if (firstChoice && firstChoice !== "direct") {
        showSecondDecision(firstChoice);
      } else {
        showStart();
      }
      return;
    }

    if (
      target.closest("[data-contact-change]") ||
      target.closest("[data-contact-restart]")
    ) {
      showStart();
    }
  });
};

document
  .querySelectorAll<HTMLElement>("[data-contact]")
  .forEach(initializeContact);
