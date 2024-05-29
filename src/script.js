const mapSoalButton = document
  .getElementById("map-button")
  .addEventListener("click", () => {
    document.getElementById("map-soal").classList.add("right-0");
    document.getElementById("map-soal").classList.add("left-0");
    document.getElementById("map-soal").classList.remove("-right-[100vw]");
  });

const mapSoal = document.addEventListener("click", (e) => {
  const mapSoal = document.getElementById("map-soal");
  const mapButton = document.getElementById("map-button");
  if (!mapSoal.contains(e.target) && !mapButton.contains(e.target)) {
    closeMapSoal();
  }
});

// fungsi untuk menutup map
function closeMapSoal() {
  const mapSoal = document.getElementById("map-soal");
  mapSoal.classList.add("-right-[100vw]");
  mapSoal.classList.remove("right-0");
  mapSoal.classList.remove("left-0");
}

// fungsi untuk mengubah tombol prev dan next
function updateNavigationIcons(currentPage, totalPages) {
  const prevButton = document.getElementById("prev");
  const nextButton = document.getElementById("next");
  if (currentPage === 1) {
    prevButton.innerHTML = "<i class='bx bx-left-arrow'></i>";
    nextButton.innerHTML = "<i class='bx bxs-right-arrow'></i>";
  } else if (currentPage === totalPages) {
    prevButton.innerHTML = "<i class='bx bxs-left-arrow'></i>";
    nextButton.innerHTML = "<i class='bx bx-right-arrow'></i>";
  } else {
    prevButton.innerHTML = "<i class='bx bxs-left-arrow'></i>";
    nextButton.innerHTML = "<i class='bx bxs-right-arrow'></i>";
  }
}
