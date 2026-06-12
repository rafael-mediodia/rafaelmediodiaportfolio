import { BRAND, profileUrl, assetUrl, displayColorForSurface, displayFrameForSurface } from "./data.js";
import { firstName, shuffleArray } from "./utils.js";

const LAYOUTS = ["cross", "diagonal", "stair", "zigzag", "lattice"];
const MIRRORS = ["identity", "flipH", "flipV", "flipBoth", "transpose"];

function pickRandom(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function normalizePositions(positions) {
  const minR = Math.min(...positions.map((p) => p.r));
  const minC = Math.min(...positions.map((p) => p.c));
  return positions.map((p) => ({ r: p.r - minR, c: p.c - minC }));
}

function transformPositions(positions, mirror) {
  if (mirror === "identity") return positions;

  const minR = Math.min(...positions.map((p) => p.r));
  const maxR = Math.max(...positions.map((p) => p.r));
  const minC = Math.min(...positions.map((p) => p.c));
  const maxC = Math.max(...positions.map((p) => p.c));

  return positions.map(({ r, c }) => {
    switch (mirror) {
      case "flipH":
        return { r, c: maxC - (c - minC) + minC };
      case "flipV":
        return { r: maxR - (r - minR) + minR, c };
      case "flipBoth":
        return {
          r: maxR - (r - minR) + minR,
          c: maxC - (c - minC) + minC,
        };
      case "transpose":
        return { r: c, c: r };
      default:
        return { r, c };
    }
  });
}

/** No two squares may share a full side — corner contact only. */
function assertCornerOnly(positions) {
  for (let i = 0; i < positions.length; i += 1) {
    for (let j = i + 1; j < positions.length; j += 1) {
      const dr = Math.abs(positions[i].r - positions[j].r);
      const dc = Math.abs(positions[i].c - positions[j].c);
      if (dr + dc === 1) {
        throw new Error("Layout has side contact — corner-only required");
      }
    }
  }
}

/**
 * Hollow crosses chained diagonally — arms meet at corners around a void centre.
 * Cross n anchors at (n, n); arms share corners with neighbours, never full sides.
 */
function buildCross(count) {
  const positions = [];
  const seen = new Set();

  const push = (r, c) => {
    const key = `${r},${c}`;
    if (seen.has(key)) return;
    seen.add(key);
    positions.push({ r, c });
  };

  let crossIndex = 0;
  while (positions.length < count) {
    const a = crossIndex;
    const arms = [
      [a, a + 1],
      [a + 1, a],
      [a + 1, a + 2],
      [a + 2, a + 1],
    ];
    for (const [r, c] of arms) {
      push(r, c);
      if (positions.length >= count) break;
    }
    crossIndex += 1;
  }

  return positions.slice(0, count);
}

/** Straight diagonal — each square touches the next at a corner only. */
function buildDiagonal(count) {
  return Array.from({ length: count }, (_, i) => ({ r: i, c: i }));
}

/** Alternating diagonal steps — wider spread, still corner-linked. */
function buildStair(count) {
  const positions = [];
  let r = 0;
  let c = 0;

  for (let i = 0; i < count; i += 1) {
    positions.push({ r, c });
    if (i % 2 === 0) {
      r += 1;
      c += 1;
    } else {
      r += 1;
      c -= 1;
    }
  }

  return positions;
}

/** Diagonal wave — steps up and down along a checkerboard path. */
function buildZigzag(count) {
  const positions = [];
  let r = 0;
  let c = 0;

  for (let i = 0; i < count; i += 1) {
    positions.push({ r, c });
    if (i % 2 === 0) {
      r += 1;
      c += 1;
    } else {
      r -= 1;
      c += 1;
    }
  }

  return positions;
}

/** Checkerboard lattice — same parity cells only, so sides never align. */
function buildLattice(count) {
  const positions = [];
  let r = 0;
  let c = 0;
  const dirs = [
    [0, 2],
    [1, 1],
    [0, 2],
    [-1, 1],
  ];
  let dir = 0;

  for (let i = 0; i < count; i += 1) {
    positions.push({ r, c });
    if (i < count - 1) {
      const [dr, dc] = dirs[dir % dirs.length];
      r += dr;
      c += dc;
      dir += 1;
    }
  }

  return positions;
}

const LAYOUT_BUILDERS = {
  cross: buildCross,
  diagonal: buildDiagonal,
  stair: buildStair,
  zigzag: buildZigzag,
  lattice: buildLattice,
};

export function generateWeavePositions(count, layout = "cross") {
  const builder = LAYOUT_BUILDERS[layout] ?? buildCross;
  const positions = normalizePositions(builder(count));
  assertCornerOnly(positions);
  return positions;
}

function weaveApplySquareMarkup(gridRow, gridCol, index) {
  return `
    <button
      type="button"
      class="weave-square weave-square--apply"
      aria-label="Submit your work to join the tapestry"
      style="
        --square-color: ${BRAND.lemon};
        --square-text: ${BRAND.adobe};
        --build-delay: ${index * 0.16}s;
        grid-row: ${gridRow};
        grid-column: ${gridCol};
      "
    >
      <span class="weave-square__apply-inner" aria-hidden="true">
        <span class="weave-square__apply-plus" aria-hidden="true"></span>
        <span class="weave-square__apply-text">Want to be part of the tapestry?</span>
      </span>
    </button>
  `;
}

function weaveSquareMarkup(artist, gridRow, gridCol, index) {
  const displayColor = displayColorForSurface(artist.color, BRAND.adobe, index);
  const displayFrame = displayFrameForSurface(artist, displayColor, BRAND.adobe);

  return `
    <a
      class="weave-square"
      href="${profileUrl(artist.slug)}"
      aria-label="${artist.name} — ${artist.discipline}"
      style="
        --square-color: ${displayColor};
        --square-text: ${artist.textOn};
        --build-delay: ${index * 0.16}s;
        grid-row: ${gridRow};
        grid-column: ${gridCol};
      "
    >
      <img class="weave-square__img" src="${assetUrl(displayFrame)}" alt="" loading="eager">
      <span class="weave-square__label">
        <span class="weave-square__name">${firstName(artist.name)}</span>
        <span class="weave-square__discipline">${artist.discipline}</span>
      </span>
    </a>
  `;
}

const MAX_CELL_PX = 168;

/** Size cells from available stage space — no transform scaling. */
export function fitWeaveChain(chainEl) {
  if (!chainEl) return;

  const styles = getComputedStyle(chainEl);
  const rows = Number(styles.getPropertyValue("--weave-rows"));
  const cols = Number(styles.getPropertyValue("--weave-cols"));
  const stage = chainEl.closest(".tapestry-stage");
  if (!stage || !rows || !cols) return;

  const stageStyles = getComputedStyle(stage);
  const padX =
    parseFloat(stageStyles.paddingLeft) + parseFloat(stageStyles.paddingRight);
  const padY =
    parseFloat(stageStyles.paddingTop) + parseFloat(stageStyles.paddingBottom);
  const availW = stage.clientWidth - padX;
  const availH = stage.clientHeight - padY;

  if (availW <= 0 || availH <= 0) return;

  const cell = Math.min(MAX_CELL_PX, availW / cols, availH / rows);

  chainEl.style.setProperty("--weave-cell", `${cell}px`);
}

export function watchWeaveChain(chainEl) {
  if (!chainEl) return;
  fitWeaveChain(chainEl);

  const stage = chainEl.closest(".tapestry-stage");
  if (!stage) return;

  const observer = new ResizeObserver(() => fitWeaveChain(chainEl));
  observer.observe(stage);
}

export function renderWeaveChain(artists, { shuffle = true, layout, mirror, includeApply = true } = {}) {
  if (!artists.length) return "";

  const roster = shuffle ? shuffleArray(artists) : artists;
  const squareCount = includeApply ? roster.length + 1 : roster.length;
  const chosenLayout = layout ?? pickRandom(LAYOUTS);
  const chosenMirror = mirror ?? pickRandom(MIRRORS);
  const positions = transformPositions(
    generateWeavePositions(squareCount, chosenLayout),
    chosenMirror,
  );
  const minR = Math.min(...positions.map((p) => p.r));
  const minC = Math.min(...positions.map((p) => p.c));
  const maxR = Math.max(...positions.map((p) => p.r));
  const maxC = Math.max(...positions.map((p) => p.c));
  const rows = maxR - minR + 1;
  const cols = maxC - minC + 1;

  const artistSquares = positions
    .slice(0, roster.length)
    .map((pos, i) => {
      const artist = roster[i];
      return weaveSquareMarkup(artist, pos.r - minR + 1, pos.c - minC + 1, i);
    })
    .join("");

  const applySquare =
    includeApply && positions[roster.length]
      ? weaveApplySquareMarkup(
          positions[roster.length].r - minR + 1,
          positions[roster.length].c - minC + 1,
          roster.length,
        )
      : "";

  const squares = artistSquares + applySquare;

  return `
    <div
      class="weave-chain"
      data-layout="${chosenLayout}"
      style="--weave-rows: ${rows}; --weave-cols: ${cols};"
      aria-label="Corner-linked artist weave"
    >
      ${squares}
    </div>
  `;
}
