import Image from "next/image";
import Card from "@/components/Card";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-[90vh]">
      <div className="mt-[10vh] flex justify-around relative">
        <div className="text-center flex flex-col gap-[1vh] items-center">
          <div className="flex gap-2">
            <h1 className="heading">TipJar</h1>
          </div>
          <p className="text-2xl z-1">
            A crowdfunding platform for creators. Get funded by your fans and followers.<br /><strong>Start now!</strong>
          </p>
          <Link href={"/auth?login=false"}>
            <button className=" reltive mt-[2vh] z-1 cursor-pointer relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-pink-500 to-orange-400 group-hover:from-pink-500 group-hover:to-orange-400 hover:text-white dark:text-white focus:ring-2 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800">
            <span className="flex items-center gap-[7px] text-xl relative px-5 py-2.5 transition-all ease-in duration-[0.25s] bg-white dark:bg-orange-400 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent">
              Get Started <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <path d="M4 12H20M14 6L20 12L14 18" stroke="currentColor" strokeWidth="2"
                  strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </button>
          </Link>
        </div>
        <img src="coffee.png" className="rotate-z-[-20deg]" />
        <h1 className="absolute text-6xl right-[25vw] bottom-[10vh] roboto font-semibold italic z-0">15 Million+ <br /><span className="font-medium not-italic">Trusting Creators</span></h1>
      </div>
      <div className="h-[2px] w-[70vw] bg-gray-500 mt-[10vh] mx-auto"></div>
      <Card image="programmer.png" reverse={false} title="Let Your Fans Fund What Matters Most" description="Your projects deserve more than just likes. Give your community the chance to support you with contributions that make your dream projects possible."/>
      <Card image="creativity.png" reverse={true} title="Fuel Your Creativity with Fan-Powered Funding" description="Let your community support what they love. Fans can fund your creative ideas, unlock exclusive content, and help you bring your passion projects to life."/>
      <Card image="passion.png" reverse={false} title="Turn Passion Projects into Reality" description="Don't let great ideas stay on paper. With the support of your community, you can bring your boldest projects to life."/>
    </div>
  );
}
