import { StartButton } from "@/components/StartButton";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen lg:flex-row gap-0 lg:gap-[100px]">
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
        <h3 className="font-normal max-w-full  md:max-w-[70%] lg:max-w-full text-gray-600">
          AKAI powered chart generation app. Ask me anything and I will generate
          a chart for you.
        </h3>
        <StartButton />
      </div>

      {/* Right Side */}
      <div className="flex-1 flex items-center justify-center h-full px-4">
        <div className="relative w-full h-2/3 md:flex items-center justify-center bg-[#140e2d] rounded-[50px] hidden lg:block shadow-lg">
          {/* Background Container */}

          <Image
            src="/ai-home2.jpg"
            alt=""
            className="w-full h-full rounded-[50px] shadow-lg"
            width={400}
            height={400}
          />
        </div>
      </div>

      <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-5 text-gray-500 text-xs">
        <div className="flex gap-2 items-center">
          <Link href="/">Terms of Service</Link>
          <span>|</span>
          <Link href="/">Privacy Policy</Link>
        </div>
      </div>
    </div>
  );
}
