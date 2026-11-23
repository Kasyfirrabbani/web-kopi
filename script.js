/* =========================================================
   Coffee Shop Kasyfi - script.js (Vanilla JavaScript)
   Pembuat : Muhammad Kasyfirrabbani (NIM 2403010082)
   ========================================================= */
document.addEventListener('DOMContentLoaded', function () {

  /* ---------- 1. Menu hamburger ---------- */
  var burger = document.getElementById('kasyfi_hamburger');
  var menu = document.getElementById('kasyfi_nav_list');
  if (burger && menu) {
    burger.addEventListener('click', function () {
      burger.classList.toggle('kasyfi_open');
      menu.classList.toggle('kasyfi_open');
    });
    menu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        burger.classList.remove('kasyfi_open');
        menu.classList.remove('kasyfi_open');
      });
    });
  }

  /* ---------- 2. Header berubah saat scroll + tombol ke atas ---------- */
  var header = document.getElementById('kasyfi_header');
  var toTop = document.getElementById('kasyfi_totop');
  function onScroll() {
    var y = window.scrollY || document.documentElement.scrollTop;
    if (header) header.classList.toggle('kasyfi_scrolled', y > 60);
    if (toTop) toTop.classList.toggle('kasyfi_show', y > 400);
  }
  window.addEventListener('scroll', onScroll);
  onScroll();
  if (toTop) toTop.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });

  /* ---------- 3. Tahun otomatis di footer ---------- */
  var yr = document.getElementById('kasyfi_year');
  if (yr) yr.textContent = new Date().getFullYear();

  /* ---------- 4. Animasi muncul saat scroll ---------- */
  var reveals = document.querySelectorAll('.kasyfi_reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('kasyfi_visible'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('kasyfi_visible'); });
  }

  /* ---------- 5. Fallback gambar jika gagal dimuat ---------- */
  document.querySelectorAll('img').forEach(function (img) {
    img.addEventListener('error', function () { img.style.visibility = 'hidden'; });
  });

  /* ---------- 6. Toast notifikasi ---------- */
  var toast = document.getElementById('kasyfi_toast');
  var toastTimer;
  function showToast(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('kasyfi_show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.classList.remove('kasyfi_show'); }, 2600);
  }

  /* ---------- 7. Tombol pesan (produk) ---------- */
  document.querySelectorAll('[data-kasyfi-order]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      showToast('\u2615 ' + btn.getAttribute('data-kasyfi-order') + ' ditambahkan ke pesanan!');
    });
  });

  /* ---------- 8. Counter statistik ---------- */
  var counters = document.querySelectorAll('[data-kasyfi-target]');
  if (counters.length && 'IntersectionObserver' in window) {
    var co = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = e.target, target = parseInt(el.getAttribute('data-kasyfi-target'), 10), cur = 0;
        var step = Math.max(1, Math.ceil(target / 80));
        var t = setInterval(function () {
          cur += step;
          if (cur >= target) { cur = target; clearInterval(t); }
          el.textContent = cur.toLocaleString('id-ID') + (el.getAttribute('data-kasyfi-suffix') || '');
        }, 25);
        co.unobserve(el);
      });
    }, { threshold: 0.4 });
    counters.forEach(function (c) { co.observe(c); });
  }

  /* ---------- 9. Slider testimoni ---------- */
  var track = document.getElementById('kasyfi_slider_track');
  if (track) {
    var slides = track.children.length, idx = 0, auto;
    var dotsBox = document.getElementById('kasyfi_slider_dots');
    for (var i = 0; i < slides; i++) {
      var d = document.createElement('button');
      d.className = 'kasyfi_dot' + (i === 0 ? ' kasyfi_active' : '');
      d.setAttribute('aria-label', 'Testimoni ' + (i + 1));
      d.setAttribute('data-i', i);
      dotsBox.appendChild(d);
    }
    var dots = dotsBox.querySelectorAll('.kasyfi_dot');
    var goTo = function (n) {
      idx = (n + slides) % slides;
      track.style.transform = 'translateX(-' + idx * 100 + '%)';
      dots.forEach(function (x, k) { x.classList.toggle('kasyfi_active', k === idx); });
    };
    dots.forEach(function (x) {
      x.addEventListener('click', function () { goTo(parseInt(x.getAttribute('data-i'), 10)); restart(); });
    });
    var restart = function () { clearInterval(auto); auto = setInterval(function () { goTo(idx + 1); }, 5000); };
    restart();
  }

  /* ---------- 10. Filter kategori (produk, galeri, blog) ---------- */
  document.querySelectorAll('[data-kasyfi-filter-group]').forEach(function (bar) {
    var targetSel = bar.getAttribute('data-kasyfi-filter-group');
    var items = document.querySelectorAll(targetSel);
    bar.querySelectorAll('.kasyfi_filter_btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        bar.querySelectorAll('.kasyfi_filter_btn').forEach(function (b) { b.classList.remove('kasyfi_active'); });
        btn.classList.add('kasyfi_active');
        var cat = btn.getAttribute('data-kasyfi-cat');
        items.forEach(function (it) {
          var show = cat === 'semua' || it.getAttribute('data-kasyfi-cat') === cat;
          it.classList.toggle('kasyfi_hide', !show);
        });
      });
    });
  });

  /* ---------- 11. Pencarian artikel blog ---------- */
  var search = document.getElementById('kasyfi_blog_search');
  if (search) {
    var posts = document.querySelectorAll('.kasyfi_post');
    var emptyMsg = document.getElementById('kasyfi_blog_empty');
    search.addEventListener('input', function () {
      var q = search.value.toLowerCase().trim(), found = 0;
      posts.forEach(function (p) {
        var ok = p.textContent.toLowerCase().indexOf(q) !== -1;
        p.classList.toggle('kasyfi_hide', !ok);
        if (ok) found++;
      });
      if (emptyMsg) emptyMsg.style.display = found === 0 ? 'block' : 'none';
    });
  }

  /* ---------- 12. Lightbox galeri ---------- */
  var lb = document.getElementById('kasyfi_lightbox');
  if (lb) {
    var lbImg = document.getElementById('kasyfi_lightbox_img');
    var lbCap = document.getElementById('kasyfi_lightbox_caption');
    var gItems = Array.prototype.slice.call(document.querySelectorAll('.kasyfi_gallery_item'));
    var cur = 0;
    var visibleItems = function () { return gItems.filter(function (g) { return !g.classList.contains('kasyfi_hide'); }); };
    var openLb = function (item) {
      var list = visibleItems();
      cur = list.indexOf(item);
      render(list);
      lb.classList.add('kasyfi_open');
      document.body.style.overflow = 'hidden';
    };
    var render = function (list) {
      var el = list[cur];
      lbImg.src = el.getAttribute('data-kasyfi-full');
      lbImg.alt = el.getAttribute('data-kasyfi-title');
      lbCap.textContent = el.getAttribute('data-kasyfi-title');
    };
    var closeLb = function () { lb.classList.remove('kasyfi_open'); document.body.style.overflow = ''; };
    var move = function (dir) { var list = visibleItems(); cur = (cur + dir + list.length) % list.length; render(list); };
    gItems.forEach(function (g) { g.addEventListener('click', function () { openLb(g); }); });
    document.getElementById('kasyfi_lb_close').addEventListener('click', closeLb);
    document.getElementById('kasyfi_lb_prev').addEventListener('click', function () { move(-1); });
    document.getElementById('kasyfi_lb_next').addEventListener('click', function () { move(1); });
    lb.addEventListener('click', function (e) { if (e.target === lb) closeLb(); });
    document.addEventListener('keydown', function (e) {
      if (!lb.classList.contains('kasyfi_open')) return;
      if (e.key === 'Escape') closeLb();
      if (e.key === 'ArrowLeft') move(-1);
      if (e.key === 'ArrowRight') move(1);
    });
  }

  /* ---------- 13. Accordion FAQ ---------- */
  document.querySelectorAll('.kasyfi_faq_item').forEach(function (item) {
    var q = item.querySelector('.kasyfi_faq_q');
    var a = item.querySelector('.kasyfi_faq_a');
    q.addEventListener('click', function () {
      var isOpen = item.classList.contains('kasyfi_open');
      document.querySelectorAll('.kasyfi_faq_item.kasyfi_open').forEach(function (o) {
        o.classList.remove('kasyfi_open');
        o.querySelector('.kasyfi_faq_a').style.maxHeight = null;
      });
      if (!isOpen) { item.classList.add('kasyfi_open'); a.style.maxHeight = a.scrollHeight + 'px'; }
    });
  });

  /* ---------- 14. Validasi form kontak ---------- */
  var form = document.getElementById('kasyfi_form_kontak');
  if (form) {
    var status = document.getElementById('kasyfi_form_status');
    var pesan = document.getElementById('kasyfi_input_pesan');
    var counter = document.getElementById('kasyfi_char_count');
    var rules = {
      kasyfi_input_nama: function (v) { return v.trim().length >= 3 ? '' : 'Nama minimal 3 karakter.'; },
      kasyfi_input_email: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? '' : 'Format email tidak valid.'; },
      kasyfi_input_hp: function (v) { return v.trim() === '' || /^(\+62|62|0)8[0-9]{8,11}$/.test(v.replace(/[\s-]/g, '')) ? '' : 'Nomor HP tidak valid (contoh: 08123456789).'; },
      kasyfi_input_topik: function (v) { return v !== '' ? '' : 'Silakan pilih topik pesan.'; },
      kasyfi_input_pesan: function (v) { return v.trim().length >= 10 ? '' : 'Pesan minimal 10 karakter.'; }
    };
    var check = function (id) {
      var field = document.getElementById(id);
      var msg = rules[id](field.value);
      var group = field.closest('.kasyfi_form_group');
      group.classList.toggle('kasyfi_error', msg !== '');
      group.querySelector('.kasyfi_error_msg').textContent = msg;
      return msg === '';
    };
    Object.keys(rules).forEach(function (id) {
      var f = document.getElementById(id);
      f.addEventListener('blur', function () { check(id); });
      f.addEventListener('input', function () { if (f.closest('.kasyfi_form_group').classList.contains('kasyfi_error')) check(id); });
    });
    if (pesan && counter) {
      pesan.addEventListener('input', function () { counter.textContent = pesan.value.length + ' / 500'; });
    }
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var valid = true;
      Object.keys(rules).forEach(function (id) { if (!check(id)) valid = false; });
      if (!valid) {
        status.className = 'kasyfi_fail';
        status.textContent = 'Mohon periksa kembali isian yang masih salah.';
        return;
      }
      var data = {
        nama: document.getElementById('kasyfi_input_nama').value.trim(),
        email: document.getElementById('kasyfi_input_email').value.trim(),
        hp: document.getElementById('kasyfi_input_hp').value.trim(),
        topik: document.getElementById('kasyfi_input_topik').value,
        pesan: pesan.value.trim(),
        waktu: new Date().toLocaleString('id-ID')
      };
      try {
        var inbox = JSON.parse(localStorage.getItem('kasyfi_inbox') || '[]');
        inbox.push(data);
        localStorage.setItem('kasyfi_inbox', JSON.stringify(inbox));
      } catch (err) { /* abaikan jika storage tidak tersedia */ }
      status.className = 'kasyfi_success';
      status.textContent = 'Terima kasih, ' + data.nama + '! Pesan Anda sudah terkirim. Kami akan membalas lewat email maksimal 1x24 jam.';
      showToast('\u2705 Pesan berhasil dikirim');
      form.reset();
      if (counter) counter.textContent = '0 / 500';
      // Opsional: buka aplikasi email pemilik website
      var openMail = document.getElementById('kasyfi_open_mail');
      if (openMail && openMail.checked) {
        window.location.href = 'mailto:halo@coffeekasyfi.id?subject=' + encodeURIComponent('[' + data.topik + '] Pesan dari ' + data.nama) +
          '&body=' + encodeURIComponent(data.pesan + '\n\nSalam,\n' + data.nama + '\n' + data.email);
      }
    });
  }

  /* ---------- 15. Form newsletter di footer ---------- */
  var nl = document.getElementById('kasyfi_newsletter');
  if (nl) {
    nl.addEventListener('submit', function (e) {
      e.preventDefault();
      var em = document.getElementById('kasyfi_news_email');
      if (/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(em.value.trim())) {
        showToast('\u2709\uFE0F Terima kasih sudah berlangganan!');
        nl.reset();
      } else { showToast('\u26A0\uFE0F Masukkan email yang valid.'); }
    });
  }
});
