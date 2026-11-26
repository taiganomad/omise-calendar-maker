(() => {
  'use strict';

  const JP_DAYS = ['日', '月', '火', '水', '木', '金', '土'];
  const EN_DAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  const TEXT_SCALES = { small: .84, 'medium-small': .92, standard: 1, large: 1.1, xlarge: 1.2 };
  const DAY_TEXT_SCALES = { small: .8, 'medium-small': .9, standard: 1, large: 1.15, xlarge: 1.3 };
  const DAY_POSITIONS = {
    'top-left': { x: .24, y: .34 }, top: { x: .5, y: .34 }, 'top-right': { x: .76, y: .34 },
    left: { x: .24, y: .56 }, center: { x: .5, y: .56 }, right: { x: .76, y: .56 },
    'bottom-left': { x: .24, y: .8 }, bottom: { x: .5, y: .8 }, 'bottom-right': { x: .76, y: .8 }
  };
  const STATUSES = {
    open: { name: 'ランチ・ディナー', text: 'ランチ\nディナー' },
    lunch: { name: 'ランチ', text: 'ランチ' },
    'lunch-only': { name: 'ランチのみ', text: 'ランチのみ' },
    dinner: { name: 'ディナー', text: 'ディナー' },
    'bar-service': { name: 'バル', text: 'バル' },
    bar: { name: 'バルのみ', text: 'バルのみ' },
    closed: { name: '休み', text: '休み' },
    circle: { name: '○', text: '', mark: '○' },
    cross: { name: '✖️', text: '', mark: '✖️' },
    'special-service': { name: '特別営業', text: '特別営業' },
    event: { name: 'イベント', text: 'イベント' },
    'event-shop-closed': { name: 'イベント出店 店舗休み', text: 'イベント出店\n店舗休み' }
  };
  const STATUS_MARKS = ['○', '✖️', '△', '◎', '★'];
  const THEMES = {
    warm: { name: 'クラフト', note: '参考画像に近い温かさ', bg: '#efe0ca', paper: '#f6ead7', ink: '#5a3829', accent: '#d84f30', accent2: '#f0b733', muted: '#a98d74', line: '#785442', dark: false, texture: true },
    noir: { name: 'ビストロ・ノワール', note: '夜営業・ワイン向け', bg: '#11100f', paper: '#191817', ink: '#f4efe5', accent: '#dc5d45', accent2: '#d7ae62', muted: '#817a70', line: '#514a43', dark: true },
    mint: { name: 'ハーブガーデン', note: 'カフェ・自然派に', bg: '#e8f1e7', paper: '#f8fbf5', ink: '#234338', accent: '#e56c4e', accent2: '#deaa45', muted: '#98aa9d', line: '#789288', dark: false },
    pink: { name: 'デザート・ピンク', note: 'スイーツ・季節限定に', bg: '#ffe8e7', paper: '#fff9f5', ink: '#603838', accent: '#e54b65', accent2: '#f1b34a', muted: '#c7a1a1', line: '#b8767f', dark: false }
  };
  const BACKGROUNDS = {
    simple: { name: 'シンプル', note: '背景画像なし', src: null },
    auto: { name: '月ごとに自動選択', note: '選択月に合わせて切替', src: 'assets/month-09-vietnam-cafe.png' },
    'month-01': { name: '1月', note: 'テト・梅・ランタン', src: 'assets/month-01-vietnam-cafe.png' },
    'month-02': { name: '2月', note: '紅梅と真鍮', src: 'assets/month-02-vietnam-cafe.png' },
    'month-03': { name: '3月', note: '蓮と竹', src: 'assets/month-03-vietnam-cafe.png' },
    'month-04': { name: '4月', note: 'ブーゲンビリア', src: 'assets/month-04-vietnam-cafe.png' },
    'month-05': { name: '5月', note: '熱帯植物と籐', src: 'assets/month-05-vietnam-cafe.png' },
    'month-06': { name: '6月', note: '雨季と藍色', src: 'assets/month-06-vietnam-cafe.png' },
    'month-07': { name: '7月', note: '南国とカフェスアダー', src: 'assets/month-07-vietnam-cafe.png' },
    'month-08': { name: '8月', note: 'ホイアンのランタン', src: 'assets/month-08-vietnam-cafe.png' },
    'month-09': { name: '9月', note: '中秋節と満月', src: 'assets/month-09-vietnam-cafe.png' },
    'month-10': { name: '10月', note: '珈琲とシナモン', src: 'assets/month-10-vietnam-cafe.png' },
    'month-11': { name: '11月', note: 'インドシナ様式', src: 'assets/month-11-vietnam-cafe.png' },
    'month-12': { name: '12月', note: '深緑と漆赤', src: 'assets/month-12-vietnam-cafe.png' }
  };
  const DEFAULTS = {
    dataVersion: 7,
    year: 2026, month: 9, range: 'month', specialStart: '2026-12-27', specialEnd: '2027-01-05',
    closedWeekdays: [2, 3, 4], days: {}, statusPresets: {}, shopName: '静庵 (Shizuka-An)', badgeText: '',
    noticeText: 'ご予約・お問い合わせは公式LINEまたはお電話からお願いいたします。', phoneText: '0772-45-1944',
    reserveText: 'ランチ・ディナーともに要予約', hoursText: '11:30-15:00(l.o.14:00)\n18:00-21:30(l.o.20:30)要予約',
    cautionText: 'バルタイムのご予約は前日までにお願いします',
    theme: 'warm', background: 'auto', format: 'portrait', textSize: 'standard', showAdjacent: true,
    logo: 'assets/shizukaan-logo.png', qr: 'assets/shizukaan-line-qr.png'
  };
  const STORAGE_KEY = 'shop-calendar-state';
  const BACKUP_FORMAT = 'omise-calendar-maker';
  let state = loadState();
  let zoom = .52;
  let selectedDay = null;
  let logoImage = null;
  let qrImage = null;
  const seasonImages = {};
  let renderTimer = 0;
  let canvasHitAreas = [];
  let dragState = null;
  const $ = id => document.getElementById(id);
  const canvas = $('calendarCanvas');
  const ctx = canvas.getContext('2d');

  function loadState() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      const migrated = { ...DEFAULTS, ...saved };
      if ((saved.dataVersion || 0) < 4) {
        if (!saved.shopName || saved.shopName === 'BISTRO CALME') migrated.shopName = DEFAULTS.shopName;
        if (!saved.badgeText || ['今月の営業日','9月の営業日'].includes(saved.badgeText)) migrated.badgeText = '';
        if (!saved.hoursText || saved.hoursText.includes('LUNCH')) migrated.hoursText = DEFAULTS.hoursText;
        if (!saved.logo) migrated.logo = DEFAULTS.logo;
        if (!saved.qr) migrated.qr = DEFAULTS.qr;
        migrated.background = DEFAULTS.background;
        migrated.cautionText = DEFAULTS.cautionText;
      }
      if ((saved.dataVersion || 0) < 5) {
        if (!['simple','auto'].includes(saved.background)) migrated.background = 'auto';
        migrated.dataVersion = 5;
      }
      if ((saved.dataVersion || 0) < 6) {
        const weekly = Array.isArray(migrated.closedWeekdays) ? migrated.closedWeekdays : [];
        const days = { ...(migrated.days || {}) };
        Object.entries(days).forEach(([key,item]) => {
          const d = parseKey(key);
          if (item.status === 'closed' && !item.label && weekly.includes(d.getDay())) delete days[key];
        });
        migrated.days = days;
        migrated.textSize = TEXT_SCALES[saved.textSize] ? saved.textSize : 'standard';
        migrated.dataVersion = 6;
      }
      if (!TEXT_SCALES[migrated.textSize]) migrated.textSize = 'standard';
      return migrated;
    }
    catch { return { ...DEFAULTS }; }
  }
  function saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    $('saveState').textContent = '保存しました';
    setTimeout(() => $('saveState').textContent = 'この端末に自動保存', 900);
  }
  function dateKey(d) { return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; }
  function parseKey(k) { const [y,m,d] = k.split('-').map(Number); return new Date(y,m-1,d); }
  function daysInMonth(y,m) { return new Date(y,m,0).getDate(); }
  function getDayState(key) {
    const d = parseKey(key);
    return { status: state.closedWeekdays.includes(d.getDay()) ? 'closed' : 'open', label: '', statusSize: 'standard', labelSize: 'standard', statusPos: null, labelPos: null, ...(state.days[key] || {}) };
  }
  function updateDayState(key, value) {
    state.days[key] = { ...state.days[key], ...value };
    saveState();
    scheduleRender();
  }
  function setDayState(key, value) { updateDayState(key, value); renderDayEditor(); }
  function escapeHtml(s='') { return s.replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c])); }
  function toast(message) { const el = $('toast'); el.textContent = message; el.classList.add('show'); clearTimeout(el.t); el.t = setTimeout(() => el.classList.remove('show'), 2300); }

  function exportBackup() {
    const backup = { format: BACKUP_FORMAT, version: 1, state };
    const url = URL.createObjectURL(new Blob([JSON.stringify(backup)], { type: 'application/json' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = `omise-calendar-backup-${dateKey(new Date())}.json`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function validateBackup(backup) {
    const isRecord = value => value !== null && typeof value === 'object' && !Array.isArray(value);
    const isInteger = (value, min, max) => Number.isInteger(value) && value >= min && value <= max;
    const isDate = value => typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) && dateKey(parseKey(value)) === value;
    const isPosition = value => value == null || (isRecord(value) && ['x', 'y'].every(axis =>
      typeof value[axis] === 'number' && value[axis] >= 0 && value[axis] <= 1));
    const isImage = (value, fallback) => value === fallback ||
      (typeof value === 'string' && /^data:image\/[a-z0-9.+-]+;base64,/i.test(value));
    const validates = (record, fields) => isRecord(record) && Object.entries(record).every(([key, value]) =>
      Object.hasOwn(fields, key) && fields[key](value));
    const isText = value => typeof value === 'string';
    const optionalText = value => value == null || isText(value);
    const isSize = value => Object.hasOwn(DAY_TEXT_SCALES, value);
    const saved = backup?.state;
    if (backup?.format !== BACKUP_FORMAT || backup.version !== 1 || !isRecord(saved) ||
        !isInteger(saved.dataVersion, 6, DEFAULTS.dataVersion) ||
        !isInteger(saved.year, 2020, 2100) || !isInteger(saved.month, 1, 12) ||
        !['month', 'second', 'special'].includes(saved.range) ||
        ![saved.specialStart, saved.specialEnd].every(value => value === '' || isDate(value)) ||
        !['portrait', 'square'].includes(saved.format) || !Object.hasOwn(THEMES, saved.theme) ||
        !Object.hasOwn(BACKGROUNDS, saved.background) || !Object.hasOwn(TEXT_SCALES, saved.textSize) ||
        typeof saved.showAdjacent !== 'boolean' || !Array.isArray(saved.closedWeekdays) ||
        !saved.closedWeekdays.every(day => isInteger(day, 0, 6)) ||
        !['shopName', 'badgeText', 'noticeText', 'phoneText', 'reserveText', 'hoursText', 'cautionText']
          .every(key => isText(saved[key])) ||
        !isImage(saved.logo, DEFAULTS.logo) || !isImage(saved.qr, DEFAULTS.qr)) {
      throw new Error('Invalid backup settings');
    }
    const dayFields = {
      status: value => Object.hasOwn(STATUSES, value), label: isText,
      statusText: optionalText, statusMark: optionalText,
      statusSize: isSize, labelSize: isSize, statusPos: isPosition, labelPos: isPosition
    };
    if (!isRecord(saved.days) || !Object.entries(saved.days).every(([date, day]) =>
      isDate(date) && validates(day, dayFields))) {
      throw new Error('Invalid backup dates');
    }
    if (!isRecord(saved.statusPresets) || !Object.entries(saved.statusPresets).every(([key, preset]) =>
      Object.hasOwn(STATUSES, key) && validates(preset, { text: isText, mark: isText }))) {
      throw new Error('Invalid backup statuses');
    }
    return Object.fromEntries(Object.keys(DEFAULTS).map(key => [key, saved[key]]));
  }

  async function importBackup(file) {
    let restored;
    try {
      if (file.size > 16 * 1024 * 1024) throw new Error('Backup too large');
      restored = validateBackup(JSON.parse(await file.text()));
    } catch {
      toast('バックアップを読み込めません。このアプリで保存したファイルを選んでください。');
      return;
    }
    if (!window.confirm('このブラウザの入力内容を、バックアップの内容に置き換えますか？')) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(restored));
    } catch {
      toast('ブラウザに保存できませんでした。空き容量を確認してください。');
      return;
    }
    location.reload();
  }

  function init() {
    for (let m=1; m<=12; m++) $('monthInput').add(new Option(`${m}月`, m));
    $('yearInput').value = state.year; $('monthInput').value = state.month;
    $('specialStart').value = state.specialStart; $('specialEnd').value = state.specialEnd;
    ['shopName','badgeText','noticeText','phoneText','reserveText','hoursText','cautionText'].forEach(id => $(id).value = state[id]);
    $('showAdjacent').checked = state.showAdjacent;
    $('presetStatus').innerHTML = statusOptions('open', false);
    renderPresetFields(); renderStatusLegend();
    renderWeekdayButtons(); renderThemes(); renderBackgrounds(); bindEvents(); syncTabs(); renderDayEditor(); loadStoredImages(); loadSeasonImages(); applyZoom(); render();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(render);
  }

  function bindEvents() {
    $('exportBackupBtn').addEventListener('click', exportBackup);
    $('importBackupBtn').addEventListener('click', () => $('backupFile').click());
    $('backupFile').addEventListener('change', e => {
      const [file] = e.target.files;
      e.target.value = '';
      if (file) void importBackup(file);
    });
    $('presetStatus').addEventListener('change', renderPresetFields);
    document.querySelectorAll('.step-tab').forEach(btn => btn.addEventListener('click', () => {
      document.querySelectorAll('.step-tab,.pane').forEach(el => el.classList.remove('active'));
      btn.classList.add('active'); $(`pane-${btn.dataset.pane}`).classList.add('active');
    }));
    $('yearInput').addEventListener('change', e => updateMonth(+e.target.value, state.month));
    $('monthInput').addEventListener('change', e => updateMonth(state.year, +e.target.value));
    $('todayBtn').addEventListener('click', () => { const d=new Date(); updateMonth(d.getFullYear(),d.getMonth()+1); });
    $('rangeTabs').addEventListener('click', e => { if(!e.target.dataset.range) return; state.range=e.target.dataset.range; saveState(); syncTabs(); renderDayEditor(); scheduleRender(); });
    ['specialStart','specialEnd'].forEach(id => $(id).addEventListener('change', e => { state[id]=e.target.value; saveState(); renderDayEditor(); scheduleRender(); }));
    ['shopName','badgeText','noticeText','phoneText','reserveText','hoursText','cautionText'].forEach(id => $(id).addEventListener('input', e => { state[id]=e.target.value; saveState(); scheduleRender(); }));
    $('formatTabs').addEventListener('click', e => { if(!e.target.dataset.format) return; state.format=e.target.dataset.format; saveState(); syncTabs(); resizeCanvas(); applyZoom(); render(); });
    $('textSizeTabs').addEventListener('click', e => { const size=e.target.dataset.textSize; if(!TEXT_SCALES[size])return; state.textSize=size; saveState(); syncTabs(); scheduleRender(); });
    $('showAdjacent').addEventListener('change', e => { state.showAdjacent=e.target.checked; saveState(); scheduleRender(); });
    $('logoInput').addEventListener('change', e => readImage(e.target.files[0], 'logo'));
    $('qrInput').addEventListener('change', e => readImage(e.target.files[0], 'qr'));
    $('downloadBtn').addEventListener('click', downloadCurrent);
    $('downloadAllBtn').addEventListener('click', downloadAllThemes);
    $('downloadPdfBtn').addEventListener('click', downloadPdf);
    $('zoomOut').addEventListener('click', () => { zoom=Math.max(.28,zoom-.06); applyZoom(); });
    $('zoomIn').addEventListener('click', () => { zoom=Math.min(.82,zoom+.06); applyZoom(); });
    canvas.addEventListener('pointerdown', startCanvasDrag);
    canvas.addEventListener('pointermove', moveCanvasDrag);
    canvas.addEventListener('pointerup', endCanvasDrag);
    canvas.addEventListener('pointercancel', endCanvasDrag);
    $('resetBtn').addEventListener('click', () => { localStorage.removeItem(STORAGE_KEY); location.reload(); });
    window.addEventListener('resize', fitZoom);
  }

  function updateMonth(year, month) {
    state.year = Math.min(2100,Math.max(2020,year||new Date().getFullYear())); state.month=month;
    $('yearInput').value=state.year; $('monthInput').value=state.month;
    if(state.range==='special') { state.specialStart=`${state.year}-${String(state.month).padStart(2,'0')}-01`; state.specialEnd=`${state.year}-${String(state.month).padStart(2,'0')}-${String(daysInMonth(state.year,state.month)).padStart(2,'0')}`; $('specialStart').value=state.specialStart; $('specialEnd').value=state.specialEnd; }
    saveState(); renderBackgrounds(); renderDayEditor(); scheduleRender();
  }
  function syncTabs() {
    document.querySelectorAll('#rangeTabs button').forEach(b => b.classList.toggle('active',b.dataset.range===state.range));
    document.querySelectorAll('#formatTabs button').forEach(b => b.classList.toggle('active',b.dataset.format===state.format));
    document.querySelectorAll('#textSizeTabs button').forEach(b => { const active=b.dataset.textSize===state.textSize;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active)); });
    $('specialDates').classList.toggle('hidden',state.range!=='special');
    $('previewTitle').textContent = state.format==='portrait' ? 'Instagram 縦長' : 'Instagram 正方形';
  }
  function renderWeekdayButtons() {
    $('weekdayButtons').innerHTML = JP_DAYS.map((d,i)=>`<button type="button" data-day="${i}" class="${state.closedWeekdays.includes(i)?'active':''}">${d}</button>`).join('');
    $('weekdayButtons').onclick = e => { if(e.target.dataset.day===undefined)return; const n=+e.target.dataset.day; state.closedWeekdays=state.closedWeekdays.includes(n)?state.closedWeekdays.filter(x=>x!==n):[...state.closedWeekdays,n]; saveState(); renderWeekdayButtons(); renderDayEditor(); scheduleRender(); };
  }
  function renderThemes() {
    $('themeGrid').innerHTML = Object.entries(THEMES).map(([key,t])=>`<button class="theme-card ${state.theme===key?'active':''}" data-theme="${key}" type="button"><span class="theme-swatch"><i style="background:${t.bg}"></i><i style="background:${t.ink}"></i><i style="background:${t.accent}"></i></span><strong>${t.name}</strong><small>${t.note}</small></button>`).join('');
    $('themeGrid').onclick = e => { const btn=e.target.closest('[data-theme]'); if(!btn)return; state.theme=btn.dataset.theme; saveState(); renderThemes(); scheduleRender(); };
  }
  function renderBackgrounds() {
    $('backgroundGrid').innerHTML = Object.entries(BACKGROUNDS).map(([key,b]) => {
      const preview = key === 'simple' ? '<span class="background-preview simple"></span>' : `<img src="${key === 'auto' ? monthlyBackgroundSource() : b.src}" alt="">`;
      return `<button class="background-card ${state.background===key?'active':''}" data-background="${key}" type="button">${preview}<strong>${b.name}</strong><small>${b.note}</small></button>`;
    }).join('');
    $('backgroundGrid').onclick = e => { const btn=e.target.closest('[data-background]'); if(!btn)return; state.background=btn.dataset.background; saveState(); renderBackgrounds(); scheduleRender(); };
  }
  function backgroundForMonth(month=state.month) { return `month-${String(month).padStart(2,'0')}`; }
  function monthlyBackgroundSource() { return BACKGROUNDS[backgroundForMonth()].src; }
  function resolvedBackground() { return state.background==='auto'?backgroundForMonth():state.background; }
  function visibleDates() {
    if(state.range==='special') {
      let s=parseKey(state.specialStart), e=parseKey(state.specialEnd); if(isNaN(s)||isNaN(e)||s>e) return [];
      const out=[]; for(let d=new Date(s);d<=e;d.setDate(d.getDate()+1))out.push(new Date(d)); return out.slice(0,42);
    }
    const start=state.range==='second'?16:1, end=daysInMonth(state.year,state.month), out=[];
    for(let d=start;d<=end;d++)out.push(new Date(state.year,state.month-1,d)); return out;
  }
  function statusAppearance(day) {
    const preset = state.statusPresets[day.status];
    return {
      text: day.statusText ?? preset?.text ?? STATUSES[day.status]?.text ?? '営業',
      mark: day.statusMark ?? preset?.mark ?? STATUSES[day.status]?.mark ?? ''
    };
  }
  function statusDisplay(day) {
    const { text, mark } = statusAppearance(day);
    return [mark.trim(), text.trim()].filter(Boolean).join(' ');
  }
  function statusOptions(selected, useCustomNames = true) {
    return Object.entries(STATUSES).map(([key, { name, text }]) => {
      const display = statusDisplay({ status: key });
      const label = useCustomNames && display && display !== text && display !== name
        ? `${display.replace(/\s+/g, ' ')}（${name}）` : name;
      return `<option value="${key}" ${selected === key ? 'selected' : ''}>${escapeHtml(label)}</option>`;
    }).join('');
  }
  function renderStatusLegend() {
    $('statusLegend').innerHTML = Object.entries(STATUSES).map(([key, { name, text }]) => {
      const display = statusDisplay({ status: key });
      const label = display === text ? name : display.replace(/\s+/g, ' ');
      return label ? `<span><i class="dot ${key}"></i>${escapeHtml(label)}</span>` : '';
    }).join('');
  }
  function statusFields(prefix, { text, mark }, resetLabel) {
    return `<div class="status-fields">
      <label>表示文言<textarea id="${prefix}Text" rows="2" maxlength="40" placeholder="例：昼営業（改行可）">${escapeHtml(text)}</textarea></label>
      <label>記号<input type="text" id="${prefix}Mark" maxlength="12" value="${escapeHtml(mark)}" placeholder="例：○"></label>
      <div id="${prefix}Marks" class="mark-choices" role="group" aria-label="記号を選ぶ">
        ${STATUS_MARKS.map(mark => `<button type="button" data-mark="${mark}" aria-label="${mark}を入れる">${mark}</button>`).join('')}
        <button type="button" data-mark="">記号なし</button>
      </div>
      <button type="button" id="${prefix}Reset" class="layout-reset">${resetLabel}</button>
    </div>`;
  }
  function bindStatusFields(prefix, update, reset) {
    const textField = $(`${prefix}Text`);
    const markField = $(`${prefix}Mark`);
    textField.oninput = () => update('text', textField.value);
    markField.oninput = () => update('mark', markField.value);
    $(`${prefix}Marks`).onclick = e => {
      const button = e.target.closest('button[data-mark]');
      if (!button) return;
      markField.value = button.dataset.mark;
      update('mark', markField.value);
    };
    $(`${prefix}Reset`).onclick = reset;
  }
  function renderPresetFields() {
    const status = $('presetStatus').value;
    $('presetFields').innerHTML = statusFields('preset', statusAppearance({ status }), 'この営業区分の初期設定に戻す');
    function applyPreset() {
      saveState();
      renderStatusLegend();
      renderDayEditor();
      scheduleRender();
    }
    bindStatusFields('preset', (field, value) => {
      state.statusPresets[status] = { ...state.statusPresets[status], [field]: value };
      applyPreset();
    }, () => {
      delete state.statusPresets[status];
      const appearance = statusAppearance({ status });
      $('presetText').value = appearance.text;
      $('presetMark').value = appearance.mark;
      applyPreset();
    });
  }
  function renderDayEditor() {
    const dates = visibleDates();
    $('editMonthLabel').textContent = state.range === 'special' ? '最大42日' : `${state.year}年${state.month}月`;
    $('dayEditor').innerHTML = dates.map(date => {
      const key = dateKey(date);
      const day = getDayState(key);
      const weekday = date.getDay();
      return `<button type="button" class="day-card ${selectedDay === key ? 'selected' : ''}" data-key="${key}" data-status="${escapeHtml(day.status)}">
        <strong class="${weekday === 0 ? 'sun' : weekday === 6 ? 'sat' : ''}">${date.getDate()}<small>${JP_DAYS[weekday]}</small></strong>
        <small class="day-card-status">${escapeHtml(statusDisplay(day))}</small>
        <small class="day-card-comment" ${day.label ? '' : 'hidden'}>${escapeHtml(day.label)}</small>
      </button>`;
    }).join('') + (dates.some(date => dateKey(date) === selectedDay) ? eventEditorHtml() : '');
    $('dayEditor').onclick = e => {
      const button = e.target.closest('.day-card');
      if (!button) return;
      selectedDay = button.dataset.key;
      renderDayEditor();
      scheduleRender();
    };
    if (!$('selectedStatus')) return;
    const key = selectedDay;
    const card = document.querySelector(`.day-card[data-key="${key}"]`);
    $('selectedStatus').onchange = e => setDayState(key, { status: e.target.value, statusText: null, statusMark: null });
    $('selectedLabel').oninput = e => {
      const label = e.target.value;
      updateDayState(key, { label });
      const comment = card.querySelector('.day-card-comment');
      comment.textContent = label;
      comment.hidden = !label;
    };
    bindStatusFields('dayStatus', (field, value) => {
      updateDayState(key, { [field === 'text' ? 'statusText' : 'statusMark']: value });
      card.querySelector('.day-card-status').textContent = statusDisplay(getDayState(key));
    }, () => {
      updateDayState(key, { statusText: null, statusMark: null });
      const day = getDayState(key);
      const appearance = statusAppearance(day);
      $('dayStatusText').value = appearance.text;
      $('dayStatusMark').value = appearance.mark;
      card.querySelector('.day-card-status').textContent = statusDisplay(day);
    });
    bindDayLayoutControl('statusPosition','statusPos'); bindDayLayoutControl('labelPosition','labelPos');
    bindDaySizeControl('statusSize'); bindDaySizeControl('labelSize');
    $('resetDayLayout').onclick = () => setDayState(key, { statusPos: null, labelPos: null, statusSize: 'standard', labelSize: 'standard' });
  }
  function eventEditorHtml() {
    const day = getDayState(selectedDay);
    const date = parseKey(selectedDay);
    return `<div class="event-editor">
      <strong class="day-edit-date">${date.getMonth() + 1}月${date.getDate()}日（${JP_DAYS[date.getDay()]}）の設定</strong>
      <div class="day-edit-main">
        <label>営業区分<select id="selectedStatus">${statusOptions(day.status)}</select></label>
        <label>コメント<textarea id="selectedLabel" rows="3" maxlength="60" placeholder="例：周年イベント&#10;夜のみ営業">${escapeHtml(day.label)}</textarea></label>
      </div>
      <fieldset class="day-status-fields"><legend>この日だけ表示を変更</legend>
        <p class="hint">表示文言を空にすると、記号だけ表示できます。</p>
        ${statusFields('dayStatus', statusAppearance(day), '共通設定に戻す')}
      </fieldset>
      <p class="drag-hint">プレビューの青い枠をドラッグして、文字を好きな位置へ動かせます。</p>
      <div class="day-layout-grid">
        ${layoutControls('営業区分','status',day.statusPos,day.label?'top':'center',day.statusSize)}
        ${layoutControls('コメント','label',day.labelPos,'bottom',day.labelSize)}
      </div>
      <button type="button" class="layout-reset" id="resetDayLayout">位置と大きさを元に戻す</button>
    </div>`;
  }
  function layoutControls(title,prefix,pos,fallback,size){return `<fieldset class="element-controls"><legend>${title}</legend><label>位置<select id="${prefix}Position">${positionOptions(pos,fallback)}</select></label><label>大きさ<select id="${prefix}Size">${sizeOptions(size)}</select></label></fieldset>`;}
  function positionOptions(pos,fallback){const names={'top-left':'左上',top:'上','top-right':'右上',left:'左',center:'中央',right:'右','bottom-left':'左下',bottom:'下','bottom-right':'右下'},matched=positionKey(pos),selected=matched||fallback;return `${pos&&!matched?'<option value="custom" selected>自由配置</option>':''}${Object.entries(names).map(([key,name])=>`<option value="${key}" ${selected===key?'selected':''}>${name}</option>`).join('')}`;}
  function sizeOptions(value='standard'){const names={small:'小','medium-small':'やや小',standard:'標準',large:'大',xlarge:'極大'};return Object.entries(names).map(([key,name])=>`<option value="${key}" ${value===key?'selected':''}>${name}</option>`).join('');}
  function positionKey(pos){if(!pos)return '';return Object.entries(DAY_POSITIONS).find(([,p])=>Math.abs(p.x-pos.x)<.02&&Math.abs(p.y-pos.y)<.02)?.[0]||'';}
  function bindDayLayoutControl(id,prop){const el=$(id);if(!el)return;el.onchange=e=>{if(e.target.value==='custom')return;setDayState(selectedDay,{[prop]:{...DAY_POSITIONS[e.target.value]}});};}
  function bindDaySizeControl(prop){const el=$(prop);if(!el)return;el.onchange=e=>setDayState(selectedDay,{[prop]:e.target.value});}
  function readImage(file,type) {
    if(!file)return; const reader=new FileReader(); reader.onload=()=>{ state[type]=reader.result; saveState(); loadImage(reader.result).then(img=>{ if(type==='logo')logoImage=img;else qrImage=img; $(`${type}Status`).textContent='読み込み済み'; scheduleRender(); }); }; reader.readAsDataURL(file);
  }
  function loadImage(src) { return new Promise((resolve,reject)=>{const i=new Image();i.onload=()=>resolve(i);i.onerror=reject;i.src=src;}); }
  function loadStoredImages() { if(state.logo)loadImage(state.logo).then(i=>{logoImage=i;$('logoStatus').textContent=state.logo===DEFAULTS.logo?'静庵ロゴを設定済み':'変更画像を読み込み済み';render();});if(state.qr)loadImage(state.qr).then(i=>{qrImage=i;$('qrStatus').textContent=state.qr===DEFAULTS.qr?'LINE登録QRを設定済み':'変更画像を読み込み済み';render();}); }
  function loadSeasonImages() { Object.entries(BACKGROUNDS).filter(([,item])=>item.src).forEach(([key,item]) => loadImage(item.src).then(img=>{seasonImages[key]=img;render();})); }
  function scheduleRender(){cancelAnimationFrame(renderTimer);renderTimer=requestAnimationFrame(render);}
  function resizeCanvas(){canvas.width=1080;canvas.height=state.format==='portrait'?1350:1080;}
  function fitZoom(){const w=$('canvasStage').clientWidth-24;const target=Math.min(.62,Math.max(.28,w/1080));zoom=target;applyZoom();}
  function applyZoom(){canvas.style.width=`${Math.round(canvas.width*zoom)}px`;canvas.style.height=`${Math.round(canvas.height*zoom)}px`;$('zoomLabel').textContent=`${Math.round(zoom*100)}%`;}

  function render(showGuides=true) {
    resizeCanvas(); const selectedTheme=THEMES[state.theme], backgroundKey=resolvedBackground();
    canvasHitAreas=[];
    const t=backgroundKey==='simple'?selectedTheme:{...selectedTheme,ink:'#302720',accent:'#aa3e29',accent2:'#8b6529',muted:'#74675d',line:'rgba(78,58,46,.7)',dark:false,texture:false};
    const W=canvas.width,H=canvas.height; ctx.clearRect(0,0,W,H); ctx.fillStyle=backgroundKey==='simple'?t.bg:'#f5efe4';ctx.fillRect(0,0,W,H);
    if(backgroundKey!=='simple'&&seasonImages[backgroundKey]) drawCover(seasonImages[backgroundKey],0,0,W,H);
    if(t.texture) drawTexture(t);
    if(backgroundKey!=='simple') drawHeaderVeil(W,state.format==='portrait'?360:278);
    const margin=54, top=state.format==='portrait'?54:38;
    drawHeader(t,margin,top,W);
    const calTop=state.format==='portrait'?360:278;
    const calBottom=state.format==='portrait'?1040:845;
    roundRect(margin-10,calTop-8,W-margin*2+20,calBottom-calTop+18,18,t.dark?'rgba(26,24,22,.92)':backgroundKey==='simple'?'rgba(255,255,255,.76)':'rgba(252,248,241,.95)',null);
    drawCalendar(t,margin,calTop,W-margin*2,calBottom-calTop,showGuides);
    drawFooter(t,margin,state.format==='portrait'?1082:882,W-margin*2,H-(state.format==='portrait'?1082:882)-42);
  }
  function drawTexture(t){const W=canvas.width,H=canvas.height;ctx.save();for(let i=0;i<3200;i++){const x=(i*73)%W,y=(i*193)%H,a=.025+((i%7)/900);ctx.fillStyle=`rgba(84,55,34,${a})`;ctx.fillRect(x,y,1+(i%2),1+(i%3===0));}ctx.restore();}
  function drawHeaderVeil(w,h){const veil=ctx.createLinearGradient(0,0,0,h);veil.addColorStop(0,'rgba(250,244,234,.95)');veil.addColorStop(.65,'rgba(250,244,234,.92)');veil.addColorStop(1,'rgba(250,244,234,0)');ctx.fillStyle=veil;ctx.fillRect(0,0,w,h);}
  function roundRect(x,y,w,h,r,fill,stroke,lw=2){ctx.beginPath();ctx.roundRect(x,y,w,h,r);if(fill){ctx.fillStyle=fill;ctx.fill();}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=lw;ctx.stroke();}}
  function font(size,weight='500'){const scale=TEXT_SCALES[state.textSize]||1;ctx.font=`${weight} ${Math.round(size*scale*10)/10}px "Noto Sans JP", sans-serif`;}
  function fitText(text,maxWidth,startSize,minSize,weight='700',serif=false){let size=startSize;while(size>minSize){font(size,weight,serif);if(ctx.measureText(text).width<=maxWidth)break;size-=2;}return size;}
  function drawHeader(t,m,top,W){
    if(logoImage){drawContained(logoImage,m,top,228,70);} else {ctx.fillStyle=t.ink;font(26,'800');ctx.fillText(state.shopName,m,top+38);}
    const startDate=state.range==='special'?parseKey(state.specialStart):new Date(state.year,state.month-1,1);
    const endDate=state.range==='special'?parseKey(state.specialEnd):startDate;
    const titleMonth=isNaN(startDate)?state.month:startDate.getMonth()+1;
    const titleYear=isNaN(startDate)?state.year:startDate.getFullYear();
    const heading=state.range==='special'&&endDate&&!isNaN(endDate)&&endDate.getMonth()+1!==titleMonth?`${titleYear}年${titleMonth}月–${endDate.getFullYear()}年${endDate.getMonth()+1}月`:`${titleYear}年${titleMonth}月`;
    ctx.fillStyle=t.ink;font(fitText(heading,442,46,24,'800'),'800');ctx.fillText(heading,m,top+139);
    ctx.fillStyle=t.accent;font(19,'800');ctx.fillText(state.range==='second'?'月後半の営業日':state.range==='special'?'特別営業日':'営業日カレンダー',m,top+173);
    if(state.badgeText){font(16,'800');const bw=Math.min(330,ctx.measureText(state.badgeText).width+48);roundRect(m,top+193,bw,38,19,t.accent,null);ctx.fillStyle='#fff';ctx.textAlign='center';ctx.fillText(state.badgeText,m+bw/2,top+219);ctx.textAlign='left';}
    const portrait=state.format==='portrait',infoW=410,infoX=W-m-infoW-110,infoY=top+(portrait?78:62),infoH=portrait?210:170; roundRect(infoX,infoY,infoW,infoH,18,t.dark?'#24211f':'rgba(252,248,241,.95)',t.line,2);
    ctx.fillStyle=t.ink;font(portrait?15:13,'600');drawTextLines(state.noticeText,infoX+18,infoY+(portrait?27:23),infoW-36,portrait?22:19,portrait?3:2,'center');
    font(portrait?17:15,'800');ctx.textAlign='center';ctx.fillText(`電話番号：${state.phoneText}`,infoX+infoW/2,infoY+(portrait?103:72));ctx.textAlign='left';
    ctx.fillStyle=t.ink;font(portrait?14:12,'600');drawTextLines(state.reserveText,infoX+18,infoY+(portrait?130:96),infoW-36,portrait?20:17,2,'center');
    ctx.fillStyle=t.accent;font(portrait?14:12,'700');drawTextLines(state.cautionText,infoX+18,infoY+(portrait?174:133),infoW-36,portrait?19:17,2,'center');
    if(qrImage){roundRect(W-m-98,top-3,98,98,8,'#fff',null);drawContained(qrImage,W-m-91,top+4,84,84);ctx.fillStyle=t.ink;font(10,'700');ctx.textAlign='center';ctx.fillText('公式LINE',W-m-49,top+109);ctx.textAlign='left';}
  }
  function monthEnglish(m){return ['JANUARY','FEBRUARY','MARCH','APRIL','MAY','JUNE','JULY','AUGUST','SEPTEMBER','OCTOBER','NOVEMBER','DECEMBER'][m-1];}
  function calendarMatrix(){
    const dates=visibleDates(); if(!dates.length)return {cells:[],rows:1};
    const first=dates[0], offset=first.getDay(), cells=[];
    for(let i=0;i<offset;i++){const d=new Date(first);d.setDate(first.getDate()-(offset-i));cells.push({date:d,adjacent:true});}
    dates.forEach(d=>cells.push({date:d,adjacent:false}));
    while(cells.length%7) {const d=new Date(cells[cells.length-1].date);d.setDate(d.getDate()+1);cells.push({date:d,adjacent:true});}
    return {cells,rows:Math.ceil(cells.length/7)};
  }
  function drawCalendar(t,x,y,w,h,showGuides){
    const matrix=calendarMatrix(), rows=matrix.rows, headerH=46,cellW=w/7,cellH=(h-headerH)/rows;
    EN_DAYS.forEach((d,i)=>{ctx.fillStyle=i===0?t.accent:i===6?'#355d8c':t.ink;font(22,'800');ctx.textAlign='center';ctx.fillText(d,x+cellW*(i+.5),y+31);});ctx.textAlign='left';
    ctx.strokeStyle=t.line;ctx.lineWidth=1.8;ctx.beginPath();ctx.moveTo(x,y+headerH);ctx.lineTo(x+w,y+headerH);for(let c=0;c<=7;c++){ctx.moveTo(x+c*cellW,y+headerH);ctx.lineTo(x+c*cellW,y+h);}for(let r=1;r<=rows;r++){ctx.moveTo(x,y+headerH+r*cellH);ctx.lineTo(x+w,y+headerH+r*cellH);}ctx.stroke();
    matrix.cells.forEach((cell,i)=>{const col=i%7,row=Math.floor(i/7),cx=x+col*cellW,cy=y+headerH+row*cellH,d=cell.date,key=dateKey(d),ds=getDayState(key);if(cell.adjacent&&!state.showAdjacent)return;
      if(!cell.adjacent)canvasHitAreas.push({type:'cell',key,x:cx,y:cy,w:cellW,h:cellH});
      const faded=cell.adjacent;ctx.globalAlpha=faded?.42:1;ctx.fillStyle=col===0?t.accent:col===6?'#355d8c':t.ink;font(22,'700');ctx.fillText(String(d.getDate()),cx+11,cy+28);
      const hasLabel = Boolean(ds.label && !faded);
      ctx.globalAlpha = faded ? .35 : 1;
      ctx.fillStyle = {
        dinner: '#355d8c', closed: t.accent, cross: t.accent,
        bar: t.accent2, 'bar-service': t.accent2,
        event: t.accent, 'special-service': t.accent, 'event-shop-closed': '#8b4b3b'
      }[ds.status] || t.ink;
      const statusBox = drawDayStatus(ds, key, { x: cx, y: cy, w: cellW, h: cellH }, hasLabel);
      if (!faded && statusBox) canvasHitAreas.push(statusBox);
      if(ds.label&&!faded){const labelPos=ds.labelPos||{x:.5,y:.8},labelScale=DAY_TEXT_SCALES[ds.labelSize]||1,labelMaxWidth=Math.max(25,Math.min(cellW-14,2*Math.min(labelPos.x,1-labelPos.x)*cellW-12)),maxLabelH=Math.max(30,Math.min(cellH*.52,2*Math.min(labelPos.y,1-labelPos.y)*cellH-8)),fit=fitWrappedText(ds.label,labelMaxWidth,maxLabelH,Math.max(14,cellH*.12)*labelScale,5,'800'),labelX=cx+cellW*labelPos.x,labelCenterY=cy+cellH*labelPos.y,startY=labelCenterY-fit.height/2+fit.lineHeight*.78;ctx.fillStyle=t.ink;font(fit.size,'800');ctx.textAlign='center';fit.lines.forEach((line,n)=>ctx.fillText(line,labelX,startY+n*fit.lineHeight));ctx.textAlign='left';const labelBox={type:'label',key,x:labelX-labelMaxWidth/2,y:startY-fit.lineHeight*.78-5,w:labelMaxWidth,h:fit.height+10,cell:{x:cx,y:cy,w:cellW,h:cellH}};canvasHitAreas.push(labelBox);if(showGuides&&selectedDay===key)drawDragGuide(labelBox,'コメント');}
      if(showGuides&&selectedDay===key&&statusBox)drawDragGuide(statusBox,'営業区分');
      ctx.globalAlpha=1;
    });
  }
  function drawDayStatus(day, key, cell, hasComment) {
    const display = statusDisplay(day);
    if (!display) return null;
    const pos = day.statusPos || { x: .5, y: hasComment ? .34 : .56 };
    const x = cell.x + cell.w * pos.x;
    const y = cell.y + cell.h * pos.y;
    const maxWidth = Math.min(cell.w - 16, 2 * Math.min(pos.x, 1 - pos.x) * cell.w - 8);
    const maxHeight = Math.max(18, Math.min(cell.h * .55, 2 * Math.min(pos.y, 1 - pos.y) * cell.h - 8));
    const appearance = statusAppearance(day);
    const baseSize = !appearance.text.trim() ? 27 : day.status === 'open' ? 17 : 19;
    const size = baseSize * (DAY_TEXT_SCALES[day.statusSize] || 1);
    const { lines, lineHeight, height } = fitWrappedText(display, maxWidth, maxHeight, size, 5, '800');
    const spacing = Math.min(lineHeight, maxHeight / lines.length);
    const startY = y - (lines.length - 1) * spacing / 2;
    ctx.textAlign = 'center';
    lines.forEach((line, i) => ctx.fillText(line, x, startY + i * spacing, maxWidth));
    ctx.textAlign = 'left';
    const guideHeight = Math.min(height, maxHeight);
    return { type: 'status', key, x: x - maxWidth / 2, y: y - guideHeight / 2 - 5, w: maxWidth, h: guideHeight + 10, cell };
  }
  function drawFooter(t,x,y,w,h){
    const portrait=state.format==='portrait';roundRect(x,y,w,h,22,t.dark?'#24211f':'rgba(252,248,241,.95)',t.line,2);ctx.fillStyle=t.ink;font(portrait?25:23,'800');ctx.textAlign='center';ctx.fillText('営業時間・ご予約案内',x+w/2,y+(portrait?40:36));ctx.fillStyle=t.accent;ctx.fillRect(x+w/2-76,y+(portrait?50:46),152,3);ctx.textAlign='left';
    if(portrait){
      ctx.fillStyle=t.ink;const lines=state.hoursText.split('\n').slice(0,3),size=fitText(lines.reduce((a,b)=>a.length>b.length?a:b,''),w-80,23,15,'700');font(size,'700');ctx.textAlign='center';lines.forEach((line,i)=>ctx.fillText(line,x+w/2,y+88+i*(size+9)));ctx.textAlign='left';
      ctx.fillStyle=t.accent;font(18,'700');drawBottomText(`※ ${state.cautionText}`,x+40,y+h-22,w-80,24,2,'center');
    }else{
      const colW=w/2-50;ctx.strokeStyle=t.line;ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(x+w/2,y+62);ctx.lineTo(x+w/2,y+h-18);ctx.stroke();
      ctx.fillStyle=t.ink;font(fitText(state.hoursText.split('\n').reduce((a,b)=>a.length>b.length?a:b,''),colW,20,14,'700'),'700');drawTextLines(state.hoursText,x+25,y+80,colW,24,3,'center');
      ctx.fillStyle=t.accent;font(16,'700');drawTextLines(`※ ${state.cautionText}`,x+w/2+25,y+82,colW,24,2,'center');
    }
  }
  function textLines(text,maxWidth,maxLines){
    const paragraphs=String(text||'').replace(/\r/g,'').split('\n'),lines=[];let truncated=false;
    outer: for(let p=0;p<paragraphs.length;p++){
      const chars=[...paragraphs[p]];let line='';
      if(!chars.length){lines.push('');if(lines.length>=maxLines&&p<paragraphs.length-1){truncated=true;break;}continue;}
      for(const ch of chars){
        if(ctx.measureText(line+ch).width>maxWidth&&line){lines.push(line);line=ch;if(lines.length>=maxLines){truncated=true;break outer;}}
        else line+=ch;
      }
      if(line){lines.push(line);if(lines.length>=maxLines&&p<paragraphs.length-1){truncated=true;break;}}
    }
    const out=lines.slice(0,maxLines);
    if(truncated&&out.length){let last=out[out.length-1];while(last.length&&ctx.measureText(last+'…').width>maxWidth)last=last.slice(0,-1);out[out.length-1]=last+'…';}
    return out;
  }
  function wrapTextAll(text,maxWidth){const paragraphs=String(text||'').replace(/\r/g,'').split('\n'),lines=[];paragraphs.forEach(paragraph=>{const chars=[...paragraph];let line='';if(!chars.length){lines.push('');return;}chars.forEach(ch=>{if(line&&ctx.measureText(line+ch).width>maxWidth){lines.push(line);line=ch;}else line+=ch;});lines.push(line);});return lines;}
  function fitWrappedText(text,maxWidth,maxHeight,startSize,minSize,weight){for(let size=startSize;size>=minSize;size-=1){font(size,weight);const lines=wrapTextAll(text,maxWidth),actual=size*(TEXT_SCALES[state.textSize]||1),lineHeight=actual*1.28,height=lines.length*lineHeight;if(height<=maxHeight)return {size,lines,lineHeight,height};}font(minSize,weight);const lines=wrapTextAll(text,maxWidth),lineHeight=minSize*(TEXT_SCALES[state.textSize]||1)*1.18;return {size:minSize,lines,lineHeight,height:lines.length*lineHeight};}
  function drawDragGuide(box,label){ctx.save();ctx.globalAlpha=1;ctx.setLineDash([5,4]);ctx.strokeStyle='#2684ff';ctx.lineWidth=2;ctx.strokeRect(box.x,box.y,box.w,box.h);ctx.setLineDash([]);ctx.fillStyle='#2684ff';ctx.font='700 10px "Noto Sans JP", sans-serif';ctx.textAlign='left';ctx.fillText(label,box.x+3,box.y-4);ctx.restore();}
  function canvasPoint(e){const rect=canvas.getBoundingClientRect();return{x:(e.clientX-rect.left)*canvas.width/rect.width,y:(e.clientY-rect.top)*canvas.height/rect.height};}
  function hitAt(point,type,key){return [...canvasHitAreas].reverse().find(a=>(!type||a.type===type)&&(!key||a.key===key)&&point.x>=a.x&&point.x<=a.x+a.w&&point.y>=a.y&&point.y<=a.y+a.h);}
  function startCanvasDrag(e){const point=canvasPoint(e);let target=hitAt(point,null,selectedDay);if(!target||target.type==='cell'){const cell=hitAt(point,'cell');if(cell){selectedDay=cell.key;renderDayEditor();scheduleRender();target=hitAt(point,null,selectedDay);}else return;}if(!target||!['status','label'].includes(target.type))return;e.preventDefault();dragState={pointerId:e.pointerId,key:target.key,type:target.type,cell:target.cell};canvas.setPointerCapture(e.pointerId);canvas.classList.add('dragging');}
  function moveCanvasDrag(e){if(!dragState||dragState.pointerId!==e.pointerId)return;e.preventDefault();const point=canvasPoint(e),cell=dragState.cell,pos={x:Math.max(.08,Math.min(.92,(point.x-cell.x)/cell.w)),y:Math.max(.16,Math.min(.9,(point.y-cell.y)/cell.h))},prop=dragState.type==='status'?'statusPos':'labelPos';state.days[dragState.key]={...getDayState(dragState.key),[prop]:pos};scheduleRender();}
  function endCanvasDrag(e){if(!dragState||dragState.pointerId!==e.pointerId)return;canvas.releasePointerCapture(e.pointerId);canvas.classList.remove('dragging');dragState=null;saveState();renderDayEditor();scheduleRender();}
  function drawTextLines(text,x,y,maxWidth,lineHeight,maxLines,align='left'){const lines=textLines(text,maxWidth,maxLines),old=ctx.textAlign;ctx.textAlign=align;const px=align==='center'?x+maxWidth/2:x;lines.forEach((line,i)=>ctx.fillText(line,px,y+i*lineHeight));ctx.textAlign=old;return lines.length;}
  function drawBottomText(text,x,bottomY,maxWidth,lineHeight,maxLines,align='left'){const lines=textLines(text,maxWidth,maxLines),startY=bottomY-(lines.length-1)*lineHeight,old=ctx.textAlign;ctx.textAlign=align;const px=align==='center'?x+maxWidth/2:x;lines.forEach((line,i)=>ctx.fillText(line,px,startY+i*lineHeight));ctx.textAlign=old;}
  function drawContained(img,x,y,w,h){const r=Math.min(w/img.width,h/img.height),dw=img.width*r,dh=img.height*r;ctx.drawImage(img,x+(w-dw)/2,y+(h-dh)/2,dw,dh);}
  function drawCover(img,x,y,w,h){const r=Math.max(w/img.width,h/img.height),dw=img.width*r,dh=img.height*r;ctx.drawImage(img,x+(w-dw)/2,y+(h-dh)/2,dw,dh);}
  function fileName(theme=state.theme){const range=state.range==='month'?'月間':state.range==='second'?'後半':'特別営業';return `${state.year}-${String(state.month).padStart(2,'0')}_${range}_${THEMES[theme].name}_${BACKGROUNDS[state.background].name}.png`;}
  function downloadCurrent(){render(false);const a=document.createElement('a');a.download=fileName();a.href=canvas.toDataURL('image/png');a.click();render(true);toast('PNG画像を保存しました');}
  function downloadPdf(){render(false);const image=canvas.toDataURL('image/png'),title=`${state.year}-${String(state.month).padStart(2,'0')}_A4`;const win=window.open('','_blank');if(!win){render(true);toast('ポップアップを許可するとPDFを保存できます');return;}win.document.write(`<!doctype html><html lang="ja"><head><meta charset="utf-8"><title>${title}</title><style>@page{size:A4 portrait;margin:0}html,body{margin:0;width:210mm;height:297mm;background:#fff}body{display:flex;align-items:center;justify-content:center}img{display:block;width:210mm;height:297mm;object-fit:contain}</style></head><body><img alt="A4カレンダー" src="${image}"></body></html>`);win.document.close();setTimeout(()=>{win.focus();win.print();},250);render(true);toast('印刷画面から「PDFとして保存」を選べます');}
  async function downloadAllThemes(){const original=state.theme;toast('4種類の画像を作成しています');for(const key of Object.keys(THEMES)){state.theme=key;render(false);await new Promise(r=>setTimeout(r,230));const a=document.createElement('a');a.download=fileName(key);a.href=canvas.toDataURL('image/png');a.click();await new Promise(r=>setTimeout(r,250));}state.theme=original;renderThemes();render(true);saveState();toast('4種類を書き出しました');}
  init(); fitZoom();
})();
