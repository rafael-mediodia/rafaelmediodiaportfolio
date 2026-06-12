import { SCHOLARSHIP_INFO } from "./data.js";
import { initSite } from "./site.js";

document.getElementById("scholarshipDates").textContent =
  `Applications open ${SCHOLARSHIP_INFO.opens} · Close ${SCHOLARSHIP_INFO.closes}`;

document.getElementById("scholarshipStats").innerHTML = `
  <div class="stat">
    <span class="stat__value">${SCHOLARSHIP_INFO.count}</span>
    <span class="stat__label">grants per year</span>
  </div>
  <div class="stat">
    <span class="stat__value">${SCHOLARSHIP_INFO.amount}</span>
    <span class="stat__label">per recipient</span>
  </div>
  <div class="stat">
    <span class="stat__value">${SCHOLARSHIP_INFO.opens}</span>
    <span class="stat__label">applications open</span>
  </div>
`;

document.getElementById("scholarshipCriteria").innerHTML = SCHOLARSHIP_INFO.criteria
  .map((item) => `<li>${item}</li>`)
  .join("");

const applyLink = document.getElementById("scholarshipApply");
applyLink.href = `mailto:${SCHOLARSHIP_INFO.email}?subject=Pinoy%20Plus%20Scholarship%20Application`;

initSite();
