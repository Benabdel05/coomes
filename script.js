// COOMES — script partagé par toutes les pages.
// Blocs : burger menu · rôle toggle · signup form · filtre boutique · i18n

// ─── Menu burger ────────────────────────────────────────────────────────────
const burgerBtn = document.getElementById('burgerBtn');
const mobileMenu = document.getElementById('mobileMenu');
if (burgerBtn && mobileMenu) {
  burgerBtn.addEventListener('click', () => mobileMenu.classList.toggle('open'));
  mobileMenu.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', () => mobileMenu.classList.remove('open'))
  );
}

// ─── Rôle toggle (creer-compte) ─────────────────────────────────────────────
const roleClient = document.getElementById('roleClient');
const roleCoop   = document.getElementById('roleCoop');
if (roleClient && roleCoop) {
  roleClient.addEventListener('click', () => { roleClient.classList.add('active'); roleCoop.classList.remove('active'); });
  roleCoop.addEventListener('click',   () => { roleCoop.classList.add('active');   roleClient.classList.remove('active'); });
}

// ─── Formulaire signup (démo visuelle) ──────────────────────────────────────
const signupForm    = document.getElementById('signupForm');
const signupSuccess = document.getElementById('signupSuccess');
if (signupForm) {
  signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (signupSuccess) signupSuccess.classList.add('show');
    signupForm.reset();
  });
}

// ─── Filtre boutique ─────────────────────────────────────────────────────────
const shopFilters = document.getElementById('shopFilters');
const shopGrid    = document.getElementById('shopGrid');
const noResults   = document.getElementById('noResults');
if (shopFilters && shopGrid) {
  shopFilters.addEventListener('click', (e) => {
    const btn = e.target.closest('.filter-btn');
    if (!btn) return;
    shopFilters.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    const cards = shopGrid.querySelectorAll('.product-card');
    let visible = 0;
    cards.forEach(card => {
      const match = filter === 'all'
        || card.dataset.cat === filter
        || card.dataset.region === filter;
      card.classList.toggle('hidden', !match);
      if (match) visible++;
    });
    if (noResults) noResults.style.display = visible === 0 ? 'block' : 'none';
  });
}

// ─── Internationalisation ────────────────────────────────────────────────────
const TRANSLATIONS = {
  fr: {
    lang_choose: 'Langue :',
    nav_apropos: 'À propos',
    nav_boutique: 'Notre boutique',
    nav_regions: 'Les régions',
    nav_contact: 'Nous contacter',
    nav_compte: 'Créer un compte',
    footer_tag: 'La marchandisation des produits des coopératives marocaines — terroir, économie sociale et solidaire, emballages recyclés.',
    footer_nav: 'Navigation',
    footer_legal: 'Légal',
    footer_coops: 'Coopératives',
    footer_mentions: 'Mentions légales',
    footer_cgv: 'Conditions de vente',
    footer_privacy: 'Politique de confidentialité',
    footer_rejoindre: 'Rejoindre COOMES',
    footer_charte: 'Charte qualité',
    footer_espace: 'Espace coopérative',
    footer_copy: '© 2026 COOMES — Plateforme marchande des coopératives marocaines.',
    footer_made: 'Conçu avec le vert des oliviers et des terres de l'Atlas.',
    eyebrow_boutique: 'La boutique',
    hero_boutique_title: 'Produits du terroir, directs des coopératives.',
    hero_boutique_lead: 'Filtrez par catégorie ou région. Chaque produit affiche sa coopérative d'origine — la traçabilité fait partie de la fiche, pas une mention en petit.',
    filter_all: 'Tout',
    filter_alimentaire: 'Alimentaire',
    filter_artisanat: 'Artisanat',
    filter_cosmetique: 'Cosmétique',
    no_results: 'Aucun produit ne correspond à ce filtre.',
    voir_catalogue: 'Voir tout le catalogue',
    eyebrow_avantages: 'Avantages membres',
    club_title: 'Le Club COOMES',
    eyebrow_regions: 'Les régions',
    hero_regions_title: 'Une carte tenue par les coopératives, pas par nous.',
    hero_regions_lead: 'Chaque région du catalogue correspond à des coopératives réelles. Survolez une ligne pour voir sa spécialité.',
    map_caption: 'Carte stylisée — repères illustratifs, non géographiquement précis.',
    reg_souss_spec: 'Argan, agrumes, élevage caprin',
    reg_draa_spec: 'Safran, dattes, plantes aromatiques',
    reg_marrakech_spec: 'Poterie, huile d'olive, tissage',
    reg_fes_spec: 'Huile d'olive, miel, fromage de chèvre',
    reg_beni_spec: 'Tapis, laine, miel de montagne',
    reg_oriental_spec: 'Céréales, couscous, figues séchées',
    reg_tanger_spec: 'Fromages, thé à la menthe, artisanat du Rif',
    reg_laayoune_spec: 'Produits de la mer, artisanat sahraoui',
    prod_argan: 'Huile d'argan bio',
    prod_safran: 'Safran de Taliouine',
    prod_miel: 'Miel de thym de montagne',
    prod_tapis: 'Tapis Boucherouite (1 m²)',
    prod_poterie: 'Poterie de Safi, set 4 bols',
    prod_dattes: 'Dattes Mejhoul',
    prod_olive: 'Huile d'olive extra vierge',
    prod_couscous: 'Couscous artisanal fin',
    prod_savon: 'Savon beldi à l'eucalyptus',
    prod_ghassoul: 'Ghassoul de la Moulouya',
    prod_broderie: 'Nappe brodée de Fès',
    prod_figues: 'Figues séchées de Taourirt',
  },
  ar: {
    lang_choose: 'اللغة:',
    nav_apropos: 'من نحن',
    nav_boutique: 'متجرنا',
    nav_regions: 'الجهات',
    nav_contact: 'اتصل بنا',
    nav_compte: 'إنشاء حساب',
    footer_tag: 'تسويق منتجات التعاونيات المغربية — منتجات الأرض، الاقتصاد الاجتماعي والتضامني، التغليف المُعاد تدويره.',
    footer_nav: 'التنقل',
    footer_legal: 'قانوني',
    footer_coops: 'التعاونيات',
    footer_mentions: 'البيانات القانونية',
    footer_cgv: 'شروط البيع',
    footer_privacy: 'سياسة الخصوصية',
    footer_rejoindre: 'الانضمام إلى COOMES',
    footer_charte: 'ميثاق الجودة',
    footer_espace: 'فضاء التعاونية',
    footer_copy: '© 2026 COOMES — منصة تجارة التعاونيات المغربية.',
    footer_made: 'مصمم بخضرة الزيتون وتربة الأطلس.',
    eyebrow_boutique: 'المتجر',
    hero_boutique_title: 'منتجات الأرض، مباشرة من التعاونيات.',
    hero_boutique_lead: 'صفّي حسب الفئة أو الجهة. كل منتج يُبيّن تعاونيته الأصلية.',
    filter_all: 'الكل',
    filter_alimentaire: 'غذائي',
    filter_artisanat: 'صناعة تقليدية',
    filter_cosmetique: 'تجميل',
    no_results: 'لا توجد منتجات تطابق هذا الفلتر.',
    voir_catalogue: 'عرض الكتالوج الكامل',
    eyebrow_avantages: 'مزايا الأعضاء',
    club_title: 'نادي COOMES',
    eyebrow_regions: 'الجهات',
    hero_regions_title: 'خريطة تُحددها التعاونيات، لا نحن.',
    hero_regions_lead: 'كل جهة في الكتالوج تقابل تعاونيات حقيقية.',
    map_caption: 'خريطة توضيحية — معالم تقريبية غير جغرافية دقيقة.',
    reg_souss_spec: 'الأركان، الحمضيات، تربية الماعز',
    reg_draa_spec: 'الزعفران، التمور، النباتات العطرية',
    reg_marrakech_spec: 'الفخار، زيت الزيتون، النسيج',
    reg_fes_spec: 'زيت الزيتون، العسل، جبن الماعز',
    reg_beni_spec: 'الزرابي، الصوف، عسل الجبل',
    reg_oriental_spec: 'الحبوب، الكسكس، التين المجفف',
    reg_tanger_spec: 'الأجبان، شاي النعناع، حرف الريف',
    reg_laayoune_spec: 'منتجات البحر، الصناعة التقليدية الصحراوية',
    prod_argan: 'زيت الأركان العضوي',
    prod_safran: 'زعفران تالوين',
    prod_miel: 'عسل الزعتر الجبلي',
    prod_tapis: 'زربية بوشرويط (١ م²)',
    prod_poterie: 'فخار آسفي، مجموعة ٤ أكواب',
    prod_dattes: 'تمور المجهول',
    prod_olive: 'زيت زيتون بكر ممتاز',
    prod_couscous: 'كسكس حرفي ناعم',
    prod_savon: 'صابون بلدي بالإكاليبتوس',
    prod_ghassoul: 'غاسول من ملوية',
    prod_broderie: 'مفرش مطرز من فاس',
    prod_figues: 'تين مجفف من تاوريرت',
  },
  amz: {
    lang_choose: 'Tutlayt:',
    nav_apropos: 'Fell neɣ',
    nav_boutique: 'Adukan nneɣ',
    nav_regions: 'Timnaḍin',
    nav_contact: 'Mɣer-d',
    nav_compte: 'Rnu amiḍan',
    footer_tag: 'Timarna n tiwacunin timarokkiyin — akal, tiɣrit, iẓuran ilelliyen.',
    footer_nav: 'Asegzi',
    footer_legal: 'Asenqed',
    footer_coops: 'Tiwacunin',
    footer_mentions: 'Iɣalen n usenfar',
    footer_cgv: 'Isertanen n tezɣelt',
    footer_privacy: 'Tasertit n tɣellist',
    footer_rejoindre: 'Smuqel COOMES',
    footer_charte: 'Tafrant n unɣan',
    footer_espace: 'Tafṣut n twacunt',
    footer_copy: '© 2026 COOMES — Taɣult n tiwacunin timarokkiyin.',
    footer_made: 'Yettwarnu s azegzaw n uzemmur d umaḍal n Atalas.',
    eyebrow_boutique: 'Adukan',
    hero_boutique_title: 'Timarna n ukal, seg tiwacunin akk.',
    hero_boutique_lead: 'Suter s tafart neɣ tamaḍit. Yal amḍan isken twacunt-is.',
    filter_all: 'Akk',
    filter_alimentaire: 'Amesway',
    filter_artisanat: 'Tazreft',
    filter_cosmetique: 'Tissuta',
    no_results: 'Ulac imḍanen yemsaden s usfuri-a.',
    voir_catalogue: 'Wali akk katalug',
    eyebrow_avantages: 'Tifayidin n yimseqdacen',
    club_title: 'Club COOMES',
    eyebrow_regions: 'Timnaḍin',
    hero_regions_title: 'Takarḍa yellan deg ifassen n tiwacunin.',
    hero_regions_lead: 'Yal tamaḍit deg katalug tesɛa tiwacunin tiɣaranin.',
    map_caption: 'Takarḍa n usentel — war azal ajeɣrafi.',
    reg_souss_spec: 'Argan, iẓemmaṭen, tḥergumt',
    reg_draa_spec: 'Zafaran, tazart, tsuqsiwin',
    reg_marrakech_spec: 'Ifexaren, zzit, azetta',
    reg_fes_spec: 'Zzit, tamment, agrum n tafunast',
    reg_beni_spec: 'Izerbi, tazart, tamment n udurar',
    reg_oriental_spec: 'Iɣdiren, seksew, tazart tebḥart',
    reg_tanger_spec: 'Fromage, atay, tazreft n Arrif',
    reg_laayoune_spec: 'Illas n lbaḥer, tazreft n Sṣaḥra',
    prod_argan: 'Zzit n argan (bio)',
    prod_safran: 'Zafaran n Taliwint',
    prod_miel: 'Tamment n zitar n udurar',
    prod_tapis: 'Azerbi Boucherouite (1 m²)',
    prod_poterie: 'Ifexaren n Asfi, 4 n imezgunen',
    prod_dattes: 'Tazart Mejhoul',
    prod_olive: 'Zzit n zzitun iɣan',
    prod_couscous: 'Seksew n ufus',
    prod_savon: 'Samu abeldi s ikawilusin',
    prod_ghassoul: 'Ghassoul n Mulwiyya',
    prod_broderie: 'Afrux n uzetta n Fas',
    prod_figues: 'Tazart tebḥart seg Tawrirt',
  }
};

function setLang(lang) {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.fr;
  // direction
  document.documentElement.lang = lang === 'ar' ? 'ar' : lang === 'amz' ? 'zgh' : 'fr';
  document.documentElement.dir  = lang === 'ar' ? 'rtl' : 'ltr';

  // translate all elements
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (t[key] !== undefined) el.textContent = t[key];
  });

  // active button in lang-bar
  ['fr','ar','amz'].forEach(l => {
    const b = document.getElementById('btn-' + l);
    if (b) b.classList.toggle('active', l === lang);
  });

  // store choice
  localStorage.setItem('coomes_lang', lang);
}

// Apply stored or detected language on load
(function () {
  const stored = localStorage.getItem('coomes_lang');
  if (stored && TRANSLATIONS[stored]) {
    setLang(stored);
  }
})();
