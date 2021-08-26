import { readdir, readFile } from "fs/promises";
import { join } from "path";
import PaymentTemplate from "./template_interface";

async function getTemplates(
  currency: string,
  workDir: string
): Promise<Array<PaymentTemplate>> {
  const templateNames = await readdir(join(workDir, currency));
  const templates: PaymentTemplate[] = [];
  for (const name of templateNames) {
    const file = await readFile(join(workDir, currency, name), {
      encoding: "utf-8",
    });
    const template = JSON.parse(file);
    templates.push(template);
  }
  return templates;
}

export const getTemplatesFromCollection = (currency: string) =>
  getTemplates(currency, join(process.cwd(), "/src/templates/collection"));
