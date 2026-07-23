import re

CC_PREFIX = re.compile(r'^(feat|fix|chore|ci|docs|refactor|test|style|perf|build|wip|revert)(\([^)]+\))?!?:\s*', re.IGNORECASE)
AI_TRAILER = re.compile(r'\n\nCo-[Aa]uthored-[Bb]y:.*?(noreply@anthropic\.com|noreply@deepmind\.com|noreply@google\.com).*', re.DOTALL)
CO_AUTHOR_LINE = re.compile(r'\nCo-[Aa]uthored-[Bb]y:.*', re.MULTILINE)

def commit_callback(commit):
    msg = commit.message.decode('utf-8', errors='replace')
    msg = AI_TRAILER.sub('', msg)
    msg = CO_AUTHOR_LINE.sub('', msg)
    lines = msg.split('\n')
    if lines:
        lines[0] = CC_PREFIX.sub('', lines[0])
        if lines[0]:
            lines[0] = lines[0][0].upper() + lines[0][1:]
    msg = '\n'.join(lines).rstrip() + '\n'
    commit.message = msg.encode('utf-8')
