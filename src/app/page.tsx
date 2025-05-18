import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col lg:flex-row items-center gap-0 lg:gap-[100px] h-full">
      {/* Orbital Background */}

      {/* Left Side */}
      <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center px-4">
        <h1 className="text-[64px] xl:text-[128px] font-bold bg-gradient-to-r from-[#217bfe] to-[#e55571] text-transparent bg-clip-text">
          AKAI
        </h1>
        <h2 className="text-xl font-medium">
          AI Chart:
          <span className="text-[#217bfe]"> Create Charts Effortlessly</span>
        </h2>
        <h3 className="font-normal max-w-[70%] lg:max-w-full text-gray-600">
          {/* generate content for ai chart app */}
          AKAI powered chart generation app. Ask me anything and I will generate
          a chart for you.
          <br />
        </h3>
        <Link
          href="/chart"
          className="mt-5 px-6 py-3 bg-[#217bfe] text-white text-sm rounded-full transition hover:bg-white hover:text-[#217bfe] border border-transparent hover:border-[#217bfe]"
        >
          Get Started
        </Link>
      </div>

      {/* Right Side */}
      <div className="flex-1 flex items-center justify-center h-full px-4">
        <div className="relative w-full h-full md:flex items-center justify-center bg-[#140e2d] rounded-[50px] hidden lg:block shadow-lg">
          {/* Background Container */}
          {/* <div className="absolute inset-0 overflow-hidden rounded-[50px]">
            <div className="w-[200%] h-full bg-[url('/bg.png')] bg-auto bg-repeat-x opacity-20 animate-[slideBg_8s_ease-in-out_infinite_alternate]"></div>
          </div> */}

          <Image
            src="/ai-home2.jpg"
            alt=""
            className="w-full h-full object-cover rounded-[50px] shadow-lg"
            width={1000}
            height={1000}
          />
        </div>
      </div>

      <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-5 text-gray-500 text-xs">
        <img src="/logo.png" alt="" className="w-4 h-4" />
        <div className="flex gap-2 items-center">
          <Link href="/">Terms of Service</Link>
          <span>|</span>
          <Link href="/">Privacy Policy</Link>
        </div>
      </div>
    </div>
  );
}
