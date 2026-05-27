import { expect, test } from "@playwright/test";

const messyTask =
  "I need to reply to this email but I feel ashamed it is late.";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test("creates a rescue packet from messy text", async ({ page }) => {
  await page.getByLabel("Messy task").fill(messyTask);
  await page.getByRole("button", { name: "I'm stuck" }).click();

  await expect(page.getByRole("heading", { name: "Reply to this email" })).toBeVisible();
  await expect(page.getByText("Next physical action")).toBeVisible();
  await expect(
    page.getByText(
      "Open the thread and write a two-sentence holding reply. Do not overexplain.",
      { exact: true }
    )
  ).toBeVisible();
  await expect(page.getByText("I'm sorry for the delay")).toBeVisible();
});

test("runs a sprint and records done enough", async ({ page }) => {
  await page.getByLabel("Messy task").fill("I have an essay due and I don't know where to start.");
  await page.getByRole("button", { name: "I'm stuck" }).click();
  await page.getByRole("button", { name: "Start rescue sprint" }).click();
  await expect(page.getByRole("heading", { name: "Essay due" })).toBeVisible();
  await expect(page.getByText("Ready the environment", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Done enough" }).click();

  await page.getByText("Packet controls").click();
  await expect(page.getByLabel("Status")).toHaveValue("done_enough");
});

test("shows unfinished packets on the re-entry screen", async ({ page }) => {
  await page.getByLabel("Messy task").fill("I need to do my tax today but I keep avoiding it.");
  await page.getByRole("button", { name: "I'm stuck" }).click();
  await page.getByRole("button", { name: "Re-entry" }).click();

  await expect(
    page.getByRole("heading", {
      name: "No explanation needed. Choose what is still possible."
    })
  ).toBeVisible();
  await expect(page.getByText("Worth rescuing because")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Most worth rescuing" })).toBeVisible();
  await expect(page.getByText("Do my tax today")).toBeVisible();
  await page.getByRole("button", { name: /Resume first move/ }).click();
  await page.getByText("Packet controls").click();
  await expect(page.getByLabel("Status")).toHaveValue("in_progress");
});

test("uses unblock and exit responsibly controls", async ({ page }) => {
  await page.getByLabel("Messy task").fill("I need to finish the work proposal but the scope is too much.");
  await page.getByRole("button", { name: "I'm stuck" }).click();

  await expect(page.getByText("Next physical action")).toBeVisible();
  await page.getByRole("button", { name: "Decision" }).click();
  await expect(page.getByText("Current: Decision")).toBeVisible();

  await page.getByRole("button", { name: "Renegotiate" }).click();
  await expect(page.getByText("current scope")).toBeVisible();
  await page.getByText("Packet controls").click();
  await expect(page.getByLabel("Status")).toHaveValue("exited_responsibly");
});

test("maps task, missing-item, exit, and successful-start patterns", async ({ page }) => {
  await page.getByLabel("Messy task").fill(messyTask);
  await page.getByRole("button", { name: "I'm stuck" }).click();
  await page.getByRole("button", { name: "Start rescue sprint" }).click();
  await page.getByRole("button", { name: "Done enough" }).click();

  await page.getByRole("button", { name: "Rescue", exact: true }).click();
  await page.getByLabel("Messy task").fill("I need to finish the work proposal but the scope is too much.");
  await page.getByRole("button", { name: "I'm stuck" }).click();
  await page.getByRole("button", { name: "Renegotiate" }).click();

  await page.getByRole("button", { name: "Map" }).click();

  await expect(page.getByRole("heading", { name: "Task types" })).toBeVisible();
  await expect(page.getByText("Email / message", { exact: true })).toBeVisible();
  await expect(page.getByText("Work", { exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Usually missing" })).toBeVisible();
  await expect(page.getByText("Courage", { exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Exit choices" })).toBeVisible();
  await expect(page.getByText("Renegotiate", { exact: true })).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Rescue patterns that started" })
  ).toBeVisible();
  await expect(
    page.getByText("Email / message + Shame or fear -> Repair", { exact: true })
  ).toBeVisible();
  await expect(page.getByRole("heading", { name: "Use a pattern without handing over the wheel." })).toBeVisible();

  await page.getByRole("button", { name: /Email \/ message often starts with Repair/ }).click();
  await expect(page.getByText("Starter loaded: Email / message often starts with Repair.")).toBeVisible();
  await expect(page.getByLabel("Messy task")).toHaveValue(
    "I need to rescue an email / message task. The likely block is shame or fear. Start me with Repair."
  );
});

test("exports and imports local JSON data", async ({ page }, testInfo) => {
  await page.getByLabel("Messy task").fill(messyTask);
  await page.getByRole("button", { name: "I'm stuck" }).click();
  await page.getByRole("button", { name: "Settings", exact: true }).click();

  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export JSON" }).click();
  const download = await downloadPromise;
  const exportPath = testInfo.outputPath("scaffold-export.json");
  await download.saveAs(exportPath);

  const dialogMessagePromise = new Promise<string>((resolve) => {
    page.once("dialog", async (dialog) => {
      const message = dialog.message();
      resolve(message);
      await dialog.accept();
    });
  });
  await page.locator('input[type="file"]').setInputFiles(exportPath);
  await expect(dialogMessagePromise).resolves.toContain(
    "replace the current local Scaffold data"
  );

  await expect(page.getByText("Import complete.")).toBeVisible();
  await expect(page.getByText("1 local packets")).toBeVisible();
});

test("records explicit external LLM consent in settings", async ({ page }) => {
  await page.getByRole("button", { name: "Settings", exact: true }).click();

  await expect(page.getByRole("heading", { name: "LLM adapter" })).toBeVisible();
  await page.getByLabel("API key").fill("sk-local-test");
  await page.getByRole("button", { name: "Save BYOK settings" }).click();
  await expect(page.getByText("BYOK settings saved locally.")).toBeVisible();

  const consentCheckbox = page.getByLabel(
    "Allow task text to be sent to an external LLM adapter if one is connected."
  );
  await consentCheckbox.click();
  await expect(page.getByText("External LLM consent recorded locally.")).toBeVisible();
  await expect(consentCheckbox).toBeChecked();

  await page.getByRole("button", { name: "Rescue", exact: true }).click();
  await page.getByLabel("Messy task").fill(messyTask);
  await page.getByRole("button", { name: "I'm stuck" }).click();
  const deepRescueButton = page.getByRole("button", {
    name: "Deep Rescue",
    exact: true
  });
  await page.getByText("Deep Rescue adapter").click();
  await expect(deepRescueButton).toBeEnabled();
  await deepRescueButton.click();
  await expect(page.getByText("Text that will leave this browser")).toBeVisible();
  const runButton = page.getByRole("button", { name: "Run Deep Rescue" });
  await expect(runButton).toBeDisabled();
  await page
    .getByLabel("I understand this sends the text above to my selected provider")
    .check();
  await expect(runButton).toBeEnabled();

  await page.getByRole("button", { name: "Settings", exact: true }).click();
  await consentCheckbox.click();
  await expect(page.getByText("External LLM consent revoked locally.")).toBeVisible();
  await expect(consentCheckbox).not.toBeChecked();
});
