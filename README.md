# GitShift CLI

GitShift CLI helps you create, manage, and switch between GitHub identity profiles from the terminal. It stores profiles locally, updates your global Git config, can generate SSH keys for each profile when needed, and can import existing SSH keys from your `~/.ssh` folder.

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
- `gitshift scan` - Scan your `~/.ssh` folder and import existing SSH keys into new profiles.
- `gitshift doctor` - Check whether Git, SSH, and GitHub CLI are installed.

## Example Workflow

```bash
gitshift add
gitshift list
gitshift scan
gitshift use personal
gitshift current
gitshift doctor
```

When you create a profile and choose SSH generation, GitShift creates a key under your home directory in `.ssh` using the pattern `gitshift-<profile-name>`.

If you already have SSH keys on your machine, `gitshift scan` will list the available keys, let you pick one, and save it as a new imported profile.

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

