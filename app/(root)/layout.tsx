import NavbarClerk from "@/components/NavbarClerk";
import Link from "next/link";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative flex min-h-screen flex-col">
      <div className="container flex h-[68px] items-center justify-between">
        <Link
          href="/"
          className="font-secondary text-xl font-medium text-slate-700"
        >
          tech<span className="text-gradient-brand"> quiz</span>
        </Link>
        <NavbarClerk />
      </div>
      <main className="relative flex grow">{children}</main>
      <footer className="footer-shadow">
        <div className="container flex flex-col items-center py-12 text-center">
          <Link
            href="/"
            className="font-secondary text-xl font-medium text-slate-700"
          >
            tech<span className="text-gradient-brand"> quiz</span>
          </Link>
          <Link
            href="https://kevinoroz.co"
            className="mt-2 text-sm text-slate-600"
          >
            Made by Kevin Orozco
          </Link>
        </div>
      </footer>
    </div>
  );
}
