import React, { useState, useRef, useEffect, useCallback } from "react";
import data from "../data/sliderData";

const Features = () => {
	const [currentIndex, setCurrentIndex] = useState(0);
	const sliderRef = useRef(null);

	const handleNext = () => {
		if (currentIndex < data.length - 1) {
			setCurrentIndex(currentIndex + 1);
			scrollToIndex(currentIndex + 1);
		} else {
			console.log("End of data or navigate somewhere");
		}
	};

	const handleSkip = () => {
		console.log("Skipped!");
	};

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
		<div className="flex flex-col items-center bg-primGreen h-screen justify-center p-6 gap-2 z-20">
			{/* Slider Container */}
			<div
				ref={sliderRef}
				className="flex overflow-x-scroll no-scrollbar w-full h-full snap-x snap-mandatory"
			>
				{data.map((slide, index) => (
					<div
						key={index}
						className="flex flex-col items-center snap-center justify-between pt-[90px]"
						style={{ minWidth: "100%" }}
					>
						{/* Slide Content */}
						<div className="text-center text-white">
							<h1 className="text-3xl font-bold">{slide.title}</h1>
						</div>

						{/* Image Section */}
						<div className="flex justify-center">
							<img src={slide.img} className="object-contain w-full" />
						</div>
						<div className="text-center text-white">
							<p className=" text-lg">{slide.description}</p>
						</div>
					</div>
				))}
			</div>

			{/* Pagination Dots */}
			<div className="flex space-x-2 mb-8 mt-4">
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
			<div className="text-center mt-4 w-full">
				<button
					className="bg-primYellow w-full max-w-md py-3 rounded-full font-bold text-xl text-black"
					onClick={handleNext}
				>
					{currentIndex < data.length - 1 ? "Next" : "Continue"}
				</button>

				{/* Skip Link */}
				<p
					className="text-white mt-5 text-lg cursor-pointer"
					onClick={handleSkip}
				>
					Skip
				</p>
			</div>
		</div>
	);
};

export default Features;
