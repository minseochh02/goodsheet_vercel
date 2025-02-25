export default function Loading() {
	return (
		<div className="flex items-center justify-center min-h-[400px]">
			<div className="relative w-10 h-10">
				<div className="absolute w-full h-full border-4 border-gray-200 rounded-full"></div>
				<div className="absolute w-full h-full border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
			</div>
		</div>
	);
}
