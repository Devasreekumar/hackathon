
import React, { useState } from 'react';

export function ImageWithFallback({ src, alt = '', className = '', fallback, ...props }) {
	const [errored, setErrored] = useState(false);

	const fallbackSrc = fallback || 'data:image/svg+xml;utf8,' + encodeURIComponent(
		`<svg xmlns='http://www.w3.org/2000/svg' width='600' height='400' viewBox='0 0 600 400' fill='none'>
			<rect width='100%' height='100%' fill='%23f3f4f6'/>
			<g fill='%239ca3af' font-family='Arial, Helvetica, sans-serif' font-size='20' text-anchor='middle'>
				<text x='50%' y='50%' dy='-6'>Image not available</text>
				<text x='50%' y='50%' dy='20' font-size='14'>Missing or failed to load</text>
			</g>
		</svg>`
	);

	const handleError = () => setErrored(true);

	return (
		// eslint-disable-next-line jsx-a11y/alt-text
		<img
			src={errored ? fallbackSrc : (src || fallbackSrc)}
			alt={alt}
			className={className}
			onError={handleError}
			loading="lazy"
			{...props}
		/>
	);
}

export default ImageWithFallback;
