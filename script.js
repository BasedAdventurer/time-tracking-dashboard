// Variabel untuk menampung data
let timeTrackingData = [];

// 1. Fungsi untuk mengambil data json
async function fetchData() {
    try {
        const res = await fetch("./data.json");
        timeTrackingData = await res.json();

        updateCards('weekly');
    } catch (error) {
        console.error("Gagal mengambil data:", error);
    }
}

// 2. Fungsi untuk memperbarui angka di layar (Render)
function updateCards(timeframe) {
    // Ambil semua elemen kartu dari html
    const cards = document.querySelectorAll(".time-tracking-dashboard__card");

    // Membuat "dictionary" object diluar loop untuk timeframe
    const timeframeLabels = {
        daily: "Yesterday",
        weekly: "Last Week",
        monthly: "Last Month"
    };

    // Looping setiap kartu
    cards.forEach((card) => {
        // Baca judul kartu (Work, Play, Study, dll)
        const title = card.querySelector(".card-category").innerText;
        // Cari data json yang judulnya cocok dengan judul kartu di html
        const data = timeTrackingData.find((item) => item.title === title);

        if (data) {
            // Teks untuk waktu sebelumnya
            const previousTimeText = timeframeLabels[timeframe];

            // Ekstrak angka dari data json sesuai timeframe (daily/weekly/monthly)
            const currentHrs = data.timeframes[timeframe].current;
            const previousHrs = data.timeframes[timeframe].previous;

            // Suntikkan / timpa angka baru ke dalam elemen html
            card.querySelector(".time-current").innerText = `${currentHrs}hrs`;
            card.querySelector(".card__time p").innerHTML = `${previousTimeText} - <span class="time-previous">${previousHrs}hrs</span>`;   
        }
    });
}

// 3. Aksi ketika tombol diklik
const toggleBtns = document.querySelectorAll(".dashboard__toggle-btn");

// Definisikan function logic sekali diluar loop
function handleToggleClick(e) {
    // Hapus status 'active' di tombol lama
    document.querySelector(".dashboard__toggle-btn.active")?.classList.remove("active");

    // Tambahkan status 'active' ke tombol yang baru saja diklik
    e.currentTarget.classList.add("active");

    // Baca teks tombol yang diklik lalu ubah jadi huruf kecil semua
    const clickedTimeframe = e.currentTarget.innerText.toLowerCase();

    // Perintahkan kartu untuk update
    updateCards(clickedTimeframe);
}

// 4. Jalankan function ke setiap btn
toggleBtns.forEach(btn => {
    btn.addEventListener("click", handleToggleClick);
});

// Jalankan pengambilan data pertama kali saat file dimuat
fetchData();