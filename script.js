
const translations={
fr:{welcome:"ABIA ESS — Devenir Consom'Acteur au Maroc",content:"Contenu de la page ABIA ESS."},
ar:{welcome:"ABIA ESS — كن مستهلكاً فاعلاً بالمغرب",content:"محتوى منصة ABIA ESS."},
amz:{welcome:"ABIA ESS — ⴰⴽⴽ ⴰⵎⵙⴽⴰⵔ ⴰⵎⴰⵙⵙⴰⵏ ⴳ ⵍⵎⵖⵔⵉⴱ",content:"ⴰⴳⴱⵓⵔ ⵏ ABIA ESS."}
};
document.getElementById('languageSwitcher')?.addEventListener('change',e=>{
 const lang=e.target.value;
 document.documentElement.lang=lang;
 document.documentElement.dir=(lang==='ar')?'rtl':'ltr';
 document.querySelectorAll('[data-key]').forEach(el=>{
   const k=el.dataset.key;
   if(translations[lang][k]) el.textContent=translations[lang][k];
 });
});
