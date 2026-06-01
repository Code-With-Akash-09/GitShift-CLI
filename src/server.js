#!/usr/bin/env node

import { Command } from "commander";

import { addCommand } from "./commands/add.js";

import { listCommand } from "./commands/list.js";

import { currentCommand } from "./commands/current.js";

import { useCommand } from "./commands/use.js";

import { removeCommand } from "./commands/remove.js";

import { doctorCommand } from "./commands/doctor.js";

const program =
    new Command();

program
    .name("gitshift")
    .description(
        "GitHub Account Switcher"
    )
    .version("1.0.0");

program
    .command("add")
    .description(
        "Create profile"
    )
    .action(addCommand);

program
    .command("list")
    .description(
        "List profiles"
    )
    .action(listCommand);

program
    .command("current")
    .description(
        "Show active profile"
    )
    .action(currentCommand);

program
    .command("use <profile>")
    .description(
        "Switch profile"
    )
    .action(useCommand);

program
    .command("remove <profile>")
    .description(
        "Delete profile"
    )
    .action(removeCommand);

program
    .command("doctor")
    .description(
        "System health check"
    )
    .action(doctorCommand);

program.parse();