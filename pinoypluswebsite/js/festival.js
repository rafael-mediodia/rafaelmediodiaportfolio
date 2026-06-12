import { FESTIVAL_TALKS, getArtistBySlug, profileUrl } from "./data.js";
import { initSite } from "./site.js";

const program = document.getElementById("festivalProgram");

program.innerHTML = FESTIVAL_TALKS.map(
  (block) => `
    <article class="program-block">
      <div class="program-block__time">${block.time}</div>
      <div class="program-block__body">
        <h3>${block.title}</h3>
        <p class="program-block__subtitle">${block.subtitle}</p>
        <p class="program-block__location">${block.location}</p>
        <ul class="program-block__speakers">
          ${block.speakers
            .map((slug) => {
              const artist = getArtistBySlug(slug);
              return artist
                ? `<li><a href="${profileUrl(slug)}">${artist.name}</a> · ${artist.discipline}</li>`
                : "";
            })
            .join("")}
        </ul>
      </div>
    </article>
  `
).join("");

initSite();
