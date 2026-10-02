import { useEffect, useState } from "react";
import { Grid } from "./Screen";
import { Tile } from "./Tile";
import { speak } from "@/lib/speech";

export type Story = { title: string; symbol: string; pages: { symbol: string; text: string }[] };

/** Page-by-page story that reads each page aloud. Next / Back are big targets so scanning stays fast. */
export function StoryReader({ story, onDone }: { story: Story; onDone: () => void }) {
  const [page, setPage] = useState(0);
  const p = story.pages[page];
  const last = page === story.pages.length - 1;

  useEffect(() => {
    speak(p.text);
  }, [p]);

  return (
    <>
      <div className="stage">
        <div className="stage-symbol">{p.symbol}</div>
        <p className="stage-text">{p.text}</p>
        <p className="stage-sub">
          Page {page + 1} of {story.pages.length}
        </p>
      </div>
      <div className="mt-5">
        <Grid cols={3}>
          <Tile label="Back" symbol="◀" disabled={page === 0} onSelect={() => setPage(page - 1)} />
          <Tile label="Read again" symbol="🔁" onSelect={() => speak(p.text)} />
          {last ? (
            <Tile label="The end" symbol="🌟" tone="social" onSelect={onDone} />
          ) : (
            <Tile label="Next" symbol="▶" tone="action" onSelect={() => setPage(page + 1)} />
          )}
        </Grid>
      </div>
    </>
  );
}
