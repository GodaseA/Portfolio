 // src/utils/frames.js

const frames = Object.entries(
  import.meta.glob("./myimg/*.jpg", {
    eager: true,
    import: "default",
  })
)
  .sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true }))
  .map(([, src]) => src);

export default frames;