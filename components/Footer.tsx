import Link from "next/link";

const Footer = () => {
  return (
    <footer className="text-tp px-8 border-br md:pb-2">
      <div className="max-w-7xl m-auto  flex text-xs justify-between">
        <div className="text-xs ">
          <p className="">© 2024 LeastPass</p>
        </div>
        <div className="">
          <Link href={"/"} className="flex active:tAccent hover:tAccent">
            Programmer
            <svg
              className="bg-transpLight rounded-md"
              xmlns="http://www.w3.org/2000/svg"
              height="18px"
              viewBox="0 -960 960 960"
              width="18px"
              fill="currentColor"
            >
              <path d="m216-160-56-56 464-464H360v-80h400v400h-80v-264L216-160Z" />
            </svg>
          </Link>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
