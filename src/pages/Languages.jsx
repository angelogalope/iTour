import React from "react";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";

export default function Languages() {
	const navigate = useNavigate();

	const handleContinue = () => {
		navigate("/features");
	}

	return (
		<div className="bg-cover bg-primGreen h-screen flex items-center justify-center pt-10 md:pt-[90px]">
			<div className="flex flex-col justify-between m-5 md:m-10 gap-4 md:gap-8">
				{/* <button className="flex items-start justify-start">
					<IoMdArrowRoundBack className="text-white" size={42} />
				</button> */}
				<div className="flex flex-col items-center text-center text-white gap-2">
					<h1 className="text-2xl md:text-3xl font-bold">Select your language</h1>
					<p className="text-sm md:text-base">
						Choose your preferred language when using our application to make
						the experience more good.
					</p>
				</div>
				<div className="flex flex-col text-white gap-2 text-base md:gap-4 md:text-lg">
					<button className="border w-full text-start font-semibold p-3 rounded-lg bg-slate-50 bg-opacity-25">
						English
					</button>
					<button className="border w-full text-start p-3 rounded-lg">
						Indonesia
					</button>
					<button className="border w-full text-start p-3 rounded-lg">
						Spanish
					</button>
					<button className="border w-full text-start p-3 rounded-lg">
						French
					</button>
					<button className="border w-full text-start p-3 rounded-lg">
						Filipino
					</button>
					<button className="border w-full text-start p-3 rounded-lg">
						Chinese
					</button>
				</div>
				<button onClick={handleContinue} className="bg-primYellow w-full p-4 rounded-full font-semibold text-lg md:text-xl">
					Continue
				</button>
			</div>
		</div>
	);
}
