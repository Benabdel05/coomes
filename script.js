// COOMES — script partagé par toutes les pages du site.
// Chaque bloc vérifie la présence des éléments avant d'agir, afin qu'un même
// fichier puisse être inclus sur toutes les pages sans provoquer d'erreur.

// Menu burger (affichage mobile)
const burgerBtn = document.getElementById('burgerBtn');
const mobileMenu = document.getElementById('mobileMenu');
if (burgerBtn && mobileMenu) {
  burgerBtn.addEventListener('click', () => mobileMenu.classList.toggle('open'));
  mobileMenu.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', () => mobileMenu.classList.remove('open'))
  );
}

// Bascule de rôle « client / coopérative » (page creer-compte.html)
const roleClient = document.getElementById('roleClient');
const roleCoop = document.getElementById('roleCoop');
if (roleClient && roleCoop) {
  roleClient.addEventListener('click', () => {
    roleClient.classList.add('active');
    roleCoop.classList.remove('active');
  });
  roleCoop.addEventListener('click', () => {
    roleCoop.classList.add('active');
    roleClient.classList.remove('active');
  });
}

// Formulaire de création de compte — démonstration visuelle uniquement.
// Contrairement au formulaire de contact (relayé par FormSubmit vers une
// vraie boîte mail), la création de compte nécessiterait une base de
// données et n'a pas été demandée : ce bloc se contente d'afficher un
// message de confirmation, sans rien envoyer ni stocker.
const signupForm = document.getElementById('signupForm');
const signupSuccess = document.getElementById('signupSuccess');
if (signupForm) {
  signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (signupSuccess) signupSuccess.classList.add('show');
    signupForm.reset();
  });
}
