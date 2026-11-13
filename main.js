
(function () {
  var saved = localStorage.getItem("zoomin-theme");
  var sys = window.matchMedia && matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  document.documentElement.setAttribute("data-theme", saved || sys);
})();

document.addEventListener("DOMContentLoaded", async () => {

  const $  = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const sb = () => (window.sbReady && window.sb) ? window.sb : null;

  const esc = (v) => String(v == null ? "" : v).replace(/[&<>"']/g, c =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  /* ============ Toast ============ */
  window.toast = function (msg) {
    let t = document.querySelector(".toast");
    if (!t) {
      t = document.createElement("div");
      t.className = "toast";
      t.style.cssText = "position:fixed;bottom:100px;right:50%;transform:translateX(50%);z-index:300;" +
        "background:#0F172A;color:#fff;padding:.8rem 1.5rem;border-radius:999px;font-weight:800;" +
        "box-shadow:0 12px 30px rgba(0,0,0,.25);opacity:0;transition:.3s;font-family:inherit";
      document.body.appendChild(t);
    }
    t.textContent = msg;
    requestAnimationFrame(() => (t.style.opacity = "1"));
    clearTimeout(t._h);
    t._h = setTimeout(() => (t.style.opacity = "0"), 2400);
  };

  function applyTheme(t) {
    document.documentElement.setAttribute("data-theme", t);
    localStorage.setItem("zoomin-theme", t);
    $$(".theme-toggle").forEach(b => (b.textContent = t === "dark" ? "☀️" : "🌙"));
  }
  applyTheme(document.documentElement.getAttribute("data-theme") || "light");

  function themeBtn() {
    const b = document.createElement("button");
    b.className = "theme-toggle";
    b.title = "الوضع الليلي / النهاري";
    b.addEventListener("click", () => {
      const cur = document.documentElement.getAttribute("data-theme");
      applyTheme(cur === "dark" ? "light" : "dark");
    });
    return b;
  }

  function bindBurger() {
    const burger = $(".burger"), links = $(".nav-links");
    if (!burger || !links) return;
    burger.onclick = () => links.classList.toggle("open");
    links.querySelectorAll("a").forEach(a =>
      a.addEventListener("click", () => links.classList.remove("open")));
  }

  let ME = null; 

  function renderNav(user) {
    ME = user;
    const box = $(".nav-actions");
    if (!box) return;
    box.innerHTML = "";
    box.appendChild(themeBtn());

    if (user) {
      const name = (user.user_metadata && user.user_metadata.full_name) || "مستخدم";
      const first = name.trim().split(/\s+/)[0] || "مستخدم";
      box.insertAdjacentHTML("beforeend", `
        <a href="dashboard.html" class="nav-user" title="${esc(name)}">
          <span class="nav-avatar">${esc(name.trim().charAt(0) || "م")}</span>
          <span class="nav-username">${esc(first)}</span>
        </a>
        <button class="btn btn-ghost btn-sm" id="logout-btn">خروج</button>`);
      $("#logout-btn").addEventListener("click", async () => {
        if (sb()) await sb().auth.signOut();
        toast("👋 تم تسجيل الخروج — نشوفك قريب!");
        setTimeout(() => (location.href = "index.html"), 700);
      });
    } else {
      box.insertAdjacentHTML("beforeend", `
        <a href="auth.html" class="btn btn-ghost btn-sm">دخول</a>
        <a href="auth.html?mode=register" class="btn btn-primary btn-sm">إنشاء حساب</a>`);
    }

    const burger = document.createElement("button");
    burger.className = "burger";
    burger.textContent = "☰";
    box.appendChild(burger);
    bindBurger();
  }

  if (sb()) {
    const { data } = await sb().auth.getSession();
    ME = (data && data.session && data.session.user) || null;
    sb().auth.onAuthStateChange((_ev, session) => renderNav(session && session.user));
  }
  renderNav(ME);

  const FB_PATHS = [
    { id: "fb-p1", icon: "🎨", title_ar: "تصميم جرافيك", title_en: "Graphic Design", desc_ar: "تعلمي أساسيات التصميم، الهوية البصرية، وتصميم المحتوى.", projects_count: 5, level: "Beginner → Advanced", hours: 15 },
    { id: "fb-p2", icon: "📱", title_ar: "تسويق رقمي", title_en: "Digital Marketing", desc_ar: "تعلمي التسويق الرقمي، Social Media، Ads و Content Marketing.", projects_count: 6, level: "Beginner → Advanced", hours: 18 },
    { id: "fb-p3", icon: "💻", title_ar: "تطوير الويب", title_en: "Web Development", desc_ar: "ابدئي من أساسيات تطوير الويب وابني مشاريع حقيقية.", projects_count: 5, level: "Beginner → Advanced", hours: 15 },
    { id: "fb-p4", icon: "🤖", title_ar: "الذكاء الاصطناعي", title_en: "AI & Generative AI", desc_ar: "تعلمي استخدام أدوات وتقنيات الذكاء الاصطناعي في العمل والإنتاجية.", projects_count: 4, level: "Beginner → Intermediate", hours: 12 },
    { id: "fb-p5", icon: "💼", title_ar: "ريادة الأعمال", title_en: "Business & Entrepreneurship", desc_ar: "تعلمي أساسيات بناء المشاريع، تحليل السوق، التسويق والمبيعات.", projects_count: 5, level: "Beginner → Advanced", hours: 15 },
    { id: "fb-p6", icon: "📹", title_ar: "مونتاج الفيديو", title_en: "Video Editing", desc_ar: "من قص الفيديو للموشن جرافيك — مهارة مطلوبة جداً في السوق.", projects_count: 4, level: "Beginner → Intermediate", hours: 12 }
  ];
  const FB_SERVICES = [
    { id: "fb-s1", user_id: null, seller_name: "Mohamed A.", icon: "🎨", title: "Social Media Design", description: "Professional social media posts for your business.", category: "design", price: 10, rating: 4.9 },
    { id: "fb-s2", user_id: null, seller_name: "Sara R.", icon: "🖌️", title: "Logo & Brand Identity", description: "Complete visual identity: logo, colors and guidelines.", category: "design", price: 50, rating: 4.8 },
    { id: "fb-s3", user_id: null, seller_name: "Mohamed A.", icon: "📱", title: "Social Media Management", description: "Full management: content, posting and engagement.", category: "marketing", price: 120, rating: 4.9 },
    { id: "fb-s4", user_id: null, seller_name: "Mohamed A.", icon: "🚀", title: "Digital Marketing Campaign", description: "A complete 7-day campaign with strategy and content.", category: "marketing", price: 80, rating: 5.0 },
    { id: "fb-s5", user_id: null, seller_name: "Omar K.", icon: "🎬", title: "Video Editing", description: "Professional editing for reels, ads and YouTube.", category: "video", price: 25, rating: 4.7 },
    { id: "fb-s6", user_id: null, seller_name: "Hady B.", icon: "💻", title: "Landing Page Development", description: "Fast, responsive landing page for your product.", category: "web", price: 100, rating: 4.9 },
    { id: "fb-s7", user_id: null, seller_name: "Nour T.", icon: "✍️", title: "Content Writing", description: "SEO articles and website copy that converts.", category: "writing", price: 15, rating: 4.8 },
    { id: "fb-s8", user_id: null, seller_name: "Yara A.", icon: "🤖", title: "AI Automation Setup", description: "Automate your workflow with AI tools.", category: "ai", price: 60, rating: 4.9 },
    { id: "fb-s9", user_id: null, seller_name: "Mohamed A.", icon: "💼", title: "Market Research Report", description: "Deep customer and competitor research for your market.", category: "business", price: 70, rating: 4.8 }
  ];

  async function fetchJSON(q) {
    try { const { data, error } = await q; return error ? null : data; } catch (e) { return null; }
  }
  async function getPaths() {
    if (!sb()) return FB_PATHS;
    const rows = await fetchJSON(sb().from("learning_paths").select("*").order("sort_order"));
    return rows && rows.length ? rows : FB_PATHS;
  }
  async function getServices() {
    if (!sb()) return FB_SERVICES;
    const rows = await fetchJSON(sb().from("services").select("*").order("created_at", { ascending: false }));
    return rows && rows.length ? rows : FB_SERVICES;
  }


  function emptyState(title, sub, href, btn) {
    return `<div class="empty-state"><b>${esc(title)}</b>${esc(sub || "")}` +
      (href ? `<a href="${href}" class="btn btn-primary btn-sm">${esc(btn)}</a>` : "") + `</div>`;
  }

  function needLogin(msg) {
    $$("section").forEach(s => s.remove());
    const warn = sb() ? "" :
      `<p style="color:var(--tag-orange-text);font-size:.85rem;font-weight:800;margin-top:1rem">⚠️ لسه ربطتيش Supabase — اتبعي خطوات الإعداد في supabase-config.js</p>`;
    $("header").insertAdjacentHTML("afterend", `
      <section class="login-needed">
        <div class="container" style="max-width:520px">
          <div class="ln-card">
            <div class="ln-icon">🔐</div>
            <h2>محتاجين تسجّلي دخولك</h2>
            <p>${esc(msg || "الصفحة دي بياناتها شخصية — سجّلي دخولك عشان تشوفيها")}</p>
            ${warn}
            <div style="display:flex;gap:.7rem;justify-content:center;flex-wrap:wrap;margin-top:1.3rem">
              <a href="auth.html" class="btn btn-primary">تسجيل الدخول</a>
              <a href="auth.html?mode=register" class="btn btn-ghost">إنشاء حساب جديد</a>
            </div>
          </div>
        </div>
      </section>`);
  }

  function arabicAuthError(msg) {
    const m = String(msg || "").toLowerCase();
    if (m.includes("invalid login credentials")) return "الإيميل أو كلمة السر غلط — جرّبي تاني";
    if (m.includes("already registered")) return "الإيميل ده مسجل قبل كده — سجّلي دخول بدل التسجيل";
    if (m.includes("at least 6")) return "كلمة السر قصيرة — لازم 6 حروف على الأقل";
    if (m.includes("email not confirmed")) return "لازم تأكدي إيميلك الأول (افحصي الوارد)";
    if (m.includes("rate limit")) return "محاولات كتير — استني دقيقة وحاولي تاني";
    if (m.includes("password")) return "كلمة السر ضعيفة — جرّبي أقوى منها";
    return "حدث خطأ: " + msg;
  }

  async function renderPaths() {
    const grid = $("#paths-grid");
    if (!grid) return;
    const paths = await getPaths();
    grid.innerHTML = paths.map(p => `
      <div class="card">
        <div class="icon">${esc(p.icon)}</div>
        <h3>${esc(p.title_ar)}</h3><div class="en-title">${esc(p.title_en)}</div>
        <p>${esc(p.desc_ar)}</p>
        <div class="meta"><span class="tag">📦 Projects: ${+p.projects_count}</span><span class="tag green">📈 ${esc(p.level)}</span></div>
        <div class="card-foot">
          <button class="btn btn-primary btn-sm" data-enroll="${esc(p.id)}">${ME ? "ابدئي المسار ←" : "ابدئي مجاناً ←"}</button>
          <span style="color:var(--muted);font-size:.85rem;font-weight:700">⏱️ ${+p.hours} ساعة</span>
        </div>
      </div>`).join("");
    $$("[data-enroll]", grid).forEach(b => b.addEventListener("click", () => enroll(b.dataset.enroll)));
  }

  async function enroll(pathId) {
    if (String(pathId).startsWith("fb-")) return toast("🧪 دي بيانات تجريبية — شغّلي schema.sql في Supabase الأول");
    if (!ME) {
      toast("🔐 سجّلي حسابك الأول عشان تبدئي المسار");
      setTimeout(() => (location.href = "auth.html?mode=register&next=learn.html"), 900);
      return;
    }
    const { error } = await sb().from("user_paths").upsert(
      { user_id: ME.id, path_id: pathId, progress: 0 },
      { onConflict: "user_id,path_id", ignoreDuplicates: true });
    if (error) return toast("حدث خطأ: " + error.message);
    toast("🚀 مسارك جاهز — تقدمك بيتسجل في الداشبورد!");
    setTimeout(() => (location.href = "dashboard.html"), 800);
  }

  /* ============ السوق: الخدمات من قاعدة البيانات + طلب حقيقي ============ */
  async function renderServices() {
    const grid = $("#services-grid");
    if (!grid) return;
    const list = await getServices();
    grid.innerHTML = list.map(s => `
      <div class="card svc" data-cat="${esc(s.category)}">
        <div class="icon">${esc(s.icon)}</div>
        <h3>${esc(s.title)}</h3>
        <p>${esc(s.description)}</p>
        <div class="svc-foot"><span class="price">ابتداءً من $${+s.price}</span><span class="stars">⭐ ${Number(s.rating).toFixed(1)}</span></div>
        <div class="svc-foot">
          <span class="seller"><span class="s-av">${esc((s.seller_name || "Z").split(/\\s+/).map(w => w[0]).slice(0, 2).join("").toUpperCase())}</span> ${esc(s.seller_name)}</span>
          <button class="btn btn-primary btn-sm" data-order="${esc(s.id)}" data-seller="${esc(s.user_id || "")}">اطلبي الخدمة</button>
        </div>
      </div>`).join("");
    $$("[data-order]", grid).forEach(btn =>
      btn.addEventListener("click", () => orderService(btn.dataset.order, btn.dataset.seller || null)));
  }

  async function orderService(serviceId, sellerId) {
    if (String(serviceId).startsWith("fb-")) return toast("🧪 دي بيانات تجريبية — شغّلي schema.sql في Supabase الأول");
    if (!ME) {
      toast("🔐 سجّلي دخولك الأول عشان تطلبي الخدمة");
      setTimeout(() => (location.href = "auth.html?next=marketplace.html"), 900);
      return;
    }
    const { error } = await sb().from("orders").insert({
      service_id: serviceId, buyer_id: ME.id, seller_id: sellerId || null });
    if (error) return toast("حدث خطأ: " + error.message);
    toast("✅ تم إرسال طلبك للبائع — هيكلمك قريب على إيميلك");
  }

  /* ============ الداشبورد: بياناتك الحقيقية ============ */
  async function renderDashboard() {
    if (!$("#dash-hello")) return;
    if (!ME) return needLogin("سجّلي دخولك عشان تشوفي لوحة تقدمك الحقيقية");
    if (!sb()) {
      $("#dash-hello").textContent = "⚠️ Supabase مش متظبط";
      $("#dash-sub").textContent = "افتحي supabase-config.js والصقي بيانات مشروعك";
      return;
    }

    const name = (ME.user_metadata && ME.user_metadata.full_name) || "مستخدم";
    $("#dash-hello").textContent = `أهلاً بعودتك، ${name.trim().split(/\\s+/)[0]} 👋`;

    const [myRows, projRows, svcRows] = await Promise.all([
      fetchJSON(sb().from("user_paths").select("*, learning_paths(*)").eq("user_id", ME.id)),
      fetchJSON(sb().from("projects").select("*").eq("user_id", ME.id).order("created_at", { ascending: false })),
      fetchJSON(sb().from("services").select("id").eq("user_id", ME.id))
    ]);
    const rows = (myRows || []).filter(r => r.learning_paths);
    const projects = projRows || [];
    const services = svcRows || [];
    const done = rows.filter(r => r.progress >= 100);

    $("#stat-enrolled").textContent = rows.length;
    $("#stat-completed").textContent = done.length;
    $("#stat-projects").textContent = projects.length;
    $("#stat-services").textContent = services.length;

    $("#progress-list").innerHTML = rows.length
      ? rows.map(r => `
        <div class="progress-row">
          <div class="lbl"><span>${esc(r.learning_paths.icon)} ${esc(r.learning_paths.title_ar)}</span><span>${r.progress}%</span></div>
          <div class="bar"><i style="width:${r.progress}%"></i></div>
        </div>`).join("")
      : emptyState("لسه بدأتي أي مسار 🎓", "اختاري مسار من صفحة تعلّم وابدئي رحلتك — التقدم هيتسجل هنا تلقائي", "learn.html", "استكشفي المسارات");

    const active = rows.filter(r => r.progress < 100);
    $("#continue-list").innerHTML = active.length
      ? active.map(r => `
        <div class="mini-lesson">
          <span class="ic">${esc(r.learning_paths.icon)}</span>
          <div><b>${esc(r.learning_paths.title_ar)}</b><div style="font-size:.8rem;color:var(--muted)">التقدم ${r.progress}%</div></div>
          <button class="btn btn-primary btn-sm" data-continue="${r.id}" style="margin-inline-start:auto">أكملي الدرس ←</button>
        </div>`).join("")
      : `<div class="mini-lesson"><span class="ic">${rows.length ? "🏆" : "🌱"}</span>
          <div><b>${rows.length ? "خلصتي كل مساراتك!" : "ابدئي أول درس ليك"}</b>
          <div style="font-size:.8rem;color:var(--muted)">كل درس بتخلصيه بيزود تقدمك 10%</div></div></div>`;

    $("#dash-projects").innerHTML = projects.length
      ? projects.slice(0, 4).map(p => `
        <div class="pf-item" style="margin-bottom:.7rem">
          <span class="idx">✅</span>
          <div><b>${esc(p.title)}</b><div style="font-size:.8rem;color:var(--muted)">${esc(p.category)}</div></div>
        </div>`).join("")
      : emptyState("مفيش مشاريع بعد 📁", "لما تكملي مسار 100% بيتولد مشروع تلقائي في الـPortfolio");

    /* مقترح ذكي حسب مكانك في الرحلة */
    let msg, href, text;
    if (!rows.length) { msg = "أول خطوة: اختاري مسار يحمّسك وابدئيه النهاردة"; href = "learn.html"; text = "🎓 استكشفي المسارات"; }
    else if (!projects.length) { msg = "كمّلي أي مسار لحد 100% وهيتولد مشروعك الأول تلقائي في الـPortfolio"; href = "portfolio.html"; text = "📁 شوفي الـPortfolio"; }
    else if (!services.length) { msg = "عندك مشاريع موثقة — الوقت مناسب تنشري أول خدمة ليك!"; href = "sell.html"; text = "🚀 أنشئي أول خدمة"; }
    else { msg = "خدمتك منشورة في السوق — رشّحيها لأول عميل وابدئي اكسبي"; href = "marketplace.html"; text = "💼 شوفي خدماتك"; }
    $("#dash-reco").innerHTML = `<h3>💡 مقترح ليك</h3>
      <p style="color:var(--ink-2);font-weight:700">${msg}</p>
      <a href="${href}" class="btn btn-primary btn-sm" style="margin-top:.8rem">${text}</a>`;

    /* زر "أكملي الدرس" — بيرفع التقدم 10% ويحفظه في قاعدة البيانات */
    $$("[data-continue]").forEach(b => b.addEventListener("click", async () => {
      const row = rows.find(r => String(r.id) === b.dataset.continue);
      if (!row || !sb()) return;
      b.disabled = true; b.textContent = "جاري الحفظ…";
      const pct = Math.min(row.progress + 10, 100);
      const { error } = await sb().from("user_paths")
        .update({ progress: pct, updated_at: new Date().toISOString() }).eq("id", row.id);
      if (error) { b.disabled = false; b.textContent = "أكملي الدرس ←"; return toast("حدث خطأ: " + error.message); }
      if (pct >= 100 && row.progress < 100) {
        await sb().from("projects").insert({
          user_id: ME.id,
          title: `${row.learning_paths.title_en} — Final Project`,
          category: row.learning_paths.title_ar,
          status: "completed", source_path: row.learning_paths.slug });
        toast("🏆 مبروك! خلصتي المسار — واتضاف مشروع تلقائي في الـPortfolio");
      } else toast(`✅ درس اتخلص — التقدم بقى ${pct}%`);
      renderDashboard();
    }));
  }

  /* ============ الـPortfolio: مشاريعك الحقيقية ============ */
  async function renderPortfolio() {
    if (!$("#pf-projects")) return;
    if (!ME) return needLogin("سجّلي دخولك عشان تشوفي الـPortfolio الحقيقي بتاعك");
    if (!sb()) {
      $("#pf-name").textContent = "وضع التجربة";
      $("#pf-projects").innerHTML = emptyState("⚠️ Supabase مش متظبط", "مشاريعك الحقيقية هتظهر هنا أول ما تربطي قاعدة البيانات");
      return;
    }

    const name = (ME.user_metadata && ME.user_metadata.full_name) || "مستخدم";
    const initial = name.trim().charAt(0) || "م";
    const [rows, prjRows, svcRows] = await Promise.all([
      fetchJSON(sb().from("user_paths").select("*, learning_paths(*)").eq("user_id", ME.id)),
      fetchJSON(sb().from("projects").select("*").eq("user_id", ME.id).order("created_at", { ascending: false })),
      fetchJSON(sb().from("services").select("id").eq("user_id", ME.id))
    ]);
    const paths = (rows || []).filter(r => r.learning_paths);
    const projects = prjRows || [];
    const services = svcRows || [];

    $("#pf-initial").textContent = initial;
    $("#pf-name").textContent = name;
    $("#pf-role").textContent = "Learner @ ZoomIn Development";
    $("#pf-skills").innerHTML = paths.slice(0, 5).map(p =>
      `<span class="skill-pill">${esc(p.learning_paths.title_en)}</span>`).join("") ||
      `<span class="skill-pill">Just Getting Started</span>`;
    $("#pf-count-projects").textContent = projects.length;
    $("#pf-count-paths").textContent = paths.length;
    $("#pf-count-services").textContent = services.length;

    const items = [
      ...projects.map(p => ({ title: p.title, category: p.category, status: p.status })),
      ...paths.filter(p => p.progress < 100).map(p =>
        ({ title: p.learning_paths.title_en + " — Path", category: p.learning_paths.title_ar, status: "in_progress" }))
    ];
    $("#pf-projects").innerHTML = items.length ? items.map((it, i) => `
      <div class="pf-item" ${it.status === "in_progress" ? 'style="border-style:dashed;opacity:.75"' : ""}>
        <span class="idx">${String(i + 1).padStart(2, "0")}</span>
        <div><b>${esc(it.title)}</b><div style="color:var(--muted);font-size:.85rem">${esc(it.category)}</div></div>
        ${it.status === "completed" ? '<span class="done">✅ Completed</span>' : '<span class="tag orange">🔥 In Progress</span>'}
      </div>`).join("")
      : emptyState("الـPortfolio لسه فاضي 📁", "كمّلي أول مسار لحد 100% وهتلاقي أول مشروع هنا", "learn.html", "ابدئي أول مسار");

    /* توليد صفحة الـPortfolio من البيانات الحقيقية */
    const gen = $("#gen-portfolio"), preview = $("#pf-preview");
    if (gen) gen.onclick = () => {
      preview.innerHTML = `
        <div class="pf-cover"></div>
        <div class="pf-body">
          <div class="avatar" style="border:4px solid var(--card);box-shadow:var(--shadow)">${esc(initial)}</div>
          <h3 style="font-weight:900;margin-top:.6rem">${esc(name)}</h3>
          <p style="color:var(--muted)">Verified ZoomIn Learner</p>
          <div style="margin:.7rem 0">${paths.map(p => `<span class="skill-pill">${esc(p.learning_paths.title_en)}</span>`).join("") || '<span class="skill-pill">Learning…</span>'}</div>
          <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:.8rem;margin-top:1rem">
            <div style="background:var(--bg);border-radius:12px;padding:.9rem;text-align:center"><b style="color:var(--primary)">${projects.length}</b><br><small style="color:var(--muted)">Completed Projects</small></div>
            <div style="background:var(--bg);border-radius:12px;padding:.9rem;text-align:center"><b style="color:var(--primary)">${paths.length}</b><br><small style="color:var(--muted)">Learning Paths</small></div>
            <div style="background:var(--bg);border-radius:12px;padding:.9rem;text-align:center"><b style="color:var(--primary)">${services.length}</b><br><small style="color:var(--muted)">Services Live</small></div>
          </div>
          <div style="display:flex;gap:.6rem;margin-top:1.2rem;flex-wrap:wrap">
            <button class="btn btn-primary btn-sm" id="share-pf">🔗 مشاركة الرابط</button>
            <button class="btn btn-ghost btn-sm" id="print-pf">📥 تحميل PDF</button>
          </div>
        </div>`;
      preview.style.display = "block";
      preview.scrollIntoView({ behavior: "smooth", block: "start" });
      $("#share-pf").onclick = async () => {
        try { await navigator.clipboard.writeText(location.origin + "/profile.html"); toast("🔗 رابط البروفايل اتنسخ — ابعتيه لأي عميل"); }
        catch (e) { toast("انسخي الرابط من شريط العنوان 😉"); }
      };
      $("#print-pf").onclick = () => { toast("🖨️ اختاري Save as PDF من نافذة الطباعة"); setTimeout(() => window.print(), 600); };
      toast("🎉 اتولد الـPortfolio من مشاريعك الحقيقية!");
    };
  }

  /* ============ البروفايل + الإنجازات الموثقة ============ */
  async function renderProfile() {
    if (!$("#pr-name")) return;
    if (!ME) return needLogin("سجّلي دخولك عشان تشوفي بروفايلك");
    if (!sb()) {
      $("#pr-achievements").innerHTML = emptyState("⚠️ Supabase مش متظبط", "الإنجازات الحقيقية هتظهر هنا أول ما تربطي قاعدة البيانات");
      return;
    }

    const name = (ME.user_metadata && ME.user_metadata.full_name) || "مستخدم";
    const [rows, svcRows, ordRows] = await Promise.all([
      fetchJSON(sb().from("user_paths").select("*, learning_paths(*)").eq("user_id", ME.id)),
      fetchJSON(sb().from("services").select("id").eq("user_id", ME.id)),
      fetchJSON(sb().from("orders").select("id").eq("seller_id", ME.id))
    ]);
    const paths = (rows || []).filter(r => r.learning_paths);
    const done = paths.filter(p => p.progress >= 100);
    const services = svcRows || [];
    const orders = (ordRows || []).length;

    $("#pr-initial").textContent = name.trim().charAt(0) || "م";
    $("#pr-name").textContent = name;
    $("#pr-role").textContent = done.length ? "ZoomIn Verified Learner" : "ZoomIn Learner";
    $("#pr-skills").innerHTML = (done.length ? done : paths).slice(0, 4).map(p =>
      `<span class="skill-pill">${esc(p.learning_paths.title_en)}</span>`).join("") ||
      `<span class="skill-pill">Just Getting Started</span>`;
    $("#pr-projects").textContent = paths.filter(p => p.progress >= 100).length;
    $("#pr-paths").textContent = paths.length;
    $("#pr-services").textContent = services.length;

    const cards = [];
    done.forEach(p => cards.push(`
      <div class="card"><div class="icon">${esc(p.learning_paths.icon)}</div>
        <h3>${esc(p.learning_paths.title_ar)}</h3>
        <p>مسار مكتمل — ${+p.learning_paths.projects_count} مشاريع عملية و ${+p.learning_paths.hours} ساعة تعلم</p>
        <span class="tag green">✅ Completed</span></div>`));
    if (services.length) cards.push(`
      <div class="card"><div class="icon">💼</div><h3>خدمات منشورة</h3>
        <p>نشرتي ${services.length} ${services.length === 1 ? "خدمة" : "خدمات"} في سوق ZoomIn</p>
        <span class="tag green">✅ Live</span></div>`);
    if (orders) cards.push(`
      <div class="card"><div class="icon">📩</div><h3>طلبات واصلة</h3>
        <p>عندك ${orders} ${orders === 1 ? "طلب" : "طلبات"} على خدماتك من عملاء</p>
        <span class="tag orange">🔥 New</span></div>`);
    if (!cards.length) cards.push(emptyState("لسه مفيش إنجازات 🌱", "ابدئي أول مسار وهتلاقي أول إنجاز ليك هنا", "learn.html", "🎓 ابدئي دلوقتي"));
    $("#pr-achievements").innerHTML = cards.join("");
  }

  /* ============ صفحة "بِع مهاراتك": فورم نشر خدمة حقيقي ============ */
  function bindSellForm() {
    const form = $("#service-form");
    if (!form) return;
    const msg = $("#svc-msg");
    const show = (t, type) => { msg.textContent = t; msg.className = "auth-msg " + (type || "err"); };
    form.addEventListener("submit", async e => {
      e.preventDefault();
      if (!ME) {
        show("🔐 سجّلي دخولك الأول عشان تنشري خدمتك", "ok");
        setTimeout(() => (location.href = "auth.html?mode=register&next=sell.html"), 1100);
        return;
      }
      if (!sb()) return show("⚠️ Supabase مش متظبط — راجعي supabase-config.js");
      const title = $("#svc-title").value.trim();
      const desc = $("#svc-desc").value.trim();
      const cat = $("#svc-cat").value;
      const price = parseInt($("#svc-price").value, 10);
      const icon = $("#svc-icon").value;
      if (title.length < 3) return show("اكتبي اسم خدمة واضح (3 حروف على الأقل)");
      if (desc.length < 10) return show("الوصف قصير — اشرحي للعميل تفاصيل الخدمة");
      if (!price || price < 1) return show("اكتبي سعر صحيح (1 على الأقل)");
      const seller = (ME.user_metadata && ME.user_metadata.full_name) || "بائع ZoomIn";
      const btn = $("#svc-submit");
      btn.disabled = true; btn.textContent = "جاري النشر…";
      const { error } = await sb().from("services").insert({
        user_id: ME.id, seller_name: seller, title, description: desc,
        category: cat, price, icon });
      btn.disabled = false; btn.textContent = "نشر الخدمة في السوق 🚀";
      if (error) return show("حدث خطأ: " + error.message);
      toast("🎉 خدمتك اتنشرت في السوق!");
      setTimeout(() => (location.href = "marketplace.html"), 900);
    });
  }

  /* ============ صفحة تسجيل الدخول / إنشاء الحساب ============ */
  function initAuthPage() {
    const box = $("#auth-box");
    if (!box) return;
    if (ME) { location.replace("dashboard.html"); return; }

    const params = new URLSearchParams(location.search);
    const next = params.get("next");
    const msg = $("#auth-msg");
    const show = (t, type) => { msg.textContent = t; msg.className = "auth-msg " + (type || "err"); };

    function switchTab(tab) {
      $$(".auth-tab").forEach(t => t.classList.toggle("active", t.dataset.tab === tab));
      $("#form-login").style.display = tab === "login" ? "" : "none";
      $("#form-register").style.display = tab === "register" ? "" : "none";
      show("", "");
    }
    $$(".auth-tab").forEach(t => t.addEventListener("click", () => switchTab(t.dataset.tab)));
    switchTab(params.get("mode") === "register" ? "register" : "login");

    const go = () => setTimeout(() => (location.href = next || "dashboard.html"), 800);

    $("#form-login").addEventListener("submit", async e => {
      e.preventDefault();
      if (!sb()) return show("⚠️ Supabase مش متظبط — الصقي بياناتك في supabase-config.js");
      const email = $("#login-email").value.trim();
      const pass = $("#login-pass").value;
      if (!email || !pass) return show("املي الإيميل وكلمة السر الأول");
      const btn = $("#login-btn");
      btn.disabled = true; btn.textContent = "جاري الدخول…";
      const { error } = await sb().auth.signInWithPassword({ email, password: pass });
      btn.disabled = false; btn.textContent = "دخول ←";
      if (error) return show(arabicAuthError(error.message));
      toast("✅ أهلاً بيك تاني!");
      go();
    });

    $("#form-register").addEventListener("submit", async e => {
      e.preventDefault();
      if (!sb()) return show("⚠️ Supabase مش متظبط — الصقي بياناتك في supabase-config.js");
      const name = $("#reg-name").value.trim();
      const email = $("#reg-email").value.trim();
      const pass = $("#reg-pass").value;
      const pass2 = $("#reg-pass2").value;
      if (name.length < 2) return show("اكتبي اسمك الكامل (حرفين على الأقل)");
const at = email.indexOf("@");
if (at < 1 || email.indexOf(".", at) < at + 2) return show("البريد الإلكتروني مش صحيح");      if (pass.length < 6) return show("كلمة السر لازم تكون 6 حروف على الأقل");
      if (pass !== pass2) return show("كلمتا السر مش متطابقين");
      const btn = $("#register-btn");
      btn.disabled = true; btn.textContent = "جاري إنشاء الحساب…";
      const { data, error } = await sb().auth.signUp({
        email, password: pass, options: { data: { full_name: name } } });
      btn.disabled = false; btn.textContent = "إنشاء الحساب 🚀";
      if (error) return show(arabicAuthError(error.message));
      if (!data.session) {
        show("📨 ابعتنا رسالة تأكيد على إيميلك — افتحيها واضغطي الرابط وبعدين سجّلي دخول من هنا. (ولو عايزة تسجيل فوري: من Supabase → Authentication → Providers → Email → أطفي Confirm email)", "ok");
        return;
      }
      toast("🎉 أهلاً بيك في ZoomIn! حسابك جاهز");
      go();
    });
  }

  /* ============ عدادات الهيرو ============ */
  document.querySelectorAll("[data-count]").forEach(el => {
    const target = +el.dataset.count, dur = 1200, t0 = performance.now();
    const step = now => {
      const p = Math.min((now - t0) / dur, 1);
      el.textContent = Math.round(target * (0.2 + 0.8 * p)) + (el.dataset.suffix || "");
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  });

  /* ============ أزرار تجريبية متبقية (لو موجودة) ============ */
  document.querySelectorAll("[data-demo]").forEach(btn =>
    btn.addEventListener("click", e => {
      e.preventDefault();
      toast(btn.dataset.msg || "✨ الميزة دي هتشتغل في النسخة القادمة");
    }));

  /* ============ فلاتر السوق (بتشتغل على الكروت المحملة ديناميكياً) ============ */
  function applyFilter() {
    const cat = (document.querySelector(".filter.active") || {}).dataset ?
      document.querySelector(".filter.active").dataset.cat : "all";
    const q = (document.querySelector("#svc-search") ? document.querySelector("#svc-search").value : "").trim().toLowerCase();
    document.querySelectorAll(".svc").forEach(s => {
      const okCat = cat === "all" || s.dataset.cat === cat;
      const okQ = !q || s.textContent.toLowerCase().includes(q);
      s.style.display = okCat && okQ ? "" : "none";
    });
  }
  document.querySelectorAll(".filter").forEach(f => f.addEventListener("click", () => {
    document.querySelectorAll(".filter").forEach(x => x.classList.remove("active"));
    f.classList.add("active");
    applyFilter();
  }));
  const searchIn = document.querySelector("#svc-search");
  if (searchIn) searchIn.addEventListener("input", applyFilter);

  /* ============ المساعد الذكي ============ */
  const ROADMAP_HTML = `
    <div class="roadmap">
      <h4>🗺️ Your Suggested Roadmap</h4>
      <li><b>Week 1</b> Marketing Fundamentals</li>
      <li><b>Week 2</b> Social Media</li>
      <li><b>Week 3</b> Content Creation</li>
      <li><b>Week 4</b> Practical Project</li>
      <li><b>Week 5</b> Build Portfolio</li>
      <li><b>Week 6</b> Create Your First Service</li>
    </div>`;

  function aiReply(text) {
    const t = text.toLowerCase();
    if (t.includes("market") || t.includes("تسويق") || t.includes("digital") || t.includes("freelanc") || t.includes("فريلان"))
      return `رائع! ده خطة مثالية ليك 👇${ROADMAP_HTML}<br><a href="learn.html" class="btn btn-primary btn-sm" style="margin-top:.6rem">🚀 Start My Roadmap</a>`;
    if (t.includes("design") || t.includes("تصميم"))
      return `💡 لو عايزة تبدئي في التصميم الجرافيكي:<div class="roadmap"><li><b>Week 1</b> Design Basics &amp; Color Theory</li><li><b>Week 2</b> Brand Identity</li><li><b>Week 3</b> Social Media Design</li><li><b>Week 4</b> Portfolio Project</li></div><a href="learn.html" class="btn btn-primary btn-sm" style="margin-top:.6rem">ابدئي مسار التصميم</a>`;
    if (t.includes("web") || t.includes("برمجة") || t.includes("موقع"))
      return `💻 خطة تطوير الويب:<div class="roadmap"><li><b>Week 1</b> HTML &amp; CSS</li><li><b>Week 2</b> JavaScript Basics</li><li><b>Week 3</b> Build Real Projects</li><li><b>Week 4</b> Publish Portfolio</li></div><a href="learn.html" class="btn btn-primary btn-sm" style="margin-top:.6rem">ابدئي المسار</a>`;
    if (t.includes("ai") || t.includes("ذكاء"))
      return `🤖 مسار الذكاء الاصطناعي:<div class="roadmap"><li><b>Week 1</b> AI Tools Fundamentals</li><li><b>Week 2</b> Prompt Engineering</li><li><b>Week 3</b> AI for Productivity</li><li><b>Week 4</b> AI Service Project</li></div><a href="learn.html" class="btn btn-primary btn-sm" style="margin-top:.6rem">ابدئي المسار</a>`;
    return `👋 أنا ZoomIn AI! أقدر أساعدك تخططي مسارك التعليمي. جرّبي تسأليني:<br>• "I want to learn digital marketing"<br>• "عايزة أتعلم تصميم"<br>• "أفتح مسار برمجة"`;
  }

  function bindChat(boxSel) {
    const box = document.querySelector(boxSel);
    if (!box) return;
    const chat = box.querySelector(".ai-chat");
    const input = box.querySelector(".ai-input input");
    const send = () => {
      const v = input.value.trim();
      if (!v) return;
      chat.insertAdjacentHTML("beforeend", `<div class="msg user">${esc(v)}</div>`);
      input.value = "";
      chat.scrollTop = chat.scrollHeight;
      setTimeout(() => {
        chat.insertAdjacentHTML("beforeend", `<div class="msg bot">${aiReply(v)}</div>`);
        chat.scrollTop = chat.scrollHeight;
      }, 650);
    };
    const btn = box.querySelector(".ai-input button");
    if (btn) btn.addEventListener("click", send);
    if (input) input.addEventListener("keydown", e => { if (e.key === "Enter") send(); });
    box.querySelectorAll(".qp").forEach(q =>
      q.addEventListener("click", () => { input.value = q.textContent; send(); }));
  }

  function bindAI() {
    const fab = document.querySelector(".ai-fab");
    const panel = document.querySelector("#ai-panel");
    if (fab && panel) fab.addEventListener("click", () => panel.classList.toggle("open"));
    bindChat("#ai-panel");
    bindChat("#ai-page-box");
  }

  /* ============ الفوتر + AI Widget (بيتحقنوا تلقائي لو الصفحة ناقصهم) ============ */
  const SITE_FOOTER = `
<footer>
  <div class="container">
    <div class="footer-grid">
      <div class="footer-brand">
        <a href="index.html" class="logo" style="color:#fff"><span class="logo-badge">⚡</span>Zoom<span style="color:#A79BFF">In</span> Development</a>
        <p style="margin-top:1rem"><b style="color:#fff">Learn. Build. Sell. Grow.</b></p>
        <p>Empowering the next generation with skills, experience, and opportunities.</p>
      </div>
      <div><h4>روابط سريعة</h4>
        <a href="index.html">عن المنصة</a><a href="learn.html">التعلم</a><a href="course.html">المشاريع</a><a href="portfolio.html">الـPortfolio</a>
      </div>
      <div><h4>المنصة</h4>
        <a href="marketplace.html">سوق الخدمات</a><a href="sell.html">بِع مهاراتك</a><a href="assistant.html">المساعد الذكي</a><a href="dashboard.html">حسابي</a>
      </div>
      <div><h4>ابدأ رحلتك</h4>
        <a href="learn.html">🎓 مسارات التعلم</a><a href="auth.html?mode=register">⚡ إنشاء حساب</a><a href="profile.html">👤 البروفايل</a>
      </div>
    </div>
    <div class="footer-bottom">© 2026 ZoomIn Development — Learn · Build · Sell · Grow</div>
  </div>
</footer>
<button class="ai-fab" title="ZoomIn AI">🤖</button>
<div class="ai-panel" id="ai-panel">
  <div class="ai-head"><span class="bot">🤖</span><div><b>ZoomIn AI</b><div style="font-size:.78rem;opacity:.9">مساعدك التعليمي والمهني</div></div></div>
  <div class="ai-chat"><div class="msg bot">أهلاً! 👋 أنا ZoomIn AI. قولي عايزة تتعلمي إيه وهجهزلك خطة كاملة.</div></div>
  <div class="quick-prompts">
    <button class="qp">عايز أتعلم تسويق رقمي</button>
    <button class="qp">I want to learn design</button>
  </div>
  <div class="ai-input"><input type="text" placeholder="اكتب سؤالك..."><button class="btn btn-primary btn-sm">إرسال</button></div>
</div>`;

  if (!document.querySelector("footer")) {
    document.body.insertAdjacentHTML("beforeend", SITE_FOOTER);
  }
  bindAI();

  /* ============ تشغيل كل الصفحات ============ */
  renderPaths();
  renderServices();
  renderDashboard();
  renderPortfolio();
  renderProfile();
  bindSellForm();
  initAuthPage();
});