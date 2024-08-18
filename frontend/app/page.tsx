"use client";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const handleSignup = async () => {
    router.push("/signup");
  };
  const handleSignin = async () => {
    router.push("/signin");
  };
  return (
    <div
      className="grid grid-cols-2 h-screen"
      style={{
        background: "linear-gradient(180deg, #FFFFFF 0%, #3074f4 100%)",
      }}
    >
      <div className="col-span-1 flex justify-center items-center px-4">
        <div className="rounded-3xl bg-white text-2xl font-serif italic font-bold w-[75%] h-[50%] text-center pt-10">
          Start shopping now
          <div className="text-xl font-serif italic pt-5">
            Create a new account
            <div className="flex justify-center py-4">
              <button
                className="bg-black text-white rounded-lg w-32 h-10 flex justify-center items-center"
                onClick={handleSignup}
              >
                Signup
              </button>
            </div>
          </div>
          <div className="text-xl font-serif italic py-5">
            Already have an account
            <div className="flex justify-center py-4">
              <button
                className="bg-black text-white rounded-lg w-32 h-10 flex justify-center items-center"
                onClick={handleSignin}
              >
                Signin
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="col-span-1 flex justify-center items-center">
        <div className="flex justify-center items-center h-screen">
          <div className="rounded-lg w-80 text-center p-2 h-max px-4">
            <div className="flex px-6">
              <svg
                fill="#000000"
                width="64px"
                height="64px"
                viewBox="-1 0 19 19"
                xmlns="http://www.w3.org/2000/svg"
                className="cf-icon-svg"
              >
                <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                <g
                  id="SVGRepo_tracerCarrier"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></g>
                <g id="SVGRepo_iconCarrier">
                  <path d="M16.417 9.579A7.917 7.917 0 1 1 8.5 1.662a7.917 7.917 0 0 1 7.917 7.917zm-3.34-2.323a.63.63 0 0 0-.628-.628H5.892l-.436-1a.384.384 0 0 0-.351-.23H3.68a.384.384 0 1 0 0 .768h1.173l1.785 4.096a.37.37 0 0 0-.087-.01 1.161 1.161 0 1 0 0 2.322h.042a.792.792 0 1 0 .864 0h3.452a.792.792 0 1 0 .864 0h.565a.384.384 0 1 0 0-.767H6.55a.393.393 0 0 1 0-.787.38.38 0 0 0 .098-.013l5.803-.602a.714.714 0 0 0 .625-.694z"></path>
                </g>
              </svg>
              <div className="text-4xl pt-3 font-serif italic font-bold">
                Flipkart
              </div>
            </div>
            <p className="font-serif italic font-bold">
              &quot;Welcome to Flipkart, a website where you can shop
              unlimitedly&quot;
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
