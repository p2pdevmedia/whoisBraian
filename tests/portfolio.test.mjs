import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");
const css = readFileSync(new URL("../styles.css", import.meta.url), "utf8");

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
  "assets/memento-cover.jpg",
  "assets/memento-landscape.jpg",
  'href="#shortfilms"',
  'id="shortfilms"',
  'href="#actor"',
  'id="actor"',
  "player.vimeo.com/video/1163724360",
  "player.vimeo.com/video/1038807040",
  'data-target-slide="5"',
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
  /function buildLoopSlides\(\)/,
  "Expected slider to build cloned slide sets for a seamless loop",
);
assert.match(
  html,
  /clone\.dataset\.clone = "true"/,
  "Expected cloned slides to be marked as loop clones",
);
assert.match(
  html,
  /function moveSlide\(direction\)/,
  "Expected next and previous buttons to move physically by direction",
);
assert.match(
  html,
  /const viewport = document\.querySelector\("\.slider-viewport"\)/,
  "Expected drag handling to attach to the slider viewport",
);
assert.match(
  html,
  /viewport\.addEventListener\("pointerdown"/,
  "Expected pointer drag to start horizontal slider movement",
);
assert.match(
  html,
  /function finishDrag\(\)/,
  "Expected drag handling to decide whether to move to an adjacent video",
);
assert.match(
  html,
  /activeIndex = \(activeIndex \+ direction \+ slideCount\) % slideCount/,
  "Expected slider navigation to loop infinitely",
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
assert.match(css, /\.memento-book/, "Expected CSS for the MEMENTO book section");
assert.match(css, /\.memento-landscape/, "Expected CSS for the MEMENTO landscape spread");

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
