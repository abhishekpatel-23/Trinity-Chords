const NOTES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]

export function transposeChord(chord: string, steps: number): string {
  // very basic transposition logic
  const match = chord.match(/([CDEFGAB][#b]?)(.*)/)
  if (!match) return chord

  let [_, root, suffix] = match
  
  // normalize flats to sharps
  if (root === "Db") root = "C#"
  if (root === "Eb") root = "D#"
  if (root === "Gb") root = "F#"
  if (root === "Ab") root = "G#"
  if (root === "Bb") root = "A#"

  let index = NOTES.indexOf(root)
  if (index === -1) return chord

  let newIndex = (index + steps) % 12
  if (newIndex < 0) newIndex += 12

  return NOTES[newIndex] + suffix
}
