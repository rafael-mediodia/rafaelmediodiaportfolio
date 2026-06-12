export const BRAND = {
  pancitCanton: "#d9a83a",
  lemon: "#e4dc3a",
  fruitBlack: "#1a1a1a",
  shrimp: "#c96a45",
  adobe: "#4a3228",
  cabbage: "#6d7558",
  pancitSotanghon: "#ede8d5",
};

function artistPlaceholder(name, color, textColor = BRAND.pancitSotanghon) {
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
    <rect width="400" height="400" fill="${color}"/>
    <text x="200" y="218" text-anchor="middle" font-family="Hanken Grotesk, sans-serif" font-size="72" font-weight="700" fill="${textColor}">${initials}</text>
  </svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

const A = "assets/creatives";

/**
 * Location parts for creatives.
 * US city + state → "City, ST"
 * State/region only → "Rhode Island", "New Jersey"
 * International city → "Manila"
 * Multiple places → joined with " & "
 */
export function formatLocation(places) {
  if (!places?.length) return "";

  return places
    .map((place) => {
      if (place.city && place.region) return `${place.city}, ${place.region}`;
      if (place.region) return place.region;
      if (place.city) return place.city;
      return "";
    })
    .filter(Boolean)
    .join(" & ");
}

export const creatives = [
  {
    slug: "nadine-macapagal",
    name: "Nadine Macapagal",
    shortName: "Macapagal",
    discipline: "Graphic design",
    locations: [{ region: "Rhode Island" }, { city: "San Francisco", region: "CA" }],
    bio: "Graphic designer working across identity, publication, motion, product, and exhibition.",
    practice:
      "Recent work includes RISD Commencement 2025, volume.1, Objects for General Use, FILE TYPE, and Lady Gaga’s MAYHEM BALL.",
    color: BRAND.lemon,
    textOn: BRAND.adobe,
    frame: `${A}/nadine-macapagal/face.jpg`,
    links: { ig: "@nadinemacapagal", site: "nadine.website", email: "nmacapag@risd.edu" },
    featuredIn: "RISD Graphic Design, MFA",
    works: [
      { title: "RISD Commencement 2025", media: `${A}/nadine-macapagal/work-commencement.mp4`, type: "video" },
      { title: "Objects for General Use", media: `${A}/nadine-macapagal/work-objects.jpg`, type: "image" },
      { title: "volume.1", media: `${A}/nadine-macapagal/work-volume.jpg`, type: "image" },
      { title: "Lady Gaga's MAYHEM BALL", media: `${A}/nadine-macapagal/work-mayhem.mp4`, type: "video" },
    ],
  },
  {
    slug: "raya-simpao",
    name: "Raya Simpao",
    shortName: "Simpao",
    discipline: "Painting",
    locations: [{ city: "Manila" }, { city: "New York", region: "NY" }],
    bio: "Painter working in acrylic on canvas. Based between Manila and New York.",
    practice:
      "Raya shares studio paintings and works in progress on Instagram. Commissions and exhibition inquiries by email.",
    color: BRAND.shrimp,
    textOn: BRAND.pancitSotanghon,
    frame: `${A}/raya-simpao/face.jpg`,
    links: { ig: "@rayasimpaoart", email: "rayasimpao03@gmail.com" },
    featuredIn: "RISD Painting, 2026 Senior Show",
    works: [
      { title: "Studio painting", media: `${A}/raya-simpao/work-1.jpg`, type: "image" },
      { title: "Love you a lot", media: `${A}/raya-simpao/work-2.jpg`, type: "image" },
      { title: "Feeling Lovely, Need a Witness", media: `${A}/raya-simpao/work-3.jpg`, type: "image" },
      { title: "Pool fight", media: `${A}/raya-simpao/work-4.jpg`, type: "image" },
    ],
  },
  {
    slug: "nina-uy",
    name: "Nina Uy",
    shortName: "Uy",
    discipline: "Illustration & design",
    locations: [{ city: "Providence", region: "RI" }, { city: "Jersey City", region: "NJ" }],
    bio: "Illustrator and designer based between Providence and Jersey City. Currently earning her BFA in Illustration at the Rhode Island School of Design.",
    practice:
      "Nina’s portfolio spans illustration, books, sketchbooks, and murals — playful worlds with a sharp eye for character and color. She shares work on Instagram as @Ninappleuy.",
    color: BRAND.pancitCanton,
    textOn: BRAND.adobe,
    frame: `${A}/nina-uy/face.png`,
    links: { ig: "@Ninappleuy", email: "ninamisoouy@gmail.com" },
    featuredIn: "RISD Illustration, BFA",
    works: [
      { title: "Illustration", media: `${A}/nina-uy/work-illustration.jpg`, type: "image" },
      { title: "Dreaming puppies", media: `${A}/nina-uy/work-2.jpg`, type: "image" },
      { title: "Vartan Gregorian Elementary mural", media: `${A}/nina-uy/work-mural.jpg`, type: "image" },
    ],
  },
  {
    slug: "julia-suarez",
    name: "Julia Suarez",
    shortName: "Suarez",
    discipline: "Illustration",
    locations: [{ city: "New York", region: "NY" }],
    bio: "Illustrates narrative worlds and printed ephemera — business cards, books, and the occasional hour spent with Pluto.",
    practice:
      "Julia works across editorial illustration and self-initiated projects. Recent work includes a mythical menagerie series, print experiments, and character-led scenes built for long-form reading.",
    color: BRAND.shrimp,
    textOn: BRAND.pancitSotanghon,
    frame: `${A}/julia-suarez/face.jpg`,
    links: { site: "juliasuarez.art", ig: "@julia.suarez.draws" },
    featuredIn: "Plus One Festival 2026",
    works: [
      { title: "Business card", media: `${A}/julia-suarez/work-1.png`, type: "image" },
      { title: "Mythical menagerie", media: `${A}/julia-suarez/work-2.png`, type: "image" },
      { title: "Pluto hour", media: `${A}/julia-suarez/work-3.jpg`, type: "image" },
    ],
  },
  {
    slug: "alec-figuracion",
    name: "Alec Figuracion",
    shortName: "Figuracion",
    discipline: "Graphic design & film",
    locations: [{ region: "New Jersey" }],
    bio: "Graphic designer and filmmaker exploring the many ways to tell a story — across print, motion, identity, web, and video. MFA in Graphic Design, Rhode Island School of Design (2024).",
    practice:
      "Alec’s work spans publication design, motion graphics, brand identity, and experimental film. Selected projects include Follow the Water with Emerging Islands, Second Opinion for Gideon Lasco, Pinoy Lane, Tropico Obscuro, and Soft Procedures — his MFA thesis at RISD.",
    color: BRAND.cabbage,
    textOn: BRAND.pancitSotanghon,
    frame: `${A}/alec-figuracion/face.png`,
    links: { ig: "@alecfiguracion" },
    featuredIn: "Designer Talk series",
    works: [
      { title: "Follow the Water", media: `${A}/alec-figuracion/work-1.jpg`, type: "image" },
      { title: "Second Opinion", media: `${A}/alec-figuracion/work-2.jpg`, type: "image" },
      { title: "Pinoy Lane", media: `${A}/alec-figuracion/work-3.png`, type: "image" },
    ],
  },
];

export const FESTIVAL_TALKS = [
  {
    time: "1:00 – 2:30pm",
    title: "Designer Talk",
    subtitle: "Identity, work, and practice intertwined",
    speakers: ["nadine-macapagal", "nina-uy", "julia-suarez", "alec-figuracion"],
    location: "Gallery A",
  },
  {
    time: "2:45 – 4:00pm",
    title: "Open studio walkthrough",
    subtitle: "Meet artists in their booths and see work in progress",
    speakers: ["raya-simpao", "nina-uy", "julia-suarez", "alec-figuracion"],
    location: "Main hall",
  },
];

export const GATHERINGS_EVENTS = [
  {
    date: "March 15, 2026",
    title: "Season opener potluck",
    body: "Kick off the spring program with food, introductions, and a casual portfolio share. BYO dish.",
    location: "Community studio, Bay Area",
  },
  {
    date: "June 8, 2026",
    title: "Plus One Festival eve",
    body: "A smaller warm-up the night before the festival — meet the speakers and help set up the gallery.",
    location: "Gallery A",
  },
  {
    date: "September 21, 2026",
    title: "End-of-season karaoke",
    body: "Celebrate the year with songs, lumpia, and no pressure to sing well.",
    location: "TBD — rotating host city",
  },
];

export const SCHOLARSHIP_INFO = {
  amount: "$1,500 USD each",
  count: 2,
  opens: "September 1",
  closes: "October 15",
  email: "scholarships@pinoyplus.community",
  criteria: [
    "Filipino or Filipino-American artist, designer, or student",
    "Early-career or currently enrolled (undergrad through first five years out of school)",
    "Proposal for materials, residency fees, studio rent, or a self-directed project",
  ],
};

export function getArtistIndex(slug) {
  return creatives.findIndex((artist) => artist.slug === slug);
}

export function getArtistBySlug(slug) {
  return creatives.find((artist) => artist.slug === slug);
}

export function isInCreativesDir() {
  return /\/creatives\//.test(window.location.pathname);
}

export function galleryUrl() {
  return isInCreativesDir() ? "../profiles.html" : "profiles.html";
}

export function profileUrl(slug) {
  return isInCreativesDir() ? `${slug}.html` : `creatives/${slug}.html`;
}

export function assetUrl(path) {
  if (!path || path.startsWith("data:") || path.startsWith("http")) return path;
  const normalized = path.replace(/^\//, "");
  return isInCreativesDir() ? `../${normalized}` : normalized;
}

export function workImageUrl(work) {
  if (!work) return null;
  return work.media ?? work.image ?? null;
}

export function isVideoWork(work) {
  return work?.type === "video";
}

export function artistHeroMedia(artist, workIndex = 0) {
  const work = artist.works?.[workIndex];
  const path = workImageUrl(work) ?? artist.frame;
  return {
    src: assetUrl(path),
    type: isVideoWork(work) ? "video" : "image",
    title: work?.title ?? null,
  };
}

const SURFACE_ALT_COLORS = [
  BRAND.lemon,
  BRAND.shrimp,
  BRAND.pancitCanton,
  BRAND.cabbage,
  BRAND.fruitBlack,
];

export function displayColorForSurface(color, surfaceColor, index = 0) {
  if (color.toLowerCase() === surfaceColor.toLowerCase()) {
    return SURFACE_ALT_COLORS[index % SURFACE_ALT_COLORS.length];
  }
  return color;
}

export function displayFrameForSurface(artist, displayColor, surfaceColor) {
  if (artist.frame?.startsWith("assets/")) {
    return artist.frame;
  }
  if (artist.color.toLowerCase() !== surfaceColor.toLowerCase()) {
    return artist.frame;
  }
  const textOn =
    displayColor === BRAND.lemon || displayColor === BRAND.pancitCanton
      ? BRAND.adobe
      : BRAND.pancitSotanghon;
  return artistPlaceholder(artist.name, displayColor, textOn);
}
