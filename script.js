const loader = document.querySelector('.loader');
const navWrap = document.querySelector('.nav-wrap');
const firebaseApp = firebase.apps.length ? firebase.app() : firebase.initializeApp(window.firebaseConfig);
const db = firebase.firestore();
const navLinks = document.querySelectorAll('.nav-links a');
const menuToggle = document.querySelector('.menu-toggle');
const navList = document.querySelector('.nav-links');
const cursorGlow = document.querySelector('.cursor-glow');
const progressBars = document.querySelectorAll('.progress span');

window.addEventListener('load', () => setTimeout(() => loader.classList.add('hidden'), 900));

document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      navList.classList.remove('open');
    }
  });
});

window.addEventListener('scroll', () => {
  navWrap.classList.toggle('scrolled', window.scrollY > 10);
  let current = '';
  document.querySelectorAll('section[id]').forEach(section => {
    const top = section.offsetTop - 110;
    if (window.scrollY >= top) current = section.getAttribute('id');
  });
  navLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${current}`));
});

menuToggle?.addEventListener('click', () => navList.classList.toggle('open'));

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('visible'); });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

const typingWords = ['ECE Student', 'Football Player', 'Future Innovator'];
const typingEl = document.querySelector('.typing-line');
let typingIndex = 0, charIndex = 0, isDeleting = false;
function typeEffect(){
  const currentWord = typingWords[typingIndex];
  typingEl.textContent = currentWord.slice(0, charIndex);
  if (!isDeleting && charIndex < currentWord.length) { charIndex++; setTimeout(typeEffect, 90); }
  else if (isDeleting && charIndex > 0) { charIndex--; setTimeout(typeEffect, 50); }
  else { isDeleting = !isDeleting; if (!isDeleting) typingIndex = (typingIndex + 1) % typingWords.length; setTimeout(typeEffect, 900); }
}
typeEffect();

function animateProgressBars(){ progressBars.forEach((bar, i) => setTimeout(() => { bar.style.width = bar.getAttribute('data-width') + '%'; }, i * 120)); }
const progressObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => { if (entry.isIntersecting) { animateProgressBars(); progressObserver.disconnect(); } });
}, { threshold: 0.35 });
const skillsSection = document.querySelector('#skills');
if (skillsSection) progressObserver.observe(skillsSection);

document.addEventListener('mousemove', (e) => { cursorGlow.style.left = `${e.clientX}px`; cursorGlow.style.top = `${e.clientY}px`; });

const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
let w = canvas.width = window.innerWidth;
let h = canvas.height = window.innerHeight;
let particles = [];
function random(min, max) { return Math.random() * (max - min) + min; }
class Particle { constructor(){ this.x=random(0,w); this.y=random(0,h); this.r=random(1,2.5); this.dx=random(-0.35,0.35); this.dy=random(-0.35,0.35); this.alpha=random(0.35,0.8);} update(){ this.x += this.dx; this.y += this.dy; if (this.x < 0 || this.x > w) this.dx *= -1; if (this.y < 0 || this.y > h) this.dy *= -1; } draw(){ ctx.beginPath(); ctx.fillStyle = `rgba(110,231,255,${this.alpha})`; ctx.arc(this.x, this.y, this.r, 0, Math.PI*2); ctx.fill(); }}
for (let i = 0; i < 90; i++) particles.push(new Particle());
function animateParticles(){ ctx.clearRect(0,0,w,h); particles.forEach(p => { p.update(); p.draw(); }); requestAnimationFrame(animateParticles); }
animateParticles();
window.addEventListener('resize', () => { w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight; particles = []; for (let i = 0; i < 90; i++) particles.push(new Particle()); });

document.querySelector('.contact-form')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = e.currentTarget;
  const button = form.querySelector('.send-btn');
  const email = form.email.value.trim();
  const message = form.message.value.trim();

  if (!email || !message) return;

  button.textContent = 'Sending...';
  button.disabled = true;

  try {
    await db.collection('portfolioMessages').add({
      email,
      message,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    button.textContent = 'Message Sent';
    form.reset();
  } catch (error) {
    console.error('Firebase submission failed:', error);
    button.textContent = 'Try Again';
  } finally {
    setTimeout(() => {
      button.textContent = 'Send Message';
      button.disabled = false;
    }, 1800);
  }
});
