## Approach
- Read existing files before writing. Don't re-read unless changed.
- Thorough in reasoning, concise in output.
- Skip files over 100KB unless required.
- No sycophantic openers or closing fluff.
- No emojis or em-dashes.
- Do not guess APIs, versions, flags, commit SHAs, or package names. Verify by reading code or docs before asserting.

## File Edits
- Edit files directly on disk instead of only showing snippets in chat.
- Read a file before modifying it, and keep edits scoped to the requested task.
- Never edit generated files manually.
- Before finishing any task involving code modifications, always run git diff (or check the file diff) to verify that the intended changes were actually applied.
