let currentPage = 1;
const pageSize = 20;
let userAnswers = {}; // Menyimpan pilihan jawaban pengguna

// fungsi untuk menaruh data secara random
function shuffle(array) {
  let currentIndex = array.length,
    temporaryValue,
    randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

// variable untuk menyimpan data
let cachedData = null;

// fungsi untuk mengambil data
async function getData() {
  if (!cachedData) {
    const response = await fetch("./soal.json");
    const data = await response.json();
    cachedData = shuffle(data);
  }
  return cachedData;
}

// fungsi untuk paginate
function paginate(array, page_size, page_number) {
  return array.slice((page_number - 1) * page_size, page_number * page_size);
}

// fungsi untuk klik tombol di map soal
function scrollToSoal(index) {
  const container = document.getElementById("soal-container");
  const soal = container.children[index % pageSize];
  if (soal) {
    soal.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

// fungsi untuk menampilkan data
async function displayPage(page_number, page_size) {
  const data = await getData();
  const totalPages = Math.ceil(data.length / page_size);
  const pageData = paginate(data, page_size, page_number);
  const container = document.getElementById("soal-container");
  container.innerHTML = "";

  pageData.forEach((item, index) => {
    const soalIndex = (page_number - 1) * page_size + index;
    const soal = document.createElement("div");
    soal.classList.add("pt-2", "pb-6", "border-b", "border-[#a5a19e41]");

    const pertanyaanDanNomor = document.createElement("div");
    pertanyaanDanNomor.classList.add("flex", "gap-0.5");

    const nomor = document.createElement("span");
    nomor.classList.add("ilm-hs-medium");
    nomor.innerText = soalIndex + 1 + ".";

    const pertanyaan = document.createElement("p");
    pertanyaan.classList.add("ilm-hs-medium");
    pertanyaan.innerText = item.question_text;

    pertanyaanDanNomor.appendChild(nomor);
    pertanyaanDanNomor.appendChild(pertanyaan);

    soal.appendChild(pertanyaanDanNomor);

    const opsiSoal = document.createElement("div");
    opsiSoal.classList.add(
      "rounded-md",
      "overflow-hidden",
      "flex",
      "mt-6",
      "flex-col",
      "gap-0.5"
    );
    soal.appendChild(opsiSoal);

    ['A', 'B', 'C', 'D'].forEach(letter => {
      const opsiSoalBtn = document.createElement("button");
      opsiSoalBtn.classList.add(
        "ilm-hs-medium",
        "group",
        "relative",
        "flex",
        "gap-0.5",
        "text-sm",
        "bg-[#1c1917]"
      );
      opsiSoalBtn.id = `option${letter}${soalIndex}`;
      opsiSoalBtn.innerHTML = `
        <span class="w-[75%] rounded-l-lg p-4 text-start group-hover:bg-ilm-orange">${item[`option_${letter.toLowerCase()}`]}</span>
        <span class="absolute right-0 top-0 my-auto h-full w-[25%] rounded-r-lg border-l-[3px] border-l-ilm-black py-3.5 flex items-center justify-center text-base group-hover:bg-ilm-orange">${letter}</span>`;
      opsiSoalBtn.addEventListener("click", () => handleOptionClick(opsiSoalBtn, soalIndex, letter));
      
      // Cek apakah opsi ini adalah jawaban yang dipilih pengguna
      if (userAnswers[soalIndex] === letter) {
        opsiSoalBtn.classList.add("bg-ilm-orange");
      }

      opsiSoal.appendChild(opsiSoalBtn);
    });

    container.appendChild(soal);
  });

  scrollToSoal(0);
  updateNavigationIcons(page_number, totalPages);
  mapNoSoal(page_size, page_number); // Panggil mapNoSoal untuk memperbarui tombol soal
  updatePagination(page_number, totalPages); // Panggil updatePagination di sini
}

async function handleOptionClick(button, soalIndex, selectedOption) {
  // Hapus kelas terpilih dari tombol opsi lain yang sebelumnya dipilih
  const opsiLain = button.parentElement.children;
  for (const opsi of opsiLain) {
    opsi.classList.remove("bg-ilm-orange");
  }

  // Tambahkan kelas terpilih ke tombol opsi yang diklik
  button.classList.add("bg-ilm-orange");

  // Simpan jawaban yang dipilih pengguna
  userAnswers[soalIndex] = selectedOption;

  // Tampilkan jawaban yang dipilih di peta nomor soal
  const mapButtons = document.querySelectorAll('#map-container button');
  const mapButton = mapButtons[soalIndex];
  mapButton.innerHTML = `${soalIndex + 1}. ${selectedOption}`;
  mapButton.classList.add("bg-ilm-orange");

 // Bergulir ke soal berikutnya
  const nextIndex = soalIndex + 1;
  const data = await getData();
  if (nextIndex < data.length) {
    const nextPage = Math.floor(nextIndex / pageSize) + 1;
    if (nextPage !== currentPage) {
      setCurrentPage(nextPage);
      setTimeout(() => {
        scrollToSoal(nextIndex % pageSize);
      }, 500); // Menambahkan sedikit jeda sebelum menggulir
    } else {
      scrollToSoal(nextIndex % pageSize);
    }
  }
}

// fungsi untuk update nomor pages
function updatePagination(currentPage, totalPages) {
  const paginationContainer = document.getElementById("pagination");
  paginationContainer.innerHTML = "";

  for (let i = 1; i <= totalPages; i++) {
    const pageButton = document.createElement("button");
    pageButton.innerText = i;
    pageButton.classList.add(
      "px-2",
      "mx-1",
      "rounded-md",
      "border",
      "border-[2.5px]",
      "border-transparent",
      "text-white"
    );

    if (i === currentPage) {
      pageButton.classList.add("bg-ilm-black", "border-ilm-orange");
    }

    pageButton.addEventListener("click", () => {
      setCurrentPage(i);
    });

    paginationContainer.appendChild(pageButton);
  }
}

// fungsi untuk mendapatkan current page
function setCurrentPage(page) {
  currentPage = page;
  displayPage(currentPage, pageSize);
}

// fungsi untuk menampilkan map dari API
async function mapNoSoal(page_size, page_number) {
  const data = await getData();
  const container = document.getElementById("map-container");
  container.innerHTML = "";
  data.forEach((item, index) => {
    const noSoal = document.createElement("button");
    noSoal.classList.add("border-none", "text-left", "w-12", "px-1","py-0.5", "rounded");

    // Tampilkan jawaban yang dipilih pengguna, jika ada
    const selectedOption = userAnswers[index];
    noSoal.innerHTML = selectedOption ? `${index + 1}. ${selectedOption}` : `${index + 1}.`;

    // Tambahkan kelas jika jawaban telah dipilih
    if (selectedOption) {
      noSoal.classList.add("bg-ilm-orange");
    }

    noSoal.addEventListener("click", async () => {
      const pageIndex = Math.floor(index / page_size) + 1;
      if (pageIndex !== currentPage) {
        currentPage = pageIndex;
        await displayPage(currentPage, page_size);
      }
      scrollToSoal(index);
      closeMapSoal();
    });
    container.appendChild(noSoal);
  });
}

// fungsi untuk load data dan klik tombol next dan prev
document.addEventListener("DOMContentLoaded", () => {
  setCurrentPage(currentPage);

  document.querySelector("#prev").addEventListener("click", () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  });

  document.querySelector("#next").addEventListener("click", async () => {
    const data = await getData();
    const maxPages = Math.ceil(data.length / pageSize);
    if (currentPage < maxPages) {
      setCurrentPage(currentPage + 1);
    }
  });
});
