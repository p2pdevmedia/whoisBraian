import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");
const css = readFileSync(new URL("../styles.css", import.meta.url), "utf8");
const manifest = JSON.parse(
  readFileSync(new URL("../assets/memento-carousel/manifest.json", import.meta.url), "utf8"),
);

const requiredHtml = [
  'class="video-slider"',
  'class="slider-viewport"',
  'class="video-track"',
  'data-slide="0"',
  'class="slider-prev"',
  'class="slider-next"',
  "Director &amp; Photographer",
  'href="#film35"',
  'id="film35"',
  "MEMENTO 35mm",
  "assets/memento-carousel/manifest.json",
  'class="memento-carousel"',
  'class="memento-viewport"',
  'class="memento-track"',
  'class="memento-prev"',
  'class="memento-next"',
  'id="commercials"',
  'class="video-slider commercial-slider"',
  'href="#shortfilms"',
  'id="shortfilms"',
  'href="#actor"',
  'id="actor"',
  "player.vimeo.com/video/1163724360",
  "player.vimeo.com/video/1038807040",
  'data-target-slide="0"',
  'data-target-slide="3"',
  'data-target-slide="4"',
];

for (const snippet of requiredHtml) {
  assert.ok(html.includes(snippet), `Expected index.html to include ${snippet}`);
}

assert.match(
  html,
  /querySelectorAll\("\.video-slide"\)/,
  "Expected slider script to manage video slides",
);
assert.match(
  html,
  /const track = document\.querySelector\("\.video-track"\)/,
  "Expected slider script to move a horizontal video track",
);
assert.match(
  html,
  /track\.style\.transform = `translateX/,
  "Expected slider script to center slides by translating the track",
);
assert.match(
  html,
  /const slideWidth = slide\.offsetWidth/,
  "Expected slider centering to use layout width instead of transformed width",
);
assert.match(
  html,
  /const mementoViewport = document\.querySelector\("\.memento-viewport"\)/,
  "Expected the MEMENTO carousel to bind to its viewport",
);
assert.match(
  html,
  /fetch\("assets\/memento-carousel\/manifest\.json"\)/,
  "Expected the MEMENTO carousel to load its slide manifest",
);
assert.match(
  html,
  /function bindMementoCarousel\(items\)/,
  "Expected the MEMENTO carousel to build slides from manifest data",
);
assert.match(
  html,
  /function showMementoSlide\(index, behavior = "smooth"\)/,
  "Expected the MEMENTO carousel to move by slide index",
);
assert.match(
  html,
  /new IntersectionObserver\(/,
  "Expected the MEMENTO carousel to track the active slide as it scrolls",
);
assert.match(
  html,
  /mementoSlides\[mementoIndex\]\.scrollIntoView\(\{/,
  "Expected the MEMENTO carousel to center the selected slide",
);
assert.match(
  html,
  /mementoTrack\.replaceChildren\(/,
  "Expected the MEMENTO carousel to replace the placeholder track contents",
);
assert.match(
  html,
  /frame\.addEventListener\("click", async \(event\) => \{/,
  "Expected MEMENTO frames to enter fullscreen on click",
);
assert.match(
  html,
  /function exitMementoFullscreen\(\)/,
  "Expected fullscreen clicks to toggle back out when already expanded",
);
assert.match(
  html,
  /const overlay = document\.createElement\("div"\)/,
  "Expected the MEMENTO frame to open an overlay when fullscreen API is unavailable",
);
assert.match(html, /overlay\.className = "memento-overlay"/, "Expected the MEMENTO overlay container");
assert.match(
  html,
  /mementoPrev\?\.addEventListener\("click"/,
  "Expected the MEMENTO carousel to wire the previous button",
);
assert.match(
  html,
  /mementoNext\?\.addEventListener\("click"/,
  "Expected the MEMENTO carousel to wire the next button",
);
assert.match(
  html,
  /iframe\.src = iframe\.dataset\.src/,
  "Expected slider script to lazy-load the active iframe",
);
assert.match(
  html,
  /iframe\.src = ""/,
  "Expected slider script to stop videos when slides change",
);
assert.match(
  css,
  /--paper:\s*#f7f5ef/,
  "Expected the site background to move to an airy off-white palette",
);
assert.match(css, /\.video-slider/, "Expected CSS for the video slider");
assert.match(css, /\.slider-viewport/, "Expected CSS for a horizontal slider viewport");
assert.match(css, /\.video-track/, "Expected CSS for a horizontal video track");
assert.match(
  css,
  /\.slider-controls \{[\s\S]*?position: absolute;/,
  "Expected slider controls to overlay adjacent videos instead of sitting below",
);
assert.match(
  css,
  /\.video-track \{[\s\S]*?gap: 0;/,
  "Expected videos in the track to sit flush with no gap",
);
assert.match(css, /\.memento-intro/, "Expected CSS for the MEMENTO intro block");
assert.match(css, /\.memento-carousel/, "Expected CSS for the MEMENTO carousel");
assert.match(css, /\.memento-slide/, "Expected CSS for the MEMENTO slide cards");
assert.match(css, /\.memento-controls/, "Expected CSS for the MEMENTO controls");
assert.match(css, /\.memento-frame \{[\s\S]*?height:/, "Expected a fixed visual height for each MEMENTO frame");
assert.match(css, /\.memento-frame img \{[\s\S]*?object-fit:\s*contain;/, "Expected MEMENTO images to keep their aspect ratio");
assert.match(css, /\.memento-frame:fullscreen/, "Expected fullscreen styling for the MEMENTO frame");
assert.match(css, /\.memento-overlay/, "Expected fallback overlay styling for the MEMENTO frame");
assert.match(css, /body\.memento-fullscreen-lock/, "Expected body lock styling while the MEMENTO frame is expanded");

assert.equal(manifest.length, 84, "Expected the MEMENTO manifest to include every photo in the folder");
assert.ok(manifest.every((item) => item.src && item.label && item.alt), "Expected manifest entries to be complete");

const projectListHtml = html.match(/<div class="project-list">[\s\S]*?<\/div>/)?.[0] ?? "";
assert.ok(projectListHtml, "Expected a project list for shortfilms");
assert.ok(
  !projectListHtml.includes('href="https://vimeo.com/'),
  "Expected shortfilm projects to trigger in-page playback instead of opening Vimeo",
);
assert.match(
  html,
  /document\.querySelectorAll\("\.project-trigger"\)/,
  "Expected project triggers to connect shortfilm items to the in-page slider",
);
assert.match(
  html,
  /Commercials/,
  "Expected a separate commercials section for Chevrolet S10 Max",
);
