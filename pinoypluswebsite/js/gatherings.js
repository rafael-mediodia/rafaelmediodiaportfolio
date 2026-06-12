import { GATHERINGS_EVENTS } from "./data.js";
import { initSite } from "./site.js";

const list = document.getElementById("gatheringsList");

list.innerHTML = GATHERINGS_EVENTS.map(
  (event) => `
    <article class="event-card">
      <time class="event-card__date">${event.date}</time>
      <div class="event-card__body">
        <h3>${event.title}</h3>
        <p>${event.body}</p>
        <p class="event-card__location">${event.location}</p>
      </div>
    </article>
  `
).join("");

initSite();
