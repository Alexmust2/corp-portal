export function generateColor (id: number) {
    if (!id) return "#CCCCCC";

    const hash = id
      .toString()
      .split("")
      .reduce((acc, char) => {
        return char.charCodeAt(0) + ((acc << 5) - acc);
      }, 0);

    const hue = hash % 360;
    return `hsl(${hue}, 70%, 60%)`;
}