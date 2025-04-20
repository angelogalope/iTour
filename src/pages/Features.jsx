import React, { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router";
import data from "../data/sliderData";

const Features = () => {
	const [currentIndex, setCurrentIndex] = useState(0);
	const sliderRef = useRef(null);
	const navigate = useNavigate();

	
	const handleNext = () => {
		if (currentIndex < data.length - 1) {
			setCurrentIndex(currentIndex + 1);
			scrollToIndex(currentIndex + 1);
		} else {
			navigate("/permissions");
		}
	};

	const handleContinue = () => {
		navigate("/permissions");
	}	

	const scrollToIndex = (index) => {
		sliderRef.current.scrollTo({
			left: index * window.innerWidth,
			behavior: "smooth",
		});
	};

	const handleScroll = useCallback((event) => {
		const slideWidth = window.innerWidth;
		const newIndex = Math.round(event.target.scrollLeft / slideWidth);
		setCurrentIndex(newIndex);
	}, []);

	useEffect(() => {
		const slider = sliderRef.current;

		let lastKnownScrollPosition = 0;
		let ticking = false;

		const throttleScroll = (event) => {
			lastKnownScrollPosition = slider.scrollLeft;

			if (!ticking) {
				window.requestAnimationFrame(() => {
					const slideWidth = window.innerWidth;
					const newIndex = Math.round(lastKnownScrollPosition / slideWidth);
					setCurrentIndex(newIndex);
					ticking = false;
				});
				ticking = true;
			}
		};

		slider.addEventListener("scroll", throttleScroll);

		return () => slider.removeEventListener("scroll", throttleScroll);
	}, [handleScroll]);

	return (
		<div className="flex flex-col items-center bg-primGreen h-screen justify-center gap-2 py-6">
			{/* Slider Container */}
			<div
				ref={sliderRef}
				className="flex overflow-x-auto overflow-y-hidden no-scrollbar w-full h-full snap-x snap-mandatory"
			>
				{data.map((slide, index) => (
					<div
						key={index}
						className="flex flex-col items-center snap-center justify-between pt-[90px] min-w-full px-6"
					>
						{/* Slide Content */}
						<div className="text-center text-white">
							<h1 className="text-3xl font-bold">{slide.title}</h1>
						</div>

						{/* Image Section */}
						<div className="flex justify-center">
							<img src={slide.img} className="object-contain max-w-72" />
						</div>
						<div className="text-center text-white">
							<p className=" text-lg">{slide.description}</p>
						</div>
					</div>
				))}
			</div>

			{/* Pagination Dots */}
			<div className="flex space-x-2 mb-8 mt-4 px-6">
				{data.map((_, index) => (
					<div
						key={index}
						className={`${
							currentIndex === index
								? "w-8 h-3 bg-primYellow rounded-full"
								: "w-3 h-3 bg-white rounded-full"
						} transition-all duration-300`}
					/>
				))}
			</div>

			{/* Continue Button */}
			<div className="text-center w-screen px-6">
				<button
					className="bg-primYellow w-full max-w-md py-3 rounded-full font-bold text-xl text-black"
					onClick={handleNext}
					style={{ width: '90%' }}
				>
					{currentIndex < data.length - 1 ? "Next" : "Continue"}
				</button>

				{/* Skip Link */}
				<p
					className="text-white mt-5 text-lg cursor-pointer"
					onClick={handleContinue}
				>
					Skip
				</p>
			</div>
		</div>
	);
};

export default Features;
