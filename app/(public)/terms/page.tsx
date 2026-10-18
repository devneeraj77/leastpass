import type { Metadata } from "next";
import Link from "next/link";
import { FileText, Scale, CheckCircle2, AlertTriangle, Code2, Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms and Conditions | LeastPass Cryptographic Software",
  description:
    "Terms of Service and legal conditions for using LeastPass open-source password generator and security utilities.",
  alternates: {
    canonical: "/terms",
  },
  openGraph: {
    title: "Terms and Conditions | LeastPass",
    description:
      "Open-source terms, MIT license disclaimers, and user security responsibilities for LeastPass.",
    url: "/terms",
  },
};

export default function TermsPage() {
  const lastUpdated = "October 19, 2026";

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs font-semibold text-[#6b9774] mb-8">
        <Link href="/" className="hover:text-[#080f0f] transition-colors">
          Home
        </Link>
        <span>/</span>
        <span className="text-[#080f0f]">Terms and Conditions</span>
      </nav>

      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 mb-3 rounded-full clay-badge text-xs font-semibold text-[#3b5240]">
          <Scale className="w-4 h-4 text-[#86ba90]" />
          <span>Open-Source MIT Software Terms</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-[#080f0f] tracking-tight">
          Terms & Conditions
        </h1>
        <p className="text-xs sm:text-sm text-[#6b9774] mt-2">
          Effective Date & Last Updated: <strong>{lastUpdated}</strong>
        </p>
      </div>

      {/* Highlights Notice Card */}
      <div className="clay-card p-6 sm:p-8 bg-white/95 mb-8 border border-[#86ba90]/30 shadow-md">
        <h2 className="text-lg font-black text-[#080f0f] mb-3 flex items-center gap-2">
          <FileText className="w-5 h-5 text-[#86ba90]" />
          <span>Agreement Summary</span>
        </h2>
        <p className="text-xs sm:text-sm text-[#3b5240] leading-relaxed mb-4">
          By accessing or using <strong>LeastPass</strong> (available at leastpass.vercel.app or related mirrors), you agree to these Terms and Conditions. LeastPass is an open-source, client-side cryptographic utility provided free of charge under the permissive <strong>MIT License</strong>.
        </p>
        <div className="p-3.5 rounded-xl clay-well bg-[#edf5ef] border border-[#86ba90]/25 text-xs text-[#3b5240] flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-[#86ba90] shrink-0 mt-0.5" />
          <span>
            <strong>Crucial Security Notice:</strong> Because LeastPass does not retain or store your credentials on any server, we cannot recover passwords that you generate and fail to record. You are exclusively responsible for storing your credentials securely.
          </span>
        </div>
      </div>

      {/* Sections */}
      <div className="space-y-8 text-xs sm:text-sm text-[#3b5240] leading-relaxed">
        {/* Section 1 */}
        <section className="clay-card p-6 bg-white/95 border border-[#86ba90]/20 space-y-3">
          <h3 className="text-base font-black text-[#080f0f] flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-[#86ba90]/20 text-[#547e5d] flex items-center justify-center text-xs font-bold">1</span>
            <span>Permitted & Acceptable Use</span>
          </h3>
          <p>
            You are granted a worldwide, non-exclusive, royalty-free license to use LeastPass for:
          </p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>Generating personal passwords, PINs, and passphrases for online accounts.</li>
            <li>Commercial, corporate, enterprise, and educational security deployments.</li>
            <li>Auditing, studying, and fork-testing the source code repository under the MIT License.</li>
          </ul>
          <p>
            You agree not to use the service to conduct automated denial-of-service (DoS) attacks, exploit network vulnerabilities, or distribute malicious software.
          </p>
        </section>

        {/* Section 2 */}
        <section className="clay-card p-6 bg-white/95 border border-[#86ba90]/20 space-y-3">
          <h3 className="text-base font-black text-[#080f0f] flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-[#86ba90]/20 text-[#547e5d] flex items-center justify-center text-xs font-bold">2</span>
            <span>Disclaimer of Warranty (“As-Is”)</span>
          </h3>
          <p>
            THE SOFTWARE IS PROVIDED &ldquo;AS IS&rdquo;, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
          </p>
          <p>
            While LeastPass utilizes industry-standard cryptographic algorithms (such as the W3C Web Cryptography API and Shannon Entropy metrics), no software can guarantee immunity against compromised hardware, keyloggers, screen recorders, or local browser extensions present on the user&rsquo;s machine.
          </p>
        </section>

        {/* Section 3 */}
        <section className="clay-card p-6 bg-white/95 border border-[#86ba90]/20 space-y-3">
          <h3 className="text-base font-black text-[#080f0f] flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-[#86ba90]/20 text-[#547e5d] flex items-center justify-center text-xs font-bold">3</span>
            <span>Limitation of Liability</span>
          </h3>
          <p>
            IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS (INCLUDING DEVELOPER NEERAJ REKWAR) BE LIABLE FOR ANY CLAIM, DAMAGES, OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
          </p>
          <p>
            This includes, without limitation, any loss of data, unauthorized access to user accounts, brute-force cracking of chosen passwords, or hardware failure.
          </p>
        </section>

        {/* Section 4 */}
        <section className="clay-card p-6 bg-white/95 border border-[#86ba90]/20 space-y-3">
          <h3 className="text-base font-black text-[#080f0f] flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-[#86ba90]/20 text-[#547e5d] flex items-center justify-center text-xs font-bold">4</span>
            <span>Open Source Licensing & Intellectual Property</span>
          </h3>
          <p>
            LeastPass is an open-source project created and maintained by <strong>Neeraj Rekwar</strong>. The codebase is distributed under the <strong>MIT License</strong>. You are encouraged to inspect the repository, submit improvements, and verify cryptographic operations:
          </p>
          <div className="pt-2">
            <a
              href="https://github.com/devneeraj77/leastpass"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl clay-btn-subtle text-[#080f0f] font-bold text-xs hover:text-[#547e5d]"
            >
              <Code2 className="w-4 h-4 text-[#86ba90]" />
              <span>View LeastPass on GitHub (devneeraj77/leastpass)</span>
            </a>
          </div>
        </section>

        {/* Section 5 */}
        <section className="clay-card p-6 bg-white/95 border border-[#86ba90]/20 space-y-3">
          <h3 className="text-base font-black text-[#080f0f] flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-[#86ba90]/20 text-[#547e5d] flex items-center justify-center text-xs font-bold">5</span>
            <span>Modifications and Amendments</span>
          </h3>
          <p>
            We reserve the right to revise or amend these Terms & Conditions at any time to reflect security enhancements, architectural changes, or legal compliance. Your continued use of the application following the posting of updated terms constitutes agreement to those modifications.
          </p>
        </section>

        {/* Section 6 */}
        <section className="clay-card p-6 bg-white/95 border border-[#86ba90]/20 space-y-3">
          <h3 className="text-base font-black text-[#080f0f] flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-[#86ba90]/20 text-[#547e5d] flex items-center justify-center text-xs font-bold">6</span>
            <span>Contact & Inquiries</span>
          </h3>
          <p>
            For legal, licensing, or corporate inquiries regarding LeastPass, please reach out directly:
          </p>
          <div className="pt-2">
            <a
              href="mailto:dev.neerajrekwar@gmail.com"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#547e5d] hover:underline"
            >
              <Mail className="w-4 h-4 text-[#86ba90]" />
              <span>dev.neerajrekwar@gmail.com</span>
            </a>
          </div>
        </section>
      </div>

      {/* Back button */}
      <div className="mt-12 text-center">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl clay-btn text-white text-xs font-bold shadow-md hover:shadow-lg transition-all"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Return to Password Generator</span>
        </Link>
      </div>
    </div>
  );
}
