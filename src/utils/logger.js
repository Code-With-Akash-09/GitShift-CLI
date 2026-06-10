import chalk from "chalk";

export const success = (msg) => console.log(chalk.green(`\n✓ ${msg}\n`));

export const error = (msg) => console.log(chalk.red(`\n✗ ${msg}\n`));

export const info = (msg) => console.log(chalk.cyan(`\nℹ ${msg}\n`));