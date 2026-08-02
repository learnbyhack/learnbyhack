import { Writeup } from '@/types';

export const writeups: Writeup[] = [
  {
    id: 'wu-login-bypass',
    title: 'Login Bypass — from quote to admin session',
    author: 'nyra',
    authorAvatar: 'N',
    labId: 'lab-sqli-login',
    category: 'Web',
    excerpt: 'A walkthrough of finding and exploiting a classic authentication bypass with a single quote.',
    likes: 214,
    comments: 18,
    publishedAt: Date.now() - 12 * 86400000,
    tags: ['sqli', 'beginner-friendly'],
    content: `## Recon

The login form posts \`email\` and \`password\` to \`/api/login\`. First step, as always: try breaking the input.

## Finding the injection

Sending a single quote in the email field returned a 500 error with a database stack trace. That confirms the input reaches a raw SQL query unescaped.

## Building the bypass

The query looked something like:

\`\`\`sql
SELECT * FROM users WHERE email = '$email' AND password = '$password'
\`\`\`

Closing the string early and commenting out the rest of the query removes the password check entirely.

## Result

Logged in as the first user in the table — which happened to be an admin account. From there, full account takeover.

## Takeaway

Parameterized queries exist for exactly this reason. If user input ever gets concatenated into SQL, this is what happens.`,
  },
  {
    id: 'wu-ssrf-thumbnail',
    title: 'SSRF via Thumbnail Generator — reaching cloud metadata',
    author: 'kestrel',
    authorAvatar: 'K',
    labId: 'lab-ssrf-thumbnail',
    category: 'Web',
    excerpt: 'How an image-fetching feature turned into full cloud credential theft.',
    likes: 341,
    comments: 27,
    publishedAt: Date.now() - 20 * 86400000,
    tags: ['ssrf', 'cloud'],
    content: `## The feature

Users can submit any image URL and the backend fetches it server-side to generate a thumbnail. That server-side fetch is the whole vulnerability.

## Testing the boundary

Pointing the fetcher at an internal address instead of a public image URL returned a response instead of a timeout — confirming the server was making the request from inside the cloud network.

## Reaching the metadata service

Cloud providers expose an internal-only metadata endpoint that returns temporary credentials for whatever role the instance is running as. Pointing the fetcher there returned that role's access key and secret.

## Impact

Those temporary credentials had broad permissions on cloud storage, which meant read access to every private bucket in the account.

## Fix

Restrict outbound requests from the fetcher to an allow-list of external domains, and block the internal metadata address explicitly.`,
  },
  {
    id: 'wu-buffer-overflow',
    title: 'Smashing the Stack — first working exploit',
    author: 'r00tless',
    authorAvatar: 'R',
    labId: 'lab-buffer-overflow-classic',
    category: 'Binary',
    excerpt: 'From cyclic pattern to shellcode: a full walkthrough of a classic stack-based buffer overflow.',
    likes: 502,
    comments: 44,
    publishedAt: Date.now() - 35 * 86400000,
    tags: ['pwn', 'buffer-overflow', 'gdb'],
    content: `## The binary

A small C program reads input into a fixed-size stack buffer with no length check and no stack canary. Classic setup.

## Finding the offset

Generating a cyclic pattern and feeding it to the binary under a debugger showed exactly which four bytes overwrote the return address, and at what offset.

## Locating the target

The binary ships with a function that spawns a shell, never called anywhere in normal execution. Its address becomes the new return address.

## The exploit

Padding up to the offset, then overwriting the return address with the target function's address, redirects execution the moment the vulnerable function returns.

## Result

A shell, running with the privileges of the vulnerable binary. On a real system, this is the difference between a crash report and a full compromise.`,
  },
  {
    id: 'wu-padding-oracle',
    title: 'Padding Oracle — decrypting without the key',
    author: 'vantablack',
    authorAvatar: 'V',
    labId: 'lab-crypto-padding',
    category: 'Cryptography',
    excerpt: 'A step-by-step decryption of AES-CBC ciphertext using nothing but an error message.',
    likes: 189,
    comments: 12,
    publishedAt: Date.now() - 5 * 86400000,
    tags: ['crypto', 'padding-oracle'],
    content: `## The oracle

The service decrypts a cookie and returns a distinct error when the PKCS#7 padding is invalid versus when it's valid but the plaintext is garbage. That distinction is the entire vulnerability.

## Why it matters

An attacker who can distinguish "bad padding" from "valid padding" can decrypt an AES-CBC ciphertext one byte at a time, without ever knowing the key, by manipulating the previous ciphertext block and observing the oracle's response.

## Automating it

Rather than doing this by hand, scripting the byte-by-byte recovery against the oracle endpoint made it possible to recover the full plaintext of the session cookie in a few minutes.

## Fix

Use authenticated encryption (AES-GCM) instead of CBC with a padding scheme, and never let padding-validity leak through observable behavior.`,
  },
];
