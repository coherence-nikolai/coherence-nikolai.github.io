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
  await expect(page.getByText("Next physical action", { exact: true })).toBeVisible();
  await expect(
    page.getByText(
      "Open the thread and write a two-sentence holding reply. Do not overexplain.",
      { exact: true }
    )
  ).toBeVisible();
  await expect(page.getByText("I'm sorry for the delay")).toBeVisible();
});

test("autosaves and clears messy draft text locally", async ({ page }) => {
  await page.getByLabel("Messy task").fill("I need to start the grant report.");
  await expect(page.getByText("Draft autosaves locally in this browser.")).toBeVisible();

  await page.reload();
  await expect(page.getByLabel("Messy task")).toHaveValue(
    "I need to start the grant report."
  );

  await page.getByRole("button", { name: "Clear draft" }).click();
  await expect(page.getByLabel("Messy task")).toHaveValue("");
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

  await expect(page.getByText("Next physical action", { exact: true })).toBeVisible();
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

  await page.locator('input[type="file"]').setInputFiles(exportPath);
  await expect(
    page.getByRole("heading", { name: "Review import before overwrite" })
  ).toBeVisible();
  await expect(page.getByText("API keys are not part of Scaffold JSON exports")).toBeVisible();
  await page.getByRole("button", { name: "Replace local data" }).click();

  await expect(page.getByText("Import complete.")).toBeVisible();
  await expect(page.getByText("1 local", { exact: true })).toBeVisible();
});

test("uses the Rescue Quality Lab and saves a local signal", async ({ page }) => {
  await page.getByRole("button", { name: "Map" }).click();
  await page.getByRole("button", { name: "Quality Lab" }).click();

  await expect(
    page.getByRole("heading", {
      name: "Make packets sharper without vague AI fluff."
    })
  ).toBeVisible();
  await expect(page.getByText("Golden fixtures")).toBeVisible();
  await page.getByRole("button", { name: /Assignment blank start/ }).click();
  await expect(page.getByLabel("Messy input")).toHaveValue(
    "I need to start my assignment and I don't know where to start."
  );
  await expect(page.getByText("Local rules packet")).toBeVisible();
  await expect(page.getByText("No repair needed yet")).toBeVisible();

  await page.getByLabel("Which packet helped more?").selectOption("local_better");
  await page.getByLabel("What changed the decision?").selectOption("next_action");
  await page
    .getByLabel("Note")
    .fill("Local action is more physical and repair stays out of the way.");
  await page.getByRole("button", { name: "Save local signal" }).click();

  await expect(page.getByText("Quality signal saved locally.")).toBeVisible();
  await expect(page.getByText("1 saved")).toBeVisible();
  await expect(page.getByText("Local action is more physical")).toBeVisible();
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
  await page.route("https://api.openai.com/v1/chat/completions", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      headers: {
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify({
        choices: [
          {
            message: {
              content: JSON.stringify({
                title: "Reply to this email",
                realTask: "Send a late holding reply",
                taskType: "email",
                blockType: "shame_fear",
                blockConfidence: 0.92,
                emotionalLoad: 4,
                urgency: 4,
                consequence: 3,
                effort: 2,
                firstPhysicalAction:
                  "Open the email thread and type one factual holding sentence.",
                tenMinutePlan: [
                  "Minute 0-1: Open the email thread and type one factual holding sentence.",
                  "Minute 1-3: Name what you can send and when.",
                  "Minute 3-6: Remove extra apology and explanation.",
                  "Minute 6-8: Send it or save the draft.",
                  "Minute 8-10: Put the next step beside it."
                ],
                minimumViableProgress: "A factual holding reply exists.",
                repairScript:
                  "Hi [Name], I'm sorry for the delay. I can send [specific thing] by [time/date]. Thanks for your patience.",
                rescueMode: "repair",
                missingItem: "courage",
                exitScript:
                  "Hi [Name], I can send a smaller update by [time/date], or close the loop if this is no longer needed.",
                exitStatus: "not_chosen"
              })
            }
          }
        ]
      })
    });
  });
  await runButton.click();
  await expect(page.getByRole("heading", { name: "Review before applying." })).toBeVisible();
  await expect(
    page.getByText("Open the email thread and type one factual holding sentence.")
  ).toBeVisible();
  await page.getByRole("button", { name: "Apply Deep Rescue" }).click();
  await expect(page.getByText("Deep Rescue applied.")).toBeVisible();

  await page.getByRole("button", { name: "Settings", exact: true }).click();
  await consentCheckbox.click();
  await expect(page.getByText("External LLM consent revoked locally.")).toBeVisible();
  await expect(consentCheckbox).not.toBeChecked();
});
