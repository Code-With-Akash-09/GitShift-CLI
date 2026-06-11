export function convertToSSHHost(url, host) {
    const httpsMatch = url.match(
        /github\.com[/:](.+?)\/(.+?)(\.git)?$/
    );

    if (!httpsMatch) {
        return null;
    }

    const owner = httpsMatch[1];
    const repo = httpsMatch[2];

    return `git@${host}:${owner}/${repo}.git`;
}