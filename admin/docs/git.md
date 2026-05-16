# GIT GUIDELINES

[TOC]

---

## COMMITS

### Commit Message

#### The Three-Part Anatomy

A perfect commit message mimics an email, containing a Subject, a Blank Line, and a Body.

```text
Fix database read flooding and update JSDoc changelog

@changelog 20260302 {@link MAGPIE.meta.version}
 * @version 0.22.11 2026 05 15
 * - ADDED: DATABASE.pragma cache_size -64000 to mitigate...
```

#### Best Practices for the Subject Line (Line 1)

- **Use the [[Imperative Mood]]**. Start with an active verb. Treat the subject as an action that your commit performs.
  - *Good*: `Fix database read flooding`
  - *Bad*: `Fixed database read flooding`, `Fixing database read flooding`
- **Capitalize the First Letter:** Treat it like a proper sentence header.
- **Do Not End with a Period:** Space is premium; save the punctuation for the body.
- **Keep it Under 50 Characters:** If your subject line is too long, tools like GitHub or GitLab will truncate it with an ellipsis `(...)`

#### Best Practices for the Body (Lines 3+)

- **Leave Line 2 Blank:** Git requires a completely empty second line. Without it, Git crashes the subject and body together into one single, unreadable string.
- **Convert Past Tense to Present/Imperative:** While your JSDoc uses past tense (`- ADDED:`, `- TWEAKED:`, `- FIXED:`), try to pivot your Git commit headers to present or imperative actions if you summary-wrap them. However, keeping your JSDoc block intact as a literal copy-paste is completely acceptable for context.
- **Wrap Lines at 72 Characters:** The terminal does not auto-wrap long paragraphs. Hard-wraps your lines by hitting `Enter` so team members reading `git log` in a terminal don't have to scroll horizontally.

#### Pro-Tip: The Conventional Commits Standard

Many modern development teams use a specification called **Conventional Commits**. This prefixes your subject line with a structural type so automated scripts can read your history.
Since you are shipping a version bump with features, tweakes, and fixes, your subject line would look like this:

```text
chore(release): bump version to 0.22.11 and update changelog
```

Common prefixes include `feat:` (new feature), `fix:` (bug fix), `docs:` (documentation), and `perf:` (performance improvements).

---
