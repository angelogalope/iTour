import React from "react";
import NavBar from "./components/NavBar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { PiDotsThreeOutlineVerticalFill } from "react-icons/pi";
import { useNavigate } from "react-router";

export default function Favorites() {
	const navigate = useNavigate();

	const handleBack = () => {
		navigate(-1);
	};

	return (
		<div className="bg-primWhite h-screen w-full flex flex-col items-start pb-18">
			<div className="flex flex-col w-full gap-10 mt-16">
				<button
					onClick={handleBack}
					className="absolute top-14 left-6 p-4 rounded-full shadow-slate-800 shadow-md flex bg-white z-50"
				>
					<FontAwesomeIcon icon={faArrowLeft} />
				</button>
				<div className="flex justify-center">
					<h1 className="font-semibold text-2xl items-center">Saved</h1>
				</div>
				<div className="flex flex-col items-start gap-4">
					<h1 className="text-3xl font-bold px-6">Your Favorite</h1>

					{/* Scrollable container for cards */}
					<div className="flex flex-col gap-3 h-[70vh] px-6 overflow-y-auto no-scrollbar">
						{/* Repeatable card component */}
						{Array(9).fill().map((_, index) => (
							<div
								key={index}
								className="bg-white rounded-xl shadow-xl border border-gray-200 flex items-center p-4"
							>
								<img
									src="/src/assets/Hiraya.png"
									alt="Hiraya Hall"
									className="w-20 h-20 rounded-lg object-cover"
								/>
								<div className="flex-1 mx-2">
									<h2 className="text-lg font-bold">Hiraya Hall</h2>
									<p className="text-xs text-gray-500">
										College of Computing and Information Sciences
									</p>
								</div>
								<div className="ml-auto flex flex-col items-end gap-8">
									<PiDotsThreeOutlineVerticalFill size={18} />
									<button className="px-3 py-2 bg-secGreen text-white text-sm rounded-lg hover:bg-green-700">
										AR View
									</button>
								</div>
							</div>
						))}
					</div>
				</div>

				{/* Fixed NavBar at the bottom */}
				<div className="absolute left-0 right-0 bottom-0 w-full bg-white rounded-t-[40px] shadow-black shadow-2xl">
					<NavBar />
				</div>
			</div>
		</div>
	);
}
