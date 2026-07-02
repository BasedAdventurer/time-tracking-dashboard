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

    // Looping setiap kartu
    cards.forEach((card) => {
        // Baca judul kartu (Work, Play, Study, dll)
        const title = card.querySelector(".card-category").innerText;

        // Cari data json yang judulnya cocok dengan judul kartu di html
        const data = timeTrackingData.find((item) => item.title === title);

        if (data) {
            // Teks untuk waktu sebelumnya
            let previousTimeText = "";
            if(timeframe === "daily") previousTimeText = "Yesterday";
            if(timeframe === "weekly") previousTimeText = "Last Week";
            if(timeframe === "monthly") previousTimeText = "Last Month";

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

toggleBtns.forEach(btn => {
    btn.addEventListener("click", function() {
        // Hapus status 'active' di tombol lama, pindahkan ke tombol baru
        document.querySelector(".dashboard__toggle-btn.active")?.classList.remove("active");
        this.classList.add("active");

        // Baca teks tombol yang diklik (Daily/Weekly/Monthly) lalu ubah jadi huruf kecil semua
        const clickedTimeframe = this.innerText.toLowerCase();

        // Perintahkan kartu untuk update sesuai tombol yang ditekan
        updateCards(clickedTimeframe);
    });
});

// Jalankan pengambilan data pertama kali saat file dimuat
fetchData();