// js/script.js

// Quiz data
const questions = [
  { q: "What is the capital of California?", type: "radio", options: ["Sacramento","Los Angeles","San Francisco","San Diego"], answer: "Sacramento" },
  { q: "Which state has the nickname 'The Lone Star State'?", type: "radio", options: ["Texas","Arizona","New Mexico","Oklahoma"], answer: "Texas" },
  { q: "Select all states that border the Great Lakes.", type: "checkbox", options: ["Michigan","Ohio","Pennsylvania","Georgia"], answer: ["Michigan","Ohio","Pennsylvania"] },
  { q: "What river forms most of the border between Texas and Mexico?", type: "radio", options: ["Rio Grande","Mississippi","Colorado","Brazos"], answer: "Rio Grande" },
  { q: "Which is the largest state by area?", type: "radio", options: ["Alaska","Texas","California","Montana"], answer: "Alaska" },
  { q: "Enter the two-letter postal abbreviation for New York.", type: "text", answer: "NY" },
  { q: "How many states share a border with Colorado? (Enter a number)", type: "number", answer: 7 },
  { q: "Select the region where the Appalachian Mountains are primarily located.", type: "select", options: ["Northeast","Midwest","South","West"], answer: "Northeast" },
  { q: "Using the slider, estimate the approximate distance (in miles) from New York City to Los Angeles.", type: "range", min: 2000, max: 3000, answer: 2800 },
  { q: "On which date did Hawaii become the 50th state? (Use date picker)", type: "date", answer: "1959-08-21" }
];

// Randomize at least one question's options
questions[1].options.sort(() => Math.random() - 0.5);

// Build quiz UI
function loadQuiz() {
  const container = document.getElementById('questions');
  questions.forEach((item, idx) => {
    const card = document.createElement('div'); card.className = 'card mb-3';
    const body = document.createElement('div'); body.className = 'card-body card-bg';
    const label = document.createElement('h5'); label.textContent = `${idx+1}. ${item.q}`;
    body.appendChild(label);

    const formGroup = document.createElement('div'); formGroup.className = 'mt-2';
    if (item.type === 'radio' || item.type === 'checkbox') {
      item.options.forEach((opt, i) => {
        const div = document.createElement('div'); div.className = 'form-check';
        const input = document.createElement('input');
        input.type = item.type;
        input.name = `q${idx}`;
        input.id = `q${idx}opt${i}`;
        input.value = opt;
        input.className = 'form-check-input';
        const lbl = document.createElement('label');
        lbl.htmlFor = input.id;
        lbl.textContent = opt;
        lbl.className = 'form-check-label';
        div.append(input, lbl);
        formGroup.appendChild(div);
      });
    } else if (['text','number','date'].includes(item.type)) {
      const input = document.createElement('input');
      input.type = item.type;
      input.name = `q${idx}`;
      input.className = 'form-control';
      formGroup.appendChild(input);
    } else if (item.type === 'select') {
      const select = document.createElement('select');
      select.name = `q${idx}`;
      select.className = 'form-select';
      item.options.forEach(opt => {
        const op = document.createElement('option');
        op.value = opt;
        op.textContent = opt;
        select.appendChild(op);
      });
      formGroup.appendChild(select);
    } else if (item.type === 'range') {
      const input = document.createElement('input');
      input.type = 'range';
      input.name = `q${idx}`;
      input.min = item.min;
      input.max = item.max;
      input.className = 'form-range';
      const span = document.createElement('span');
      span.id = `q${idx}val`;
      span.className = 'ms-2';
      span.textContent = item.min;
      input.addEventListener('input', () => span.textContent = input.value);
      formGroup.append(input, span);
    }

    body.append(formGroup);
    const fb = document.createElement('div');
    fb.id = `feedback${idx}`;
    fb.className = 'mt-2';
    body.appendChild(fb);
    card.appendChild(body);
    container.appendChild(card);
  });

  // track times taken
  let times = parseInt(localStorage.getItem('timesTaken')) || 0;
  times++;
  localStorage.setItem('timesTaken', times);
  document.getElementById('timesTaken').textContent = `Total times taken: ${times}`;
}

// Handle submit
function handleSubmit(e) {
  e.preventDefault();
  let score = 0;
  questions.forEach((item, idx) => {
    const feedback = document.getElementById(`feedback${idx}`);
    feedback.innerHTML = '';
    let correct = false;
    const name = `q${idx}`;

    if (item.type === 'checkbox') {
      const vals = Array.from(document.querySelectorAll(`input[name="${name}"]:checked`)).map(i => i.value);
      correct = JSON.stringify(vals.sort()) === JSON.stringify(item.answer.sort());
    } else if (item.type === 'select' || item.type === 'date') {
      correct = document.querySelector(`[name="${name}"]`).value === item.answer;
    } else if (item.type === 'range') {
      const val = +document.querySelector(`[name="${name}"]`).value;
      correct = Math.abs(val - item.answer) <= 100;
    } else {
      const val = document.querySelector(`[name="${name}"]`).value;
      if (item.type === 'text') {
        correct = val.trim().toUpperCase() === item.answer;
      } else if (item.type === 'number') {
        correct = +val === item.answer;
      } else {
        correct = val === item.answer;
      }
    }

    feedback.innerHTML = correct
      ? '<i class="bi bi-check-circle-fill text-success"></i> Correct'
      : '<i class="bi bi-x-circle-fill text-danger"></i> Incorrect';
    if (correct) score += 10;
  });

  const out = document.getElementById('quizResult');
  out.innerHTML = `<h4>Your score: ${score}/100</h4>`;
  if (score >= 80) {
    out.innerHTML += `<div class="alert alert-success mt-2">Congratulations! You scored above 80!</div>`;
  }
}

// Wire up
document.addEventListener('DOMContentLoaded', loadQuiz);
document.getElementById('quizForm').addEventListener('submit', handleSubmit);