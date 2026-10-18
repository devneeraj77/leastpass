export interface BlogPost {
  slug: string;
  title: string;
  subtitle: string;
  date: string;
  readTime: string;
  category: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  excerpt: string;
  content: string; // rich markdown / formatted text
  tags: string[];
}

export const PRESET_BLOG_POSTS: BlogPost[] = [
  {
    slug: "password-entropy-math",
    title: "The Mathematics of Password Entropy: Why 16 Characters Beat Complex 8-Character Passwords",
    subtitle: "Understanding why length trumps symbol complexity in the era of modern GPU cracking clusters.",
    date: "October 12, 2026",
    readTime: "6 min read",
    category: "Cryptography & Math",
    author: {
      name: "Neeraj Rekwar",
      role: "Creator of LeastPass",
      avatar: "NR",
    },
    excerpt:
      "Explore Claude Shannon's information theory and discover why a 16-character lowercase passphrase offers vastly superior security compared to a convoluted 8-character password.",
    tags: ["Entropy", "Security", "Brute Force", "Cryptography"],
    content: `
### The Myth of the "Complex" 8-Character Password

For decades, IT administrators and website registration forms enforced a rigid set of password complexity rules: at least 8 characters, one uppercase letter, one number, and one punctuation mark.

This led millions of users to create predictable patterns such as \`P@ssword1!\` or \`Summer2026!\`. To a human, these look convoluted and painful to type. To a specialized GPU hash-cracking cluster, they take less than **400 milliseconds** to penetrate using dictionary-based mask attacks.

### Shannon Information Entropy Explained

In 1948, mathematician and cryptographer Claude Shannon introduced the concept of **information entropy**, defined mathematically as:

$$E = L \\times \\log_2(N)$$

Where:
- **$E$** is the information entropy measured in bits.
- **$L$** is the length of the string in characters.
- **$N$** is the cardinality (size) of the pool of available symbols.

Let us compare two practical scenarios:

#### Scenario A: The Convoluted 8-Character Password
Suppose a user picks 8 characters from a pool of 95 ASCII symbols (lowercase, uppercase, digits, symbols):
$$E = 8 \\times \\log_2(95) \\approx 8 \\times 6.57 = 52.56 \\text{ bits}$$

#### Scenario B: The Clean 16-Character Password
Suppose a user picks 16 characters using only lowercase letters and numbers ($26 + 10 = 36$ possibilities):
$$E = 16 \\times \\log_2(36) \\approx 16 \\times 5.17 = 82.72 \\text{ bits}$$

### The Exponential Reality of Bits

Because bits represent powers of 2, the difference between 52 bits and 82 bits is not linear—it is **$2^{30}$ times harder**, which translates to **over 1 billion times more computational resistance**.

| Length & Pool | Entropy | Offline Cracking Speed (100 Billion Guesses/sec) |
|---|---|---|
| 8 characters (All sets) | ~52.5 bits | ~1.8 hours |
| 12 characters (All sets) | ~78.8 bits | ~120,000 years |
| 16 characters (All sets) | ~105.1 bits | Trillions of centuries |

### What LeastPass Does Differently

LeastPass enforces default generation of 16+ characters and calculates true Shannon entropy directly inside your browser window. By combining length with hardware-backed random sampling, you produce secrets that no GPU cluster can brute-force in our lifetime.
    `,
  },
  {
    slug: "diceware-passphrase-guide",
    title: "Diceware and Passphrases: How to Create Passwords You Can Actually Remember",
    subtitle: "A practical guide to multi-word passphrases that provide bank-grade entropy without keyboard frustration.",
    date: "October 8, 2026",
    readTime: "5 min read",
    category: "Usability & Security",
    author: {
      name: "Neeraj Rekwar",
      role: "Creator of LeastPass",
      avatar: "NR",
    },
    excerpt:
      "Inspired by Arnold Reinhold's Diceware method and the XKCD classic, learn why combining 4 to 5 dictionary words creates memorable, impenetrable master credentials.",
    tags: ["Passphrases", "Diceware", "Human Factors", "Authentication"],
    content: `
### The Human Bottleneck in Cyber Hygiene

Traditional passwords suffer from a fatal flaw: humans cannot easily memorize 32-character random character strings like \`#8z&Q$1mP@k9\`. Consequently, people either write them down on sticky notes, reuse them across multiple services, or reset them every month.

The solution was pioneered by Arnold Reinhold in 1995: **The Diceware Method**.

### How Diceware Works

In original Diceware, a person rolls physical five 6-sided dice to generate a five-digit number (e.g., \`4-2-1-3-5\`). That number corresponds to a single pre-selected English word in a standardized dictionary of 7,776 words ($6^5$).

By repeating this process 4 or 5 times, you construct a passphrase such as:
\`canyon-glade-velvet-orbit\`

Each word contributes $\\log_2(7776) \\approx 12.92$ bits of pure entropy:
- **4 words**: $4 \\times 12.92 \\approx 51.7$ bits
- **5 words**: $5 \\times 12.92 \\approx 64.6$ bits
- **6 words**: $6 \\times 12.92 \\approx 77.5$ bits (Exceeds high-security financial standards)

### Why Mobile Keyboards Love Passphrases

Typing symbols like \`^\`, \`[\`, and \`|\` on a mobile smartphone keyboard requires constantly switching keyboard sub-screens. A multi-word passphrase uses standard dictionary words with natural autocomplete or simple hyphenation, allowing you to unlock your password manager or master vault in seconds without typos.

### LeastPass Passphrase Mode

LeastPass includes a native **Memorable Passphrase** mode. You can adjust the number of words from 3 to 8, select your preferred word delimiter (hyphen, dot, space, or underscore), and optionally inject a random two-digit number to satisfy legacy validation forms.
    `,
  },
  {
    slug: "client-side-csprng-security",
    title: "Client-Side Cryptography: How Web Crypto API Keeps Your Secrets Offline",
    subtitle: "Why you should never trust a password generator that transmits credentials across the network.",
    date: "October 2, 2026",
    readTime: "7 min read",
    category: "Security Architecture",
    author: {
      name: "Neeraj Rekwar",
      role: "Creator of LeastPass",
      avatar: "NR",
    },
    excerpt:
      "Understand the stark differences between pseudo-random Math.random() and FIPS-compliant window.crypto.getRandomValues, plus the zero-knowledge guarantee of LeastPass.",
    tags: ["Web Crypto API", "CSPRNG", "Privacy", "Zero Knowledge"],
    content: `
### The Hidden Danger of Online Password Generators

When you open a random password generation website on Google, where is the password actually generated?

Unfortunately, many generators execute backend API calls (e.g. \`POST /api/generate-password\`). This introduces critical attack vectors:
1. **Server Logging**: Your password can be captured in access logs, CDN proxies, or monitoring telemetry.
2. **Man-in-the-Middle (MITM)**: Any proxy or compromised certificate authority could view the generated secret in transit.
3. **Database Caching**: Rogue scripts could cache recently generated strings for credential stuffing lists.

### The Standard Math.random() Trap

Even among generators that run in the browser, many developers make the elementary mistake of using JavaScript's native \`Math.random()\`:

\`\`\`javascript
// ❌ INSECURE: Do NOT use for cryptography!
const randomChar = charset[Math.floor(Math.random() * charset.length)];
\`\`\`

\`Math.random()\` is implemented via algorithms like **xorshift128+**. It is a **Pseudo-Random Number Generator (PRNG)** designed for speed and graphics simulations, not security. If an attacker observes a few outputs, they can reconstruct the internal seed state and predict every subsequent password.

### The Web Cryptography API: CSPRNG

To build truly secure tools, web developers must use **Cryptographically Secure Pseudo-Random Number Generators (CSPRNG)** backed by OS hardware entropy (e.g. \`/dev/urandom\` on Linux/macOS or \`CryptGenRandom\` on Windows):

\`\`\`typescript
// ✅ CRYPTOGRAPHICALLY SECURE: LeastPass Implementation
const array = new Uint32Array(1);
window.crypto.getRandomValues(array);
const randomIndex = array[0] % charset.length;
\`\`\`

The \`window.crypto.getRandomValues()\` method draws from environmental hardware entropy (keyboard timings, disk interrupts, thermal noise) and meets rigorous **FIPS 140-2** cryptographic standards.

### The Zero-Knowledge Guarantee of LeastPass

LeastPass is designed with zero server endpoints for credential generation. You can test this yourself:
1. Load LeastPass.
2. Turn off your Wi-Fi or turn on Airplane Mode.
3. Click "Generate".

The app will continue to generate cryptographically bulletproof passwords with full entropy calculation. Nothing ever leaves your device.
    `,
  },
];

import { getStoredPosts, getStoredPostBySlug } from "./blog-store";

// Helper functions for easy Sanity integration swap or local store
export async function getAllBlogPosts(): Promise<BlogPost[]> {
  try {
    return await getStoredPosts();
  } catch {
    return PRESET_BLOG_POSTS;
  }
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
  try {
    return await getStoredPostBySlug(slug);
  } catch {
    return PRESET_BLOG_POSTS.find((p) => p.slug === slug);
  }
}
