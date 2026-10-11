// Two photos (start and end position) stacked; CSS fades the second one in and out.
export function AnimatedPicture({ img, alt = "" }: { img?: string; alt?: string }) {
  if (!img) return <span className="pic pic--empty" aria-hidden="true" />;
  return (
    <span className="pic">
      <img src={`/exercises/${img}-0.jpg`} alt={alt} loading="lazy" />
      <img className="pic__end" src={`/exercises/${img}-1.jpg`} alt="" aria-hidden="true" loading="lazy" />
    </span>
  );
}
