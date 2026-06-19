window.onload = function () {
  showSplash();

  setTimeout(() => {
    hideSplash();
    showPage("home");
  }, 2000);
};

/* ---------------- SPLASH SCREEN ---------------- */

function showSplash() {
  const splash = document.createElement("div");

  splash.id = "splash";
  splash.innerHTML = `
    <div style="
      position:fixed;
      top:0;left:0;
      width:100%;height:100%;
      background:#1f6f5b;
      color:white;
      display:flex;
      flex-direction:column;
      justify-content:center;
      align-items:center;
      z-index:9999;
      text-align:center;
    ">
      <img src="logo.png" style="width:120px;margin-bottom:20px;">
      <h1>ABIA ESS</h1>
      <p>Économie Sociale et Solidaire au service des coopératives</p>
    </div>
  `;

  document.body.appendChild(splash);
}

function hideSplash() {
  const splash = document.getElementById("splash");
  if (splash) splash.remove();
}

/* ---------------- NAVIGATION SPA ---------------- */

function showPage(pageId) {

  const pages = document.querySelectorAll(".page");

  pages.forEach(p => {
    p.style.display = "none";
  });

  const activePage = document.getElementById(pageId);
  if (activePage) {
    activePage.style.display = "block";
  }
}

/* ---------------- MENU CLICK ---------------- */

document.addEventListener("click", function (e) {

  if (e.target.dataset.page) {
    showPage(e.target.dataset.page);
  }

});
