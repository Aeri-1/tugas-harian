import ManajerTugas from './taskManager.js';

// Inisialisasi
const manajerTugas = new ManajerTugas();

// Ambil elemen DOM
const form = document.querySelector('#form-tugas');
const inputJudul = document.querySelector('#input-judul');
const inputKategori = document.querySelector('#input-kategori');
const inputTanggal = document.querySelector('#input-tanggal');
const tabelTugas = document.querySelector('#tabel-tugas');
const formEdit = document.querySelector('#form-edit');
const editJudul = document.querySelector('#edit-judul');
const editKategori = document.querySelector('#edit-kategori');
const editTanggal = document.querySelector('#edit-tanggal');
const editIndex = document.querySelector('#edit-index');
const errorContainer = document.querySelector('#error-container');

// Fungsi untuk menampilkan error
function tampilkanError(pesan) {
    errorContainer.textContent = pesan;
    errorContainer.style.display = 'block';
    setTimeout(() => {
        errorContainer.style.display = 'none';
    }, 5000);
}

// Saat halaman dibuka, tampilkan semua tugas
document.addEventListener('DOMContentLoaded', () => {
    try {
        tampilkanDaftarTugas(manajerTugas.filterTugas());
    } catch (error) {
        tampilkanError(`Gagal memuat tugas: ${error.message}`);
        console.error(error);
    }
});

// Tampilkan semua tugas ke tabel
function tampilkanDaftarTugas(daftar) {
    try {
        tabelTugas.innerHTML = '';

        if (!daftar || !Array.isArray(daftar)) {
            throw new Error('Daftar tugas tidak valid');
        }

        if (daftar.length === 0) {
            const barisKosong = document.createElement('tr');
            const kolomKosong = document.createElement('td');
            kolomKosong.colSpan = 6;
            kolomKosong.textContent = 'Tidak ada tugas yang tersedia';
            kolomKosong.style.textAlign = 'center';
            barisKosong.appendChild(kolomKosong);
            tabelTugas.appendChild(barisKosong);
            return;
        }

        daftar.forEach((tugas, index) => {
            if (!tugas || typeof tugas !== 'object') {
                throw new Error(`Data tugas pada indeks ${index} tidak valid`);
            }

            const baris = document.createElement('tr');

            // Kolom nomor
            const kolomNo = document.createElement('td');
            kolomNo.textContent = index + 1;
            baris.appendChild(kolomNo);

            // Kolom judul tugas
            const kolomJudul = document.createElement('td');
            kolomJudul.textContent = tugas.judul || 'Judul tidak tersedia';
            if (tugas.selesai) kolomJudul.classList.add('task-selesai');
            baris.appendChild(kolomJudul);

            // Kolom kategori
            const kolomKategori = document.createElement('td');
            kolomKategori.innerHTML = `<span class="badge ${tugas.prioritas ? 'prioritas' : 'biasa'}">${
                tugas.prioritas ? 'Prioritas' : 'Biasa'
            }</span>`;
            baris.appendChild(kolomKategori);

            // Kolom tanggal
            const kolomTanggal = document.createElement('td');
            kolomTanggal.textContent = tugas.tanggal || 'Tanpa tanggal';
            baris.appendChild(kolomTanggal);

            // Kolom status
            const kolomStatus = document.createElement('td');
            kolomStatus.innerHTML = `<span class="badge ${tugas.selesai ? 'selesai' : 'belum'}">${
                tugas.selesai ? 'Selesai' : 'Belum Selesai'
            }</span>`;
            baris.appendChild(kolomStatus);

            // Kolom aksi
            const kolomAksi = document.createElement('td');
            kolomAksi.classList.add('aksi');

            // Tombol Selesai
            const btnSelesai = document.createElement('button');
            btnSelesai.textContent = '✔ Selesai';
            btnSelesai.className = 'selesai';
            btnSelesai.addEventListener('click', () => {
                try {
                    manajerTugas.tandaiSelesai(tugas.judul);
                    tampilkanDaftarTugas(manajerTugas.filterTugas());
                } catch (error) {
                    tampilkanError(`Gagal menandai tugas: ${error.message}`);
                    console.error(error);
                }
            });

            // Tombol Hapus
            const btnHapus = document.createElement('button');
            btnHapus.textContent = '🗑 Hapus';
            btnHapus.className = 'hapus';
            btnHapus.addEventListener('click', () => {
                try {
                    manajerTugas.hapusTugas(tugas.judul);
                    tampilkanDaftarTugas(manajerTugas.filterTugas());
                } catch (error) {
                    tampilkanError(`Gagal menghapus tugas: ${error.message}`);
                    console.error(error);
                }
            });

            // Tombol Edit
            const btnEdit = document.createElement('button');
            btnEdit.textContent = '✏ Edit';
            btnEdit.className = 'edit';
            btnEdit.addEventListener('click', () => {
                try {
                    editIndex.value = index;
                    editJudul.value = tugas.judul || '';
                    editKategori.value = tugas.prioritas ? 'prioritas' : 'biasa';
                    editTanggal.value = tugas.tanggal || '';
                    formEdit.style.display = 'block';
                } catch (error) {
                    tampilkanError(`Gagal mempersiapkan form edit: ${error.message}`);
                    console.error(error);
                }
            });

            kolomAksi.appendChild(btnSelesai);
            kolomAksi.appendChild(btnHapus);
            kolomAksi.appendChild(btnEdit);
            baris.appendChild(kolomAksi);
            tabelTugas.appendChild(baris);
        });
    } catch (error) {
        tampilkanError(`Gagal menampilkan daftar tugas: ${error.message}`);
        console.error(error);
    }
}

// Event saat form ditambahkan
form.addEventListener('submit', (e) => {
    e.preventDefault();
    try {
        const judul = inputJudul.value.trim();
        const kategori = inputKategori.value;
        const tanggal = inputTanggal.value;

        if (!judul) {
            throw new Error('Judul tidak boleh kosong');
        }
        if (!kategori) {
            throw new Error('Kategori tidak boleh kosong');
        }
        else if (kategori !== 'prioritas' && kategori !== 'biasa') {
            throw new Error('Kategori harus "prioritas" atau "biasa"');
            }
        if (!tanggal) {
            throw new Error('Tanggal harus diisi');
        }

        manajerTugas.tambahTugas(judul, kategori === 'prioritas', tanggal);
        tampilkanDaftarTugas(manajerTugas.filterTugas());
        form.reset();
    } catch (error) {
        tampilkanError(`Gagal menambahkan tugas: ${error.message}`);
        console.error(error);
    }
});

// Event saat form edit dikirim
formEdit.addEventListener('submit', (e) => {
    e.preventDefault();
    try {
        const judulBaru = editJudul.value.trim();
        const kategoriBaru = editKategori.value;
        const tanggalBaru = editTanggal.value;
        const index = editIndex.value;

        if (!judulBaru) {
            throw new Error('Judul tidak boleh kosong');
        }
        if (!kategoriBaru) {
            throw new Error('Kategori harus dipilih');
        }
        if (!tanggalBaru) {
            throw new Error('Tanggal harus diisi');
        }

        const tugas = manajerTugas.filterTugas()[index];
        if (!tugas) {
            throw new Error('Tugas tidak ditemukan');
        }

        manajerTugas.editTugas(tugas.judul, judulBaru, kategoriBaru === 'prioritas', tanggalBaru);
        tampilkanDaftarTugas(manajerTugas.filterTugas());
        formEdit.reset();
        formEdit.style.display = 'none';
    } catch (error) {
        tampilkanError(`Gagal mengedit tugas: ${error.message}`);
        console.error(error);
    }
});
