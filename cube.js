// Define all six faces of the Rubik’s Cube
const faces = ['U', 'R', 'F', 'D', 'L', 'B'];
// Color mapping for each face
// Up - White R: Right - Red F: Front - Green D: Down - Yellow L: Left - Orange B: Back - Blue

const colors = {
  U: 'w', R: 'r', F: 'g', D: 'y', L: 'o', B: 'b'
};

// The main cube state and move history
let cube = {};
let history = [];

// Reset the cube to a solved state
function resetCube() {
  cube = {};
  for (let face of faces) {
    cube[face] = Array(9).fill(colors[face]); // 3x3 grid per face
  }
  history = [];
  render();  //Update display
}

// Renders the cube in a 2D layout in HTML
function render() {
  const c = document.getElementById('cube');
  c.innerHTML = '';

  // Layout for cube faces in a net-like view
  const layout = {
    U: [3, 0], R: [6, 3], F: [3, 3],
    D: [3, 6], L: [0, 3], B: [9, 3]
  };

  for (let face in cube) {
    const [x, y] = layout[face];
    for (let i = 0; i < 9; i++) {
      const tile = document.createElement('div');
      tile.className = `tile ${cube[face][i]}`;
      tile.style.gridColumn = `${x + (i % 3) + 1}`;
      tile.style.gridRow = `${y + Math.floor(i / 3) + 1}`;
      c.appendChild(tile);
    }
  }
}

// Rotates a given face and its adjacent edges
function rotateFace(face, clockwise = true) {
  const rotateIndices = [6,3,0,7,4,1,8,5,2]; // Clockwise rotation mapping
  const old = [...cube[face]];
  const newFace = Array(9);
  for (let i = 0; i < 9; i++) {
    newFace[i] = clockwise ? old[rotateIndices[i]] : old[rotateIndices.indexOf(i)];
  }
  cube[face] = newFace;

  const f = cube;
    // Helper to reverse arrays for counter-clockwise moves
  const rotateArray = (a, reverse = false) => reverse ? a.slice().reverse() : a;

  // Rotates the edges surrounding a face
  const rotateSides = {
    F: () => {
      const u = [f.U[6], f.U[7], f.U[8]];
      const r = [f.R[0], f.R[3], f.R[6]];
      const d = [f.D[2], f.D[1], f.D[0]];
      const l = [f.L[8], f.L[5], f.L[2]];
      if (clockwise) {
        [f.R[0], f.R[3], f.R[6]] = u;
        [f.D[0], f.D[1], f.D[2]] = r.reverse();
        [f.L[2], f.L[5], f.L[8]] = d;
        [f.U[6], f.U[7], f.U[8]] = l.reverse();
      } else {
        [f.L[2], f.L[5], f.L[8]] = u;
        [f.D[0], f.D[1], f.D[2]] = l.reverse();
        [f.R[0], f.R[3], f.R[6]] = d;
        [f.U[6], f.U[7], f.U[8]] = r.reverse();
      }
    },
    U: () => {
      const b = [f.B[2], f.B[1], f.B[0]];
      const r = [f.R[0], f.R[1], f.R[2]];
      const fl = [f.F[0], f.F[1], f.F[2]];
      const l = [f.L[0], f.L[1], f.L[2]];
      if (clockwise) {
        [f.F[0], f.F[1], f.F[2]] = l;
        [f.R[0], f.R[1], f.R[2]] = fl;
        [f.B[2], f.B[1], f.B[0]] = r;
        [f.L[0], f.L[1], f.L[2]] = b;
      } else {
        [f.F[0], f.F[1], f.F[2]] = r;
        [f.R[0], f.R[1], f.R[2]] = b;
        [f.B[2], f.B[1], f.B[0]] = l;
        [f.L[0], f.L[1], f.L[2]] = fl;
      }
    },
    D: () => {
      const fl = [f.F[6], f.F[7], f.F[8]];
      const r = [f.R[6], f.R[7], f.R[8]];
      const b = [f.B[6], f.B[7], f.B[8]];
      const l = [f.L[6], f.L[7], f.L[8]];
      if (clockwise) {
        [f.F[6], f.F[7], f.F[8]] = l;
        [f.R[6], f.R[7], f.R[8]] = fl;
        [f.B[6], f.B[7], f.B[8]] = r;
        [f.L[6], f.L[7], f.L[8]] = b;
      } else {
        [f.F[6], f.F[7], f.F[8]] = r;
        [f.R[6], f.R[7], f.R[8]] = b;
        [f.B[6], f.B[7], f.B[8]] = l;
        [f.L[6], f.L[7], f.L[8]] = fl;
      }
    },
    B: () => {
      const u = [f.U[0], f.U[1], f.U[2]];
      const r = [f.R[2], f.R[5], f.R[8]];
      const d = [f.D[8], f.D[7], f.D[6]];
      const l = [f.L[6], f.L[3], f.L[0]];
      if (clockwise) {
        [f.R[2], f.R[5], f.R[8]] = u;
        [f.D[6], f.D[7], f.D[8]] = r.reverse();
        [f.L[0], f.L[3], f.L[6]] = d;
        [f.U[0], f.U[1], f.U[2]] = l.reverse();
      } else {
        [f.L[0], f.L[3], f.L[6]] = u;
        [f.D[6], f.D[7], f.D[8]] = l.reverse();
        [f.R[2], f.R[5], f.R[8]] = d;
        [f.U[0], f.U[1], f.U[2]] = r.reverse();
      }
    },
    R: () => {
      const u = [f.U[2], f.U[5], f.U[8]];
      const fr = [f.F[2], f.F[5], f.F[8]];
      const d = [f.D[2], f.D[5], f.D[8]];
      const b = [f.B[6], f.B[3], f.B[0]];
      if (clockwise) {
        [f.F[2], f.F[5], f.F[8]] = u;
        [f.D[2], f.D[5], f.D[8]] = fr;
        [f.B[6], f.B[3], f.B[0]] = d.reverse();
        [f.U[2], f.U[5], f.U[8]] = b.reverse();
      } else {
        [f.F[2], f.F[5], f.F[8]] = d;
        [f.D[2], f.D[5], f.D[8]] = b.reverse();
        [f.B[6], f.B[3], f.B[0]] = u.reverse();
        [f.U[2], f.U[5], f.U[8]] = fr;
      }
    },
    L: () => {
      const u = [f.U[0], f.U[3], f.U[6]];
      const fr = [f.F[0], f.F[3], f.F[6]];
      const d = [f.D[0], f.D[3], f.D[6]];
      const b = [f.B[8], f.B[5], f.B[2]];
      if (clockwise) {
        [f.F[0], f.F[3], f.F[6]] = u;
        [f.D[0], f.D[3], f.D[6]] = fr;
        [f.B[8], f.B[5], f.B[2]] = d.reverse();
        [f.U[0], f.U[3], f.U[6]] = b.reverse();
      } else {
        [f.F[0], f.F[3], f.F[6]] = d;
        [f.D[0], f.D[3], f.D[6]] = b.reverse();
        [f.B[8], f.B[5], f.B[2]] = u.reverse();
        [f.U[0], f.U[3], f.U[6]] = fr;
      }
    }
  };

  if (rotateSides[face]) rotateSides[face]();

  history.push(`${face}${clockwise ? '' : "'"}`); //Record move
  render(); //Re-render cube
}
 
// Randomizes the cube by performing 10 random moves
function scramble() {
  const moves = 10;
  for (let i = 0; i < moves; i++) {
    const f = faces[Math.floor(Math.random() * 6)];
    const cw = Math.random() > 0.5;
    rotateFace(f, cw);
  }
}

// Solves the cube by reversing all moves in history
function solve() {
  const reversed = [...history].reverse();
  let i = 0;

  function step() {
    if (i >= reversed.length) {
      history = [];
      return;
    }
    const move = reversed[i];
    const f = move[0];
    const cw = move.length === 1;
    rotateFace(f, !cw);
    i++;
    setTimeout(step, 400);
  }

  step();
}

// Applies a given sequence of moves with a delay
function applySteps(steps, delay = 400) {
  let i = 0;
  function next() {
    if (i >= steps.length) return;
    const move = steps[i];
    const face = move[0];
    const clockwise = move.length === 1;
    rotateFace(face, clockwise);
    i++;
    setTimeout(next, delay);
  }
  next();
}

function solveWhiteCross() {
  const moves = [
    "F", "U", "R", "U'", "F'",
    "L", "U", "L'", "U", "B", "U'", "B'"
  ];
  applySteps(moves);
}

// Initialize cube on page load
resetCube();

// Make functions globally accessible to HTML event listeners
window.scramble = scramble;
window.solve = solve;
window.applySteps = applySteps;
window.solveWhiteCross = solveWhiteCross;
