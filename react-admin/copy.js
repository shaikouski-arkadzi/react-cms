/* eslint-env node */
import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const buildPath = path.resolve(__dirname, "dist");
const target1 = path.resolve(__dirname, "../site/admin");
const target2 = "C:/MAMP/htdocs/react_admin/admin";

async function copyBuild() {
  if (!(await fs.pathExists(buildPath))) {
    console.error(`❌ Папка build не найдена: ${buildPath}`);
    process.exit(1);
  }

  try {
    console.log("🧹 Удаляю старые папки...");
    await fs.remove(target1);
    await fs.remove(target2);

    console.log("📂 Копирую в ../site/admin...");
    await fs.copy(buildPath, target1);

    console.log("📂 Копирую в C:/MAMP/htdocs/react_admin...");
    await fs.copy(buildPath, target2);

    console.log("✅ Готово! Билд скопирован в обе папки.");
  } catch (err) {
    console.error("❌ Ошибка копирования:", err);
    process.exit(1);
  }
}

copyBuild();
