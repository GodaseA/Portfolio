import "./BackgroundWords.css"
function BackgroundWords() {
  const words = [
    "React",
    "Node.js",
    "HTML",
    "CSS",
    "JavaScript",
    "MongoDB"
  ];

  return (
    <div className="bg-words">
      {[...Array(12)].map((_, row) => (
        <div
          key={row}
          className="word-row"
          style={{ animationDelay: `${-row * 2}s` }}
        >
          {[...Array(20)].map((_, i) => (
            <span key={i}>
              {words[i % words.length]}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}

export default BackgroundWords;