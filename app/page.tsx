import PasswordGenerator from "@/components/passwordGen";

export default function Home() {
  return (
    <main>
      <section className="min-h-screen bg-priamry text-tp flex flex-col justify-center items-center  max-w-6xl m-auto">
        {/* <Div /> */}
        <PasswordGenerator />
      </section>
    </main>
  );
}
