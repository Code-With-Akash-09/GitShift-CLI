# GitShift CLI

GitShift CLI helps you create, manage, and switch between GitHub identity profiles from the terminal. It stores profiles locally, updates your global Git config, and can generate SSH keys for each profile when needed.

## Installation

```bash
npm install -g gitshift
```

Or run it locally from the project:

```bash
npm install
npm start -- --help
```

## Requirements

GitShift expects the following tools to be available on your machine:

- `git`
- `ssh`
- `ssh-keygen` for automatic SSH key generation
- `gh` is recommended and checked by `gitshift doctor`

## Usage

```bash
gitshift --help
```

### Commands

- `gitshift add` - Create a new local profile. Prompts for profile name, GitHub username, email, and whether to generate an SSH key.
- `gitshift list` - Show all saved profiles.
- `gitshift current` - Display the active profile.
- `gitshift use <profile>` - Switch to a saved profile and update global Git user name and email.
- `gitshift remove <profile>` - Delete a saved profile.
- `gitshift doctor` - Check whether Git, SSH, and GitHub CLI are installed.

## Example Workflow

```bash
gitshift add
gitshift list
gitshift use personal
gitshift current
gitshift doctor
```

When you create a profile and choose SSH generation, GitShift creates a key under your home directory in `.ssh` using the pattern `gitshift-<profile-name>`.

## How It Works

Profiles are saved locally on your machine using the app's configuration store. Switching profiles updates your global Git identity with:

- `user.name`
- `user.email`

## Notes

- Profile names must be unique.
- `gitshift use <profile>` only switches to profiles that already exist locally.
- If SSH key generation fails, make sure OpenSSH is installed and available in your shell.

## License

ISC

