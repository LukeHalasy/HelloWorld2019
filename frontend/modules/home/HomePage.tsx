import React from 'react';
import Link from 'next/link';

export const HomePage = () => {
	return (
		<div>
			Home Page
			<br />
			<Link href="/apply">
				<button>Apply</button>
			</Link>
		</div>
	);
};
