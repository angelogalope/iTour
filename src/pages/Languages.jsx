import React from "react";
import { IoMdArrowRoundBack } from "react-icons/io";

export default function Languages() {
	return (
		<div className="bg-cover bg-primGreen w-screen h-screen flex items-center justify-center">
			<div className="flex flex-col justify-between m-10 gap-14">
				<button className="flex items-start justify-start">
					<IoMdArrowRoundBack className="text-white" size={42} />
				</button>
				<div className="flex flex-col items-center text-center text-white gap-2">
					<h1 className="text-2xl font-bold">Select your language</h1>
					<p>
						Choose your preferred language when using our application to make
						the experience more good.
					</p>
				</div>
				<div className="flex flex-col text-white gap-4">
					<button className="border w-full text-start font-semibold p-4 rounded-lg bg-slate-50 bg-opacity-25">
						English
					</button>
					<button className="border w-full text-start p-4 rounded-lg">
						Indonesia
					</button>
					<button className="border w-full text-start p-4 rounded-lg">
						Spanish
					</button>
					<button className="border w-full text-start p-4 rounded-lg">
						French
					</button>
					<button className="border w-full text-start p-4 rounded-lg">
						Filipino
					</button>
					<button className="border w-full text-start p-4 rounded-lg">
						Chinese
					</button>
				</div>
				<button className="bg-primYellow w-full p-4 rounded-full font-semibold">
					Continue
				</button>
			</div>
		</div>
	);
}
