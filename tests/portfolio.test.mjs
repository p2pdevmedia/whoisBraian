import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");
const css = html.match(/<style>([\s\S]*?)<\/style>/)?.[1] ?? "";

const requiredHtml = [
  'href="#film"',
  'id="film"',
  "FILM",
  'href="#photography"',
  'id="photography"',
  "STILL PHOTO",
  'href="#memento"',
  'id="memento"',
  "MEMENTO",
  'href="#ambulante"',
  'id="ambulante"',
  "TALLER<br />DE&nbsp;CINE",
  'href="#actor"',
  'id="actor"',
  "SELECTED ACTING WORK",
  'href="#bio"',
  'id="bio"',
  "BIO",
  'href="#contact"',
  'id="contact"',
  "CONTACT",
  "assets/memento/memento-cover.jpg",
  "assets/actor/PLACEBO%20COVER.png",
  "assets/actor/PLACEBO-web.m4v",
  "Writer &amp; Director: Sage Bennett",
  "Starring: Sage Bennett &amp; Brian Hansen",
  "player.vimeo.com/video/1038807040",
  "player.vimeo.com/video/1160375315",
  "player.vimeo.com/video/1160387061",
  "player.vimeo.com/video/1160390224",
  "player.vimeo.com/video/1163724360",
  "player.vimeo.com/video/1160381965",
];

for (const snippet of requiredHtml) {
  assert.ok(html.includes(snippet), `Expected index.html to include ${snippet}`);
}

for (const asset of [
  "../assets/memento/memento-cover.jpg",
  "../assets/actor/PLACEBO COVER.png",
  "../assets/actor/PLACEBO-web.m4v",
]) {
  assert.ok(existsSync(new URL(asset, import.meta.url)), `Expected local asset ${asset}`);
}

const filmItems = html.match(/const filmItems = \[([\s\S]*?)\n\s*\];/)?.[1] ?? "";
const photographyItems = html.match(/const photographyItems = \[([\s\S]*?)\n\s*\];/)?.[1] ?? "";
const ambulanteItems = html.match(/const ambulanteItems = \[([\s\S]*?)\n\s*\];/)?.[1] ?? "";

assert.equal((filmItems.match(/player\.vimeo\.com\/video/g) ?? []).length, 6, "Expected six FILM projects");
assert.equal((photographyItems.match(/\{ file:/g) ?? []).length, 23, "Expected 23 STILL PHOTO images");
assert.equal((ambulanteItems.match(/player\.vimeo\.com\/video/g) ?? []).length, 7, "Expected seven TALLER DE CINE projects");

for (const [, filename] of photographyItems.matchAll(/file: "([^"]+)"/g)) {
  assert.ok(
    existsSync(new URL(`../assets/photography/${filename}`, import.meta.url)),
    `Expected photography asset ${filename}`,
  );
}

assert.match(html, /function attachLoopCarousel\(/, "Expected a shared carousel controller");
assert.match(html, /function resetLoop\(\)/, "Expected circular carousel navigation");
assert.match(html, /track\.style\.transform = `translateX/, "Expected centered horizontal tracks");
assert.match(html, /video\.play\(\)\.catch/, "Expected local video playback support");
assert.match(html, /iframe\.src = ""/, "Expected inactive Vimeo players to stop");
assert.doesNotMatch(html, /assets\/actor\/PLACEBO\.mp4/, "Expected the GitHub-compatible PLACEBO video");

assert.match(css, /--paper:\s*#f7f5ef/, "Expected the off-white site palette");
assert.match(css, /\.video-track,[\s\S]*?gap:\s*0;/, "Expected flush carousel tracks");
assert.match(css, /\.slider-controls \{[\s\S]*?position:\s*absolute;/, "Expected overlaid carousel controls");
assert.match(css, /\.slide-caption \.credits-columns \{[\s\S]*?column-count:\s*2;/, "Expected two-column Chevrolet credits");
assert.match(css, /opacity:\s*0\.32;/, "Expected subdued captions on adjacent slides");

console.log("Portfolio checks passed");
