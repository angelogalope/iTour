import React, { useState, useEffect } from "react";
import { useSwipeable } from "react-swipeable";

const Carousel = () => {
	const [currentIndex, setCurrentIndex] = useState(1); // Start at 1 to account for cloned items
	const items = [
		{
			title: "CSU Hiraya Hall",
			subtitle: "College of Computing and Information Sciences",
			image: "/src/assets/admin.png",
		},
		{
			title: "CSU Hiraya Hall",
			subtitle: "College of Computing and Information Sciences",
			image: "/src/assets/Hiraya.png",
		},
		{
			title: "CSU Hiraya Hall",
			subtitle: "College of Computing and Information Sciences",
			image: "/src/assets/admin.png",
		},
		{
			title: "CSU Hiraya Hall",
			subtitle: "College of Computing and Information Sciences",
			image: "/src/assets/Hiraya.png",
		},
		{
			title: "CSU Hiraya Hall",
			subtitle: "College of Computing and Information Sciences",
			image: "/src/assets/admin.png",
		},
		{
			title: "CSU Hiraya Hall",
			subtitle: "College of Computing and Information Sciences",
			image: "/src/assets/Hiraya.png",
		},
	];

	const extendedItems = [items[items.length - 1], ...items, items[0]]; // Clone first and last items

	const updateIndex = (newIndex) => {
		setCurrentIndex(newIndex);
	};

	useEffect(() => {
		if (currentIndex === 0) {
			setTimeout(() => {
				setCurrentIndex(items.length); // Jump to the last real item
			}, 300);
		} else if (currentIndex === extendedItems.length - 1) {
			setTimeout(() => {
				setCurrentIndex(1); // Jump to the first real item
			}, 300);
		}
	}, [currentIndex]);

	const handlers = useSwipeable({
		onSwipedLeft: () => updateIndex(currentIndex + 1),
		onSwipedRight: () => updateIndex(currentIndex - 1),
		preventDefaultTouchmoveEvent: true,
		trackTouch: true,
	});

	return (
		<div
			{...handlers}
			className="flex justify-center items-center overflow-hidden w-full"
		>
			<div
				className="flex transition-transform duration-300 ease-in-out"
				style={{
					transform: `translateX(calc(50% - ${262 / 2}px - ${
						currentIndex * 262
					}px))`, // Center the current card properly
				}}
			>
				{extendedItems.map((item, index) => (
					<div
						key={index}
						className={`flex w-[262px] transition-all duration-300 ease-in-out transform ${
							index === currentIndex
								? "scale-100 opacity-100"
								: "scale-90 opacity-50"
						}`}
					>
						<div
							className="relative p-4 rounded-3xl shadow-lg bg-cover bg-center h-64 flex flex-col justify-end"
							style={{ backgroundImage: `url(${item.image})` }}
						>
							{/* Gradient Overlay */}
							<div className="absolute inset-0 bg-gradient-to-t from-primGreen to-transparent rounded-3xl"></div>

							{/* Content */}
							<div className="relative p-1 text-white z-10">
								<h3 className="text-lg font-semibold">{item.title}</h3>
								<p className="text-sm">{item.subtitle}</p>
							</div>

							{index === currentIndex && (
								<button className="absolute bottom-4 right-4 px-3 py-1 bg-white rounded-lg shadow z-10">
									AR View
								</button>
							)}
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default Carousel;
