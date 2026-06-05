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
 - `gitshift backup [file]` - Export profiles, folder mappings, and current profile to a JSON backup file (default: `gitshift-backup.json`).
 - `gitshift restore <file>` - Restore profiles and mappings from a previously created backup JSON file (prompts to confirm overwrite).

- `gitshift link <folder>` - Link a local folder to a profile (prompts to select or create a profile).
- `gitshift unlink <folder>` - Remove an existing folder mapping.
- `gitshift links` - List folder → profile mappings.
- `gitshift auto` - Auto-switch profile based on the current working directory and configured folder mappings.

### Add Command

- **Interactive prompts**: `Profile Name`, `GitHub Username`, `Email` (all required).
- **SSH key generation**: prompts `Generate SSH key automatically?` (default: **yes**). If accepted, an SSH key is generated and saved under `~/.ssh` with the pattern `gitshift-<profile-name>`.
- **Validation**: profile names must be unique; empty values for name, username, or email are rejected.
- **Cancelation**: pressing Ctrl+C during prompts exits gracefully and cancels creation.

### Folder mappings

- `gitshift link <folder>`: associates a local folder path with a profile. If no profiles exist, you'll be prompted to create one; otherwise you can pick an existing profile or create a new one. Linking stores an absolute path mapping so GitShift can detect and switch profiles when you `cd` into that folder.
- `gitshift unlink <folder>`: removes the mapping for the given folder path.
- `gitshift links`: prints all configured folder mappings in the form `profile → /absolute/path`.

Example linking a folder

```bash
$ gitshift link ~/projects/my-repo
Select Profile: personal
Linked /Users/akashs/projects/my-repo
Profile: personal
```

### Auto switching

- `gitshift auto` checks the current working directory against your configured folder mappings. If a matching mapping is found, GitShift will set the Git user (`user.name` and `user.email`) and mark the matched profile as current.

Run `gitshift auto` inside a linked folder (or any child path) to switch automatically:

```bash
$ cd ~/projects/my-repo
$ gitshift auto
Switched to personal
```

## Example Workflow

```bash
gitshift add
gitshift list
gitshift scan
gitshift backup
gitshift use personal
gitshift current
gitshift doctor
```

When you create a profile and choose SSH generation, GitShift creates a key under your home directory in `.ssh` using the pattern `gitshift-<profile-name>`.

If you already have SSH keys on your machine, `gitshift scan` will list the available keys, let you pick one, and save it as a new imported profile.

Interactive `add` example

```bash
$ gitshift add
Profile Name: personal
GitHub Username: akash
Email: akash@example.com
Generate SSH key automatically? (Y/n) [Y]
```

### Backup & Restore

- `gitshift backup [file]` writes a JSON file containing your saved profiles, folder mappings, and the currently selected profile. If no file is provided it defaults to `gitshift-backup.json` in your current directory.

Example backup:

```bash
$ gitshift backup
Backup saved to /Users/akashs/gitshift-backup.json
```

- `gitshift restore <file>` reads the JSON backup and restores profiles and mappings. It prompts to confirm overwriting existing data.

Example restore:

```bash
$ gitshift restore gitshift-backup.json
This will overwrite current data. Continue? (y/N)
Backup restored
```

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

