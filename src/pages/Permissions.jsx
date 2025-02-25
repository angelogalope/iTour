import React from "react";
import {
	IoArrowBack,
	IoCameraOutline,
	IoLocationOutline,
	IoNotificationsOutline,
} from "react-icons/io5";
import { useNavigate } from "react-router";

export default function Permissions() {
	const navigate = useNavigate();

	const handleBack = () => {
		navigate("/features");
	};

	const handleContinue = () => {
		navigate("/welcome");
	};

	// Request notification permission
	const handleNotificationPermission = async () => {
		const permission = await Notification.requestPermission();
		if (permission === "granted") {
			alert("Notification permission granted!");
		} else {
			alert("Notification permission denied.");
		}
	};

	// Request camera permission
	const handleCameraPermission = async () => {
		try {
			await navigator.mediaDevices.getUserMedia({ video: true });
			alert("Camera access granted!");
		} catch (error) {
			alert("Camera access denied.");
		}
	};

	// Request location permission
	const handleLocationPermission = () => {
		if ("geolocation" in navigator) {
			navigator.geolocation.getCurrentPosition(
				(position) => alert("Location access granted!"),
				(error) => alert("Location access denied.")
			);
		} else {
			alert("Geolocation not supported by this browser.");
		}
	};

	return (
		<div className="flex flex-col items-center bg-primGreen h-screen justify-center gap-2 p-8 md:p-10 relative pb-28">
			<div className="flex flex-col justify-start items-start gap-4 md:gap-6">
				<button onClick={handleBack}>
					<IoArrowBack
						size={32}
						className="text-gray-500 bg-white p-2 rounded-full"
					/>
				</button>
				<div className="flex flex-col gap-2 md:gap-4">
					<h1 className="text-2xl md:text-3xl font-bold text-white">Permissions</h1>
					<p className="text-sm md:text-base text-white">
						To enhance your experience, our app requires access to your camera
						for AR navigation, your location for accurate campus navigation, and
						notifications for real-time updates. Please grant the necessary
						permissions to continue.
					</p>
				</div>
				<div className="flex flex-col gap-2 md:gap-4">
					<button onClick={handleNotificationPermission} className="flex items-center gap-3 bg-white bg-opacity-25 p-3 rounded-xl">
						<div className="text-white">
							<IoNotificationsOutline size={30} />
						</div>
						<div className="text-white flex flex-col items-start">
							<h1 className="font-semibold text-lg">Notification</h1>
							<p className="text-start text-sm md:text-base">Enables iTour to send timely updates and real-time alerts</p>
						</div>
					</button>
					<button onClick={handleCameraPermission} className="flex items-center gap-3 bg-white bg-opacity-25 p-3 rounded-xl">
						<div className="text-white">
							<IoCameraOutline size={30} />
						</div>
						<div className="text-white flex flex-col items-start">
							<h1 className="font-semibold text-lg">Camera</h1>
							<p className="text-start text-sm md:text-base">Enables iTour to access your camera for AR navigation</p>
						</div>
					</button>
					<button onClick={handleLocationPermission} className="flex items-center gap-3 bg-white bg-opacity-25 p-3 rounded-xl">
						<div className="text-white">
							<IoLocationOutline size={30} />
						</div>
						<div className="text-white flex flex-col items-start">
							<h1 className="font-semibold text-lg">Location</h1>
							<p className="text-start text-sm md:text-base">Enables iTour to provide accurate navigation based on your location</p>
						</div>
					</button>
				</div>
			</div>
			<div className="w-full absolute bottom-20 px-8 md:px-10">
				<button
					className="bg-primYellow w-full max-w-md py-3 rounded-full font-bold text-lg md:text-xl text-black"
					onClick={handleContinue}
				>
					Continue
				</button>
			</div>
		</div>
	);
}
