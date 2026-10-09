/* CarePoint ward portal: front-end prototype.
   Demo only. Data lives in the browser (localStorage) and logins are simulated.
   Replace with a real backend and authentication before using real patient data. */

const ROLES = {
  nurse:   { label: 'Nurse',          desc: 'Record temperatures and nursing notes' },
  doctor:  { label: 'Doctor',         desc: 'Review charts, add history, prescribe' },
  patient: { label: 'Patient',        desc: 'See your own health record' },
  admin:   { label: 'Hospital admin', desc: 'Admit and discharge patients, view staff' }
};

const USERS = [
  { user: 'nurse1',   pass: 'nurse123',   role: 'nurse',   name: 'Priya Nair' },
  { user: 'doctor1',  pass: 'doctor123',  role: 'doctor',  name: 'Dr. Arjun Mehta' },
  { user: 'patient1', pass: 'patient123', role: 'patient', name: 'Rahul Sharma', patientId: 'P-1001' },
  { user: 'admin',    pass: 'admin123',   role: 'admin',   name: 'Sunita Rao' }
];

const STAFF = [
  { name: 'Dr. Arjun Mehta',  role: 'Doctor', dept: 'General medicine' },
  { name: 'Dr. Kavita Iyer',  role: 'Doctor', dept: 'Cardiology' },
  { name: 'Priya Nair',       role: 'Nurse',  dept: 'Ward A' },
  { name: "Joseph D'Souza",   role: 'Nurse',  dept: 'Ward B' },
  { name: 'Sunita Rao',       role: 'Admin',  dept: 'Administration' }
];

/* ---------- seed data ---------- */
const ago = h => new Date(Date.now() - h * 3600e3).toISOString();
const daysAgo = d => new Date(Date.now() - d * 86400e3).toISOString();

function seed() {
  return {
    patients: [
      {
        id: 'P-1001', name: 'Rahul Sharma', age: 46, gender: 'Male', blood: 'B+', phone: '98200 11122',
        ward: 'Ward A', bed: 'A-12', doctor: 'Dr. Arjun Mehta', status: 'Admitted', admitted: daysAgo(3),
        allergies: ['Penicillin'], conditions: ['Type 2 diabetes', 'Hypertension'],
        vitals: [
          { id: 1, at: ago(30), temp: 37.2, pulse: 78, bp: '130/84', spo2: 98, by: 'Priya Nair', note: '' },
          { id: 2, at: ago(22), temp: 37.9, pulse: 84, bp: '134/86', spo2: 97, by: 'Priya Nair', note: 'Mild chills' },
          { id: 3, at: ago(14), temp: 38.6, pulse: 92, bp: '138/88', spo2: 96, by: "Joseph D'Souza", note: 'Doctor informed' },
          { id: 4, at: ago(6),  temp: 37.8, pulse: 82, bp: '132/84', spo2: 97, by: 'Priya Nair', note: 'After paracetamol' }
        ],
        history: [
          { at: daysAgo(900), by: 'Dr. Arjun Mehta', title: 'Type 2 diabetes diagnosed', text: 'HbA1c 8.1%. Started metformin 500 mg.' },
          { at: daysAgo(400), by: 'Dr. Arjun Mehta', title: 'Hypertension', text: 'BP stayed above 140/90. Added amlodipine 5 mg.' },
          { at: daysAgo(3),   by: 'Dr. Arjun Mehta', title: 'Admitted with a lower respiratory infection', text: 'Fever and productive cough for 4 days. Chest X-ray shows right lower lobe infiltrate. IV antibiotics started.' }
        ],
        meds: [
          { name: 'Metformin', dose: '500 mg', freq: 'Twice daily' },
          { name: 'Amlodipine', dose: '5 mg', freq: 'Once daily' },
          { name: 'Ceftriaxone IV', dose: '1 g', freq: 'Every 12 hours' },
          { name: 'Paracetamol', dose: '650 mg', freq: 'If temperature is above 38 °C' }
        ],
        notes: [{ at: ago(14), by: "Joseph D'Souza", text: 'Fever spike at 38.6 °C. Cold sponging done. Dr. Mehta informed.' }]
      },
      {
        id: 'P-1002', name: 'Anita Verma', age: 62, gender: 'Female', blood: 'O+', phone: '98190 22233',
        ward: 'Ward A', bed: 'A-05', doctor: 'Dr. Kavita Iyer', status: 'Admitted', admitted: daysAgo(1),
        allergies: ['None known'], conditions: ['Coronary artery disease'],
        vitals: [
          { id: 1, at: ago(18), temp: 36.8, pulse: 70, bp: '122/78', spo2: 99, by: 'Priya Nair', note: '' },
          { id: 2, at: ago(8),  temp: 36.6, pulse: 72, bp: '120/76', spo2: 99, by: 'Priya Nair', note: '' }
        ],
        history: [
          { at: daysAgo(1), by: 'Dr. Kavita Iyer', title: 'Admitted for chest pain observation', text: 'ECG normal, troponin negative. Observe for 48 hours.' }
        ],
        meds: [{ name: 'Aspirin', dose: '75 mg', freq: 'Once daily' }, { name: 'Atorvastatin', dose: '20 mg', freq: 'At night' }],
        notes: []
      },
      {
        id: 'P-1003', name: 'Imran Qureshi', age: 8, gender: 'Male', blood: 'A+', phone: '98330 33344',
        ward: 'Ward B', bed: 'B-03', doctor: 'Dr. Arjun Mehta', status: 'Admitted', admitted: daysAgo(2),
        allergies: ['Dust'], conditions: ['Asthma'],
        vitals: [
          { id: 1, at: ago(12), temp: 35.8, pulse: 96, bp: '98/62', spo2: 95, by: "Joseph D'Souza", note: 'Cool to touch' }
        ],
        history: [{ at: daysAgo(2), by: 'Dr. Arjun Mehta', title: 'Admitted with an asthma flare-up', text: 'Nebulisation given. Oxygen saturation improving.' }],
        meds: [{ name: 'Salbutamol nebuliser', dose: '2.5 mg', freq: 'Every 6 hours' }],
        notes: []
      }
    ],
    nextPid: 1004
  };
}

/* ---------- state ---------- */
const KEY = 'carepoint_v1';
let DB = load();
let S = { session: null, view: 'login', pid: null, selRole: 'nurse', loginErr: '', search: '' };

function load() { try { return JSON.parse(localStorage.getItem(KEY)) || seed(); } catch { return seed(); } }
function save() { try { localStorage.setItem(KEY, JSON.stringify(DB)); } catch {} }

/* ---------- helpers ---------- */
const $ = s => document.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const fmt = iso => new Date(iso).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', hour12: false });
const fmtDate = iso => new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
const hhmm = iso => new Date(iso).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false });
const dayMon = iso => new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
const pat = id => DB.patients.find(p => p.id === id);
const latest = p => p.vitals[p.vitals.length - 1];
const me = () => S.session;
const tClass = t => t >= 38 ? 't-hi' : t < 36 ? 't-lo' : 't-ok';
const dotClass = t => t >= 38 ? 'd-hi' : t < 36 ? 'd-lo' : 'd-ok';
const tTag = t => t >= 38 ? '<span class="tag hi">Fever</span>' : t < 36 ? '<span class="tag low">Low</span>' : '<span class="tag ok">Normal</span>';
const tempHtml = t => `<span class="temp ${tClass(t)}">${Number(t).toFixed(1)} °C</span>`;
function toast(msg) { const d = document.createElement('div'); d.className = 'toast'; d.setAttribute('role', 'status'); d.textContent = msg; document.body.appendChild(d); setTimeout(() => d.remove(), 3000); }
function go(view, pid = null) { S.view = view; S.pid = pid; render(); window.scrollTo(0, 0); }

/* ---------- charts ---------- */
/* Observation chart: one column per reading, like the paper chart at the foot of the bed. */
function chart(vitals, cls = '') {
  const list = vitals.slice(-8), n = list.length;
  if (!n) return '<p class="empty">No readings yet. Add the first temperature to start this chart.</p>';
  const W = 720, H = 300, L = 46, R = 14, T = 16, B = 54, min = 35, max = 40;
  const slot = (W - L - R) / n, x = i => L + slot * (i + .5);
  const y = t => T + (max - Math.min(max, Math.max(min, t))) / (max - min) * (H - T - B);
  let g = `<rect class="z-hi" x="${L}" y="${y(40)}" width="${W - L - R}" height="${y(38) - y(40)}"/>
           <rect class="z-lo" x="${L}" y="${y(36)}" width="${W - L - R}" height="${y(35) - y(36)}"/>`;
  for (let t = 35; t <= 40; t += .5) {
    const whole = Number.isInteger(t);
    g += `<line class="${whole ? 'g-major' : 'g-minor'}" x1="${L}" x2="${W - R}" y1="${y(t)}" y2="${y(t)}"/>`;
    if (whole) g += `<text class="ax" x="${L - 8}" y="${y(t) + 4}" text-anchor="end">${t}</text>`;
  }
  for (let i = 0; i <= n; i++) g += `<line class="g-minor" x1="${L + slot * i}" x2="${L + slot * i}" y1="${T}" y2="${H - B}"/>`;
  g += `<text class="ax" x="${L - 8}" y="10" text-anchor="end">°C</text>
        <text class="zt hi" x="${L + 8}" y="${y(38) - 7}">Fever: 38 °C and above</text>
        <text class="zt lo" x="${L + 8}" y="${y(36) + 17}">Low: below 36 °C</text>`;
  g += `<polyline class="ln" pathLength="1" points="${list.map((v, i) => x(i) + ',' + y(v.temp)).join(' ')}"/>`;
  list.forEach((v, i) => {
    const py = y(v.temp), ty = py < T + 22 ? py + 22 : py - 11;
    g += `<circle class="${dotClass(v.temp)}" cx="${x(i)}" cy="${py}" r="6"><title>${v.temp.toFixed(1)} °C at ${fmt(v.at)}</title></circle>
          <text class="val" x="${x(i)}" y="${ty}" text-anchor="middle">${v.temp.toFixed(1)}</text>
          <text class="tl" x="${x(i)}" y="${H - B + 20}" text-anchor="middle">${hhmm(v.at)}</text>
          <text class="tl d" x="${x(i)}" y="${H - B + 37}" text-anchor="middle">${dayMon(v.at)}</text>`;
  });
  return `<svg class="chart ${cls}" viewBox="0 0 ${W} ${H}" role="img" aria-label="Temperature chart showing the last ${n} readings">${g}</svg>`;
}

function spark(vitals) {
  const l = vitals.slice(-6);
  if (l.length < 2) return '<small>Needs 2 readings</small>';
  const W = 100, H = 28, p = 4, min = 35.5, max = 39.5;
  const x = i => p + i * (W - 2 * p) / (l.length - 1);
  const y = t => p + (max - Math.min(max, Math.max(min, t))) / (max - min) * (H - 2 * p);
  const last = l[l.length - 1];
  return `<svg class="spark" viewBox="0 0 ${W} ${H}" width="100" height="28" role="img" aria-label="Recent temperature trend">
    <line class="sp-ref" x1="${p}" x2="${W - p}" y1="${y(38)}" y2="${y(38)}"/>
    <polyline class="sp-ln" points="${l.map((v, i) => x(i) + ',' + y(v.temp)).join(' ')}"/>
    <circle class="${dotClass(last.temp)}" cx="${x(l.length - 1)}" cy="${y(last.temp)}" r="3.5"/></svg>`;
}

/* ---------- sign in ---------- */
const SAMPLE = [37.1, 37.4, 37.9, 38.6, 38.1, 37.6, 37.2].map((temp, i) => ({ temp, at: ago((6 - i) * 5) }));

function loginView() {
  const r = S.selRole, demo = USERS.find(u => u.role === r);
  return `<div class="login">
    <section class="login-left">
      <h1>Every temperature, charted where the whole team can see it.</h1>
      <p class="sub">CarePoint keeps bedside readings, medical history and medications in one record for nurses, doctors, patients and administrators.</p>
      <figure class="sheet" style="margin:0">${chart(SAMPLE, 'draw')}
        <figcaption>Sample chart from the demo ward. Readings of 38 °C and above are marked as fever.</figcaption></figure>
    </section>
    <section class="login-right">
      <h2>Sign in</h2>
      <p class="muted">Choose your role, then enter your details.</p>
      <div class="lbl" id="rl">I am signing in as</div>
      <div class="roles" role="radiogroup" aria-labelledby="rl">${Object.entries(ROLES).map(([k, v]) => `
        <button type="button" class="role" role="radio" aria-checked="${k === r}" data-act="role" data-v="${k}"><span class="rb"></span><span><b>${v.label}</b><span class="d">${v.desc}</span></span></button>`).join('')}
      </div>
      <form id="loginForm">
        <label for="u">Username</label><input id="u" autocomplete="username" value="${demo.user}">
        <label for="p">Password</label><input id="p" type="password" autocomplete="current-password" value="${demo.pass}">
        <div class="err" id="err" role="alert">${esc(S.loginErr)}</div>
        <button class="btn wide">Log in as ${ROLES[r].label.toLowerCase()}</button>
      </form>
      <p class="demo">Demo account filled in for you: <b>${demo.user}</b> / <b>${demo.pass}</b></p>
      <p style="margin-top:16px"><button class="linkbtn" data-act="view" data-v="workflow">See the workflow and screen designs</button></p>
    </section></div>`;
}

/* ---------- app frame ---------- */
function navItems() {
  const base = {
    nurse:   [['dash', 'Ward board'], ['patients', 'All patients']],
    doctor:  [['dash', 'My patients'], ['patients', 'All patients']],
    patient: [['mine', 'My record']],
    admin:   [['dash', 'Overview'], ['patients', 'Patients'], ['staff', 'Staff']]
  }[me().role];
  return [...base, ['workflow', 'Workflow']];
}

function shell(content) {
  const u = me();
  const on = v => S.view === v || (S.view === 'patient' && v === 'patients');
  return `<header class="topbar"><div class="brand">CarePoint</div>
    <nav class="tabs" aria-label="Main">${navItems().map(([v, l]) => `<button data-act="view" data-v="${v}" ${on(v) ? 'aria-current="page"' : ''}>${l}</button>`).join('')}</nav>
    <div class="who"><span><b>${esc(u.name)}</b><small>${ROLES[u.role].label}</small></span><button class="btn small on-dark" data-act="logout">Log out</button></div>
  </header><main class="page">${content}</main>`;
}

/* ---------- patient lists ---------- */
function board(list) {
  if (!list.length) return '<p class="empty">No patients to show.</p>';
  return `<div class="tablewrap"><table><thead><tr><th>Bed</th><th>Patient</th><th>Doctor</th><th>Trend</th><th>Latest temperature</th><th>Status</th></tr></thead><tbody>
    ${list.map(p => {
      const v = latest(p), flag = p.status === 'Admitted' && v ? (v.temp >= 38 ? 'flag' : v.temp < 36 ? 'flag-low' : '') : '';
      return `<tr class="click ${flag}" tabindex="0" data-act="open" data-v="${p.id}">
        <td><b>${p.status === 'Admitted' ? esc(p.bed) : '–'}</b><br><small>${p.status === 'Admitted' ? esc(p.ward) : ''}</small></td>
        <td><b>${esc(p.name)}</b><br><small>${p.id}, ${p.age} years, ${p.gender.toLowerCase()}</small></td>
        <td>${esc(p.doctor)}</td>
        <td>${spark(p.vitals)}</td>
        <td>${v ? tempHtml(v.temp) + ' ' + tTag(v.temp) + '<br><small>' + fmt(v.at) + '</small>' : '<small>No readings</small>'}</td>
        <td><span class="tag ${p.status === 'Admitted' ? 'info' : 'plain'}">${p.status}</span></td></tr>`; }).join('')}
  </tbody></table></div>`;
}

function dashView() {
  const u = me(), r = u.role;
  let list = DB.patients.filter(p => p.status === 'Admitted');
  if (r === 'doctor') list = list.filter(p => p.doctor === u.name);
  const fevers = list.filter(p => latest(p) && latest(p).temp >= 38);
  const lows = list.filter(p => latest(p) && latest(p).temp < 36);
  const title = { nurse: 'Ward board', doctor: 'My patients', admin: 'Overview' }[r];
  const n = list.length;
  const alerts = [fevers.length && `${fevers.length} with a fever`, lows.length && `${lows.length} with a low temperature`].filter(Boolean);
  let sum = `${n} ${n === 1 ? 'patient is' : 'patients are'} admitted. ${alerts.length ? alerts.join(' and ') + '.' : 'No temperature alerts.'}`;
  if (r === 'admin') { const d = DB.patients.filter(p => p.status === 'Discharged').length; sum += ` ${d} discharged.`; }
  let h = `<div class="head"><div><h1>${title}</h1><p class="lede">${sum}</p></div>
    ${r === 'admin' ? '<button class="btn" data-act="addPatient">Admit patient</button>' : ''}</div>`;
  const flagged = [...fevers, ...lows];
  if (flagged.length) h += `<section class="attn" aria-label="Needs attention"><h3>Needs attention</h3>
    ${flagged.map(p => `<div class="it"><span><b>${esc(p.name)}</b>, bed ${esc(p.bed)}: ${tempHtml(latest(p).temp)} ${tTag(latest(p).temp)}</span><button class="btn small line" data-act="open" data-v="${p.id}">Open chart</button></div>`).join('')}</section>`;
  h += `<section class="panel"><div class="panel-head"><h3>${r === 'nurse' ? 'Your patients. Select one to record a temperature.' : 'Admitted patients'}</h3></div>${board(list)}</section>`;
  return h;
}

function patientsView() {
  const q = S.search.toLowerCase();
  const list = DB.patients.filter(p => !q || (p.name + p.id + p.ward + p.bed).toLowerCase().includes(q));
  return `<div class="head"><h1>Patients</h1><div class="row">
    <input id="search" aria-label="Search patients" placeholder="Search by name, ID or bed" value="${esc(S.search)}" style="width:260px">
    ${me().role === 'admin' ? '<button class="btn" data-act="addPatient">Admit patient</button>' : ''}</div></div>
    <section class="panel">${board(list)}</section>`;
}

/* ---------- patient record ---------- */
function patientDetail(p) {
  const role = me().role, canVitals = role === 'nurse', canNote = role === 'nurse' || role === 'doctor';
  const v = latest(p), noAllergy = p.allergies.every(a => /none/i.test(a));
  const back = role === 'patient' ? '' : '<p style="margin-bottom:12px"><button class="linkbtn" data-act="view" data-v="patients">Back to patients</button></p>';
  return `${back}
  <div class="allergy ${noAllergy ? 'none' : ''}">${noAllergy ? 'No known allergies' : 'Allergies: ' + p.allergies.map(esc).join(', ')}</div>
  <section class="banner">
    <div class="top"><div><h1>${esc(p.name)}</h1></div>
      <div class="row"><span class="tag ${p.status === 'Admitted' ? 'info' : 'plain'}">${p.status}</span>
      ${role === 'admin' ? `<button class="btn small ${p.status === 'Admitted' ? 'danger' : 'line'}" data-act="toggleStatus" data-v="${p.id}">${p.status === 'Admitted' ? 'Discharge patient' : 'Re-admit patient'}</button>` : ''}</div></div>
    <dl class="facts">
      <div><dt>Patient ID</dt><dd>${p.id}</dd></div>
      <div><dt>Age and sex</dt><dd>${p.age}, ${p.gender.toLowerCase()}</dd></div>
      <div><dt>Blood group</dt><dd>${esc(p.blood)}</dd></div>
      <div><dt>Bed</dt><dd>${p.status === 'Admitted' ? esc(p.ward + ', ' + p.bed) : 'Discharged'}</dd></div>
      <div><dt>Doctor</dt><dd>${esc(p.doctor)}</dd></div>
      <div><dt>Admitted</dt><dd>${fmtDate(p.admitted)}</dd></div>
      <div><dt>Phone</dt><dd>${esc(p.phone)}</dd></div>
    </dl>
    <p class="conds"><b>Conditions:</b> ${p.conditions.length ? p.conditions.map(esc).join(', ') : 'None recorded'}</p>
  </section>

  <section class="panel">
    <div class="panel-head"><h2>Observation chart</h2>
      ${canVitals && p.status === 'Admitted' ? `<button class="btn" data-act="addVital" data-v="${p.id}">Add temperature</button>` : ''}
      ${canVitals && p.status !== 'Admitted' ? '<small>Readings cannot be added after discharge.</small>' : ''}</div>
    ${v ? `<div class="vit"><div class="big ${tClass(v.temp)}">${v.temp.toFixed(1)}<small>°C</small></div>
      <div>${tTag(v.temp)}</div>
      <div class="vcell"><b>${v.pulse ?? '–'}</b><span>pulse, bpm</span></div>
      <div class="vcell"><b>${esc(v.bp || '–')}</b><span>blood pressure, mmHg</span></div>
      <div class="vcell"><b>${v.spo2 ? v.spo2 + '%' : '–'}</b><span>oxygen saturation</span></div></div>
      <p class="recorded">Latest reading recorded ${fmt(v.at)} by ${esc(v.by)}.</p>` : ''}
    ${chart(p.vitals)}
    ${p.vitals.length ? `<div class="tablewrap" style="margin-top:18px"><table><thead><tr><th>Time</th><th>Temperature</th><th>Pulse</th><th>BP</th><th>SpO₂</th><th>Recorded by</th><th>Note</th>${canVitals ? '<th></th>' : ''}</tr></thead><tbody>
    ${[...p.vitals].reverse().map(x => `<tr><td>${fmt(x.at)}</td><td>${tempHtml(x.temp)}</td><td>${x.pulse ?? '–'}</td><td>${esc(x.bp || '–')}</td><td>${x.spo2 ? x.spo2 + '%' : '–'}</td><td>${esc(x.by)}</td><td>${esc(x.note)}</td>
      ${canVitals ? `<td><button class="btn small line" data-act="editVital" data-v="${p.id}" data-i="${x.id}">Edit</button></td>` : ''}</tr>`).join('')}</tbody></table></div>` : ''}
  </section>

  <div class="cols">
    <section class="panel"><div class="panel-head"><h2>Medical history</h2>${role === 'doctor' ? `<button class="btn small" data-act="addHistory" data-v="${p.id}">Add entry</button>` : ''}</div>
      <div class="tl">${[...p.history].reverse().map(h => `<div class="it"><b>${esc(h.title)}</b><br><small>${fmtDate(h.at)}, ${esc(h.by)}</small><p>${esc(h.text)}</p></div>`).join('') || '<p class="empty">No history recorded.</p>'}</div></section>
    <div class="stack">
      <section class="panel"><div class="panel-head"><h2>Medications</h2>${role === 'doctor' ? `<button class="btn small" data-act="addMed" data-v="${p.id}">Prescribe</button>` : ''}</div>
        ${p.meds.length ? `<div class="tablewrap"><table><thead><tr><th>Medicine</th><th>Dose</th><th>How often</th></tr></thead><tbody>${p.meds.map(m => `<tr><td><b>${esc(m.name)}</b></td><td>${esc(m.dose)}</td><td>${esc(m.freq)}</td></tr>`).join('')}</tbody></table></div>` : '<p class="empty">No medications prescribed.</p>'}</section>
      <section class="panel"><div class="panel-head"><h2>Care notes</h2>${canNote ? `<button class="btn small line" data-act="addNote" data-v="${p.id}">Add note</button>` : ''}</div>
        ${p.notes.length ? p.notes.slice().reverse().map(n => `<div class="note"><small>${fmt(n.at)}, ${esc(n.by)}</small><p>${esc(n.text)}</p></div>`).join('') : `<p class="empty">${canNote ? 'No notes yet. Add one when something changes.' : 'No notes yet.'}</p>`}</section>
    </div>
  </div>`;
}

function staffView() {
  return `<div class="head"><h1>Staff</h1></div><section class="panel"><div class="tablewrap"><table><thead><tr><th>Name</th><th>Role</th><th>Department</th></tr></thead><tbody>
    ${STAFF.map(s => `<tr><td><b>${esc(s.name)}</b></td><td>${s.role}</td><td>${s.dept}</td></tr>`).join('')}</tbody></table></div></section>`;
}

/* ---------- workflow ---------- */
function workflowView() {
  const lane = (title, steps) => `<section class="panel"><h3>${title}</h3><ol class="steps">${steps.map(s => `<li><b>${s[0]}</b><span>${s[1]}</span></li>`).join('')}</ol></section>`;
  const back = me() ? '' : '<p style="margin-bottom:12px"><button class="linkbtn" data-act="view" data-v="login">Back to sign in</button></p>';
  return `${back}<div class="head"><div><h1>Workflow and screen designs</h1><p class="lede">How each role moves through the app, and the four main screens.</p></div></div>
  <div class="lanes">
    ${lane('Nurse: record a temperature', [['Sign in as a nurse', 'Choose the nurse role and enter your details.'], ['Open the ward board', 'Patients with a fever or low temperature are listed first.'], ['Open the patient', 'Check allergies, history and medications.'], ['Add temperature', 'Enter °C, with pulse, blood pressure and SpO₂ if taken.'], ['Check the chart', 'The new reading appears on the chart. Fever is marked in red.'], ['Correct a mistake', 'Edit any reading from the log.']])}
    ${lane('Doctor: review and treat', [['Sign in as a doctor', 'Choose the doctor role.'], ['Open your patients', 'Only patients assigned to you are shown.'], ['Review the chart', 'Read the temperature trend and the history.'], ['Add a history entry', 'Record a diagnosis or progress update.'], ['Prescribe', 'Add a medicine to the patient’s list.']])}
    ${lane('Patient: view your record', [['Sign in as a patient', 'Choose the patient role.'], ['See your record', 'Only your own record is shown, read-only.'], ['Check vitals and medicines', 'Temperature chart, history and prescriptions.']])}
    ${lane('Admin: manage admissions', [['Sign in as an admin', 'Choose the hospital admin role.'], ['Open the overview', 'See admitted and discharged counts and alerts.'], ['Admit a patient', 'Create the record and assign ward, bed and doctor.'], ['Discharge', 'Close the admission from the patient’s record.'], ['Check staff', 'See doctors and nurses by department.']])}
  </div>
  <section class="panel"><h3>Screen designs</h3>
    <div class="wires">
      <div class="wire"><h4>Sign in</h4><i class="b"></i><i class="m"></i><i class="s"></i><i class="k"></i><p>Role list, username, password. Sample chart on the left.</p></div>
      <div class="wire"><h4>Ward board</h4><i class="m"></i><i class="r"></i><i></i><i></i><p>Summary line, attention list, patient table with trend.</p></div>
      <div class="wire"><h4>Patient record</h4><i class="r s"></i><i class="m"></i><i class="b"></i><i></i><i class="s"></i><p>Allergy bar, patient details, chart, log, history, medicines.</p></div>
      <div class="wire"><h4>Add temperature</h4><i class="k"></i><i></i><i></i><i class="m"></i><p>Temperature, optional pulse, BP, SpO₂ and note.</p></div>
    </div></section>`;
}

/* ---------- forms ---------- */
function modal(html) {
  $('#modal-root').innerHTML = `<div class="overlay" data-act="closeOv"><div class="modal" role="dialog" aria-modal="true">${html}</div></div>`;
  const f = $('#modal-root input, #modal-root textarea'); if (f) f.focus();
}
function closeModal() { $('#modal-root').innerHTML = ''; }
const actions = label => `<div class="actions"><button type="button" class="btn line" data-act="closeModal">Cancel</button><button class="btn">${label}</button></div>`;

function vitalForm(pid, vid) {
  const p = pat(pid), x = vid ? p.vitals.find(v => v.id == vid) : {};
  modal(`<h3>${vid ? 'Edit reading' : 'Add temperature'}</h3><p class="muted">${esc(p.name)}, bed ${esc(p.bed)}</p>
    <form id="vitalForm" data-pid="${pid}" data-vid="${vid || ''}">
    <label for="f-temp">Temperature, °C</label><input id="f-temp" name="temp" type="number" step="0.1" min="30" max="45" required inputmode="decimal" value="${x.temp ?? ''}">
    <div class="two"><div><label for="f-pulse">Pulse, bpm (optional)</label><input id="f-pulse" name="pulse" type="number" value="${x.pulse ?? ''}"></div>
    <div><label for="f-spo2">SpO₂, % (optional)</label><input id="f-spo2" name="spo2" type="number" max="100" value="${x.spo2 ?? ''}"></div></div>
    <label for="f-bp">Blood pressure (optional)</label><input id="f-bp" name="bp" placeholder="120/80" value="${esc(x.bp || '')}">
    <label for="f-note">Note (optional)</label><textarea id="f-note" name="note" rows="2">${esc(x.note || '')}</textarea>
    ${actions('Save reading')}</form>`);
}
function textForm(kind, pid) {
  const cfg = {
    history: ['Add history entry', `<label for="f-a">Title</label><input id="f-a" name="a" required placeholder="For example, diagnosis or progress update"><label for="f-b">Details</label><textarea id="f-b" name="b" rows="3" required></textarea>`, 'Save entry'],
    med: ['Prescribe a medicine', `<label for="f-a">Medicine</label><input id="f-a" name="a" required><div class="two"><div><label for="f-b">Dose</label><input id="f-b" name="b" placeholder="500 mg"></div><div><label for="f-c">How often</label><input id="f-c" name="c" placeholder="Twice daily"></div></div>`, 'Prescribe'],
    note: ['Add care note', `<label for="f-a">Note</label><textarea id="f-a" name="a" rows="3" required></textarea>`, 'Save note']
  }[kind];
  modal(`<h3>${cfg[0]}</h3><form id="textForm" data-kind="${kind}" data-pid="${pid}">${cfg[1]}${actions(cfg[2])}</form>`);
}
function admitForm() {
  modal(`<h3>Admit patient</h3><form id="admitForm">
    <label for="a-name">Full name</label><input id="a-name" name="name" required>
    <div class="two"><div><label for="a-age">Age</label><input id="a-age" name="age" type="number" required></div><div><label for="a-g">Sex</label><select id="a-g" name="gender"><option>Male</option><option>Female</option><option>Other</option></select></div></div>
    <div class="two"><div><label for="a-bl">Blood group (optional)</label><input id="a-bl" name="blood" placeholder="O+"></div><div><label for="a-ph">Phone (optional)</label><input id="a-ph" name="phone"></div></div>
    <div class="two"><div><label for="a-w">Ward</label><select id="a-w" name="ward"><option>Ward A</option><option>Ward B</option></select></div><div><label for="a-b">Bed</label><input id="a-b" name="bed" placeholder="A-20" required></div></div>
    <label for="a-d">Doctor</label><select id="a-d" name="doctor">${STAFF.filter(s => s.role === 'Doctor').map(s => `<option>${s.name}</option>`).join('')}</select>
    <label for="a-al">Allergies, separated by commas (optional)</label><input id="a-al" name="allergies">
    <label for="a-c">Conditions, separated by commas (optional)</label><input id="a-c" name="conditions">
    ${actions('Admit patient')}</form>`);
}

/* ---------- render ---------- */
function render() {
  const app = $('#app');
  if (!me()) { app.innerHTML = S.view === 'workflow' ? `<main class="page">${workflowView()}</main>` : loginView(); return; }
  let c;
  switch (S.view) {
    case 'patients': c = patientsView(); break;
    case 'patient': c = patientDetail(pat(S.pid)); break;
    case 'mine': c = patientDetail(pat(me().patientId)); break;
    case 'staff': c = staffView(); break;
    case 'workflow': c = workflowView(); break;
    default: c = dashView();
  }
  app.innerHTML = shell(c);
  const s = $('#search');
  if (s) s.oninput = e => { S.search = e.target.value; const pos = e.target.selectionStart; render(); const n = $('#search'); n.focus(); n.setSelectionRange(pos, pos); };
}

/* ---------- events ---------- */
document.addEventListener('click', e => {
  const t = e.target.closest('[data-act]'); if (!t) return;
  const a = t.dataset.act, v = t.dataset.v;
  if (a === 'closeOv') { if (e.target === t) closeModal(); return; }
  if (a === 'closeModal') return closeModal();
  if (a === 'role') { S.selRole = v; S.loginErr = ''; return render(); }
  if (a === 'view') return go(v);
  if (a === 'logout') { S.session = null; S.view = 'login'; return render(); }
  if (a === 'open') return go('patient', v);
  if (a === 'addVital') return vitalForm(v);
  if (a === 'editVital') return vitalForm(v, t.dataset.i);
  if (a === 'addHistory') return textForm('history', v);
  if (a === 'addMed') return textForm('med', v);
  if (a === 'addNote') return textForm('note', v);
  if (a === 'addPatient') return admitForm();
  if (a === 'toggleStatus') { const p = pat(v); p.status = p.status === 'Admitted' ? 'Discharged' : 'Admitted'; save(); toast(p.status === 'Admitted' ? 'Patient re-admitted' : 'Patient discharged'); render(); }
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal();
  if (e.key === 'Enter') { const r = e.target.closest && e.target.closest('tr[data-act="open"]'); if (r) go('patient', r.dataset.v); }
});

document.addEventListener('submit', e => {
  e.preventDefault();
  const f = e.target, d = Object.fromEntries(new FormData(f));
  if (f.id === 'loginForm') {
    const u = USERS.find(x => x.user === $('#u').value.trim() && x.pass === $('#p').value && x.role === S.selRole);
    if (!u) { S.loginErr = `That username and password do not match a ${ROLES[S.selRole].label.toLowerCase()} account. Check the role you selected.`; return render(); }
    S.session = u; S.loginErr = ''; return go(u.role === 'patient' ? 'mine' : 'dash');
  }
  if (f.id === 'vitalForm') {
    const p = pat(f.dataset.pid), vid = f.dataset.vid;
    const temp = parseFloat(d.temp);
    if (isNaN(temp) || temp < 30 || temp > 45) return toast('Enter a temperature between 30 and 45 °C.');
    const rec = { temp, pulse: d.pulse ? +d.pulse : null, spo2: d.spo2 ? +d.spo2 : null, bp: d.bp, note: d.note };
    if (vid) Object.assign(p.vitals.find(v => v.id == vid), rec, { by: me().name + ' (edited)' });
    else p.vitals.push({ id: Date.now(), at: new Date().toISOString(), by: me().name, ...rec });
    save(); closeModal();
    toast(temp >= 38 ? `${temp.toFixed(1)} °C saved. Tell the doctor.` : vid ? 'Reading updated' : 'Reading saved');
    return render();
  }
  if (f.id === 'textForm') {
    const p = pat(f.dataset.pid), k = f.dataset.kind, now = new Date().toISOString();
    if (k === 'history') p.history.push({ at: now, by: me().name, title: d.a, text: d.b });
    if (k === 'med') p.meds.push({ name: d.a, dose: d.b || '–', freq: d.c || '–' });
    if (k === 'note') p.notes.push({ at: now, by: me().name, text: d.a });
    save(); closeModal(); toast({ history: 'Entry saved', med: 'Medicine prescribed', note: 'Note saved' }[k]); return render();
  }
  if (f.id === 'admitForm') {
    const id = 'P-' + DB.nextPid++, split = s => s.split(',').map(x => x.trim()).filter(Boolean);
    const al = split(d.allergies || '');
    DB.patients.push({ id, name: d.name, age: +d.age, gender: d.gender, blood: d.blood || '–', phone: d.phone || '–', ward: d.ward, bed: d.bed, doctor: d.doctor,
      status: 'Admitted', admitted: new Date().toISOString(), allergies: al.length ? al : ['None known'], conditions: split(d.conditions || ''),
      vitals: [], history: [{ at: new Date().toISOString(), by: me().name, title: 'Admitted', text: `Admitted to ${d.ward}, bed ${d.bed}.` }], meds: [], notes: [] });
    save(); closeModal(); toast(`${d.name} admitted as ${id}`); return render();
  }
});

render();
