import React, { useState, useEffect } from "react";
import Slider from "react-slick"; // Import react-slick
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css"; 
import SkeletonLoader from './SkeletonLoader'; // Import the SkeletonLoader

const Carousel = () => {
	const [loading, setLoading] = useState(true);
	const [items, setItems] = useState([]);
	const [currentSlide, setCurrentSlide] = useState(0); // Track current slide

	useEffect(() => {
		// Simulate data fetching
		const fetchData = async () => {
			setLoading(true);
			// Simulate a delay
			setTimeout(() => {
				setItems([
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
				]);
				setLoading(false);
			}, 2000); // Simulate a 2-second loading time
		};

		fetchData();
	}, []);

	const settings = {
		dots: true,
		infinite: true,
		speed: 500,
		slidesToShow: 1,
		slidesToScroll: 1,
		autoplay: true,
		autoplaySpeed: 3000,
		beforeChange: (current, next) => setCurrentSlide(next), // Update current slide
		appendDots: dots => {
			const totalSlides = items.length; // Total number of slides
			const visibleDots = 4; // Change this to 3 if needed
			let adjustedCurrentSlide = currentSlide;

			// Adjust the current slide for dot positioning
			if (currentSlide >= totalSlides - 1) {
				adjustedCurrentSlide = totalSlides - 2; // Move to second-to-last dot
			}

			const startIndex = Math.max(0, adjustedCurrentSlide - Math.floor(visibleDots / 2));
			const endIndex = Math.min(totalSlides, startIndex + visibleDots);
			const limitedDots = dots.slice(startIndex, endIndex);

			return (
				<div style={{ display: 'flex', justifyContent: 'center' }}>
					<ul style={{ margin: '0px' }}>{limitedDots}</ul>
				</div>
			);
		},
	};

	if (loading) {
		return (
			<div className="w-full">
				<Slider {...settings}>
					{[...Array(3)].map((_, index) => (
						<div key={index} className="flex justify-center px-6">
							<SkeletonLoader />
						</div>
					))}
				</Slider>
			</div>
		);
	}

	return (
		<div className="w-full">
			<Slider {...settings}>
				{items.map((item, index) => (
					<div key={index} className="flex justify-center px-6">
						<div
							className="relative p-4 rounded-3xl shadow-lg bg-cover bg-center h-64 flex flex-col justify-end"
							style={{ backgroundImage: `url(${item.image})` }}
							>
							{/* Gradient Overlay */}
							<div className="absolute inset-0 bg-gradient-to-t from-primGreen to-transparent rounded-3xl"></div>

							{/* Content */}
							<div className="relative p-2 text-white z-10">
								<h3 className="text-lg font-semibold">{item.title}</h3>
								<div className="flex flex-row gap-2">
									<p className="text-sm">{item.subtitle}</p>
									<button className="text-black bottom-4 right-4 px-3 py-1 text-xs bg-white rounded-lg shadow z-10">
										VR View
									</button>
								</div>
							</div>

						</div>
					</div>
				))}
			</Slider>
		</div>
	);
};

export default Carousel;
