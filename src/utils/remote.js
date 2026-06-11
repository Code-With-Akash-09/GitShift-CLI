export function convertToSSHHost(url, host) {
    const githubMatch = url.match(
        /github\.com[/:](.+?)\/(.+?)(\.git)?$/
    );

    const sshMatch = url.match(
        /^git@[^:]+:(.+?)\/(.+?)(\.git)?$/
    );

    const match = githubMatch || sshMatch;

    if (!match) {
        return null;
    }

    const owner = match[1];
    const repo = match[2];

    return `git@${host}:${owner}/${repo}.git`;
}
