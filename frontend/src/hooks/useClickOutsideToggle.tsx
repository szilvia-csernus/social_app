import { useEffect, useRef, useState } from 'react'

function useClickOutsideToggle() {
    const [expanded, setExpanded] = useState(false);
		const ref = useRef<HTMLButtonElement | null>(null);
		useEffect(() => {
			const handleClickOutside = (event: MouseEvent) => {
				if (ref.current && !ref.current.contains(event.target as Node)) {
					setExpanded(false);
				}
			};

			document.addEventListener('click', handleClickOutside);
			return () => {
				document.removeEventListener('click', handleClickOutside);
			};
		}, [ref]);
  return (
    {expanded, setExpanded, ref}
  )
}

export default useClickOutsideToggle