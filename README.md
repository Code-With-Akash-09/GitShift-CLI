# GitShift CLI

GitShift CLI helps you create, manage, and switch between GitHub identity profiles from the terminal. It stores profiles locally, manages repository-local Git configs, automatically generates and uploads SSH keys to GitHub, and auto-switches your identity when you `cd` into linked project folders.

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
- `gh` (GitHub CLI, recommended for one-click SSH key upload)

## Usage

```bash
gitshift --help
```

### Commands

- `gitshift add` - Create a new local profile. Prompts for profile name, GitHub username, email, SSH key generation, and **automatic SSH key upload to GitHub**.
- `gitshift list` - Show all saved profiles.
- `gitshift current` - Display the active profile.
- `gitshift use <profile>` - Switch to a saved profile, update repository-local Git name/email, and configure the GitHub SSH remote.
- `gitshift remove <profile>` - Delete a saved profile.
- `gitshift scan` - Scan your `~/.ssh` folder and import existing SSH keys into new profiles.
- `gitshift install-hooks` - **Automatically install shell hooks (`zsh` / `bash`) to enable seamless auto-switching on directory change (`cd`).**
- `gitshift doctor` - Check whether Git, SSH, and GitHub CLI are installed.
- `gitshift backup [file]` - Export profiles and folder mappings to a JSON backup file (default: `gitshift-backup.json`).
- `gitshift restore <file>` - Restore profiles and mappings from a backup JSON file.
- `gitshift update` - Update GitShift to the latest version or manage automatic update checks.
- `gitshift link <folder>` - Link a local folder path to a profile.
- `gitshift unlink <folder>` - Remove an existing folder mapping.
- `gitshift links` - List folder → profile mappings.
- `gitshift auto` - Auto-switch profile based on current working directory (`--silent` option available for shell hooks).

---

### Add Command & Automatic Key Upload

- **Interactive prompts**: `Profile Name`, `GitHub Username`, `Email`.
- **SSH key generation**: Prompts `Generate SSH key automatically?` (default: **yes**).
- **Automatic GitHub Upload**:
  - **Personal Access Token (PAT)**: Uploads the key directly via GitHub REST API using a token with `write:public_key` scope.
  - **GitHub CLI (`gh`)**: Uploads the key using your logged-in `gh` CLI credentials.
  - **Manual Upload**: Displays the public key if key upload is skipped.
- **Verification**: Runs an immediate `ssh -T` test against GitHub to confirm authentication status.

---

### Folder Mappings & Automatic Switching

- `gitshift link <folder>`: Associates a directory path with a profile (e.g. `~/Developer/Personal`).
- `gitshift install-hooks`: Installs a shell hook into your `~/.zshrc` or `~/.bashrc` file.
- **Seamless Switching**: Navigating into any linked folder (or child repository) automatically updates your Git `user.name`, `user.email`, and SSH remote URL without requiring manual commands.

#### Setup Example

```bash
# 1. Add your profiles
gitshift add

# 2. Link directories
gitshift link ~/Developer/Personal
gitshift link ~/Developer/Office

# 3. Install shell hooks
gitshift install-hooks

# Now changing directories automatically switches identities!
cd ~/Developer/Office/api
```

---

### Auto Switching Command

- `gitshift auto`: Checks current directory against folder mappings and switches profile.
- `gitshift auto --silent` (or `-s`): Runs silently with zero output, designed for terminal hooks (`chpwd` / `PROMPT_COMMAND`).

---

### Backup & Restore

- `gitshift backup [file]` writes a JSON file containing your saved profiles, folder mappings, and current selection.
- `gitshift restore <file>` reads the JSON backup and restores profiles and mappings.

---

### Update Command

- `gitshift update` updates GitShift to the latest published version.
- Options: `--enable-auto` / `--disable-auto`.

---

## How It Works

Profiles are saved locally using GitShift configuration. Switching profiles updates:

1. **Git Identity**: `git config user.name` and `user.email` locally within the repository.
2. **SSH Authentication**: Rewrites `origin` remote to use profile-specific host aliases (`git@github-<profile>:user/repo.git`), matching SSH keys configured in `~/.ssh/config`.

---

## License

ISC
