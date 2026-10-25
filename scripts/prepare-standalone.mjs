import { cpSync, existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const projectRoot = process.cwd();
const standaloneRoot = join(projectRoot, ".next", "standalone");

if (!existsSync(join(standaloneRoot, "server.js"))) {
  throw new Error("未找到 .next/standalone/server.js，请先执行 npm run build。");
}

const copyDirectory = (source, destination) => {
  if (!existsSync(source)) {
    return;
  }

  mkdirSync(destination, { recursive: true });
  cpSync(source, destination, { recursive: true, force: true });
};

copyDirectory(join(projectRoot, "public"), join(standaloneRoot, "public"));
copyDirectory(
  join(projectRoot, ".next", "static"),
  join(standaloneRoot, ".next", "static"),
);

console.log("standalone 部署目录已准备完成：.next/standalone");
