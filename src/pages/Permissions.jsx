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
  }

	return (
		<div className="flex flex-col items-center bg-primGreen h-screen justify-center gap-2 p-6 relative pb-28">
			<div className="flex flex-col justify-start items-start gap-6">
				<button onClick={handleBack}>
					<IoArrowBack
						size={32}
						className="text-gray-500 bg-white p-2 rounded-full"
					/>
				</button>
				<div className="flex flex-col gap-4">
					<h1 className="text-3xl font-bold text-white">Permissions</h1>
					<p className="text-white">
						To enhance your experience, our app requires access to your camera
						for AR navigation, your location for accurate campus navigation, and
						notifications for real-time updates. Please grant the necessary
						permissions to continue.
					</p>
				</div>
				<div className="flex flex-col gap-4">
					<div className="flex items-center gap-5 bg-white bg-opacity-25 p-4 rounded-xl">
						<div className="text-white">
							<IoNotificationsOutline size={30} />
						</div>
						<div className="text-white">
							<h1 className="font-semibold text-lg">Notification</h1>
							<p>Enables iTour to send timely updates and real-time alerts</p>
						</div>
					</div>
					<div className="flex items-center gap-5 bg-white bg-opacity-25 p-4 rounded-xl">
						<div className="text-white">
							<IoCameraOutline size={30} />
						</div>
						<div className="text-white">
							<h1 className="font-semibold text-lg">Camera</h1>
							<p>Enables iTour to send timely updates and real-time alerts</p>
						</div>
					</div>
					<div className="flex items-center gap-5 bg-white bg-opacity-25 p-4 rounded-xl">
						<div className="text-white">
							<IoLocationOutline size={30} />
						</div>
						<div className="text-white">
							<h1 className="font-semibold text-lg">Location</h1>
							<p>Enables iTour to send timely updates and real-time alerts</p>
						</div>
					</div>
				</div>
			</div>
      <div className="w-full absolute bottom-10 px-6">
        <button
          className="bg-primYellow w-full max-w-md py-3 rounded-full font-bold text-xl text-black"
          onClick={handleContinue}
        >
          Continue
        </button>
      </div>
		</div>
	);
}
