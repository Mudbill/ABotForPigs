/**
 * Get a pseudo-random number between 0 and max - 1, as to
 * optimize for inputting an array length.
 * 
 * @param max the highest number +1
 */
export function randomIndex(max: number) {
	return Math.floor(Math.random() * max);
}