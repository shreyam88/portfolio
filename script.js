// Mobile Menu
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");
menuToggle.addEventListener("click", () => navLinks.classList.toggle("active"));

// Typing Effect
const titles = [
  "Frontend Developer",
  "AI & ML Enthusiast",
  "Web Developer"
];

let titleIndex = 0;
let charIndex = 0;
let isDeleting = false;

const typingEl = document.querySelector(".typing");

// Speed controls (adjust here 👇)
const TYPING_SPEED = 140;   // typing speed
const DELETING_SPEED = 80; // deleting speed
const HOLD_AFTER_TYPE = 1500; // pause after full word
const HOLD_AFTER_DELETE = 600; // pause after delete

function typeEffect() {
  const currentTitle = titles[titleIndex];

  if (!isDeleting) {
    typingEl.textContent = currentTitle.substring(0, charIndex + 1);
    charIndex++;

    if (charIndex === currentTitle.length) {
      setTimeout(() => isDeleting = true, HOLD_AFTER_TYPE);
    }
  } else {
    typingEl.textContent = currentTitle.substring(0, charIndex - 1);
    charIndex--;

    if (charIndex === 0) {
      isDeleting = false;
      titleIndex = (titleIndex + 1) % titles.length;
      setTimeout(() => {}, HOLD_AFTER_DELETE);
    }
  }

  setTimeout(
    typeEffect,
    isDeleting ? DELETING_SPEED : TYPING_SPEED
  );
}

typeEffect();


// Cursor
const cursor = document.querySelector(".cursor");
document.addEventListener("mousemove", e => {
  cursor.style.left = e.clientX + "px";
  cursor.style.top = e.clientY + "px";
});

// Three.js Particles Background
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById("bgCanvas"), alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.z = 5;

const geometry = new THREE.BufferGeometry();
const count = 1500;
const positions = new Float32Array(count * 3);
for (let k = 0; k < count * 3; k++) positions[k] = (Math.random() - 0.5) * 100;
geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
const material = new THREE.PointsMaterial({ color: 0x00eaff, size: 0.06, transparent: true });
const particles = new THREE.Points(geometry, material);
scene.add(particles);

function animate() {
  requestAnimationFrame(animate);
  particles.rotation.y += 0.001;
  particles.rotation.x += 0.0004;
  renderer.render(scene, camera);
}
animate();

// GSAP Animations
gsap.registerPlugin(ScrollTrigger);
gsap.from(".hero-content", { opacity: 0, y: 50, duration: 1.2 });
gsap.utils.toArray("section").forEach(section => {
  gsap.from(section, {
    scrollTrigger: { trigger: section, start: "top 80%" },
    opacity: 0, y: 50, duration: 1
  });
});
